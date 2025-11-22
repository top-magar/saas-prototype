import { NextResponse } from 'next/server';
import { logger } from '@/lib/monitoring/logger';

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
    requestId: string;
}

function generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export class ApiErrorHandler {
    static unauthorized(message = 'Authentication required'): NextResponse {
        return this.error(401, 'UNAUTHORIZED', message);
    }

    static forbidden(message = 'Insufficient permissions'): NextResponse {
        return this.error(403, 'FORBIDDEN', message);
    }

    static notFound(message = 'Resource not found'): NextResponse {
        return this.error(404, 'NOT_FOUND', message);
    }

    static validationError(details: Record<string, unknown>): NextResponse {
        return this.error(400, 'VALIDATION_ERROR', 'Invalid input', details);
    }

    static rateLimited(reset?: Date): NextResponse {
        const response = this.error(429, 'RATE_LIMITED', 'Too many requests');
        if (reset) {
            response.headers.set('Retry-After', Math.ceil((reset.getTime() - Date.now()) / 1000).toString());
        }
        return response;
    }

    static internal(error: unknown): NextResponse {
        logger.error('Internal Server Error', error);
        return this.error(500, 'INTERNAL_ERROR', 'An unexpected error occurred');
    }

    private static error(
        status: number,
        code: string,
        message: string,
        details?: Record<string, unknown>
    ): NextResponse {
        const body: ApiError = {
            code,
            message,
            details,
            timestamp: new Date().toISOString(),
            requestId: generateRequestId(),
        };

        return NextResponse.json(body, { status });
    }
}
