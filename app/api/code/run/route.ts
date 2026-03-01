import { jsonResponse } from '@/lib/api-helpers';
import { executeCode, getAvailableLanguages } from '@/lib/sandbox';

// POST /api/code/run — Execute code in sandbox
export async function POST(request: Request) {
    const body = await request.json();
    const { code, language = 'python', timeout = 10000 } = body;

    if (!code) return jsonResponse({ error: 'code is required' }, 400);

    const result = await executeCode(code, language, timeout);

    return jsonResponse({
        data: {
            action: 'run',
            language,
            stdout: result.stdout,
            stderr: result.stderr,
            exit_code: result.exitCode,
            execution_time_ms: result.executionTime,
            timed_out: result.timedOut,
        },
    });
}

// GET /api/code/run — Get available languages
export async function GET() {
    const languages = await getAvailableLanguages();
    return jsonResponse({ data: { languages } });
}
