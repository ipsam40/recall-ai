import { jsonResponse } from '@/lib/api-helpers';
import { chat } from '@/lib/claude';

// POST /api/code/debug
export async function POST(request: Request) {
    const body = await request.json();
    const response = await chat({
        messages: [{ role: 'user', content: `Debug this code. Find bugs, issues, and suggest fixes:\n\n\`\`\`\n${body.code}\n\`\`\`\n\nError message: ${body.error || 'No error provided'}` }],
        model: body.model || 'sonnet-4.6',
        systemPrompt: 'You are a debugging expert. List issues found with severity and provide specific fixes.',
    });
    return jsonResponse({ data: { action: 'debug', result: response.content, model: response.model } });
}
