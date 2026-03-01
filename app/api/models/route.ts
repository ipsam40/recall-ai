import { jsonResponse } from '@/lib/api-helpers';

// GET /api/models — List available models
export async function GET() {
    return jsonResponse({
        data: [
            { id: 'opus-4.6', name: 'Opus 4.6', description: 'Most capable for ambitious work', max_tokens: 128000, supports_thinking: true, supports_tools: true },
            { id: 'sonnet-4.6', name: 'Sonnet 4.6', description: 'Most efficient for everyday tasks', max_tokens: 64000, supports_thinking: true, supports_tools: true },
            { id: 'haiku-4.5', name: 'Haiku 4.5', description: 'Fastest for quick answers', max_tokens: 32000, supports_thinking: false, supports_tools: true },
        ],
    });
}

// POST /api/models/select — Select default model
export async function POST(request: Request) {
    const { model_id } = await request.json();
    return jsonResponse({ data: { selected_model: model_id, updated: true } });
}
