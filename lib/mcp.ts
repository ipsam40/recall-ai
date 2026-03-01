/**
 * MCP (Model Context Protocol) Client
 *
 * Implements connector registration, tool discovery, and tool invocation
 * following the MCP specification. Supports SSE transport for remote servers.
 */

import { db } from './db';

// ─── Types ───────────────────────────────────────────────────────

export interface McpTool {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
}

export interface McpResource {
    uri: string;
    name: string;
    mimeType?: string;
    description?: string;
}

export interface McpInvokeResult {
    content: Array<{ type: string; text?: string; data?: string; mimeType?: string }>;
    isError?: boolean;
}

interface McpServerCapabilities {
    tools?: { listChanged?: boolean };
    resources?: { subscribe?: boolean; listChanged?: boolean };
    prompts?: { listChanged?: boolean };
}

// ─── In-Memory Session Cache ─────────────────────────────────────

const sessionCache = new Map<
    string,
    { tools: McpTool[]; resources: McpResource[]; lastRefresh: number }
>();

// ─── Connector Management ────────────────────────────────────────

export async function listConnectors() {
    return db.mcpConnector.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createConnector(data: {
    name: string;
    description?: string;
    serverUrl: string;
    transport?: 'STDIO' | 'SSE';
    config?: Record<string, unknown>;
}) {
    const connector = await db.mcpConnector.create({
        data: {
            name: data.name,
            description: data.description || '',
            serverUrl: data.serverUrl,
            transport: data.transport || 'SSE',
            config: (data.config as any) || {},
        },
    });

    // Try to connect and discover tools
    await refreshConnector(connector.id);

    return connector;
}

export async function deleteConnector(id: string) {
    sessionCache.delete(id);
    return db.mcpConnector.delete({ where: { id } });
}

// ─── SSE Transport ───────────────────────────────────────────────

async function sendMcpRequest(
    serverUrl: string,
    method: string,
    params?: Record<string, unknown>,
): Promise<unknown> {
    const requestId = crypto.randomUUID();

    const response = await fetch(serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: requestId,
            method,
            params: params || {},
        }),
        signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
        throw new Error(`MCP server returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.error) {
        throw new Error(`MCP error: ${result.error.message || JSON.stringify(result.error)}`);
    }

    return result.result;
}

// ─── Protocol Operations ─────────────────────────────────────────

export async function initializeConnection(connectorId: string): Promise<McpServerCapabilities> {
    const connector = await db.mcpConnector.findUnique({ where: { id: connectorId } });
    if (!connector) throw new Error('Connector not found');

    try {
        const result = (await sendMcpRequest(connector.serverUrl, 'initialize', {
            protocolVersion: '2025-03-26',
            capabilities: {},
            clientInfo: { name: 'recall', version: '1.0.0' },
        })) as { capabilities: McpServerCapabilities };

        await db.mcpConnector.update({
            where: { id: connectorId },
            data: { status: 'CONNECTED', lastPing: new Date() },
        });

        return result.capabilities;
    } catch (error) {
        await db.mcpConnector.update({
            where: { id: connectorId },
            data: { status: 'ERROR' },
        });
        throw error;
    }
}

export async function listTools(connectorId: string): Promise<McpTool[]> {
    // Check cache (refresh every 5 minutes)
    const cached = sessionCache.get(connectorId);
    if (cached && Date.now() - cached.lastRefresh < 300000) {
        return cached.tools;
    }

    const connector = await db.mcpConnector.findUnique({ where: { id: connectorId } });
    if (!connector) throw new Error('Connector not found');

    try {
        const result = (await sendMcpRequest(connector.serverUrl, 'tools/list', {})) as {
            tools: McpTool[];
        };

        const tools = result.tools || [];

        // Update cache and DB
        sessionCache.set(connectorId, {
            tools,
            resources: cached?.resources || [],
            lastRefresh: Date.now(),
        });

        await db.mcpConnector.update({
            where: { id: connectorId },
            data: { tools: tools as any, status: 'CONNECTED', lastPing: new Date() },
        });

        return tools;
    } catch (error) {
        await db.mcpConnector.update({
            where: { id: connectorId },
            data: { status: 'ERROR' },
        });
        throw error;
    }
}

export async function listResources(connectorId: string): Promise<McpResource[]> {
    const connector = await db.mcpConnector.findUnique({ where: { id: connectorId } });
    if (!connector) throw new Error('Connector not found');

    const result = (await sendMcpRequest(connector.serverUrl, 'resources/list', {})) as {
        resources: McpResource[];
    };

    return result.resources || [];
}

export async function invokeTool(
    connectorId: string,
    toolName: string,
    args: Record<string, unknown>,
): Promise<McpInvokeResult> {
    const connector = await db.mcpConnector.findUnique({ where: { id: connectorId } });
    if (!connector) throw new Error('Connector not found');

    const result = (await sendMcpRequest(connector.serverUrl, 'tools/call', {
        name: toolName,
        arguments: args,
    })) as McpInvokeResult;

    return result;
}

// ─── Refresh / Health Check ──────────────────────────────────────

export async function refreshConnector(connectorId: string): Promise<{
    status: string;
    toolCount: number;
}> {
    try {
        await initializeConnection(connectorId);
        const tools = await listTools(connectorId);
        return { status: 'CONNECTED', toolCount: tools.length };
    } catch {
        return { status: 'ERROR', toolCount: 0 };
    }
}

export async function pingAllConnectors(): Promise<
    Array<{ id: string; name: string; status: string; toolCount: number }>
> {
    const connectors = await db.mcpConnector.findMany();
    const results = [];

    for (const connector of connectors) {
        const result = await refreshConnector(connector.id);
        results.push({ id: connector.id, name: connector.name, ...result });
    }

    return results;
}

// ─── Get All Available Tools (across all connectors) ─────────────

export async function getAllTools(): Promise<
    Array<McpTool & { connectorId: string; connectorName: string }>
> {
    const connectors = await db.mcpConnector.findMany({
        where: { status: 'CONNECTED' },
    });

    const allTools: Array<McpTool & { connectorId: string; connectorName: string }> = [];

    for (const connector of connectors) {
        try {
            const tools = await listTools(connector.id);
            for (const tool of tools) {
                allTools.push({ ...tool, connectorId: connector.id, connectorName: connector.name });
            }
        } catch {
            // Skip errored connectors
        }
    }

    return allTools;
}
