import { getRedisClient } from './upstash-client';
import { supabaseAdmin } from '@/lib/database/supabase';
import { logger } from '@/lib/monitoring/logger';

const CACHE_PREFIX = 'tenant:v1:';

export async function invalidateTenantCache(
  subdomain: string,
  customDomain?: string | null
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) {
    logger.cache('Redis not available, skipping cache invalidation');
    return;
  }

  const keys = [`${CACHE_PREFIX}${subdomain}`];
  if (customDomain) {
    keys.push(`${CACHE_PREFIX}${customDomain}`);
  }

  try {
    const deleted = await redis.del(...keys);
    logger.cache(`Cache invalidated: ${keys.join(', ')} (${deleted} keys deleted)`);
  } catch (error) {
    logger.error('Cache invalidation error', error);
    throw error;
  }
}

export async function invalidateTenantById(tenantId: string): Promise<void> {
  const { data: tenant } = await supabaseAdmin
    .from('tenants')
    .select('subdomain, custom_domain')
    .eq('id', tenantId)
    .single();

  if (tenant) {
    await invalidateTenantCache(tenant.subdomain, tenant.custom_domain);
  }
}

export async function invalidateAllTenants(): Promise<number> {
  const redis = getRedisClient();
  if (!redis) return 0;

  try {
    const keys = await redis.keys(`${CACHE_PREFIX}*`);
    if (keys.length === 0) return 0;

    const deleted = await redis.del(...keys);
    logger.cache(`Cache cleared all: ${deleted} keys deleted`);
    return deleted;
  } catch (error) {
    logger.error('Cache clear all error', error);
    throw error;
  }
}

export async function invalidatePattern(pattern: string): Promise<number> {
  const redis = getRedisClient();
  if (!redis) return 0;

  try {
    const keys = await redis.keys(`${CACHE_PREFIX}${pattern}`);
    if (keys.length === 0) return 0;

    const deleted = await redis.del(...keys);
    logger.cache(`Cache pattern delete: ${pattern} (${deleted} keys)`);
    return deleted;
  } catch (error) {
    logger.error('Cache pattern delete error', error, { pattern });
    throw error;
  }
}
