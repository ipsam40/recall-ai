import { z } from 'zod';

const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().url().default('postgresql://postgres:postgres@localhost:5432/recall'),

    // Auth
    JWT_SECRET: z.string().min(32).default('recall-dev-secret-change-in-production-min32chars'),
    JWT_EXPIRY: z.string().default('7d'),

    // Anthropic
    ANTHROPIC_API_KEY: z.string().default(''),

    // Vector DB
    PINECONE_API_KEY: z.string().default(''),
    PINECONE_INDEX: z.string().default('recall-prod'),

    // Redis
    REDIS_URL: z.string().default('redis://localhost:6379'),

    // File storage
    UPLOAD_DIR: z.string().default('./uploads'),

    // Feature flags
    ENABLE_EXTENDED_THINKING: z.coerce.boolean().default(true),
    ENABLE_TOOL_USE: z.coerce.boolean().default(true),
    ENABLE_WEB_SEARCH: z.coerce.boolean().default(true),

    // App
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DEFAULT_MODEL: z.string().default('sonnet-4.6'),
});

export type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
        // In development, use defaults; in production, throw
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Missing required environment variables');
        }
        return envSchema.parse({});
    }
    return parsed.data;
}

export const env = getEnv();
