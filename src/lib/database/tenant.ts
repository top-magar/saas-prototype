import { headers } from 'next/headers';
import { supabase, supabaseAdmin } from './supabase';

export async function getTenant() {
  const headersList = await headers();
  const tenantSubdomain = headersList.get('x-tenant-subdomain');
  
  if (!tenantSubdomain) {
    return null;
  }

  const { data } = await supabase
    .from('tenants')
    .select('*')
    .eq('subdomain', tenantSubdomain)
    .single();
  
  return data;
}

export async function getCurrentTenant() {
  const headersList = await headers();
  const tenantSubdomain = headersList.get('x-tenant-subdomain');
  
  if (!tenantSubdomain) {
    return null;
  }

  const { data } = await supabase
    .from('tenants')
    .select('*, users(*)')
    .eq('subdomain', tenantSubdomain)
    .single();
  
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
  clerkUserId: string;
  name: string;
  subdomain: string;
  email: string;
  userName: string;
  primaryColor?: string;
}

export async function createTenantAndAssociateUser({
  clerkUserId,
  name,
  subdomain,
  email,
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
      monthlyBudget: 0,
      updatedAt: now,
    })
    .select()
    .single();

  if (tenantError || !newTenant) {
    throw new Error(`Failed to create tenant: ${tenantError?.message || 'Unknown error'}`);
  }

  const { error: userError } = await supabaseAdmin
    .from('users')
    .upsert({
      id: crypto.randomUUID(),
      clerkUserId: clerkUserId,
      tenantId: newTenant.id,
      email,
      name: userName,
      updatedAt: now,
    });

  if (userError) {
    throw new Error(`Failed to create user: ${userError.message}`);
  }

  return newTenant;
}