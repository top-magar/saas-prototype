import { headers } from 'next/headers';
import { supabase, supabaseAdmin } from './supabase';

export async function getTenant() {
  const headersList = await headers();
  const tenantSubdomain = headersList.get('x-tenant-subdomain');
  const tenantCustomDomain = headersList.get('x-tenant-custom-domain');

  if (!tenantSubdomain && !tenantCustomDomain) {
    return null;
  }

  let query = supabase.from('tenants').select('*');

  if (tenantSubdomain) {
    query = query.eq('subdomain', tenantSubdomain);
  } else if (tenantCustomDomain) {
    query = query.eq('custom_domain', tenantCustomDomain);
  }

  const { data } = await query.single();

  return data;
}

export async function getCurrentTenant() {
  const headersList = await headers();
  const tenantSubdomain = headersList.get('x-tenant-subdomain');
  const tenantCustomDomain = headersList.get('x-tenant-custom-domain');

  if (!tenantSubdomain && !tenantCustomDomain) {
    return null;
  }

  let query = supabase.from('tenants').select('*, users(*)');

  if (tenantSubdomain) {
    query = query.eq('subdomain', tenantSubdomain);
  } else if (tenantCustomDomain) {
    query = query.eq('custom_domain', tenantCustomDomain);
  }

  const { data } = await query.single();

  return data;
}

export function getTenantUrl(subdomain: string, path: string = '') {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${subdomain}.${domain}`;

  return `${baseUrl}${path}`;
}

export function isValidSubdomain(subdomain: string): boolean {
  const reservedSubdomains = ['www', 'api', 'admin', 'app', 'mail', 'ftp'];
  return !reservedSubdomains.includes(subdomain) && /^[a-z0-9-]+$/.test(subdomain);
}

interface CreateTenantAndAssociateUserParams {
  email: string;
  name: string;
  subdomain: string;
  userName: string;
  primaryColor?: string;
}

export async function createTenantAndAssociateUser({
  email,
  name,
  subdomain,
  userName,
  primaryColor,
}: CreateTenantAndAssociateUserParams) {
  const now = new Date().toISOString();

  const { data: newTenant, error: tenantError } = await supabaseAdmin
    .from('tenants')
    .insert({
      id: crypto.randomUUID(),
      name,
      subdomain,
      monthlyBudget: 0, // Default budget
      tier: 'STARTER', // Default tier
      status: 'active', // Default status
      createdAt: now, // Timestamp
      updatedAt: now, // Timestamp
    })
    .select()
    .single();

  if (tenantError || !newTenant) {
    throw new Error(`Failed to create tenant: ${tenantError?.message || 'Unknown error'}`);
  }

  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        tenantId: newTenant.id,
        updatedAt: now,
      })
      .eq('email', email);

    if (updateError) {
      throw new Error(`Failed to update user: ${updateError.message}`);
    }
  } else {
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        id: crypto.randomUUID(),
        email,
        name: userName,
        tenantId: newTenant.id,
        email_verified: true,
        createdAt: now,
        updatedAt: now,
      });

    if (insertError) {
      throw new Error(`Failed to create user: ${insertError.message}`);
    }
  }

  return newTenant;
}

export async function getTenantByCustomDomain(customDomain: string) {
  const { data } = await supabase
    .from('tenants')
    .select('*')
    .eq('custom_domain', customDomain)
    .single();

  return data;
}