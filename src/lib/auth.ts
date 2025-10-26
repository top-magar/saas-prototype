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
    throw new Error('Unauthorized: No user logged in.');
  }

  const dbUser = await prisma.user.findFirst({
    where: {
      clerkUserId: user.id,
      tenantId: tenantId,
    },
  });

  if (!dbUser) {
    throw new Error('Forbidden: User does not belong to this tenant.');
  }

  if (!allowedRoles.includes(dbUser.role as UserRole)) {
    throw new Error(`Forbidden: User role "${dbUser.role}" is not one of the allowed roles.`);
  }

  return dbUser;
}