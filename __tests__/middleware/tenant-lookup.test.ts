import { parseHostname, shouldBypassTenantRouting, redirectWWW } from '@/lib/middleware/tenant-lookup';

describe('Tenant Lookup', () => {
  describe('parseHostname', () => {
    it('identifies localhost', () => {
      const result = parseHostname('localhost:3000');
      expect(result).toEqual({ type: 'localhost', identifier: null });
    });

    it('identifies root domain', () => {
      process.env.NEXT_PUBLIC_DOMAIN = 'myapp.com';
      const result = parseHostname('myapp.com');
      expect(result).toEqual({ type: 'root', identifier: null });
    });

    it('identifies subdomain', () => {
      process.env.NEXT_PUBLIC_DOMAIN = 'myapp.com';
      const result = parseHostname('tenant1.myapp.com');
      expect(result).toEqual({ type: 'subdomain', identifier: 'tenant1' });
    });

    it('identifies custom domain', () => {
      process.env.NEXT_PUBLIC_DOMAIN = 'myapp.com';
      const result = parseHostname('customdomain.com');
      expect(result).toEqual({ type: 'custom', identifier: 'customdomain.com' });
    });

    it('skips reserved subdomains', () => {
      process.env.NEXT_PUBLIC_DOMAIN = 'myapp.com';
      const result = parseHostname('www.myapp.com');
      expect(result).toEqual({ type: 'root', identifier: null });
    });
  });

  describe('shouldBypassTenantRouting', () => {
    it('bypasses health check', () => {
      expect(shouldBypassTenantRouting('/api/health')).toBe(true);
    });

    it('bypasses auth routes', () => {
      expect(shouldBypassTenantRouting('/api/auth/signin')).toBe(true);
    });

    it('bypasses Next.js internals', () => {
      expect(shouldBypassTenantRouting('/_next/static/chunk.js')).toBe(true);
    });

    it('does not bypass tenant routes', () => {
      expect(shouldBypassTenantRouting('/dashboard')).toBe(false);
    });
  });

  describe('redirectWWW', () => {
    it('redirects www to apex', () => {
      expect(redirectWWW('www.example.com')).toBe('example.com');
    });

    it('returns null for non-www domains', () => {
      expect(redirectWWW('example.com')).toBe(null);
    });
  });
});
