/**
 * Structured Logging System
 * 
 * Provides environment-aware logging that:
 * - Uses console in development for instant feedback
 * - Sends to Sentry in production for centralized monitoring
 * - Supports log levels and contextual metadata
 * - Prevents sensitive data leaks
 */

import { app } from '@/lib/config';

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

interface LogContext {
    [key: string]: unknown;
    tenantId?: string;
    userId?: string;
    requestId?: string;
    action?: string;
    duration?: number;
}

class Logger {
    private minLevel: LogLevel;

    constructor() {
        // Set minimum log level based on environment
        this.minLevel = app.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
    }

    /**
     * Debug-level logs (only in development)
     */
    debug(message: string, context?: LogContext): void {
        if (!this.shouldLog(LogLevel.DEBUG)) return;

        if (app.isDevelopment) {
            console.log(`[DEBUG] ${message}`, context || '');
        }
    }

    /**
     * Info-level logs (important events)
     */
    info(message: string, context?: LogContext): void {
        if (!this.shouldLog(LogLevel.INFO)) return;

        if (app.isDevelopment) {
            console.log(`[INFO] ${message}`, context || '');
        } else {
            // In production, send to monitoring service
            this.sendToMonitoring('info', message, context);
        }
    }

    /**
     * Warning-level logs (potential issues)
     */
    warn(message: string, context?: LogContext): void {
        if (!this.shouldLog(LogLevel.WARN)) return;

        if (app.isDevelopment) {
            console.warn(`[WARN] ${message}`, context || '');
        } else {
            this.sendToMonitoring('warning', message, context);
        }
    }

    /**
     * Error-level logs (failures and exceptions)
     */
    error(message: string, error?: Error | unknown, context?: LogContext): void {
        if (!this.shouldLog(LogLevel.ERROR)) return;

        const errorInfo = this.serializeError(error);

        if (app.isDevelopment) {
            console.error(`[ERROR] ${message}`, { ...errorInfo, ...context });
        } else {
            this.sendToMonitoring('error', message, { ...errorInfo, ...context }, error);
        }
    }

    /**
     * Middleware-specific logging
     */
    middleware(message: string, context?: LogContext): void {
        this.debug(`[Middleware] ${message}`, context);
    }

    /**
     * Cache-specific logging
     */
    cache(message: string, context?: LogContext): void {
        this.debug(`[Cache] ${message}`, context);
    }

    /**
     * Database-specific logging
     */
    database(message: string, context?: LogContext): void {
        this.debug(`[DB] ${message}`, context);
    }

    /**
     * Authentication-specific logging
     */
    auth(message: string, context?: LogContext): void {
        this.info(`[Auth] ${message}`, this.sanitizeAuthContext(context));
    }

    /**
     * Tenant-specific logging
     */
    tenant(message: string, context?: LogContext): void {
        this.info(`[Tenant] ${message}`, context);
    }

    // ============================================
    // Private Helper Methods
    // ============================================

    private shouldLog(level: LogLevel): boolean {
        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
        return levels.indexOf(level) >= levels.indexOf(this.minLevel);
    }

    private serializeError(error: unknown): Record<string, unknown> {
        if (!error) return {};

        if (error instanceof Error) {
            return {
                errorMessage: error.message,
                errorName: error.name,
                errorStack: app.isDevelopment ? error.stack : undefined, // Only include stack in dev
            };
        }

        return { error: String(error) };
    }

    private sanitizeAuthContext(context?: LogContext): LogContext | undefined {
        if (!context) return context;

        // Remove sensitive fields
        const { password, token, secret, ...safe } = context as any;
        return safe;
    }

    private sendToMonitoring(
        level: string,
        message: string,
        context?: LogContext,
        error?: unknown
    ): void {
        // Send to Sentry if available
        if (typeof window === 'undefined') {
            // Server-side
            try {
                // Use Sentry.captureMessage or Sentry.captureException
                const Sentry = require('@sentry/nextjs');

                if (error instanceof Error) {
                    Sentry.captureException(error, {
                        level: level as any,
                        tags: {
                            logSource: 'structured-logger',
                        },
                        extra: {
                            message,
                            ...context,
                        },
                    });
                } else {
                    Sentry.captureMessage(message, {
                        level: level as any,
                        tags: {
                            logSource: 'structured-logger',
                        },
                        extra: context,
                    });
                }
            } catch (e) {
                // Sentry not available, fallback to console
                console.log(`[${level.toUpperCase()}] ${message}`, context);
            }
        } else {
            // Client-side logging - send to server endpoint or use client Sentry
            // For now, just use console in production client-side
            console.log(`[${level.toUpperCase()}] ${message}`, context);
        }
    }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Helper to measure function execution time
 */
export async function withTiming<T>(
    fn: () => Promise<T>,
    label: string
): Promise<T> {
    const start = Date.now();
    try {
        const result = await fn();
        const duration = Date.now() - start;
        logger.debug(`${label} completed`, { duration });
        return result;
    } catch (error) {
        const duration = Date.now() - start;
        logger.error(`${label} failed`, error, { duration });
        throw error;
    }
}
