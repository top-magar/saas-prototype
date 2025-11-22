import { getRedisClient } from './upstash-client';
import { CachedTenant } from '@/lib/types/tenant';
import { logger } from '@/lib/monitoring/logger';

const CACHE_TTL = 300; // 5 minutes
const CACHE_PREFIX = 'tenant:';

export async function getTenantFromCache(identifier: string): Promise<CachedTenant | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const key = `${CACHE_PREFIX}${identifier}`;
    const cached = await redis.get<CachedTenant>(key);
    return cached;
  } catch (error) {
    logger.error('Cache get error', error, { identifier });
    return null;
  }
}

export async function setTenantCache(identifier: string, tenant: CachedTenant): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const key = `${CACHE_PREFIX}${identifier}`;
    await redis.setex(key, CACHE_TTL, tenant);
  } catch (error) {
    logger.error('Cache set error', error, { identifier });
  }
}

export async function deleteTenantCache(identifier: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const key = `${CACHE_PREFIX}${identifier}`;
    await redis.del(key);
  } catch (error) {
    logger.error('Cache delete error', error, { identifier });
  }
}

export async function warmTenantCache(tenants: CachedTenant[]): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const pipeline = redis.pipeline();

    tenants.forEach(tenant => {
      // Cache by subdomain
      if (tenant.subdomain) {
        pipeline.setex(`${CACHE_PREFIX}${tenant.subdomain}`, CACHE_TTL, JSON.stringify(tenant));
      }

      // Cache by custom domain
      if (tenant.custom_domain) {
        pipeline.setex(`${CACHE_PREFIX}${tenant.custom_domain}`, CACHE_TTL, JSON.stringify(tenant));
      }
    });

    await pipeline.exec();
  } catch (error) {
    logger.error('Cache warming error', error);
  }
}
