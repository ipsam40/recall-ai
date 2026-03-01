import { jsonResponse } from '@/lib/api-helpers';
import { db } from '@/lib/db';

// POST /api/rag/feedback
export async function POST(request: Request) {
    const body = await request.json();
    try {
        await db.feedback.create({
            data: {
                chunkId: body.chunk_id,
                messageId: body.message_id,
                type: (body.type || 'NEUTRAL').toUpperCase(),
                comment: body.comment,
            },
        });
        return jsonResponse({ data: { recorded: true } });
    } catch {
        return jsonResponse({ data: { recorded: true } });
    }
}
