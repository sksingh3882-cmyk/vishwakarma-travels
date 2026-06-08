"use client";

import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function supabaseHeaders(prefer = "return=representation") {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    "Content-Type": "application/json",
    Prefer: prefer,
  };
}

function checkSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase connection missing.  By checking env keys.");
  }
}

type BookingData = Record<string, any>;

type Question = {
  key:
    | "driver_behaviour_rating"
    | "driving_safety_rating"
    | "pickup_timing_rating"
    | "driver_communication_rating"
    | "overall_driver_rating"
    | "vehicle_cleanliness_rating"
    | "vehicle_comfort_rating"
    | "ac_cooling_rating"
    | "seat_condition_rating"
    | "overall_vehicle_rating";
  title: string;
  group: "Driver" | "Vehicle";
};

const questions: Question[] = [
  { key: "driver_behaviour_rating", title: "Driver Behaviour", group: "Driver" },
  { key: "driving_safety_rating", title: "Driving Safety", group: "Driver" },
  { key: "pickup_timing_rating", title: "Pickup Timing", group: "Driver" },
  { key: "driver_communication_rating", title: "Driver Communication", group: "Driver" },
  { key: "overall_driver_rating", title: "Overall Driver Experience", group: "Driver" },

    { key: "vehicle_cleanliness_rating", title: "Vehicle Cleanliness", group: "Vehicle" },
  { key: "vehicle_comfort_rating", title: "Vehicle Comfort", group: "Vehicle" },
  { key: "ac_cooling_rating", title: "AC / Cooling", group: "Vehicle" },
  { key: "seat_condition_rating", title: "Seat Condition", group: "Vehicle" },
  { key: "overall_vehicle_rating", title: "Overall Vehicle Experience", group: "Vehicle" },
];

const burstColors = [
  "#f59e0b",
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#ec4899",
  "#a855f7",
];

function getValue(data: BookingData | null, keys: string[]) {
  if (!data) return "";
  for (const key of keys) {
    if (
      data[key] !== undefined &&
      data[key] !== null &&
      String(data[key]).trim() !== ""
    ) {
      return String(data[key]);
    }
  }
  return "";
}

function average(values: number[]) {
  const valid = values.filter((value) => value >= 1 && value <= 5);
  if (valid.length === 0) return 0;
  return Number(
    (valid.reduce((sum, value) => sum + value, 0) / valid.length).toFixed(2)
  );
}

export default function RatingPage() {
  const params = useParams();
  const bookingIdParam = params?.bookingId;
  const bookingId = Array.isArray(bookingIdParam)
    ? bookingIdParam[0]
    : bookingIdParam || "";

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");

  const [ratings, setRatings] = useState<Record<string, number>>({});

  const currentQuestion = questions[currentIndex];

  const completedCount = useMemo(() => {
    return questions.filter((question) => ratings[question.key]).length;
  }, [ratings]);

  const allComplete = completedCount === questions.length;
    useEffect(() => {
    async function loadBooking() {
      try {
        setLoading(true);
        setErrorMessage("");

    
                checkSupabaseConfig();

                if (bookingId === "test" || bookingId === "demo") {
          setBooking({
            customer_name: "Demo Customer",
            customer_mobile: "9999999999",
            driver_name: "Demo Driver",
            driver_mobile: "8888888888",
            vehicle_number: "JH05AB1234",
            vehicle_model: "Sedan",
          });
          return;
        }

        checkSupabaseConfig();

        if (!bookingId) {
          setErrorMessage("Booking ID is missing.");
          return;
        }

                const response = await fetch(
          `${supabaseUrl}/rest/v1/bookings?select=*&booking_id=eq.${encodeURIComponent(
            bookingId
          )}&limit=1`,
          {
            headers: supabaseHeaders("return=minimal"),
          }
        );

        if (!response.ok) {
          throw new Error("Could not fetch booking details.");
        }

        const rows = await response.json();
        const data = Array.isArray(rows) ? rows[0] : null;

        if (!data) {
          setErrorMessage("Booking details not found.");
          return;
        }

        setBooking(data);
      } catch (error: any) {
        setErrorMessage(error?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [bookingId]);

  function selectRating(questionKey: string, value: number) {
    setRatings((previous) => ({
      ...previous,
      [questionKey]: value,
    }));

    setTimeout(() => {
      setCurrentIndex((previousIndex) => {
        if (previousIndex < questions.length - 1) {
          return previousIndex + 1;
        }
        return previousIndex;
      });
    }, 250);
  }

  async function submitRating() {
    try {
      setSaving(true);
      setErrorMessage("");

            checkSupabaseConfig();

      if (!allComplete) {
        setErrorMessage("Please complete all 10 ratings..");
        return;
      }

      const driverRatings = [
        ratings.driver_behaviour_rating,
        ratings.driving_safety_rating,
        ratings.pickup_timing_rating,
        ratings.driver_communication_rating,
        ratings.overall_driver_rating,
      ];

      const vehicleRatings = [
        ratings.vehicle_cleanliness_rating,
        ratings.vehicle_comfort_rating,
        ratings.ac_cooling_rating,
        ratings.seat_condition_rating,
        ratings.overall_vehicle_rating,
      ];

      const driverAverage = average(driverRatings);
      const vehicleAverage = average(vehicleRatings);
      const overallAverage = average([...driverRatings, ...vehicleRatings]);

      const payload = {
        booking_id: bookingId,

        customer_name: getValue(booking, [
          "customer_name",
          "name",
          "full_name",
          "customerName",
        ]),
                customer_mobile: getValue(booking, [
          "customer_mobile",
          "customer_phone",
          "mobile",
          "phone",
          "contact",
          "customerMobile",
        ]),

        driver_name: getValue(booking, [
          "driver_name",
          "assigned_driver_name",
          "driverName",
        ]),
        driver_mobile: getValue(booking, [
          "driver_mobile",
          "assigned_driver_mobile",
          "driverMobile",
        ]),

                vehicle_number: getValue(booking, [
          "vehicle_number",
          "vehicle_no",
          "car_number",
          "assigned_vehicle_number",
          "vehicleNumber",
        ]),
        vehicle_model: getValue(booking, [
          "vehicle_model",
          "vehicle_type",
          "car_model",
          "selected_vehicle",
          "vehicleModel",
        ]),
        driver_behaviour_rating: ratings.driver_behaviour_rating,
        driving_safety_rating: ratings.driving_safety_rating,
        pickup_timing_rating: ratings.pickup_timing_rating,
        driver_communication_rating: ratings.driver_communication_rating,
        overall_driver_rating: ratings.overall_driver_rating,

        vehicle_cleanliness_rating: ratings.vehicle_cleanliness_rating,
        vehicle_comfort_rating: ratings.vehicle_comfort_rating,
        ac_cooling_rating: ratings.ac_cooling_rating,
        seat_condition_rating: ratings.seat_condition_rating,
        overall_vehicle_rating: ratings.overall_vehicle_rating,

        driver_average_rating: driverAverage,
        vehicle_average_rating: vehicleAverage,
        overall_average_rating: overallAverage,

        feedback: feedback.trim(),
        updated_at: new Date().toISOString(),
      };

            const response = await fetch(
        `${supabaseUrl}/rest/v1/trip_ratings?on_conflict=booking_id`,
        {
          method: "POST",
          headers: supabaseHeaders("resolution=merge-duplicates,return=minimal"),
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("The rating could not be submitted.");
      }

      setSuccessOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.message || "The rating could not be submitted.");
    } finally {
      setSaving(false);
    }
  }
  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logoCircle}>⭐</div>
          <h1 style={styles.title}>Loading Rating Page...</h1>
          <p style={styles.subText}>Please wait</p>
        </div>
      </main>
    );
  }

  if (errorMessage && !booking) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logoCircle}>⚠️</div>
          <h1 style={styles.title}>Rating Page Error</h1>
          <p style={styles.error}>{errorMessage}</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topRow}>
          <div>
            <p style={styles.brand}>Vishwakarma Travels</p>
            <h1 style={styles.title}>Trip Rating</h1>
          </div>
          <div style={styles.logoCircle}>⭐</div>
        </div>

        <div style={styles.progressBox}>
          <div style={styles.progressText}>
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${(completedCount / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div style={styles.questionCard}>
          <span style={styles.badge}>{currentQuestion.group}</span>
          <h2 style={styles.questionTitle}>{currentQuestion.title}</h2>
          <p style={styles.subText}>Please 1 se 5 star select karo</p>

          <div style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (ratings[currentQuestion.key] || 0) >= star;

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => selectRating(currentQuestion.key, star)}
                  style={{
                    ...styles.starButton,
                    transform: active ? "scale(1.08)" : "scale(1)",
                    filter: active ? "none" : "grayscale(1)",
                  }}
                >
                  ★
                </button>
              );
            })}
          </div>

          <div style={styles.selectedText}>
            {ratings[currentQuestion.key]
              ? `${ratings[currentQuestion.key]} star selected`
              : "No rating selected"}
          </div>
        </div>
        <div style={styles.navRow}>
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            disabled={currentIndex === 0}
            style={{
              ...styles.smallButton,
              opacity: currentIndex === 0 ? 0.45 : 1,
            }}
          >
            Back
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrentIndex((index) =>
                Math.min(questions.length - 1, index + 1)
              )
            }
            disabled={currentIndex === questions.length - 1}
            style={{
              ...styles.smallButton,
              opacity: currentIndex === questions.length - 1 ? 0.45 : 1,
            }}
          >
            Next
          </button>
        </div>

        {allComplete && (
          <div style={styles.feedbackBox}>
            <label style={styles.label}>Feedback optional</label>
            <textarea
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder="Trip ke baare me feedback likh sakte hain..."
              style={styles.textarea}
            />
          </div>
        )}

        {errorMessage && <p style={styles.error}>{errorMessage}</p>}

        <button
          type="button"
          onClick={submitRating}
          disabled={!allComplete || saving}
          style={{
            ...styles.submitButton,
            opacity: !allComplete || saving ? 0.55 : 1,
          }}
        >
          {saving ? "Submitting..." : "Submit Rating"}
        </button>

        {!allComplete && (
          <p style={styles.bottomNote}>
            The submit button will become active after all 10 questions are completed.
          </p>
        )}
      </div>

            {successOpen && (
        <div style={styles.popupOverlay}>
          <div style={styles.burstLayer}>
            <div style={styles.pulseRing} />
            <div
              style={{
                ...styles.pulseRing,
                animationDelay: "0.12s",
                border: "4px solid rgba(249, 115, 22, 0.45)",
              }}
            />

            {Array.from({ length: 30 }).map((_, index) => {
              const angle = (360 / 30) * index;
              const distance = 110 + (index % 4) * 18;
              const x = Math.cos((angle * Math.PI) / 180) * distance;
              const y = Math.sin((angle * Math.PI) / 180) * distance;

              const isDot = index % 3 === 0;
              const isSquare = index % 3 === 1;

              return (
                <span
                  key={index}
                  style={
                    {
                      ...styles.burstPiece,
                      background: burstColors[index % burstColors.length],
                      width: isDot ? "10px" : isSquare ? "12px" : "10px",
                      height: isDot ? "10px" : isSquare ? "12px" : "28px",
                      borderRadius: isDot ? "999px" : isSquare ? "3px" : "999px",
                      animationDelay: `${index * 0.02}s`,
                      ["--x" as any]: `${x}px`,
                      ["--y" as any]: `${y}px`,
                      ["--r" as any]: `${180 + index * 18}deg`,
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </div>

          <div style={styles.successPopup}>
            <div style={styles.checkmarkWrap}>
              <svg viewBox="0 0 80 80" style={styles.checkmarkSvg}>
                <circle cx="40" cy="40" r="28" style={styles.checkmarkCircle} />
                <path
                  d="M24 41 L35 52 L57 29"
                  style={styles.checkmarkTick}
                />
              </svg>
            </div>

            <h2 style={styles.successTitle}>Thank You For Your Support</h2>
            <p style={styles.successText}>
              Your rating has been successfully submitted.
            </p>

            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              style={styles.doneButton}
            >
              Done
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes popIn {
          0% {
            transform: scale(0.78);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes ringPulse {
          0% {
            width: 26px;
            height: 26px;
            opacity: 1;
          }
          100% {
            width: 320px;
            height: 320px;
            opacity: 0;
          }
        }

        @keyframes drawCircle {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes drawTick {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes confettiBurst {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(0deg) scale(0.25);
          }
          75% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform:
              translate(
                calc(-50% + var(--x)),
                calc(-50% + var(--y))
              )
              rotate(var(--r))
              scale(1);
          }
        }
      `}</style>
      
    </main>
  );
        }
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #fff8e8 0%, #ffffff 45%, #f8fafc 100%)",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "20px",
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
    border: "1px solid rgba(15, 23, 42, 0.08)",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  brand: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 700,
    color: "#f59e0b",
  },
  title: {
    margin: "4px 0 0",
    fontSize: "28px",
    fontWeight: 900,
    color: "#111827",
  },
  logoCircle: {
    width: "54px",
    height: "54px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff7ed",
    fontSize: "28px",
  },
  progressBox: {
    marginTop: "22px",
  },
  progressText: {
    fontSize: "13px",
    fontWeight: 800,
    color: "#475569",
    marginBottom: "8px",
  },
  progressTrack: {
    width: "100%",
    height: "10px",
    borderRadius: "999px",
    background: "#e5e7eb",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #f59e0b, #f97316)",
    transition: "width 0.25s ease",
  },
  questionCard: {
    marginTop: "22px",
    padding: "20px",
    borderRadius: "22px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    textAlign: "center",
  },
  badge: {
    display: "inline-flex",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#111827",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 800,
  },
  questionTitle: {
    margin: "16px 0 6px",
    fontSize: "24px",
    fontWeight: 900,
    color: "#111827",
  },
  subText: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
    fontWeight: 600,
  },
  starRow: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },
  starButton: {
    border: "0",
    background: "transparent",
    color: "#f59e0b",
    fontSize: "42px",
    lineHeight: 1,
    padding: "4px",
    cursor: "pointer",
    transition: "all 0.18s ease",
  },
  selectedText: {
    marginTop: "14px",
    fontSize: "14px",
    fontWeight: 800,
    color: "#334155",
  },
  navRow: {
    marginTop: "16px",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  },
  smallButton: {
    flex: 1,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#111827",
    padding: "12px 14px",
    borderRadius: "14px",
    fontSize: "14px",
    fontWeight: 900,
  },
  feedbackBox: {
    marginTop: "18px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: 900,
    color: "#111827",
  },
  textarea: {
    width: "100%",
    minHeight: "96px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "12px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  error: {
    marginTop: "14px",
    padding: "12px",
    borderRadius: "14px",
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: "14px",
    fontWeight: 700,
  },
  submitButton: {
    marginTop: "18px",
    width: "100%",
    border: "0",
    borderRadius: "18px",
    background: "linear-gradient(90deg, #f59e0b, #f97316)",
    color: "#ffffff",
    padding: "15px 18px",
    fontSize: "16px",
    fontWeight: 900,
    boxShadow: "0 12px 25px rgba(249, 115, 22, 0.28)",
  },
  bottomNote: {
    margin: "12px 0 0",
    textAlign: "center",
    fontSize: "12px",
    color: "#64748b",
    fontWeight: 700,
  },
  popupOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.62)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px",
    zIndex: 9999,
  },
  successPopup: {
    width: "100%",
    maxWidth: "360px",
    background: "#ffffff",
    borderRadius: "26px",
    padding: "26px 20px",
    textAlign: "center",
    position: "relative",
    zIndex: 2,
    animation: "popIn 0.28s ease",
  },
    checkmarkWrap: {
    width: "112px",
    height: "112px",
    margin: "0 auto 16px",
    borderRadius: "999px",
    background: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 30px rgba(34, 197, 94, 0.18)",
  },
  checkmarkSvg: {
    width: "78px",
    height: "78px",
    display: "block",
  },
  checkmarkCircle: {
    fill: "none",
    stroke: "#22c55e",
    strokeWidth: 5,
    strokeDasharray: 220,
    strokeDashoffset: 220,
    animation: "drawCircle 0.55s ease forwards",
  },
  checkmarkTick: {
    fill: "none",
    stroke: "#16a34a",
    strokeWidth: 6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeDasharray: 80,
    strokeDashoffset: 80,
    animation: "drawTick 0.42s ease forwards",
    animationDelay: "0.5s",
  },
  successTitle: {
    margin: "8px 0 8px",
    fontSize: "24px",
    fontWeight: 950,
    color: "#111827",
    lineHeight: 1.15,
  },
  successText: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 650,
    color: "#64748b",
  },
  doneButton: {
    marginTop: "18px",
    width: "100%",
    border: "0",
    borderRadius: "16px",
    background: "#111827",
    color: "#ffffff",
    padding: "13px",
    fontSize: "15px",
    fontWeight: 900,
  },
  burstLayer: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: 1,
  },
  pulseRing: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "26px",
    height: "26px",
    border: "4px solid rgba(245, 158, 11, 0.7)",
    borderRadius: "999px",
    transform: "translate(-50%, -50%)",
    animation: "ringPulse 0.85s ease-out forwards",
  },
  burstPiece: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "12px",
    height: "28px",
    borderRadius: "999px",
    transform: "translate(-50%, -50%)",
    animation: "confettiBurst 1.2s cubic-bezier(0.08, 0.82, 0.18, 1) forwards",
    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
  },
};
      
