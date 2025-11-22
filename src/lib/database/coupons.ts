import { supabase } from './supabase';
import type { CouponValidation } from '../shared/types';

export async function validateCoupon(
  code: string, 
  tenantId: string, 
  orderTotal: number
): Promise<CouponValidation> {
  try {
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('tenantId', tenantId)
      .eq('is_active', true)
      .single();

    if (!coupon) {
      return { isValid: false, discount: 0, freeShipping: false, message: 'Invalid coupon code' };
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { isValid: false, discount: 0, freeShipping: false, message: 'Coupon has expired' };
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { isValid: false, discount: 0, freeShipping: false, message: 'Coupon usage limit reached' };
    }

    // Check minimum amount
    if (coupon.minimum_amount && orderTotal < Number(coupon.minimum_amount)) {
      return { 
        isValid: false, 
        discount: 0, 
        freeShipping: false, 
        message: `Minimum order amount is $${coupon.minimum_amount}` 
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
    const { data: currentCoupon } = await supabase
      .from('coupons')
      .select('used_count')
      .eq('id', couponId)
      .single();
    
    await supabase
      .from('coupons')
      .update({ used_count: (currentCoupon?.used_count || 0) + 1 })
      .eq('id', couponId);
  } catch (error) {
    console.error('Error applying coupon:', error);
  }
}