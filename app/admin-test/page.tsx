"use client";

import { useEffect, useMemo, useState } from "react";

type Customer = { name?: string; mobile?: string; address?: string };
type Vehicle = { vehicleNumber?: string; vehicleType?: string; vehicleModel?: string; driverName?: string; driverMobile?: string };
type Booking = { booking_id?: string; customer_name?: string; customer_phone?: string; drop_location?: string; journey_date?: string; vehicle_number?: string; fare?: number; net_payable?: number; driver_name?: string; driver_mobile?: string };
type View = "dashboard" | "bookings" | "vehicles" | "drivers" | "customers" | "new" | "more";

const colors = { navy: "#081936", blue: "#2563eb", green: "#22c55e", orange: "#f97316", purple: "#8b5cf6", red: "#ef4444", text: "#07142f", muted: "#526079", border: "#e3eaf4", bg: "#f8fbff" };

function cleanPhone(v = "") {
  let p = String(v).replace(/\D/g, "");
  if (p.startsWith("91") && p.length === 12) p = p.slice(2);
  return p.slice(0, 10);
}

function formatDate(v?: string) {
  return v?.includes("-") ? v.split("-").reverse().join("-") : v || "-";
}

export default function AdminTestPage() {
  const [view, setView] = useState<View>("dashboard");
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const headers = useMemo(() => ({ apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }), [supabaseKey]);

  useEffect(() => {
    async function load() {
      if (!supabaseUrl || !supabaseKey) return;
      try {
        const [c, v, b] = await Promise.all([
          fetch(`${supabaseUrl}/rest/v1/customers?select=*`, { headers }),
          fetch(`${supabaseUrl}/rest/v1/vehicles?select=*`, { headers }),
          fetch(`${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc&limit=100`, { headers }),
        ]);
        if (c.ok) setCustomers(await c.json());
        if (v.ok) setVehicles(await v.json());
        if (b.ok) setBookings(await b.json());
      } catch (e) {
        console.log("admin-test load error", e);
      }
    }
    load();
  }, [supabaseUrl, supabaseKey, headers]);

  const drivers = useMemo(() => {
    const data = new Map<string, { name: string; mobile: string; vehicle: string }>();
    vehicles.forEach((v) => {
      const name = v.driverName || "";
      const mobile = cleanPhone(v.driverMobile || "");
      if (name || mobile) data.set(`${name}-${mobile}`, { name, mobile, vehicle: v.vehicleNumber || "" });
    });
    bookings.forEach((b) => {
      const name = b.driver_name || "";
      const mobile = cleanPhone(b.driver_mobile || "");
      if (name || mobile) data.set(`${name}-${mobile}`, { name, mobile, vehicle: b.vehicle_number || "" });
    });
    return Array.from(data.values());
  }, [vehicles, bookings]);

  function go(next: View) {
    setSearch("");
    setView(next);
  }

  const q = search.toLowerCase();
  const shownBookings = bookings.filter((b) => `${b.booking_id} ${b.customer_name} ${b.vehicle_number} ${b.drop_location}`.toLowerCase().includes(q));
  const shownVehicles = vehicles.filter((v) => `${v.vehicleNumber} ${v.vehicleType} ${v.vehicleModel} ${v.driverName}`.toLowerCase().includes(q));
  const shownCustomers = customers.filter((c) => `${c.name} ${c.mobile} ${c.address}`.toLowerCase().includes(q));
  const shownDrivers = drivers.filter((d) => `${d.name} ${d.mobile} ${d.vehicle}`.toLowerCase().includes(q));

  return (
    <main style={s.page}>
      <header style={s.top}>
        <button style={s.menu} onClick={() => go("dashboard")}>☰</button>
        <div style={s.logoRound}>✦</div>
        <div><div style={s.brand}>VISHWAKARMA</div><div style={s.brandSmall}>TRAVELS</div></div>
        <div style={s.topRight}><div style={s.bell}>🔔<span style={s.badge}>3</span></div><div style={s.avatar}>A</div><b>Admin⌄</b></div>
      </header>

      <section style={s.hero}>
        <div><h1 style={s.h1}>Hello, Admin 👋</h1><p style={s.heroText}>Welcome back! Manage your bookings and operations.</p></div>
        <button style={s.date}>📅 {new Date().toLocaleDateString("en-GB")}</button>
      </section>

      {view === "dashboard" && (
        <>
          <section style={s.panel}>
            <h2 style={s.title}>Quick Actions</h2>
            <div style={s.quickGrid}>
              <Quick icon="▣" label="New Booking" color={colors.blue} bg="#eef5ff" onClick={() => go("new")} />
              <Quick icon="▰" label="Add Vehicle" color={colors.green} bg="#eefbf3" onClick={() => go("vehicles")} />
              <Quick icon="◉" label="Add Driver" color={colors.orange} bg="#fff4e8" onClick={() => go("drivers")} />
              <Quick icon="◍" label="Add Customer" color={colors.purple} bg="#f6f0ff" onClick={() => go("customers")} />
            </div>
          </section>

          <section style={s.stats}>
            <Stat icon="▣" label="Total Bookings" value={bookings.length} color={colors.blue} onClick={() => go("bookings")} />
            <Stat icon="▰" label="Total Vehicles" value={vehicles.length} color={colors.green} onClick={() => go("vehicles")} />
            <Stat icon="◉" label="Total Drivers" value={drivers.length} color={colors.orange} onClick={() => go("drivers")} />
            <Stat icon="◍" label="Total Customers" value={customers.length} color={colors.purple} onClick={() => go("customers")} />
          </section>

          <section style={s.panel}>
            <div style={s.head}><h2 style={s.title}>Recent Bookings</h2><button style={s.link} onClick={() => go("bookings")}>View all</button></div>
            {bookings.slice(0, 5).map((b, i) => <BookingRow key={i} booking={b} index={i} />)}
            {bookings.length === 0 && <Empty text="Booking data abhi load nahi hua ya Supabase env preview me missing hai." />}
          </section>
        </>
      )}

      {view !== "dashboard" && (
        <section style={s.panel}>
          <div style={s.head}><h2 style={s.title}>{viewTitle(view)}</h2><button style={s.link} onClick={() => go("dashboard")}>Back</button></div>
          {view !== "new" && view !== "more" && <input style={s.input} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />}
          {view === "new" && <FormBox title="New Booking Test" text="Is button ko old admin booking form se connect karna next step hai. Abhi yahan se dashboard flow test ho raha hai." />}
          {view === "bookings" && shownBookings.map((b, i) => <BookingRow key={i} booking={b} index={i} />)}
          {view === "vehicles" && shownVehicles.map((v, i) => <Info key={i} title={v.vehicleNumber || "Vehicle"} line1={`${v.vehicleType || ""} ${v.vehicleModel || ""}`} line2={`Driver: ${v.driverName || "-"} | ${v.driverMobile || "-"}`} />)}
          {view === "drivers" && shownDrivers.map((d, i) => <Info key={i} title={d.name || "Driver"} line1={`Mobile: ${d.mobile || "-"}`} line2={`Vehicle: ${d.vehicle || "-"}`} />)}
          {view === "customers" && shownCustomers.map((c, i) => <Info key={i} title={c.name || "Customer"} line1={`Mobile: ${c.mobile || "-"}`} line2={`Address: ${c.address || "-"}`} />)}
          {view === "more" && <FormBox title="More Options" text="Reports, document alerts, settings aur logout yahan add honge." />}
        </section>
      )}

      <nav style={s.bottom}>
        <Nav active={view === "dashboard"} icon="⌂" label="Dashboard" onClick={() => go("dashboard")} />
        <Nav active={view === "bookings"} icon="▣" label="Bookings" onClick={() => go("bookings")} />
        <Nav active={view === "vehicles"} icon="▰" label="Vehicles" onClick={() => go("vehicles")} />
        <Nav active={view === "drivers"} icon="◉" label="Drivers" onClick={() => go("drivers")} />
        <Nav active={view === "more"} icon="•••" label="More" onClick={() => go("more")} />
      </nav>
    </main>
  );
}

function Quick(p: { icon: string; label: string; color: string; bg: string; onClick: () => void }) {
  return <button onClick={p.onClick} style={{ ...s.quick, background: p.bg }}><span style={{ color: p.color, fontSize: 42 }}>{p.icon}</span><b>{p.label}</b></button>;
}

function Stat(p: { icon: string; label: string; value: number; color: string; onClick: () => void }) {
  return <button onClick={p.onClick} style={s.stat}><span style={{ ...s.statIcon, color: p.color }}>{p.icon}</span><span style={s.statLabel}>{p.label}</span><strong style={s.statValue}>{p.value}</strong><b style={s.viewAll}>View all ›</b></button>;
}

function BookingRow({ booking, index }: { booking: Booking; index: number }) {
  const palette = [colors.green, colors.blue, colors.orange, colors.purple, colors.red];
  const c = palette[index % palette.length];
  return <div style={s.row}><span style={{ ...s.rowIcon, background: `${c}16`, color: c }}>▣</span><div style={s.cell}><b>{booking.booking_id || "Booking"}</b><p>{booking.customer_name || "-"}</p></div><div style={s.cell}><b>{booking.vehicle_number || "-"}</b><p>{formatDate(booking.journey_date)}</p></div><b style={s.amount}>₹{Number(booking.net_payable || booking.fare || 0).toLocaleString("en-IN")}</b><span style={s.status}>Confirmed</span><b style={s.arrow}>›</b></div>;
}

function Info(p: { title: string; line1: string; line2: string }) {
  return <div style={s.info}><b>{p.title}</b><p>{p.line1}</p><p>{p.line2}</p></div>;
}

function FormBox(p: { title: string; text: string }) {
  return <div style={s.formBox}><h3>{p.title}</h3><p>{p.text}</p></div>;
}

function Empty({ text }: { text: string }) {
  return <p style={s.empty}>{text}</p>;
}

function Nav(p: { active: boolean; icon: string; label: string; onClick: () => void }) {
  return <button onClick={p.onClick} style={{ ...s.nav, background: p.active ? "#eef5ff" : "white", color: p.active ? colors.blue : "#4d5870" }}><span style={{ fontSize: 30 }}>{p.icon}</span><b>{p.label}</b></button>;
}

function viewTitle(v: View) {
  return { dashboard: "Dashboard", bookings: "All Bookings", vehicles: "All Vehicles", drivers: "All Drivers", customers: "All Customers", new: "New Booking", more: "More" }[v];
}

const s = {
  page: { minHeight: "100vh", background: colors.bg, color: colors.text, fontFamily: "Arial, sans-serif", paddingBottom: 112 },
  top: { background: "linear-gradient(135deg,#071733,#0b2c63)", color: "white", padding: "26px 30px", display: "flex", alignItems: "center", gap: 16, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, boxShadow: "0 12px 34px rgba(8,25,54,.22)" },
  menu: { border: 0, background: "transparent", color: "white", fontSize: 36, cursor: "pointer" },
  logoRound: { width: 64, height: 64, border: "2px solid #fbbf24", borderRadius: 999, display: "grid", placeItems: "center", color: "#fbbf24", fontSize: 34 },
  brand: { color: "#fbbf24", fontSize: 24, fontWeight: 900, letterSpacing: .5 },
  brandSmall: { color: "white", fontSize: 18, fontWeight: 900, letterSpacing: 5 },
  topRight: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 },
  bell: { position: "relative" as const, fontSize: 28 },
  badge: { position: "absolute" as const, right: -7, top: -7, background: "#ff5a65", color: "white", borderRadius: 999, padding: "3px 7px", fontSize: 12, fontWeight: 900 },
  avatar: { width: 54, height: 54, borderRadius: 999, background: "linear-gradient(135deg,#8b5cf6,#d8b4fe)", display: "grid", placeItems: "center", fontSize: 26, fontWeight: 900 },
  hero: { padding: "34px 30px 24px", display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", flexWrap: "wrap" as const },
  h1: { margin: 0, fontSize: 34, letterSpacing: -.7 },
  heroText: { color: colors.muted, fontWeight: 700, marginTop: 12, fontSize: 17 },
  date: { background: "white", border: `1px solid ${colors.border}`, borderRadius: 18, padding: "17px 22px", fontWeight: 900, color: colors.text, boxShadow: "0 8px 22px rgba(15,23,42,.06)" },
  panel: { margin: "0 30px 26px", background: "white", border: `1px solid ${colors.border}`, borderRadius: 22, padding: 24, boxShadow: "0 10px 30px rgba(15,23,42,.06)" },
  title: { margin: 0, fontSize: 22 },
  head: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 18 },
  quickGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(145px,1fr))", gap: 18, marginTop: 24 },
  quick: { minHeight: 142, border: 0, borderRadius: 18, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: 14, color: colors.text, fontSize: 17, cursor: "pointer" },
  stats: { margin: "0 30px 26px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 14 },
  stat: { background: "white", border: `1px solid ${colors.border}`, borderRadius: 20, padding: 24, minHeight: 205, textAlign: "left" as const, display: "flex", flexDirection: "column" as const, gap: 12, cursor: "pointer", boxShadow: "0 10px 28px rgba(15,23,42,.06)" },
  statIcon: { width: 58, height: 58, borderRadius: 16, background: "#eef5ff", display: "grid", placeItems: "center", fontSize: 34 },
  statLabel: { color: colors.muted, fontWeight: 900 },
  statValue: { fontSize: 42, lineHeight: 1, color: colors.text },
  viewAll: { color: "#0b3a85", marginTop: "auto" },
  link: { border: 0, background: "transparent", color: colors.blue, fontWeight: 900, fontSize: 16, cursor: "pointer" },
  input: { width: "100%", boxSizing: "border-box" as const, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 15, fontSize: 16, marginBottom: 14 },
  row: { display: "flex", alignItems: "center", gap: 18, padding: "18px 0", borderTop: `1px solid ${colors.border}`, overflowX: "auto" as const },
  rowIcon: { minWidth: 60, height: 60, borderRadius: 18, display: "grid", placeItems: "center", fontSize: 34 },
  cell: { minWidth: 140, flex: 1 },
  amount: { minWidth: 72 },
  status: { background: "#eaf8ef", color: colors.green, borderRadius: 12, padding: "10px 14px", fontWeight: 900 },
  arrow: { color: "#64748b", fontSize: 30 },
  info: { borderTop: `1px solid ${colors.border}`, padding: "18px 0", color: colors.text },
  formBox: { background: "#f8fafc", border: `1px dashed #9aa7bb`, borderRadius: 18, padding: 22, color: colors.text },
  empty: { textAlign: "center" as const, color: colors.muted, padding: 20 },
  bottom: { position: "fixed" as const, bottom: 0, left: 0, right: 0, background: "white", borderTop: `1px solid ${colors.border}`, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, padding: "12px 18px", boxShadow: "0 -10px 30px rgba(15,23,42,.06)" },
  nav: { border: 0, borderRadius: 16, padding: "10px 4px", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 6, cursor: "pointer" },
};
