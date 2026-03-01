import { jsonResponse } from '@/lib/api-helpers';
import { chat } from '@/lib/claude';

// POST /api/code/generate
export async function POST(request: Request) {
    const body = await request.json();
    const response = await chat({
        messages: [{ role: 'user', content: `Generate ${body.language || 'python'} code for: ${body.prompt || body.description || 'Hello World'}` }],
        model: body.model || 'sonnet-4.6',
        systemPrompt: 'You are a code generation expert. Return only clean, production-quality code with comments.',
    });
    return jsonResponse({ data: { action: 'generate', language: body.language || 'python', result: response.content, model: response.model } });
}
