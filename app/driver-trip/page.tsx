"use client";

import { useEffect, useState } from "react";
import {
  fetchBookingRequestById,
  type BookingRequestRecord,
} from "@/lib/bookingRequestService";

export default function DriverTripPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const [booking, setBooking] = useState<BookingRequestRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTrip() {
      const id = new URLSearchParams(window.location.search).get("id");

      if (!id) {
        setError("Trip link is invalid. Please ask admin for a new link.");
        setLoading(false);
        return;
      }

      if (!supabaseUrl || !supabaseKey) {
        setError("Trip details could not be loaded.");
        setLoading(false);
        return;
      }

      try {
        const record = await fetchBookingRequestById({
          supabaseUrl,
          supabaseKey,
          requestId: id,
        });

        if (!record) {
          setError("Trip details not found. Please ask admin for a new link.");
          return;
        }

        setBooking(record);
      } catch (err) {
        console.log(err);
        setError("Unable to load trip details. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [supabaseUrl, supabaseKey]);

  const customerPhone = cleanPhone(booking?.customerPhone || "");
  const callCustomerHref = customerPhone ? `tel:+91${customerPhone}` : "";

  return (
    <main style={page}>
      <div style={overlay}>
        <section style={card}>
          <div style={brand}>Vishwakarma Travels</div>

          {loading && (
            <div style={center}>
              <div style={icon}>⏳</div>
              <h1 style={title}>Loading Trip Details</h1>
              <p style={sub}>Please wait...</p>
            </div>
          )}

          {!loading && error && (
            <div style={center}>
              <div style={icon}>⚠️</div>
              <h1 style={title}>Trip Not Available</h1>
              <p style={sub}>{error}</p>
            </div>
          )}

          {!loading && !error && booking && (
            <>
              <div style={successBadge}>NEW TRIP ASSIGNED</div>

              <h1 style={title}>Driver Trip Details</h1>
              <p style={sub}>
                Please check customer and route details before starting the trip.
              </p>

              <div style={idBox}>
                <span>Booking ID</span>
                <b>{shortBookingId(booking.id)}</b>
              </div>

              <div style={section}>
                <h2 style={sectionTitle}>Customer Details</h2>
                <Info label="Customer Name" value={booking.customerName || "-"} />
                <Info label="Mobile Number" value={formatIndianPhone(customerPhone)} />
              </div>

              <div style={section}>
                <h2 style={sectionTitle}>Trip Details</h2>
                <Info label="Pickup" value={booking.pickup || "-"} />
                <Info label="Drop" value={booking.drop || "-"} />
                <Info label="Date" value={formatDate(booking.journeyDate || "")} />
                <Info label="Time" value={formatTime(booking.journeyTime || "")} />
                <Info label="Service" value={booking.service || "-"} />
                <Info
                  label="Vehicle"
                  value={
                    [booking.vehicleType, booking.vehicleModel]
                      .filter(Boolean)
                      .join(" ")
                      .trim() ||
                    booking.requestedVehicle ||
                    "-"
                  }
                />
              </div>

              <div style={noteBox}>
                <b>Important Note</b>
                <span>
                  Please call the customer before starting the trip and confirm
                  pickup location.
                </span>
              </div>

              {callCustomerHref ? (
                <a href={callCustomerHref} style={callBtn}>
                  📞 Call Customer
                </a>
              ) : (
                <button type="button" style={disabledBtn} disabled>
                  Customer number unavailable
                </button>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoRow}>
      <span>{label}</span>
      <b>{value || "-"}</b>
    </div>
  );
}

function cleanPhone(value: string) {
  let phone = String(value || "").replace(/\D/g, "");
  if ((phone.startsWith("91") || phone.startsWith("0")) && phone.length > 10) {
    phone = phone.slice(-10);
  }
  return phone.slice(-10);
}

function formatIndianPhone(value: string) {
  const phone = cleanPhone(value);
  return phone ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : "-";
}

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value: string) {
  const raw = String(value || "").trim();
  if (!raw) return "-";

  if (/\b(am|pm)\b/i.test(raw)) return raw.toUpperCase();

  const match = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return raw;

  const hour = Number(match[1]);
  const minute = match[2];
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${minute} ${suffix}`;
}

function shortBookingId(id?: string) {
  if (!id) return "-";

  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 10000;
  }

  return `VT-${String(hash).padStart(4, "0")}`;
}

const page = {
  minHeight: "100vh",
  backgroundImage:
    "linear-gradient(rgba(2,6,23,.72),rgba(2,6,23,.78)),url('/cars/customer-bg.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  fontFamily: "Arial, sans-serif",
} as const;

const overlay = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 14,
} as const;

const card = {
  width: "100%",
  maxWidth: 430,
  borderRadius: 24,
  padding: 16,
  background: "rgba(255,255,255,.12)",
  border: "1px solid rgba(255,255,255,.18)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 22px 60px rgba(0,0,0,.35)",
  color: "#ffffff",
} as const;

const brand = {
  textAlign: "center",
  color: "#f97316",
  fontSize: 18,
  fontWeight: 950,
  marginBottom: 10,
  textShadow: "0 2px 10px rgba(0,0,0,.45)",
} as const;

const successBadge = {
  width: "fit-content",
  margin: "0 auto 10px",
  borderRadius: 999,
  padding: "7px 12px",
  background: "rgba(22,163,74,.18)",
  border: "1px solid rgba(34,197,94,.35)",
  color: "#bbf7d0",
  fontSize: 11,
  fontWeight: 950,
  letterSpacing: ".5px",
} as const;

const center = {
  textAlign: "center",
  padding: "28px 8px",
} as const;

const icon = {
  width: 58,
  height: 58,
  display: "grid",
  placeItems: "center",
  margin: "0 auto 10px",
  borderRadius: 18,
  background: "rgba(255,255,255,.14)",
  fontSize: 30,
} as const;

const title = {
  margin: 0,
  textAlign: "center",
  fontSize: 25,
  lineHeight: 1.1,
  fontWeight: 950,
  color: "#ffffff",
  textShadow: "0 2px 12px rgba(0,0,0,.5)",
} as const;

const sub = {
  margin: "8px auto 14px",
  textAlign: "center",
  color: "rgba(255,255,255,.88)",
  fontSize: 13,
  lineHeight: 1.4,
  fontWeight: 800,
  maxWidth: 340,
} as const;

const idBox = {
  display: "grid",
  gap: 4,
  textAlign: "center",
  padding: "11px 12px",
  borderRadius: 16,
  background: "rgba(255,255,255,.14)",
  border: "1px solid rgba(255,255,255,.18)",
  marginBottom: 10,
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 900,
} as const;

const section = {
  border: "1px solid rgba(255,255,255,.18)",
  background: "rgba(255,255,255,.10)",
  borderRadius: 18,
  padding: 12,
  marginTop: 10,
} as const;

const sectionTitle = {
  margin: "0 0 8px",
  color: "#fdba74",
  fontSize: 14,
  fontWeight: 950,
} as const;

const infoRow = {
  display: "grid",
  gridTemplateColumns: "118px 1fr",
  gap: 8,
  padding: "8px 0",
  borderTop: "1px dashed rgba(255,255,255,.18)",
  fontSize: 13,
  alignItems: "start",
} as const;

const noteBox = {
  display: "grid",
  gap: 5,
  marginTop: 10,
  padding: 12,
  borderRadius: 16,
  background: "rgba(249,115,22,.16)",
  border: "1px solid rgba(251,146,60,.35)",
  color: "#ffffff",
  fontSize: 13,
  lineHeight: 1.35,
} as const;

const callBtn = {
  marginTop: 12,
  minHeight: 48,
  borderRadius: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg,#16a34a,#15803d)",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: 16,
  fontWeight: 950,
  boxShadow: "0 14px 28px rgba(22,163,74,.28)",
} as const;

const disabledBtn = {
  width: "100%",
  marginTop: 12,
  minHeight: 48,
  border: 0,
  borderRadius: 16,
  background: "rgba(255,255,255,.16)",
  color: "rgba(255,255,255,.75)",
  fontSize: 14,
  fontWeight: 900,
} as const;
