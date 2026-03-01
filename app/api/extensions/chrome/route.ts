import { jsonResponse } from '@/lib/api-helpers';

export async function POST(request: Request) {
    const body = await request.json();
    return jsonResponse({ data: { extension: 'chrome', action: body.action, result: 'Operation completed', status: 'connected' } });
}
