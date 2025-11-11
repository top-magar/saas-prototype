'use client';

import { useState, useEffect } from 'react';
import { TenantContext, TenantContextType } from '@/lib/tenant-context';

interface TenantProviderProps {
  children: React.ReactNode;
  tenant?: {
    id: string;
    name: string;
    subdomain: string;
    tier: string;
    primaryColor?: string;
  };
}

export function TenantProvider({ children, tenant: initialTenant }: TenantProviderProps) {
  const [tenant, setTenant] = useState(initialTenant || null);
  const [isLoading, setIsLoading] = useState(!initialTenant);

  useEffect(() => {
    if (!initialTenant) {
      fetch('/api/tenants/current')
        .then(res => res.json())
        .then(data => {
          if (data.tenant) {
            setTenant(data.tenant);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [initialTenant]);

  const contextValue: TenantContextType = {
    tenant: tenant ? {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
      tier: tenant.tier as any,
    } : null,
    isLoading,
  };

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}