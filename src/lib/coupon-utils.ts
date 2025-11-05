import { prisma } from './prisma';

interface CouponValidation {
  isValid: boolean;
  discount: number;
  freeShipping: boolean;
  message?: string;
}

export async function validateCoupon(
  code: string, 
  tenantId: string, 
  orderTotal: number
): Promise<CouponValidation> {
  try {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        tenantId,
        isActive: true
      }
    });

    if (!coupon) {
      return { isValid: false, discount: 0, freeShipping: false, message: 'Invalid coupon code' };
    }

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { isValid: false, discount: 0, freeShipping: false, message: 'Coupon has expired' };
    }

    // Check usage limit
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { isValid: false, discount: 0, freeShipping: false, message: 'Coupon usage limit reached' };
    }

    // Check minimum amount
    if (coupon.minAmount && orderTotal < Number(coupon.minAmount)) {
      return { 
        isValid: false, 
        discount: 0, 
        freeShipping: false, 
        message: `Minimum order amount is $${coupon.minAmount}` 
      };
    }

    // Calculate discount
    let discount = 0;
    let freeShipping = false;

    switch (coupon.type) {
      case 'percentage':
        discount = (orderTotal * Number(coupon.value)) / 100;
        break;
      case 'fixed':
        discount = Math.min(Number(coupon.value), orderTotal);
        break;
      case 'free_shipping':
        freeShipping = true;
        break;
    }

    return { isValid: true, discount, freeShipping };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { isValid: false, discount: 0, freeShipping: false, message: 'Error validating coupon' };
  }
}

export async function applyCoupon(couponId: string) {
  try {
    await prisma.coupon.update({
      where: { id: couponId },
      data: { usedCount: { increment: 1 } }
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
  }
}