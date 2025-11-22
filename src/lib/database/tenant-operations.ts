import { supabaseAdmin } from './supabase';
import { invalidateTenantCache } from '@/lib/cache/invalidation';

export interface TenantUpdate {
  subdomain?: string;
  custom_domain?: string | null;
  settings?: Record<string, any>;
  status?: string;
  name?: string;
  tier?: string;
}

export async function updateTenant(
  tenantId: string,
  updates: TenantUpdate
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current tenant data for cache invalidation
    const { data: currentTenant } = await supabaseAdmin
      .from('tenants')
      .select('subdomain, custom_domain')
      .eq('id', tenantId)
      .single();

    if (!currentTenant) {
      return { success: false, error: 'Tenant not found' };
    }

    // Update database
    const { data: updatedTenant, error } = await supabaseAdmin
      .from('tenants')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
      .select('subdomain, custom_domain')
      .single();

    if (error) {
      console.error('[Tenant] Update error:', error);
      return { success: false, error: error.message };
    }

    // Invalidate old cache keys
    await invalidateTenantCache(
      currentTenant.subdomain,
      currentTenant.custom_domain
    );

    // Invalidate new cache keys if subdomain or domain changed
    if (updatedTenant && (
      updates.subdomain || 
      updates.custom_domain !== undefined
    )) {
      await invalidateTenantCache(
        updatedTenant.subdomain,
        updatedTenant.custom_domain
      );
    }

    console.log(`[Tenant] Updated: ${tenantId}`);
    return { success: true };

  } catch (error: any) {
    console.error('[Tenant] Update error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateTenantSettings(
  tenantId: string,
  settings: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('subdomain, custom_domain, settings')
      .eq('id', tenantId)
      .single();

    if (!tenant) {
      return { success: false, error: 'Tenant not found' };
    }

    const mergedSettings = { ...tenant.settings, ...settings };

    const { error } = await supabaseAdmin
      .from('tenants')
      .update({
        settings: mergedSettings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId);

    if (error) {
      return { success: false, error: error.message };
    }

    await invalidateTenantCache(tenant.subdomain, tenant.custom_domain);

    console.log(`[Tenant] Settings updated: ${tenantId}`);
    return { success: true };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function suspendTenant(
  tenantId: string
): Promise<{ success: boolean; error?: string }> {
  return updateTenant(tenantId, { status: 'suspended' });
}

export async function activateTenant(
  tenantId: string
): Promise<{ success: boolean; error?: string }> {
  return updateTenant(tenantId, { status: 'active' });
}

export async function bulkUpdateTenants(
  tenantIds: string[],
  updates: TenantUpdate
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const tenantId of tenantIds) {
    const result = await updateTenant(tenantId, updates);
    if (result.success) {
      success++;
    } else {
      failed++;
      console.error(`[Tenant] Bulk update failed for ${tenantId}:`, result.error);
    }
  }

  console.log(`[Tenant] Bulk update complete: ${success} success, ${failed} failed`);
  return { success, failed };
}
