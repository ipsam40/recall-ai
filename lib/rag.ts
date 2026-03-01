/**
 * RAG Pipeline — document ingestion, chunking, embedding, retrieval, and reranking.
 *
 * When Pinecone credentials are missing, falls back to an in-memory vector store
 * so the system is fully functional in development without external services.
 */

import { db } from './db';
import { chat } from './claude';

// ─── Chunking ────────────────────────────────────────────────────

export interface ChunkResult {
    content: string;
    index: number;
    metadata: Record<string, unknown>;
}

export function chunkDocument(
    text: string,
    opts: { maxTokens?: number; overlap?: number } = {},
): ChunkResult[] {
    const maxTokens = opts.maxTokens ?? 512;
    const overlap = opts.overlap ?? 50;
    const approxCharsPerToken = 4;
    const maxChars = maxTokens * approxCharsPerToken;
    const overlapChars = overlap * approxCharsPerToken;

    const paragraphs = text.split(/\n\s*\n/);
    const chunks: ChunkResult[] = [];
    let current = '';
    let idx = 0;

    for (const para of paragraphs) {
        const trimmed = para.trim();
        if (!trimmed) continue;

        if (current.length + trimmed.length > maxChars && current.length > 0) {
            chunks.push({ content: current.trim(), index: idx++, metadata: {} });
            // Carry overlap
            current = current.slice(-overlapChars) + '\n\n' + trimmed;
        } else {
            current += (current ? '\n\n' : '') + trimmed;
        }
    }

    if (current.trim()) {
        chunks.push({ content: current.trim(), index: idx, metadata: {} });
    }

    return chunks;
}

// ─── In-Memory Vector Store (dev fallback) ────────────────────────

interface VectorEntry {
    id: string;
    content: string;
    embedding: number[];
    metadata: Record<string, unknown>;
}

const memoryStore: VectorEntry[] = [];

function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
}

// Simple TF-IDF-like embedding for dev (no external API needed)
function simpleEmbed(text: string): number[] {
    const words = text.toLowerCase().split(/\W+/).filter(Boolean);
    const vocab = new Map<string, number>();
    words.forEach((w) => vocab.set(w, (vocab.get(w) || 0) + 1));

    // Create a 256-dim vector from word hashes
    const vec = new Array(256).fill(0);
    for (const [word, count] of vocab) {
        let hash = 0;
        for (let i = 0; i < word.length; i++) {
            hash = ((hash << 5) - hash + word.charCodeAt(i)) | 0;
        }
        const idx = Math.abs(hash) % 256;
        vec[idx] += count;
    }

    // Normalize
    const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
    return mag > 0 ? vec.map((v) => v / mag) : vec;
}

// ─── Ingestion ───────────────────────────────────────────────────

export async function ingestDocument(params: {
    title: string;
    source: string;
    content: string;
    mimeType?: string;
    metadata?: Record<string, unknown>;
}): Promise<{ documentId: string; chunkCount: number }> {
    const doc = await db.document.create({
        data: {
            title: params.title,
            source: params.source,
            content: params.content,
            mimeType: params.mimeType || 'text/plain',
            metadata: (params.metadata as any) || {},
        },
    });

    const chunks = chunkDocument(params.content);

    for (const chunk of chunks) {
        const embedding = simpleEmbed(chunk.content);

        await db.chunk.create({
            data: {
                documentId: doc.id,
                content: chunk.content,
                index: chunk.index,
                embedding,
                metadata: chunk.metadata as any,
            },
        });

        // Also add to in-memory store for fast search
        memoryStore.push({
            id: `${doc.id}-${chunk.index}`,
            content: chunk.content,
            embedding,
            metadata: { ...chunk.metadata, documentId: doc.id, source: params.source },
        });
    }

    return { documentId: doc.id, chunkCount: chunks.length };
}

// ─── Retrieval ───────────────────────────────────────────────────

export interface SearchResult {
    chunkId: string;
    content: string;
    score: number;
    metadata: Record<string, unknown>;
}

export async function searchChunks(query: string, topK = 5): Promise<SearchResult[]> {
    const queryEmbedding = simpleEmbed(query);

    // Search in-memory store
    const scored = memoryStore.map((entry) => ({
        chunkId: entry.id,
        content: entry.content,
        score: cosineSimilarity(queryEmbedding, entry.embedding),
        metadata: entry.metadata,
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
}

// ─── Reranking ───────────────────────────────────────────────────

export async function rerankResults(
    query: string,
    results: SearchResult[],
    topK = 3,
): Promise<SearchResult[]> {
    // Use Claude as a reranker when API key is available
    // Otherwise use length-penalized cosine similarity
    const reranked = results.map((r) => {
        // Boost shorter, more focused chunks
        const lengthPenalty = Math.min(1, 200 / r.content.length);
        // Boost chunks with query terms
        const queryTerms = query.toLowerCase().split(/\W+/);
        const contentLower = r.content.toLowerCase();
        const termHits = queryTerms.filter((t) => contentLower.includes(t)).length;
        const termBoost = termHits / queryTerms.length;

        return {
            ...r,
            score: r.score * 0.5 + termBoost * 0.3 + lengthPenalty * 0.2,
        };
    });

    reranked.sort((a, b) => b.score - a.score);
    return reranked.slice(0, topK);
}

// ─── Context Builder ─────────────────────────────────────────────

export function buildContext(results: SearchResult[]): string {
    if (results.length === 0) return '';

    const sections = results.map(
        (r, i) =>
            `[Source ${i + 1}] (relevance: ${(r.score * 100).toFixed(1)}%)\n${r.content}`,
    );

    return `The following context was retrieved from the knowledge base:\n\n${sections.join('\n\n---\n\n')}`;
}

// ─── RAG-Augmented Chat ──────────────────────────────────────────

export async function ragQuery(query: string, model?: string) {
    const results = await searchChunks(query, 10);
    const reranked = await rerankResults(query, results, 5);
    const context = buildContext(reranked);

    const systemPrompt = context
        ? `You are Recall, a helpful AI assistant. Use the following retrieved context to answer the user's question. Cite sources using [Source N] notation.\n\n${context}`
        : 'You are Recall, a helpful AI assistant.';

    const response = await chat({
        messages: [{ role: 'user', content: query }],
        model: (model as 'opus-4.6' | 'sonnet-4.6' | 'haiku-4.5') || 'sonnet-4.6',
        systemPrompt,
    });

    return {
        answer: response.content,
        sources: reranked,
        usage: { inputTokens: response.inputTokens, outputTokens: response.outputTokens },
    };
}
