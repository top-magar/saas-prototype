import { getTenant, invalidateTenantCache, getCacheMetrics, resetCacheMetrics } from '@/lib/cache/tenant-cache-v2';

jest.mock('@/lib/cache/upstash-client');
jest.mock('@/lib/database/supabase');

describe('Tenant Cache', () => {
  beforeEach(() => {
    resetCacheMetrics();
  });

  describe('getTenant', () => {
    it('returns tenant from cache on hit', async () => {
      const mockTenant = {
        id: 'uuid',
        subdomain: 'test',
        custom_domain: null,
        settings: {},
        is_active: true,
      };

      const { getRedisClient } = require('@/lib/cache/upstash-client');
      getRedisClient.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockTenant),
      });

      const result = await getTenant('test');

      expect(result).toEqual(mockTenant);
      const metrics = getCacheMetrics();
      expect(metrics.hits).toBe(1);
    });

    it('falls back to database on cache miss', async () => {
      const mockTenant = {
        id: 'uuid',
        subdomain: 'test',
        custom_domain: null,
        settings: {},
        status: 'active',
      };

      const { getRedisClient } = require('@/lib/cache/upstash-client');
      getRedisClient.mockReturnValue({
        get: jest.fn().mockResolvedValue(null),
        setex: jest.fn().mockResolvedValue('OK'),
      });

      const { supabaseAdmin } = require('@/lib/database/supabase');
      supabaseAdmin.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockTenant, error: null }),
      });

      const result = await getTenant('test');

      expect(result?.subdomain).toBe('test');
    });

    it('handles Redis errors gracefully', async () => {
      const { getRedisClient } = require('@/lib/cache/upstash-client');
      getRedisClient.mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('Redis error')),
      });

      const { supabaseAdmin } = require('@/lib/database/supabase');
      supabaseAdmin.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 'uuid', subdomain: 'test', status: 'active' },
          error: null,
        }),
      });

      const result = await getTenant('test');

      expect(result).toBeTruthy();
      const metrics = getCacheMetrics();
      expect(metrics.errors).toBe(1);
    });
  });
});
