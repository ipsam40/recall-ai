import { jsonResponse } from '@/lib/api-helpers';

// POST /api/research/run — Start a research job
export async function POST(request: Request) {
    const body = await request.json();
    return jsonResponse({
        data: {
            id: crypto.randomUUID(),
            topic: body.topic,
            depth: body.depth || 'deep',
            status: 'running',
            sources_found: 0,
            started_at: new Date().toISOString(),
        },
    }, 201);
}
