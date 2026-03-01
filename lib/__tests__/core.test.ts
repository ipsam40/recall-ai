import { describe, it, expect } from 'vitest';
import { chunkDocument } from '@/lib/rag';

describe('RAG Pipeline', () => {
    describe('chunkDocument', () => {
        it('should split text into chunks by paragraph', () => {
            const text = 'First paragraph here.\n\nSecond paragraph here.\n\nThird paragraph here.';
            const chunks = chunkDocument(text, { maxTokens: 20 });
            expect(chunks.length).toBeGreaterThanOrEqual(1);
            expect(chunks[0].content).toBeTruthy();
            expect(chunks[0].index).toBe(0);
        });

        it('should handle empty text', () => {
            const chunks = chunkDocument('');
            expect(chunks).toHaveLength(0);
        });

        it('should handle single paragraph', () => {
            const chunks = chunkDocument('A single paragraph.');
            expect(chunks).toHaveLength(1);
            expect(chunks[0].content).toBe('A single paragraph.');
        });

        it('should respect max token limit', () => {
            const longText = Array(50).fill('This is a sentence.').join('\n\n');
            const chunks = chunkDocument(longText, { maxTokens: 100 });
            chunks.forEach((chunk) => {
                // ~4 chars per token, so 100 tokens ~ 400 chars max
                expect(chunk.content.length).toBeLessThan(600); // some tolerance
            });
        });

        it('should set sequential indexes', () => {
            const text = Array(10).fill('Paragraph.').join('\n\n');
            const chunks = chunkDocument(text, { maxTokens: 10 });
            chunks.forEach((chunk, i) => {
                expect(chunk.index).toBe(i);
            });
        });
    });
});

describe('Auth', () => {
    it('should hash and verify passwords', async () => {
        const { hashPassword, verifyPassword } = await import('@/lib/auth');
        const hash = await hashPassword('test123');
        expect(hash).not.toBe('test123');
        expect(await verifyPassword('test123', hash)).toBe(true);
        expect(await verifyPassword('wrong', hash)).toBe(false);
    });

    it('should sign and verify JWT tokens', async () => {
        const { signToken, verifyToken } = await import('@/lib/auth');
        const payload = { userId: 'user1', email: 'test@test.com', role: 'USER' };
        const token = signToken(payload);
        expect(token).toBeTruthy();
        const decoded = verifyToken(token);
        expect(decoded?.userId).toBe('user1');
        expect(decoded?.email).toBe('test@test.com');
    });

    it('should reject invalid tokens', async () => {
        const { verifyToken } = await import('@/lib/auth');
        expect(verifyToken('invalid-token')).toBeNull();
    });
});

describe('Environment', () => {
    it('should load default environment values', async () => {
        const { env } = await import('@/lib/env');
        expect(env.DEFAULT_MODEL).toBe('sonnet-4.6');
        expect(env.ENABLE_EXTENDED_THINKING).toBe(true);
        expect(env.NODE_ENV).toBeDefined();
    });
});

describe('Claude', () => {
    it('should export model definitions', async () => {
        const { MODELS } = await import('@/lib/claude');
        expect(MODELS['sonnet-4.6']).toBeDefined();
        expect(MODELS['sonnet-4.6'].name).toBe('Sonnet 4.6');
        expect(MODELS['opus-4.6']).toBeDefined();
        expect(MODELS['haiku-4.5']).toBeDefined();
    });
});

describe('Sandbox', () => {
    it('should list available languages', async () => {
        const { getAvailableLanguages } = await import('@/lib/sandbox');
        const languages = await getAvailableLanguages();
        expect(Array.isArray(languages)).toBe(true);
        // Node.js should always be available in test env
        expect(languages).toContain('javascript');
    });
});

describe('API Helpers', () => {
    it('should create JSON response with envelope', async () => {
        const { jsonResponse } = await import('@/lib/api-helpers');
        const res = jsonResponse({ data: { test: true } });
        const body = await res.json();
        expect(body.success).toBe(true);
        expect(body.timestamp).toBeTruthy();
        expect(body.data.test).toBe(true);
    });

    it('should create error response', async () => {
        const { errorResponse } = await import('@/lib/api-helpers');
        const res = errorResponse('Something went wrong', 400);
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.error).toBe('Something went wrong');
        expect(res.status).toBe(400);
    });
});
