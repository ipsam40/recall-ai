import { jsonResponse, errorResponse } from '@/lib/api-helpers';
import { invokeTool } from '@/lib/mcp';

// POST /api/mcp/invoke — Invoke a tool on a connected MCP server
export async function POST(request: Request) {
    const body = await request.json();
    const { connector_id, tool_name, arguments: args } = body;

    if (!connector_id || !tool_name) {
        return errorResponse('connector_id and tool_name are required', 400);
    }

    try {
        const result = await invokeTool(connector_id, tool_name, args || {});
        return jsonResponse({ data: { tool: tool_name, result } });
    } catch (error) {
        return errorResponse(error instanceof Error ? error.message : 'Tool invocation failed', 500);
    }
}
