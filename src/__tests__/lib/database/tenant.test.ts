import { isValidSubdomain, getTenantUrl } from '@/lib/database/tenant';

describe('Tenant Utilities', () => {
  describe('isValidSubdomain', () => {
    it('accepts valid subdomains', () => {
      expect(isValidSubdomain('mycompany')).toBe(true);
      expect(isValidSubdomain('my-company')).toBe(true);
      expect(isValidSubdomain('company123')).toBe(true);
    });

    it('rejects invalid subdomains', () => {
      expect(isValidSubdomain('www')).toBe(false);
      expect(isValidSubdomain('api')).toBe(false);
      expect(isValidSubdomain('My-Company')).toBe(false);
      expect(isValidSubdomain('my_company')).toBe(false);
    });
  });

  describe('getTenantUrl', () => {
    it('generates correct URL', () => {
      process.env.NEXT_PUBLIC_DOMAIN = 'example.com';
      process.env.NODE_ENV = 'production';
      
      const url = getTenantUrl('mycompany', '/dashboard');
      expect(url).toBe('https://mycompany.example.com/dashboard');
    });

    it('uses http in development', () => {
      process.env.NODE_ENV = 'development';
      process.env.NEXT_PUBLIC_DOMAIN = 'localhost:3000';
      
      const url = getTenantUrl('test');
      expect(url).toBe('http://test.localhost:3000');
    });
  });
});
