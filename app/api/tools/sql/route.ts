import { jsonResponse } from '@/lib/api-helpers';
import { executeSql } from '@/lib/tools';

// POST /api/tools/sql
export async function POST(request: Request) {
    const body = await request.json();
    if (!body.query) return jsonResponse({ error: 'query is required' }, 400);
    const result = await executeSql(body.query);
    return jsonResponse({ data: { tool: 'sql', ...result } });
}
