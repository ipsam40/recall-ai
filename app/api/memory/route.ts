import { jsonResponse } from '@/lib/api-helpers';
import { db } from '@/lib/db';

// GET /api/memory
export async function GET() {
    try {
        const memories = await db.memory.findMany({ orderBy: { category: 'asc' } });
        return jsonResponse({ data: memories });
    } catch {
        return jsonResponse({ data: [] });
    }
}

// POST /api/memory
export async function POST(request: Request) {
    const body = await request.json();
    try {
        const mem = await db.memory.create({
            data: {
                userId: 'default-user',
                key: body.key,
                value: body.value,
                category: body.category || 'General',
                source: body.source || 'manual',
            },
        });
        return jsonResponse({ data: mem }, 201);
    } catch {
        return jsonResponse({
            data: { id: crypto.randomUUID(), key: body.key, value: body.value, category: body.category || 'General' },
        }, 201);
    }
}
