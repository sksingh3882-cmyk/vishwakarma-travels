"use client";

import { useEffect, useState } from "react";
import type { BookingRequestRecord } from "@/lib/bookingRequestService";

type Props = {
  request: BookingRequestRecord;
};

type RatingSummary = {
  driverAverage: number;
  vehicleAverage: number;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function supabaseHeaders() {
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
  };
}

function cleanPhone(value: string) {
  let phone = String(value || "").replace(/\D/g, "");
  if ((phone.startsWith("91") || phone.startsWith("0")) && phone.length > 10) {
    phone = phone.slice(-10);
  }
  return phone.slice(-10);
}

function numberValue(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function average(values: number[]) {
  const valid = values.filter((value) => value > 0);
  if (!valid.length) return 0;
  return Number((valid.reduce((sum, value) => sum + value, 0) / valid.length).toFixed(2));
}

function ratingText(value: number) {
  return value > 0 ? `⭐ ${value.toFixed(2)}` : "-";
}

export default function CustomerAssignedDriverDetails({ request }: Props) {
  const [rating, setRating] = useState<RatingSummary>({
    driverAverage: 0,
    vehicleAverage: 0,
  });

  useEffect(() => {
    let active = true;

    async function loadRating() {
      if (!supabaseUrl || !supabaseKey || request.status !== "confirmed") return;

      try {
        const driverMobile = cleanPhone(request.driverMobile || "");
        const vehicleNumber = String(request.vehicleNo || "").trim();

        let driverAverage = 0;
        let vehicleAverage = 0;

        if (driverMobile) {
          const driverResponse = await fetch(
            `${supabaseUrl}/rest/v1/trip_ratings?select=driver_average_rating&driver_mobile=eq.${encodeURIComponent(driverMobile)}`,
            { headers: supabaseHeaders() }
          );

          if (driverResponse.ok) {
            const rows = await driverResponse.json();
            const list = Array.isArray(rows) ? rows : [];
            driverAverage = average(list.map((row) => numberValue(row.driver_average_rating)));
          }
        }

        if (vehicleNumber) {
          const vehicleResponse = await fetch(
            `${supabaseUrl}/rest/v1/trip_ratings?select=vehicle_average_rating&vehicle_number=eq.${encodeURIComponent(vehicleNumber)}`,
            { headers: supabaseHeaders() }
          );

          if (vehicleResponse.ok) {
            const rows = await vehicleResponse.json();
            const list = Array.isArray(rows) ? rows : [];
            vehicleAverage = average(list.map((row) => numberValue(row.vehicle_average_rating)));
          }
        }

        if (active) {
          setRating({
            driverAverage,
            vehicleAverage,
          });
        }
      } catch (error) {
        console.log("Customer assigned rating failed:", error);
      }
    }

    loadRating();

    return () => {
      active = false;
    };
  }, [request.status, request.driverMobile, request.vehicleNo]);

  const vehicleName = [request.vehicleType, request.vehicleModel].filter(Boolean).join(" ") || "-";

  return (
    <div style={sectionGreen}>
      <h3 style={sectionTitle}>Driver Details</h3>

      <RatingInfoRow
        label="Vehicle No"
        rating={ratingText(rating.vehicleAverage)}
        value={request.vehicleNo || "-"}
      />

      <RatingInfoRow
        label="Vehicle"
        rating={ratingText(rating.vehicleAverage)}
        value={vehicleName}
      />

      <RatingInfoRow
        label="Driver Name"
        rating={ratingText(rating.driverAverage)}
        value={request.driverName || "-"}
      />

      <RatingInfoRow
        label="Driver Mobile"
        rating="-"
        value={request.driverMobile || "-"}
      />
    </div>
  );
}

function RatingInfoRow({ label, rating, value }: { label: string; rating: string; value: string }) {
  return (
    <div style={infoRow}>
      <span style={infoLabel}>{label}</span>
      <span style={ratingValue}>{rating}</span>
      <b style={infoValue}>{value || "-"}</b>
    </div>
  );
}

const sectionGreen = {
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
  borderRadius: 16,
  padding: 10,
  marginTop: 10,
} as const;

const sectionTitle = {
  margin: "0 0 8px",
  fontSize: 14,
  color: "#0f172a",
} as const;

const infoRow = {
  display: "grid",
  gridTemplateColumns: "92px 74px 1fr",
  alignItems: "center",
  gap: 8,
  padding: "7px 0",
  borderTop: "1px dashed #dbe3ee",
} as const;

const infoLabel = {
  color: "#64748b",
  fontSize: 12,
  minWidth: 0,
} as const;

const ratingValue = {
  color: "#c2410c",
  fontSize: 12,
  fontWeight: 900,
  textAlign: "center",
  whiteSpace: "nowrap",
} as const;

const infoValue = {
  color: "#0f172a",
  fontSize: 12,
  textAlign: "right",
  wordBreak: "break-word",
} as const;
