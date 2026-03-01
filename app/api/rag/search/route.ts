import { jsonResponse } from '@/lib/api-helpers';
import { searchChunks } from '@/lib/rag';

// POST /api/rag/search
export async function POST(request: Request) {
    const body = await request.json();
    const results = await searchChunks(body.query || '', body.top_k || 10);
    return jsonResponse({
        data: { query: body.query, results, total: results.length },
    });
}
