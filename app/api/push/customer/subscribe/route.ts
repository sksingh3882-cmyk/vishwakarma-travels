import { NextResponse } from "next/server";
import type { PushSubscriptionPayload } from "@/lib/push/pushTypes";

export const runtime = "nodejs";

type CustomerSubscribeRequest = {
  subscription?: PushSubscriptionPayload;
  bookingRequestId?: string;
  customerPhone?: string;
  userAgent?: string;
};

function cleanPhone(value: string) {
  let phone = String(value || "").replace(/\D/g, "");
  if ((phone.startsWith("91") || phone.startsWith("0")) && phone.length > 10) phone = phone.slice(-10);
  return phone.slice(-10);
}

function json(message: string, status = 200) {
  return NextResponse.json({ ok: status >= 200 && status < 300, message }, { status });
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return json("Supabase URL/key missing.", 500);
  }

  let body: CustomerSubscribeRequest;
  try {
    body = await request.json();
  } catch {
    return json("Invalid JSON body.", 400);
  }

  const subscription = body.subscription;
  const bookingRequestId = String(body.bookingRequestId || "").trim();
  const customerPhone = cleanPhone(body.customerPhone || "");

  if (!bookingRequestId) return json("Booking request id missing.", 400);
  if (customerPhone.length !== 10) return json("Customer phone must be 10 digits.", 400);
  if (!subscription?.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
    return json("Invalid push subscription.", 400);
  }

  const payload = {
    booking_request_id: bookingRequestId,
    customer_phone: customerPhone,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    user_agent: body.userAgent || request.headers.get("user-agent") || "",
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/customer_push_subscriptions`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return json(`Customer subscription save failed: ${errorText}`, 500);
  }

  return json("Customer booking notifications enabled.");
}
