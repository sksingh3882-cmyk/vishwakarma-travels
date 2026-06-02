import { NextResponse } from "next/server";
import type { PushSubscriptionPayload } from "@/lib/push/pushTypes";

export const runtime = "nodejs";

type SubscribeRequest = {
  subscription?: PushSubscriptionPayload;
  userAgent?: string;
};

function json(message: string, status = 200) {
  return NextResponse.json({ ok: status >= 200 && status < 300, message }, { status });
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return json("Supabase URL/key missing.", 500);
  }

  let body: SubscribeRequest;
  try {
    body = await request.json();
  } catch {
    return json("Invalid JSON body.", 400);
  }

  const subscription = body.subscription;
  if (!subscription?.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
    return json("Invalid push subscription.", 400);
  }

  const payload = {
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    user_agent: body.userAgent || request.headers.get("user-agent") || "",
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/admin_push_subscriptions`, {
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
    return json(`Subscription save failed: ${errorText}`, 500);
  }

  return json("Booking notifications enabled.");
}
