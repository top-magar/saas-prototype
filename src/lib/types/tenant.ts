export type TenantStatus = 'active' | 'suspended' | 'pending' | 'inactive';

export interface TenantSettings {
  branding?: {
    logo?: string;
    primaryColor?: string;
    customCss?: string;
  };
  features?: {
    analytics?: boolean;
    customDomain?: boolean;
    apiAccess?: boolean;
  };
  limits?: {
    users?: number;
    storage?: number;
    apiCalls?: number;
  };
}

export interface Tenant {
  id: string;
  subdomain: string;
  custom_domain: string | null;
  settings: TenantSettings;
  status: TenantStatus;
  created_at: string;
  updated_at: string;
}

// Type for tenant data used in caching (without timestamps)
export type CachedTenant = Omit<Tenant, 'created_at' | 'updated_at'>;

export interface TenantContext {
  id: string;
  subdomain: string;
  settings: TenantSettings;
}

export type HostnameType = 'subdomain' | 'custom' | 'root' | 'localhost';
