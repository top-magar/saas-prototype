import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateVerificationToken } from '@/lib/verification/token';
import { createVerificationAttempt } from '@/lib/verification/storage';
import { supabaseAdmin } from '@/lib/database/supabase';

const StartSchema = z.object({
  tenantId: z.string().uuid(),
  domain: z.string().min(3).max(253),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = StartSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { tenantId, domain } = validation.data;

    const { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('id', tenantId)
      .single();

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    const token = generateVerificationToken();

    const attempt = await createVerificationAttempt(tenantId, domain, token);

    if (!attempt) {
      return NextResponse.json(
        { error: 'Failed to create verification attempt' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      verificationToken: token,
      txtRecord: {
        host: `_verify-domain.${domain}`,
        type: 'TXT',
        value: token,
      },
      message: 'Add the TXT record to your DNS and click "Check Verification"',
    });

  } catch (error) {
    console.error('[Verification] Start error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
