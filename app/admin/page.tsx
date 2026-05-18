"use client";

import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";

type Booking = Record<string, any>;
type Customer = Record<string, any>;
type Vehicle = Record<string, any>;

type FormDataState = {
  customerName: string; customerPhone: string; gender: string; service: string;
  pickup: string; drop: string; journeyDate: string; journeyTime: string;
  vehicleType: string; vehicleModel: string; vehicleNumber: string;
  fare: string; advance: string; driverName: string; driverMobile: string;
};

const initialForm: FormDataState = {
  customerName: "", customerPhone: "", gender: "Mr.", service: "One Way Drop Pickup",
  pickup: "", drop: "", journeyDate: "", journeyTime: "",
  vehicleType: "Sedan", vehicleModel: "Desire", vehicleNumber: "",
  fare: "", advance: "0", driverName: "", driverMobile: "",
};

function cleanPhone(v: string) {
  let p = String(v || "").replace(/\D/g, "");
  if (p.startsWith("91") && p.length === 12) p = p.slice(2);
  return p.slice(0, 10);
}
function formatDate(v: string) { return v && v.includes("-") ? v.split("-").reverse().join("-") : v || ""; }
function safe(v: string) { return String(v || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<FormDataState>(initialForm);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeView, setActiveView] = useState<"customers" | "vehicles" | "bookings" | "">("");
  const [searchBooking, setSearchBooking] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastBookingId, setLastBookingId] = useState("");
  const [pendingBookingId, setPendingBookingId] = useState("");
  const [confirmMode, setConfirmMode] = useState<"save" | "whatsapp">("save");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [deletingBookingId, setDeletingBookingId] = useState("");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";
  const headers = useMemo(() => ({ apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, "Content-Type": "application/json", Prefer: "return=representation" }), [supabaseKey]);
  const fare = Number(form.fare || 0);
  const advance = Number(form.advance || 0);
  const net = fare - advance;

  useEffect(() => { if (localStorage.getItem("vt_admin_login") === "yes") setIsLogin(true); }, []);
  useEffect(() => {
    async function load() {
      if (!isLogin || !supabaseUrl || !supabaseKey) return;
      const [c, v, b] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/customers?select=*`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/vehicles?select=*`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc&limit=50`, { headers }),
      ]);
      if (c.ok) setCustomers(await c.json());
      if (v.ok) setVehicles(await v.json());
      if (b.ok) setBookings(await b.json());
    }
    load().catch(console.log);
  }, [isLogin, supabaseUrl, supabaseKey, headers]);

  function update<K extends keyof FormDataState>(key: K, value: FormDataState[K]) { setForm((p) => ({ ...p, [key]: value })); }
  function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password === adminPassword) { localStorage.setItem("vt_admin_login", "yes"); setIsLogin(true); } else alert("Wrong admin password");
  }
  function logout() { localStorage.removeItem("vt_admin_login"); setIsLogin(false); }

  function findCustomer() {
    const name = form.customerName.toLowerCase().trim();
    const phone = cleanPhone(form.customerPhone);
    const found = customers.find((c) => (c.name || "").toLowerCase().trim() === name || cleanPhone(c.mobile || "") === phone);
    if (found) setForm((p) => ({ ...p, customerName: found.name || p.customerName, customerPhone: found.mobile || p.customerPhone, pickup: found.address || p.pickup }));
  }
  function fillVehicle(value: string) {
    const no = value.toUpperCase(); update("vehicleNumber", no);
    const found = vehicles.find((v) => (v.vehicle_number || v.vehicleNumber || "").toUpperCase().includes(no));
    if (no.length > 1 && found) setForm((p) => ({ ...p, vehicleNumber: found.vehicle_number || found.vehicleNumber || p.vehicleNumber, vehicleType: found.vehicle_type || p.vehicleType, vehicleModel: found.vehicle_model || found.vehicleModel || p.vehicleModel, driverName: found.driver_name || found.driverName || p.driverName, driverMobile: found.phone || found.driver_mobile || found.driverMobile || p.driverMobile }));
  }

  function msg(id: string) {
    return `Booking Confirmation\n\n${form.gender} ${form.customerName},\nYour booking is confirmed.\n\nBooking ID: ${id}\nService: ${form.service}\nContact No: +91${cleanPhone(form.customerPhone)}\n\nPickup: ${form.pickup}\nDrop: ${form.drop}\nDate: ${formatDate(form.journeyDate)}\nTime: ${form.journeyTime}\n\nVehicle Type: ${form.vehicleType}\nVehicle Model: ${form.vehicleModel}\nVehicle No: ${form.vehicleNumber}\nDriver Name: ${form.driverName}\nDriver Mobile: ${form.driverMobile}\n\nFare: Rs ${fare}\nAdvance: Rs ${advance}\nNet Payable Amount: Rs ${net}\n\nThank You For Choosing Vishwakarma Travels`;
  }
  function validate() {
    if (!supabaseUrl || !supabaseKey) return alert("Supabase URL/KEY missing hai."), false;
    if (cleanPhone(form.customerPhone).length !== 10) return alert("Customer WhatsApp number 10 digit ka hona chahiye."), false;
    if (fare <= 0) return alert("Total fare valid enter karo."), false;
    if (advance > fare) return alert("Advance fare se zyada nahi ho sakta."), false;
    return true;
  }
  function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); if (!validate()) return; setPendingBookingId(`VT-${Date.now()}`); setConfirmMode("save"); setShowConfirmPopup(true); }
  function sendWhatsApp() { if (!validate()) return; setPendingBookingId(lastBookingId || `VT-${Date.now()}`); setConfirmMode("whatsapp"); setShowConfirmPopup(true); }

  async function saveBooking(id: string) {
    const payload = { booking_id: id, customer_name: form.customerName, customer_phone: cleanPhone(form.customerPhone), gender: form.gender, service: form.service, pickup: form.pickup, drop_location: form.drop, journey_date: form.journeyDate, journey_time: form.journeyTime, vehicle_type: form.vehicleType, vehicle_model: form.vehicleModel, vehicle_number: form.vehicleNumber, fare, advance, net_payable: net, driver_name: form.driverName, driver_mobile: cleanPhone(form.driverMobile) };
    const r = await fetch(`${supabaseUrl}/rest/v1/bookings`, { method: "POST", headers, body: JSON.stringify(payload) });
    if (!r.ok) return false;
    setBookings((p) => [payload, ...p]);
    return true;
  }
  async function saveCustomer() {
    const phone = cleanPhone(form.customerPhone);
    if (!phone || customers.some((c) => cleanPhone(c.mobile || "") === phone)) return;
    const payload = { name: form.customerName.trim(), mobile: phone, address: form.pickup.trim() };
    const r = await fetch(`${supabaseUrl}/rest/v1/customers`, { method: "POST", headers, body: JSON.stringify(payload) });
    if (r.ok) setCustomers((p) => [payload, ...p]);
  }
  async function saveVehicle() {
    const no = form.vehicleNumber.trim().toUpperCase();
    if (!no || vehicles.some((v) => (v.vehicle_number || v.vehicleNumber || "").toUpperCase() === no)) return;
    const payload = { vehicle_number: no, vehicle_type: form.vehicleType, vehicle_model: form.vehicleModel, driver_name: form.driverName, phone: cleanPhone(form.driverMobile), route: `${form.pickup} to ${form.drop}`, status: "Active" };
    const r = await fetch(`${supabaseUrl}/rest/v1/vehicles`, { method: "POST", headers, body: JSON.stringify(payload) });
    if (r.ok) setVehicles((p) => [payload, ...p]);
  }
  function pdf(id: string) {
    const w = window.open("", "_blank"); if (!w) return alert("Popup allow karo.");
    w.document.write(`<h1>Vishwakarma Travels</h1><h2>Invoice ${safe(id)}</h2><p>Customer: ${safe(form.customerName)}</p><p>Mobile: ${safe(cleanPhone(form.customerPhone))}</p><p>Route: ${safe(form.pickup)} to ${safe(form.drop)}</p><p>Date/Time: ${safe(formatDate(form.journeyDate))} ${safe(form.journeyTime)}</p><p>Vehicle: ${safe(form.vehicleType)} ${safe(form.vehicleModel)} ${safe(form.vehicleNumber)}</p><p>Driver: ${safe(form.driverName)} ${safe(form.driverMobile)}</p><h2>Net Payable: Rs ${net}</h2><script>window.print()</script>`);
    w.document.close();
  }
  async function confirm() {
    const id = pendingBookingId || lastBookingId || `VT-${Date.now()}`;
    setLoading(true);
    try {
      if (confirmMode === "save") {
        const ok = await saveBooking(id); if (!ok) return alert("Booking save nahi hua.");
        await Promise.all([saveCustomer(), saveVehicle()]); setLastBookingId(id); pdf(id);
      }
      window.location.href = `https://api.whatsapp.com/send?phone=91${cleanPhone(form.customerPhone)}&text=${encodeURIComponent(msg(id))}`;
      setShowConfirmPopup(false);
    } finally { setLoading(false); }
  }
  async function removeBooking(id?: string) {
    if (!id || !window.confirm("Delete booking?")) return;
    setDeletingBookingId(id);
    const r = await fetch(`${supabaseUrl}/rest/v1/bookings?booking_id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers });
    if (r.ok) setBookings((p) => p.filter((b) => b.booking_id !== id)); else alert("Delete nahi hua.");
    setDeletingBookingId("");
  }
  function edit(b: Booking) {
    setForm({ customerName: b.customer_name || "", customerPhone: b.customer_phone || "", gender: b.gender || "Mr.", service: b.service || "One Way Drop Pickup", pickup: b.pickup || "", drop: b.drop_location || "", journeyDate: b.journey_date || "", journeyTime: b.journey_time || "", vehicleType: b.vehicle_type || "Sedan", vehicleModel: b.vehicle_model || "Desire", vehicleNumber: b.vehicle_number || "", fare: String(b.fare || ""), advance: String(b.advance || "0"), driverName: b.driver_name || "", driverMobile: b.driver_mobile || "" }); setLastBookingId(b.booking_id || ""); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filtered = bookings.filter((b) => `${b.booking_id || ""} ${b.customer_name || ""} ${b.customer_phone || ""} ${b.pickup || ""} ${b.drop_location || ""}`.toLowerCase().includes(searchBooking.toLowerCase()));
  const drops = Array.from(new Set(bookings.filter((b) => cleanPhone(b.customer_phone || "") === cleanPhone(form.customerPhone) || (b.customer_name || "").toLowerCase().includes(form.customerName.toLowerCase())).map((b) => b.drop_location).filter(Boolean))).slice(0, 6);

  if (!isLogin) return <main style={loginPage}><form onSubmit={login} style={card}><h1>Vishwakarma Travels</h1><p>Admin Login</p><input type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} style={input} /><button style={blueBtn}>Login</button></form></main>;

  return <main style={page}>
    {showConfirmPopup && <div style={overlay}><div style={modal}><button onClick={() => setShowConfirmPopup(false)} style={close}>x</button><img src="/cars/popup_banner.png" style={banner} alt="Vishwakarma Travels" /><div style={body}><h2 style={title}>Confirm Booking Details</h2><Row l="Customer Name" v={form.customerName} /><Row l="Mobile No." v={form.customerPhone} /><Row l="Pickup" v={form.pickup} /><Row l="Drop" v={form.drop} /><Row l="Date" v={formatDate(form.journeyDate)} /><Row l="Time" v={form.journeyTime} /><Row l="Vehicle Type" v={form.vehicleType} /><Row l="Vehicle Model" v={form.vehicleModel} /><Row l="Driver Name" v={form.driverName} /><Row l="Driver Mobile" v={form.driverMobile} /><Row l="Fare" v={`Rs ${fare}`} /><Row l="Advance" v={`Rs ${advance}`} /><div style={netRow}><b>Net Payable</b><b>Rs {net}</b></div></div><div style={actions}><button onClick={() => setShowConfirmPopup(false)} style={cancelBtn}>Cancel</button><button disabled={loading} onClick={confirm} style={greenBtn}>{loading ? "Please wait..." : "Confirm & Submit"}</button></div></div></div>}

    <div style={{ maxWidth: 1200, margin: "0 auto" }}><header style={header}><h1>Vishwakarma Travels Admin Dashboard</h1><p>Booking, Bill, WhatsApp aur Database Management</p><button onClick={logout} style={whiteBtn}>Logout</button></header>
    <section style={stats}><Stat title="Customers" value={customers.length} onClick={() => setActiveView("customers")} /><Stat title="Vehicles" value={vehicles.length} onClick={() => setActiveView("vehicles")} /><Stat title="Bookings" value={bookings.length} onClick={() => setActiveView("bookings")} /></section>
    {activeView && <section style={panel}><button onClick={() => setActiveView("")} style={whiteBtn}>Close</button>{activeView === "customers" && customers.map((c, i) => <p key={i}><b>{c.name || "-"}</b> - {c.mobile || "-"} - {c.address || "-"}</p>)}{activeView === "vehicles" && vehicles.map((v, i) => <p key={i}><b>{v.vehicle_number || v.vehicleNumber || "-"}</b> - {v.vehicle_model || v.vehicleModel || "-"} - {v.driver_name || v.driverName || "-"}</p>)}{activeView === "bookings" && bookings.map((b, i) => <p key={i}><b>{b.booking_id || "-"}</b> - {b.customer_name || "-"} - Rs {b.fare || 0}</p>)}</section>}
    <form onSubmit={submit} style={panel}><h2>New Booking</h2><div style={grid}><select value={form.gender} onChange={(e) => update("gender", e.target.value)} style={input}><option>Mr.</option><option>Mrs.</option><option>Ms.</option></select><input placeholder="Customer Name" value={form.customerName} onChange={(e) => update("customerName", e.target.value)} onBlur={findCustomer} style={input} required /><input type="text" inputMode="tel" placeholder="Customer WhatsApp Number" value={form.customerPhone} onChange={(e) => update("customerPhone", e.target.value)} onBlur={findCustomer} style={input} required /><input placeholder="Pickup Location" value={form.pickup} onChange={(e) => update("pickup", e.target.value)} style={input} required /><input placeholder="Drop Location" value={form.drop} onChange={(e) => update("drop", e.target.value)} style={input} required />{drops.length > 0 && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{drops.map((d) => <button key={d} type="button" onClick={() => update("drop", d)} style={chip}>{d}</button>)}</div>}<input type="date" value={form.journeyDate} onChange={(e) => update("journeyDate", e.target.value)} style={input} required /><input placeholder="Time e.g. 5:30 PM" value={form.journeyTime} onChange={(e) => update("journeyTime", e.target.value)} style={input} required /><input placeholder="Vehicle Number" value={form.vehicleNumber} onChange={(e) => fillVehicle(e.target.value)} style={input} /><select value={form.vehicleType} onChange={(e) => update("vehicleType", e.target.value)} style={input}><option>Sedan</option><option>SUV</option><option>SUV With Carrier</option><option>Sedan With Carrier</option><option>Mini Passenger Bus</option></select><select value={form.vehicleModel} onChange={(e) => update("vehicleModel", e.target.value)} style={input}><option>Desire</option><option>Ertiga</option><option>Innova</option><option>Innova Crysta</option><option>Ertiga With Carrier</option><option>Innova With Carrier</option><option>Crysta With Carrier</option><option>Force Traveller</option></select><input placeholder="Driver Name" value={form.driverName} onChange={(e) => update("driverName", e.target.value)} style={input} /><input type="text" inputMode="tel" placeholder="Driver Mobile" value={form.driverMobile} onChange={(e) => update("driverMobile", e.target.value)} style={input} /><select value={form.service} onChange={(e) => update("service", e.target.value)} style={input}><option>One Way Drop Pickup</option><option>Jamshedpur to Ranchi Airport Drop</option><option>Ranchi Airport to Jamshedpur Drop</option><option>Jamshedpur to Kolkata Airport Drop</option><option>Kolkata Airport to Jamshedpur Drop</option><option>Local Movment</option><option>Outstation Movment</option><option>Short Time Booking</option><option>Marriage Function Booking</option></select><input type="number" placeholder="Total Fare" value={form.fare} onChange={(e) => update("fare", e.target.value)} style={input} required /><input type="number" placeholder="Advance Paid" value={form.advance} onChange={(e) => update("advance", e.target.value)} style={input} /></div><div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}><button disabled={loading} style={saveBtn}>{loading ? "Saving..." : "Save Booking + PDF Bill"}</button><button type="button" onClick={sendWhatsApp} style={waBtn}>Send WhatsApp</button></div></form>
    <section style={panel}><h2>Recent Bookings</h2><input placeholder="Search booking by name, phone, pickup..." value={searchBooking} onChange={(e) => setSearchBooking(e.target.value)} style={input} /><div style={{ overflowX: "auto", marginTop: 12 }}><table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse" }}><thead><tr style={{ background: "#0b2d6b", color: "white" }}><th style={th}>Booking ID</th><th style={th}>Customer</th><th style={th}>Phone</th><th style={th}>Route</th><th style={th}>Date</th><th style={th}>Fare</th><th style={th}>Action</th></tr></thead><tbody>{filtered.map((b, i) => <tr key={b.booking_id || i}><td style={td}>{b.booking_id || "-"}</td><td style={td}>{b.customer_name || "-"}</td><td style={td}>{b.customer_phone || "-"}</td><td style={td}>{b.pickup || "-"} to {b.drop_location || "-"}</td><td style={td}>{b.journey_date || "-"}</td><td style={td}>Rs {b.fare || 0}</td><td style={td}><button onClick={() => edit(b)} style={editBtn}>Edit</button><button onClick={() => pdf(b.booking_id || "")} style={pdfBtn}>PDF</button><button disabled={deletingBookingId === b.booking_id} onClick={() => removeBooking(b.booking_id)} style={delBtn}>{deletingBookingId === b.booking_id ? "Deleting..." : "Delete"}</button></td></tr>)}{bookings.length === 0 && <tr><td colSpan={7} style={{ padding: 20, textAlign: "center" }}>No booking found</td></tr>}</tbody></table></div></section></div>
  </main>;
}

function Row({ l, v }: { l: string; v: string }) { return <div style={detailRow}><b>{l}</b><span>{v || "-"}</span></div>; }
function Stat({ title, value, onClick }: { title: string; value: number; onClick: () => void }) { return <div onClick={onClick} style={stat}><p>{title}</p><h2>{value}</h2><b>View all</b></div>; }

const page: CSSProperties = { minHeight: "100vh", background: "#f1f5f9", padding: 16 };
const loginPage: CSSProperties = { minHeight: "100vh", background: "#f1f5f9", padding: 20, display: "flex", alignItems: "center", justifyContent: "center" };
const card: CSSProperties = { width: "100%", maxWidth: 380, background: "white", padding: 24, borderRadius: 18, boxShadow: "0 8px 25px rgba(0,0,0,.12)" };
const header: CSSProperties = { background: "#0b2d6b", color: "white", padding: 20, borderRadius: 18, marginBottom: 16 };
const stats: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 16 };
const stat: CSSProperties = { background: "white", padding: 16, borderRadius: 16, cursor: "pointer" };
const panel: CSSProperties = { background: "white", padding: 18, borderRadius: 18, marginBottom: 16 };
const grid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 };
const input: CSSProperties = { padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", width: "100%", boxSizing: "border-box" };
const blueBtn: CSSProperties = { width: "100%", padding: 13, borderRadius: 12, border: 0, background: "#0b2d6b", color: "white", fontWeight: "bold", marginTop: 15 };
const whiteBtn: CSSProperties = { padding: "10px 16px", borderRadius: 10, border: 0, fontWeight: "bold" };
const chip: CSSProperties = { padding: "8px 10px", borderRadius: 10, border: "1px solid #0b2d6b", background: "white", color: "#0b2d6b", fontWeight: "bold" };
const saveBtn: CSSProperties = { padding: "14px 20px", background: "#15803d", color: "white", border: 0, borderRadius: 12, fontWeight: "bold" };
const waBtn: CSSProperties = { padding: "14px 20px", background: "#25D366", color: "white", border: 0, borderRadius: 12, fontWeight: "bold" };
const th: CSSProperties = { padding: 10, textAlign: "left" };
const td: CSSProperties = { padding: 10, borderBottom: "1px solid #e2e8f0" };
const editBtn: CSSProperties = { padding: "8px 12px", borderRadius: 10, border: 0, background: "#2563eb", color: "white", fontWeight: "bold", marginRight: 8 };
const pdfBtn: CSSProperties = { padding: "8px 12px", borderRadius: 10, border: 0, background: "#059669", color: "white", fontWeight: "bold", marginRight: 8 };
const delBtn: CSSProperties = { padding: "8px 12px", borderRadius: 10, border: 0, background: "#dc2626", color: "white", fontWeight: "bold" };
const overlay: CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,.68)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 };
const modal: CSSProperties = { width: "92%", maxWidth: 390, maxHeight: "82vh", overflowY: "auto", background: "white", borderRadius: 20, position: "relative" };
const close: CSSProperties = { position: "absolute", top: 7, right: 7, width: 34, height: 34, borderRadius: "50%", border: 0, background: "white", fontSize: 20, fontWeight: 900, zIndex: 2 };
const banner: CSSProperties = { width: "100%", maxHeight: 92, objectFit: "cover", display: "block", borderRadius: "20px 20px 0 0" };
const body: CSSProperties = { padding: "10px 14px 8px" };
const title: CSSProperties = { color: "#0b2d6b", fontSize: 18, margin: "0 0 8px", fontWeight: 950 };
const detailRow: CSSProperties = { display: "grid", gridTemplateColumns: "130px 1fr", gap: 8, borderBottom: "1px solid #e2e8f0", padding: "4px 0", fontSize: 13 };
const netRow: CSSProperties = { display: "flex", justifyContent: "space-between", marginTop: 8, padding: "8px 10px", borderRadius: 12, background: "#ecfdf5", color: "#15803d", fontSize: 15 };
const actions: CSSProperties = { position: "sticky", bottom: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 10, background: "white", borderTop: "1px solid #e2e8f0" };
const cancelBtn: CSSProperties = { padding: 11, borderRadius: 12, border: "2px solid #ef4444", background: "white", color: "#ef4444", fontWeight: 950 };
const greenBtn: CSSProperties = { padding: 11, borderRadius: 12, border: 0, background: "#16a34a", color: "white", fontWeight: 950 };

// Stable backup version
