import { checkDatabaseHealth } from '@/lib/database/connection-pool';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        limit: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: { id: '1' }, error: null }),
        })),
      })),
    })),
  })),
}));

describe('Database Connection Pool', () => {
  it('checks database health successfully', async () => {
    const result = await checkDatabaseHealth();
    expect(result).toBe(true);
  });
});
