import { jsonResponse, errorResponse } from '@/lib/api-helpers';
import { listConnectors, createConnector, getAllTools } from '@/lib/mcp';

// GET /api/mcp/connectors — List all MCP connectors
export async function GET() {
    try {
        const connectors = await listConnectors();
        return jsonResponse({ data: connectors });
    } catch {
        return jsonResponse({ data: [] });
    }
}

// POST /api/mcp/connectors — Register a new connector
export async function POST(request: Request) {
    const body = await request.json();
    if (!body.name || !body.serverUrl) {
        return errorResponse('name and serverUrl are required', 400);
    }
    try {
        const connector = await createConnector({
            name: body.name,
            description: body.description,
            serverUrl: body.serverUrl,
            transport: body.transport,
            config: body.config,
        });
        return jsonResponse({ data: connector }, 201);
    } catch (error) {
        return errorResponse(error instanceof Error ? error.message : 'Failed to create connector', 500);
    }
}
