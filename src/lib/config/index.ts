/**
 * Centralized configuration
 * All config should be imported from here, not directly from process.env
 */

export { env } from './env';

// Re-export specific config groups for convenience
export const database = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
} as const;

export const auth = {
    secret: process.env.NEXTAUTH_SECRET!,
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
} as const;

export const redis = {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    enabled: Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
} as const;

export const monitoring = {
    sentry: {
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
    },
} as const;

export const app = {
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000',
    environment: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
} as const;
