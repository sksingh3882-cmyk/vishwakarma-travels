"use client";

import { useEffect, useMemo, useState } from "react";

type Customer = { name?: string; mobile?: string; address?: string };
type Vehicle = { vehicleNumber?: string; vehicleType?: string; vehicleModel?: string; driverName?: string; driverMobile?: string };
type Booking = { booking_id?: string; customer_name?: string; customer_phone?: string; drop_location?: string; journey_date?: string; vehicle_number?: string; fare?: number; net_payable?: number; driver_name?: string; driver_mobile?: string };
type View = "dashboard" | "bookings" | "vehicles" | "drivers" | "customers" | "more";

function cleanPhone(v: string) {
  let p = String(v || "").replace(/\D/g, "");
  if (p.startsWith("91") && p.length === 12) p = p.slice(2);
  return p.slice(0, 10);
}

function formatDate(v?: string) {
  return v?.includes("-") ? v.split("-").reverse().join("-") : v || "-";
}

export default function AdminTestPage() {
  const [view, setView] = useState<View>("dashboard");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const headers = useMemo(() => ({ apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, "Content-Type": "application/json" }), [supabaseKey]);

  const drivers = useMemo(() => {
    const map = new Map<string, { name: string; mobile: string; vehicle: string }>();
    vehicles.forEach((v) => {
      const name = v.driverName || "";
      const mobile = cleanPhone(v.driverMobile || "");
      if (name || mobile) map.set(`${name}-${mobile}`, { name, mobile, vehicle: v.vehicleNumber || "" });
    });
    bookings.forEach((b) => {
      const name = b.driver_name || "";
      const mobile = cleanPhone(b.driver_mobile || "");
      if (name || mobile) map.set(`${name}-${mobile}`, { name, mobile, vehicle: b.vehicle_number || "" });
    });
    return Array.from(map.values());
  }, [vehicles, bookings]);

  useEffect(() => {
    async function loadData() {
      if (!supabaseUrl || !supabaseKey) return;
      const [cr, vr, br] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/customers?select=*`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/vehicles?select=*`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc&limit=100`, { headers }),
      ]);
      if (cr.ok) setCustomers(await cr.json());
      if (vr.ok) setVehicles(await vr.json());
      if (br.ok) setBookings(await br.json());
    }
    loadData();
  }, [supabaseUrl, supabaseKey, headers]);

  const recentBookings = bookings.slice(0, 5);
  const filteredBookings = bookings.filter((b) => `${b.booking_id} ${b.customer_name} ${b.vehicle_number} ${b.drop_location}`.toLowerCase().includes(search.toLowerCase()));
  const filteredVehicles = vehicles.filter((v) => `${v.vehicleNumber} ${v.vehicleType} ${v.vehicleModel} ${v.driverName}`.toLowerCase().includes(search.toLowerCase()));
  const filteredCustomers = customers.filter((c) => `${c.name} ${c.mobile} ${c.address}`.toLowerCase().includes(search.toLowerCase()));
  const filteredDrivers = drivers.filter((d) => `${d.name} ${d.mobile} ${d.vehicle}`.toLowerCase().includes(search.toLowerCase()));

  function open(v: View) {
    setView(v);
    setSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main style={page}>
      <header style={topBar}>
        <button onClick={() => open("dashboard")} style={menu}>☰</button>
        <div style={logo}><div style={logoIcon}>✦</div><div><b style={brand}>VISHWAKARMA</b><div style={subBrand}>TRAVELS</div></div></div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}><div style={bell}>🔔<span style={badge}>3</span></div><div style={avatar}>A</div><b>Admin⌄</b></div>
      </header>

      <section style={hero}><div><h1 style={{ margin: 0 }}>Hello, Admin 👋</h1><p>Welcome back! Manage your bookings and operations.</p></div><button style={dateBtn}>📅 {new Date().toLocaleDateString("en-GB")}</button></section>

      {view === "dashboard" ? <>
        <section style={panel}><h2>Quick Actions</h2><div style={quickGrid}><Quick title="New Booking" icon="🗓️" bg="#eef5ff" onClick={() => alert("New Booking form next step me connect hoga")} /><Quick title="Add Vehicle" icon="🚕" bg="#eefbf3" onClick={() => open("vehicles")} /><Quick title="Add Driver" icon="👤" bg="#fff4e8" onClick={() => open("drivers")} /><Quick title="Add Customer" icon="👥" bg="#f5efff" onClick={() => open("customers")} /></div></section>
        <section style={stats}><Stat title="Total Bookings" value={bookings.length} icon="🗓️" onClick={() => open("bookings")} /><Stat title="Total Vehicles" value={vehicles.length} icon="🚕" onClick={() => open("vehicles")} /><Stat title="Total Drivers" value={drivers.length} icon="👤" onClick={() => open("drivers")} /><Stat title="Total Customers" value={customers.length} icon="👥" onClick={() => open("customers")} /></section>
        <section style={panel}><div style={head}><h2>Recent Bookings</h2><button style={link} onClick={() => open("bookings")}>View all</button></div>{recentBookings.length ? recentBookings.map((b, i) => <BookingRow key={i} b={b} />) : <p>No bookings found</p>}</section>
      </> : <section style={panel}><div style={head}><h2>{title(view)}</h2><button style={link} onClick={() => open("dashboard")}>Back</button></div>{view !== "more" && <input style={input} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />}{view === "bookings" && filteredBookings.map((b, i) => <BookingRow key={i} b={b} />)}{view === "vehicles" && filteredVehicles.map((v, i) => <Info key={i} title={v.vehicleNumber || "Vehicle"} line1={`${v.vehicleType || ""} ${v.vehicleModel || ""}`} line2={`Driver: ${v.driverName || "-"}`} />)}{view === "drivers" && filteredDrivers.map((d, i) => <Info key={i} title={d.name || "Driver"} line1={`Mobile: ${d.mobile || "-"}`} line2={`Vehicle: ${d.vehicle || "-"}`} />)}{view === "customers" && filteredCustomers.map((c, i) => <Info key={i} title={c.name || "Customer"} line1={`Mobile: ${c.mobile || "-"}`} line2={`Address: ${c.address || "-"}`} />)}{view === "more" && <Info title="More Options" line1="Reports, settings aur document alerts next step me add honge." line2="Test page working hai." />}</section>}

      <nav style={bottom}><Nav active={view === "dashboard"} icon="🏠" label="Dashboard" onClick={() => open("dashboard")} /><Nav active={view === "bookings"} icon="🗓️" label="Bookings" onClick={() => open("bookings")} /><Nav active={view === "vehicles"} icon="🚕" label="Vehicles" onClick={() => open("vehicles")} /><Nav active={view === "drivers"} icon="👤" label="Drivers" onClick={() => open("drivers")} /><Nav active={view === "more"} icon="•••" label="More" onClick={() => open("more")} /></nav>
    </main>
  );
}

function Quick(p: { title: string; icon: string; bg: string; onClick: () => void }) { return <button onClick={p.onClick} style={{ ...quick, background: p.bg }}><span>{p.icon}</span><b>{p.title}</b></button>; }
function Stat(p: { title: string; value: number; icon: string; onClick: () => void }) { return <button onClick={p.onClick} style={stat}><span style={statIcon}>{p.icon}</span><span>{p.title}</span><strong>{p.value}</strong><b style={{ color: "#0b3a85" }}>View all ›</b></button>; }
function BookingRow({ b }: { b: Booking }) { return <div style={row}><span style={small}>🗓️</span><div style={{ flex: 1 }}><b>{b.booking_id || "Booking"}</b><p>{b.customer_name || "-"}</p></div><div style={{ flex: 1 }}><b>{b.vehicle_number || "-"}</b><p>{formatDate(b.journey_date)}</p></div><b>₹{Number(b.net_payable || b.fare || 0).toLocaleString("en-IN")}</b><span style={status}>Confirmed</span><b>›</b></div>; }
function Info(p: { title: string; line1: string; line2: string }) { return <div style={info}><b>{p.title}</b><p>{p.line1}</p><p>{p.line2}</p></div>; }
function Nav(p: { active: boolean; icon: string; label: string; onClick: () => void }) { return <button onClick={p.onClick} style={{ ...nav, background: p.active ? "#eff6ff" : "white", color: p.active ? "#2563eb" : "#475569" }}><span>{p.icon}</span><b>{p.label}</b></button>; }
function title(v: View) { return { dashboard: "Dashboard", bookings: "All Bookings", vehicles: "All Vehicles", drivers: "All Drivers", customers: "All Customers", more: "More" }[v]; }

const page = { minHeight: "100vh", background: "#f8fbff", paddingBottom: 110, fontFamily: "Arial, sans-serif", color: "#081735" };
const topBar = { background: "linear-gradient(135deg,#071832,#0b2d5f)", color: "white", padding: "24px 28px", display: "flex", alignItems: "center", gap: 18, borderBottomLeftRadius: 26, borderBottomRightRadius: 26 };
const menu = { background: "transparent", border: 0, color: "white", fontSize: 32 };
const logo = { display: "flex", alignItems: "center", gap: 12 };
const logoIcon = { width: 56, height: 56, borderRadius: 999, border: "2px solid #f7b21b", display: "grid", placeItems: "center", color: "#f7b21b", fontSize: 28 };
const brand = { color: "#f7b21b", fontSize: 20, letterSpacing: 1 };
const subBrand = { color: "white", letterSpacing: 4, fontWeight: 700 };
const bell = { position: "relative" as const, fontSize: 28 };
const badge = { position: "absolute" as const, right: -8, top: -8, background: "#fb5b66", color: "white", borderRadius: 999, fontSize: 12, padding: "4px 7px" };
const avatar = { width: 52, height: 52, borderRadius: 999, background: "#a855f7", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 24 };
const hero = { padding: 28, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap" as const };
const dateBtn = { background: "white", border: "1px solid #dbe3ef", borderRadius: 16, padding: "16px 20px", fontWeight: 800 };
const panel = { margin: "0 28px 24px", background: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 22, boxShadow: "0 10px 30px rgba(15,23,42,.06)" };
const quickGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(145px,1fr))", gap: 18 };
const quick = { minHeight: 130, border: 0, borderRadius: 18, display: "flex", flexDirection: "column" as const, justifyContent: "center", alignItems: "center", gap: 12, fontSize: 18 };
const stats = { margin: "0 28px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 };
const stat = { background: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 22, minHeight: 180, textAlign: "left" as const, display: "flex", flexDirection: "column" as const, gap: 12, cursor: "pointer" };
const statIcon = { width: 58, height: 58, borderRadius: 16, background: "#f1f5f9", display: "grid", placeItems: "center", fontSize: 28 };
const head = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 };
const link = { background: "transparent", border: 0, color: "#2563eb", fontWeight: 900, fontSize: 16 };
const input = { width: "100%", padding: 14, borderRadius: 14, border: "1px solid #dbe3ef", fontSize: 16, boxSizing: "border-box" as const, marginBottom: 16 };
const row = { display: "flex", alignItems: "center", gap: 18, padding: "18px 0", borderTop: "1px solid #e2e8f0", overflowX: "auto" as const };
const small = { minWidth: 54, height: 54, borderRadius: 16, display: "grid", placeItems: "center", background: "#eef5ff", fontSize: 25 };
const status = { background: "#eaf8ef", color: "#16a34a", borderRadius: 12, padding: "10px 14px", fontWeight: 900 };
const info = { borderTop: "1px solid #e2e8f0", padding: "16px 0" };
const bottom = { position: "fixed" as const, bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #dbe3ef", display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, padding: "12px 18px" };
const nav = { border: 0, borderRadius: 16, padding: "10px 4px", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 6 };
