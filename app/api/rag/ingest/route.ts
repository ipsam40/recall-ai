import { jsonResponse } from '@/lib/api-helpers';
import { ingestDocument } from '@/lib/rag';

// POST /api/rag/ingest
export async function POST(request: Request) {
    const body = await request.json();
    const { title, source, content, documents } = body;

    // Support both single doc and batch
    if (documents && Array.isArray(documents)) {
        const results = [];
        for (const doc of documents) {
            const result = await ingestDocument({
                title: doc.title || 'Untitled',
                source: doc.source || 'upload',
                content: doc.content || '',
                mimeType: doc.mimeType,
                metadata: doc.metadata,
            });
            results.push(result);
        }
        return jsonResponse({ data: { jobs: results, total: results.length } }, 201);
    }

    const result = await ingestDocument({
        title: title || 'Untitled',
        source: source || 'upload',
        content: content || '',
    });

    return jsonResponse({ data: result }, 201);
}
