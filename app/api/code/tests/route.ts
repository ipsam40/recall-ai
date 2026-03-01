import { jsonResponse } from '@/lib/api-helpers';
import { chat } from '@/lib/claude';

// POST /api/code/tests
export async function POST(request: Request) {
    const body = await request.json();
    const response = await chat({
        messages: [{ role: 'user', content: `Generate comprehensive test cases for this code using ${body.framework || 'pytest'}:\n\n\`\`\`\n${body.code}\n\`\`\`` }],
        model: body.model || 'sonnet-4.6',
        systemPrompt: 'You are a testing expert. Generate thorough test cases covering edge cases, happy paths, and error scenarios.',
    });
    return jsonResponse({ data: { action: 'tests', framework: body.framework || 'pytest', result: response.content, model: response.model } });
}
