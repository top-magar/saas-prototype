import { cacheGet, cacheSet, cacheDelete } from './redis';
import { TenantInfo } from '@/lib/middleware/tenant-resolver';

const TENANT_CACHE_TTL = 3600; // 1 hour
const STALE_CACHE_TTL = 86400; // 24 hours (fallback)

export async function getCachedTenant(identifier: string): Promise<TenantInfo | null> {
  return await cacheGet<TenantInfo>(`tenant:${identifier}`);
}

export async function setCachedTenant(identifier: string, tenant: TenantInfo): Promise<void> {
  await Promise.all([
    cacheSet(`tenant:${identifier}`, tenant, TENANT_CACHE_TTL),
    cacheSet(`tenant:${identifier}:stale`, tenant, STALE_CACHE_TTL), // Stale fallback
  ]);
}

export async function invalidateTenantCache(tenant: TenantInfo): Promise<void> {
  const keys = [
    `tenant:${tenant.subdomain}`,
    `tenant:${tenant.subdomain}:stale`,
  ];
  
  if (tenant.custom_domain) {
    keys.push(`tenant:${tenant.custom_domain}`, `tenant:${tenant.custom_domain}:stale`);
  }
  
  await Promise.all(keys.map(key => cacheDelete(key)));
}

export async function warmTenantCache(tenants: TenantInfo[]): Promise<void> {
  await Promise.all(
    tenants.flatMap(tenant => [
      setCachedTenant(tenant.subdomain, tenant),
      tenant.custom_domain ? setCachedTenant(tenant.custom_domain, tenant) : Promise.resolve(),
    ])
  );
}
