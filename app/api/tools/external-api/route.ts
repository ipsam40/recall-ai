import { jsonResponse } from '@/lib/api-helpers';
import { callExternalApi } from '@/lib/tools';

// POST /api/tools/external-api
export async function POST(request: Request) {
    const body = await request.json();
    if (!body.endpoint) return jsonResponse({ error: 'endpoint is required' }, 400);
    const result = await callExternalApi(body.endpoint, body.method, body.body, body.headers);
    return jsonResponse({ data: { tool: 'external-api', ...result } });
}
