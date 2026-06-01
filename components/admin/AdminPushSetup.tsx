"use client";

import { useState } from "react";
import { sendAdminTestPush, subscribeAdminForPush } from "@/lib/push/pushClient";

export default function AdminPushSetup() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  async function enableNotifications() {
    setLoading(true);
    setMessage("Checking notification permission...");

    try {
      const result = await subscribeAdminForPush();
      setMessage(result.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Notification setup failed.");
    } finally {
      setLoading(false);
    }
  }

  async function sendTestNotification() {
    setTesting(true);
    setMessage("Sending test notification...");

    try {
      const result = await sendAdminTestPush();
      setMessage(result.message || "Test notification sent.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Test notification failed.");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div
      style={{
        margin: "12px 0",
        padding: "12px",
        borderRadius: "16px",
        background: "#ffffff",
        border: "1px solid #d8e2ef",
        boxShadow: "0 8px 24px rgba(11,45,107,0.08)",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <button
          type="button"
          onClick={enableNotifications}
          disabled={loading}
          style={{
            border: 0,
            borderRadius: "14px",
            padding: "12px 10px",
            background: "#0b2d6b",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "15px",
          }}
        >
          {loading ? "Enabling..." : "🔔 Enable Notifications"}
        </button>

        <button
          type="button"
          onClick={sendTestNotification}
          disabled={testing}
          style={{
            border: 0,
            borderRadius: "14px",
            padding: "12px 10px",
            background: "#16a34a",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "15px",
          }}
        >
          {testing ? "Sending..." : "Test Notification"}
        </button>
      </div>

      {message ? (
        <p style={{ margin: "10px 0 0", color: "#0f172a", fontSize: "13px", fontWeight: 700 }}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
