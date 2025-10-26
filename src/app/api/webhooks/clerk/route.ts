import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

import { prisma } from "@/lib/prisma";

const webhookSecret: string = process.env.CLERK_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  const payload = await req.json();
  const headersList = await headers();

  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const svix = new Webhook(webhookSecret);
  let event: WebhookEvent;

  try {
    event = svix.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const { id } = event.data;
  const eventType = event.type;

  if (eventType === "user.created" || eventType === "user.updated") {
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

    await prisma.user.upsert({
      where: { clerkUserId: id },
      update: {
        email: email,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
      },
      create: {
        clerkUserId: id,
        email: email,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
      },
    });
  }

  return new Response("Received", { status: 200 });
}
