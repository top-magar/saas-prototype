export enum TenantTier {
  FREE = "FREE",
  STARTER = "STARTER",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

export type UserRole = 'admin' | 'manager' | 'user';

export interface CustomerData {
  email: string;
  name?: string;
  phone?: string;
  tenantId: string;
}

export interface CouponValidation {
  isValid: boolean;
  discount: number;
  freeShipping: boolean;
  message?: string;
}