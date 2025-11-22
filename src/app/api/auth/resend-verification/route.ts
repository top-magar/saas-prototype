import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/database/supabase';
import { sendVerificationEmail } from '@/lib/email/verification';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (!user || user.email_verified) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const verificationToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await supabaseAdmin
    .from('users')
    .update({
      email_verification_token: verificationToken,
      email_verification_token_expires_at: expiresAt.toISOString(),
    })
    .eq('id', user.id);

  await sendVerificationEmail(email, user.name, verificationToken);

  return NextResponse.json({ success: true });
}
