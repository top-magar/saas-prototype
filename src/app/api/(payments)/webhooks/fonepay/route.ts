import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Fonepay Webhook received:", body);

    // In a real scenario, you would verify the webhook signature/payload
    // and then process the payment status.

    // For mock purposes, let's assume a successful payment and update tenant tier
    const { tenantId, tierId } = body; // Assuming these are sent in the webhook payload

    if (tenantId && tierId) {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { tier: tierId },
      });
      console.log(`Tenant ${tenantId} tier updated to ${tierId} via Fonepay webhook.`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Error processing Fonepay webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}