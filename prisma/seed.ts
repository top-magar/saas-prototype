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
      tier: "STARTER",
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
  const productsData = [
    {
      product: {
        name: 'Laptop Computer',
        description: 'Powerful laptop for all your computing needs.',
        imageUrl: '/images/laptop.jpg',
        tags: ['electronics', 'computer'],
        status: 'PUBLISHED',
      },
      variant: {
        sku: 'LAPTOP-001',
        price: 50000,
        quantity: 5,
      },
    },
    {
      product: {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse.',
        imageUrl: '/images/mouse.jpg',
        tags: ['accessories', 'computer'],
        status: 'PUBLISHED',
      },
      variant: {
        sku: 'MOUSE-001',
        price: 1500,
        quantity: 50,
      },
    },
    {
      product: {
        name: 'USB-C Cable',
        description: 'High-speed USB-C charging and data cable.',
        imageUrl: '/images/cable.jpg',
        tags: ['accessories', 'cables'],
        status: 'PUBLISHED',
      },
      variant: {
        sku: 'CABLE-001',
        price: 800,
        quantity: 100,
      },
    },
  ];

  for (const item of productsData) {
    const product = await prisma.product.create({
      data: {
        tenantId: tenant.id,
        name: item.product.name,
        description: item.product.description,
        imageUrl: item.product.imageUrl,
        tags: item.product.tags,
        status: item.product.status,
      },
    });

    await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: `${item.product.name} - ${item.variant.sku}`,
        sku: item.variant.sku,
        price: item.variant.price,
        quantity: item.variant.quantity,
      },
    });
  }

  console.log('✅ Database seeded with demo data!');
  console.log(`Tenant: ${tenant.name} (${tenant.subdomain})`);
  console.log(`User: ${user.email}`);
  console.log(`Products: ${productsData.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());