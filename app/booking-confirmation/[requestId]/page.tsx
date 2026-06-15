"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CustomerBookingStatusPopup from "@/components/booking-request/CustomerBookingStatusPopup";
import {
  fetchBookingRequestById,
  type BookingRequestInput,
  type BookingRequestRecord,
} from "@/lib/bookingRequestService";

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const requestId = String(params?.requestId || "");
  const [request, setRequest] = useState<BookingRequestRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let stopped = false;

    async function loadBooking() {
      if (!requestId || !supabaseUrl || !supabaseKey) {
        setError("Booking confirmation link is invalid.");
        setLoading(false);
        return;
      }

      try {
        const latest = await fetchBookingRequestById({
          supabaseUrl,
          supabaseKey,
          requestId,
        });

        if (stopped) return;

        if (!latest) {
          setError("Booking details not found.");
          setLoading(false);
          return;
        }

        setRequest(latest);
        setLoading(false);
      } catch (err) {
        console.log("Booking confirmation link failed:", err);
        if (!stopped) {
          setError("Unable to load booking confirmation.");
          setLoading(false);
        }
      }
    }

    loadBooking();

    return () => {
      stopped = true;
    };
  }, [requestId, supabaseUrl, supabaseKey]);

  const bookingData: BookingRequestInput = useMemo(
    () => ({
      customerName: request?.customerName || "",
      customerPhone: request?.customerPhone || "",
      service: request?.service || "",
      requestedVehicle: request?.requestedVehicle || "",
      pickup: request?.pickup || "",
      drop: request?.drop || "",
      journeyDate: request?.journeyDate || "",
      journeyTime: request?.journeyTime || "",
    }),
    [request]
  );

  return (
    <main style={page}>
      {loading ? (
        <div style={box}>
          <h2 style={title}>Loading Booking Confirmation...</h2>
          <p style={text}>Please wait.</p>
        </div>
      ) : error ? (
        <div style={box}>
          <h2 style={title}>Booking Link Error</h2>
          <p style={text}>{error}</p>
          <button type="button" style={btn} onClick={() => router.replace("/")}>
            Go Home
          </button>
        </div>
      ) : null}

      {request ? (
        <CustomerBookingStatusPopup
          open={true}
          bookingData={bookingData}
          existingRequest={request}
          onClose={() => router.replace("/")}
        />
      ) : null}
    </main>
  );
}

const page = {
  minHeight: "100vh",
  background: "linear-gradient(180deg,#eff6ff,#ffffff)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
} as const;

const box = {
  width: "100%",
  maxWidth: 380,
  background: "#ffffff",
  borderRadius: 18,
  padding: 18,
  textAlign: "center",
  boxShadow: "0 14px 40px rgba(15,23,42,.14)",
  fontFamily: "Arial, sans-serif",
} as const;

const title = {
  margin: "0 0 8px",
  color: "#0b2d6b",
  fontSize: 20,
  fontWeight: 950,
} as const;

const text = {
  margin: "0 0 14px",
  color: "#64748b",
  fontSize: 14,
} as const;

const btn = {
  border: 0,
  borderRadius: 12,
  background: "#0b2d6b",
  color: "#ffffff",
  padding: "11px 16px",
  fontWeight: 900,
} as const;
