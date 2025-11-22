import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/database/supabase';
import { RemoveDomainSchema } from '@/lib/domains/types';
import { verifyTenantOwnership } from '@/lib/domains/auth';
import { removeDomainFromVercel, isVercelConfigured } from '@/lib/domains/vercel';
import { deleteTenantCache } from '@/lib/cache/tenant-redis';

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = RemoveDomainSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { tenantId } = validation.data;

    // Check tenant ownership
    const isOwner = await verifyTenantOwnership(req, tenantId);
    if (!isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get current domain
    const { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('custom_domain')
      .eq('id', tenantId)
      .single();

    if (!tenant?.custom_domain) {
      return NextResponse.json(
        { error: 'No custom domain configured' },
        { status: 404 }
      );
    }

    const domain = tenant.custom_domain;

    // Remove from Vercel if configured
    if (isVercelConfigured()) {
      try {
        await removeDomainFromVercel(domain);
      } catch (error: any) {
        console.error('[Domain] Vercel remove error:', error);
        // Continue even if Vercel removal fails
      }
    }

    // Update database
    const { data: updatedTenant, error: dbError } = await supabaseAdmin
      .from('tenants')
      .update({
        custom_domain: null,
        domain_verified: false,
        verification_token: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
      .select()
      .single();

    if (dbError) {
      console.error('[Domain] Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to update tenant' },
        { status: 500 }
      );
    }

    // Invalidate cache
    if (updatedTenant) {
      await deleteTenantCache({ ...updatedTenant, custom_domain: domain });
    }

    return NextResponse.json({
      success: true,
      message: 'Domain removed successfully',
    });

  } catch (error) {
    console.error('[Domain] Remove error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
