"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

type Booking = { booking_id?: string; customer_name?: string; customer_phone?: string; pickup?: string; drop_location?: string; journey_date?: string; fare?: number };
type Customer = { name?: string; mobile?: string; address?: string };
type Vehicle = { vehicleNumber?: string; vehicleType?: string; vehicleModel?: string; driverName?: string; driverMobile?: string };
type BookingForm = { customerName: string; customerPhone: string; gender: string; service: string; pickup: string; drop: string; journeyDate: string; journeyTime: string; vehicleType: string; vehicleModel: string; vehicleNumber: string; fare: string; advance: string; driverName: string; driverMobile: string };

const serviceOptions = ["Airport Drop Pickup", "Local Movment", "Outstation Movment", "Short Time Booking", "Marriage Function Booking"];
const initialForm: BookingForm = { customerName: "", customerPhone: "", gender: "Mr.", service: "Airport Drop Pickup", pickup: "", drop: "", journeyDate: "", journeyTime: "", vehicleType: "", vehicleModel: "", vehicleNumber: "", fare: "", advance: "0", driverName: "", driverMobile: "" };
const inputStyle: React.CSSProperties = { padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", width: "100%" };
const thStyle: React.CSSProperties = { padding: 10, textAlign: "left" };
const tdStyle: React.CSSProperties = { padding: 10, borderBottom: "1px solid #e2e8f0" };
const cardStyle: React.CSSProperties = { background: "white", padding: 16, borderRadius: 16 };

function cleanPhone(value: string) {
  let phone = String(value || "").replace(/\D/g, "");
  if (phone.startsWith("91") && phone.length === 12) phone = phone.slice(2);
  return phone.slice(0, 10);
}

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastBookingId, setLastBookingId] = useState("");
  const [deletingBookingId, setDeletingBookingId] = useState("");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";
  const headers = useMemo(() => ({ apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, "Content-Type": "application/json", Prefer: "return=representation" }), [supabaseKey]);

  useEffect(() => { if (typeof window !== "undefined" && localStorage.getItem("vt_admin_login") === "yes") setIsLogin(true); }, []);
  useEffect(() => {
    async function loadData() {
      if (!isLogin || !supabaseUrl || !supabaseKey) return;
      try {
        const [customerRes, vehicleRes, bookingRes] = await Promise.all([
          fetch(`${supabaseUrl}/rest/v1/customers?select=*`, { headers }),
          fetch(`${supabaseUrl}/rest/v1/vehicles?select=*`, { headers }),
          fetch(`${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc&limit=50`, { headers }),
        ]);
        if (customerRes.ok) setCustomers(await customerRes.json());
        if (vehicleRes.ok) setVehicles(await vehicleRes.json());
        if (bookingRes.ok) setBookings(await bookingRes.json());
      } catch (error) { console.log("Data load error:", error); }
    }
    loadData();
  }, [isLogin, supabaseUrl, supabaseKey, headers]);

  function updateForm<K extends keyof BookingForm>(key: K, value: BookingForm[K]) { setForm((prev) => ({ ...prev, [key]: value })); }
  function handleLogin(e: FormEvent<HTMLFormElement>) { e.preventDefault(); if (password === adminPassword) { localStorage.setItem("vt_admin_login", "yes"); setIsLogin(true); } else alert("Wrong admin password"); }
  function logout() { localStorage.removeItem("vt_admin_login"); setIsLogin(false); setPassword(""); }
  function fillVehicle(value: string) {
    const vehicleNo = value.toUpperCase(); updateForm("vehicleNumber", vehicleNo); if (vehicleNo.length < 2) return;
    const found = vehicles.find((v) => (v.vehicleNumber || "").toUpperCase().includes(vehicleNo)); if (!found) return;
    setForm((prev) => ({ ...prev, vehicleNumber: found.vehicleNumber || prev.vehicleNumber, vehicleType: found.vehicleType || prev.vehicleType, vehicleModel: found.vehicleModel || prev.vehicleModel, driverName: found.driverName || prev.driverName, driverMobile: cleanPhone(found.driverMobile || prev.driverMobile) }));
  }

  function buildWhatsAppMessage(bookingId: string) {
    const fare = Number(form.fare || 0), advance = Number(form.advance || 0), netPayable = fare - advance;
    return `✅ Booking Confirmed - Vishwakarma Travels\n\n${form.gender} ${form.customerName},\nNamaste, Your Booking is Confirmed.\n\nBooking ID: ${bookingId}\n\nService: ${form.service}\nContact No: +91${form.customerPhone}\n\n📍 Pickup: ${form.pickup}\n📍 Drop: ${form.drop}\n📆 Date: ${form.journeyDate}\n⌚ Time: ${form.journeyTime}\n\n🚕 Vehicle Details:\nVehicle Type: ${form.vehicleType}\nVehicle Model: ${form.vehicleModel}\nVehicle No: ${form.vehicleNumber}\nDriver Name: ${form.driverName}\nDriver Mobile: ${form.driverMobile}\n\n💵 Fare Charges:\nFare: ₹${fare}\nAdvance Paid: ₹${advance}\nNet Payable Amount: ₹${netPayable}\n\nThank You For Choosing Vishwakarma Travels\nWish You A Very Happy Journey\n\nFor Queries Please Call or WhatsApp:\n+91 7667989203`;
  }

  function openBillPdf(bookingId: string) {
    const fare = Number(form.fare || 0), advance = Number(form.advance || 0), netPayable = fare - advance;
    const win = window.open("", "_blank"); if (!win) return alert("Popup blocked hai. Browser me popup allow karo.");
    win.document.write(`<html><body style="font-family:Arial;padding:20px"><h1>Vishwakarma Travels</h1><h2>INVOICE ${bookingId}</h2><p><b>Service:</b> ${form.service}</p><p><b>Customer:</b> ${form.gender} ${form.customerName}</p><p><b>Contact:</b> +91${form.customerPhone}</p><p><b>Route:</b> ${form.pickup} to ${form.drop}</p><p><b>Date/Time:</b> ${form.journeyDate} ${form.journeyTime}</p><p><b>Vehicle:</b> ${form.vehicleType} ${form.vehicleModel} ${form.vehicleNumber}</p><p><b>Driver:</b> ${form.driverName} ${form.driverMobile}</p><hr/><h2>Total Payable: ₹${netPayable}</h2><p>THANK YOU & WISH YOU A VERY HAPPY JOURNEY</p><script>window.print()</script></body></html>`);
    win.document.close();
  }

  async function saveBooking(bookingId: string) {
    const fare = Number(form.fare || 0), advance = Number(form.advance || 0);
    const payload = { booking_id: bookingId, customer_name: form.customerName, customer_phone: cleanPhone(form.customerPhone), gender: form.gender, service: form.service, pickup: form.pickup, drop_location: form.drop, journey_date: form.journeyDate, journey_time: form.journeyTime, vehicle_type: form.vehicleType, vehicle_model: form.vehicleModel, vehicle_number: form.vehicleNumber, fare, advance, net_payable: fare - advance, driver_name: form.driverName, driver_mobile: cleanPhone(form.driverMobile) };
    const response = await fetch(`${supabaseUrl}/rest/v1/bookings`, { method: "POST", headers, body: JSON.stringify(payload) });
    if (!response.ok) { console.log("Booking save error:", await response.text()); return false; }
    setBookings((prev) => [payload, ...prev]); return true;
  }

  async function deleteBooking(bookingId?: string) {
    if (!bookingId) return alert("Booking ID missing hai, delete nahi ho sakta.");
    if (!window.confirm(`Kya aap booking ${bookingId} ko delete karna chahte hain?`)) return;
    setDeletingBookingId(bookingId);
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/bookings?booking_id=eq.${encodeURIComponent(bookingId)}`, { method: "DELETE", headers });
      if (!response.ok) return alert("Booking delete nahi hua. Supabase policy/table check karo.");
      setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId)); alert("Booking delete ho gaya.");
    } catch (error) { console.log("Delete error:", error); alert("Booking delete karte time error aaya."); }
    finally { setDeletingBookingId(""); }
  }

  async function saveCustomerIfNew() {
    const phone = cleanPhone(form.customerPhone); if (!phone || phone.length !== 10 || !form.customerName.trim()) return;
    if (customers.some((c) => cleanPhone(c.mobile || "") === phone)) return;
    const payload = { name: form.customerName.trim(), mobile: phone, address: form.pickup.trim() };
    const response = await fetch(`${supabaseUrl}/rest/v1/customers`, { method: "POST", headers, body: JSON.stringify(payload) }); if (response.ok) setCustomers((prev) => [payload, ...prev]);
  }
  async function saveVehicleIfNew() {
    const vehicleNo = form.vehicleNumber.trim().toUpperCase(); if (!vehicleNo) return;
    if (vehicles.some((v) => (v.vehicleNumber || "").toUpperCase() === vehicleNo)) return;
    const payload = { vehicleNumber: vehicleNo, vehicleType: form.vehicleType.trim(), vehicleModel: form.vehicleModel.trim(), driverName: form.driverName.trim(), driverMobile: cleanPhone(form.driverMobile) };
    const response = await fetch(`${supabaseUrl}/rest/v1/vehicles`, { method: "POST", headers, body: JSON.stringify(payload) }); if (response.ok) setVehicles((prev) => [payload, ...prev]);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!supabaseUrl || !supabaseKey) return alert("Supabase URL/KEY missing hai. Vercel Environment Variables check karo.");
    if (cleanPhone(form.customerPhone).length !== 10) return alert("Customer WhatsApp number 10 digit ka hona chahiye.");
    if (Number(form.fare || 0) <= 0) return alert("Total fare valid enter karo.");
    const bookingId = `VT-${Date.now()}`; setLoading(true);
    try { const saved = await saveBooking(bookingId); if (!saved) return alert("Booking database me save nahi hua. Supabase table/columns check karo."); await Promise.all([saveCustomerIfNew(), saveVehicleIfNew()]); openBillPdf(bookingId); setLastBookingId(bookingId); alert("Booking saved aur PDF bill open ho gaya."); setForm(initialForm); }
    catch (error) { console.log("Submit error:", error); alert("Booking save karte time error aaya."); }
    finally { setLoading(false); }
  }
  function sendWhatsApp() { const phone = cleanPhone(form.customerPhone); if (phone.length !== 10) return alert("Customer WhatsApp number 10 digit ka hona chahiye."); window.location.href = `https://api.whatsapp.com/send?phone=91${phone}&text=${encodeURIComponent(buildWhatsAppMessage(lastBookingId || `VT-${Date.now()}`))}`; }

  if (!isLogin) return <main style={{ minHeight: "100vh", background: "#f1f5f9", padding: 20, display: "flex", alignItems: "center", justifyContent: "center" }}><form onSubmit={handleLogin} style={{ width: "100%", maxWidth: 380, background: "white", padding: 24, borderRadius: 18 }}><h1 style={{ color: "#0b2d6b" }}>Vishwakarma Travels</h1><p>Admin Login</p><input type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} /><button type="submit" style={{ width: "100%", padding: 13, borderRadius: 12, border: 0, background: "#0b2d6b", color: "white", fontWeight: "bold", marginTop: 15 }}>Login</button></form></main>;

  return <main style={{ minHeight: "100vh", background: "#f1f5f9", padding: 16 }}><div style={{ maxWidth: 1200, margin: "0 auto" }}><header style={{ background: "#0b2d6b", color: "white", padding: 20, borderRadius: 18, marginBottom: 16 }}><h1>Vishwakarma Travels Admin Dashboard</h1><p>Booking, Bill, WhatsApp aur Database Management</p><button onClick={logout}>Logout</button></header><section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 16 }}><div style={cardStyle}><p>Customers</p><h2>{customers.length}</h2></div><div style={cardStyle}><p>Vehicles</p><h2>{vehicles.length}</h2></div><div style={cardStyle}><p>Bookings</p><h2>{bookings.length}</h2></div></section><form onSubmit={handleSubmit} style={{ background: "white", padding: 18, borderRadius: 18, marginBottom: 16 }}><h2 style={{ color: "#0b2d6b" }}>New Booking</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}><select value={form.gender} onChange={(e) => updateForm("gender", e.target.value)} style={inputStyle}><option>Mr.</option><option>Mrs.</option><option>Ms.</option></select><input placeholder="Customer Name" value={form.customerName} onChange={(e) => updateForm("customerName", e.target.value)} style={inputStyle} required /><input placeholder="Customer WhatsApp Number" value={form.customerPhone} onChange={(e) => updateForm("customerPhone", cleanPhone(e.target.value))} style={inputStyle} required /><select value={form.service} onChange={(e) => updateForm("service", e.target.value)} style={inputStyle} required>{serviceOptions.map((x) => <option key={x} value={x}>{x}</option>)}</select><input placeholder="Pickup Location" value={form.pickup} onChange={(e) => updateForm("pickup", e.target.value)} style={inputStyle} required /><input placeholder="Drop Location" value={form.drop} onChange={(e) => updateForm("drop", e.target.value)} style={inputStyle} required /><input type="date" value={form.journeyDate} onChange={(e) => updateForm("journeyDate", e.target.value)} style={inputStyle} required /><input type="time" value={form.journeyTime} onChange={(e) => updateForm("journeyTime", e.target.value)} style={inputStyle} required /><input placeholder="Vehicle Number" value={form.vehicleNumber} onChange={(e) => fillVehicle(e.target.value)} style={inputStyle} /><input placeholder="Vehicle Type" value={form.vehicleType} onChange={(e) => updateForm("vehicleType", e.target.value)} style={inputStyle} /><input placeholder="Vehicle Model" value={form.vehicleModel} onChange={(e) => updateForm("vehicleModel", e.target.value)} style={inputStyle} /><input placeholder="Driver Name" value={form.driverName} onChange={(e) => updateForm("driverName", e.target.value)} style={inputStyle} /><input placeholder="Driver Mobile" value={form.driverMobile} onChange={(e) => updateForm("driverMobile", cleanPhone(e.target.value))} style={inputStyle} /><input type="number" placeholder="Total Fare" value={form.fare} onChange={(e) => updateForm("fare", e.target.value)} style={inputStyle} required /><input type="number" placeholder="Advance Paid" value={form.advance} onChange={(e) => updateForm("advance", e.target.value)} style={inputStyle} /></div><div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}><button disabled={loading} type="submit" style={{ padding: "14px 20px", background: "#15803d", color: "white", border: 0, borderRadius: 12, fontWeight: "bold" }}>{loading ? "Saving..." : "Save Booking + PDF Bill"}</button><button type="button" onClick={sendWhatsApp} style={{ padding: "14px 20px", background: "#25D366", color: "white", border: 0, borderRadius: 12, fontWeight: "bold" }}>Send WhatsApp</button></div></form><section style={{ background: "white", padding: 18, borderRadius: 18 }}><h2 style={{ color: "#0b2d6b" }}>Recent Bookings</h2><div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}><thead><tr style={{ background: "#0b2d6b", color: "white" }}><th style={thStyle}>Booking ID</th><th style={thStyle}>Customer</th><th style={thStyle}>Phone</th><th style={thStyle}>Route</th><th style={thStyle}>Date</th><th style={thStyle}>Fare</th><th style={thStyle}>Action</th></tr></thead><tbody>{bookings.map((b, i) => <tr key={b.booking_id || i}><td style={tdStyle}>{b.booking_id || "-"}</td><td style={tdStyle}>{b.customer_name || "-"}</td><td style={tdStyle}>{b.customer_phone || "-"}</td><td style={tdStyle}>{b.pickup || "-"} → {b.drop_location || "-"}</td><td style={tdStyle}>{b.journey_date || "-"}</td><td style={tdStyle}>₹{b.fare || 0}</td><td style={tdStyle}><button disabled={deletingBookingId === b.booking_id} onClick={() => deleteBooking(b.booking_id)} style={{ padding: "8px 12px", borderRadius: 10, border: 0, background: "#dc2626", color: "white", fontWeight: "bold" }}>{deletingBookingId === b.booking_id ? "Deleting..." : "Delete"}</button></td></tr>)}{bookings.length === 0 && <tr><td colSpan={7} style={{ padding: 20, textAlign: "center", color: "#64748b" }}>No booking found</td></tr>}</tbody></table></div></section></div></main>;
}
