import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Mock payment initiation functions
async function initiateEsewaPayment(tierId: string, tenantId: string, userId: string): Promise<string> {
  console.log(`Mock eSewa initiation for Tier: ${tierId}, Tenant: ${tenantId}, User: ${userId}`);
  // In a real scenario, this would call eSewa API and return their redirect URL
  return `/payment-processing?method=esewa&tier=${tierId}&tenant=${tenantId}&user=${userId}`;
}

async function initiateKhaltiPayment(tierId: string, tenantId: string, userId: string): Promise<string> {
  console.log(`Mock Khalti initiation for Tier: ${tierId}, Tenant: ${tenantId}, User: ${userId}`);
  // In a real scenario, this would call Khalti API and return their redirect URL
  return `/payment-processing?method=khalti&tier=${tierId}&tenant=${tenantId}&user=${userId}`;
}

async function initiateFonepayPayment(tierId: string, tenantId: string, userId: string): Promise<string> {
  console.log(`Mock Fonepay initiation for Tier: ${tierId}, Tenant: ${tenantId}, User: ${userId}`);
  // In a real scenario, this would call Fonepay API and return their redirect URL
  return `/payment-processing?method=fonepay&tier=${tierId}&tenant=${tenantId}&user=${userId}`;
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
        return new NextResponse("Invalid payment method", { status: 400 });
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