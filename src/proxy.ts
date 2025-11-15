import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

const isApiRoute = createRouteMatcher(['/api(.*)']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Rate limiting for API routes
  if (isApiRoute(req)) {
    try {
      const { checkRateLimit } = await import('./lib/security/rate-limit');
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
      const rateLimit = await checkRateLimit(ip, 'api');
      
      if (!rateLimit.success) {
        return new NextResponse('Rate limit exceeded', { 
          status: 429,
          headers: rateLimit.headers,
        });
      }
      
      // Add rate limit headers to response
      const response = NextResponse.next();
      Object.entries(rateLimit.headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    } catch (error) {
      // Fail open if rate limiting service is down
      console.error('Rate limiting error:', error);
    }
  }

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};