"use client";

import { useState } from "react";
import DriverDutyActions from "@/components/admin/DriverDutyActions";

export default function DriverDutyDemoPage() {
  const [data, setData] = useState({
    customerName: "Rajesh Kumar",
    customerPhone: "9876543210",
    pickup: "Jugsalai, Jamshedpur",
    drop: "Ranchi Airport",
    journeyDate: "2026-05-26",
    journeyTime: "05:30 AM",
    vehicleType: "Sedan",
    vehicleModel: "Dzire",
    vehicleNumber: "JH05AB1234",
    driverName: "Suresh Singh",
    driverMobile: "9876500000",
    feedback: "Customer prefers on-time pickup. Please call before arrival.",
  });

  const set = (key: string, value: string) => setData((p) => ({ ...p, [key]: value }));

  return (
    <main style={{ minHeight: "100vh", background: "#f1f5f9", padding: 16, fontFamily: "Arial, sans-serif" }}>
      <section style={{ maxWidth: 720, margin: "0 auto", background: "white", padding: 18, borderRadius: 18, boxShadow: "0 12px 30px rgba(0,0,0,.12)" }}>
        <h1 style={{ color: "#0b2d6b", marginTop: 0 }}>Driver Duty Demo</h1>
        <p>Test page for Driver WhatsApp and Driver Duty JPG.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
          {Object.entries(data).map(([key, value]) => (
            <input
              key={key}
              value={value}
              onChange={(e) => set(key, e.target.value)}
              placeholder={key}
              style={{ padding: 12, borderRadius: 12, border: "1px solid #cbd5e1" }}
            />
          ))}
        </div>

        <DriverDutyActions data={data} />
      </section>
    </main>
  );
}
