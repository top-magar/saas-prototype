# Environment Setup Guide

## Quick Start

1. Copy the environment template:
```bash
cp .env.template .env.local
```

2. Fill in required values (see sections below)

3. Start development:
```bash
npm run dev
```

## Required Configuration

### Database (Supabase)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get credentials from Settings > API
4. Update `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Authentication (Clerk)
1. Create account at [clerk.com](https://clerk.com)
2. Create new application
3. Get credentials from API Keys
4. Update `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

## Optional Configuration

### Redis (Production Only)
For rate limiting and caching in production:
1. Create account at [upstash.com](https://upstash.com)
2. Create Redis database
3. Update `.env.local`:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Monitoring (Production Only)
For error tracking:
1. Create account at [sentry.io](https://sentry.io)
2. Create new project
3. Update `.env.local`:
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
   - `SENTRY_AUTH_TOKEN`

## Security Keys

Generate secure keys:
```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY (must be 32 characters)
openssl rand -base64 32 | cut -c1-32
```

## Environment Files

- `.env.template` - Template with all variables
- `.env.local` - Your local configuration (gitignored)
- `.env.example` - Example values for reference
- `.env` - Not used (gitignored for safety)

## Troubleshooting

### Database Connection Issues
- Verify Supabase URL and keys
- Check project is not paused
- Ensure RLS policies are applied

### Authentication Issues
- Verify Clerk keys
- Check allowed domains in Clerk dashboard
- Ensure middleware is configured

### Redis Connection Issues
- Redis is optional for development
- App will work without Redis (with warnings)
- Required for production rate limiting
