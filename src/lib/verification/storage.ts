import { supabaseAdmin } from '@/lib/database/supabase';

export interface VerificationAttempt {
  id: string;
  tenantId: string;
  domain: string;
  verification_token: string;
  status: 'pending' | 'verified' | 'failed';
  attempts: number;
  last_attempt_at: string;
  verified_at?: string;
  error_message?: string;
  created_at: string;
}

export async function createVerificationAttempt(
  tenantId: string,
  domain: string,
  token: string
): Promise<VerificationAttempt | null> {
  const { data, error } = await supabaseAdmin
    .from('domain_verifications')
    .insert({
      tenantId: tenantId,
      domain,
      verification_token: token,
      status: 'pending',
      attempts: 0,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('[Verification] Create error:', error);
    return null;
  }

  return data;
}

export async function updateVerificationAttempt(
  id: string,
  updates: {
    status?: 'pending' | 'verified' | 'failed';
    attempts?: number;
    error_message?: string;
    verified_at?: string;
  }
): Promise<void> {
  await supabaseAdmin
    .from('domain_verifications')
    .update({
      ...updates,
      last_attempt_at: new Date().toISOString(),
    })
    .eq('id', id);
}

export async function getVerificationAttempt(
  tenantId: string,
  domain: string
): Promise<VerificationAttempt | null> {
  const { data } = await supabaseAdmin
    .from('domain_verifications')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('domain', domain)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return data;
}

export async function getPendingVerifications(): Promise<VerificationAttempt[]> {
  const { data } = await supabaseAdmin
    .from('domain_verifications')
    .select('*')
    .eq('status', 'pending')
    .lt('attempts', 10); // Max 10 attempts

  return data || [];
}
