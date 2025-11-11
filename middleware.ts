import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/health',
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  
  // Extract subdomain
  const subdomain = hostname.split('.')[0];
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000';
  
  // Skip middleware for localhost, main domain, and reserved subdomains
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1') || 
      subdomain === 'www' || subdomain === domain.split('.')[0] ||
      ['api', 'admin', 'app', 'mail', 'ftp'].includes(subdomain)) {
    
    // Protect non-public routes for main domain
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
    return NextResponse.next();
  }
  
  // Handle subdomain routing for production
  if (subdomain && subdomain !== hostname && !url.pathname.startsWith('/tenant/')) {
    const rewriteUrl = new URL(`/tenant/${subdomain}${url.pathname}`, req.url);
    rewriteUrl.search = url.search;
    
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('x-tenant-subdomain', subdomain);
    
    return response;
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