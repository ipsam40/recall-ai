import { jsonResponse } from '@/lib/api-helpers';

export async function POST(request: Request) {
    const body = await request.json();
    return jsonResponse({ data: { source: 'sanity', event: body.event, processed: true } });
}
