import { jsonResponse } from '@/lib/api-helpers';

export async function GET() {
    return jsonResponse({ data: { input_tokens: 620000, output_tokens: 620000, total: 1240000, model_breakdown: { 'sonnet-4.6': 800000, 'opus-4.6': 440000 } } });
}
