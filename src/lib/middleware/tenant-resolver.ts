import { supabaseAdmin } from '@/lib/database/supabase';
import { getCachedTenant, setCachedTenant } from '@/lib/cache/tenant-cache';
import { trackTenantResolution, trackCacheHit, logTenantError } from '@/lib/monitoring/middleware-metrics';

export interface TenantInfo {
  id: string;
  subdomain: string;
  custom_domain: string | null;
  name: string;
  status: string;
  tier: string;
}

const RESERVED = ['www', 'api', 'admin', 'app', 'dashboard', 'cdn', 'static'];

export async function resolveTenant(hostname: string): Promise<TenantInfo | null> {
  const start = Date.now();
  
  try {
    const cached = await getCachedTenant(hostname);
    if (cached) {
      trackCacheHit(true, hostname);
      trackTenantResolution({ duration: Date.now() - start, cached: true, tenantType: 'subdomain', success: true });
      return cached;
    }
    trackCacheHit(false, hostname);

    const { data, error } = await supabaseAdmin
      .from('tenants')
      .select('id, subdomain, custom_domain, name, status, tier')
      .or(`subdomain.eq.${hostname},custom_domain.eq.${hostname}`)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (data) await setCachedTenant(hostname, data);
    
    trackTenantResolution({ 
      duration: Date.now() - start, 
      cached: false, 
      tenantType: data?.custom_domain ? 'custom' : 'subdomain', 
      success: !!data 
    });
    
    return data;
  } catch (error) {
    logTenantError(error as Error, { hostname });
    return null;
  }
}

export function extractTenant(hostname: string, rootDomain: string): {
  type: 'subdomain' | 'custom' | 'root';
  value: string | null;
} {
  const host = hostname.split(':')[0];

  if (host === rootDomain) return { type: 'root', value: null };

  if (host.endsWith(`.${rootDomain}`)) {
    const subdomain = host.replace(`.${rootDomain}`, '');
    if (RESERVED.includes(subdomain)) return { type: 'root', value: null };
    return { type: 'subdomain', value: subdomain };
  }

  return { type: 'custom', value: host };
}

export function shouldBypass(pathname: string): boolean {
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  );
}

export function normalizeWWW(hostname: string): string | null {
  return hostname.startsWith('www.') ? hostname.replace('www.', '') : null;
}
