import { headers } from 'next/headers';
import { TenantContext } from '@/lib/types/tenant';

/**
 * Get tenant context from request headers (Server Components)
 */
export async function getTenantContext(): Promise<TenantContext | null> {
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id');
  const tenantSubdomain = headersList.get('x-tenant-subdomain');
  const tenantSettings = headersList.get('x-tenant-settings');

  if (!tenantId || !tenantSubdomain) {
    return null;
  }

  return {
    id: tenantId,
    subdomain: tenantSubdomain,
    settings: tenantSettings ? parseTenantSettings(tenantSettings) : {},
  };
}

/**
 * Get tenant context from request (API Routes)
 */
export function getTenantContextFromRequest(req: Request): TenantContext | null {
  const tenantId = req.headers.get('x-tenant-id');
  const tenantSubdomain = req.headers.get('x-tenant-subdomain');
  const tenantSettings = req.headers.get('x-tenant-settings');

  if (!tenantId || !tenantSubdomain) {
    return null;
  }

  return {
    id: tenantId,
    subdomain: tenantSubdomain,
    settings: tenantSettings ? parseTenantSettings(tenantSettings) : {},
  };
}

/**
 * Parse tenant settings from JSON string
 */
export function parseTenantSettings(settingsJson: string): Record<string, any> {
  try {
    return JSON.parse(settingsJson);
  } catch {
    return {};
  }
}
