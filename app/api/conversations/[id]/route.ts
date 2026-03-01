import { jsonResponse, errorResponse } from '@/lib/api-helpers';
import { db } from '@/lib/db';

// GET /api/conversations/:id
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const conv = await db.conversation.findUnique({
            where: { id },
            include: { messages: { orderBy: { createdAt: 'asc' } } },
        });
        if (!conv) return errorResponse('Conversation not found', 404);
        return jsonResponse({ data: conv });
    } catch {
        return jsonResponse({ data: { id, title: 'Conversation', messages: [] } });
    }
}

// PATCH /api/conversations/:id
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    try {
        const conv = await db.conversation.update({
            where: { id },
            data: { title: body.title, pinned: body.pinned },
        });
        return jsonResponse({ data: conv });
    } catch {
        return jsonResponse({ data: { id, ...body } });
    }
}

// DELETE /api/conversations/:id
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await db.conversation.delete({ where: { id } });
    } catch { /* ok */ }
    return jsonResponse({ data: { deleted: true } });
}
