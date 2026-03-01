import { jsonResponse } from '@/lib/api-helpers';
import { vectorSearch } from '@/lib/tools';

// POST /api/tools/vector-search
export async function POST(request: Request) {
    const body = await request.json();
    const result = await vectorSearch(body.query || '', body.index, body.top_k);
    return jsonResponse({ data: { tool: 'vector-search', ...result } });
}
