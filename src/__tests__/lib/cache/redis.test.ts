import { cacheGet, cacheSet, cacheDelete } from '@/lib/cache/redis';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn().mockResolvedValue(JSON.stringify({ test: 'data' })),
    setex: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
  }));
});

describe('Redis Cache', () => {
  beforeEach(() => {
    process.env.UPSTASH_REDIS_REST_URL = 'redis://localhost:6379';
  });

  it('gets cached value', async () => {
    const result = await cacheGet('test-key');
    expect(result).toEqual({ test: 'data' });
  });

  it('sets cached value', async () => {
    await expect(cacheSet('test-key', { data: 'value' })).resolves.not.toThrow();
  });

  it('deletes cached value', async () => {
    await expect(cacheDelete('test-key')).resolves.not.toThrow();
  });

  it('returns null when Redis unavailable', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    const result = await cacheGet('test-key');
    expect(result).toBeNull();
  });
});
