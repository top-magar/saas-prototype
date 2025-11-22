import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/database/supabase';
import { AddDomainSchema } from '@/lib/domains/types';
import { verifyTenantOwnership, checkDomainConflict } from '@/lib/domains/auth';
import { addDomainToVercel, isVercelConfigured } from '@/lib/domains/vercel';
import { generateVerificationToken } from '@/lib/domains/dns';
import { deleteTenantCache } from '@/lib/cache/tenant-redis';
import { checkRateLimit } from '@/lib/domains/rate-limit';

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const rateLimitResult = await checkRateLimit(ip);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', reset: rateLimitResult.reset },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const validation = AddDomainSchema.safeParse(body);

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

    // Check domain conflict
    const hasConflict = await checkDomainConflict(domain, tenantId);
    if (hasConflict) {
      return NextResponse.json(
        { error: 'Domain already in use by another tenant' },
        { status: 409 }
      );
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Add to Vercel if configured
    if (isVercelConfigured()) {
      try {
        await addDomainToVercel(domain);
      } catch (error: any) {
        console.error('[Domain] Vercel add error:', error);
        return NextResponse.json(
          { error: 'Failed to add domain to platform', details: error.message },
          { status: 500 }
        );
      }
    }

    // Update database
    const { data: tenant, error: dbError } = await supabaseAdmin
      .from('tenants')
      .update({
        custom_domain: domain,
        domain_verified: false,
        verification_token: verificationToken,
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
    if (tenant) {
      await deleteTenantCache(tenant);
    }

    return NextResponse.json({
      success: true,
      domain,
      verificationToken,
      message: 'Domain added. Please add TXT record to verify ownership.',
    });

  } catch (error) {
    console.error('[Domain] Add error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
