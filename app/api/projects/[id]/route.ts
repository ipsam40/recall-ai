import { jsonResponse } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const project = await db.project.findUnique({ where: { id }, include: { files: true } });
        if (!project) return jsonResponse({ error: 'Not found' }, 404);
        return jsonResponse({ data: project });
    } catch {
        return jsonResponse({ data: { id } });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    try {
        const project = await db.project.update({ where: { id }, data: body });
        return jsonResponse({ data: project });
    } catch {
        return jsonResponse({ data: { id, ...body } });
    }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try { await db.project.delete({ where: { id } }); } catch { }
    return jsonResponse({ data: { deleted: true } });
}
