import { sanitizeHtml, sanitizeForLog, validateAndSanitize, userInputSchema, productSchema, tenantSchema } from '@/lib/security/validation';

describe('Security Validation', () => {
  describe('sanitizeHtml', () => {
    it('removes HTML tags', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('');
      expect(sanitizeHtml('Hello <b>World</b>')).toBe('Hello World');
    });
  });

  describe('sanitizeForLog', () => {
    it('removes newlines and limits length', () => {
      expect(sanitizeForLog('test\nvalue')).toBe('test_value');
      expect(sanitizeForLog('a'.repeat(150)).length).toBe(100);
    });
  });

  describe('userInputSchema', () => {
    it('validates correct user input', () => {
      const valid = { name: 'John Doe', email: 'john@example.com' };
      expect(() => validateAndSanitize(userInputSchema, valid)).not.toThrow();
    });

    it('rejects invalid email', () => {
      const invalid = { name: 'John', email: 'invalid' };
      expect(() => validateAndSanitize(userInputSchema, invalid)).toThrow();
    });
  });

  describe('productSchema', () => {
    it('validates correct product', () => {
      const valid = { name: 'Product', price: 99.99, sku: 'SKU-123' };
      expect(() => validateAndSanitize(productSchema, valid)).not.toThrow();
    });

    it('rejects negative price', () => {
      const invalid = { name: 'Product', price: -10, sku: 'SKU-123' };
      expect(() => validateAndSanitize(productSchema, invalid)).toThrow();
    });
  });

  describe('tenantSchema', () => {
    it('validates correct tenant', () => {
      const valid = { name: 'Company', subdomain: 'company' };
      expect(() => validateAndSanitize(tenantSchema, valid)).not.toThrow();
    });

    it('rejects invalid subdomain', () => {
      const invalid = { name: 'Company', subdomain: 'AB' };
      expect(() => validateAndSanitize(tenantSchema, invalid)).toThrow();
    });
  });
});
