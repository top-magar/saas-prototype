import { prisma } from './prisma';

interface CustomerData {
  email: string;
  name?: string;
  phone?: string;
  tenantId: string;
}

export async function findOrCreateCustomer(data: CustomerData) {
  const { email, name, phone, tenantId } = data;

  try {
    // First, try to find existing customer by email within the tenant
    let customer = await prisma.user.findFirst({
      where: {
        email,
        tenantId,
        role: 'user' // Ensure we're looking for customers, not admin users
      }
    });

    // If customer doesn't exist, create a new one
    if (!customer) {
      customer = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0], // Use email prefix as fallback name
          tenantId,
          role: 'user',
          status: 'active'
        }
      });
    }

    return customer;
  } catch (error) {
    console.error('Error finding or creating customer:', error);
    throw error;
  }
}