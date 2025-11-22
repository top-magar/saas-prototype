import 'server-only';
import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '../database/supabase';

/**
 * Verify that the authenticated user has access to a specific tenant
 * 
 * @param tenantId - The tenant ID to verify access for
 * @returns User data if authorized
 * @throws Error if unauthorized or user doesn't belong to tenant
 */
export async function verifyTenantAccess(tenantId: string) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        throw new Error('Unauthorized: No user logged in');
    }

    // Lookup user in database
    const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, email, name, role, tenant_id, tenants:tenant_id(id, subdomain, name, status)')
        .eq('email', session.user.email)
        .single();

    if (error || !user) {
        throw new Error('User not found in database');
    }

    // Verify user belongs to requested tenant
    if (user.tenant_id !== tenantId) {
        throw new Error(`Access denied: User does not belong to tenant ${tenantId}`);
    }

    // Verify tenant is active
    const tenant = user.tenants as any;
    if (tenant?.status && tenant.status !== 'active') {
        throw new Error(`Tenant is ${tenant.status} - access denied`);
    }

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: user.tenant_id,
        },
        tenant: {
            id: tenant.id,
            subdomain: tenant.subdomain,
            name: tenant.name,
            status: tenant.status,
        },
    };
}

/**
 * Get current user's tenant information
 * Useful for API routes that need to know which tenant the user belongs to
 */
export async function getCurrentUserTenant() {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return null;
    }

    const { data: user } = await supabaseAdmin
        .from('users')
        .select('id, tenant_id, tenants:tenant_id(id, subdomain, name, status)')
        .eq('email', session.user.email)
        .single();

    if (!user || !user.tenant_id) {
        return null;
    }

    const tenant = user.tenants as any;

    return {
        userId: user.id,
        tenantId: user.tenant_id,
        tenant: {
            id: tenant.id,
            subdomain: tenant.subdomain,
            name: tenant.name,
            status: tenant.status,
        },
    };
}
