import { z } from 'zod';
import validator from 'validator';

// Input validation schemas
export const userInputSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\s\-_]+$/),
  email: z.string().email(),
  phone: z.string().optional().refine(val => !val || val === '' || validator.isMobilePhone(val), {
    message: 'Invalid phone number format'
  }),
});

export const productSchema = z.object({
  name: z.string().min(1).max(200).regex(/^[a-zA-Z0-9\s\-_.,()]+$/),
  description: z.string().max(1000).optional(),
  price: z.number().positive().max(999999.99),
  sku: z.string().min(1).max(50).regex(/^[a-zA-Z0-9\-_]+$/),
});

export const tenantSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\s\-_]+$/),
  subdomain: z.string().min(3).max(50).regex(/^[a-z0-9\-]+$/),
});

// Sanitization functions
export function sanitizeHtml(input: string): string {
  return input.replace(/<[^>]*>?/g, '');
}

export function sanitizeForLog(input: unknown): string {
  if (typeof input === 'string') {
    return input.replace(/[\r\n\t]/g, '_').substring(0, 100);
  }
  return String(input).replace(/[\r\n\t]/g, '_').substring(0, 100);
}

export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.message}`);
  }
  return result.data;
}