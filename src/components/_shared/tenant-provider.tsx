'use client';
import { Tenant, TenantContext, TenantContextType } from '@/lib/tenant-context';
import { ReactNode, useEffect, useState } from 'react';

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await fetch('/api/tenants/current');
        if (response.ok) {
          const data = await response.json();
          setTenant(data);
        } else {
          console.error('Failed to fetch tenant');
          setTenant(null);
        }
      } catch (error) {
        console.error('Error fetching tenant:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenant();
  }, []);

  const value: TenantContextType = { tenant, isLoading };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};