import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { parseHostname, lookupTenant, shouldBypassTenantRouting, redirectWWW } from '@/lib/middleware/tenant-lookup';
import { logger } from '@/lib/monitoring/logger';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { securityHeaders } from '@/lib/security/csp';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  try {
    // 0. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await checkRateLimit(ip, 'public');

    if (!rateLimitResult.success) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return new NextResponse('Too Many Requests', { status: 429 });
    }

    // 1. Handle www → apex redirect
    const apexDomain = redirectWWW(hostname);
    if (apexDomain) {
      const url = new URL(req.url);
      url.hostname = apexDomain;
      logger.middleware(`Redirecting www to apex: ${hostname} → ${apexDomain}`);
      return NextResponse.redirect(url, 301);
    }

    // 2. Parse hostname to determine type
    const { type, identifier } = parseHostname(hostname);
    logger.middleware(`${hostname} → type: ${type}, identifier: ${identifier}`);

    // 3. Handle tenant routing
    if (type === 'subdomain' || type === 'custom') {
      if (!identifier) {
        logger.middleware('No identifier, passing through');
        return NextResponse.next();
      }

      // Bypass tenant routing for public/static routes
      if (shouldBypassTenantRouting(pathname)) {
        const response = NextResponse.next();
        response.headers.set('x-tenant-identifier', identifier);
        Object.entries(securityHeaders).forEach(([key, value]) => {
          response.headers.set(key, value as string);
        });
        return response;
      }

      // Lookup tenant
      const tenant = await lookupTenant(identifier, type);

      // Handle missing tenant
      if (!tenant) {
        logger.middleware(`Tenant not found: ${identifier}`);
        return NextResponse.rewrite(new URL('/404', req.url));
      }

      // Handle inactive tenant
      if (tenant.status && tenant.status !== 'active') {
        logger.middleware(`Tenant inactive: ${identifier}`);
        return NextResponse.rewrite(new URL('/tenant-suspended', req.url));
      }

      // Validate NEXTAUTH_SECRET if accessing dashboard
      if (pathname.startsWith('/dashboard')) {
        const secret = process.env.NEXTAUTH_SECRET;
        if (!secret) {
          logger.error('NEXTAUTH_SECRET not configured - cannot authenticate users');
          return NextResponse.redirect(new URL('/error?message=Configuration+error', req.url));
        }

        // Check authentication
        const token = await getToken({ req, secret });
        if (!token) {
          logger.middleware('Unauthorized dashboard access, redirecting to sign-in');
          return NextResponse.redirect(new URL('/sign-in', req.url));
        }

        // Verify user belongs to this tenant
        const userTenantId = token.tenantId as string;
        if (userTenantId && tenant.id !== userTenantId) {
          logger.warn('Cross-tenant access attempt blocked', {
            userTenantId,
            requestedTenantId: tenant.id,
            action: 'access_denied',
          });
          return NextResponse.redirect(
            new URL('/unauthorized?message=Access+denied+to+this+tenant', req.url)
          );
        }
      }

      // Rewrite to tenant route with context
      logger.middleware(`Rewriting to tenant route: ${identifier}`);
      const response = NextResponse.rewrite(new URL(`/tenant/${identifier}${pathname}`, req.url));
      response.headers.set('x-tenant-id', tenant.id);
      response.headers.set('x-tenant-subdomain', tenant.subdomain);
      response.headers.set('x-tenant-settings', JSON.stringify(tenant.settings || {}));

      // Cache control
      response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');

      // Security Headers
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value as string);
      });

      return response;
    }

    // 4. Dashboard auth protection for non-tenant routes
    if (pathname.startsWith('/dashboard')) {
      const secret = process.env.NEXTAUTH_SECRET;
      if (!secret) {
        console.error('[Middleware] FATAL: NEXTAUTH_SECRET not configured');
        return NextResponse.redirect(new URL('/error?message=Configuration+error', req.url));
      }

      const token = await getToken({ req, secret });
      if (!token) {
        console.log('[Middleware] Unauthorized dashboard access, redirecting to sign-in');
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }
    }

    // 5. Allow public routes
    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });
    return response;

  } catch (error) {
    logger.error('Middleware error', error);
    // Fail open - allow request to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
