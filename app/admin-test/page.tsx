"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

type Booking = {
  booking_id?: string;
  customer_name?: string;
  customer_phone?: string;
  pickup?: string;
  drop_location?: string;
  journey_date?: string;
  journey_time?: string;
  vehicle_number?: string;
  fare?: number;
  advance?: number;
  net_payable?: number;
  driver_name?: string;
  driver_mobile?: string;
};

type View = "dashboard" | "bookings";

function cleanPhone(value = "") {
  let phone = String(value).replace(/\D/g, "");
  if (phone.startsWith("91") && phone.length === 12) phone = phone.slice(2);
  return phone.slice(0, 10);
}

function formatDate(value?: string) {
  return value?.includes("-") ? value.split("-").reverse().join("-") : value || "-";
}

export default function AdminTestPage() {
  const [view, setView] = useState<View>("dashboard");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [saving, setSaving] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const headers = useMemo(
    () => ({
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    }),
    [supabaseKey]
  );

  async function loadBookings() {
    if (!supabaseUrl || !supabaseKey) return;
    const response = await fetch(
      `${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc&limit=100`,
      { headers }
    );
    if (response.ok) setBookings(await response.json());
  }

  useEffect(() => {
    loadBookings();
  }, [supabaseUrl, supabaseKey, headers]);

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing?.booking_id) return alert("Booking ID missing hai.");

    const fare = Number(editing.fare || 0);
    const advance = Number(editing.advance || 0);
    const payload = {
      customer_name: editing.customer_name || "",
      customer_phone: cleanPhone(editing.customer_phone || ""),
      pickup: editing.pickup || "",
      drop_location: editing.drop_location || "",
      journey_date: editing.journey_date || "",
      journey_time: editing.journey_time || "",
      vehicle_number: editing.vehicle_number || "",
      fare,
      advance,
      net_payable: fare - advance,
      driver_name: editing.driver_name || "",
      driver_mobile: cleanPhone(editing.driver_mobile || ""),
    };

    setSaving(true);
    const response = await fetch(
      `${supabaseUrl}/rest/v1/bookings?booking_id=eq.${encodeURIComponent(editing.booking_id)}`,
      { method: "PATCH", headers, body: JSON.stringify(payload) }
    );
    setSaving(false);

    if (!response.ok) {
      console.log(await response.text());
      alert("Update nahi hua. Supabase policy/table check karo.");
      return;
    }

    setBookings((previous) =>
      previous.map((booking) =>
        booking.booking_id === editing.booking_id
          ? { ...booking, ...payload, booking_id: editing.booking_id }
          : booking
      )
    );
    setEditing(null);
    alert("Booking updated.");
  }

  async function removeBooking(bookingId?: string) {
    if (!bookingId) return alert("Booking ID missing hai.");
    if (!window.confirm(`${bookingId} delete karna hai?`)) return;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/bookings?booking_id=eq.${encodeURIComponent(bookingId)}`,
      { method: "DELETE", headers }
    );

    if (!response.ok) {
      console.log(await response.text());
      alert("Delete nahi hua. Supabase policy check karo.");
      return;
    }

    setBookings((previous) => previous.filter((booking) => booking.booking_id !== bookingId));
    alert("Booking deleted.");
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logo}>✦</div>
        <div>
          <h1 style={{ margin: 0 }}>Vishwakarma Travels</h1>
          <p style={{ margin: "6px 0 0" }}>Admin Test - Edit / Remove Booking</p>
        </div>
      </header>

      <section style={styles.hero}>
        <div>
          <h2 style={{ margin: 0 }}>Hello, Admin 👋</h2>
          <p style={{ color: "#526079", fontWeight: 700 }}>Yeh test page hai. Main live admin safe hai.</p>
        </div>
        <button style={styles.primaryButton} onClick={() => setView("bookings")}>View Bookings</button>
      </section>

      {view === "dashboard" && (
        <section style={styles.grid}>
          <button style={styles.statCard} onClick={() => setView("bookings")}>
            <span style={styles.statIcon}>▣</span>
            <b>Total Bookings</b>
            <strong style={styles.statNumber}>{bookings.length}</strong>
            <span style={{ color: "#2563eb", fontWeight: 900 }}>View all ›</span>
          </button>
          <button style={styles.actionCard} onClick={() => setView("bookings")}>Edit Bills</button>
        </section>
      )}

      {view === "bookings" && (
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={{ margin: 0 }}>Saved Bills / Bookings</h2>
            <button style={styles.linkButton} onClick={() => setView("dashboard")}>Back</button>
          </div>

          {bookings.map((booking) => (
            <div key={booking.booking_id} style={styles.row}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <b>{booking.booking_id || "Booking"}</b>
                <p>{booking.customer_name || "-"} | {booking.customer_phone || "-"}</p>
                <p>{booking.pickup || "-"} → {booking.drop_location || "-"}</p>
                <p>{formatDate(booking.journey_date)} | {booking.vehicle_number || "-"}</p>
                <b>₹{Number(booking.net_payable || booking.fare || 0).toLocaleString("en-IN")}</b>
              </div>
              <div style={styles.rowButtons}>
                <button style={styles.editButton} onClick={() => setEditing({ ...booking })}>Edit</button>
                <button style={styles.deleteButton} onClick={() => removeBooking(booking.booking_id)}>Remove</button>
              </div>
            </div>
          ))}

          {bookings.length === 0 && <p>Booking data load nahi hua. Preview env variables check karo.</p>}
        </section>
      )}

      {editing && (
        <div style={styles.overlay}>
          <form style={styles.modal} onSubmit={saveEdit}>
            <div style={styles.cardHeader}>
              <h2 style={{ margin: 0 }}>Edit Bill</h2>
              <button type="button" style={styles.linkButton} onClick={() => setEditing(null)}>Close</button>
            </div>
            <Input label="Customer Name" value={editing.customer_name || ""} onChange={(value) => setEditing({ ...editing, customer_name: value })} />
            <Input label="Mobile" value={editing.customer_phone || ""} onChange={(value) => setEditing({ ...editing, customer_phone: cleanPhone(value) })} />
            <Input label="Pickup" value={editing.pickup || ""} onChange={(value) => setEditing({ ...editing, pickup: value })} />
            <Input label="Drop" value={editing.drop_location || ""} onChange={(value) => setEditing({ ...editing, drop_location: value })} />
            <Input label="Date" type="date" value={editing.journey_date || ""} onChange={(value) => setEditing({ ...editing, journey_date: value })} />
            <Input label="Time" value={editing.journey_time || ""} onChange={(value) => setEditing({ ...editing, journey_time: value })} />
            <Input label="Vehicle No" value={editing.vehicle_number || ""} onChange={(value) => setEditing({ ...editing, vehicle_number: value.toUpperCase() })} />
            <Input label="Fare" type="number" value={String(editing.fare || 0)} onChange={(value) => setEditing({ ...editing, fare: Number(value) })} />
            <Input label="Advance" type="number" value={String(editing.advance || 0)} onChange={(value) => setEditing({ ...editing, advance: Number(value) })} />
            <Input label="Driver Name" value={editing.driver_name || ""} onChange={(value) => setEditing({ ...editing, driver_name: value })} />
            <Input label="Driver Mobile" value={editing.driver_mobile || ""} onChange={(value) => setEditing({ ...editing, driver_mobile: cleanPhone(value) })} />
            <button disabled={saving} style={styles.saveButton}>{saving ? "Saving..." : "Save Update"}</button>
          </form>
        </div>
      )}
    </main>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; type?: string; onChange: (value: string) => void }) {
  return (
    <label style={styles.label}>
      <span>{label}</span>
      <input style={styles.input} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8fbff", color: "#07142f", fontFamily: "Arial, sans-serif", padding: 16 },
  header: { background: "linear-gradient(135deg,#071733,#0b2c63)", color: "white", borderRadius: 22, padding: 20, display: "flex", alignItems: "center", gap: 14 },
  logo: { width: 58, height: 58, border: "2px solid #fbbf24", borderRadius: 999, display: "grid", placeItems: "center", color: "#fbbf24", fontSize: 30 },
  hero: { margin: "18px 0", background: "white", borderRadius: 18, padding: 18, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" as const, boxShadow: "0 10px 30px rgba(15,23,42,.06)" },
  primaryButton: { border: 0, borderRadius: 14, padding: "13px 18px", background: "#2563eb", color: "white", fontWeight: 900 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 },
  statCard: { background: "white", border: "1px solid #e3eaf4", borderRadius: 18, padding: 20, textAlign: "left" as const, display: "flex", flexDirection: "column" as const, gap: 12, boxShadow: "0 10px 30px rgba(15,23,42,.06)" },
  statIcon: { width: 54, height: 54, borderRadius: 16, background: "#eef5ff", display: "grid", placeItems: "center", color: "#2563eb", fontSize: 30 },
  statNumber: { fontSize: 42 },
  actionCard: { background: "#eef5ff", border: 0, borderRadius: 18, padding: 20, color: "#2563eb", fontWeight: 900, fontSize: 20 },
  card: { background: "white", borderRadius: 18, padding: 16, boxShadow: "0 10px 30px rgba(15,23,42,.06)" },
  cardHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 },
  linkButton: { border: 0, background: "transparent", color: "#2563eb", fontWeight: 900, fontSize: 16 },
  row: { borderTop: "1px solid #e3eaf4", padding: "15px 0", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" as const },
  rowButtons: { display: "flex", gap: 10, flexWrap: "wrap" as const },
  editButton: { border: 0, borderRadius: 12, padding: "12px 16px", background: "#eef5ff", color: "#2563eb", fontWeight: 900 },
  deleteButton: { border: 0, borderRadius: 12, padding: "12px 16px", background: "#fff1f2", color: "#ef4444", fontWeight: 900 },
  overlay: { position: "fixed" as const, inset: 0, background: "rgba(2,6,23,.62)", display: "grid", placeItems: "center", padding: 16, zIndex: 50 },
  modal: { width: "100%", maxWidth: 620, maxHeight: "88vh", overflowY: "auto" as const, background: "white", borderRadius: 18, padding: 18 },
  label: { display: "flex", flexDirection: "column" as const, gap: 6, fontWeight: 800, marginBottom: 10 },
  input: { width: "100%", boxSizing: "border-box" as const, border: "1px solid #dbe3ef", borderRadius: 12, padding: 12, fontSize: 16 },
  saveButton: { width: "100%", border: 0, borderRadius: 14, padding: 14, marginTop: 10, background: "#22c55e", color: "white", fontWeight: 900, fontSize: 16 },
};
