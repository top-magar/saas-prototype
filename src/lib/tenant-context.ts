import { createContext, useContext } from 'react';
import { TenantTier } from './types';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  tier: TenantTier;
}

export interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
}

export const TenantContext = createContext<TenantContextType | null>(null);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
