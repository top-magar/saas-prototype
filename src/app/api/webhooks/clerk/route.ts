import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createTenantAndAssociateUser } from '@/lib/database/tenant';
import { logAudit } from '@/lib/security/audit-logger';

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const { type, data } = evt;

  if (type === 'user.created') {
    try {
      const tenant = await createTenantAndAssociateUser({
        clerkUserId: data.id,
        name: `${data.first_name || 'User'}'s Workspace`,
        subdomain: `user-${data.id.slice(0, 8)}`,
        email: data.email_addresses[0]?.email_address || '',
        userName: data.first_name || 'User',
      });

      await logAudit({
        action: 'tenant.create',
        userId: data.id,
        tenantId: tenant.id,
        resource: 'tenant',
        resourceId: tenant.id,
        metadata: { source: 'clerk_webhook' },
      });
    } catch (error) {
      console.error('Error creating tenant for new user:', error);
    }
  }

  return NextResponse.json({ received: true });
}
