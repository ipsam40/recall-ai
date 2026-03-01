import { jsonResponse } from '@/lib/api-helpers';
import { db } from '@/lib/db';

// GET /api/messages?conversation_id=...
export async function GET(request: Request) {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversation_id');

    if (!conversationId) return jsonResponse({ data: [] });

    try {
        const messages = await db.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });
        return jsonResponse({ data: messages });
    } catch {
        return jsonResponse({ data: [] });
    }
}

// POST /api/messages
export async function POST(request: Request) {
    const body = await request.json();
    try {
        const msg = await db.message.create({
            data: {
                conversationId: body.conversation_id,
                userId: body.user_id || 'default-user',
                role: 'USER',
                content: body.content,
            },
        });
        return jsonResponse({ data: msg }, 201);
    } catch {
        return jsonResponse({
            data: { id: crypto.randomUUID(), content: body.content, role: 'USER', created_at: new Date() },
        }, 201);
    }
}
