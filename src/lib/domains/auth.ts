import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/database/supabase';

export async function verifyTenantOwnership(req: NextRequest, tenantId: string): Promise<boolean> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.sub) {
    return false;
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('tenantId')
    .eq('id', token.sub)
    .single();

  return user?.tenantId === tenantId;
}

export async function checkDomainConflict(domain: string, excludeTenantId?: string): Promise<boolean> {
  let query = supabaseAdmin
    .from('tenants')
    .select('id')
    .eq('custom_domain', domain);

  if (excludeTenantId) {
    query = query.neq('id', excludeTenantId);
  }

  const { data } = await query.single();
  return !!data;
}
