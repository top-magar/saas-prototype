import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/database/supabase';
import { warmTenantCache } from '@/lib/cache/tenant-redis';
import { CachedTenant } from '@/lib/types/tenant';

export async function POST() {
  try {
    // Fetch all active tenants
    const { data: tenants, error } = await supabaseAdmin
      .from('tenants')
      .select('id, subdomain, custom_domain, settings, status')
      .eq('status', 'active');

    if (error) throw error;

    if (!tenants || tenants.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: 'No active tenants to warm',
      });
    }

    // Map to CachedTenant type
    const cachedTenants: CachedTenant[] = tenants.map(t => ({
      id: t.id,
      subdomain: t.subdomain,
      custom_domain: t.custom_domain,
      settings: t.settings || {},
      status: t.status,
    }));

    // Warm cache
    await warmTenantCache(cachedTenants);

    return NextResponse.json({
      success: true,
      count: tenants.length,
      message: `Successfully warmed ${tenants.length} cache entries`,
    });
  } catch (error: any) {
    console.error('Cache warming failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
