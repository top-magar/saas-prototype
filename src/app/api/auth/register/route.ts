import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/database/supabase';
import { createTenantAndAssociateUser } from '@/lib/database/tenant';
import { sendVerificationEmail } from '@/lib/email/verification';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    console.log('[Register] Starting registration for:', email);

    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Auto-create tenant
    const subdomain = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20) + '-' + crypto.randomUUID().slice(0, 4);

    await createTenantAndAssociateUser({
      email,
      name: `${name}'s Store`,
      subdomain,
      userName: name,
    });

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Update password hash and verification token
    await supabaseAdmin
      .from('users')
      .update({ 
        password_hash: hashedPassword,
        email_verification_token: verificationToken,
        email_verification_token_expires_at: expiresAt.toISOString(),
      })
      .eq('email', email);

    await sendVerificationEmail(email, name, verificationToken);

    return NextResponse.json({ 
      success: true,
      message: 'Please check your email to verify your account'
    });
  } catch (error) {
    console.error('[Register] Error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
