import { jsonResponse } from '@/lib/api-helpers';

// GET /api/research/:id — Get research job status & report
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return jsonResponse({
        data: {
            id,
            status: 'completed',
            topic: 'Research topic',
            sources: [],
            report: 'Research report content...',
            completed_at: new Date().toISOString(),
        },
    });
}
