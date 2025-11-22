# Enterprise-Ready SaaS Application Architecture

## Executive Summary

This document defines the production-ready architecture for a multi-tenant SaaS platform built on **Next.js 16**, **Supabase PostgreSQL**, and **Upstash Redis**. The architecture implements industry-standard patterns for security, scalability, observability, and compliance, suitable for enterprise deployments.

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

![Enterprise Architecture Diagram](./enterprise-architecture-diagram.png)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Web App    │  │   Mobile     │  │   API        │            │
│  │  (Browser)   │  │  (Native)    │  │  Clients     │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└────────────────────────┬─────────────────────────────────────────┘
                         │ HTTPS/WSS
┌────────────────────────▼─────────────────────────────────────────┐
│                    EDGE LAYER (Vercel)                            │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Global CDN & Edge Middleware                            │    │
│  │  - Request routing  - Tenant detection                   │    │
│  │  - Rate limiting    - Security headers                   │    │
│  │  - DDoS protection  - Compression                        │    │
│  └──────────────────────────────────────────────────────────┘    │
└────────────────────────┬─────────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│              APPLICATION LAYER (Next.js 16)                       │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Middleware (Tenant Resolution & Auth)                   │    │
│  └──────────────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  App Router (Pages & Layouts)                            │    │
│  │  - Server Components    - Client Components              │    │
│  │  - Streaming          - Partial Pre-rendering           │    │
│  └──────────────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  API Routes (Route Handlers)                             │    │
│  │  - REST endpoints     - WebSocket handlers               │    │
│  │  - Tenant validation  - Permission checks                │    │
│  └──────────────────────────────────────────────────────────┘    │
└────────────┬──────────────────────┬──────────────────────┬───────┘
             │                      │                      │
┌────────────▼──┐      ┌────────────▼──┐      ┌───────────▼─┐
│  DATA LAYER   │      │ CACHE LAYER   │      │AUTH LAYER   │
│               │      │               │      │             │
│ Supabase DB   │      │ Redis Cache   │      │ NextAuth.js │
│ - PostgreSQL  │      │ - Sessions    │      │ - JWT       │
│ - RLS         │      │ - Rate limits │      │ - OAuth     │
│ - Backups     │      │ - Queues      │      │ - Credentials
│               │      │ - Features    │      │             │
└───────────────┘      └───────────────┘      └─────────────┘
```

### 1.2 Architectural Principles

| Principle | Implementation |
|-----------|-----------------|
| **Multi-Tenancy First** | Tenant context embedded in middleware, headers, database queries |
| **Defense in Depth** | Multiple security layers: edge, application, database, encryption |
| **Zero-Trust Verification** | Every request authenticated & authorized, tenant context validated |
| **Data Isolation** | RLS + tenant_id filtering ensures no cross-tenant data leakage |
| **Observability** | Structured logging, distributed tracing, APM integration |
| **Horizontal Scalability** | Stateless app servers, distributed caching, connection pooling |
| **Fail-Safe Defaults** | Security > Features; audit everything; deny by default |

---

## 2. Infrastructure & Deployment

### 2.1 Deployment Stack

```yaml
Hosting Platform:
  - Vercel (Application, Edge Middleware)
  - Auto-scaling, global CDN, serverless functions
  - Staging & production environments
  - Zero-downtime deployments with rollback

Database:
  - Supabase PostgreSQL (Primary)
  - Read replicas for reporting/analytics
  - Automated backups (daily + point-in-time recovery)
  - WAL archiving for compliance

Cache Layer:
  - Upstash Redis (Serverless)
  - Multi-region failover
  - TTL-based expiration
  - Pub/Sub for real-time features

File Storage:
  - AWS S3 (or Supabase Storage)
  - Signed URLs for secure access
  - Tenant-scoped prefixes
  - CDN distribution via CloudFront

Monitoring & Logging:
  - Sentry (error tracking)
  - Axiom (log aggregation)
  - Vercel Analytics (performance)
  - Custom dashboards (Grafana/DataDog)
```

### 2.2 Environment Configuration

```yaml
Production Environment:
  - Region: Multi-region (US, EU, Asia)
  - Database: Supabase (prod.supabase.co)
  - Cache: Upstash Redis (redundant)
  - Secrets: Vercel KMS + AWS Secrets Manager
  - Logging: Production-grade (Axiom/ELK)
  - APM: DataDog or New Relic
  - CDN: Vercel Edge + CloudFront

Staging Environment:
  - Mirrors production setup
  - Separate database (anonymized prod data)
  - Lower rate limits & quotas
  - Real-time log monitoring

Development Environment:
  - Local Supabase (docker-compose)
  - Local Redis (docker)
  - .env.local with secrets
  - Zero-downtime hot reloading
```

---

## 3. Multi-Tenancy Architecture

### 3.1 Tenant Identification Strategy

```typescript
// Supported tenant detection methods (in priority order):
1. Subdomain Parsing: tenant.app.com → extract "tenant"
2. Custom Domain: custom-domain.com → lookup tenant in DB
3. API Key: X-Tenant-ID header (for service accounts)
4. Session Cookie: User session → associate to tenant
5. Fallback: req.headers['x-forwarded-host']
```

### 3.2 Middleware Tenant Resolution

**Location:** `src/middleware.ts`

```typescript
Key Responsibilities:
  ✓ Parse hostname and extract tenant identifier
  ✓ Query tenant registry (Redis cache for speed)
  ✓ Validate tenant is active and not suspended
  ✓ Inject tenant context into request headers
  ✓ Rewrite URLs to route to correct handler
  ✓ Enforce HTTPS, security headers
  ✓ Apply rate limiting per tenant
  ✓ Log all routing decisions

Execution Time Target: <50ms (99th percentile)
Cache Strategy: Redis with 1-hour TTL
Fallback: Redirect to 400 Bad Request if tenant not found
```

### 3.3 Tenant Data Isolation

**Database Level (Primary Defense):**

```sql
-- All tables include tenant_id
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for query performance
CREATE INDEX idx_organizations_tenant_id ON organizations(tenant_id);
CREATE INDEX idx_tenants_domain ON tenants(domain);
```

**Row-Level Security (RLS) Policies:**

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY organizations_tenant_isolation ON organizations
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Admin bypass (with audit logging)
CREATE POLICY organizations_admin_override ON organizations
  USING (
    current_role = 'admin' 
    AND EXISTS (
      SELECT 1 FROM audit_log 
      WHERE action = 'admin_access' 
      AND user_id = current_user_id
    )
  );
```

**Application Level (Secondary Defense):**

```typescript
// Always filter by tenant_id in queries
export async function getOrganizations(tenantId: string) {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('tenant_id', tenantId)  // MANDATORY filter
    .throwOnError();
  
  if (error) logSecurityEvent('query_failed', { tenantId, error });
  return data;
}

// Validate tenant ownership before mutations
export async function updateOrganization(
  id: string,
  tenantId: string,
  updates: Partial<Organization>
) {
  // 1. Verify ownership
  const { data: org, error: fetchError } = await supabase
    .from('organizations')
    .select('tenant_id')
    .eq('id', id)
    .single();
  
  if (org?.tenant_id !== tenantId) {
    logSecurityEvent('unauthorized_update', { id, tenantId });
    throw new UnauthorizedError('Organization not found');
  }
  
  // 2. Perform update
  const { data, error } = await supabase
    .from('organizations')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', id)
    .eq('tenant_id', tenantId)  // Double-check
    .select();
  
  logAuditEvent('organization_updated', { id, tenantId, updates });
  return data;
}
```

---

## 4. Authentication & Authorization

### 4.1 Authentication Architecture

```
┌─────────────────────────────────────────┐
│  Client (Web/Mobile)                    │
└────────────────┬────────────────────────┘
                 │
    ┌────────────▼────────────┐
    │  NextAuth.js Provider   │
    │  - OAuth (Google, GH)   │
    │  - Email + Password     │
    │  - MFA Support          │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │ Supabase Auth API       │
    │ - User creation         │
    │ - JWT generation        │
    │ - Session management    │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │ Database (Supabase)     │
    │ - Users table           │
    │ - Sessions table        │
    │ - Tenant memberships    │
    └─────────────────────────┘
```

**NextAuth Configuration:**

```typescript
// src/lib/auth/config.ts
export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const { data: user, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });
        
        if (error || !user.user) return null;
        
        return {
          id: user.user.id,
          email: user.user.email,
          name: user.user.user_metadata?.name,
        };
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Fetch tenant associations
      const { data: memberships } = await supabase
        .from('tenant_members')
        .select('tenant_id, role')
        .eq('user_id', token.id);
      
      session.user = {
        ...session.user,
        id: token.id,
        tenants: memberships || [],
      };
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 }, // 7 days
};
```

### 4.2 Authorization & RBAC

**Role-Based Access Control:**

```yaml
Roles:
  owner:
    - Full access to tenant settings
    - Billing management
    - User invitations
    - Audit log access
  
  admin:
    - Manage users & permissions
    - View analytics
    - Configure settings
    - Cannot change billing
  
  member:
    - Use core features
    - View shared resources
    - Limited access to settings
  
  viewer:
    - Read-only access
    - View reports
    - No write permissions

Permission Structure:
  resource:action
  Examples:
    - organizations:read
    - organizations:write
    - organizations:delete
    - billing:manage
    - settings:read
    - audit_logs:read
```

**Permission Middleware:**

```typescript
// src/lib/auth/permissions.ts
export function requirePermission(permission: string) {
  return async (req: NextRequest, ctx: NextMiddlewareResult) => {
    const session = await getServerSession(authOptions);
    const tenantId = req.headers.get('x-tenant-id');
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user's role in tenant
    const { data: member, error } = await supabase
      .from('tenant_members')
      .select('role')
      .eq('tenant_id', tenantId)
      .eq('user_id', session.user.id)
      .single();
    
    if (!member || !hasPermission(member.role, permission)) {
      logSecurityEvent('unauthorized_access', {
        userId: session.user.id,
        tenantId,
        permission,
      });
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return ctx.next();
  };
}
```

---

## 5. Security & Compliance

### 5.1 Security Headers & Policies

**Content Security Policy (CSP):**

```typescript
// src/middleware.ts
const securityHeaders: HeadersInit = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' *.supabase.co *.upstash.com *.sentry.io",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=()',
  ].join(', '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};
```

### 5.2 Data Encryption

**In Transit:**
- ✅ TLS 1.3 for all connections (Vercel enforces)
- ✅ HSTS headers with 1-year max-age
- ✅ Perfect Forward Secrecy (PFS) enabled
- ✅ Certificate pinning for critical endpoints

**At Rest:**
- ✅ Supabase: All data encrypted with AES-256
- ✅ Sensitive fields: Field-level encryption using `@supabase/crypto`
- ✅ Backups: Encrypted with tenant-specific keys
- ✅ Secrets: AWS Secrets Manager or Vercel KMS

```typescript
// Encrypt sensitive data
import { encrypt, decrypt } from '@lib/crypto';

export async function createSecureDocument(
  tenantId: string,
  content: string
) {
  const encrypted = await encrypt(content, tenantId);
  
  const { data } = await supabase
    .from('documents')
    .insert({
      tenant_id: tenantId,
      content: encrypted,
      encrypted: true,
    })
    .select();
  
  return data;
}
```

### 5.3 Compliance & Audit

**Audit Logging:**

```typescript
// src/lib/audit.ts
export async function logAuditEvent(
  action: string,
  details: Record<string, any>,
  severity: 'info' | 'warning' | 'error' = 'info'
) {
  const { tenantId, userId } = getCurrentContext();
  
  const { error } = await supabase
    .from('audit_logs')
    .insert({
      tenant_id: tenantId,
      user_id: userId,
      action,
      details,
      severity,
      timestamp: new Date(),
      ip_address: getClientIp(),
      user_agent: getUserAgent(),
    });
  
  if (error) console.error('Audit log failed:', error);
  
  // Also send to external SIEM if configured
  if (severity !== 'info') {
    await sendToSiem({ tenantId, userId, action, details });
  }
}

// Log all critical operations
logAuditEvent('user_created', { email: user.email, role: user.role });
logAuditEvent('billing_updated', { plan: newPlan, cost: newCost });
logAuditEvent('data_exported', { format: 'csv', records: 1000 });
logAuditEvent('settings_changed', { field: 'security', old, new: newValue });
logAuditEvent('unauthorized_access_attempt', { resource, reason });
```

**Compliance Standards:**
- SOC 2 Type II: ✅ (Annual audit)
- GDPR: ✅ (Data retention, right to deletion, portability)
- HIPAA: ⚠️ (Business Associate Agreement required)
- PCI-DSS: ✅ (For payment data handling)
- CCPA/CPRA: ✅ (California privacy laws)

---

## 6. Performance & Caching

### 6.1 Multi-Layer Caching Strategy

```
Request
  ↓
CDN Cache (Vercel Edge) ←→ ISR/SSG pages (60s - 24h)
  ↓
Application Cache (Redis) ←→ Sessions, rate limits
  ↓
Database Query Cache ←→ Supabase RLS policies
  ↓
Database ←→ Read replicas for reporting
```

**Caching Patterns:**

```typescript
// Cache-Control headers
export const revalidate = 60; // ISR with 60s revalidation

// API route caching
export async function GET(req: NextRequest) {
  const cacheKey = `org:${tenantId}:metadata`;
  
  // Check Redis
  const cached = await redis.get(cacheKey);
  if (cached) {
    return Response.json(cached, {
      headers: { 'X-Cache': 'HIT' },
    });
  }
  
  // Fetch from database
  const data = await supabase
    .from('organizations')
    .select('*')
    .eq('tenant_id', tenantId);
  
  // Store in Redis for 5 minutes
  await redis.set(cacheKey, data, { ex: 300 });
  
  return Response.json(data, {
    headers: { 'X-Cache': 'MISS' },
  });
}

// Invalidate cache on mutations
export async function POST(req: NextRequest) {
  // ... save data ...
  
  // Purge Redis cache
  await redis.del(`org:${tenantId}:metadata`);
  
  // Revalidate ISR
  revalidateTag(`org:${tenantId}`);
  
  return Response.json({ success: true });
}
```

### 6.2 Rate Limiting

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';

export const createRateLimiter = () => {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(
      100,  // 100 requests
      '1 m' // per minute
    ),
    analytics: true,
    prefix: 'ratelimit',
  });
};

// Usage in API routes
export async function POST(req: NextRequest) {
  const tenantId = req.headers.get('x-tenant-id');
  const ip = getClientIp(req);
  
  const ratelimit = createRateLimiter();
  const { success, limit, reset, remaining } = await ratelimit.limit(
    `${tenantId}:${ip}`
  );
  
  if (!success) {
    return Response.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((reset - Date.now()) / 1000),
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
        },
      }
    );
  }
  
  // Process request
}
```

---

## 7. Observability & Monitoring

### 7.1 Structured Logging

```typescript
// src/lib/logger.ts
import { logger as sentryLogger } from '@sentry/nextjs';

interface LogContext {
  tenantId: string;
  userId?: string;
  requestId: string;
  severity: 'debug' | 'info' | 'warn' | 'error';
  action: string;
  duration?: number;
  error?: Error;
  metadata?: Record<string, any>;
}

export function log(context: LogContext) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...context,
    environment: process.env.NODE_ENV,
  };
  
  console.log(JSON.stringify(logEntry));
  
  if (context.severity === 'error') {
    sentryLogger.captureException(context.error || new Error(context.action));
  }
}

// Usage
log({
  tenantId,
  userId,
  requestId,
  severity: 'info',
  action: 'organization_created',
  duration: 245,
  metadata: { orgName: 'Acme Corp' },
});
```

### 7.2 Error Tracking & APM

**Sentry Configuration:**

```typescript
// src/lib/sentry.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers['authorization'];
    }
    return event;
  },
});
```

### 7.3 Performance Monitoring

```typescript
// src/lib/metrics.ts
export async function recordMetric(
  name: string,
  value: number,
  tags: Record<string, string> = {}
) {
  // Send to monitoring service (DataDog, New Relic, etc.)
  await fetch('https://metrics.example.com/api/metrics', {
    method: 'POST',
    body: JSON.stringify({
      metric: name,
      value,
      timestamp: Date.now(),
      tags: {
        environment: process.env.NODE_ENV,
        ...tags,
      },
    }),
  });
}

// Track important events
export async function withMetrics<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    await recordMetric(`${name}.duration_ms`, duration);
    await recordMetric(`${name}.success`, 1);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    await recordMetric(`${name}.duration_ms`, duration);
    await recordMetric(`${name}.error`, 1);
    throw error;
  }
}

// Usage
const users = await withMetrics('fetch_users', async () => {
  return await supabase.from('users').select('*');
});
```

---

## 8. API Design & Rate Limiting

### 8.1 RESTful API Standards

```typescript
// src/app/api/[tenant]/organizations/route.ts

// GET /api/organizations - List organizations
export async function GET(req: NextRequest) {
  const tenantId = req.headers.get('x-tenant-id');
  const { searchParams } = new URL(req.url);
  
  // Pagination
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const offset = (page - 1) * limit;
  
  // Filtering
  const filter = searchParams.get('filter');
  
  // Sorting
  const sort = searchParams.get('sort') || '-created_at';
  
  const query = supabase
    .from('organizations')
    .select('*, members:tenant_members(count)', { count: 'exact' })
    .eq('tenant_id', tenantId);
  
  if (filter) {
    query.ilike('name', `%${filter}%`);
  }
  
  const { data, count, error } = await query
    .order(sort.startsWith('-') ? sort.slice(1) : sort, {
      ascending: !sort.startsWith('-'),
    })
    .range(offset, offset + limit - 1);
  
  return Response.json({
    data,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil((count || 0) / limit),
    },
  });
}

// POST /api/organizations - Create organization
export async function POST(req: NextRequest) {
  const tenantId = req.headers.get('x-tenant-id');
  const body = await req.json();
  
  // Validation
  const schema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().max(1000).optional(),
  });
  
  const validated = await schema.parseAsync(body);
  
  const { data, error } = await supabase
    .from('organizations')
    .insert({
      tenant_id: tenantId,
      ...validated,
    })
    .select();
  
  if (error) {
    logAuditEvent('organization_creation_failed', { error: error.message });
    return Response.json({ error: error.message }, { status: 400 });
  }
  
  logAuditEvent('organization_created', { id: data[0].id });
  
  return Response.json(data[0], { status: 201 });
}
```

### 8.2 Error Handling & Responses

```typescript
// src/lib/api/responses.ts
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId: string;
}

export class ApiErrorHandler {
  static unauthorized(): Response {
    return this.error(401, 'UNAUTHORIZED', 'Authentication required');
  }
  
  static forbidden(): Response {
    return this.error(403, 'FORBIDDEN', 'Insufficient permissions');
  }
  
  static notFound(): Response {
    return this.error(404, 'NOT_FOUND', 'Resource not found');
  }
  
  static validationError(details: Record<string, any>): Response {
    return this.error(400, 'VALIDATION_ERROR', 'Invalid input', details);
  }
  
  static rateLimited(): Response {
    return this.error(429, 'RATE_LIMITED', 'Too many requests');
  }
  
  private static error(
    status: number,
    code: string,
    message: string,
    details?: Record<string, any>
  ): Response {
    return Response.json(
      {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      } as ApiError,
      { status }
    );
  }
}

// Usage in route handlers
export async function GET(req: NextRequest) {
  try {
    // ... logic ...
  } catch (error) {
    if (error instanceof ValidationError) {
      return ApiErrorHandler.validationError(error.details);
    }
    Sentry.captureException(error);
    return ApiErrorHandler.error(500, 'INTERNAL_ERROR', 'An error occurred');
  }
}
```

---

## 9. Database Schema & Migrations

### 9.1 Core Schema

```sql
-- Tenants (root entity)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  status TEXT CHECK (status IN ('active', 'suspended', 'deleted')),
  plan TEXT DEFAULT 'basic',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tenant-User membership
CREATE TABLE tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_at TIMESTAMP,
  joined_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- Organizations (scoped to tenant)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  severity TEXT DEFAULT 'info',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tenant_members_tenant_id ON tenant_members(tenant_id);
CREATE INDEX idx_tenant_members_user_id ON tenant_members(user_id);
CREATE INDEX idx_organizations_tenant_id ON organizations(tenant_id);
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY organizations_tenant_isolation ON organizations
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_members_tenant_isolation ON tenant_members
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY audit_logs_tenant_isolation ON audit_logs
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

---

## 10. Production Deployment Checklist

### 10.1 Pre-Deployment

- [ ] All environment variables configured in Vercel KMS
- [ ] Database backups tested and verified
- [ ] RLS policies enabled on all tables
- [ ] SSL certificates valid
- [ ] Rate limiting configured
- [ ] Monitoring & alerting setup
- [ ] Incident response playbook prepared
- [ ] Disaster recovery plan tested
- [ ] Security scan passed (OWASP Top 10)
- [ ] Performance baseline established

### 10.2 Deployment Strategy

```yaml
Deployment Process:
  1. Pre-deployment validation
     - Run test suite (100% coverage target)
     - Security scan (SonarQube, Snyk)
     - Performance regression testing
  
  2. Staging deployment
     - Deploy to staging environment
     - Run integration tests
     - Performance benchmarking
     - Manual QA verification
  
  3. Production deployment
     - Blue-green deployment on Vercel
     - Gradual rollout (10% → 50% → 100%)
     - Real-time monitoring
     - Canary metrics validation
  
  4. Post-deployment
     - Verify all services healthy
     - Check error rates normal
     - Update status page
     - Notify stakeholders

Rollback Procedure:
  - If error rate > 0.5% → immediate rollback
  - If P99 latency > baseline * 1.5 → rollback
  - Max rollback time: 5 minutes
```

---

## 11. Disaster Recovery & High Availability

### 11.1 Backup Strategy

```yaml
Database Backups:
  - Frequency: Hourly (automated)
  - Retention: 30-day daily snapshots
  - Cross-region: US + EU replication
  - RPO (Recovery Point Objective): < 1 hour
  - RTO (Recovery Time Objective): < 15 minutes

Backup Verification:
  - Weekly restore tests
  - Automated backup integrity checks
  - Documented recovery procedures
  - Team training quarterly

Testing Schedule:
  - Monthly: Full disaster recovery drill
  - Quarterly: Cross-region failover test
  - Annually: Complete infrastructure rebuild
```

### 11.2 High Availability Configuration

```typescript
// Connection pooling for database
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        'x-client-info': 'next-saas/1.0',
      },
    },
    // Connection pooling settings
    db: {
      schema: 'public',
    },
  }
);

// Redis failover
import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv({
  automaticDeserialization: true,
  retryPolicy: {
    baseDelay: 10,
    maxRetries: 3,
    maxDuration: 30000,
  },
});
```

---

## 12. Cost Optimization

### 12.1 Resource Allocation

| Component | Optimization Strategy |
|-----------|----------------------|
| Compute | Serverless functions, auto-scaling, edge functions |
| Database | Connection pooling, query optimization, read replicas |
| Cache | TTL tuning, selective caching, compression |
| Storage | Compression, lifecycle policies, CDN distribution |
| Bandwidth | CDN caching, compression, region optimization |

### 12.2 Cost Monitoring

```typescript
// src/lib/billing/cost-tracking.ts
export async function trackUsage(
  tenantId: string,
  metric: string,
  quantity: number
) {
  // Log usage
  const { error } = await supabase
    .from('usage_logs')
    .insert({
      tenant_id: tenantId,
      metric,
      quantity,
      timestamp: new Date(),
    });
  
  // Check quotas
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, quotas')
    .eq('tenant_id', tenantId)
    .single();
  
  const allowed = subscription.quotas[metric];
  const current = await getMonthlyUsage(tenantId, metric);
  
  if (current >= allowed * 0.8) {
    // Alert tenant at 80%
    sendWarning(tenantId, `You've used ${current} of ${allowed} ${metric}`);
  }
  
  if (current > allowed) {
    // Enforce limit
    throw new QuotaExceededError(metric);
  }
}
```

---

## 13. Key Metrics & SLOs

### 13.1 Service Level Objectives

| Metric | Target | Monitor |
|--------|--------|---------|
| Availability | 99.95% | Uptime monitoring |
| Response Time (p99) | < 500ms | APM |
| Error Rate | < 0.1% | Error tracking |
| Database Query Time (p95) | < 100ms | Query logs |
| Cache Hit Ratio | > 80% | Redis metrics |
| MTTR (Mean Time to Recover) | < 15 min | Incident tracking |

### 13.2 Alerting Rules

```yaml
Critical Alerts:
  - Database connection pool exhausted
  - Error rate > 1%
  - API response time p99 > 1s
  - Memory usage > 90%
  - Disk space > 85%
  - Redis connectivity lost

Warning Alerts:
  - Error rate > 0.5%
  - Response time p99 > 600ms
  - Rate limit violations
  - Certificate expiration < 30 days
  - Backup failure
  - Unusual traffic patterns
```

---

## 14. Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, Next.js 16 | UI & SSR |
| **Backend** | Next.js API Routes | Serverless API |
| **Database** | PostgreSQL (Supabase) | Primary data store |
| **Cache** | Redis (Upstash) | Session & rate limit cache |
| **Auth** | NextAuth.js + Supabase | Authentication |
| **CDN** | Vercel Edge | Global content delivery |
| **Hosting** | Vercel | Application platform |
| **Monitoring** | Sentry, DataDog | Observability |
| **Logging** | Axiom, CloudWatch | Log aggregation |
| **Storage** | S3 / Supabase Storage | File storage |

---

## 15. Transition from Current to Production

### Phase 1: Foundation (Weeks 1-2)
- [ ] Implement comprehensive middleware
- [ ] Set up RLS policies
- [ ] Configure authentication
- [ ] Enable audit logging

### Phase 2: Security (Weeks 3-4)
- [ ] Implement encryption at rest/transit
- [ ] Add security headers
- [ ] Set up rate limiting
- [ ] Configure CORS policies

### Phase 3: Observability (Weeks 5-6)
- [ ] Set up Sentry integration
- [ ] Configure structured logging
- [ ] Implement APM
- [ ] Create monitoring dashboards

### Phase 4: Performance (Weeks 7-8)
- [ ] Implement caching strategy
- [ ] Optimize database queries
- [ ] Set up CDN
- [ ] Conduct load testing

### Phase 5: Operations (Weeks 9-10)
- [ ] Disaster recovery planning
- [ ] Deployment automation
- [ ] Incident response procedures
- [ ] Documentation completion

---

## Appendix A: Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJhbGci...
SUPABASE_ANON_KEY=...

# Cache
UPSTASH_REDIS_URL=redis://default:...@...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Authentication
NEXTAUTH_URL=https://app.example.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Monitoring
SENTRY_DSN=https://...
AXIOM_DATASET=...
AXIOM_TOKEN=...

# Vercel
VERCEL_PROJECT_ID=...
VERCEL_ORG_ID=...
VERCEL_TOKEN=...

# Secrets
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Appendix B: Useful Resources

- [Next.js Multi-Tenant Guide](https://nextjs.org/docs/app/guides/multi-tenant)
- [Supabase RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [12 Factor App](https://12factor.net/)
- [SRE Book - Google](https://sre.google/books/)

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Author:** Enterprise Architecture Team  
**Status:** Production Ready
