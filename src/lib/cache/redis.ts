import Redis from 'ioredis';
import { logger } from '@/lib/monitoring/logger';

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return null;
  }

  if (!redis) {
    redis = new Redis(process.env.UPSTASH_REDIS_REST_URL as string, {

      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }

  return redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient();
    if (!client) return null;

    const cached = await client.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    logger.error('Cache get error', error, { key });
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttl: number = 3600): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;

    await client.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error('Cache set error', error, { key });
  }
}

export async function cacheDelete(key: string): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;

    await client.del(key);
  } catch (error) {
    logger.error('Cache delete error', error, { key });
  }
}