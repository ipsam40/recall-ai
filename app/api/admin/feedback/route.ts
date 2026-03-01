import { jsonResponse } from '@/lib/api-helpers';

export async function GET() {
    return jsonResponse({ data: { positive: 1240, negative: 86, neutral: 320, satisfaction_rate: 0.94 } });
}
