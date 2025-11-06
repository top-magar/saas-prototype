// src/lib/auth.ts
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from './prisma';

// Define user roles for better type safety
type UserRole = 'admin' | 'manager' | 'user';

/**
 * Verifies that the current user is authenticated, belongs to the specified tenant,
 * and has one of the allowed roles.
 * @param tenantId The ID of the tenant to check against.
 * @param allowedRoles An array of roles that are permitted to perform the action.
 * @returns The database user object if authorized.
 * @throws An error if the user is not authorized.
 */
export async function authorize(tenantId: string, allowedRoles: UserRole[]) {
  const user = await currentUser();
  if (!user?.id) {
    console.log('[AUTHORIZE] Unauthorized: No user logged in.');
    throw new Error('Unauthorized: No user logged in.');
  }

  console.log('[AUTHORIZE] Checking authorization for user and tenant');

  const dbUser = await prisma.user.findFirst({
    where: {
      clerkUserId: user.id,
      tenantId: tenantId,
    },
    include: {
      tenant: true, // Include the tenant relation
    },
  });

  if (!dbUser || !dbUser.tenant) {
    console.log('[AUTHORIZE] Forbidden: User does not belong to tenant or tenant not found.');
    throw new Error('Forbidden: User does not belong to this tenant or tenant not found.');
  }

  console.log('[AUTHORIZE] User found with role verification');

  if (!allowedRoles.includes(dbUser.role.toLowerCase() as UserRole)) {
    console.log('[AUTHORIZE] Forbidden: User role is not authorized.');
    throw new Error(`Forbidden: User role "${dbUser.role}" is not one of the allowed roles.`);
  }

  console.log('[AUTHORIZE] Authorization successful.');
  return dbUser;
}