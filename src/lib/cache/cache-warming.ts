import { supabaseAdmin } from '@/lib/database/supabase';
import { warmTenantCache } from './tenant-cache';
import { TenantInfo } from '@/lib/middleware/tenant-resolver';
import { logger } from '@/lib/monitoring/logger';

export async function warmAllTenants(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    logger.cache('Cache warming starting...');

    const { data: tenants, error } = await supabaseAdmin
      .from('tenants')
      .select('id, subdomain, custom_domain, settings, status, name, tier')
      .eq('status', 'active');

    if (error) {
      logger.error('Cache warming DB error', error);
      return { success: false, count: 0, error: error.message };
    }

    if (!tenants || tenants.length === 0) {
      logger.cache('No active tenants found for cache warming');
      return { success: true, count: 0 };
    }

    const cachedTenants: TenantInfo[] = tenants.map(t => ({
      id: t.id,
      subdomain: t.subdomain,
      custom_domain: t.custom_domain,
      status: t.status,
      name: t.name || 'Unknown',
      tier: t.tier || 'free'
    }));

    await warmTenantCache(cachedTenants);

    logger.cache(`Cache warming complete: ${cachedTenants.length} entries cached`);
    return { success: true, count: cachedTenants.length };

  } catch (error: any) {
    console.error('[Cache Warming] Error:', error);
    return { success: false, count: 0, error: error.message };
  }
}

export async function warmSingleTenant(tenantId: string): Promise<boolean> {
  try {
    const { data: tenant, error } = await supabaseAdmin
      .from('tenants')
      .select('id, subdomain, custom_domain, settings, status, name, tier')
      .eq('id', tenantId)
      .single();

    if (error || !tenant) {
      logger.error('Cache warming tenant not found', undefined, { tenantId });
      return false;
    }

    const cachedTenant: TenantInfo = {
      id: tenant.id,
      subdomain: tenant.subdomain,
      custom_domain: tenant.custom_domain,
      status: tenant.status,
      name: tenant.name || 'Unknown',
      tier: tenant.tier || 'free'
    };

    await warmTenantCache([cachedTenant]);
    return true;

  } catch (error) {
    console.error('[Cache Warming] Error:', error);
    return false;
  }
}
