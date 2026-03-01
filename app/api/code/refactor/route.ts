import { jsonResponse } from '@/lib/api-helpers';
import { chat } from '@/lib/claude';

// POST /api/code/refactor
export async function POST(request: Request) {
    const body = await request.json();
    const response = await chat({
        messages: [{ role: 'user', content: `Refactor this code for better quality, readability, and performance:\n\n\`\`\`\n${body.code}\n\`\`\`` }],
        model: body.model || 'sonnet-4.6',
        systemPrompt: 'You are a code refactoring expert. Return only the refactored code with brief comments explaining changes.',
    });
    return jsonResponse({ data: { action: 'refactor', result: response.content, model: response.model } });
}
