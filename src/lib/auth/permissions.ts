import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { supabaseServerClient } from '@/lib/database/connection-pool';
import { logger } from '@/lib/monitoring/logger';

export type TenantRole = 'owner' | 'admin' | 'member' | 'viewer';

export const PERMISSIONS = {
    'organizations:read': ['owner', 'admin', 'member', 'viewer'],
    'organizations:write': ['owner', 'admin'],
    'organizations:delete': ['owner'],
    'billing:manage': ['owner'],
    'settings:read': ['owner', 'admin', 'member'],
    'settings:write': ['owner', 'admin'],
    'users:read': ['owner', 'admin', 'member'],
    'users:invite': ['owner', 'admin'],
    'audit_logs:read': ['owner'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: TenantRole, permission: Permission): boolean {
    const allowedRoles = PERMISSIONS[permission];
    return (allowedRoles as readonly TenantRole[]).includes(role);
}

export function requirePermission(permission: Permission) {
    return async (req: NextRequest) => {
        const tenantId = req.headers.get('x-tenant-id');
        if (!tenantId) {
            return NextResponse.json({ error: 'Tenant context missing' }, { status: 400 });
        }

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user's role in this tenant
        // Note: In a real high-perf scenario, this should be cached in the session or Redis
        const { data: member, error } = await supabaseServerClient
            .from('tenant_members')
            .select('role')
            .eq('tenant_id', tenantId)
            .eq('user_id', token.sub)
            .single();

        if (error || !member) {
            logger.warn('Permission check failed: User not found in tenant', {
                userId: token.sub,
                tenantId,
            });
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (!hasPermission(member.role as TenantRole, permission)) {
            logger.warn('Permission denied', {
                userId: token.sub,
                tenantId,
                role: member.role,
                requiredPermission: permission,
            });
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return null; // Access granted
    };
}
