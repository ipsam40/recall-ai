import { jsonResponse } from '@/lib/api-helpers';

// GET /api/features — All features enabled (no billing)
export async function GET() {
    return jsonResponse({
        data: {
            chat_basic: true,
            chat_extended_output: true,
            claude_code: true,
            cowork_mode: true,
            memory: true,
            research_access: true,
            unlimited_projects: true,
            excel_extension: true,
            chrome_extension: true,
            powerpoint_extension: true,
            early_access: true,
            priority_queue: true,
            extended_thinking: true,
            tool_use: true,
            file_upload: true,
            image_input: true,
            api_access: true,
            mcp_connectors: true,
            slack_integration: true,
            google_workspace: true,
            vscode_extension: true,
        },
    });
}
