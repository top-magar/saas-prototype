import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

import { prisma } from "@/lib/prisma";
import { createTenantAndAssociateUser } from "@/lib/tenant";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

function validateWebhookSecret(): string | null {
  if (!webhookSecret) {
    console.error('[WEBHOOK_CONFIG_ERROR] CLERK_WEBHOOK_SECRET environment variable is not set');
    return null;
  }

  if (webhookSecret.length < 32) {
    console.error('[WEBHOOK_CONFIG_ERROR] CLERK_WEBHOOK_SECRET appears to be invalid (too short)');
    return null;
  }

  return webhookSecret;
}

export async function POST(req: Request) {
  const validSecret = validateWebhookSecret();
  if (!validSecret) {
    return new Response('Webhook configuration error', { status: 500 });
  }

  let payload: any;
  
  try {
    payload = await req.json();
  } catch (jsonError) {
    console.error('[WEBHOOK_JSON_ERROR]', jsonError);
    return new Response('Invalid JSON payload', { status: 400 });
  }
  
  let headersList: any;
  
  try {
    headersList = await headers();
  } catch (headerError) {
    console.error('Failed to read headers:', headerError);
    return new Response('Failed to read request headers', { status: 400 });
  }

  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const svix = new Webhook(validSecret);
  let event: WebhookEvent;

  try {
    event = svix.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    
    // Handle specific verification errors
    if (err instanceof Error) {
      if (err.message.includes('timestamp')) {
        return new Response('Webhook timestamp invalid or expired', { status: 400 });
      }
      if (err.message.includes('signature')) {
        return new Response('Webhook signature verification failed', { status: 401 });
      }
    }
    
    return new Response("Webhook verification failed", {
      status: 401,
    });
  }

  const eventType = event.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } = event.data;

    if (!id) {
      return new Response("Error: User ID not found in webhook data", {
        status: 400,
      });
    }

    const email = email_addresses[0]?.email_address;

    if (!email) {
      return new Response("Error: Email address not found in webhook data", {
        status: 400,
      });
    }

    const companyName = unsafe_metadata?.companyName as string | undefined;
    const subdomain = unsafe_metadata?.subdomain as string | undefined;

    if (!companyName || !subdomain) {
      return new Response("Error: Organization Name or Subdomain not found in unsafe_metadata", {
        status: 400,
      });
    }

    try {
      // Update user's publicMetadata with companyName and subdomain
      await (await clerkClient()).users.updateUserMetadata(id, {
        publicMetadata: {
          companyName,
          subdomain,
        },
      });

      // Create tenant and associate user
      await createTenantAndAssociateUser({
        clerkUserId: id,
        name: companyName,
        subdomain,
        email,
        userName: `${first_name || ""} ${last_name || ""}`.trim(),
      });

    } catch (error) {
      console.error("Error in user.created webhook handler:", error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('Unique constraint')) {
          return new Response('User or tenant already exists', { status: 409 });
        }
        if (error.message.includes('Invalid subdomain')) {
          return new Response('Invalid subdomain format', { status: 400 });
        }
      }
      
      return new Response("Error processing user.created event", {
        status: 500,
      });
    }
  } else if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = event.data;

    if (!id) {
      return new Response("Error: User ID not found in webhook data", {
        status: 400,
      });
    }

    const email = email_addresses[0]?.email_address;

    if (!email) {
      return new Response("Error: Email address not found in webhook data", {
        status: 400,
      });
    }

    try {
      await prisma.user.upsert({
        where: { clerkUserId: id },
        update: {
          email: email,
          name: `${first_name || ""} ${last_name || ""}`.trim(),
        },
        create: {
          clerkUserId: id,
          tenantId: null, // Tenant will be associated during creation
          email: email,
          name: `${first_name || ""} ${last_name || ""}`.trim(),
        },
      });
    } catch (dbError) {
      console.error('Database error in user.updated webhook:', dbError);
      return new Response('Database update failed', { status: 500 });
    }
  }

  return new Response("Received", { status: 200 });
}
