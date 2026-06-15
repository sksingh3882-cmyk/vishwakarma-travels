"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import {
  createBookingRequest,
  fetchBookingRequestById,
  type BookingRequestInput,
  type BookingRequestRecord,
} from "@/lib/bookingRequestService";

type Props = {
  open: boolean;
  bookingData: BookingRequestInput;
  onClose: () => void;
  existingRequest?: BookingRequestRecord | null;
  onRequestSent?: (createdRequest?: BookingRequestRecord) => void;
};

type RatingDetails = {
  average: number;
  details: { label: string; value: number }[];
};

type RatingState = {
  driver: RatingDetails | null;
  vehicle: RatingDetails | null;
};

export default function CustomerBookingStatusPopup({
  open,
  bookingData,
  onClose,
  existingRequest = null,
  onRequestSent,
}: Props) {
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

  async function subscribeCustomerForBooking(createdRequest: BookingRequestRecord) {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!publicKey) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const padding = "=".repeat((4 - (publicKey.length % 4)) % 4);
    const base64 = (publicKey + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const applicationServerKey = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i += 1) {
      applicationServerKey[i] = rawData.charCodeAt(i);
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const existing = await registration.pushManager.getSubscription();
    const subscription =
      existing ||
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      }));

    await fetch("/api/push/customer/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingRequestId: createdRequest.id,
        customerPhone: createdRequest.customerPhone,
        subscription: subscription.toJSON(),
        userAgent: navigator.userAgent,
      }),
    });
  }

  async function sendRequest() {
    if (!supabaseUrl || !supabaseKey) {
      setError("Supabase URL or key is missing.");
      return;
    }

    if (!bookingData.customerName || !bookingData.customerPhone || !bookingData.pickup || !bookingData.drop) {
      setError("Name, mobile number, pickup and drop are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const created = await createBookingRequest({
        supabaseUrl,
        supabaseKey,
        input: bookingData,
      });

      setRequest(created);
      onRequestSent?.(created);

      subscribeCustomerForBooking(created).catch((err) =>
        console.log("Customer push subscription failed:", err)
      );

      fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "You Have New Booking Request",
          body: `${bookingData.customerName || "Customer"} - ${bookingData.pickup || "Pickup"} to ${bookingData.drop || "Drop"}`,
          url: "/admin",
          tag: `vt-new-booking-${created.id || Date.now()}`,
        }),
      }).catch((err) => console.log("Admin push notification failed:", err));
    } catch (err: any) {
      setError(err?.message || "Unable to send booking request.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;

    setError("");

    if (existingRequest?.id) {
      setRequest(existingRequest);
      setLoading(false);
      return;
    }

    if (!request && !loading) sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, existingRequest?.id]);

  useEffect(() => {
    if (!open || !request?.id || !supabaseUrl || !supabaseKey) return;

    const intervalId = window.setInterval(async () => {
      try {
        const latest = await fetchBookingRequestById({
          supabaseUrl,
          supabaseKey,
          requestId: request.id,
        });

        if (latest) setRequest(latest);
      } catch (err) {
        console.log(err);
      }
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [open, request?.id, supabaseUrl, supabaseKey]);

  function closePopup() {
    setRequest(null);
    setError("");
    setLoading(false);
    onClose();
  }
  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={card}>
        <button type="button" aria-label="Close" style={closeBtn} onClick={closePopup}>
          ×
        </button>

        <div style={handle} />

        {loading && (
          <StatusHeader
            icon="⏳"
            title="Sending Booking Request..."
            subtitle="Please wait"
          />
        )}

        {error && (
          <>
            <StatusHeader icon="⚠️" title="Request Failed" subtitle={error} />
            <button type="button" style={primaryBtn} onClick={sendRequest}>
              Try Again
            </button>
          </>
        )}

        {!loading && !error && request && (
          <>
            {isPending && (
              <>
                <StatusHeader
                  icon="🕘"
                  title="Waiting for Admin Confirmation"
                  subtitle="Your booking request has been sent to the admin."
                />

                <TripDetails request={request} />

                <div style={btnRow}>
                  <button type="button" style={ghostBtn} onClick={sendRequest}>
                    Resend
                  </button>

                  <button type="button" style={dangerBtn} onClick={closePopup}>
                    Cancel
                  </button>
                </div>
              </>
            )}

            {isAccepted && (
              <>
                <StatusHeader
                  icon="✅"
                  title="Admin has accepted your booking request"
                  subtitle="Vehicle and driver details are being assigned. Please wait."
                />

                <TripDetails request={request} />

                <button type="button" style={ghostBtn} onClick={closePopup}>
                  Close
                </button>
              </>
            )}

            {isConfirmed && (
              <PremiumConfirmedBooking request={request} callDriverHref={callDriverHref} />
            )}

            {request.status === "cancelled" && (
              <>
                <StatusHeader
                  icon="❌"
                  title="Request Cancelled"
                  subtitle="Your booking request has been cancelled."
                />

                <button type="button" style={ghostBtn} onClick={closePopup}>
                  Close
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatusHeader({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={headerBox}>
      <div style={iconBox}>{icon}</div>
      <h2 style={titleStyle}>{title}</h2>
      <p style={subStyle}>{subtitle}</p>
    </div>
  );
}

function TripDetails({
  request,
  compact = false,
}: {
  request: BookingRequestRecord;
  compact?: boolean;
}) {
  return (
    <div style={compact ? compactSection : section}>
      <h3 style={sectionTitle}>Trip Details</h3>
      <Info label="Booking ID" value={shortBookingId(request.id)} />
      <Info label="Name" value={request.customerName} />
      <Info label="Mobile" value={request.customerPhone} />
      <Info label="Service" value={request.service || "-"} />
      <Info label="Vehicle Required" value={request.requestedVehicle || "-"} />
      <Info label="Pickup" value={request.pickup} />
      <Info label="Drop" value={request.drop} />
      <Info label="Date" value={request.journeyDate} />
      <Info label="Time" value={formatTimeForDisplay(request.journeyTime)} />
    </div>
  );
}

function PremiumConfirmedBooking({
  request,
  callDriverHref,
}: {
  request: BookingRequestRecord;
  callDriverHref: string;
}) {
  const [rating, setRating] = useState<RatingState>({
    driver: null,
    vehicle: null,
  });

  const [selectedPopup, setSelectedPopup] = useState<"driver" | "vehicle" | null>(null);

  const vehicleName = getVehicleName(request);
  const vehicleImageSrc = getVehicleImageSrc(request);
  const driverImageSrc = getDriverImageSrc(request);
  const fare = getFareValue(request);

  useEffect(() => {
    let active = true;

    async function loadRating() {
      const ratingSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const ratingSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

      if (!ratingSupabaseUrl || !ratingSupabaseKey || request.status !== "confirmed") return;

      const headers = {
        apikey: ratingSupabaseKey,
        Authorization: `Bearer ${ratingSupabaseKey}`,
        "Content-Type": "application/json",
      };

      try {
        const driverMobile = cleanPhone(request.driverMobile || "");
        const vehicleNumber = String(request.vehicleNo || "").trim();

        let driverRating: RatingDetails | null = null;
        let vehicleRating: RatingDetails | null = null;

        if (driverMobile) {
          const driverResponse = await fetch(
            `${ratingSupabaseUrl}/rest/v1/trip_ratings?select=driver_behaviour_rating,driving_safety_rating,pickup_timing_rating,driver_communication_rating,overall_driver_rating,driver_average_rating&driver_mobile=eq.${encodeURIComponent(driverMobile)}`,
            { headers }
          );

          if (driverResponse.ok) {
            const rows = await driverResponse.json();
            const list = Array.isArray(rows) ? rows : [];

            if (list.length) {
              const details = [
                {
                  label: "Driver Behaviour",
                  value: average(list.map((row) => numberValue(row.driver_behaviour_rating))),
                },
                {
                  label: "Driving Safety",
                  value: average(list.map((row) => numberValue(row.driving_safety_rating))),
                },
                {
                  label: "Pickup Timing",
                  value: average(list.map((row) => numberValue(row.pickup_timing_rating))),
                },
                {
                  label: "Driver Communication",
                  value: average(list.map((row) => numberValue(row.driver_communication_rating))),
                },
                {
                  label: "Overall Driver Experience",
                  value: average(list.map((row) => numberValue(row.overall_driver_rating))),
                },
              ];

              const storedAverage = average(list.map((row) => numberValue(row.driver_average_rating)));

              driverRating = {
                average: storedAverage || average(details.map((item) => item.value)),
                details,
              };
            }
          }
        }

        if (vehicleNumber) {
          const vehicleResponse = await fetch(
            `${ratingSupabaseUrl}/rest/v1/trip_ratings?select=vehicle_cleanliness_rating,vehicle_comfort_rating,ac_cooling_rating,seat_condition_rating,overall_vehicle_rating,vehicle_average_rating&vehicle_number=eq.${encodeURIComponent(vehicleNumber)}`,
            { headers }
          );

          if (vehicleResponse.ok) {
            const rows = await vehicleResponse.json();
            const list = Array.isArray(rows) ? rows : [];

            if (list.length) {
              const details = [
                {
                  label: "Vehicle Cleanliness",
                  value: average(list.map((row) => numberValue(row.vehicle_cleanliness_rating))),
                },
                {
                  label: "Vehicle Comfort",
                  value: average(list.map((row) => numberValue(row.vehicle_comfort_rating))),
                },
                {
                  label: "AC / Cooling",
                  value: average(list.map((row) => numberValue(row.ac_cooling_rating))),
                },
                {
                  label: "Seat Condition",
                  value: average(list.map((row) => numberValue(row.seat_condition_rating))),
                },
                {
                  label: "Overall Vehicle Experience",
                  value: average(list.map((row) => numberValue(row.overall_vehicle_rating))),
                },
              ];

              const storedAverage = average(list.map((row) => numberValue(row.vehicle_average_rating)));

              vehicleRating = {
                average: storedAverage || average(details.map((item) => item.value)),
                details,
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
      } catch (err) {
        console.log("Customer confirmed popup rating failed:", err);
      }
    }

    loadRating();

    return () => {
      active = false;
    };
  }, [request.status, request.driverMobile, request.vehicleNo]);

  return (
    <>
      <div style={premiumBox}>
        <div style={brandStyle}>Vishwakarma Travels</div>
        <div style={greetingStyle}>Hii</div>

        <h1 style={premiumCustomerName}>{request.customerName || "Customer"}</h1>

        <div style={premiumConfirmedTitle}>Your Booking Is Confirmed</div>

        <div style={premiumRoute}>
          <span style={routeIcon}>📍</span>
          <span style={routeLabel}>Route:</span>
          <b style={routeValue}>
            {request.pickup || "-"} to {request.drop || "-"}
          </b>
        </div>

        <div style={premiumGrid}>
          <div style={miniInfoCard}>
            <span style={miniIcon}>🗓️</span>
            <div>
              <span style={miniLabel}>Date:</span>
              <b style={miniValue}>{formatDateForDisplay(request.journeyDate)}</b>
            </div>
          </div>

          <div style={miniInfoCard}>
            <span style={miniIcon}>🕘</span>
            <div>
              <span style={miniLabel}>Time:</span>
              <b style={miniValue}>{formatTimeForDisplay(request.journeyTime)}</b>
            </div>
          </div>
        </div>

        <div style={premiumService}>
          <span>🚕</span>
          <span style={routeLabel}>Service:</span>
          <b style={routeValue}>{request.service || "-"}</b>
        </div>

        <div style={premiumSectionTitle}>
          <span style={line} />
          <span style={diamond}>◆</span>
          <b>Vehicle and Driver Details</b>
          <span style={diamond}>◆</span>
          <span style={line} />
        </div>

        <div style={detailGrid}>
          <PremiumDetailCard
  title="Vehicle Type"
  imageSrc={vehicleImageSrc}
  imageAlt={vehicleName}
  fallback="🚗"
  name={vehicleName}
  vehicleNo={request.vehicleNo}
  rating={rating.vehicle}
  onViewRating={() => setSelectedPopup("vehicle")}
/>
          <PremiumDetailCard
            title="Driver Name"
            imageSrc={driverImageSrc}
            imageAlt={request.driverName || "Driver"}
            fallback={getInitials(request.driverName || "Driver")}
            name={request.driverName || "-"}
            rating={rating.driver}
            onViewRating={() => setSelectedPopup("driver")}
            circle
          />
        </div>

        <div style={fareChargesRow}>
  <span style={fareIcon}>₹</span>
  <span style={routeLabel}>Fare Charges:</span>
  <b style={fareChargesValue}>{fare || "-"}</b>
</div>

        {callDriverHref ? (
          <a href={callDriverHref} style={premiumCallBtn}>
            <span style={callIcon}>📞</span>
            Call Driver Now
          </a>
        ) : null}
      </div>

      <RatingDetailsPopup
  kind={selectedPopup}
  driverRating={rating.driver}
  vehicleRating={rating.vehicle}
  driverName={request.driverName || "Driver"}
  vehicleNo={formatVehicleNumber(request.vehicleNo) || "Vehicle"}
  onClose={() => setSelectedPopup(null)}
/>
    </>
  );
}

function PremiumDetailCard({
  title,
  imageSrc,
  imageAlt,
  fallback,
  name,
  vehicleNo,
  rating,
  onViewRating,
  circle = false,
}: {
  title: string;
  imageSrc: string;
  imageAlt: string;
  fallback: string;
  name: string;
  vehicleNo?: string;
  rating: RatingDetails | null;
  onViewRating: () => void;
  circle?: boolean;
}) {
  return (
    <div style={profileCard}>
      <div style={profileTitle}>{title}</div>

    <PremiumImage
  src={imageSrc}
  alt={imageAlt}
  fallback={fallback}
  circle={circle}
/>

{vehicleNo ? (
  <div style={vehicleNoBadge}>
    Vehicle No: <b>{formatVehicleNumber(vehicleNo)}</b>
  </div>
) : null}

<div style={profileName}>{name || "-"}</div>

      <RealStarRating rating={rating} onView={onViewRating} />

      <div style={performance}>Recent Performance</div>
    </div>
  );
}

function PremiumImage({
  src,
  alt,
  fallback,
  circle,
}: {
  src: string;
  alt: string;
  fallback: string;
  circle?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div style={circle ? imageFrameCircle : imageFrame}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          style={circle ? driverImg : vehicleImg}
          onError={() => setFailed(true)}
        />
      ) : (
        <span style={avatarFallback}>{fallback}</span>
      )}
    </div>
  );
}

function RealStarRating({
  rating,
  onView,
}: {
  rating: RatingDetails | null;
  onView: () => void;
}) {
  if (!rating || !rating.average || rating.average <= 0) {
    return <div style={noRating}>No rating yet</div>;
  }

  const filledStars = Math.max(0, Math.min(5, Math.round(rating.average)));

  return (
    <button type="button" style={ratingButton} onClick={onView}>
      <span style={starsLine}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} style={star <= filledStars ? starFilled : starEmpty}>
            ★
          </span>
        ))}
      </span>

      <span style={ratingNumber}>{rating.average.toFixed(1)}</span>
    </button>
  );
}

function RatingDetailsPopup({
  kind,
  driverRating,
  vehicleRating,
  driverName,
  vehicleNo,
  onClose,
}: {
  kind: "driver" | "vehicle" | null;
  driverRating: RatingDetails | null;
  vehicleRating: RatingDetails | null;
  driverName: string;
  vehicleNo: string;
  onClose: () => void;
}) {
  if (!kind) return null;

  const data = kind === "driver" ? driverRating : vehicleRating;
  const title = kind === "driver" ? driverName || "Driver" : vehicleNo || "Vehicle";

  return (
    <div style={ratingOverlay}>
      <div style={ratingCard}>
        <button
          type="button"
          aria-label="Close rating details"
          style={ratingClose}
          onClick={onClose}
        >
          ×
        </button>

        <h3 style={ratingTitle}>{title}</h3>

        {data ? (
          <>
            <div style={ratingAverage}>Average: ⭐ {data.average.toFixed(1)}</div>

            {data.details.map((item) => (
              <div key={item.label} style={ratingDetailRow}>
                <span style={ratingDetailLabel}>{item.label}</span>
                <b style={ratingDetailValue}>
                  {item.value > 0 ? `⭐ ${item.value.toFixed(1)}` : "-"}
                </b>
              </div>
            ))}
          </>
        ) : (
          <p style={noRatingText}>
            Abhi iske liye koi real customer rating available nahi hai.
          </p>
        )}

        <button type="button" style={closeTextBtn} onClick={onClose}>
          Close
        </button>
      </div>
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

function formatDateForDisplay(value: string) {
  const raw = String(value || "").trim();

  if (!raw) return "-";

  const date = new Date(`${raw}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function shortBookingId(id?: string) {
  if (!id) return "-";

  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 10000;
  }

  return `VT-${String(hash).padStart(4, "0")}`;
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

function getRequestString(request: BookingRequestRecord, keys: string[]) {
  const record = request as unknown as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return "";
}

function getVehicleName(request: BookingRequestRecord) {
  return (
    [request.vehicleType, request.vehicleModel].filter(Boolean).join(" ").trim() ||
    request.requestedVehicle ||
    "Vehicle"
  );
}

function getVehicleImageSrc(request: BookingRequestRecord) {
  const directImage = getRequestString(request, [
    "vehicleImageUrl",
    "vehicleImage",
    "vehiclePhotoUrl",
    "assignedVehicleImageUrl",
    "selectedVehicleImageUrl",
    "requestedVehicleImageUrl",
  ]);

  if (directImage) return directImage;

  const name = `${request.requestedVehicle || ""} ${request.vehicleType || ""} ${request.vehicleModel || ""}`.toLowerCase();

  if (name.includes("ertiga")) return "/cars/ertiga2.png";
  if (name.includes("crysta")) return "/cars/crysta2.png";
  if (name.includes("innova")) return "/cars/innova2.png";

  if (
    name.includes("dzire") ||
    name.includes("desire") ||
    name.includes("swift") ||
    name.includes("sedan")
  ) {
    return "/cars/desire2.png";
  }

  return "/cars/ertiga2.png";
}

function getDriverImageSrc(request: BookingRequestRecord) {
  return getRequestString(request, [
    "driverImageUrl",
    "driverPhotoUrl",
    "driverImage",
    "driverPhoto",
    "driverSelfieUrl",
    "driverSelfie",
  ]);
}

function getFareValue(request: BookingRequestRecord) {
  const raw = getRequestString(request, [
    "fare",
    "fareCharges",
    "fareCharge",
    "totalFare",
    "total_fare",
    "price",
    "amount",
    "bookingAmount",
    "booking_amount",
  ]);

  if (!raw) return "";

  const number = Number(raw.replace(/[^\d.]/g, ""));

  if (Number.isFinite(number) && number > 0) {
    return `₹ ${Math.round(number).toLocaleString("en-IN")}`;
  }

  return raw;
}

function formatVehicleNumber(value?: string) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
}
function formatIndianPhone(value: string) {
  const phone = cleanPhone(value);

  return phone ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : "-";
}

function getInitials(value: string) {
  const parts = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "DR";

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,.55)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 8px",
} as const;

const card = {
  width: "100%",
  maxWidth: 450,
  maxHeight: "calc(100vh - 28px)",
  overflowY: "auto",
  background: "#fff",
  borderRadius: 22,
  padding: "8px 8px 10px",
  boxShadow: "0 18px 48px rgba(0,0,0,.24)",
  fontFamily: "Arial, sans-serif",
  position: "relative",
} as const;

const closeBtn = {
  position: "absolute",
  top: 10,
  right: 10,
  width: 36,
  height: 36,
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: "#0f172a",
  fontSize: 24,
  lineHeight: 1,
  fontWeight: 900,
  zIndex: 3,
} as const;

const handle = {
  width: 44,
  height: 5,
  borderRadius: 99,
  background: "#cbd5e1",
  margin: "0 auto 6px",
} as const;

const headerBox = {
  textAlign: "center",
  padding: "4px 44px 8px",
} as const;

const iconBox = {
  width: 52,
  height: 52,
  borderRadius: 16,
  background: "#eff6ff",
  display: "grid",
  placeItems: "center",
  fontSize: 28,
  margin: "0 auto 8px",
} as const;

const titleStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: 18,
  lineHeight: 1.2,
} as const;

const subStyle = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: 13,
  lineHeight: 1.3,
} as const;

const section = {
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  borderRadius: 16,
  padding: 10,
  marginTop: 10,
} as const;

const compactSection = {
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  borderRadius: 16,
  padding: 9,
  marginTop: 8,
} as const;

const sectionTitle = {
  margin: "0 0 8px",
  fontSize: 14,
  color: "#0f172a",
} as const;

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  padding: "6px 0",
  borderTop: "1px dashed #dbe3ee",
} as const;

const infoLabel = {
  color: "#64748b",
  fontSize: 12,
  minWidth: 92,
} as const;

const infoValue = {
  color: "#0f172a",
  fontSize: 12,
  textAlign: "right",
  wordBreak: "break-word",
} as const;

const btnRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginTop: 12,
} as const;

const primaryBtn = {
  width: "100%",
  border: 0,
  borderRadius: 14,
  padding: "11px 14px",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 800,
  fontSize: 14,
} as const;

const ghostBtn = {
  width: "100%",
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: "11px 14px",
  background: "#fff",
  color: "#0f172a",
  fontWeight: 800,
  fontSize: 14,
  marginTop: 10,
} as const;

const dangerBtn = {
  width: "100%",
  border: "1px solid #fecaca",
  borderRadius: 14,
  padding: "11px 14px",
  background: "#fff1f2",
  color: "#b91c1c",
  fontWeight: 800,
  fontSize: 14,
} as const;

const premiumBox = {
  position: "relative",
  borderRadius: 20,
  padding: "12px 10px 10px",
  background: "#fffdf9",
  border: "1px solid #ead8bd",
  overflow: "hidden",
} as const;

const brandStyle = {
  textAlign: "center",
  color: "#a16b24",
  fontFamily: "Georgia, serif",
  fontSize: 14,
  fontWeight: 700,
  marginTop: 0,
  lineHeight: 1.2,
} as const;

const greetingStyle = {
  textAlign: "center",
  color: "#0b1838",
  fontSize: 14,
  fontWeight: 800,
  marginTop: 4,
  marginBottom: 2,
  textDecoration: "underline",
  textDecorationColor: "#b98235",
  textUnderlineOffset: 5,
} as const;

const premiumCustomerName = {
  margin: "8px 0 4px",
  textAlign: "center",
  color: "#071633",
  fontSize: 28,
  lineHeight: 1.05,
  fontWeight: 950,
  letterSpacing: "-0.5px",
} as const;

const premiumConfirmedTitle = {
  color: "#071633",
  fontSize: 17,
  fontWeight: 900,
  textAlign: "center",
  marginBottom: 10,
  lineHeight: 1.2,
} as const;

const premiumRoute = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  border: "1px solid #ead8bd",
  borderRadius: 12,
  padding: "9px 9px",
  background: "#fffdf8",
  color: "#071633",
  fontSize: 13,
  marginTop: 8,
} as const;

const routeIcon = {
  width: 24,
  height: 24,
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  color: "#a16b24",
  fontSize: 16,
  flexShrink: 0,
} as const;

const routeLabel = {
  color: "#a16b24",
  fontWeight: 900,
  flexShrink: 0,
  fontSize: 12,
} as const;

const routeValue = {
  color: "#071633",
  wordBreak: "break-word",
  fontSize: 12,
} as const;

const premiumGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 8,
  marginTop: 8,
} as const;

const miniInfoCard = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid #ead8bd",
  borderRadius: 12,
  padding: "8px 9px",
  background: "#fffdf8",
  minWidth: 0,
} as const;

const miniIcon = {
  fontSize: 19,
  color: "#a16b24",
  flexShrink: 0,
} as const;

const miniLabel = {
  display: "block",
  color: "#a16b24",
  fontSize: 12,
  fontWeight: 900,
} as const;

const miniValue = {
  display: "block",
  color: "#071633",
  fontSize: 13,
  marginTop: 1,
} as const;

const premiumService = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  border: "1px solid #ead8bd",
  borderRadius: 12,
  padding: "9px 9px",
  background: "#fffdf8",
  color: "#071633",
  fontSize: 13,
  marginTop: 8,
} as const;

const premiumSectionTitle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  color: "#071633",
  fontSize: 13,
  margin: "10px 0 8px",
  textAlign: "center",
} as const;

const line = {
  height: 1,
  background: "#d8b06a",
  flex: 1,
  opacity: 0.7,
} as const;

const diamond = {
  color: "#a16b24",
  fontSize: 9,
} as const;

const detailGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 8,
} as const;

const profileCard = {
  border: "1px solid #ead8bd",
  borderRadius: 14,
  padding: "9px 7px",
  background: "#ffffff",
  textAlign: "center",
  minWidth: 0,
} as const;

const profileTitle = {
  color: "#a16b24",
  fontSize: 12,
  fontWeight: 900,
  marginBottom: 6,
  textDecoration: "underline",
  textDecorationColor: "#d8b06a",
  textUnderlineOffset: 4,
} as const;

const imageFrame = {
  width: "100%",
  height: 88,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f8fafc",
  overflow: "visible",
  margin: "0 auto 7px",
  padding: "4px 6px",
} as const;

const imageFrameCircle = {
  width: 78,
  height: 78,
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  background: "#f8fafc",
  border: "2px solid #c9953b",
  overflow: "hidden",
  margin: "0 auto 7px",
} as const;

const vehicleImg = {
  width: "84%",
  height: "84%",
  objectFit: "contain",
  display: "block",
} as const;

const driverImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
} as const;

const avatarFallback = {
  color: "#071633",
  fontSize: 25,
  fontWeight: 950,
} as const;

const vehicleNoBadge = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 3,
  margin: "0 auto 6px",
  padding: "4px 7px",
  borderRadius: 999,
  background: "#fffaf0",
  color: "#a16b24",
  fontSize: 10,
  fontWeight: 900,
  border: "1px solid #ead8bd",
  whiteSpace: "nowrap",
} as const;
const profileName = {
  color: "#071633",
  fontSize: 14,
  fontWeight: 950,
  minHeight: 18,
  wordBreak: "break-word",
} as const;

const ratingButton = {
  border: 0,
  background: "#fffaf0",
  borderRadius: 999,
  padding: "5px 8px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  cursor: "pointer",
  marginTop: 6,
} as const;

const starsLine = {
  display: "inline-flex",
  gap: 1,
  lineHeight: 1,
} as const;

const starFilled = {
  color: "#c9953b",
  fontSize: 15,
  lineHeight: 1,
} as const;

const starEmpty = {
  color: "#d9d9d9",
  fontSize: 15,
  lineHeight: 1,
} as const;

const ratingNumber = {
  color: "#071633",
  fontSize: 11,
  fontWeight: 950,
} as const;

const noRating = {
  marginTop: 6,
  color: "#64748b",
  fontSize: 11,
  fontWeight: 900,
} as const;

const performance = {
  color: "#64748b",
  fontSize: 10,
  marginTop: 4,
  fontWeight: 700,
} as const;

const bottomGrid = {
  display: "grid",
  gap: 8,
  marginTop: 10,
  alignItems: "stretch",
} as const;

const mobileRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  border: "1px solid #ead8bd",
  borderRadius: 12,
  padding: "9px 8px",
  background: "#fffdf8",
  color: "#071633",
  fontSize: 13,
  minHeight: 52,
} as const;

const mobileValue = {
  color: "#071633",
  fontSize: 13,
  whiteSpace: "nowrap",
} as const;

const fareChargesRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  border: "1px solid #ead8bd",
  borderRadius: 12,
  padding: "11px 10px",
  background: "#fffdf8",
  color: "#071633",
  fontSize: 14,
  minHeight: 56,
  marginTop: 12,
} as const;

const fareIcon = {
  width: 30,
  height: 30,
  borderRadius: 999,
  display: "inline-grid",
  placeItems: "center",
  background: "#071633",
  color: "#f4c46f",
  flexShrink: 0,
  fontSize: 18,
  fontWeight: 950,
} as const;

const fareChargesValue = {
  color: "#071633",
  fontSize: 17,
  fontWeight: 950,
  whiteSpace: "nowrap",
} as const;
const phoneIcon = {
  width: 28,
  height: 28,
  borderRadius: 999,
  display: "inline-grid",
  placeItems: "center",
  background: "#071633",
  color: "#f4c46f",
  flexShrink: 0,
  fontSize: 14,
} as const;

const fareMiniBox = {
  border: "1px solid #ead8bd",
  borderRadius: 12,
  padding: "8px 8px",
  background: "#071633",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  minHeight: 52,
} as const;

const fareMiniLabel = {
  fontSize: 10,
  color: "#f4c46f",
  fontWeight: 900,
  lineHeight: 1.1,
} as const;

const fareMiniValue = {
  fontSize: 18,
  color: "#fff",
  fontWeight: 950,
  lineHeight: 1.2,
  marginTop: 2,
} as const;

const premiumCallBtn = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  textDecoration: "none",
  borderRadius: 14,
  padding: "10px 12px",
  background: "linear-gradient(135deg,#071633,#051126)",
  color: "#fff",
  fontWeight: 900,
  fontSize: 16,
  marginTop: 10,
  border: "2px solid #c9953b",
} as const;

const callIcon = {
  width: 32,
  height: 32,
  borderRadius: 999,
  display: "inline-grid",
  placeItems: "center",
  border: "1px solid #c9953b",
  color: "#f4c46f",
  fontSize: 15,
} as const;

const ratingOverlay = {
  position: "fixed",
  inset: 0,
  background: "transparent",
  zIndex: 10000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  pointerEvents: "none",
} as const;

const ratingCard = {
  width: "100%",
  maxWidth: 360,
  background: "#ffffff",
  borderRadius: 18,
  padding: "16px 14px 14px",
  position: "relative",
  boxShadow: "0 8px 24px rgba(15,23,42,.16)",
  border: "1px solid #ead8bd",
  pointerEvents: "auto",
} as const;

const ratingClose = {
  position: "absolute",
  top: 10,
  right: 10,
  width: 32,
  height: 32,
  borderRadius: 999,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 22,
  lineHeight: 1,
  fontWeight: 900,
} as const;

const ratingTitle = {
  margin: "0 42px 10px 0",
  color: "#071633",
  fontSize: 17,
  fontWeight: 950,
} as const;

const ratingAverage = {
  marginBottom: 10,
  padding: 10,
  borderRadius: 13,
  background: "#fff7ed",
  color: "#9a5a12",
  fontWeight: 950,
  textAlign: "center",
  fontSize: 13,
} as const;

const ratingDetailRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  padding: "8px 0",
  borderTop: "1px dashed #e2e8f0",
  color: "#334155",
  fontSize: 12,
} as const;

const ratingDetailLabel = {
  color: "#64748b",
  fontWeight: 800,
} as const;

const ratingDetailValue = {
  color: "#071633",
  whiteSpace: "nowrap",
} as const;

const noRatingText = {
  margin: 0,
  padding: 12,
  borderRadius: 14,
  background: "#f8fafc",
  color: "#64748b",
  fontSize: 13,
  fontWeight: 800,
} as const;

const closeTextBtn = {
  width: "100%",
  marginTop: 12,
  border: 0,
  background: "#071633",
  color: "#ffffff",
  borderRadius: 14,
  padding: "10px 14px",
  fontSize: 14,
  fontWeight: 950,
} as const;
