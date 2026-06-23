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
  onValidateBeforeOpen?: () => boolean;
  isBookNowReady?: boolean;
};
function cleanPhone(value: string) {
  let phone = String(value || "").replace(/\D/g, "");
  if ((phone.startsWith("91") || phone.startsWith("0")) && phone.length > 10) phone = phone.slice(-10);
  return phone.slice(-10);
}



export default function CustomerBookNowSection({ bookingData, onDownloadCopy, onWhatsAppRequest, onRequestSentSuccess, onValidateBeforeOpen, isBookNowReady=true }: Props) {
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
const [confirmOpen, setConfirmOpen] = useState(false);
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
    if (onValidateBeforeOpen && !onValidateBeforeOpen()) return;

    if (submittedSignature && currentSignature === submittedSignature) {
      setAlreadySubmittedAlert("Your booking request is already submitted. Please check My Booking section.");
      return;
    }

    setAlreadySubmittedAlert("");
    setSelectedRequest(null);
    setConfirmOpen(true);
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

  <button type="button" style={{...bookNowBtn,...(!isBookNowReady?bookNowBtnDisabled:{})}} onClick={openNewRequest}>
    {isBookNowReady ? "Book Now" : "Complete Required Details"}
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
            {confirmOpen && (
  <div style={overlay}>
    <div style={confirmCard}>
      <div style={handle} />

      <div style={confirmHead}>
        <div>
          <h2 style={confirmTitle}>Review Booking Details</h2>
          <p style={confirmSub}>
            Please check your booking details before submitting your request.
          </p>
        </div>

        <button
          type="button"
          style={xBtn}
          onClick={() => setConfirmOpen(false)}
        >
          ×
        </button>
      </div>

      <div style={confirmDetails}>
        <div style={confirmRow}>
          <span style={confirmLabel}>Customer Name</span>
          <b style={confirmValue}>{bookingData.customerName || "-"}</b>
        </div>
        <div style={confirmRow}>
          <span style={confirmLabel}>Mobile Number</span>
          <b style={confirmValue}>{cleanPhone(bookingData.customerPhone || "") || "-"}</b>
        </div>

        <div style={confirmRow}>
          <span style={confirmLabel}>Service</span>
          <b style={confirmValue}>{bookingData.service || "-"}</b>
        </div>

        <div style={confirmRow}>
          <span style={confirmLabel}>Requested Vehicle</span>
          <b style={confirmValue}>{bookingData.requestedVehicle || "-"}</b>
        </div>

        <div style={confirmRow}>
          <span style={confirmLabel}>Pickup Location</span>
          <b style={confirmValue}>{bookingData.pickup || "-"}</b>
        </div>
        <div style={confirmRow}>
          <span style={confirmLabel}>Drop Location</span>
          <b style={confirmValue}>{bookingData.drop || "-"}</b>
        </div>

        <div style={confirmTwoCol}>
          <div style={confirmMiniBox}>
            <span style={confirmLabel}>Journey Date</span>
            <b style={confirmValue}>{formatDisplayDate(bookingData.journeyDate || "")}</b>
          </div>

          <div style={confirmMiniBox}>
            <span style={confirmLabel}>Journey Time</span>
            <b style={confirmValue}>{formatTimeForDisplay(bookingData.journeyTime || "")}</b>
          </div>
        </div>
      </div>

      <div style={confirmActions}>
        <button
          type="button"
          style={cancelBtn}
          onClick={() => setConfirmOpen(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          style={confirmSubmitBtn}
          onClick={() => {
            setConfirmOpen(false);
            setOpen(true);
          }}
        >
          Confirm and Submit
        </button>
      </div>
    </div>
  </div>
)}
      <CustomerBookingStatusPopup
  open={open}
  bookingData={bookingData}
  existingRequest={selectedRequest}
    onRequestSent={(createdRequest) => {
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
function formatTimeForDisplay(value: string) {
  const raw = String(value || "").trim();

  if (!raw) return "-";
    if (/\b(am|pm)\b/i.test(raw)) {
    return raw.toUpperCase();
  }

  const match = raw.match(/^(\d{1,2}):(\d{2})$/);

  if (!match) {
    return raw;
  }

  const hour = Number(match[1]);
  const minute = match[2];

  if (Number.isNaN(hour)) {
    return raw;
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${minute} ${suffix}`;
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
const bookNowBtnDisabled = {
  opacity: .65,
  filter: "grayscale(.15)",
} as const;
const smallRow = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, width: "min(92vw, 330px)", justifySelf: "center" } as const;
const smallBtn = { minHeight: 32, border: "1px solid rgba(255,255,255,.20)", borderRadius: 6, background: "rgba(255,255,255,.08)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", color: "#ffffff", fontWeight: 900, fontSize: 11 } as const;
const whatsBtn = { minHeight: 32, border: "1px solid rgba(34,197,94,.35)", borderRadius: 6, background: "rgba(34,197,94,.14)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", color: "#ffffff", fontWeight: 900, fontSize: 11 } as const;
const bookingBtn = {
  minHeight: 32,
  border: "1px solid rgba(255,255,255,.20)",
  borderRadius: 6,
  background: "rgba(255,255,255,.08)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  color: "#ffffff",
  fontWeight: 900,
  fontSize: 11,
} as const;
const overlay = { position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 12 } as const;
const listCard = { width: "100%", maxWidth: 460, maxHeight: "82vh", overflowY: "auto", background: "rgba(15,23,42,.82)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,.18)", borderRadius: "24px 24px 16px 16px", padding: 16, boxShadow: "0 24px 80px rgba(0,0,0,.45)", fontFamily: "Arial, sans-serif" } as const;
const handle = { width: 52, height: 5, borderRadius: 99, background: "linear-gradient(90deg,#8a5a16,#f6d56f,#8a5a16)", margin: "0 auto 14px", boxShadow: "0 0 14px rgba(246,213,111,.45)" } as const;
const listHead = { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 } as const;
const listTitle = { margin: 0, color: "#ffffff", fontSize: 20 } as const;
const listSub = { margin: "6px 0 0", color: "rgba(255,255,255,.72)", fontSize: 13, lineHeight: 1.35 } as const;
const xBtn = { border: "1px solid rgba(212,175,55,.45)", background: "rgba(5,12,20,.72)", borderRadius: 10, width: 38, height: 38, fontSize: 24, lineHeight: 1, color: "#f6d56f", boxShadow: "0 0 18px rgba(212,175,55,.18)" } as const;
const lookupBox = { display: "grid", gridTemplateColumns: "1fr", gap: 9, margin: "12px 0 10px" } as const;
const phoneInput = { width: "100%", minHeight: 44, border: "1px solid rgba(255,255,255,.18)", borderRadius: 14, padding: "0 12px", fontSize: 15, fontWeight: 800, outline: "none", color: "#ffffff", background: "rgba(255,255,255,.08)" } as const;
const viewBtn = { width: "100%", minHeight: 46, border: "1px solid rgba(246,213,111,.45)", borderRadius: 10, background: "linear-gradient(135deg,#8a5a16,#f6d56f,#b7791f)", color: "#111827", fontWeight: 950, fontSize: 14, boxShadow: "0 14px 30px rgba(212,175,55,.24)" } as const;
const message = { margin: "18px 0", color: "#64748b", textAlign: "center", fontSize: 14 } as const;
const errorText = { margin: "12px 0", color: "#b91c1c", textAlign: "center", fontSize: 14, fontWeight: 800 } as const;
const bookingList = { display: "grid", gap: 9, marginTop: 12 } as const;
const bookingItem = { width: "100%", textAlign: "left", border: "1px solid rgba(212,175,55,.32)", borderRadius: 12, background: "rgba(255,255,255,.055)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", padding: 12, display: "grid", gap: 6, boxShadow: "inset 0 1px 0 rgba(255,255,255,.06)" } as const;
const routeText = { color: "#ffffff", fontWeight: 950, fontSize: 14, lineHeight: 1.3 } as const;
const dateText = { color: "rgba(255,255,255,.76)", fontWeight: 800, fontSize: 13 } as const;
const statusText = { justifySelf: "start", borderRadius: 999, background: "rgba(212,175,55,.16)", color: "#f6d56f", border: "1px solid rgba(212,175,55,.38)", padding: "4px 9px", fontSize: 11, fontWeight: 950 } as const;
const confirmCard = {
  width: "100%",
  maxWidth: 460,
  maxHeight: "86vh",
  overflowY: "auto",
  background: "linear-gradient(145deg, rgba(4,8,13,.94), rgba(15,23,42,.88))",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(212,175,55,.55)",
  borderRadius: "24px 24px 16px 16px",
  padding: 16,
  boxShadow: "0 28px 90px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.08)",
  fontFamily: "Arial, sans-serif",
} as const;
const confirmHead = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
  marginBottom: 12,
} as const;

const confirmTitle = {
  margin: 0,
  color: "#f6d56f",
  fontSize: 22,
  fontWeight: 950,
} as const;

const confirmSub = {
  margin: "6px 0 0",
  color: "rgba(255,255,255,.76)",
  fontSize: 13,
  lineHeight: 1.35,
  fontWeight: 700,
} as const;

const confirmDetails = {
  display: "grid",
  gap: 9,
  marginTop: 12,
} as const;
const confirmRow = {
  display: "grid",
  gap: 4,
  border: "1px solid rgba(212,175,55,.35)",
  background: "rgba(255,255,255,.055)",
  borderRadius: 10,
  padding: "10px 12px",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,.06)",
} as const;

const confirmLabel = {
  color: "#d4af37",
  fontSize: 11,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: ".45px",
} as const;

const confirmValue = {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 900,
  lineHeight: 1.35,
  wordBreak: "break-word",
} as const;

const confirmTwoCol = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 9,
} as const;
const confirmMiniBox = {
  display: "grid",
  gap: 4,
  border: "1px solid rgba(212,175,55,.35)",
  background: "rgba(255,255,255,.055)",
  borderRadius: 10,
  padding: "10px 12px",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,.06)",
} as const;

const confirmActions = {
  display: "grid",
  gridTemplateColumns: "1fr 1.4fr",
  gap: 9,
  marginTop: 14,
} as const;

const cancelBtn = {
  minHeight: 44,
  border: "1px solid rgba(212,175,55,.55)",
  borderRadius: 10,
  background: "rgba(255,255,255,.04)",
  color: "#f6d56f",
  fontWeight: 900,
  fontSize: 13,
} as const;

const confirmSubmitBtn = {
  minHeight: 44,
  border: 0,
  borderRadius: 10,
  background: "linear-gradient(135deg,#8a5a16,#f6d56f,#b7791f)",
  color: "#111827",
  fontWeight: 950,
  fontSize: 13,
  boxShadow: "0 14px 30px rgba(212,175,55,.28)",
} as const;

  
