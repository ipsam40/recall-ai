import { jsonResponse } from '@/lib/api-helpers';

export async function GET() {
    return jsonResponse({
        data: {
            latency: { p50: 120, p95: 450, p99: 980 },
            requests_per_minute: 142,
            active_connections: 38,
            error_rate: 0.002,
            token_throughput: 12400,
        },
    });
}
