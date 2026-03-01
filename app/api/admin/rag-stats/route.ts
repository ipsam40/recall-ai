import { jsonResponse } from '@/lib/api-helpers';

export async function GET() {
    return jsonResponse({ data: { total_documents: 1250, total_chunks: 15400, index_size_mb: 342, last_reindex: new Date().toISOString() } });
}
