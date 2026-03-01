import { jsonResponse, errorResponse } from '@/lib/api-helpers';
import { deleteConnector, refreshConnector, listTools } from '@/lib/mcp';

// GET /api/mcp/connectors/:id — Get connector details + tools
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const tools = await listTools(id);
        return jsonResponse({ data: { id, tools } });
    } catch (error) {
        return errorResponse(error instanceof Error ? error.message : 'Failed', 500);
    }
}

// POST /api/mcp/connectors/:id — Refresh connector (re-discover tools)
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await refreshConnector(id);
    return jsonResponse({ data: result });
}

// DELETE /api/mcp/connectors/:id
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try { await deleteConnector(id); } catch { }
    return jsonResponse({ data: { deleted: true } });
}
