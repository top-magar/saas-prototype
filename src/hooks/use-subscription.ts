"use client";

import { useTenant } from "@/lib/tenant-context";
import { checkLimit, SUBSCRIPTION_LIMITS } from "@/lib/subscription";
import { TenantTier } from "@/lib/shared/types";

export function useSubscription() {
  const { tenant } = useTenant();
  const tier = (tenant?.tier as TenantTier) || TenantTier.FREE;

  const canAddProduct = (currentCount: number) => checkLimit(tier, "products", currentCount);
  const canAddUser = (currentCount: number) => checkLimit(tier, "users", currentCount);
  const canUseStorage = (currentUsage: number) => checkLimit(tier, "storage", currentUsage);
  const canMakeApiCall = (currentCount: number) => checkLimit(tier, "apiCalls", currentCount);

  const limits = SUBSCRIPTION_LIMITS[tier];

  return {
    tier,
    limits,
    canAddProduct,
    canAddUser,
    canUseStorage,
    canMakeApiCall,
  };
}