import { jsonResponse } from '@/lib/api-helpers';

export async function POST(request: Request) {
    const body = await request.json();
    return jsonResponse({ data: { name: body.name, action: body.action, result: `File ${body.name || 'unknown'} uploaded`, size: 0 } }, 201);
}
