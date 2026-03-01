import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function jsonResponse(data: Record<string, unknown>, status = 200) {
    return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        ...data,
    }, { status });
}

export function errorResponse(message: string, status = 400) {
    return NextResponse.json({
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
    }, { status });
}

/**
 * Safe wrapper that catches errors from route handlers and returns
 * a consistent error JSON response.
 */
export function withErrorHandling(
    handler: (request: NextRequest, context?: unknown) => Promise<Response>,
) {
    return async (request: NextRequest, context?: unknown) => {
        try {
            return await handler(request, context);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Internal server error';
            const status = message === 'Unauthorized' ? 401 : 500;
            console.error(`[API Error] ${request.method} ${request.url}:`, error);
            return errorResponse(message, status);
        }
    };
}
