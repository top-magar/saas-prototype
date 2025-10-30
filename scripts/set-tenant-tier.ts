import { PrismaClient, TenantTier } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const clerkUserId = process.argv[2];
  const newTier = process.argv[3];

  if (!clerkUserId || !newTier) {
    console.error('Usage: tsx scripts/set-tenant-tier.ts <clerkUserId> <newTier>');
    process.exit(1);
  }

  // Validate newTier against TenantTier enum
  if (!Object.values(TenantTier).includes(newTier as TenantTier)) {
    console.error(`Invalid tier: ${newTier}. Allowed values are: ${Object.values(TenantTier).join(', ')}`);
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId },
      select: { tenantId: true },
    });

    if (!user?.tenantId) {
      console.error(`Tenant not found for Clerk User ID: ${clerkUserId}`);
      process.exit(1);
    }

    await prisma.tenant.update({
      where: { id: user.tenantId! },
      data: { tier: newTier as TenantTier },
    });

    console.log(`Tenant for user ${clerkUserId} updated to tier: ${newTier}`);
  } catch (error) {
    console.error('Error updating tenant tier:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();