import { NextResponse } from "next/server";
import webpush from "web-push";
import type { PushNotificationPayload } from "@/lib/push/pushTypes";

export const runtime = "nodejs";

type CustomerSubscriptionRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

type CustomerSendRequest = PushNotificationPayload & {
  bookingRequestId?: string;
  customerPhone?: string;
};

function cleanPhone(value: string) {
  let phone = String(value || "").replace(/\D/g, "");
  if ((phone.startsWith("91") || phone.startsWith("0")) && phone.length > 10) phone = phone.slice(-10);
  return phone.slice(-10);
}

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

  let body: CustomerSendRequest = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const bookingRequestId = String(body.bookingRequestId || "").trim();
  const customerPhone = cleanPhone(body.customerPhone || "");

  if (!bookingRequestId && customerPhone.length !== 10) {
    return json("Booking request id or customer phone is required.", 400);
  }

  const filters: string[] = ["select=endpoint,p256dh,auth"];
  if (bookingRequestId) filters.push(`booking_request_id=eq.${encodeURIComponent(bookingRequestId)}`);
  if (customerPhone.length === 10) filters.push(`customer_phone=eq.${encodeURIComponent(customerPhone)}`);

  const subscriptionResponse = await fetch(`${supabaseUrl}/rest/v1/customer_push_subscriptions?${filters.join("&")}`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
    cache: "no-store",
  });

  if (!subscriptionResponse.ok) {
    const errorText = await subscriptionResponse.text();
    return json(`Customer subscription fetch failed: ${errorText}`, 500);
  }

  const subscriptions = (await subscriptionResponse.json()) as CustomerSubscriptionRow[];
  if (!subscriptions.length) {
    return json("No customer push subscription found.", 404, { sent: 0, failed: 0 });
  }

  const payload: PushNotificationPayload = {
    title: body.title || "Booking Status Updated",
    body: body.body || "Please Check My Booking Section to see your Booking Status",
    url: body.url || (bookingRequestId ? `/?bookingRequestId=${encodeURIComponent(bookingRequestId)}` : "/"),
    icon: body.icon || "/logo.png",
    badge: body.badge || "/logo.png",
    tag: body.tag || `vt-customer-booking-${bookingRequestId || customerPhone}`,
  };

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

  return json("Customer push notification processed.", 200, { sent, failed });
}
