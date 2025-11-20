import { supabaseServerClient } from '@/lib/database/connection-pool';

export type AuditAction = 
  | 'auth.login' | 'auth.logout' | 'auth.failed'
  | 'data.create' | 'data.update' | 'data.delete' | 'data.read'
  | 'tenant.create' | 'tenant.update' | 'tenant.delete'
  | 'security.rate_limit' | 'security.validation_failed';

interface AuditLogEntry {
  tenantId?: string;
  userId?: string;
  action: AuditAction;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    await supabaseServerClient.from('audit_logs').insert({
      tenant_id: entry.tenantId,
      user_id: entry.userId,
      action: entry.action,
      resource: entry.resource,
      resource_id: entry.resourceId,
      metadata: entry.metadata,
      ip_address: entry.ipAddress,
      user_agent: entry.userAgent,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Audit log failed:', error);
  }
}

export function getClientInfo(request: Request) {
  return {
    ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
  };
}
