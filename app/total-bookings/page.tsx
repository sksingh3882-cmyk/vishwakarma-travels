"use client";

import { useEffect, useMemo, useState } from "react";

type Booking = {
  booking_id?: string;
  customer_name?: string;
  journey_date?: string;
  service?: string;
  fare?: number;
  vehicle_number?: string;
  driver_name?: string;
  created_at?: string;
};

function money(value: unknown) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function TotalBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

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
    async function loadBookings() {
      if (!supabaseUrl || !supabaseKey) return;

      const response = await fetch(
        `${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc&limit=5000`,
        { headers }
      );

      if (response.ok) {
        setBookings(await response.json());
      }
    }

    loadBookings();
  }, [supabaseUrl, supabaseKey, headers]);

  return (
    <main style={{ minHeight: "100vh", background: "#f1f5f9", padding: 16 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <header
          style={{
            background: "#0b2d6b",
            color: "white",
            padding: 20,
            borderRadius: 18,
            marginBottom: 16,
          }}
        >
          <h1 style={{ margin: 0 }}>Total Booking Report</h1>
          <p style={{ margin: "6px 0 0" }}>
            Complete Booking History & Bill Records
          </p>
        </header>

        <section style={{ background: "white", padding: 18, borderRadius: 18 }}>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 1100,
              }}
            >
              <thead>
                <tr style={{ background: "#0b2d6b", color: "white" }}>
                  <th style={th}>S.No</th>
                  <th style={th}>Customer Name</th>
                  <th style={th}>Booking Date</th>
                  <th style={th}>Service</th>
                  <th style={th}>Amount</th>
                  <th style={th}>Vehicle No</th>
                  <th style={th}>Driver Name</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.booking_id || index}>
                    <td style={td}>{index + 1}</td>
                    <td style={td}>{booking.customer_name || "-"}</td>
                    <td style={td}>{booking.journey_date || "-"}</td>
                    <td style={td}>{booking.service || "-"}</td>
                    <td style={td}>{money(booking.fare)}</td>
                    <td style={td}>{booking.vehicle_number || "-"}</td>
                    <td style={td}>{booking.driver_name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

const th: React.CSSProperties = {
  padding: 12,
  textAlign: "left",
};

const td: React.CSSProperties = {
  padding: 12,
  borderBottom: "1px solid #e2e8f0",
};
