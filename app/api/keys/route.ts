import { jsonResponse } from '@/lib/api-helpers';

export async function GET() {
    return jsonResponse({
        data: [
            { id: '1', name: 'Production Key', prefix: 'sk-recall-****-7f3d', created_at: '2025-12-01', last_used: new Date().toISOString() },
            { id: '2', name: 'Development Key', prefix: 'sk-recall-****-a1b2', created_at: '2026-01-15', last_used: new Date().toISOString() },
        ],
    });
}

export async function POST(request: Request) {
    const body = await request.json();
    return jsonResponse({
        data: { id: crypto.randomUUID(), name: body.name, key: `sk-recall-${crypto.randomUUID()}`, created_at: new Date().toISOString() },
    }, 201);
}
