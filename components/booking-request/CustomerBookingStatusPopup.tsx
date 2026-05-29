"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createBookingRequest,
  createBookingRequestsChannelName,
  fromDb,
  type BookingRequestInput,
  type BookingRequestRecord,
} from "@/lib/bookingRequestService";

type Props = {
  open: boolean;
  bookingData: BookingRequestInput;
  onClose: () => void;
};

export default function CustomerBookingStatusPopup({ open, bookingData, onClose }: Props) {
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

  async function sendRequest() {
    if (!supabaseUrl || !supabaseKey) {
      setError("Supabase URL/KEY missing hai.");
      return;
    }
    if (!bookingData.customerName || !bookingData.customerPhone || !bookingData.pickup || !bookingData.drop) {
      setError("Name, mobile, pickup aur drop required hai.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const created = await createBookingRequest({ supabaseUrl, supabaseKey, input: bookingData });
      setRequest(created);
    } catch (err: any) {
      setError(err?.message || "Booking request send nahi ho paya.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open || request || loading) return;
    sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open || !request?.id || !supabaseUrl || !supabaseKey) return;

    let stopped = false;
    let channel: any = null;

    async function startRealtime() {
      const { createClient } = await import("@supabase/supabase-js");
      if (stopped) return;

      const supabase = createClient(supabaseUrl, supabaseKey);
      channel = supabase
        .channel(createBookingRequestsChannelName(request.id))
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "booking_requests",
            filter: `id=eq.${request.id}`,
          },
          (payload: any) => setRequest(fromDb(payload.new))
        )
        .subscribe();
    }

    startRealtime().catch(console.log);

    return () => {
      stopped = true;
      if (channel) channel.unsubscribe();
    };
  }, [open, request?.id, supabaseUrl, supabaseKey]);

  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={card}>
        <div style={handle} />

        {loading && <StatusHeader icon="⏳" title="Booking Request Sending..." subtitle="Please wait" />}

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
                <StatusHeader icon="🕘" title="Waiting for Admin Confirmation" subtitle="Aapki booking request admin ko send ho gayi hai." />
                <TripDetails request={request} />
                <div style={btnRow}>
                  <button type="button" style={ghostBtn} onClick={sendRequest}>Resend</button>
                  <button type="button" style={dangerBtn} onClick={onClose}>Cancel</button>
                </div>
              </>
            )}

            {isAccepted && (
              <>
                <StatusHeader icon="✅" title="Admin has accepted your booking request" subtitle="Vehicle details assign ho rahi hai. Please wait." />
                <TripDetails request={request} />
                <button type="button" style={ghostBtn} onClick={onClose}>Close</button>
              </>
            )}

            {isConfirmed && (
              <>
                <StatusHeader icon="🚖" title="Booking Confirmed" subtitle="Driver aur vehicle details assign ho gayi hai." />
                <TripDetails request={request} />
                <DriverDetails request={request} />
                {callDriverHref ? (
                  <a href={callDriverHref} style={callBtn}>📞 Call Now Driver</a>
                ) : null}
                <button type="button" style={ghostBtn} onClick={onClose}>Close</button>
              </>
            )}

            {request.status === "cancelled" && (
              <>
                <StatusHeader icon="❌" title="Request Cancelled" subtitle="Booking request cancel ho gayi hai." />
                <button type="button" style={ghostBtn} onClick={onClose}>Close</button>
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

function TripDetails({ request }: { request: BookingRequestRecord }) {
  return (
    <div style={section}>
      <h3 style={sectionTitle}>Trip Details</h3>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoRow}>
      <span style={infoLabel}>{label}</span>
      <b style={infoValue}>{value || "-"}</b>
    </div>
  );
}

const overlay = { position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 12 } as const;
const card = { width: "100%", maxWidth: 460, maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: "24px 24px 16px 16px", padding: 16, boxShadow: "0 24px 80px rgba(0,0,0,.28)", fontFamily: "Arial, sans-serif" } as const;
const handle = { width: 52, height: 5, borderRadius: 99, background: "#cbd5e1", margin: "0 auto 14px" } as const;
const headerBox = { textAlign: "center", padding: "8px 6px 12px" } as const;
const iconBox = { width: 62, height: 62, borderRadius: 18, background: "#eff6ff", display: "grid", placeItems: "center", fontSize: 32, margin: "0 auto 10px" } as const;
const titleStyle = { margin: 0, color: "#0f172a", fontSize: 20, lineHeight: 1.2 } as const;
const subStyle = { margin: "8px 0 0", color: "#64748b", fontSize: 14, lineHeight: 1.35 } as const;
const section = { border: "1px solid #e2e8f0", background: "#f8fafc", borderRadius: 16, padding: 12, marginTop: 12 } as const;
const sectionGreen = { border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 16, padding: 12, marginTop: 12 } as const;
const sectionTitle = { margin: "0 0 10px", fontSize: 15, color: "#0f172a" } as const;
const infoRow = { display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderTop: "1px dashed #dbe3ee" } as const;
const infoLabel = { color: "#64748b", fontSize: 13, minWidth: 96 } as const;
const infoValue = { color: "#0f172a", fontSize: 13, textAlign: "right", wordBreak: "break-word" } as const;
const btnRow = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 } as const;
const primaryBtn = { width: "100%", border: 0, borderRadius: 14, padding: "12px 14px", background: "#2563eb", color: "#fff", fontWeight: 800, fontSize: 15 } as const;
const ghostBtn = { width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: "12px 14px", background: "#fff", color: "#0f172a", fontWeight: 800, fontSize: 15, marginTop: 12 } as const;
const dangerBtn = { width: "100%", border: "1px solid #fecaca", borderRadius: 14, padding: "12px 14px", background: "#fff1f2", color: "#b91c1c", fontWeight: 800, fontSize: 15 } as const;
const callBtn = { display: "block", textAlign: "center", textDecoration: "none", borderRadius: 16, padding: "14px 16px", background: "#16a34a", color: "#fff", fontWeight: 900, fontSize: 16, marginTop: 14 } as const;
