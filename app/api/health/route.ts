import { jsonResponse } from '@/lib/api-helpers';

export async function GET() {
    return jsonResponse({
        data: {
            status: 'healthy',
            uptime: '99.99%',
            version: '1.0.0',
            services: {
                api: 'operational',
                database: 'operational',
                vector_db: 'operational',
                cache: 'operational',
                queue: 'operational',
            },
        },
    });
}
