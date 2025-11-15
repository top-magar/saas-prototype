import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

// Payment amounts mapping
const TIER_AMOUNTS = {
  STARTER: 2999,
  PRO: 7999,
  ENTERPRISE: 0, // Custom pricing
};

// Enhanced payment initiation functions with proper error handling
async function initiateEsewaPayment(tierId: string, tenantId: string, userId: string): Promise<string> {
  if (!tierId || !tenantId || !userId) {
    throw new Error('Missing required parameters for eSewa payment');
  }
  
  if (!Object.keys(TIER_AMOUNTS).includes(tierId)) {
    throw new Error('Invalid tier ID provided');
  }
  
  const amount = TIER_AMOUNTS[tierId as keyof typeof TIER_AMOUNTS];
  
  if (tierId === 'ENTERPRISE') {
    throw new Error('Enterprise tier requires custom pricing contact');
  }
  
  if (amount <= 0) {
    throw new Error('Invalid amount for selected tier');
  }
  
  const transactionId = `ESW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('[ESEWA_PAYMENT] Initiating payment for tier');
  
  // Simulate API call that can fail
  if (Math.random() < 0.1) {
    throw new Error('eSewa API temporarily unavailable');
  }
  
  const redirectUrl = `/payment-processing?method=eSewa&tier=${tierId}&amount=${amount}&txn=${transactionId}`;
  
  if (!redirectUrl) {
    throw new Error('Failed to generate eSewa payment URL');
  }
  
  return redirectUrl;
}

async function initiateKhaltiPayment(tierId: string, tenantId: string, userId: string): Promise<string> {
  if (!tierId || !tenantId || !userId) {
    throw new Error('Missing required parameters for Khalti payment');
  }
  
  if (!Object.keys(TIER_AMOUNTS).includes(tierId)) {
    throw new Error('Invalid tier ID provided');
  }
  
  const amount = TIER_AMOUNTS[tierId as keyof typeof TIER_AMOUNTS];
  
  if (amount <= 0) {
    throw new Error('Invalid amount for selected tier');
  }
  
  try {
    const transactionId = `KHL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('[KHALTI_PAYMENT] Initiating payment for tier');
    
    if (Math.random() < 0.1) {
      throw new Error('Khalti API temporarily unavailable');
    }
    
    const redirectUrl = `/payment-processing?method=Khalti&tier=${tierId}&amount=${amount}&txn=${transactionId}`;
    
    if (!redirectUrl) {
      throw new Error('Failed to generate Khalti payment URL');
    }
    
    return redirectUrl;
  } catch (error) {
    console.error('[KHALTI_PAYMENT_ERROR] Payment initiation failed');
    throw new Error('Khalti payment initiation failed');
  }
}

async function initiateFonepayPayment(tierId: string, tenantId: string, userId: string): Promise<string> {
  if (!tierId || !tenantId || !userId) {
    throw new Error('Missing required parameters for FonePay payment');
  }
  
  if (!Object.keys(TIER_AMOUNTS).includes(tierId)) {
    throw new Error('Invalid tier ID provided');
  }
  
  const amount = TIER_AMOUNTS[tierId as keyof typeof TIER_AMOUNTS];
  
  if (amount <= 0) {
    throw new Error('Invalid amount for selected tier');
  }
  
  try {
    const transactionId = `FNP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('[FONEPAY_PAYMENT] Initiating payment for tier');
    
    if (Math.random() < 0.1) {
      throw new Error('FonePay API temporarily unavailable');
    }
    
    const redirectUrl = `/payment-processing?method=FonePay&tier=${tierId}&amount=${amount}&txn=${transactionId}`;
    
    if (!redirectUrl) {
      throw new Error('Failed to generate FonePay payment URL');
    }
    
    return redirectUrl;
  } catch (error) {
    console.error('[FONEPAY_PAYMENT_ERROR] Payment initiation failed');
    throw new Error('FonePay payment initiation failed');
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { tierId, paymentMethod } = await req.json();

    if (!tierId || !paymentMethod) {
      return new NextResponse("Tier ID and Payment Method are required", { status: 400 });
    }

    // Retrieve the tenant associated with the current user
    const { data: dbUser } = await supabase
      .from('users')
      .select('*, tenant:tenants(*)')
      .eq('clerk_user_id', user.id)
      .single();

    if (!dbUser || !dbUser.tenant) {
      return new NextResponse("Tenant not found for the current user", { status: 404 });
    }

    const tenant = dbUser.tenant;

    let redirectUrl: string | null = null;

    // Validate tier and amount
    if (tierId === 'FREE') {
      return new NextResponse("Cannot process payment for free tier", { status: 400 });
    }

    if (tierId === 'ENTERPRISE') {
      return new NextResponse("Enterprise tier requires custom pricing. Please contact sales.", { status: 400 });
    }

    console.log('[PAYMENT_INITIATE] Payment attempt initiated');

    try {
      switch (paymentMethod) {
        case "esewa":
          redirectUrl = await initiateEsewaPayment(tierId, tenant.id, user.id);
          break;
        case "khalti":
          redirectUrl = await initiateKhaltiPayment(tierId, tenant.id, user.id);
          break;
        case "fonepay":
          redirectUrl = await initiateFonepayPayment(tierId, tenant.id, user.id);
          break;
        default:
          return new NextResponse("Invalid payment method. Supported methods: esewa, khalti, fonepay", { status: 400 });
      }
    } catch (paymentError) {
      console.error('[PAYMENT_INITIATE_ERROR] Payment initiation failed');
      return new NextResponse('Payment initiation failed', { status: 502 });
    }

    if (redirectUrl) {
      return NextResponse.json({ redirectUrl });
    } else {
      return new NextResponse("Failed to initiate payment", { status: 500 });
    }
  } catch (error) {
    console.error('[PAYMENT_ROUTE_ERROR] Internal server error');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}