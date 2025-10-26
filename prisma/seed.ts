import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      subdomain: 'demo',
      name: 'Demo Company',
      tier: 'starter',
      monthlyBudget: 10000,
    },
  });

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@test.com',
      name: 'Admin User',
      passwordHash,
      role: 'admin',
    },
  });

  // Create demo products
  const products = [
    {
      name: 'Laptop Computer',
      sku: 'LAPTOP-001',
      price: 50000,
      quantity: 5,
      category: 'Electronics',
    },
    {
      name: 'Wireless Mouse',
      sku: 'MOUSE-001',
      price: 1500,
      quantity: 50,
      category: 'Accessories',
    },
    {
      name: 'USB-C Cable',
      sku: 'CABLE-001',
      price: 800,
      quantity: 100,
      category: 'Accessories',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { tenantId_sku: { tenantId: tenant.id, sku: product.sku } },
      update: {},
      create: {
        tenantId: tenant.id,
        ...product,
      },
    });
  }

  console.log('✅ Database seeded with demo data!');
  console.log(`Tenant: ${tenant.name} (${tenant.subdomain})`);
  console.log(`User: ${user.email}`);
  console.log(`Products: ${products.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());