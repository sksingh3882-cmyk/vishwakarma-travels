"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

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

        if (!supabase) {
          setErrorMessage("Supabase connection missing. Env keys check karo.");
          return;
        }

        if (!bookingId) {
          setErrorMessage("Booking ID missing hai.");
          return;
        }
        const { data, error } = await supabase
          .from("booking_requests")
          .select("*")
          .eq("id", bookingId)
          .maybeSingle();

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (!data) {
          setErrorMessage("Booking details nahi mile.");
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

      if (!supabase) {
        setErrorMessage("Supabase connection missing. Env keys check karo.");
        return;
      }

      if (!allComplete) {
        setErrorMessage("Please sabhi 10 rating complete karo.");
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
          "assigned_vehicle_number",
          "vehicleNumber",
        ]),
        vehicle_model: getValue(booking, [
          "vehicle_model",
          "vehicle_type",
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

      const { error } = await supabase
        .from("trip_ratings")
        .upsert(payload, { onConflict: "booking_id" });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.message || "Rating submit nahi ho paya.");
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
            Submit button sabhi 10 questions complete hone ke baad active hoga.
          </p>
        )}
      </div>

      {successOpen && (
        <div style={styles.popupOverlay}>
          <div style={styles.confettiBox}>
            {Array.from({ length: 18 }).map((_, index) => (
              <span
                key={index}
                style={{
                  ...styles.confetti,
                  left: `${8 + index * 5}%`,
                  animationDelay: `${index * 0.08}s`,
                }}
              />
            ))}
          </div>

          <div style={styles.successPopup}>
            <div style={styles.successIcon}>🎉</div>
            <h2 style={styles.successTitle}>Thank You For Your Support</h2>
            <p style={styles.successText}>
              Aapki rating successfully submit ho gayi hai.
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
            transform: scale(0.75);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(-80px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(340px) rotate(260deg);
            opacity: 0;
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
  successIcon: {
    fontSize: "54px",
  },
  successTitle: {
    margin: "12px 0 8px",
    fontSize: "24px",
    fontWeight: 950,
    color: "#111827",
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
  confettiBox: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: 1,
  },
  confetti: {
    position: "absolute",
    top: "10%",
    width: "10px",
    height: "18px",
    borderRadius: "3px",
    background: "#f59e0b",
    animation: "confettiFall 1.6s ease-in-out infinite",
  },
};
      
