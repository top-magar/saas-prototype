import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyDNSTXTRecord, getDNSErrorMessage } from '@/lib/verification/dns';
import { getVerificationAttempt, updateVerificationAttempt } from '@/lib/verification/storage';
import { supabaseAdmin } from '@/lib/database/supabase';
import { deleteTenantCache } from '@/lib/cache/tenant-redis';

const CheckSchema = z.object({
  tenantId: z.string().uuid(),
  domain: z.string().min(3),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = CheckSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { tenantId, domain } = validation.data;

    const attempt = await getVerificationAttempt(tenantId, domain);

    if (!attempt) {
      return NextResponse.json(
        { error: 'No verification attempt found' },
        { status: 404 }
      );
    }

    if (attempt.status === 'verified') {
      return NextResponse.json({
        verified: true,
        status: 'verified',
        verifiedAt: attempt.verified_at,
      });
    }

    const result = await verifyDNSTXTRecord(domain, attempt.verification_token);

    await updateVerificationAttempt(attempt.id, {
      attempts: attempt.attempts + 1,
      status: result.verified ? 'verified' : 'pending',
      error_message: result.error,
      verified_at: result.verified ? new Date().toISOString() : undefined,
    });

    if (result.verified) {
      const { data: tenant } = await supabaseAdmin
        .from('tenants')
        .update({
          domain_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tenantId)
        .select()
        .single();

      if (tenant) {
        await deleteTenantCache(tenant);
      }
    }

    return NextResponse.json({
      verified: result.verified,
      status: result.verified ? 'verified' : 'pending',
      propagated: result.propagated,
      records: result.records,
      attempts: attempt.attempts + 1,
      message: result.verified
        ? 'Domain verified successfully!'
        : getDNSErrorMessage(result.error),
    });

  } catch (error) {
    console.error('[Verification] Check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
