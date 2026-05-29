"use client";

import { useEffect, useState } from "react";
import {
  acceptBookingRequest,
  cancelBookingRequest,
  createBookingRequestsChannelName,
  fetchPendingBookingRequests,
  fromDb,
  type BookingRequestRecord,
} from "@/lib/bookingRequestService";

type AdminPrefillData = {
  customerName: string;
  customerPhone: string;
  service: string;
  pickup: string;
  drop: string;
  journeyDate: string;
  journeyTime: string;
  vehicleModel: string;
};

type Props = {
  isActive?: boolean;
  onAcceptBooking?: (request: BookingRequestRecord, prefill: AdminPrefillData) => void;
};

export default function AdminIncomingBookingRequests({ isActive = true, onAcceptBooking }: Props) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const [requests, setRequests] = useState<BookingRequestRecord[]>([]);
  const [selected, setSelected] = useState<BookingRequestRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isActive || !supabaseUrl || !supabaseKey) return;

    let stopped = false;
    let channel: any = null;

    async function loadPending() {
      try {
        const pending = await fetchPendingBookingRequests({ supabaseUrl, supabaseKey });
        if (!stopped) setRequests(pending);
      } catch (err: any) {
        if (!stopped) setError(err?.message || "Pending requests load nahi ho paya.");
      }
    }

    async function startRealtime() {
      const { createClient } = await import("@supabase/supabase-js");
      if (stopped) return;
      const supabase = createClient(supabaseUrl, supabaseKey);
      channel = supabase
        .channel(createBookingRequestsChannelName())
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "booking_requests" },
          (payload: any) => {
            const next = fromDb(payload.new);
            if (next.status !== "pending") return;
            setRequests((prev) => (prev.some((item) => item.id === next.id) ? prev : [...prev, next]));
            setSelected((current) => current || next);
          }
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "booking_requests" },
          (payload: any) => {
            const next = fromDb(payload.new);
            setRequests((prev) => {
              if (next.status !== "pending") return prev.filter((item) => item.id !== next.id);
              return prev.map((item) => (item.id === next.id ? next : item));
            });
          }
        )
        .subscribe();
    }

    loadPending();
    startRealtime().catch(console.log);

    return () => {
      stopped = true;
      if (channel) channel.unsubscribe();
    };
  }, [isActive, supabaseUrl, supabaseKey]);

  useEffect(() => {
    if (!selected && requests.length === 1) setSelected(requests[0]);
  }, [requests, selected]);

  async function acceptSelected() {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      const accepted = await acceptBookingRequest({ supabaseUrl, supabaseKey, requestId: selected.id });
      setRequests((prev) => prev.filter((item) => item.id !== selected.id));
      setSelected(null);
      onAcceptBooking?.(accepted, {
        customerName: accepted.customerName,
        customerPhone: accepted.customerPhone,
        service: accepted.service || "",
        pickup: accepted.pickup,
        drop: accepted.drop,
        journeyDate: accepted.journeyDate,
        journeyTime: accepted.journeyTime,
        vehicleModel: accepted.requestedVehicle || "",
      });
    } catch (err: any) {
      setError(err?.message || "Accept nahi ho paya.");
    } finally {
      setBusy(false);
    }
  }

  async function cancelSelected() {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      await cancelBookingRequest({ supabaseUrl, supabaseKey, requestId: selected.id });
      setRequests((prev) => prev.filter((item) => item.id !== selected.id));
      setSelected(null);
    } catch (err: any) {
      setError(err?.message || "Cancel nahi ho paya.");
    } finally {
      setBusy(false);
    }
  }

  if (!isActive || requests.length === 0) return null;

  return (
    <div style={dock}>
      {error ? <div style={errorBox}>{error}</div> : null}

      {!selected && requests.length > 1 ? (
        <div style={listCard}>
          <div style={listHead}>
            <b>{requests.length} Pending Booking Requests</b>
            <span>Tap any request</span>
          </div>
          <div style={requestList}>
            {requests.map((request) => (
              <button key={request.id} type="button" style={requestItem} onClick={() => setSelected(request)}>
                <b>{request.customerName || "Customer"}</b>
                <span>{request.pickup || "-"} → {request.drop || "-"}</span>
                <small>{request.service || "Service"} • {request.requestedVehicle || "Vehicle"}</small>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {selected ? (
        <div style={overlay}>
          <div style={popup}>
            <div style={topLine}>
              <span style={badge}>New Booking Request</span>
              {requests.length > 1 ? <button type="button" style={miniClose} onClick={() => setSelected(null)}>List</button> : null}
            </div>
            <h2 style={title}>{selected.customerName || "Customer"}</h2>
            <p style={subtitle}>Customer ko ye service / vehicle chahiye:</p>

            <div style={section}>
              <Info label="Mobile" value={selected.customerPhone} />
              <Info label="Service" value={selected.service || "-"} />
              <Info label="Vehicle Required" value={selected.requestedVehicle || "-"} />
              <Info label="Pickup" value={selected.pickup} />
              <Info label="Drop" value={selected.drop} />
              <Info label="Date" value={selected.journeyDate} />
              <Info label="Time" value={selected.journeyTime} />
            </div>

            <div style={btnRow}>
              <button type="button" style={cancelBtn} disabled={busy} onClick={cancelSelected}>Cancel</button>
              <button type="button" style={acceptBtn} disabled={busy} onClick={acceptSelected}>
                {busy ? "Please wait..." : "Accept Booking"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
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

const dock = { position: "fixed", inset: "auto 10px 10px 10px", zIndex: 9998, pointerEvents: "none" } as const;
const errorBox = { pointerEvents: "auto", maxWidth: 480, margin: "0 auto 8px", borderRadius: 12, background: "#fff1f2", color: "#b91c1c", padding: 10, fontSize: 13, fontWeight: 800 } as const;
const listCard = { pointerEvents: "auto", maxWidth: 480, margin: "0 auto", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 12, boxShadow: "0 18px 45px rgba(15,23,42,.18)", fontFamily: "Arial, sans-serif" } as const;
const listHead = { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", color: "#0f172a", fontSize: 13, marginBottom: 8 } as const;
const requestList = { display: "grid", gap: 8, maxHeight: 270, overflowY: "auto" } as const;
const requestItem = { textAlign: "left", border: "1px solid #e2e8f0", borderRadius: 14, background: "#f8fafc", padding: 10, display: "grid", gap: 4, color: "#0f172a" } as const;
const overlay = { position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,23,42,.58)", display: "grid", placeItems: "center", padding: 14, pointerEvents: "auto" } as const;
const popup = { width: "100%", maxWidth: 480, background: "#fff", borderRadius: 22, padding: 16, boxShadow: "0 28px 80px rgba(0,0,0,.32)", fontFamily: "Arial, sans-serif" } as const;
const topLine = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 } as const;
const badge = { borderRadius: 999, background: "#fff7ed", color: "#ea580c", fontWeight: 900, fontSize: 12, padding: "7px 10px" } as const;
const miniClose = { border: "1px solid #cbd5e1", background: "#fff", borderRadius: 10, padding: "7px 10px", fontWeight: 800 } as const;
const title = { margin: "14px 0 4px", fontSize: 24, color: "#0f172a" } as const;
const subtitle = { margin: 0, color: "#64748b", fontSize: 14 } as const;
const section = { marginTop: 14, border: "1px solid #e2e8f0", borderRadius: 16, background: "#f8fafc", padding: 12 } as const;
const infoRow = { display: "flex", justifyContent: "space-between", gap: 12, borderTop: "1px dashed #dbe3ee", padding: "9px 0" } as const;
const infoLabel = { minWidth: 112, color: "#64748b", fontSize: 13 } as const;
const infoValue = { color: "#0f172a", textAlign: "right", fontSize: 13, wordBreak: "break-word" } as const;
const btnRow = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 } as const;
const cancelBtn = { border: "1px solid #fecaca", borderRadius: 14, background: "#fff1f2", color: "#b91c1c", fontWeight: 900, minHeight: 44 } as const;
const acceptBtn = { border: 0, borderRadius: 14, background: "#16a34a", color: "#fff", fontWeight: 900, minHeight: 44 } as const;
