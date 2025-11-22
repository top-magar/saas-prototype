import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// 5 domain operations per hour per tenant
export const domainRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      prefix: 'ratelimit:domain',
    })
  : null;

export async function checkRateLimit(identifier: string): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  if (!domainRateLimit) {
    return { success: true };
  }

  const result = await domainRateLimit.limit(identifier);
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}
