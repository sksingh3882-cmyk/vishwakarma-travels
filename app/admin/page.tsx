"use client";

import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";

type Customer = { name?: string; mobile?: string; address?: string };
type Vehicle = {
  vehicleNumber?: string;
  vehicleType?: string;
  vehicleModel?: string;
  driverName?: string;
  driverMobile?: string;
  phone?: string;
  vehicle_number?: string;
  vehicle_type?: string;
  vehicle_model?: string;
  driver_name?: string;
  driver_mobile?: string;
};
type Booking = {
  booking_id?: string;
  customer_name?: string;
  customer_phone?: string;
  gender?: string;
  service?: string;
  pickup?: string;
  drop_location?: string;
  journey_date?: string;
  journey_time?: string;
  vehicle_type?: string;
  vehicle_model?: string;
  vehicle_number?: string;
  fare?: number;
  advance?: number;
  net_payable?: number;
  driver_name?: string;
  driver_mobile?: string;
  created_at?: string;
};
type BookingForm = {
  customerName: string;
  customerPhone: string;
  gender: string;
  service: string;
  pickup: string;
  drop: string;
  journeyDate: string;
  journeyTime: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleNumber: string;
  fare: string;
  advance: string;
  driverName: string;
  driverMobile: string;
};

const initialForm: BookingForm = {
  customerName: "",
  customerPhone: "",
  gender: "Mr.",
  service: "One Way Drop Pickup",
  pickup: "",
  drop: "",
  journeyDate: "",
  journeyTime: "",
  vehicleType: "Sedan",
  vehicleModel: "Desire",
  vehicleNumber: "",
  fare: "",
  advance: "0",
  driverName: "",
  driverMobile: "",
};

function cleanPhone(value: string) {
  let phone = String(value || "").replace(/\D/g, "");
  if (phone.startsWith("91") && phone.length === 12) phone = phone.slice(2);
  return phone.slice(0, 10);
}
function formatDate(value: string) {
  return value && value.includes("-") ? value.split("-").reverse().join("-") : value || "";
}
function escapeHtml(value: string) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchBooking, setSearchBooking] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastBookingId, setLastBookingId] = useState("");
  const [pendingBookingId, setPendingBookingId] = useState("");
  const [confirmMode, setConfirmMode] = useState<"save" | "whatsapp">("save");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [deletingBookingId, setDeletingBookingId] = useState("");
  const [activeView, setActiveView] = useState<"customers" | "vehicles" | "bookings" | "">("");

  const fareAmount = Number(form.fare || 0);
  const advanceAmount = Number(form.advance || 0);
  const netPayableAmount = fareAmount - advanceAmount;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";
  const headers = useMemo(
    () => ({ apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, "Content-Type": "application/json", Prefer: "return=representation" }),
    [supabaseKey]
  );

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("vt_admin_login") === "yes") setIsLogin(true);
  }, []);

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
      } catch (error) {
        console.log("Data load error:", error);
      }
    }
    loadData();
  }, [isLogin, supabaseUrl, supabaseKey, headers]);

  function updateForm<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password === adminPassword) {
      localStorage.setItem("vt_admin_login", "yes");
      setIsLogin(true);
    } else alert("Wrong admin password");
  }
  function logout() {
    localStorage.removeItem("vt_admin_login");
    setIsLogin(false);
    setPassword("");
  }

  function fillCustomer(value: string) {
    updateForm("customerName", value);
    const query = value.toLowerCase().trim();
    if (query.length < 2) return;
    const found = customers.find((c) => (c.name || "").toLowerCase().trim() === query || cleanPhone(c.mobile || "") === cleanPhone(query));
    if (!found) return;
    setForm((prev) => ({ ...prev, customerName: found.name || prev.customerName, customerPhone: found.mobile || prev.customerPhone, pickup: found.address || prev.pickup }));
  }

  function fillVehicle(value: string) {
    const vehicleNo = value.toUpperCase();
    updateForm("vehicleNumber", vehicleNo);
    if (vehicleNo.length < 2) return;
    const found = vehicles.find((v) => (v.vehicleNumber || v.vehicle_number || "").toUpperCase().includes(vehicleNo));
    if (!found) return;
    setForm((prev) => ({
      ...prev,
      vehicleNumber: found.vehicle_number || found.vehicleNumber || prev.vehicleNumber,
      vehicleType: found.vehicle_type || found.vehicleType || prev.vehicleType,
      vehicleModel: found.vehicle_model || found.vehicleModel || prev.vehicleModel,
      driverName: found.driver_name || found.driverName || prev.driverName,
      driverMobile: found.phone || found.driver_mobile || found.driverMobile || "",
    }));
  }

  function getCustomerDropSuggestions() {
    const phone = cleanPhone(form.customerPhone);
    const name = form.customerName.toLowerCase().trim();
    if (!phone && name.length < 2) return [];
    const drops = bookings
      .filter((b) => cleanPhone(b.customer_phone || "") === phone || (b.customer_name || "").toLowerCase().includes(name))
      .map((b) => b.drop_location || "")
      .filter(Boolean);
    return Array.from(new Set(drops)).slice(0, 6);
  }

  function buildWhatsAppMessage(bookingId: string) {
    const fare = Number(form.fare || 0);
    const advance = Number(form.advance || 0);
    const netPayable = fare - advance;
    const formattedTime = form.journeyTime ? form.journeyTime.trim().toUpperCase().replace(".", ":") : "";
    return `✅ Booking Confirmation

${form.gender} ${form.customerName},
Namaste, Your Booking is Confirmed.

Booking ID: ${bookingId}

Service: ${form.service}
Contact No: +91${cleanPhone(form.customerPhone)}

📍 Pickup: ${form.pickup}
📍 Drop: ${form.drop}
📅 Date: ${formatDate(form.journeyDate)}
⌚ Time: ${formattedTime}

🚕 Vehicle Details:
Vehicle Type: ${form.vehicleType}
Vehicle Model: ${form.vehicleModel}
Vehicle No: ${form.vehicleNumber}
Driver Name: ${form.driverName}
Driver Mobile: ${form.driverMobile}

💵 Fare Charges:
Fare: ₹${fare}
Advance Paid: ₹${advance}
Net Payable Amount: ₹${netPayable}

🌐 Visit- vishwakarma-travels-nine.vercel.app
              for next booking

Thank You For Choosing Vishwakarma Travels
Wish You A Very Happy Journey
           🙏🙏🙏`;
  }

  function openBillPdf(bookingId: string) {
    const fare = Number(form.fare || 0);
    const advance = Number(form.advance || 0);
    const netPayable = fare - advance;
    const billDate = new Date().toLocaleDateString("en-GB");
    const win = window.open("", "_blank");
    if (!win) {
      alert("Popup blocked hai. Browser me popup allow karo.");
      return;
    }
    const html = `<!doctype html><html><head><title>${escapeHtml(bookingId)} Invoice</title><style>@page{size:A4;margin:8mm}body{font-family:Arial;color:#0b1f4d;margin:0;padding:12px}.invoice{border:2px solid #0b2d6b;border-radius:10px;overflow:hidden}.header{display:flex;justify-content:space-between;gap:12px;padding:14px;border-bottom:2px solid #0b2d6b}.brand h1{margin:0;font-size:34px;color:#0b2d6b}.brand p{margin:4px 0;font-weight:bold}.invbox{border:2px solid #0b2d6b;border-radius:8px;min-width:180px;text-align:center;overflow:hidden}.invbox h2{margin:0;background:#0b2d6b;color:white;padding:8px}.invbox b{display:block;padding:10px;color:#c41212;font-size:22px}.sec{margin:10px;border:1px solid #0b2d6b;border-radius:8px;overflow:hidden}.secTitle{background:#0b2d6b;color:white;padding:8px 10px;font-weight:bold}.grid{display:grid;grid-template-columns:1fr 1fr}.col{padding:10px}.row{display:grid;grid-template-columns:130px 10px 1fr;margin:7px 0;font-size:14px}table{width:100%;border-collapse:collapse}th{background:#0b2d6b;color:white}td,th{border:1px solid #d1d5db;padding:8px}.right{text-align:right}.pay{margin:10px;background:#0b2d6b;color:white;padding:12px;font-size:26px;font-weight:bold;text-align:right}.footer{background:#0b2d6b;color:white;text-align:center;font-weight:bold;padding:10px}.note{margin:10px;border:1px dashed #0b2d6b;padding:10px;border-radius:8px;font-size:13px}@media print{body{padding:0}}</style></head><body><div class="invoice"><div class="header"><div class="brand"><h1>Vishwakarma Travels</h1><p>Jugsalai Jamshedpur</p><p>+91 7667989203</p></div><div class="invbox"><h2>INVOICE</h2><b>${escapeHtml(bookingId)}</b><p>Date: ${escapeHtml(billDate)}</p></div></div><div class="sec"><div class="grid"><div class="col"><div class="secTitle">BOOKING DETAILS</div><div class="row"><b>Client</b><span>:</span><span>${escapeHtml(form.gender)} ${escapeHtml(form.customerName)}</span></div><div class="row"><b>Contact</b><span>:</span><span>+91${escapeHtml(cleanPhone(form.customerPhone))}</span></div><div class="row"><b>Pickup</b><span>:</span><span>${escapeHtml(form.pickup)}</span></div><div class="row"><b>Drop</b><span>:</span><span>${escapeHtml(form.drop)}</span></div><div class="row"><b>Date/Time</b><span>:</span><span>${escapeHtml(formatDate(form.journeyDate))} ${escapeHtml(form.journeyTime)}</span></div></div><div class="col"><div class="secTitle">VEHICLE DETAILS</div><div class="row"><b>Type</b><span>:</span><span>${escapeHtml(form.vehicleType)}</span></div><div class="row"><b>Model</b><span>:</span><span>${escapeHtml(form.vehicleModel)}</span></div><div class="row"><b>Reg No.</b><span>:</span><span>${escapeHtml(form.vehicleNumber)}</span></div><div class="row"><b>Driver</b><span>:</span><span>${escapeHtml(form.driverName)}</span></div><div class="row"><b>Mobile</b><span>:</span><span>+91${escapeHtml(cleanPhone(form.driverMobile))}</span></div></div></div></div><div class="sec"><table><tr><th>FARE CHARGES</th><th>TYPE</th><th class="right">AMOUNT ₹</th></tr><tr><td>${escapeHtml(form.pickup)} to ${escapeHtml(form.drop)}</td><td>Per Trip</td><td class="right">${fare.toFixed(2)}</td></tr><tr><td>Advance Paid</td><td>-</td><td class="right">${advance.toFixed(2)}</td></tr><tr><td colspan="2" class="right"><b>Total Payable</b></td><td class="right"><b>${netPayable.toFixed(2)}</b></td></tr></table></div><div class="pay">TOTAL AMOUNT PAYABLE ₹ ${netPayable.toFixed(2)}</div><div class="note"><b>DECLARATION</b><br/>Book A Cab Atleast 24 Hour Before Travelling Otherwise Booking May Not Be Confirmed.<br/>After booking is confirmed, customer will have to make advance payment.<br/>Cancellation charge may apply.</div><div class="footer">THANK YOU & WISH YOU A VERY HAPPY JOURNEY</div></div><script>window.print();</script></body></html>`;
    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  async function saveBooking(bookingId: string) {
    const fare = Number(form.fare || 0);
    const advance = Number(form.advance || 0);
    const payload = {
      booking_id: bookingId,
      customer_name: form.customerName,
      customer_phone: cleanPhone(form.customerPhone),
      gender: form.gender,
      service: form.service,
      pickup: form.pickup,
      drop_location: form.drop,
      journey_date: form.journeyDate,
      journey_time: form.journeyTime,
      vehicle_type: form.vehicleType,
      vehicle_model: form.vehicleModel,
      vehicle_number: form.vehicleNumber,
      fare,
      advance,
      net_payable: fare - advance,
      driver_name: form.driverName,
      driver_mobile: cleanPhone(form.driverMobile),
    };
    const response = await fetch(`${supabaseUrl}/rest/v1/bookings`, { method: "POST", headers, body: JSON.stringify(payload) });
    if (!response.ok) {
      console.log("Booking save error:", await response.text());
      return false;
    }
    setBookings((prev) => [payload, ...prev]);
    return true;
  }

  async function saveCustomerIfNew() {
    const phone = cleanPhone(form.customerPhone);
    if (!supabaseUrl || !supabaseKey || phone.length !== 10 || !form.customerName.trim()) return;
    if (customers.some((c) => cleanPhone(c.mobile || "") === phone)) return;
    const payload = { name: form.customerName.trim(), mobile: phone, address: form.pickup.trim() };
    const response = await fetch(`${supabaseUrl}/rest/v1/customers`, { method: "POST", headers, body: JSON.stringify(payload) });
    if (response.ok) setCustomers((prev) => [payload, ...prev]);
  }

  async function saveVehicleIfNew() {
    const vehicleNo = form.vehicleNumber.trim().toUpperCase();
    if (!supabaseUrl || !supabaseKey || !vehicleNo) return;
    if (vehicles.some((v) => (v.vehicle_number || v.vehicleNumber || "").toUpperCase() === vehicleNo)) return;
    const payload = { vehicle_number: vehicleNo, vehicle_type: form.vehicleType.trim(), vehicle_model: form.vehicleModel.trim(), driver_name: form.driverName.trim(), phone: cleanPhone(form.driverMobile), route: `${form.pickup.trim()} to ${form.drop.trim()}`, status: "Active" };
    const response = await fetch(`${supabaseUrl}/rest/v1/vehicles`, { method: "POST", headers, body: JSON.stringify(payload) });
    if (response.ok) setVehicles((prev) => [payload, ...prev]);
  }

  function validateBookingForm() {
    if (!supabaseUrl || !supabaseKey) return alert("Supabase URL/KEY missing hai. Vercel Environment Variables check karo."), false;
    if (cleanPhone(form.customerPhone).length !== 10) return alert("Customer WhatsApp number 10 digit ka hona chahiye."), false;
    if (Number(form.fare || 0) <= 0) return alert("Total fare valid enter karo."), false;
    if (Number(form.advance || 0) > Number(form.fare || 0)) return alert("Advance fare se zyada nahi ho sakta."), false;
    return true;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateBookingForm()) return;
    setPendingBookingId(`VT-${Date.now()}`);
    setConfirmMode("save");
    setShowConfirmPopup(true);
  }

  function sendWhatsApp() {
    if (!validateBookingForm()) return;
    setPendingBookingId(lastBookingId || `VT-${Date.now()}`);
    setConfirmMode("whatsapp");
    setShowConfirmPopup(true);
  }

  async function confirmAndSubmit() {
    const bookingId = pendingBookingId || lastBookingId || `VT-${Date.now()}`;
    const phone = cleanPhone(form.customerPhone || "");
    if (phone.length !== 10) return alert("Customer WhatsApp number 10 digit ka hona chahiye.");
    setLoading(true);
    try {
      if (confirmMode === "save") {
        const saved = await saveBooking(bookingId);
        if (!saved) return alert("Booking database me save nahi hua. Supabase table/columns check karo.");
        await Promise.all([saveCustomerIfNew(), saveVehicleIfNew()]);
        openBillPdf(bookingId);
        setLastBookingId(bookingId);
      }
      window.location.href = `https://api.whatsapp.com/send?phone=91${phone}&text=${encodeURIComponent(buildWhatsAppMessage(bookingId))}`;
      setShowConfirmPopup(false);
    } catch (error) {
      console.log("Submit error:", error);
      alert("Booking confirm karte time error aaya.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteBooking(bookingId?: string) {
    if (!bookingId) return alert("Booking ID missing hai, delete nahi ho sakta.");
    if (!supabaseUrl || !supabaseKey) return alert("Supabase URL/KEY missing hai. Vercel Environment Variables check karo.");
    if (!window.confirm(`Do you want ${bookingId} delete permanently ?`)) return;
    setDeletingBookingId(bookingId);
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/bookings?booking_id=eq.${encodeURIComponent(bookingId)}`, { method: "DELETE", headers });
      if (!response.ok) return alert("Booking delete nahi hua. Supabase policy/table check karo.");
      setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
      alert("Booking deleted.");
    } finally {
      setDeletingBookingId("");
    }
  }

  const filteredBookings = bookings.filter((b) => {
    const search = searchBooking.toLowerCase();
    return (b.booking_id || "").toLowerCase().includes(search) || (b.customer_name || "").toLowerCase().includes(search) || (b.customer_phone || "").includes(search) || (b.pickup || "").toLowerCase().includes(search) || (b.drop_location || "").toLowerCase().includes(search);
  });

  function editBooking(b: Booking) {
    setForm({
      customerName: b.customer_name || "",
      customerPhone: b.customer_phone || "",
      gender: b.gender || "Mr.",
      service: b.service || "One Way Drop Pickup",
      pickup: b.pickup || "",
      drop: b.drop_location || "",
      journeyDate: b.journey_date || "",
      journeyTime: b.journey_time || "",
      vehicleType: b.vehicle_type || "Sedan",
      vehicleModel: b.vehicle_model || "Desire",
      vehicleNumber: b.vehicle_number || "",
      fare: String(b.fare || ""),
      advance: String(b.advance || "0"),
      driverName: b.driver_name || "",
      driverMobile: b.driver_mobile || "",
    });
    setLastBookingId(b.booking_id || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!isLogin) {
    return (
      <main style={loginPageStyle}>
        <form onSubmit={handleLogin} style={loginCardStyle}>
          <h1 style={{ margin: 0, color: "#0b2d6b", fontSize: 28 }}>Vishwakarma Travels</h1>
          <p style={{ color: "#64748b" }}>Admin Login</p>
          <input type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          <button type="submit" style={loginButtonStyle}>Login</button>
        </form>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      {showConfirmPopup && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <button type="button" onClick={() => setShowConfirmPopup(false)} style={modalCloseButton}>✕</button>
            <img src="/cars/popup_banner.png" alt="Vishwakarma Travels" style={modalBanner} />
            <div style={modalBody}>
              <h2 style={modalTitle}>Confirm Booking Details</h2>
              <div style={detailList}>
                <ConfirmRow label="Customer Name" value={form.customerName} />
                <ConfirmRow label="Mobile No." value={form.customerPhone} />
                <ConfirmRow label="Pickup Location" value={form.pickup} />
                <ConfirmRow label="Drop Location" value={form.drop} />
                <ConfirmRow label="Date" value={formatDate(form.journeyDate)} />
                <ConfirmRow label="Time" value={form.journeyTime} />
                <ConfirmRow label="Vehicle Type" value={form.vehicleType} />
                <ConfirmRow label="Vehicle Model" value={form.vehicleModel} />
                <ConfirmRow label="Driver Name" value={form.driverName} />
                <ConfirmRow label="Driver Mobile No." value={form.driverMobile} />
                <ConfirmRow label="Fare Charge" value={`₹ ${fareAmount}`} />
                <ConfirmRow label="Advance" value={`₹ ${advanceAmount}`} />
                <div style={netPayableRow}><b>Net Payable Amount</b><b>₹ {netPayableAmount}</b></div>
              </div>
            </div>
            <div style={modalActions}>
              <button type="button" onClick={() => setShowConfirmPopup(false)} style={cancelButton}>Cancel</button>
              <button type="button" disabled={loading} onClick={confirmAndSubmit} style={confirmButton}>{loading ? "Please wait..." : "Confirm & Submit"}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <header style={adminHeaderStyle}>
          <h1 style={{ margin: 0, fontSize: 28 }}>Vishwakarma Travels Admin Dashboard</h1>
          <p style={{ margin: "6px 0 0" }}>Booking, Bill, WhatsApp aur Database Management</p>
          <button onClick={logout} style={logoutButtonStyle}>Logout</button>
        </header>

        <section style={statsGridStyle}>
          <Stat title="Customers" value={customers.length} onClick={() => setActiveView("customers")} />
          <Stat title="Vehicles" value={vehicles.length} onClick={() => setActiveView("vehicles")} />
          <Stat title="Bookings" value={bookings.length} onClick={() => setActiveView("bookings")} />
        </section>

        {activeView && (
          <section style={panelStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "#0b2d6b" }}>{activeView === "customers" ? "Customers" : activeView === "vehicles" ? "Vehicles" : "Bookings"}</h2>
              <button type="button" onClick={() => setActiveView("")}>Close</button>
            </div>
            {activeView === "customers" && customers.map((c, i) => <p key={i}><b>{c.name || "-"}</b> — {c.mobile || "-"} — {c.address || "-"}</p>)}
            {activeView === "vehicles" && vehicles.map((v, i) => <p key={i}><b>{v.vehicleNumber || v.vehicle_number || "-"}</b> — {v.vehicleModel || v.vehicle_model || "-"} — {v.driverName || v.driver_name || "-"}</p>)}
            {activeView === "bookings" && bookings.map((b, i) => <p key={i}><b>{b.booking_id || "-"}</b> — {b.customer_name || "-"} — ₹{b.fare || 0}</p>)}
          </section>
        )}

        <form onSubmit={handleSubmit} style={formPanelStyle}>
          <h2 style={{ color: "#0b2d6b" }}>New Booking</h2>
          <div style={formGridStyle}>
            <select value={form.gender} onChange={(e) => updateForm("gender", e.target.value)} style={inputStyle}><option>Mr.</option><option>Mrs.</option><option>Ms.</option></select>
            <input placeholder="Customer Name" value={form.customerName} onChange={(e) => fillCustomer(e.target.value)} style={inputStyle} required />
            <input type="tel" inputMode="tel" placeholder="Customer WhatsApp Number" value={form.customerPhone} onChange={(e) => updateForm("customerPhone", e.target.value)} style={inputStyle} required />
            <input placeholder="Pickup Location" value={form.pickup} onChange={(e) => updateForm("pickup", e.target.value)} style={inputStyle} required />
            <input placeholder="Drop Location" value={form.drop} onChange={(e) => updateForm("drop", e.target.value)} style={inputStyle} required />
            {getCustomerDropSuggestions().length > 0 && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{getCustomerDropSuggestions().map((drop) => <button key={drop} type="button" onClick={() => updateForm("drop", drop)} style={suggestionButtonStyle}>{drop}</button>)}</div>}
            <input type="date" value={form.journeyDate} onChange={(e) => updateForm("journeyDate", e.target.value)} style={inputStyle} required />
            <input type="text" placeholder="Time e.g. 5:30 PM / 5.40 AM" value={form.journeyTime} onChange={(e) => updateForm("journeyTime", e.target.value)} style={inputStyle} required />
            <input placeholder="Vehicle Number" value={form.vehicleNumber} onChange={(e) => fillVehicle(e.target.value)} style={inputStyle} />
            <select value={form.vehicleType} onChange={(e) => updateForm("vehicleType", e.target.value)} style={inputStyle} required><option>Sedan</option><option>SUV</option><option>SUV With Carrier</option><option>Sedan With Carrier</option><option>Mini Passenger Bus</option></select>
            <select value={form.vehicleModel} onChange={(e) => updateForm("vehicleModel", e.target.value)} style={inputStyle} required><option>Desire</option><option>Ertiga</option><option>Innova</option><option>Innova Crysta</option><option>Ertiga With Carrier</option><option>Innova With Carrier</option><option>Crysta With Carrier</option><option>Force Traveller</option></select>
            <input placeholder="Driver Name" value={form.driverName} onChange={(e) => updateForm("driverName", e.target.value)} style={inputStyle} />
            <input type="tel" inputMode="tel" placeholder="Driver Mobile" value={form.driverMobile} onChange={(e) => updateForm("driverMobile", e.target.value)} style={inputStyle} />
            <select value={form.service} onChange={(e) => updateForm("service", e.target.value)} style={inputStyle} required><option>One Way Drop Pickup</option><option>Jamshedpur to Ranchi Airport Drop</option><option>Ranchi Airport to Jamshedpur Drop</option><option>Jamshedpur to Kolkata Airport Drop</option><option>Kolkata Airport to Jamshedpur Drop</option><option>Local Movment</option><option>Outstation Movment</option><option>Short Time Booking</option><option>Marriage Function Booking</option></select>
            <input type="number" placeholder="Total Fare" value={form.fare} onChange={(e) => updateForm("fare", e.target.value)} style={inputStyle} required />
            <input type="number" placeholder="Advance Paid" value={form.advance} onChange={(e) => updateForm("advance", e.target.value)} style={inputStyle} />
          </div>
          <div style={buttonRowStyle}>
            <button disabled={loading} type="submit" style={saveButtonStyle}>{loading ? "Saving..." : "Save Booking + PDF Bill"}</button>
            <button type="button" onClick={sendWhatsApp} style={whatsappButtonStyle}>Send WhatsApp</button>
          </div>
        </form>

        <section style={panelStyle}>
          <h2 style={{ color: "#0b2d6b" }}>Recent Bookings</h2>
          <input type="text" placeholder="Search booking by name, phone, pickup..." value={searchBooking} onChange={(e) => setSearchBooking(e.target.value)} style={searchInputStyle} />
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead><tr style={{ background: "#0b2d6b", color: "white" }}><th style={thStyle}>Booking ID</th><th style={thStyle}>Customer</th><th style={thStyle}>Phone</th><th style={thStyle}>Route</th><th style={thStyle}>Date</th><th style={thStyle}>Fare</th><th style={thStyle}>Action</th></tr></thead>
              <tbody>
                {filteredBookings.map((b, i) => (
                  <tr key={b.booking_id || i}><td style={tdStyle}>{b.booking_id || "-"}</td><td style={tdStyle}>{b.customer_name || "-"}</td><td style={tdStyle}>{b.customer_phone || "-"}</td><td style={tdStyle}>{b.pickup || "-"} → {b.drop_location || "-"}</td><td style={tdStyle}>{b.journey_date || "-"}</td><td style={tdStyle}>₹{b.fare || 0}</td><td style={tdStyle}><button type="button" onClick={() => editBooking(b)} style={editButtonStyle}>Edit</button><button type="button" onClick={() => openBillPdf(b.booking_id || "")} style={pdfButtonStyle}>PDF</button><button type="button" disabled={deletingBookingId === b.booking_id} onClick={() => deleteBooking(b.booking_id)} style={deleteButtonStyle}>{deletingBookingId === b.booking_id ? "Deleting..." : "Delete"}</button></td></tr>
                ))}
                {bookings.length === 0 && <tr><td colSpan={7} style={{ padding: 20, textAlign: "center", color: "#64748b" }}>No booking found</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return <div style={detailRow}><b>{label}</b><span>{value || "-"}</span></div>;
}
function Stat({ title, value, onClick }: { title: string; value: number; onClick: () => void }) {
  return <div onClick={onClick} style={statCardStyle}><p>{title}</p><h2>{value}</h2><b style={{ color: "#0b2d6b" }}>View all</b></div>;
}

const loginPageStyle: CSSProperties = { minHeight: "100vh", background: "#f1f5f9", padding: 20, display: "flex", alignItems: "center", justifyContent: "center" };
const loginCardStyle: CSSProperties = { width: "100%", maxWidth: 380, background: "white", padding: 24, borderRadius: 18, boxShadow: "0 8px 25px rgba(0,0,0,.12)" };
const loginButtonStyle: CSSProperties = { width: "100%", padding: 13, borderRadius: 12, border: 0, background: "#0b2d6b", color: "white", fontWeight: "bold", marginTop: 15 };
const pageStyle: CSSProperties = { minHeight: "100vh", background: "#f1f5f9", padding: 16 };
const adminHeaderStyle: CSSProperties = { background: "#0b2d6b", color: "white", padding: 20, borderRadius: 18, marginBottom: 16 };
const logoutButtonStyle: CSSProperties = { marginTop: 12, padding: "10px 16px", borderRadius: 10, border: 0, fontWeight: "bold" };
const statsGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 16 };
const statCardStyle: CSSProperties = { background: "white", padding: 16, borderRadius: 16, cursor: "pointer" };
const panelStyle: CSSProperties = { background: "white", padding: 18, borderRadius: 18, marginBottom: 16 };
const formPanelStyle: CSSProperties = { background: "white", padding: 18, borderRadius: 18, marginBottom: 16 };
const formGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 };
const inputStyle: CSSProperties = { padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", width: "100%" };
const suggestionButtonStyle: CSSProperties = { padding: "8px 10px", borderRadius: 10, border: "1px solid #0b2d6b", background: "white", color: "#0b2d6b", fontWeight: "bold" };
const buttonRowStyle: CSSProperties = { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 };
const saveButtonStyle: CSSProperties = { padding: "14px 20px", background: "#15803d", color: "white", border: 0, borderRadius: 12, fontWeight: "bold" };
const whatsappButtonStyle: CSSProperties = { padding: "14px 20px", background: "#25D366", color: "white", border: 0, borderRadius: 12, fontWeight: "bold" };
const searchInputStyle: CSSProperties = { width: "100%", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", marginBottom: 16, marginTop: 10 };
const thStyle: CSSProperties = { padding: 10, textAlign: "left" };
const tdStyle: CSSProperties = { padding: 10, borderBottom: "1px solid #e2e8f0" };
const editButtonStyle: CSSProperties = { padding: "8px 12px", borderRadius: 10, border: 0, background: "#2563eb", color: "white", fontWeight: "bold", cursor: "pointer", marginRight: 8 };
const pdfButtonStyle: CSSProperties = { padding: "8px 12px", borderRadius: 10, border: 0, background: "#059669", color: "white", fontWeight: "bold", cursor: "pointer", marginRight: 8 };
const deleteButtonStyle: CSSProperties = { padding: "8px 12px", borderRadius: 10, border: 0, background: "#dc2626", color: "white", fontWeight: "bold", cursor: "pointer" };
const modalOverlay: CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: 12 };
const modalCard: CSSProperties = { width: "100%", maxWidth: 560, maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 22, position: "relative", boxShadow: "0 24px 65px rgba(0,0,0,0.35)" };
const modalCloseButton: CSSProperties = { position: "absolute", top: 8, right: 8, width: 40, height: 40, borderRadius: "50%", border: 0, background: "white", color: "#0f172a", fontSize: 26, fontWeight: 900, cursor: "pointer", zIndex: 2, boxShadow: "0 6px 18px rgba(0,0,0,0.2)" };
const modalBanner: CSSProperties = { width: "100%", maxHeight: 150, objectFit: "cover", display: "block", borderRadius: "22px 22px 0 0" };
const modalBody: CSSProperties = { padding: "14px 18px 10px" };
const modalTitle: CSSProperties = { color: "#0b2d6b", fontSize: 22, margin: "0 0 10px", fontWeight: 950 };
const detailList: CSSProperties = { display: "grid", gap: 0 };
const detailRow: CSSProperties = { display: "grid", gridTemplateColumns: "155px 1fr", gap: 8, alignItems: "center", borderBottom: "1px solid #e2e8f0", padding: "6px 0", fontSize: 15, color: "#0f172a" };
const netPayableRow: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, padding: "11px 12px", borderRadius: 14, background: "#ecfdf5", border: "1px solid #86efac", color: "#15803d", fontSize: 17 };
const modalActions: CSSProperties = { position: "sticky", bottom: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 14, background: "white", borderTop: "1px solid #e2e8f0" };
const cancelButton: CSSProperties = { padding: "14px", borderRadius: 14, border: "2px solid #ef4444", background: "white", color: "#ef4444", fontSize: 17, fontWeight: 950, cursor: "pointer" };
const confirmButton: CSSProperties = { padding: "14px", borderRadius: 14, border: 0, background: "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontSize: 17, fontWeight: 950, cursor: "pointer" };

// Stable backup version
