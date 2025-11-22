import { supabaseAdmin } from '@/lib/database/supabase';
import { getTenantFromCache, setTenantCache } from '@/lib/cache/tenant-redis';
import { Tenant, HostnameType, CachedTenant } from '@/lib/types/tenant';
import { logger } from '@/lib/monitoring/logger';

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000';
const RESERVED = ['www', 'api', 'admin', 'app', 'dashboard', 'cdn', 'static', 'docs'];

export function parseHostname(hostname: string): { type: HostnameType; identifier: string | null } {
  const host = hostname.split(':')[0].toLowerCase();

  // Localhost & Private IPs
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    (host.startsWith('172.') && parseInt(host.split('.')[1]) >= 16 && parseInt(host.split('.')[1]) <= 31)
  ) {
    return { type: 'localhost', identifier: null };
  }

  // Root domain
  if (host === ROOT_DOMAIN) {
    return { type: 'root', identifier: null };
  }

  // Subdomain
  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = host.replace(`.${ROOT_DOMAIN}`, '');
    if (RESERVED.includes(subdomain)) {
      return { type: 'root', identifier: null };
    }
    return { type: 'subdomain', identifier: subdomain };
  }

  // Custom domain
  return { type: 'custom', identifier: host };
}

export async function lookupTenant(identifier: string, type: HostnameType): Promise<CachedTenant | null> {
  // Check cache
  const cached = await getTenantFromCache(identifier);
  if (cached) {
    logger.cache(`Tenant cache hit: ${identifier}`);
    return cached;
  }

  logger.cache(`Tenant cache miss: ${identifier}, querying DB`);

  // Query database
  try {
    const { data, error } = await supabaseAdmin
      .from('tenants')
      .select('id, subdomain, custom_domain, settings, status')
      .or(`subdomain.eq.${identifier},custom_domain.eq.${identifier}`)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        logger.tenant(`Tenant not found: ${identifier}`);
        return null;
      }
      throw error;
    }

    if (!data) return null;

    // Cache only the fields we need (matches CachedTenant type without timestamps)
    const tenant: CachedTenant = {
      id: data.id,
      subdomain: data.subdomain,
      custom_domain: data.custom_domain,
      settings: data.settings || {},
      status: data.status,
    };

    await setTenantCache(identifier, tenant);
    logger.tenant(`Tenant found and cached: ${identifier}`);

    return tenant;
  } catch (error) {
    logger.error('Tenant lookup error', error, { identifier, type });
    return null;
  }
}

export function shouldBypassTenantRouting(pathname: string): boolean {
  return (
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/public/') ||
    /\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf)$/.test(pathname)
  );
}

export function redirectWWW(hostname: string): string | null {
  if (hostname.startsWith('www.')) {
    return hostname.replace('www.', '');
  }
  return null;
}
