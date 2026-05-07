"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const res = await fetch(
      `${supabaseUrl}/rest/v1/bookings?select=*`,
      {
        headers: {
          apikey: supabaseKey || "",
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    const data = await res.json();
    setBookings(data.reverse());
  }

  const filtered = bookings.filter((b) =>
    JSON.stringify(b)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main
      style={{
        padding: 20,
        background: "#f1f5f9",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      <h1>Vishwakarma Travels Dashboard</h1>

      <input
        placeholder="Search booking..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 20,
          borderRadius: 10,
          border: "1px solid #ccc",
        }}
      />

      <div
        style={{
          display: "grid",
          gap: 15,
        }}
      >
        {filtered.map((b, i) => (
          <div
            key={i}
            style={{
              background: "white",
              padding: 15,
              borderRadius: 14,
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h3>{b.customer_name}</h3>

            <p>📞 {b.mobile}</p>
            <p>🚖 {b.service}</p>
            <p>📍 {b.pickup}</p>
            <p>🏁 {b.drop_location}</p>
            <p>📅 {b.booking_date}</p>
            <p>💰 {b.fare}</p>
            <p>📌 {b.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
