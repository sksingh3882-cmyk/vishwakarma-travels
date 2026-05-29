"use client";

import { useState } from "react";
import CustomerBookingStatusPopup from "./CustomerBookingStatusPopup";
import {
  fetchBookingRequestsByPhone,
  type BookingRequestInput,
  type BookingRequestRecord,
} from "@/lib/bookingRequestService";

type Props = {
  bookingData: BookingRequestInput;
  onDownloadCopy?: () => void;
  onWhatsAppRequest?: () => void;
};

export default function CustomerBookNowSection({ bookingData, onDownloadCopy, onWhatsAppRequest }: Props) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const [open, setOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [bookings, setBookings] = useState<BookingRequestRecord[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequestRecord | null>(null);

  async function openYourBookings() {
    setListOpen(true);
    setListLoading(true);
    setListError("");
    try {
      const rows = await fetchBookingRequestsByPhone({
        supabaseUrl,
        supabaseKey,
        customerPhone: bookingData.customerPhone,
      });
      setBookings(rows);
    } catch (err: any) {
      setListError(err?.message || "Unable to load your bookings.");
    } finally {
      setListLoading(false);
    }
  }

  function openNewRequest() {
    setSelectedRequest(null);
    setOpen(true);
  }

  function openExistingRequest(request: BookingRequestRecord) {
    setSelectedRequest(request);
    setListOpen(false);
    setOpen(true);
  }

  return (
    <div style={wrap}>
      <button type="button" style={bookNowBtn} onClick={openNewRequest}>
        Book Now
      </button>

      <div style={smallRow}>
        <button type="button" style={smallBtn} onClick={onDownloadCopy}>
          Download Copy
        </button>
        <button type="button" style={whatsBtn} onClick={onWhatsAppRequest}>
          WhatsApp
        </button>
        <button type="button" style={bookingBtn} onClick={openYourBookings}>
          Your Booking
        </button>
      </div>

      {listOpen && (
        <div style={overlay}>
          <div style={listCard}>
            <div style={handle} />
            <div style={listHead}>
              <div>
                <h2 style={listTitle}>Your Bookings</h2>
                <p style={listSub}>Tap any booking to view current status and driver details.</p>
              </div>
              <button type="button" style={xBtn} onClick={() => setListOpen(false)}>×</button>
            </div>

            {listLoading && <p style={message}>Loading your bookings...</p>}
            {listError && <p style={errorText}>{listError}</p>}
            {!listLoading && !listError && bookings.length === 0 && (
              <p style={message}>No booking request found for this mobile number.</p>
            )}

            {!listLoading && !listError && bookings.length > 0 && (
              <div style={bookingList}>
                {bookings.map((item) => (
                  <button key={item.id} type="button" style={bookingItem} onClick={() => openExistingRequest(item)}>
                    <span style={routeText}>{item.pickup || "Pickup"} → {item.drop || "Drop"}</span>
                    <span style={dateText}>Date - {formatDisplayDate(item.journeyDate)}</span>
                    <span style={statusText}>{statusLabel(item.status)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <CustomerBookingStatusPopup
        open={open}
        bookingData={bookingData}
        existingRequest={selectedRequest}
        onClose={() => {
          setOpen(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
}

function formatDisplayDate(value: string) {
  if (!value) return "-";
  if (!value.includes("-")) return value;
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}

function statusLabel(status: string) {
  if (status === "confirmed") return "Confirmed";
  if (status === "accepted") return "Accepted";
  if (status === "cancelled") return "Cancelled";
  return "Waiting";
}

const wrap = { width: "100%", display: "grid", gap: 8, marginTop: 10 } as const;
const bookNowBtn = {
  width: "min(92vw, 330px)",
  minHeight: 38,
  border: 0,
  borderRadius: 14,
  justifySelf: "center",
  background: "linear-gradient(135deg,#f97316,#ea580c)",
  color: "#fff",
  fontSize: 16,
  fontWeight: 900,
  letterSpacing: ".2px",
  boxShadow: "0 12px 26px rgba(234,88,12,.28)",
} as const;
const smallRow = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, width: "min(92vw, 330px)", justifySelf: "center" } as const;
const smallBtn = { minHeight: 32, border: "1px solid #cbd5e1", borderRadius: 12, background: "#fff", color: "#0f172a", fontWeight: 800, fontSize: 11 } as const;
const whatsBtn = { minHeight: 32, border: "1px solid #bbf7d0", borderRadius: 12, background: "#ecfdf5", color: "#047857", fontWeight: 800, fontSize: 11 } as const;
const bookingBtn = { minHeight: 32, border: "1px solid #fed7aa", borderRadius: 12, background: "#fff7ed", color: "#c2410c", fontWeight: 800, fontSize: 11 } as const;
const overlay = { position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 12 } as const;
const listCard = { width: "100%", maxWidth: 460, maxHeight: "82vh", overflowY: "auto", background: "#fff", borderRadius: "24px 24px 16px 16px", padding: 16, boxShadow: "0 24px 80px rgba(0,0,0,.28)", fontFamily: "Arial, sans-serif" } as const;
const handle = { width: 52, height: 5, borderRadius: 99, background: "#cbd5e1", margin: "0 auto 14px" } as const;
const listHead = { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 } as const;
const listTitle = { margin: 0, color: "#0f172a", fontSize: 20 } as const;
const listSub = { margin: "6px 0 0", color: "#64748b", fontSize: 13, lineHeight: 1.35 } as const;
const xBtn = { border: "1px solid #e2e8f0", background: "#fff", borderRadius: 12, width: 38, height: 38, fontSize: 24, lineHeight: 1, color: "#0f172a" } as const;
const message = { margin: "18px 0", color: "#64748b", textAlign: "center", fontSize: 14 } as const;
const errorText = { margin: "18px 0", color: "#b91c1c", textAlign: "center", fontSize: 14, fontWeight: 800 } as const;
const bookingList = { display: "grid", gap: 9 } as const;
const bookingItem = { width: "100%", textAlign: "left", border: "1px solid #e2e8f0", borderRadius: 14, background: "#f8fafc", padding: 12, display: "grid", gap: 6 } as const;
const routeText = { color: "#0f172a", fontWeight: 900, fontSize: 14, lineHeight: 1.3 } as const;
const dateText = { color: "#475569", fontWeight: 700, fontSize: 13 } as const;
const statusText = { justifySelf: "start", borderRadius: 999, background: "#eff6ff", color: "#1d4ed8", padding: "4px 9px", fontSize: 11, fontWeight: 900 } as const;
