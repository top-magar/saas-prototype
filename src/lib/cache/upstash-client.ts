import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('[Redis] Upstash credentials not configured, caching disabled');
    return null;
  }

  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  return redis;
}

export function isRedisAvailable(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient();
    if (!client) return null;

    // Upstash automatically parses JSON if it was stored as JSON
    const cached = await client.get<T>(key);
    return cached;
  } catch (error) {
    console.error('[Cache] Get error:', error, { key });
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttl: number = 3600): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;

    await client.setex(key, ttl, value);
  } catch (error) {
    console.error('[Cache] Set error:', error, { key });
  }
}

export async function cacheDelete(key: string): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;

    await client.del(key);
  } catch (error) {
    console.error('[Cache] Delete error:', error, { key });
  }
}
