"use client";

import { useEffect } from "react";

function cleanPhone(v: string) {
  let p = String(v || "").replace(/\D/g, "");
  if (p.startsWith("91") && p.length > 10) p = p.slice(-10);
  if (p.startsWith("0") && p.length > 10) p = p.slice(-10);
  return p.slice(-10);
}

function formatDate(v: string) {
  return v && v.includes("-") ? v.split("-").reverse().join("-") : v || "";
}

function vehicleNo(v: string) {
  return String(v || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function openInvoice(b: Record<string, any>) {
  const q = new URLSearchParams({
    bookingId: b.booking_id || "",
    customerName: b.customer_name || "",
    customerPhone: cleanPhone(b.customer_phone || b.phone || ""),
    service: b.service || "One Way Drop Pickup",
    pickup: b.pickup || "",
    drop: b.drop_location || b.drop || "",
    journeyDate: formatDate(b.journey_date || ""),
    journeyTime: b.journey_time || "",
    vehicleType: b.vehicle_type || "",
    vehicleModel: b.vehicle_model || "",
    vehicleNumber: vehicleNo(b.vehicle_number || ""),
    driverName: b.driver_name || "",
    driverMobile: cleanPhone(b.driver_mobile || b.driver_phone || ""),
    fare: String(b.fare || 0),
    advance: String(b.advance || 0),
  });
  window.open(`/invoice?${q.toString()}`, "_blank");
}

export default function AdminRecentPdfFix() {
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    async function handler(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button") as HTMLButtonElement | null;
      if (!button || button.textContent?.trim() !== "PDF") return;

      const row = button.closest("tr");
      const cells = row ? Array.from(row.querySelectorAll("td")) : [];
      const bookingId = cells[0]?.textContent?.trim() || "";
      if (!bookingId) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      try {
        if (supabaseUrl && supabaseKey) {
          const res = await fetch(`${supabaseUrl}/rest/v1/bookings?booking_id=eq.${encodeURIComponent(bookingId)}&select=*&limit=1`, {
            headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.[0]) return openInvoice(data[0]);
          }
        }
      } catch {}

      const route = cells[3]?.textContent || "";
      const parts = route.split(" to ");
      openInvoice({
        booking_id: bookingId,
        customer_name: cells[1]?.textContent?.trim() || "",
        customer_phone: cells[2]?.textContent?.trim() || "",
        pickup: parts[0]?.trim() || "",
        drop_location: parts.slice(1).join(" to ").trim(),
        journey_date: cells[4]?.textContent?.trim() || "",
        fare: String(cells[5]?.textContent || "").replace(/[^0-9.]/g, ""),
      });
    }

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return null;
}
