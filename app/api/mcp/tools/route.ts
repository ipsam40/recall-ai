import { jsonResponse, errorResponse } from '@/lib/api-helpers';
import { getAllTools } from '@/lib/mcp';

// GET /api/mcp/tools — List all tools across all connected MCP servers
export async function GET() {
    try {
        const tools = await getAllTools();
        return jsonResponse({ data: tools });
    } catch {
        return jsonResponse({ data: [] });
    }
}
