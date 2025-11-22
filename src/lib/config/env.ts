import { z } from 'zod';

/**
 * Environment variable validation schema
 * Validates all required and optional environment variables on startup
 * Provides helpful error messages for missing or invalid configuration
 */

const envSchema = z.object({
    // ============================================
    // Node Environment
    // ============================================
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // ============================================
    // Next.js Configuration
    // ============================================
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters. Generate with: openssl rand -base64 32'),

    // ============================================
    // Database (Supabase) - REQUIRED
    // ============================================
    NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),

    // ============================================
    // Authentication (NextAuth + Google OAuth) - REQUIRED
    // ============================================
    GOOGLE_CLIENT_ID: z.string().min(1, 'Google OAuth Client ID is required'),
    GOOGLE_CLIENT_SECRET: z.string().min(1, 'Google OAuth Client Secret is required'),

    // ============================================
    // Caching & Rate Limiting (Redis/Upstash) - OPTIONAL
    // ============================================
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

    // ============================================
    // Monitoring (Sentry) - OPTIONAL
    // ============================================
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.literal('')),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),

    // ============================================
    // Application
    // ============================================
    NEXT_PUBLIC_DOMAIN: z.string().default('localhost:3000'),

    // ============================================
    // Security
    // ============================================
    ENCRYPTION_KEY: z.string().min(32, 'ENCRYPTION_KEY must be at least 32 characters').optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates and returns environment variables
 * Throws descriptive error if validation fails
 */
function validateEnv(): Env {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        console.error('❌ Invalid environment variables:\n');

        const errors = parsed.error.flatten().fieldErrors;
        Object.entries(errors).forEach(([key, messages]) => {
            console.error(`  ${key}:`);
            messages?.forEach(msg => console.error(`    - ${msg}`));
        });

        console.error('\n💡 Check your .env.local file or environment configuration');
        console.error('📝 See .env.template for required variables\n');

        throw new Error('Environment validation failed');
    }

    return parsed.data;
}

// Validate on import - fail fast if misconfigured
let env: Env;

try {
    env = validateEnv();
} catch (error) {
    // In test environment, provide safe defaults
    if (process.env.NODE_ENV === 'test') {
        env = {
            NODE_ENV: 'test',
            NEXTAUTH_SECRET: 'test-secret-key-for-testing-only-min-32-chars',
            NEXTAUTH_URL: 'http://localhost:3000',
            NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
            NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
            SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
            GOOGLE_CLIENT_ID: 'test-client-id',
            GOOGLE_CLIENT_SECRET: 'test-client-secret',
            NEXT_PUBLIC_DOMAIN: 'localhost:3000',
        } as Env;
    } else {
        throw error;
    }
}

export { env };
