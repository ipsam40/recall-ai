/**
 * Tool implementations — browser, SQL, vector search, external API.
 */

import { searchChunks } from './rag';

// ─── Browser Tool ────────────────────────────────────────────────

export async function browserFetch(url: string): Promise<{
    url: string;
    title: string;
    content: string;
    status: number;
}> {
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Recall/1.0 (AI Research Assistant)' },
            signal: AbortSignal.timeout(15000),
        });

        const html = await response.text();

        // Simple HTML to text conversion
        const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || 'Untitled';
        const text = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 10000);

        return { url, title, content: text, status: response.status };
    } catch (error) {
        return {
            url,
            title: 'Error',
            content: `Failed to fetch: ${error instanceof Error ? error.message : 'Unknown error'}`,
            status: 0,
        };
    }
}

// ─── SQL Tool (simulated for safety) ─────────────────────────────

export async function executeSql(query: string): Promise<{
    query: string;
    columns: string[];
    rows: Record<string, unknown>[];
    rowCount: number;
    executionTime: number;
}> {
    const start = Date.now();

    // Parse query type for simulation
    const queryType = query.trim().split(/\s+/)[0].toUpperCase();

    // In production, this would connect to an actual database
    // For safety, we simulate common query patterns
    const simulated = simulateQuery(queryType, query);

    return {
        query,
        columns: simulated.columns,
        rows: simulated.rows,
        rowCount: simulated.rows.length,
        executionTime: Date.now() - start,
    };
}

function simulateQuery(type: string, query: string): {
    columns: string[];
    rows: Record<string, unknown>[];
} {
    switch (type) {
        case 'SELECT':
            return {
                columns: ['id', 'name', 'value', 'created_at'],
                rows: [
                    { id: 1, name: 'sample_row', value: 42, created_at: new Date().toISOString() },
                    { id: 2, name: 'example', value: 100, created_at: new Date().toISOString() },
                ],
            };
        case 'INSERT':
            return { columns: ['affected_rows'], rows: [{ affected_rows: 1 }] };
        case 'UPDATE':
            return { columns: ['affected_rows'], rows: [{ affected_rows: 1 }] };
        case 'DELETE':
            return { columns: ['affected_rows'], rows: [{ affected_rows: 1 }] };
        default:
            return { columns: ['result'], rows: [{ result: `Executed: ${type}` }] };
    }
}

// ─── Vector Search Tool ──────────────────────────────────────────

export async function vectorSearch(
    query: string,
    index?: string,
    topK = 5,
): Promise<{
    query: string;
    index: string;
    results: Array<{ id: string; score: number; content: string; metadata: Record<string, unknown> }>;
}> {
    const results = await searchChunks(query, topK);

    return {
        query,
        index: index || 'default',
        results: results.map((r) => ({
            id: r.chunkId,
            score: r.score,
            content: r.content,
            metadata: r.metadata,
        })),
    };
}

// ─── External API Proxy ──────────────────────────────────────────

export async function callExternalApi(
    endpoint: string,
    method: string = 'GET',
    body?: unknown,
    headers?: Record<string, string>,
): Promise<{
    endpoint: string;
    status: number;
    data: unknown;
    responseTime: number;
}> {
    const start = Date.now();

    try {
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: AbortSignal.timeout(15000),
        });

        let data: unknown;
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        return {
            endpoint,
            status: response.status,
            data,
            responseTime: Date.now() - start,
        };
    } catch (error) {
        return {
            endpoint,
            status: 0,
            data: { error: error instanceof Error ? error.message : 'Unknown error' },
            responseTime: Date.now() - start,
        };
    }
}
