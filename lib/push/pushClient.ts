import type { PushSubscriptionPayload, SubscribeResponse } from "./pushTypes";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function toPayload(subscription: PushSubscription): PushSubscriptionPayload {
  const json = subscription.toJSON() as PushSubscriptionPayload;
  return {
    endpoint: json.endpoint,
    keys: {
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    },
  };
}

export function isPushSupported() {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export async function registerPushServiceWorker() {
  if (!isPushSupported()) {
    throw new Error("Push notification is not supported on this browser.");
  }

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  return registration;
}

export async function subscribeAdminForPush(): Promise<SubscribeResponse> {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!publicKey) {
    return { ok: false, message: "VAPID public key missing." };
  }

  if (!isPushSupported()) {
    return { ok: false, message: "Push notification is not supported on this browser." };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false, message: "Notification permission was not allowed." };
  }

  const registration = await registerPushServiceWorker();
  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }));

  const response = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription: toPayload(subscription), userAgent: navigator.userAgent }),
  });

  if (!response.ok) {
    return { ok: false, message: "Subscription save failed." };
  }

  return response.json();
}

export async function sendAdminTestPush() {
  const response = await fetch("/api/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "You Have New Booking Request",
      body: "Tap to open Vishwakarma Travels Admin.",
      url: "/admin",
      tag: "vt-admin-test-notification",
    }),
  });

  if (!response.ok) {
    throw new Error("Test notification failed.");
  }

  return response.json();
}
