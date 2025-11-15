// Application Types

export type TenantTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Tenant {
  id: string;
  name: string;
  tier: TenantTier;
  createdAt: Date;
  updatedAt: Date;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType;
  disabled?: boolean;
  external?: boolean;
}