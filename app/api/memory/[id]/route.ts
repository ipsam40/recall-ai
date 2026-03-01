import { jsonResponse } from '@/lib/api-helpers';
import { db } from '@/lib/db';

// PATCH /api/memory/:id
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    try {
        const mem = await db.memory.update({ where: { id }, data: { key: body.key, value: body.value, category: body.category } });
        return jsonResponse({ data: mem });
    } catch {
        return jsonResponse({ data: { id, ...body } });
    }
}

// DELETE /api/memory/:id
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try { await db.memory.delete({ where: { id } }); } catch { /* ok */ }
    return jsonResponse({ data: { deleted: true } });
}
