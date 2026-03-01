import { jsonResponse, errorResponse } from '@/lib/api-helpers';
import { db } from '@/lib/db';

// GET /api/conversations — List conversations
export async function GET() {
    try {
        const conversations = await db.conversation.findMany({
            orderBy: { updatedAt: 'desc' },
            include: { _count: { select: { messages: true } } },
            take: 50,
        });

        return jsonResponse({
            data: conversations.map((c: any) => ({
                id: c.id,
                title: c.title,
                model: c.model,
                pinned: c.pinned,
                message_count: c._count.messages,
                created_at: c.createdAt,
                updated_at: c.updatedAt,
            })),
        });
    } catch {
        return jsonResponse({ data: [] });
    }
}

// POST /api/conversations — Create conversation
export async function POST(request: Request) {
    const body = await request.json();
    try {
        const conv = await db.conversation.create({
            data: {
                title: body.title || 'New conversation',
                model: body.model || 'sonnet-4.6',
                userId: 'default-user',
            },
        });
        return jsonResponse({ data: conv }, 201);
    } catch {
        return jsonResponse({
            data: { id: crypto.randomUUID(), title: body.title || 'New conversation', model: body.model || 'sonnet-4.6' },
        }, 201);
    }
}
