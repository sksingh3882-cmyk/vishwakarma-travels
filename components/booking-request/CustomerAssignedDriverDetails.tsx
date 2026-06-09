"use client";

import { useEffect, useState } from "react";
import type { BookingRequestRecord } from "@/lib/bookingRequestService";

type Props = {
  request: BookingRequestRecord;
};

type RatingDetails = {
  average: number;
  details: { label: string; value: number }[];
};

type RatingState = {
  driver: RatingDetails | null;
  vehicle: RatingDetails | null;
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

function ratingText(value?: number) {
  return value && value > 0 ? `⭐ ${value.toFixed(2)}` : "-";
}

export default function CustomerAssignedDriverDetails({ request }: Props) {
  const [rating, setRating] = useState<RatingState>({
    driver: null,
    vehicle: null,
  });
  const [selectedPopup, setSelectedPopup] = useState<"driver" | "vehicle" | null>(null);

  useEffect(() => {
    let active = true;

    async function loadRating() {
      if (!supabaseUrl || !supabaseKey || request.status !== "confirmed") return;

      try {
        const driverMobile = cleanPhone(request.driverMobile || "");
        const vehicleNumber = String(request.vehicleNo || "").trim();

        let driverRating: RatingDetails | null = null;
        let vehicleRating: RatingDetails | null = null;

        if (driverMobile) {
          const driverResponse = await fetch(
            `${supabaseUrl}/rest/v1/trip_ratings?select=driver_behaviour_rating,driving_safety_rating,pickup_timing_rating,driver_communication_rating,overall_driver_rating,driver_average_rating&driver_mobile=eq.${encodeURIComponent(driverMobile)}`,
            { headers: supabaseHeaders() }
          );

          if (driverResponse.ok) {
            const rows = await driverResponse.json();
            const list = Array.isArray(rows) ? rows : [];

            if (list.length) {
              driverRating = {
                average: average(list.map((row) => numberValue(row.driver_average_rating))),
                details: [
                  { label: "Driver Behaviour", value: average(list.map((row) => numberValue(row.driver_behaviour_rating))) },
                  { label: "Driving Safety", value: average(list.map((row) => numberValue(row.driving_safety_rating))) },
                  { label: "Pickup Timing", value: average(list.map((row) => numberValue(row.pickup_timing_rating))) },
                  { label: "Driver Communication", value: average(list.map((row) => numberValue(row.driver_communication_rating))) },
                  { label: "Overall Driver Experience", value: average(list.map((row) => numberValue(row.overall_driver_rating))) },
                ],
              };
            }
          }
        }

        if (vehicleNumber) {
          const vehicleResponse = await fetch(
            `${supabaseUrl}/rest/v1/trip_ratings?select=vehicle_cleanliness_rating,vehicle_comfort_rating,ac_cooling_rating,seat_condition_rating,overall_vehicle_rating,vehicle_average_rating&vehicle_number=eq.${encodeURIComponent(vehicleNumber)}`,
            { headers: supabaseHeaders() }
          );

          if (vehicleResponse.ok) {
            const rows = await vehicleResponse.json();
            const list = Array.isArray(rows) ? rows : [];

            if (list.length) {
              vehicleRating = {
                average: average(list.map((row) => numberValue(row.vehicle_average_rating))),
                details: [
                  { label: "Vehicle Cleanliness", value: average(list.map((row) => numberValue(row.vehicle_cleanliness_rating))) },
                  { label: "Vehicle Comfort", value: average(list.map((row) => numberValue(row.vehicle_comfort_rating))) },
                  { label: "AC / Cooling", value: average(list.map((row) => numberValue(row.ac_cooling_rating))) },
                  { label: "Seat Condition", value: average(list.map((row) => numberValue(row.seat_condition_rating))) },
                  { label: "Overall Vehicle Experience", value: average(list.map((row) => numberValue(row.overall_vehicle_rating))) },
                ],
              };
            }
          }
        }

        if (active) {
          setRating({
            driver: driverRating,
            vehicle: vehicleRating,
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
        rating={ratingText(rating.vehicle?.average)}
        showView={Boolean(rating.vehicle)}
        onView={() => setSelectedPopup("vehicle")}
        value={request.vehicleNo || "-"}
      />

      <RatingInfoRow
        label="Vehicle"
        rating={ratingText(rating.vehicle?.average)}
        showView={Boolean(rating.vehicle)}
        onView={() => setSelectedPopup("vehicle")}
        value={vehicleName}
      />

      <RatingInfoRow
        label="Driver Name"
        rating={ratingText(rating.driver?.average)}
        showView={Boolean(rating.driver)}
        onView={() => setSelectedPopup("driver")}
        value={request.driverName || "-"}
      />

      <RatingInfoRow
        label="Driver Mobile"
        rating="-"
        showView={false}
        onView={() => {}}
        value={request.driverMobile || "-"}
      />

      <RatingPopup
        kind={selectedPopup}
        driverRating={rating.driver}
        vehicleRating={rating.vehicle}
        onClose={() => setSelectedPopup(null)}
      />
    </div>
  );
}

function RatingInfoRow({
  label,
  rating,
  showView,
  onView,
  value,
}: {
  label: string;
  rating: string;
  showView: boolean;
  onView: () => void;
  value: string;
}) {
  return (
    <div style={infoRow}>
      <span style={infoLabel}>{label}</span>

      <span style={ratingWrap}>
        <span style={ratingValue}>{rating}</span>
        {showView ? (
          <button type="button" style={viewBtn} onClick={onView}>
            View
          </button>
        ) : null}
      </span>

      <b style={infoValue}>{value || "-"}</b>
    </div>
  );
}

function RatingPopup({
  kind,
  driverRating,
  vehicleRating,
  onClose,
}: {
  kind: "driver" | "vehicle" | null;
  driverRating: RatingDetails | null;
  vehicleRating: RatingDetails | null;
  onClose: () => void;
}) {
  if (!kind) return null;

  const data = kind === "driver" ? driverRating : vehicleRating;
  const title = kind === "driver" ? "Driver Rating Details" : "Vehicle Rating Details";

  return (
    <div style={popupOverlay}>
      <div style={popupCard}>
        <button type="button" aria-label="Close rating details" style={popupCloseBtn} onClick={onClose}>
          ×
        </button>

        <h3 style={popupTitle}>{title}</h3>

        {data ? (
          <>
            {data.details.map((item) => (
              <div key={item.label} style={detailRow}>
                <span style={detailLabel}>{item.label}</span>
                <b style={detailValue}>{ratingText(item.value)}</b>
              </div>
            ))}

            <div style={averageBox}>Average: {ratingText(data.average)}</div>

            <button type="button" style={closeTextBtn} onClick={onClose}>
              Close
            </button>
          </>
        ) : (
          <>
            <p style={emptyText}>No rating available yet.</p>
            <button type="button" style={closeTextBtn} onClick={onClose}>
              Close
            </button>
          </>
        )}
      </div>
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
  gridTemplateColumns: "92px 98px 1fr",
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

const ratingWrap = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  minWidth: 0,
} as const;

const ratingValue = {
  color: "#c2410c",
  fontSize: 12,
  fontWeight: 900,
  textAlign: "center",
  whiteSpace: "nowrap",
} as const;

const viewBtn = {
  border: "1px solid #fed7aa",
  background: "#fff7ed",
  color: "#c2410c",
  borderRadius: 999,
  padding: "2px 7px",
  fontSize: 10,
  fontWeight: 900,
  lineHeight: 1.3,
} as const;

const infoValue = {
  color: "#0f172a",
  fontSize: 12,
  textAlign: "right",
  wordBreak: "break-word",
} as const;

const popupOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,.62)",
  zIndex: 10000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
} as const;

const popupCard = {
  width: "100%",
  maxWidth: 380,
  background: "#ffffff",
  borderRadius: 20,
  padding: "18px 14px 14px",
  position: "relative",
  boxShadow: "0 24px 80px rgba(0,0,0,.30)",
  border: "1px solid #e2e8f0",
} as const;

const popupCloseBtn = {
  position: "absolute",
  top: 10,
  right: 10,
  width: 34,
  height: 34,
  borderRadius: 999,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 22,
  lineHeight: 1,
  fontWeight: 900,
} as const;

const popupTitle = {
  margin: "0 44px 12px 0",
  color: "#0f172a",
  fontSize: 18,
  fontWeight: 900,
} as const;

const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  padding: "9px 0",
  borderTop: "1px dashed #e2e8f0",
  color: "#334155",
  fontSize: 13,
} as const;

const detailLabel = {
  color: "#64748b",
  fontWeight: 700,
} as const;

const detailValue = {
  color: "#0f172a",
  whiteSpace: "nowrap",
} as const;

const averageBox = {
  marginTop: 12,
  padding: 11,
  borderRadius: 14,
  background: "#ecfdf5",
  color: "#166534",
  fontWeight: 950,
  textAlign: "center",
  fontSize: 14,
} as const;

const closeTextBtn = {
  width: "100%",
  marginTop: 12,
  border: 0,
  background: "#111827",
  color: "#ffffff",
  borderRadius: 14,
  padding: "11px 14px",
  fontSize: 14,
  fontWeight: 900,
} as const;

const emptyText = {
  margin: 0,
  padding: 12,
  borderRadius: 14,
  background: "#f8fafc",
  color: "#64748b",
  fontSize: 13,
  fontWeight: 700,
} as const;
