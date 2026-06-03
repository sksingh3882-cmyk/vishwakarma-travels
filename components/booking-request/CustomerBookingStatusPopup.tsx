"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createBookingRequest,
  fetchBookingRequestById,
  type BookingRequestInput,
  type BookingRequestRecord,
} from "@/lib/bookingRequestService";

type Props = {
  open: boolean;
  bookingData: BookingRequestInput;
  onClose: () => void;
  existingRequest?: BookingRequestRecord | null;
  onRequestSent?: () => void;
};

export default function CustomerBookingStatusPopup({ open, bookingData, onClose, existingRequest = null, onRequestSent }: Props) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const [request, setRequest] = useState<BookingRequestRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isConfirmed = request?.status === "confirmed";
  const isAccepted = request?.status === "accepted";
  const isPending = request?.status === "pending";

  const callDriverHref = useMemo(() => {
    const phone = String(request?.driverMobile || "").replace(/\D/g, "");
    return phone ? `tel:+91${phone.slice(-10)}` : "";
  }, [request?.driverMobile]);

  async function subscribeCustomerForBooking(createdRequest: BookingRequestRecord) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!publicKey) return;
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const padding = "=".repeat((4 - (publicKey.length % 4)) % 4);
  const base64 = (publicKey + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const applicationServerKey = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    applicationServerKey[i] = rawData.charCodeAt(i);
  }

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    }));

  await fetch("/api/push/customer/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bookingRequestId: createdRequest.id,
      customerPhone: createdRequest.customerPhone,
      subscription: subscription.toJSON(),
      userAgent: navigator.userAgent,
    }),
  });
  }
  async function sendRequest() {
    if (!supabaseUrl || !supabaseKey) {
      setError("Supabase URL or key is missing.");
      return;
    }
    if (!bookingData.customerName || !bookingData.customerPhone || !bookingData.pickup || !bookingData.drop) {
      setError("Name, mobile number, pickup and drop are required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const created = await createBookingRequest({ supabaseUrl, supabaseKey, input: bookingData });
setRequest(created);
onRequestSent?.();
subscribeCustomerForBooking(created).catch((err) =>
  console.log("Customer push subscription failed:", err)
);

fetch("/api/push/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "You Have New Booking Request",
    body: `${bookingData.customerName || "Customer"} - ${bookingData.pickup || "Pickup"} to ${bookingData.drop || "Drop"}`,
    url: "/admin",
    tag: `vt-new-booking-${created.id || Date.now()}`,
  }),
}).catch((err) => console.log("Admin push notification failed:", err));
    } catch (err: any) {
      setError(err?.message || "Unable to send booking request.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    setError("");
    if (existingRequest?.id) {
      setRequest(existingRequest);
      setLoading(false);
      return;
    }
    if (!request && !loading) sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, existingRequest?.id]);

  useEffect(() => {
    if (!open || !request?.id || !supabaseUrl || !supabaseKey) return;

    const intervalId = window.setInterval(async () => {
      try {
        const latest = await fetchBookingRequestById({ supabaseUrl, supabaseKey, requestId: request.id });
        if (latest) setRequest(latest);
      } catch (err) {
        console.log(err);
      }
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [open, request?.id, supabaseUrl, supabaseKey]);

  function closePopup() {
    setRequest(null);
    setError("");
    setLoading(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={card}>
        <button type="button" aria-label="Close" style={closeBtn} onClick={closePopup}>×</button>
        <div style={handle} />

        {loading && <StatusHeader icon="⏳" title="Sending Booking Request..." subtitle="Please wait" />}

        {error && (
          <>
            <StatusHeader icon="⚠️" title="Request Failed" subtitle={error} />
            <button type="button" style={primaryBtn} onClick={sendRequest}>Try Again</button>
          </>
        )}

        {!loading && !error && request && (
          <>
            {isPending && (
              <>
                <StatusHeader icon="🕘" title="Waiting for Admin Confirmation" subtitle="Your booking request has been sent to the admin." />
                <TripDetails request={request} />
                <div style={btnRow}>
                  <button type="button" style={ghostBtn} onClick={sendRequest}>Resend</button>
                  <button type="button" style={dangerBtn} onClick={closePopup}>Cancel</button>
                </div>
              </>
            )}

            {isAccepted && (
              <>
                <StatusHeader icon="✅" title="Admin has accepted your booking request" subtitle="Vehicle and driver details are being assigned. Please wait." />
                <TripDetails request={request} />
                <button type="button" style={ghostBtn} onClick={closePopup}>Close</button>
              </>
            )}

            {isConfirmed && (
              <>
                <StatusHeader icon="🚖" title="Booking Confirmed" subtitle="Vehicle and driver details have been assigned." />
                <TripDetails request={request} compact />
                <DriverDetails request={request} />
                {callDriverHref ? (
                  <a href={callDriverHref} style={callBtn}>📞 Call Driver Now</a>
                ) : null}
              </>
            )}

            {request.status === "cancelled" && (
              <>
                <StatusHeader icon="❌" title="Request Cancelled" subtitle="Your booking request has been cancelled." />
                <button type="button" style={ghostBtn} onClick={closePopup}>Close</button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatusHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div style={headerBox}>
      <div style={iconBox}>{icon}</div>
      <h2 style={titleStyle}>{title}</h2>
      <p style={subStyle}>{subtitle}</p>
    </div>
  );
}

function TripDetails({ request, compact = false }: { request: BookingRequestRecord; compact?: boolean }) {
  return (
    <div style={compact ? compactSection : section}>
      <h3 style={sectionTitle}>Trip Details</h3>
      <Info label="Booking ID" value={shortBookingId(request.id)} />
      <Info label="Name" value={request.customerName} />
      <Info label="Mobile" value={request.customerPhone} />
      <Info label="Service" value={request.service || "-"} />
      <Info label="Vehicle Required" value={request.requestedVehicle || "-"} />
      <Info label="Pickup" value={request.pickup} />
      <Info label="Drop" value={request.drop} />
      <Info label="Date" value={request.journeyDate} />
      <Info label="Time" value={request.journeyTime} />
    </div>
  );
}

function DriverDetails({ request }: { request: BookingRequestRecord }) {
  return (
    <div style={sectionGreen}>
      <h3 style={sectionTitle}>Driver Details</h3>
      <Info label="Vehicle No" value={request.vehicleNo || "-"} />
      <Info label="Vehicle" value={[request.vehicleType, request.vehicleModel].filter(Boolean).join(" ") || "-"} />
      <Info label="Driver Name" value={request.driverName || "-"} />
      <Info label="Driver Mobile" value={request.driverMobile || "-"} />
    </div>
  );
}

function shortBookingId(id?: string) {
  if (!id) return "-";

  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 10000;
  }

  return `VT-${String(hash).padStart(4, "0")}`;
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoRow}>
      <span style={infoLabel}>{label}</span>
      <b style={infoValue}>{value || "-"}</b>
    </div>
  );
}

const overlay = { position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 10px 18px" } as const;
const card = { width: "100%", maxWidth: 460, maxHeight: "calc(100vh - 95px)", overflowY: "auto", background: "#fff", borderRadius: 22, padding: "12px 12px 14px", boxShadow: "0 24px 80px rgba(0,0,0,.28)", fontFamily: "Arial, sans-serif", position: "relative" } as const;
const closeBtn = { position: "absolute", top: 10, right: 10, width: 38, height: 38, borderRadius: 14, border: "1px solid #e2e8f0", background: "#fff", color: "#0f172a", fontSize: 28, lineHeight: 1, fontWeight: 700, zIndex: 2 } as const;
const handle = { width: 52, height: 5, borderRadius: 99, background: "#cbd5e1", margin: "0 auto 10px" } as const;
const headerBox = { textAlign: "center", padding: "4px 44px 8px" } as const;
const iconBox = { width: 52, height: 52, borderRadius: 16, background: "#eff6ff", display: "grid", placeItems: "center", fontSize: 28, margin: "0 auto 8px" } as const;
const titleStyle = { margin: 0, color: "#0f172a", fontSize: 18, lineHeight: 1.2 } as const;
const subStyle = { margin: "6px 0 0", color: "#64748b", fontSize: 13, lineHeight: 1.3 } as const;
const section = { border: "1px solid #e2e8f0", background: "#f8fafc", borderRadius: 16, padding: 10, marginTop: 10 } as const;
const compactSection = { border: "1px solid #e2e8f0", background: "#f8fafc", borderRadius: 16, padding: 9, marginTop: 8 } as const;
const sectionGreen = { border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 16, padding: 10, marginTop: 10 } as const;
const sectionTitle = { margin: "0 0 8px", fontSize: 14, color: "#0f172a" } as const;
const infoRow = { display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0", borderTop: "1px dashed #dbe3ee" } as const;
const infoLabel = { color: "#64748b", fontSize: 12, minWidth: 92 } as const;
const infoValue = { color: "#0f172a", fontSize: 12, textAlign: "right", wordBreak: "break-word" } as const;
const btnRow = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 } as const;
const primaryBtn = { width: "100%", border: 0, borderRadius: 14, padding: "11px 14px", background: "#2563eb", color: "#fff", fontWeight: 800, fontSize: 14 } as const;
const ghostBtn = { width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: "11px 14px", background: "#fff", color: "#0f172a", fontWeight: 800, fontSize: 14, marginTop: 10 } as const;
const dangerBtn = { width: "100%", border: "1px solid #fecaca", borderRadius: 14, padding: "11px 14px", background: "#fff1f2", color: "#b91c1c", fontWeight: 800, fontSize: 14 } as const;
const callBtn = { display: "block", textAlign: "center", textDecoration: "none", borderRadius: 16, padding: "12px 14px", background: "#16a34a", color: "#fff", fontWeight: 900, fontSize: 15, marginTop: 12 } as const;
