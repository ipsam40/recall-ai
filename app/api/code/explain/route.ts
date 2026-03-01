import { jsonResponse } from '@/lib/api-helpers';
import { chat } from '@/lib/claude';

// POST /api/code/explain
export async function POST(request: Request) {
    const body = await request.json();
    const { code, model } = body;

    const response = await chat({
        messages: [{ role: 'user', content: `Explain this code in detail:\n\n\`\`\`\n${code}\n\`\`\`` }],
        model: model || 'sonnet-4.6',
        systemPrompt: 'You are a code explanation expert. Provide clear, concise explanations.',
    });

    return jsonResponse({ data: { action: 'explain', result: response.content, model: response.model, usage: { input_tokens: response.inputTokens, output_tokens: response.outputTokens } } });
}
