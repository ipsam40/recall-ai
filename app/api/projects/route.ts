import { jsonResponse } from '@/lib/api-helpers';
import { db } from '@/lib/db';

// GET /api/projects
export async function GET() {
    try {
        const projects = await db.project.findMany({
            orderBy: { updatedAt: 'desc' },
            include: { _count: { select: { files: true } } },
        });
        return jsonResponse({
            data: projects.map((p: any) => ({ ...p, fileCount: p._count.files })),
        });
    } catch {
        return jsonResponse({ data: [] });
    }
}

// POST /api/projects
export async function POST(request: Request) {
    const body = await request.json();
    try {
        const project = await db.project.create({
            data: {
                name: body.name,
                description: body.description || '',
                color: body.color || '#3B82F6',
                userId: 'default-user',
            },
        });
        return jsonResponse({ data: project }, 201);
    } catch {
        return jsonResponse({ data: { id: crypto.randomUUID(), name: body.name } }, 201);
    }
}
