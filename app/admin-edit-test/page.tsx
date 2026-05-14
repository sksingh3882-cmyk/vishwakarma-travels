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

function cleanPhone(v = "") {
  let p = String(v).replace(/\D/g, "");
  if (p.startsWith("91") && p.length === 12) p = p.slice(2);
  return p.slice(0, 10);
}

export default function AdminEditTestPage() {
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
    const res = await fetch(
      `${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc&limit=50`,
      { headers }
    );
    if (res.ok) setBookings(await res.json());
  }

  useEffect(() => {
    loadBookings();
  }, [supabaseUrl, supabaseKey, headers]);

  async function saveEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    const res = await fetch(
      `${supabaseUrl}/rest/v1/bookings?booking_id=eq.${encodeURIComponent(editing.booking_id)}`,
      { method: "PATCH", headers, body: JSON.stringify(payload) }
    );
    setSaving(false);

    if (!res.ok) {
      console.log(await res.text());
      alert("Update nahi hua. Supabase policy/table check karo.");
      return;
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.booking_id === editing.booking_id ? { ...b, ...payload, booking_id: editing.booking_id } : b
      )
    );
    setEditing(null);
    alert("Booking updated.");
  }

  async function removeBooking(id?: string) {
    if (!id) return alert("Booking ID missing hai.");
    if (!confirm(`${id} ko remove karna hai?`)) return;

    const res = await fetch(
      `${supabaseUrl}/rest/v1/bookings?booking_id=eq.${encodeURIComponent(id)}`,
      { method: "DELETE", headers }
    );

    if (!res.ok) {
      console.log(await res.text());
      alert("Remove nahi hua. Supabase policy check karo.");
      return;
    }

    setBookings((prev) => prev.filter((b) => b.booking_id !== id));
    alert("Booking removed.");
  }

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <h1>Booking Edit Test</h1>
        <p>Ye sirf test page hai. Main admin page safe hai.</p>
      </section>

      <section style={styles.card}>
        <h2>Saved Bills / Bookings</h2>
        {bookings.map((b) => (
          <div key={b.booking_id} style={styles.row}>
            <div>
              <b>{b.booking_id}</b>
              <p>{b.customer_name} | {b.customer_phone}</p>
              <p>{b.pickup} → {b.drop_location}</p>
              <p>₹{Number(b.net_payable || b.fare || 0).toLocaleString("en-IN")}</p>
            </div>
            <div style={styles.actions}>
              <button style={styles.editBtn} onClick={() => setEditing({ ...b })}>Edit</button>
              <button style={styles.removeBtn} onClick={() => removeBooking(b.booking_id)}>Remove</button>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p>No booking found.</p>}
      </section>

      {editing && (
        <div style={styles.overlay}>
          <form style={styles.modal} onSubmit={saveEdit}>
            <h2>Edit Bill</h2>
            <Input label="Customer Name" value={editing.customer_name || ""} onChange={(v) => setEditing({ ...editing, customer_name: v })} />
            <Input label="Mobile" value={editing.customer_phone || ""} onChange={(v) => setEditing({ ...editing, customer_phone: cleanPhone(v) })} />
            <Input label="Pickup" value={editing.pickup || ""} onChange={(v) => setEditing({ ...editing, pickup: v })} />
            <Input label="Drop" value={editing.drop_location || ""} onChange={(v) => setEditing({ ...editing, drop_location: v })} />
            <Input label="Date" type="date" value={editing.journey_date || ""} onChange={(v) => setEditing({ ...editing, journey_date: v })} />
            <Input label="Time" value={editing.journey_time || ""} onChange={(v) => setEditing({ ...editing, journey_time: v })} />
            <Input label="Vehicle No" value={editing.vehicle_number || ""} onChange={(v) => setEditing({ ...editing, vehicle_number: v.toUpperCase() })} />
            <Input label="Fare" type="number" value={String(editing.fare || 0)} onChange={(v) => setEditing({ ...editing, fare: Number(v) })} />
            <Input label="Advance" type="number" value={String(editing.advance || 0)} onChange={(v) => setEditing({ ...editing, advance: Number(v) })} />
            <Input label="Driver Name" value={editing.driver_name || ""} onChange={(v) => setEditing({ ...editing, driver_name: v })} />
            <Input label="Driver Mobile" value={editing.driver_mobile || ""} onChange={(v) => setEditing({ ...editing, driver_mobile: cleanPhone(v) })} />
            <div style={styles.actions}>
              <button type="submit" style={styles.saveBtn}>{saving ? "Saving..." : "Save Update"}</button>
              <button type="button" style={styles.cancelBtn} onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; type?: string; onChange: (v: string) => void }) {
  return (
    <label style={styles.label}>
      <span>{label}</span>
      <input style={styles.input} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8fbff", padding: 16, fontFamily: "Arial, sans-serif", color: "#07142f" },
  header: { background: "#081936", color: "white", borderRadius: 18, padding: 18, marginBottom: 16 },
  card: { background: "white", borderRadius: 18, padding: 16, boxShadow: "0 10px 30px rgba(15,23,42,.08)" },
  row: { borderTop: "1px solid #e3eaf4", padding: "14px 0", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" as const },
  actions: { display: "flex", gap: 10, flexWrap: "wrap" as const },
  editBtn: { border: 0, background: "#eef5ff", color: "#2563eb", borderRadius: 10, padding: "10px 14px", fontWeight: 900 },
  removeBtn: { border: 0, background: "#fff1f2", color: "#ef4444", borderRadius: 10, padding: "10px 14px", fontWeight: 900 },
  overlay: { position: "fixed" as const, inset: 0, background: "rgba(2,6,23,.62)", padding: 16, display: "grid", placeItems: "center", zIndex: 50 },
  modal: { width: "100%", maxWidth: 620, maxHeight: "88vh", overflowY: "auto" as const, background: "white", borderRadius: 18, padding: 18 },
  label: { display: "flex", flexDirection: "column" as const, gap: 6, fontWeight: 800, marginBottom: 10 },
  input: { width: "100%", boxSizing: "border-box" as const, border: "1px solid #dbe3ef", borderRadius: 12, padding: 12, fontSize: 16 },
  saveBtn: { border: 0, background: "#22c55e", color: "white", borderRadius: 12, padding: "12px 16px", fontWeight: 900 },
  cancelBtn: { border: 0, background: "#e2e8f0", color: "#07142f", borderRadius: 12, padding: "12px 16px", fontWeight: 900 },
};
