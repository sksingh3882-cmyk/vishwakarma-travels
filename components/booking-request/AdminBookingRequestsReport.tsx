"use client";

import { useMemo, useState } from "react";
import { fromDb, type BookingRequestRecord, type BookingRequestStatus } from "@/lib/bookingRequestService";

type Filter = "all" | BookingRequestStatus;
type Props = {
  onAcceptRequest?: (request: BookingRequestRecord) => void;
};


export default function AdminBookingRequestsReport({ onAcceptRequest }: Props) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<BookingRequestRecord[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<BookingRequestRecord | null>(null);

  const headers = useMemo(() => ({
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  }), [supabaseKey]);

  const counts = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    confirmed: requests.filter((r) => r.status === "confirmed").length,
    cancelled: requests.filter((r) => r.status === "cancelled").length,
  }), [requests]);

  const visible = useMemo(() => {
    if (filter === "all") return requests;
    return requests.filter((request) => request.status === filter);
  }, [requests, filter]);

  async function loadRequests() {
    if (!supabaseUrl || !supabaseKey) {
      setError("Supabase URL/KEY missing hai.");
      return;
    }

    setOpen(true);
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/booking_requests?select=*&order=created_at.desc&limit=100`, {
        headers: { ...headers, Prefer: "return=minimal" },
      });
      if (!res.ok) throw new Error("Unable to load booking requests.");
      const rows = await res.json();
      setRequests(Array.isArray(rows) ? rows.map(fromDb) : []);
    } catch (err: any) {
      setError(err?.message || "Unable to load booking requests.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateRequestStatus(status: BookingRequestStatus, openInForm = false) {
    if (!selected?.id) return;
    setActionLoading(true);
    setError("");
    try {
      const payload: Record<string, string> = { status };
      if (status === "accepted") payload.accepted_at = new Date().toISOString();
      const res = await fetch(`${supabaseUrl}/rest/v1/booking_requests?id=eq.${selected.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request update failed.");
      const rows = await res.json();
      const updated = fromDb(rows?.[0] || rows);
      setRequests((prev) => prev.map((item) => item.id === updated.id ? updated : item));
      setSelected(updated);

      if (openInForm && status === "accepted") {
        onAcceptRequest?.(updated);
        setSelected(null);
        setOpen(false);
      }
    } catch (err: any) {
      setError(err?.message || "Request update failed.");
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteSelectedRequest() {
    if (!selected?.id) return;
    if (!window.confirm("Delete this booking request permanently?")) return;
    setActionLoading(true);
    setError("");
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/booking_requests?id=eq.${selected.id}`, {
        method: "DELETE",
        headers: { ...headers, Prefer: "return=minimal" },
      });
      if (!res.ok) throw new Error("Request delete failed.");
      setRequests((prev) => prev.filter((item) => item.id !== selected.id));
      setSelected(null);
    } catch (err: any) {
      setError(err?.message || "Request delete failed.");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <>
      <button type="button" style={viewBtn} onClick={loadRequests}>
        View Booking Requests
      </button>

      {open && (
        <div style={overlay}>
          <div style={card}>
            <div style={handle} />
            <div style={head}>
              <div>
                <h2 style={title}>Booking Requests Report</h2>
                <p style={sub}>Tap any request to accept, reject or delete.</p>
              </div>
              <button type="button" style={closeBtn} onClick={() => setOpen(false)}>×</button>
            </div>

            <div style={countGrid}>
              <button type="button" style={statBtn(filter === "all")} onClick={() => setFilter("all")}><b>{counts.total}</b><span>Total</span></button>
              <button type="button" style={statBtn(filter === "pending")} onClick={() => setFilter("pending")}><b>{counts.pending}</b><span>Pending</span></button>
              <button type="button" style={statBtn(filter === "accepted")} onClick={() => setFilter("accepted")}><b>{counts.accepted}</b><span>Accepted</span></button>
              <button type="button" style={statBtn(filter === "confirmed")} onClick={() => setFilter("confirmed")}><b>{counts.confirmed}</b><span>Confirmed</span></button>
              <button type="button" style={statBtn(filter === "cancelled")} onClick={() => setFilter("cancelled")}><b>{counts.cancelled}</b><span>Cancelled</span></button>
            </div>

            {loading && <p style={message}>Loading booking requests...</p>}
            {error && <p style={errorText}>{error}</p>}
            {!loading && !error && visible.length === 0 && <p style={message}>No booking request found.</p>}

            {!loading && !error && visible.length > 0 && (
              <div style={list}>
                {visible.map((request) => (
                  <button key={request.id} type="button" style={item} onClick={() => setSelected(request)}>
                    <div style={itemTop}>
                      <b>{request.customerName || "Customer"}</b>
                      <span style={badge(request.status)}>{statusText(request.status)}</span>
                    </div>
                    <p style={route}>{request.pickup || "Pickup"} → {request.drop || "Drop"}</p>
                    <div style={smallGrid}>
                      <span>Mobile: {request.customerPhone || "-"}</span>
                      <span>Date: {formatDate(request.journeyDate)}</span>
                      <span>Time: {formatTime(request.journeyTime)}</span>
                      <span>Vehicle: {request.requestedVehicle || request.vehicleModel || "-"}</span>
                    </div>
                    {request.status === "confirmed" ? (
                      <div style={driverBox}>
                        <b>{request.vehicleNo || "Vehicle No"}</b>
                        <span>{request.driverName || "Driver"} • {request.driverMobile || "Mobile"}</span>
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selected && (
            <div style={actionOverlay} onClick={() => setSelected(null)}>
              <div style={actionCard} onClick={(e) => e.stopPropagation()}>
                <div style={handle} />
                <h2 style={actionTitle}>{selected.customerName || "Customer"}</h2>
                <p style={actionRoute}>{selected.pickup || "Pickup"} → {selected.drop || "Drop"}</p>
                <div style={actionInfo}>
                  <span>Mobile: {selected.customerPhone || "-"}</span>
                  <span>Date: {formatDate(selected.journeyDate)}</span>
                  <span>Time: {formatTime(selected.journeyTime)}</span>
                  <span>Status: {statusText(selected.status)}</span>
                </div>

                <div style={actionGrid}>
                  <button type="button" style={acceptBtn} disabled={actionLoading} onClick={() => updateRequestStatus("accepted", true)}>Accept & Open Form</button>
                  <button type="button" style={rejectBtn} disabled={actionLoading} onClick={() => updateRequestStatus("cancelled")}>Reject / Cancel</button>
                  <button type="button" style={deleteBtn} disabled={actionLoading} onClick={deleteSelectedRequest}>Delete</button>
                  <button type="button" style={closeActionBtn} disabled={actionLoading} onClick={() => setSelected(null)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function statusText(status: BookingRequestStatus) {
  if (status === "pending") return "Pending";
  if (status === "accepted") return "Accepted";
  if (status === "confirmed") return "Confirmed";
  return "Cancelled";
}

function formatDate(value?: string) {
  const v = String(value || "").trim();
  if (!v) return "-";

  const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;

  const old = v.match(/^(\d{2})-(\d{2})-(\d{4})/);
  if (old) return `${old[1]}/${old[2]}/${old[3]}`;

  return v;
}

function formatTime(value?: string) {
  const v = String(value || "").trim();
  if (!v) return "-";

  if (/\b(AM|PM)\b/i.test(v)) {
    return v.toUpperCase();
  }

  const match = v.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return v;

  const hour = Number(match[1]);
  const minute = match[2];

  if (Number.isNaN(hour)) return v;

  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${String(hour12).padStart(2, "0")}:${minute} ${ampm}`;
}

const viewBtn = { gridColumn: "1/-1", width: "100%", minHeight: 44, border: 0, borderRadius: 14, background: "#0b2d6b", color: "#fff", fontWeight: 900, fontSize: 15, marginTop: 4 } as const;
const overlay = { position: "fixed", inset: 0, zIndex: 10000, background: "rgba(15,23,42,.58)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 12 } as const;
const card = { width: "100%", maxWidth: 560, maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: "24px 24px 16px 16px", padding: 16, boxShadow: "0 28px 80px rgba(0,0,0,.32)", fontFamily: "Arial, sans-serif" } as const;
const handle = { width: 52, height: 5, borderRadius: 99, background: "#cbd5e1", margin: "0 auto 14px" } as const;
const head = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 } as const;
const title = { margin: 0, color: "#0f172a", fontSize: 21 } as const;
const sub = { margin: "6px 0 0", color: "#64748b", fontSize: 13, lineHeight: 1.35 } as const;
const closeBtn = { border: "1px solid #e2e8f0", background: "#fff", borderRadius: 12, width: 38, height: 38, fontSize: 24, lineHeight: 1, color: "#0f172a" } as const;
const countGrid = { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 7, marginTop: 14, overflowX: "auto" } as const;
function statBtn(active: boolean) {
  return { minWidth: 78, border: active ? "2px solid #0b2d6b" : "1px solid #e2e8f0", borderRadius: 14, background: active ? "#eff6ff" : "#f8fafc", color: "#0f172a", padding: "9px 6px", display: "grid", gap: 2, fontSize: 11, fontWeight: 800 } as const;
}
const message = { margin: "18px 0", color: "#64748b", textAlign: "center", fontSize: 14 } as const;
const errorText = { margin: "18px 0", color: "#b91c1c", textAlign: "center", fontSize: 14, fontWeight: 800 } as const;
const list = { display: "grid", gap: 10, marginTop: 14 } as const;
const item = { width: "100%", textAlign: "left", border: "1px solid #e2e8f0", borderRadius: 16, background: "#f8fafc", padding: 12, display: "block" } as const;
const itemTop = { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", color: "#0f172a", fontSize: 14 } as const;
const route = { margin: "8px 0", color: "#0b2d6b", fontWeight: 900, fontSize: 14, lineHeight: 1.3 } as const;
const smallGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, color: "#475569", fontSize: 12, fontWeight: 700 } as const;
const driverBox = { marginTop: 10, borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: 10, display: "grid", gap: 4, color: "#166534", fontSize: 13 } as const;
function badge(status: BookingRequestStatus) {
  const map: Record<BookingRequestStatus, string> = {
    pending: "#f97316",
    accepted: "#2563eb",
    confirmed: "#16a34a",
    cancelled: "#dc2626",
  };
  return { borderRadius: 999, background: map[status] || "#64748b", color: "#fff", padding: "5px 9px", fontSize: 11, fontWeight: 900, whiteSpace: "nowrap" } as const;
}
const actionOverlay = { position: "fixed", inset: 0, zIndex: 10001, background: "rgba(15,23,42,.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 12px 110px" } as const;
const actionCard = { width: "100%", maxWidth: 460, maxHeight: "calc(100vh - 160px)", overflowY: "auto", background: "#fff", borderRadius: 22, padding: 16, boxShadow: "0 28px 80px rgba(0,0,0,.35)", fontFamily: "Arial, sans-serif" } as const;
const actionTitle = { margin: "0 0 6px", color: "#0f172a", fontSize: 20 } as const;
const actionRoute = { margin: "0 0 10px", color: "#0b2d6b", fontWeight: 900, fontSize: 14, lineHeight: 1.35 } as const;
const actionInfo = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, color: "#475569", fontSize: 13, fontWeight: 700, marginBottom: 14 } as const;
const actionGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } as const;
const acceptBtn = { border: 0, borderRadius: 14, minHeight: 44, background: "#16a34a", color: "#fff", fontWeight: 900, fontSize: 13 } as const;
const rejectBtn = { border: 0, borderRadius: 14, minHeight: 44, background: "#f97316", color: "#fff", fontWeight: 900, fontSize: 13 } as const;
const deleteBtn = { border: 0, borderRadius: 14, minHeight: 44, background: "#dc2626", color: "#fff", fontWeight: 900, fontSize: 13 } as const;
const closeActionBtn = { border: "1px solid #cbd5e1", borderRadius: 14, minHeight: 44, background: "#fff", color: "#0f172a", fontWeight: 900, fontSize: 13 } as const;
