import { jsonResponse } from '@/lib/api-helpers';

export async function GET() {
    return jsonResponse({
        data: [
            { id: '1', name: 'Ashutosh', email: 'ashutosh@recall.ai', role: 'admin', status: 'active', last_seen: new Date().toISOString() },
            { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', role: 'user', status: 'active', last_seen: new Date().toISOString() },
        ],
    });
}

export async function PATCH(request: Request) {
    const body = await request.json();
    return jsonResponse({ data: { id: body.id, role: body.role, updated: true } });
}
