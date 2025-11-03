import { TenantTier } from "@/lib/types";

export interface SubscriptionLimits {
  products: number;
  storage: number; // GB
  users: number;
  apiCalls: number; // per month
}

export const SUBSCRIPTION_LIMITS: Record<TenantTier, SubscriptionLimits> = {
  [TenantTier.FREE]: {
    products: 10,
    storage: 5,
    users: 1,
    apiCalls: 1000,
  },
  [TenantTier.STARTER]: {
    products: 100,
    storage: 50,
    users: 3,
    apiCalls: 10000,
  },
  [TenantTier.PRO]: {
    products: -1, // unlimited
    storage: 500,
    users: 10,
    apiCalls: 100000,
  },
  [TenantTier.ENTERPRISE]: {
    products: -1, // unlimited
    storage: -1, // unlimited
    users: -1, // unlimited
    apiCalls: -1, // unlimited
  },
};

export function checkLimit(tier: TenantTier, resource: keyof SubscriptionLimits, current: number): boolean {
  const limit = SUBSCRIPTION_LIMITS[tier][resource];
  return limit === -1 || current < limit;
}

export function getUsagePercentage(tier: TenantTier, resource: keyof SubscriptionLimits, current: number): number {
  const limit = SUBSCRIPTION_LIMITS[tier][resource];
  if (limit === -1) return 0; // unlimited
  return Math.min((current / limit) * 100, 100);
}