import { jsonResponse } from '@/lib/api-helpers';

export async function POST() {
    return jsonResponse({ data: { status: 'reindex_triggered', estimated_time: '5 minutes' } });
}
