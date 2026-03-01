import Anthropic from '@anthropic-ai/sdk';
import { env } from './env';

// ─── Claude Client Singleton ─────────────────────────────────────

let _client: Anthropic | null = null;

function getClient(): Anthropic {
    if (!_client) {
        _client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY || 'dummy-key' });
    }
    return _client;
}

// ─── Model Definitions ──────────────────────────────────────────

export const MODELS = {
    'opus-4.6': { id: 'claude-sonnet-4-20250514', name: 'Opus 4.6', maxTokens: 128000, thinking: true, tools: true },
    'sonnet-4.6': { id: 'claude-sonnet-4-20250514', name: 'Sonnet 4.6', maxTokens: 64000, thinking: true, tools: true },
    'haiku-4.5': { id: 'claude-haiku-4-20250414', name: 'Haiku 4.5', maxTokens: 32000, thinking: false, tools: true },
} as const;

export type ModelId = keyof typeof MODELS;

// ─── Streaming Chat ──────────────────────────────────────────────

export interface ChatOptions {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    model?: ModelId;
    systemPrompt?: string;
    maxTokens?: number;
    thinkingEnabled?: boolean;
    toolsEnabled?: boolean;
}

export async function* streamChat(options: ChatOptions): AsyncGenerator<string> {
    const {
        messages,
        model = 'sonnet-4.6',
        systemPrompt,
        maxTokens = 4096,
        thinkingEnabled = false,
    } = options;

    const modelConfig = MODELS[model] || MODELS['sonnet-4.6'];
    const client = getClient();

    // If no API key, return a demo response
    if (!env.ANTHROPIC_API_KEY) {
        const demoResponse = `This is a demo response from Recall using ${modelConfig.name}. To enable real AI responses, add your ANTHROPIC_API_KEY to .env.local.\n\nYour message: "${messages[messages.length - 1]?.content || ''}"`;
        for (const word of demoResponse.split(' ')) {
            yield word + ' ';
            await new Promise((r) => setTimeout(r, 30));
        }
        return;
    }

    try {
        const stream = client.messages.stream({
            model: modelConfig.id,
            max_tokens: maxTokens,
            system: systemPrompt || 'You are Recall, a helpful AI assistant.',
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            ...(thinkingEnabled && modelConfig.thinking
                ? { thinking: { type: 'enabled' as const, budget_tokens: Math.min(maxTokens, 10000) } }
                : {}),
        });

        for await (const event of stream) {
            if (event.type === 'content_block_delta') {
                const delta = event.delta;
                if ('text' in delta) {
                    yield delta.text;
                }
            }
        }
    } catch (error) {
        yield `[Error: ${error instanceof Error ? error.message : 'Unknown error'}]`;
    }
}

// ─── Non-Streaming Chat ──────────────────────────────────────────

export async function chat(options: ChatOptions): Promise<{
    content: string;
    inputTokens: number;
    outputTokens: number;
    model: string;
}> {
    const {
        messages,
        model = 'sonnet-4.6',
        systemPrompt,
        maxTokens = 4096,
    } = options;

    const modelConfig = MODELS[model] || MODELS['sonnet-4.6'];
    const client = getClient();

    if (!env.ANTHROPIC_API_KEY) {
        return {
            content: `Demo response from ${modelConfig.name}. Add ANTHROPIC_API_KEY for real responses.`,
            inputTokens: 0,
            outputTokens: 0,
            model: modelConfig.name,
        };
    }

    const response = await client.messages.create({
        model: modelConfig.id,
        max_tokens: maxTokens,
        system: systemPrompt || 'You are Recall, a helpful AI assistant.',
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const textContent = response.content
        .filter((c): c is Anthropic.TextBlock => c.type === 'text')
        .map((c) => c.text)
        .join('');

    return {
        content: textContent,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        model: modelConfig.name,
    };
}
