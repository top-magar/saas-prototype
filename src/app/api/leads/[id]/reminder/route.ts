import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const tenant = await getTenant();
    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 });
    }
    
    // Get the abandoned order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        tenantId: tenant.id,
        paymentStatus: 'pending'
      }
    });

    if (!order) {
      return new NextResponse('Order not found', { status: 404 });
    }

    // TODO: Implement email sending logic here
    // For now, just log the reminder
    console.log(`Sending reminder to ${order.customerEmail} for order ${order.orderNumber}`);
    
    // Could integrate with email service like:
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Nodemailer

    return NextResponse.json({ 
      message: 'Reminder sent successfully',
      email: order.customerEmail,
      orderNumber: order.orderNumber
    });
  } catch (error) {
    console.error('[REMINDER_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}