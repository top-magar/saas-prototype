import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/database/supabase';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/verify-email?error=invalid', req.url));
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email_verification_token', token)
    .gt('email_verification_token_expires_at', new Date().toISOString())
    .single();

  if (!user) {
    return NextResponse.redirect(new URL('/verify-email?error=invalid', req.url));
  }

  await supabaseAdmin
    .from('users')
    .update({
      email_verified: true,
      email_verification_token: null,
      email_verification_token_expires_at: null,
    })
    .eq('id', user.id);

  return NextResponse.redirect(new URL('/verify-email?success=true', req.url));
}
