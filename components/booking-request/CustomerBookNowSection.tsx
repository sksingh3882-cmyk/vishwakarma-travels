"use client";

import { useEffect, useState } from "react";
import CustomerBookingStatusPopup from "./CustomerBookingStatusPopup";
import RequestSentPopup from "./RequestSentPopup";
import {
  fetchBookingRequestById,
  fetchBookingRequestsByPhone,
  type BookingRequestInput,
  type BookingRequestRecord,
} from "@/lib/bookingRequestService";

type Props = {
  bookingData: BookingRequestInput;
  onDownloadCopy?: () => void;
  onWhatsAppRequest?: () => void;
  onRequestSentSuccess?: () => void;
};

function cleanPhone(value: string) {
  let phone = String(value || "").replace(/\D/g, "");
  if ((phone.startsWith("91") || phone.startsWith("0")) && phone.length > 10) phone = phone.slice(-10);
  return phone.slice(-10);
}

export default function CustomerBookNowSection({ bookingData, onDownloadCopy, onWhatsAppRequest, onRequestSentSuccess }: Props) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const [open, setOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [bookings, setBookings] = useState<BookingRequestRecord[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequestRecord | null>(null);
  const [lookupPhone, setLookupPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [autoOpenDone, setAutoOpenDone] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
const [submittedSignature, setSubmittedSignature] = useState("");
const [alreadySubmittedAlert, setAlreadySubmittedAlert] = useState("");
  const currentSignature = [
  cleanPhone(bookingData.customerPhone || ""),
  String(bookingData.pickup || "").trim().toLowerCase(),
  String(bookingData.drop || "").trim().toLowerCase(),
  String(bookingData.journeyDate || "").trim(),
  String(bookingData.journeyTime || "").trim(),
  String(bookingData.service || "").trim().toLowerCase(),
  String(bookingData.requestedVehicle || "").trim().toLowerCase(),
].join("|");

  useEffect(() => {
  if (autoOpenDone || !supabaseUrl || !supabaseKey) return;

  const requestId = new URLSearchParams(window.location.search).get("bookingRequestId");
  if (!requestId) return;

  setAutoOpenDone(true);

  fetchBookingRequestById({
    supabaseUrl,
    supabaseKey,
    requestId,
  })
    .then((latest) => {
      if (!latest) return;
      setSelectedRequest(latest);
      setListOpen(false);
      setOpen(true);
    })
    .catch((err) => console.log("Auto open booking status failed:", err));
}, [autoOpenDone, supabaseUrl, supabaseKey]);
  function openYourBookings() {
    setListOpen(true);
    setListError("");
    setBookings([]);
    setSearched(false);
    setLookupPhone(cleanPhone(bookingData.customerPhone || lookupPhone));
  }

  async function viewBookings() {
    const phone = cleanPhone(lookupPhone);
    if (phone.length !== 10) {
      setListError("Please enter a valid 10 digit mobile number.");
      setBookings([]);
      setSearched(true);
      return;
    }

    setListLoading(true);
    setListError("");
    setSearched(true);
    try {
      const rows = await fetchBookingRequestsByPhone({
        supabaseUrl,
        supabaseKey,
        customerPhone: phone,
      });
      setBookings(rows);
    } catch (err: any) {
      setListError(err?.message || "Unable to load your bookings.");
      setBookings([]);
    } finally {
      setListLoading(false);
    }
  }

  function openNewRequest() {
  if (submittedSignature && currentSignature === submittedSignature) {
    setAlreadySubmittedAlert("Your booking request is already submitted. Please check My Booking section.");
    return;
  }

  setAlreadySubmittedAlert("");
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
  {alreadySubmittedAlert && (
    <div style={alreadySubmittedBox}>
      ✅ {alreadySubmittedAlert}
    </div>
  )}

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
          My Booking
        </button>
      </div>

      {listOpen && (
        <div style={overlay}>
          <div style={listCard}>
            <div style={handle} />
            <div style={listHead}>
              <div>
                <h2 style={listTitle}>Your Bookings</h2>
                <p style={listSub}>Enter your mobile number to view your booking requests.</p>
              </div>
              <button type="button" style={xBtn} onClick={() => setListOpen(false)}>×</button>
            </div>

            <div style={lookupBox}>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter Mobile Number"
                value={lookupPhone}
                onChange={(e) => setLookupPhone(cleanPhone(e.target.value))}
                style={phoneInput}
              />
              <button type="button" style={viewBtn} onClick={viewBookings} disabled={listLoading}>
                {listLoading ? "Loading..." : "View Bookings"}
              </button>
            </div>

            {listError && <p style={errorText}>{listError}</p>}
            {listLoading && <p style={message}>Loading your bookings...</p>}
            {!listLoading && !listError && searched && bookings.length === 0 && (
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
  onRequestSent={() => {
  setOpen(false);
  setSelectedRequest(null);
  setSubmittedSignature(currentSignature);
  setAlreadySubmittedAlert("");
  setSuccessOpen(true);

  window.setTimeout(() => {
    onRequestSentSuccess?.();
  }, 1800);
}}
  onClose={() => {
    setOpen(false);
    setSelectedRequest(null);
  }}
/>

<RequestSentPopup
  open={successOpen}
  onClose={() => setSuccessOpen(false)}
  onMyBooking={() => {
    setSuccessOpen(false);
    openYourBookings();
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
const alreadySubmittedBox = {
  width: "min(92vw, 330px)",
  justifySelf: "center",
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
  color: "#166534",
  borderRadius: 14,
  padding: "9px 11px",
  fontSize: 12,
  fontWeight: 900,
  lineHeight: 1.35,
  textAlign: "center",
} as const;
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
const bookingBtn = {
  minHeight: 32,
  border: "1px solid #93c5fd",
  borderRadius: 12,
  background: "#eff6ff",
  color: "#0b2d6b",
  fontWeight: 900,
  fontSize: 11,
} as const;
const overlay = { position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 12 } as const;
const listCard = { width: "100%", maxWidth: 460, maxHeight: "82vh", overflowY: "auto", background: "#fff", borderRadius: "24px 24px 16px 16px", padding: 16, boxShadow: "0 24px 80px rgba(0,0,0,.28)", fontFamily: "Arial, sans-serif" } as const;
const handle = { width: 52, height: 5, borderRadius: 99, background: "#cbd5e1", margin: "0 auto 14px" } as const;
const listHead = { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 } as const;
const listTitle = { margin: 0, color: "#0f172a", fontSize: 20 } as const;
const listSub = { margin: "6px 0 0", color: "#64748b", fontSize: 13, lineHeight: 1.35 } as const;
const xBtn = { border: "1px solid #e2e8f0", background: "#fff", borderRadius: 12, width: 38, height: 38, fontSize: 24, lineHeight: 1, color: "#0f172a" } as const;
const lookupBox = { display: "grid", gridTemplateColumns: "1fr", gap: 9, margin: "12px 0 10px" } as const;
const phoneInput = { width: "100%", minHeight: 44, border: "1px solid #cbd5e1", borderRadius: 14, padding: "0 12px", fontSize: 15, fontWeight: 800, outline: "none", color: "#0f172a" } as const;
const viewBtn = { width: "100%", minHeight: 42, border: 0, borderRadius: 14, background: "#0b2d6b", color: "#fff", fontWeight: 900, fontSize: 14 } as const;
const message = { margin: "18px 0", color: "#64748b", textAlign: "center", fontSize: 14 } as const;
const errorText = { margin: "12px 0", color: "#b91c1c", textAlign: "center", fontSize: 14, fontWeight: 800 } as const;
const bookingList = { display: "grid", gap: 9, marginTop: 12 } as const;
const bookingItem = { width: "100%", textAlign: "left", border: "1px solid #e2e8f0", borderRadius: 14, background: "#f8fafc", padding: 12, display: "grid", gap: 6 } as const;
const routeText = { color: "#0f172a", fontWeight: 900, fontSize: 14, lineHeight: 1.3 } as const;
const dateText = { color: "#475569", fontWeight: 700, fontSize: 13 } as const;
const statusText = { justifySelf: "start", borderRadius: 999, background: "#eff6ff", color: "#1d4ed8", padding: "4px 9px", fontSize: 11, fontWeight: 900 } as const;
