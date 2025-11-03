import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Payment amounts mapping
const TIER_AMOUNTS = {
  STARTER: 2999,
  PRO: 7999,
  ENTERPRISE: 0, // Custom pricing
};

// Mock payment initiation functions with enhanced parameters
async function initiateEsewaPayment(tierId: string, tenantId: string, userId: string): Promise<string> {
  const amount = TIER_AMOUNTS[tierId as keyof typeof TIER_AMOUNTS] || 0;
  const transactionId = `ESW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`Mock eSewa initiation for Tier: ${tierId}, Amount: NPR ${amount}`);
  
  // In production, this would integrate with eSewa's API
  return `/payment-processing?method=eSewa&tier=${tierId}&amount=${amount}&txn=${transactionId}`;
}

async function initiateKhaltiPayment(tierId: string, tenantId: string, userId: string): Promise<string> {
  const amount = TIER_AMOUNTS[tierId as keyof typeof TIER_AMOUNTS] || 0;
  const transactionId = `KHL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`Mock Khalti initiation for Tier: ${tierId}, Amount: NPR ${amount}`);
  
  // In production, this would integrate with Khalti's API
  return `/payment-processing?method=Khalti&tier=${tierId}&amount=${amount}&txn=${transactionId}`;
}

async function initiateFonepayPayment(tierId: string, tenantId: string, userId: string): Promise<string> {
  const amount = TIER_AMOUNTS[tierId as keyof typeof TIER_AMOUNTS] || 0;
  const transactionId = `FNP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`Mock FonePay initiation for Tier: ${tierId}, Amount: NPR ${amount}`);
  
  // In production, this would integrate with FonePay's API
  return `/payment-processing?method=FonePay&tier=${tierId}&amount=${amount}&txn=${transactionId}`;
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
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
      include: { tenant: true },
    });

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

    // Log payment attempt for audit
    console.log(`Payment initiation attempt:`, {
      userId: user.id,
      tenantId: tenant.id,
      tierId,
      paymentMethod,
      timestamp: new Date().toISOString()
    });

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

    if (redirectUrl) {
      return NextResponse.json({ redirectUrl });
    } else {
      return new NextResponse("Failed to initiate payment", { status: 500 });
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}