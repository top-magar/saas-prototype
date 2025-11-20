import { GET } from '@/app/api/health/route';

jest.mock('@/lib/database/connection-pool', () => ({
  checkDatabaseHealth: jest.fn().mockResolvedValue(true),
}));

jest.mock('@/lib/cache/redis', () => ({
  getRedisClient: jest.fn(() => ({
    ping: jest.fn().mockResolvedValue('PONG'),
  })),
}));

describe('Health API', () => {
  it('returns healthy status', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.services.database).toBe('up');
    expect(data.services.redis).toBe('up');
  });
});
