import { jsonResponse } from '@/lib/api-helpers';

export async function POST(request: Request) {
    const body = await request.json();
    return jsonResponse({ data: { source: 'intercom', event: body.topic, processed: true } });
}
