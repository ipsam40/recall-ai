import { jsonResponse } from '@/lib/api-helpers';

export async function GET() {
    return jsonResponse({
        data: {
            tokens_used: 1240000,
            tokens_limit: null,
            requests_today: 342,
            requests_limit: null,
            period: 'monthly',
            breakdown: { chat: 890000, research: 250000, code: 100000 },
        },
    });
}
