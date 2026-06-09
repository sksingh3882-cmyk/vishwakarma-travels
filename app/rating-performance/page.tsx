"use client";

import { useEffect, useMemo, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function supabaseHeaders() {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    "Content-Type": "application/json",
  };
}

type TripRating = {
  id?: string;
  booking_id?: string;

  customer_name?: string;
  customer_mobile?: string;

  driver_name?: string;
  driver_mobile?: string;

  vehicle_number?: string;
  vehicle_model?: string;

  driver_behaviour_rating?: number;
  driving_safety_rating?: number;
  pickup_timing_rating?: number;
  driver_communication_rating?: number;
  overall_driver_rating?: number;

  vehicle_cleanliness_rating?: number;
  vehicle_comfort_rating?: number;
  ac_cooling_rating?: number;
  seat_condition_rating?: number;
  overall_vehicle_rating?: number;

  driver_average_rating?: number;
  vehicle_average_rating?: number;
  overall_average_rating?: number;

  feedback?: string;
  created_at?: string;
};

type DriverPerformance = {
  key: string;
  driver_name: string;
  driver_mobile: string;
  trips: number;
  average: number;
  behaviour: number;
  safety: number;
  timing: number;
  communication: number;
  overall: number;
};

type VehiclePerformance = {
  key: string;
  vehicle_number: string;
  vehicle_model: string;
  trips: number;
  average: number;
  cleanliness: number;
  comfort: number;
  ac: number;
  seat: number;
  overall: number;
};

function numberValue(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function average(values: number[]) {
  const valid = values.filter((v) => v > 0);
  if (!valid.length) return 0;
  return Number((valid.reduce((sum, v) => sum + v, 0) / valid.length).toFixed(2));
}

function starText(value: number) {
  if (!value) return "New";
  return `⭐ ${value.toFixed(2)}`;
}

export default function RatingPerformancePage() {
  const [ratings, setRatings] = useState<TripRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"drivers" | "vehicles" | "trips">("drivers");
  const [selectedDriver, setSelectedDriver] = useState<DriverPerformance | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehiclePerformance | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<TripRating | null>(null);

  useEffect(() => {
    async function loadRatings() {
      try {
        setLoading(true);
        setErrorMessage("");

        if (!supabaseUrl || !supabaseAnonKey) {
          setErrorMessage("Supabase env keys missing hain.");
          return;
        }

        const response = await fetch(
          `${supabaseUrl}/rest/v1/trip_ratings?select=*&order=created_at.desc`,
          {
            headers: supabaseHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error("Ratings fetch nahi ho payi.");
        }

        const data = await response.json();
        setRatings(Array.isArray(data) ? data : []);
      } catch (error: any) {
        setErrorMessage(error?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadRatings();
  }, []);
  const driverPerformance = useMemo(() => {
    const map = new Map<string, TripRating[]>();

    ratings.forEach((rating) => {
      const mobile = String(rating.driver_mobile || "").trim();
      const name = String(rating.driver_name || "Unknown Driver").trim();
      const key = mobile || name;

      if (!key) return;

      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(rating);
    });

    return Array.from(map.entries())
      .map(([key, list]) => {
        return {
          key,
          driver_name: list[0]?.driver_name || "Unknown Driver",
          driver_mobile: list[0]?.driver_mobile || "-",
          trips: list.length,
          average: average(list.map((r) => numberValue(r.driver_average_rating))),
          behaviour: average(list.map((r) => numberValue(r.driver_behaviour_rating))),
          safety: average(list.map((r) => numberValue(r.driving_safety_rating))),
          timing: average(list.map((r) => numberValue(r.pickup_timing_rating))),
          communication: average(list.map((r) => numberValue(r.driver_communication_rating))),
          overall: average(list.map((r) => numberValue(r.overall_driver_rating))),
        };
      })
      .sort((a, b) => b.average - a.average);
  }, [ratings]);

  const vehiclePerformance = useMemo(() => {
    const map = new Map<string, TripRating[]>();

    ratings.forEach((rating) => {
      const number = String(rating.vehicle_number || "").trim();
      const model = String(rating.vehicle_model || "Vehicle").trim();
      const key = number || model;

      if (!key) return;

      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(rating);
    });

    return Array.from(map.entries())
      .map(([key, list]) => {
        return {
          key,
          vehicle_number: list[0]?.vehicle_number || "Unknown Vehicle",
          vehicle_model: list[0]?.vehicle_model || "-",
          trips: list.length,
          average: average(list.map((r) => numberValue(r.vehicle_average_rating))),
          cleanliness: average(list.map((r) => numberValue(r.vehicle_cleanliness_rating))),
          comfort: average(list.map((r) => numberValue(r.vehicle_comfort_rating))),
          ac: average(list.map((r) => numberValue(r.ac_cooling_rating))),
          seat: average(list.map((r) => numberValue(r.seat_condition_rating))),
          overall: average(list.map((r) => numberValue(r.overall_vehicle_rating))),
        };
      })
      .sort((a, b) => b.average - a.average);
  }, [ratings]);

  const summary = useMemo(() => {
    return {
      totalRatings: ratings.length,
      driverAverage: average(ratings.map((r) => numberValue(r.driver_average_rating))),
      vehicleAverage: average(ratings.map((r) => numberValue(r.vehicle_average_rating))),
      overallAverage: average(ratings.map((r) => numberValue(r.overall_average_rating))),
    };
  }, [ratings]);

  function closePopup() {
    setSelectedDriver(null);
    setSelectedVehicle(null);
    setSelectedTrip(null);
  }
    async function deleteTripRating(trip: TripRating) {
    if (!trip.id) {
      alert("Rating ID not found.");
      return;
    }

    const ok = window.confirm("Are you sure you want to delete this trip rating?");
    if (!ok) return;

    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/trip_ratings?id=eq.${encodeURIComponent(trip.id)}`,
        {
          method: "DELETE",
          headers: supabaseHeaders(),
        }
      );

      if (!response.ok) throw new Error("Unable to delete rating.");

      setRatings((prev) => prev.filter((rating) => rating.id !== trip.id));
      setSelectedTrip(null);
    } catch (error: any) {
      alert(error?.message || "Unable to delete rating.");
    }
  }

  async function deleteDriverRatings(driver: DriverPerformance) {
    const mobile = String(driver.driver_mobile || "").trim();
    const name = String(driver.driver_name || "").trim();
    const useMobile = Boolean(mobile && mobile !== "-");

    const ok = window.confirm(`Delete all ratings for driver ${name || mobile}?`);
    if (!ok) return;

    try {
      const query = useMobile
        ? `driver_mobile=eq.${encodeURIComponent(mobile)}`
        : `driver_name=eq.${encodeURIComponent(name)}`;

      const response = await fetch(`${supabaseUrl}/rest/v1/trip_ratings?${query}`, {
        method: "DELETE",
        headers: supabaseHeaders(),
      });

      if (!response.ok) throw new Error("Unable to delete driver ratings.");

      setRatings((prev) =>
        prev.filter((rating) =>
          useMobile
            ? String(rating.driver_mobile || "").trim() !== mobile
            : String(rating.driver_name || "").trim() !== name
        )
      );

      setSelectedDriver(null);
    } catch (error: any) {
      alert(error?.message || "Unable to delete driver ratings.");
    }
  }

  async function deleteVehicleRatings(vehicle: VehiclePerformance) {
    const vehicleNumber = String(vehicle.vehicle_number || "").trim();
    const vehicleModel = String(vehicle.vehicle_model || "").trim();
    const useNumber = Boolean(vehicleNumber && vehicleNumber !== "Unknown Vehicle");

    const ok = window.confirm(`Delete all ratings for vehicle ${vehicleNumber || vehicleModel}?`);
    if (!ok) return;

    try {
      const query = useNumber
        ? `vehicle_number=eq.${encodeURIComponent(vehicleNumber)}`
        : `vehicle_model=eq.${encodeURIComponent(vehicleModel)}`;

      const response = await fetch(`${supabaseUrl}/rest/v1/trip_ratings?${query}`, {
        method: "DELETE",
        headers: supabaseHeaders(),
      });

      if (!response.ok) throw new Error("Unable to delete vehicle ratings.");

      setRatings((prev) =>
        prev.filter((rating) =>
          useNumber
            ? String(rating.vehicle_number || "").trim() !== vehicleNumber
            : String(rating.vehicle_model || "").trim() !== vehicleModel
        )
      );

      setSelectedVehicle(null);
    } catch (error: any) {
      alert(error?.message || "Unable to delete vehicle ratings.");
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Rating Performance</h1>
          <p style={styles.subText}>Loading ratings...</p>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Rating Performance</h1>
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
            <h1 style={styles.title}>Rating Performance</h1>
            <p style={styles.subText}>Driver aur Vehicle performance report</p>
          </div>
          <a href="/admin" style={styles.backLink}>Admin</a>
        </div>

        <div style={styles.summaryGrid}>
          <div style={styles.summaryBox}>
            <span style={styles.summaryLabel}>Total Ratings</span>
            <b style={styles.summaryValue}>{summary.totalRatings}</b>
          </div>
          <div style={styles.summaryBox}>
            <span style={styles.summaryLabel}>Driver Avg</span>
            <b style={styles.summaryValue}>{starText(summary.driverAverage)}</b>
          </div>
          <div style={styles.summaryBox}>
            <span style={styles.summaryLabel}>Vehicle Avg</span>
            <b style={styles.summaryValue}>{starText(summary.vehicleAverage)}</b>
          </div>
          <div style={styles.summaryBox}>
            <span style={styles.summaryLabel}>Overall Avg</span>
            <b style={styles.summaryValue}>{starText(summary.overallAverage)}</b>
          </div>
        </div>

        <div style={styles.tabRow}>
          <button type="button" onClick={() => setActiveTab("drivers")} style={activeTab === "drivers" ? styles.activeTab : styles.tabBtn}>Drivers</button>
          <button type="button" onClick={() => setActiveTab("vehicles")} style={activeTab === "vehicles" ? styles.activeTab : styles.tabBtn}>Vehicles</button>
          <button type="button" onClick={() => setActiveTab("trips")} style={activeTab === "trips" ? styles.activeTab : styles.tabBtn}>Trips</button>
        </div>

        {activeTab === "drivers" && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Driver Performance</h2>
            {driverPerformance.length === 0 ? (
              <p style={styles.emptyText}>Driver rating abhi available nahi hai.</p>
            ) : (
              driverPerformance.map((driver) => (
                <div key={driver.key} style={styles.itemCard}>
                  <div>
                    <b style={styles.itemTitle}>{driver.driver_name}</b>
                    <p style={styles.itemSub}>{driver.driver_mobile}</p>
                    <p style={styles.itemSub}>Rated Trips: {driver.trips}</p>
                  </div>
                  <div style={styles.itemRight}>
                                         <div style={styles.ratingBadge}>{starText(driver.average)}</div>
                     <button type="button" onClick={() => setSelectedDriver(driver)} style={styles.viewBtn}>View</button>
                     <button type="button" onClick={() => deleteDriverRatings(driver)} style={styles.deleteBtn}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === "vehicles" && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Vehicle Performance</h2>
            {vehiclePerformance.length === 0 ? (
              <p style={styles.emptyText}>Vehicle rating abhi available nahi hai.</p>
            ) : (
              vehiclePerformance.map((vehicle) => (
                <div key={vehicle.key} style={styles.itemCard}>
                  <div>
                    <b style={styles.itemTitle}>{vehicle.vehicle_number}</b>
                    <p style={styles.itemSub}>{vehicle.vehicle_model}</p>
                    <p style={styles.itemSub}>Rated Trips: {vehicle.trips}</p>
                  </div>
                  <div style={styles.itemRight}>
                                         <div style={styles.ratingBadge}>{starText(vehicle.average)}</div>
                     <button type="button" onClick={() => setSelectedVehicle(vehicle)} style={styles.viewBtn}>View</button>
                     <button type="button" onClick={() => deleteVehicleRatings(vehicle)} style={styles.deleteBtn}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === "trips" && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>All Trip Ratings</h2>
            {ratings.length === 0 ? (
              <p style={styles.emptyText}>Abhi koi trip rating submit nahi hui.</p>
            ) : (
              ratings.map((trip, index) => (
                <div key={trip.id || trip.booking_id || index} style={styles.itemCard}>
                  <div>
                    <b style={styles.itemTitle}>{trip.booking_id || "-"}</b>
                    <p style={styles.itemSub}>{trip.customer_name || "-"} · {trip.customer_mobile || "-"}</p>
                    <p style={styles.itemSub}>{trip.driver_name || "-"} · {trip.vehicle_number || "-"}</p>
                  </div>
                  <div style={styles.itemRight}>
                                         <div style={styles.ratingBadge}>{starText(numberValue(trip.overall_average_rating))}</div>
                     <button type="button" onClick={() => setSelectedTrip(trip)} style={styles.viewBtn}>View</button>
                     <button type="button" onClick={() => deleteTripRating(trip)} style={styles.deleteBtn}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </div>
            {(selectedDriver || selectedVehicle || selectedTrip) && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupCard}>
            <button type="button" onClick={closePopup} style={styles.closeBtn}>×</button>

            {selectedDriver && (
              <>
                <h2 style={styles.popupTitle}>{selectedDriver.driver_name}</h2>
                <p style={styles.popupSub}>{selectedDriver.driver_mobile}</p>
                <div style={styles.detailLine}><span>Driver Behaviour</span><b>{starText(selectedDriver.behaviour)}</b></div>
                <div style={styles.detailLine}><span>Driving Safety</span><b>{starText(selectedDriver.safety)}</b></div>
                <div style={styles.detailLine}><span>Pickup Timing</span><b>{starText(selectedDriver.timing)}</b></div>
                <div style={styles.detailLine}><span>Driver Communication</span><b>{starText(selectedDriver.communication)}</b></div>
                <div style={styles.detailLine}><span>Overall Driver Experience</span><b>{starText(selectedDriver.overall)}</b></div>
                <div style={styles.finalAverage}>Average: {starText(selectedDriver.average)}</div>
              </>
            )}

            {selectedVehicle && (
              <>
                <h2 style={styles.popupTitle}>{selectedVehicle.vehicle_number}</h2>
                <p style={styles.popupSub}>{selectedVehicle.vehicle_model}</p>
                <div style={styles.detailLine}><span>Vehicle Cleanliness</span><b>{starText(selectedVehicle.cleanliness)}</b></div>
                <div style={styles.detailLine}><span>Vehicle Comfort</span><b>{starText(selectedVehicle.comfort)}</b></div>
                <div style={styles.detailLine}><span>AC / Cooling</span><b>{starText(selectedVehicle.ac)}</b></div>
                <div style={styles.detailLine}><span>Seat Condition</span><b>{starText(selectedVehicle.seat)}</b></div>
                <div style={styles.detailLine}><span>Overall Vehicle Experience</span><b>{starText(selectedVehicle.overall)}</b></div>
                <div style={styles.finalAverage}>Average: {starText(selectedVehicle.average)}</div>
              </>
            )}

            {selectedTrip && (
              <>
                <h2 style={styles.popupTitle}>Trip Rating</h2>
                <p style={styles.popupSub}>{selectedTrip.booking_id || "-"}</p>

                <div style={styles.detailLine}><span>Customer</span><b>{selectedTrip.customer_name || "-"}</b></div>
                <div style={styles.detailLine}><span>Driver</span><b>{selectedTrip.driver_name || "-"}</b></div>
                <div style={styles.detailLine}><span>Vehicle</span><b>{selectedTrip.vehicle_number || "-"}</b></div>

                <div style={styles.detailLine}><span>Driver Average</span><b>{starText(numberValue(selectedTrip.driver_average_rating))}</b></div>
                <div style={styles.detailLine}><span>Vehicle Average</span><b>{starText(numberValue(selectedTrip.vehicle_average_rating))}</b></div>
                <div style={styles.detailLine}><span>Overall Average</span><b>{starText(numberValue(selectedTrip.overall_average_rating))}</b></div>

                <p style={styles.feedbackText}>
                  <b>Feedback:</b> {selectedTrip.feedback || "No feedback"}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "linear-gradient(180deg, #fff8e8 0%, #ffffff 45%, #f8fafc 100%)", padding: "18px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" },
  card: { width: "100%", maxWidth: "760px", margin: "0 auto", background: "#ffffff", borderRadius: "24px", padding: "18px", boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)", border: "1px solid rgba(15, 23, 42, 0.08)" },
  topRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" },
  brand: { margin: 0, fontSize: "14px", fontWeight: 800, color: "#f59e0b" },
  title: { margin: "4px 0", fontSize: "28px", fontWeight: 950, color: "#111827" },
  subText: { margin: 0, fontSize: "14px", color: "#64748b", fontWeight: 650 },
  backLink: { textDecoration: "none", background: "#111827", color: "#ffffff", padding: "10px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: 900 },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px", marginTop: "18px" },
  summaryBox: { background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "14px" },
  summaryLabel: { display: "block", fontSize: "12px", fontWeight: 800, color: "#64748b" },
  summaryValue: { display: "block", marginTop: "6px", fontSize: "18px", color: "#111827" },
  tabRow: { display: "flex", gap: "8px", marginTop: "18px", overflowX: "auto" },
  tabBtn: { flex: 1, border: "1px solid #e5e7eb", background: "#ffffff", color: "#111827", borderRadius: "14px", padding: "12px", fontWeight: 900 },
  activeTab: { flex: 1, border: "0", background: "#0b2d6b", color: "#ffffff", borderRadius: "14px", padding: "12px", fontWeight: 900 },
  section: { marginTop: "18px" },
  sectionTitle: { margin: "0 0 12px", fontSize: "20px", fontWeight: 950, color: "#111827" },
  emptyText: { padding: "14px", borderRadius: "14px", background: "#f8fafc", color: "#64748b", fontWeight: 700 },
  itemCard: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "18px", border: "1px solid #e5e7eb", marginBottom: "10px", background: "#ffffff" },
  itemTitle: { display: "block", fontSize: "16px", color: "#111827" },
  itemSub: { margin: "4px 0 0", fontSize: "13px", color: "#64748b", fontWeight: 650 },
  itemRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" },
  ratingBadge: { background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa", padding: "7px 10px", borderRadius: "999px", fontSize: "13px", fontWeight: 950, whiteSpace: "nowrap" },
  viewBtn: { border: 0, background: "#111827", color: "#ffffff", padding: "8px 13px", borderRadius: "999px", fontSize: "13px", fontWeight: 900 },
    deleteBtn: { border: "1px solid #fecaca", background: "#fff1f2", color: "#b91c1c", padding: "8px 13px", borderRadius: "999px", fontSize: "13px", fontWeight: 900 },
  error: { marginTop: "14px", padding: "12px", borderRadius: "14px", background: "#fef2f2", color: "#b91c1c", fontSize: "14px", fontWeight: 700 },
  popupOverlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: "18px", zIndex: 9999 },
  popupCard: { width: "100%", maxWidth: "420px", background: "#ffffff", borderRadius: "24px", padding: "20px", position: "relative", boxShadow: "0 25px 70px rgba(0,0,0,0.25)" },
  closeBtn: { position: "absolute", top: "12px", right: "14px", border: 0, background: "#f1f5f9", width: "34px", height: "34px", borderRadius: "999px", fontSize: "22px", fontWeight: 900 },
  popupTitle: { margin: "0 42px 4px 0", fontSize: "22px", fontWeight: 950, color: "#111827" },
  popupSub: { margin: "0 0 14px", color: "#64748b", fontWeight: 700 },
  detailLine: { display: "flex", justifyContent: "space-between", gap: "12px", padding: "10px 0", borderBottom: "1px dashed #e5e7eb", fontSize: "14px", color: "#334155" },
  finalAverage: { marginTop: "14px", padding: "12px", borderRadius: "14px", background: "#ecfdf5", color: "#166534", fontWeight: 950, textAlign: "center" },
  feedbackText: { marginTop: "14px", padding: "12px", borderRadius: "14px", background: "#f8fafc", color: "#334155", fontSize: "14px", lineHeight: 1.5 },
};
