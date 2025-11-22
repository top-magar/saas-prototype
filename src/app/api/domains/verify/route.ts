import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/database/supabase';
import { VerifyDomainSchema } from '@/lib/domains/types';
import { verifyTenantOwnership } from '@/lib/domains/auth';
import { verifyDomain, getDomainConfig, isVercelConfigured } from '@/lib/domains/vercel';
import { checkDNSRecords } from '@/lib/domains/dns';
import { deleteTenantCache } from '@/lib/cache/tenant-redis';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = VerifyDomainSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { domain, tenantId } = validation.data;

    // Check tenant ownership
    const isOwner = await verifyTenantOwnership(req, tenantId);
    if (!isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Verify tenant has this domain
    const { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('custom_domain, verification_token')
      .eq('id', tenantId)
      .single();

    if (tenant?.custom_domain !== domain) {
      return NextResponse.json(
        { error: 'Domain not configured for this tenant' },
        { status: 400 }
      );
    }

    let verified = false;
    let verificationDetails = null;

    // Check via Vercel if configured
    if (isVercelConfigured()) {
      try {
        const config = await verifyDomain(domain);
        verified = config.verified;
        verificationDetails = config.verification;
      } catch (error: any) {
        console.error('[Domain] Vercel verify error:', error);
      }
    }

    // Fallback: Check DNS records manually
    if (!verified) {
      const dns = await checkDNSRecords(domain);
      const hasVerificationRecord = dns.txtRecords.some(
        record => record.includes(tenant.verification_token || '')
      );
      verified = hasVerificationRecord;
    }

    // Update database if verified
    if (verified) {
      const { data: updatedTenant, error: dbError } = await supabaseAdmin
        .from('tenants')
        .update({
          domain_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tenantId)
        .select()
        .single();

      if (dbError) {
        console.error('[Domain] Database error:', dbError);
        return NextResponse.json(
          { error: 'Failed to update verification status' },
          { status: 500 }
        );
      }

      // Invalidate cache
      if (updatedTenant) {
        await deleteTenantCache(updatedTenant);
      }
    }

    return NextResponse.json({
      success: true,
      verified,
      domain,
      verification: verificationDetails,
      message: verified
        ? 'Domain verified successfully'
        : 'Domain verification pending. Please ensure TXT record is configured.',
    });

  } catch (error) {
    console.error('[Domain] Verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
