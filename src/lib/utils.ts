// Re-export commonly used utilities for backward compatibility
export { cn, generateSlug, sanitizeInput, validateEmail, withRetry } from './shared/utils';
export { safeApiCall } from './shared/api-types';
export type { ApiResponse } from './shared/api-types';
export { TenantTier } from './shared/types';
export type { UserRole, CustomerData, CouponValidation } from './shared/types';