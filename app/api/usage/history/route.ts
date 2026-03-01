import { jsonResponse } from '@/lib/api-helpers';

export async function GET() {
    return jsonResponse({ data: { history: [{ date: '2026-02-28', tokens: 1100000 }, { date: '2026-02-27', tokens: 980000 }] } });
}
