import { NextResponse } from "next/server";
import webpush from "web-push";
import type { PushNotificationPayload } from "@/lib/push/pushTypes";

export const runtime = "nodejs";

type SubscriptionRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

function json(message: string, status = 200, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: status >= 200 && status < 300, message, ...extra }, { status });
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:sksingh3882@gmail.com";

  if (!supabaseUrl || !supabaseKey) {
    return json("Supabase URL/key missing.", 500);
  }

  if (!publicKey || !privateKey) {
    return json("VAPID keys missing.", 500);
  }

  let body: PushNotificationPayload = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const payload: PushNotificationPayload = {
    title: body.title || "You Have New Booking Request",
    body: body.body || "Tap to open Vishwakarma Travels Admin.",
    url: body.url || "/admin",
    icon: body.icon || "/logo.png",
    badge: body.badge || "/logo.png",
    tag: body.tag || "vt-new-booking-request",
  };

  const subscriptionResponse = await fetch(
    `${supabaseUrl}/rest/v1/admin_push_subscriptions?select=endpoint,p256dh,auth`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      cache: "no-store",
    }
  );

  if (!subscriptionResponse.ok) {
    const errorText = await subscriptionResponse.text();
    return json(`Subscription fetch failed: ${errorText}`, 500);
  }

  const subscriptions = (await subscriptionResponse.json()) as SubscriptionRow[];
  if (!subscriptions.length) {
    return json("No admin push subscription found.", 404, { sent: 0, failed: 0 });
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  let sent = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (item) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: item.endpoint,
            keys: {
              p256dh: item.p256dh,
              auth: item.auth,
            },
          },
          JSON.stringify(payload)
        );
        sent += 1;
      } catch {
        failed += 1;
      }
    })
  );

  return json("Push notification processed.", 200, { sent, failed });
}
