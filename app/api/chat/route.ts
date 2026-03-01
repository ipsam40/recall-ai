import { streamChat } from '@/lib/claude';
import { db } from '@/lib/db';

// POST /api/chat — Streaming chat with real Claude API
export async function POST(request: Request) {
    const body = await request.json();
    const {
        conversation_id,
        messages = [],
        model = 'sonnet-4.6',
        stream = true,
        tools_enabled = true,
        thinking_enabled = false,
        system_prompt,
    } = body;

    // Upsert conversation
    let convId = conversation_id;
    if (!convId) {
        try {
            const conv = await db.conversation.create({
                data: {
                    title: messages[0]?.content?.slice(0, 60) || 'New conversation',
                    model,
                    userId: 'default-user',
                },
            });
            convId = conv.id;
        } catch {
            convId = crypto.randomUUID();
        }
    }

    // Save user message
    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg?.role === 'user') {
        try {
            await db.message.create({
                data: {
                    conversationId: convId,
                    userId: 'default-user',
                    role: 'USER',
                    content: lastUserMsg.content,
                    model,
                },
            });
        } catch { /* DB may not be connected */ }
    }

    if (stream) {
        const encoder = new TextEncoder();
        let fullResponse = '';

        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of streamChat({
                        messages,
                        model: model as 'opus-4.6' | 'sonnet-4.6' | 'haiku-4.5',
                        systemPrompt: system_prompt,
                        thinkingEnabled: thinking_enabled,
                        toolsEnabled: tools_enabled,
                    })) {
                        fullResponse += chunk;
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify({ type: 'text', text: chunk })}\n\n`),
                        );
                    }

                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done', conversation_id: convId })}\n\n`));
                    controller.close();

                    // Save assistant response
                    try {
                        await db.message.create({
                            data: {
                                conversationId: convId,
                                role: 'ASSISTANT',
                                content: fullResponse,
                                model,
                                thinkingUsed: thinking_enabled,
                            },
                        });
                    } catch { /* DB may not be connected */ }
                } catch (error) {
                    const msg = error instanceof Error ? error.message : 'Unknown error';
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: msg })}\n\n`));
                    controller.close();
                }
            },
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    }

    // Non-streaming response
    const { chat } = await import('@/lib/claude');
    const response = await chat({ messages, model: model as 'opus-4.6' | 'sonnet-4.6' | 'haiku-4.5', systemPrompt: system_prompt });

    try {
        await db.message.create({
            data: {
                conversationId: convId,
                role: 'ASSISTANT',
                content: response.content,
                model,
                inputTokens: response.inputTokens,
                outputTokens: response.outputTokens,
            },
        });
    } catch { /* DB may not be connected */ }

    return Response.json({
        success: true,
        timestamp: new Date().toISOString(),
        data: {
            id: crypto.randomUUID(),
            conversation_id: convId,
            model: response.model,
            content: response.content,
            usage: { input_tokens: response.inputTokens, output_tokens: response.outputTokens },
        },
    });
}
