import { jsonResponse } from '@/lib/api-helpers';
import { searchChunks, rerankResults } from '@/lib/rag';

// POST /api/rag/rerank
export async function POST(request: Request) {
    const body = await request.json();
    const results = await searchChunks(body.query || '', 20);
    const reranked = await rerankResults(body.query || '', results, body.top_k || 5);
    return jsonResponse({ data: { query: body.query, results: reranked, total: reranked.length } });
}
