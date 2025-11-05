import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findOrCreateCustomer } from "@/lib/customer-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Khalti Webhook received");

    const { tenantId, tierId, customerEmail, customerName, customerPhone, orderId } = body;

    // Handle subscription payment
    if (tenantId && tierId) {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { tier: tierId },
      });
      console.log('Tenant tier updated via Khalti webhook');
    }

    // Handle order payment - auto-create customer
    if (tenantId && customerEmail && orderId) {
      try {
        const customer = await findOrCreateCustomer({
          email: customerEmail,
          name: customerName,
          phone: customerPhone,
          tenantId
        });

        // Update order with customer and payment status
        await prisma.order.update({
          where: { id: orderId },
          data: {
            userId: customer.id,
            paymentStatus: 'completed',
            status: 'confirmed'
          }
        });
        console.log('Order updated and customer created via Khalti webhook');
      } catch (error) {
        console.error('Error processing order payment:', error);
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Error processing Khalti webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}