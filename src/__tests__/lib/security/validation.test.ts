import { 
  userInputSchema, 
  productSchema, 
  tenantSchema,
  sanitizeHtml,
  sanitizeForLog,
  validateAndSanitize 
} from '../../../lib/security/validation';

describe('Input Validation', () => {
  describe('userInputSchema', () => {
    it('should validate correct user input', () => {
      const validInput = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      expect(() => validateAndSanitize(userInputSchema, validInput)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidInput = {
        name: 'John Doe',
        email: 'invalid-email',
      };
      expect(() => validateAndSanitize(userInputSchema, invalidInput)).toThrow();
    });

    it('should reject malicious input', () => {
      const maliciousInput = {
        name: '<script>alert("xss")</script>',
        email: 'test@example.com',
      };
      expect(() => validateAndSanitize(userInputSchema, maliciousInput)).toThrow();
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      const result = sanitizeHtml(input);
      expect(result).toBe('alert("xss")Hello');
    });

    it('should remove simple HTML tags', () => {
      const input = '<div>Hello</div>';
      const result = sanitizeHtml(input);
      expect(result).toBe('Hello');
    });
  });

  describe('sanitizeForLog', () => {
    it('should sanitize log injection attempts', () => {
      const input = 'user\ninjection\rattack\ttab';
      const result = sanitizeForLog(input);
      expect(result).toBe('user_injection_attack_tab');
    });

    it('should limit string length', () => {
      const longInput = 'a'.repeat(200);
      const result = sanitizeForLog(longInput);
      expect(result.length).toBe(100);
    });
  });
});