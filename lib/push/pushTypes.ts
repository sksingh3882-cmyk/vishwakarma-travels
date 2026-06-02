export type PushSubscriptionPayload = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export type PushNotificationPayload = {
  title?: string;
  body?: string;
  url?: string;
  icon?: string;
  badge?: string;
  tag?: string;
};

export type SubscribeResponse = {
  ok: boolean;
  message: string;
};

export type SendPushResponse = {
  ok: boolean;
  sent: number;
  failed: number;
  message: string;
};
