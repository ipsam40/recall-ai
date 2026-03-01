import { jsonResponse } from '@/lib/api-helpers';
import { ragQuery } from '@/lib/rag';

// POST /api/rag/query
export async function POST(request: Request) {
    const body = await request.json();
    const { query, model } = body;

    if (!query) return jsonResponse({ error: 'query is required' }, 400);

    const result = await ragQuery(query, model);

    return jsonResponse({
        data: {
            query,
            answer: result.answer,
            sources: result.sources.map((s) => ({
                chunk_id: s.chunkId,
                content: s.content,
                score: s.score,
                metadata: s.metadata,
            })),
            usage: result.usage,
        },
    });
}
