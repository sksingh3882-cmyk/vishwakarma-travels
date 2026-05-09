"use client";

import { useEffect, useMemo, useState } from "react";

type Booking = {
  booking_id?: string;
  customer_name?: string;
  customer_phone?: string;
  pickup?: string;
  drop_location?: string;
  journey_date?: string;
  vehicle_type?: string;
  vehicle_model?: string;
  vehicle_number?: string;
  fare?: number;
  advance?: number;
  created_at?: string;
};

function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function num(value: unknown) {
  return Number(value || 0);
}

function getDate(booking: Booking) {
  const raw =
  booking.created_at ||
  booking.journey_date ||
  "";
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function VehicleReportsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("ALL");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const headers = useMemo(
    () => ({
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    }),
    [supabaseKey]
  );

  useEffect(() => {
    async function load() {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc&limit=2000`,
        { headers }
      );

      if (response.ok) {
        setBookings(await response.json());
      }
    }

    if (supabaseUrl && supabaseKey) load();
  }, [supabaseUrl, supabaseKey, headers]);

  const vehicleList = Array.from(
    new Set(
      bookings
        .map((b) => b.vehicle_number || "")
        .filter(Boolean)
    )
  );

  const filtered = selectedVehicle === "ALL"
    ? bookings
    : bookings.filter((b) => b.vehicle_number === selectedVehicle);

  const today = new Date();

  const todayBookings = filtered.filter((b) => {
    const d = getDate(b);
    return d && d.toDateString() === today.toDateString();
  });

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthBookings = filtered.filter((b) => {
    const d = getDate(b);
    return d && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const yearBookings = filtered.filter((b) => {
    const d = getDate(b);
    return d && d.getFullYear() === currentYear;
  });

  return (
    <main style={{ minHeight: "100vh", background: "#f1f5f9", padding: 16 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <header style={{ background: "#0b2d6b", color: "white", padding: 20, borderRadius: 18, marginBottom: 16 }}>
          <h1 style={{ margin: 0 }}>Vehicle Performance Dashboard</h1>
          <p>Daily • Monthly • Yearly Vehicle Business Report</p>
        </header>

        <section style={{ background: "white", padding: 16, borderRadius: 18, marginBottom: 16 }}>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            style={{ padding: 12, borderRadius: 12, width: "100%" }}
          >
            <option value="ALL">All Vehicles</option>
            {vehicleList.map((vehicle) => (
              <option key={vehicle}>{vehicle}</option>
            ))}
          </select>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 16 }}>
          <Card title="Today Business" value={money(todayBookings.reduce((s,b)=>s+num(b.fare),0))} sub={`${todayBookings.length} bookings`} />
          <Card title="Monthly Business" value={money(monthBookings.reduce((s,b)=>s+num(b.fare),0))} sub={`${monthBookings.length} bookings`} />
          <Card title="Yearly Business" value={money(yearBookings.reduce((s,b)=>s+num(b.fare),0))} sub={`${yearBookings.length} bookings`} />
        </section>

        <section style={{ background: "white", padding: 16, borderRadius: 18 }}>
          <h2 style={{ color: "#0b2d6b" }}>Complete Booking History</h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
              <thead>
                <tr style={{ background: "#0b2d6b", color: "white" }}>
                  <th style={th}>Date</th>
                  <th style={th}>Customer</th>
                  <th style={th}>Vehicle</th>
                  <th style={th}>Route</th>
                  <th style={th}>Fare</th>
                  <th style={th}>Advance</th>
                  <th style={th}>Pending</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => {
                  const fare = num(b.fare);
                  const advance = num(b.advance);
                  return (
                    <tr key={b.booking_id || i}>
                      <td style={td}>{b.journey_date || "-"}</td>
                      <td style={td}>{b.customer_name || "-"}</td>
                      <td style={td}>{b.vehicle_number || "-"}</td>
                      <td style={td}>{b.pickup || "-"} → {b.drop_location || "-"}</td>
                      <td style={td}>{money(fare)}</td>
                      <td style={td}>{money(advance)}</td>
                      <td style={td}>{money(Math.max(fare - advance,0))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div style={{ background: "white", padding: 16, borderRadius: 18 }}>
      <p style={{ margin: 0, color: "#64748b" }}>{title}</p>
      <h2 style={{ color: "#0b2d6b" }}>{value}</h2>
      <p>{sub}</p>
    </div>
  );
}

const th: React.CSSProperties = { padding: 10, textAlign: "left" };
const td: React.CSSProperties = { padding: 10, borderBottom: "1px solid #e2e8f0" };
