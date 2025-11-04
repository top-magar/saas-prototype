import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface EsewaWebhookPayload {
  tenantId: string;
  tierId: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
  transactionId?: string;
  amount?: number;
}

function validateWebhookPayload(body: any): body is EsewaWebhookPayload {
  return (
    body &&
    typeof body.tenantId === 'string' &&
    body.tenantId.length > 0 &&
    typeof body.tierId === 'string' &&
    ['FREE', 'STARTER', 'PRO', 'ENTERPRISE'].includes(body.tierId)
  );
}

export async function POST(req: NextRequest) {
  let body: any;
  
  try {
    // Parse JSON with error handling
    body = await req.json();
  } catch (jsonError) {
    console.error('Invalid JSON in eSewa webhook');
    return new NextResponse('Invalid JSON payload', { status: 400 });
  }

  try {
    console.log('eSewa Webhook received');

    // Validate payload structure
    if (!validateWebhookPayload(body)) {
      console.error('Invalid eSewa webhook payload structure');
      return new NextResponse('Invalid payload structure', { status: 400 });
    }

    const { tenantId, tierId } = body;

    // Verify tenant exists before updating
    const existingTenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!existingTenant) {
      console.error('Tenant not found for eSewa webhook');
      return new NextResponse('Tenant not found', { status: 404 });
    }

    // Update tenant tier with error handling
    try {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { tier: tierId },
      });
      console.log('Tenant tier updated via eSewa webhook');
    } catch (dbError) {
      console.error('Database update failed in eSewa webhook');
      return new NextResponse('Database update failed', { status: 500 });
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing eSewa webhook');
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}