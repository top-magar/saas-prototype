import { z } from 'zod';

export const AddDomainSchema = z.object({
  domain: z.string().min(3).max(253).regex(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i, 'Invalid domain format'),
  tenantId: z.string().uuid(),
});

export const RemoveDomainSchema = z.object({
  tenantId: z.string().uuid(),
});

export const VerifyDomainSchema = z.object({
  domain: z.string().min(3).max(253),
  tenantId: z.string().uuid(),
});

export const DomainStatusSchema = z.object({
  domain: z.string().min(3).max(253),
});

export interface DomainConfig {
  verified: boolean;
  verification?: {
    type: string;
    domain: string;
    value: string;
    reason?: string;
  };
  misconfigured: boolean;
}

export interface DomainStatus {
  domain: string;
  verified: boolean;
  configured: boolean;
  ssl: {
    status: 'pending' | 'active' | 'error';
    expiresAt?: string;
  };
  dns: {
    aRecords: string[];
    cnameRecords: string[];
    txtRecords: string[];
  };
}
