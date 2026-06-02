self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    payload = {
      title: "You Have New Booking Request",
      body: event.data ? event.data.text() : "New booking request received.",
      url: "/admin"
    };
  }

  const title = payload.title || "You Have New Booking Request";
  const options = {
    body: payload.body || "New booking request received.",
    icon: payload.icon || "/logo.png",
    badge: payload.badge || "/logo.png",
    tag: payload.tag || "vt-new-booking-request",
    renotify: true,
    data: {
      url: payload.url || "/admin"
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url || "/";
  const absoluteUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          return client.focus().then(() => {
            if ("navigate" in client) {
              return client.navigate(absoluteUrl);
            }
          });
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(absoluteUrl);
      }
    })
  );
});
