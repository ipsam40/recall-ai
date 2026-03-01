import { jsonResponse } from '@/lib/api-helpers';
import { browserFetch } from '@/lib/tools';

// POST /api/tools/browser — Real web browsing
export async function POST(request: Request) {
    const body = await request.json();
    if (!body.url) return jsonResponse({ error: 'url is required' }, 400);
    const result = await browserFetch(body.url);
    return jsonResponse({ data: { tool: 'browser', ...result } });
}
