import { logAudit, getClientInfo } from '@/lib/security/audit-logger';

jest.mock('@/lib/database/connection-pool', () => ({
  supabaseServerClient: {
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('Audit Logger', () => {
  it('logs audit entry', async () => {
    await expect(logAudit({
      action: 'auth.login',
      userId: 'user-123',
      tenantId: 'tenant-123',
    })).resolves.not.toThrow();
  });

  it('extracts client info from request', () => {
    const request = new Request('http://localhost', {
      headers: {
        'x-forwarded-for': '192.168.1.1',
        'user-agent': 'Mozilla/5.0',
      },
    });
    const info = getClientInfo(request);
    expect(info.ipAddress).toBe('192.168.1.1');
    expect(info.userAgent).toBe('Mozilla/5.0');
  });
});
