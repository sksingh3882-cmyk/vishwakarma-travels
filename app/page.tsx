"use client";
import { useState, type CSSProperties, type FormEvent } from "react";
const phone = "917667989203";

type BookingData = {
  name: string;
  mobile: string;
  service: string;
  vehicle: string;
  pickup: string;
  drop: string;
  bookingDate: string;
  bookingTime: string;
  message: string;
};

export default function Home() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const services = [
    { icon: "✈️", title: "One Way Drop Pickup", text: "Ranchi / Kolkata airport and city drop", link: "/airport-drop" },
    { icon: "🚕", title: "Local Movement", text: "Jamshedpur city ride and daily travel", link: "#booking" },
    { icon: "🛣️", title: "Outstation Movement", text: "Comfortable long route cab service", link: "#booking" },
    { icon: "⏱️", title: "Short Time Booking", text: "Quick cab for short work and meetings", link: "#booking" },
    { icon: "🎉", title: "Marriage Function", text: "Family, event and wedding travel", link: "#booking" },
  ];

  const vehicles = [
    { name: "Dzire", detail: "4 Seats • Best for city and airport", price: "Best Price", image: "/cars/dzire.png" },
    { name: "Ertiga", detail: "6 Seats • Family comfort ride", price: "Comfort Ride", image: "/cars/ertiga.jpg" },
    { name: "Innova", detail: "6 Seats • Outstation travel", price: "Premium Ride", image: "/cars/innova.png" },
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const name = String(form.get("customerName") || "");
    const mobile = String(form.get("mobile") || "");
    const service = String(form.get("service") || "");
    const vehicle = String(form.get("vehicle") || "");
    const pickup = String(form.get("pickup") || "");
    const drop = String(form.get("drop") || "");
    const bookingDate = String(form.get("bookingDate") || "");
    const bookingTime = String(form.get("bookingTime") || "");

    const message = `Hello Vishwakarma Travels,

I would like to book a cab.

Name: ${name}
Mobile: ${mobile}
Service: ${service}
Vehicle: ${vehicle}
Pickup: ${pickup}
Drop: ${drop}
Date: ${bookingDate}
Time: ${bookingTime}

Please share the booking confirmation details.

Thank you.`;

    setBookingData({ name, mobile, service, vehicle, pickup, drop, bookingDate, bookingTime, message });
    setShowConfirm(true);
  }

  async function confirmAndSubmit() {
    if (!bookingData) return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/rest/v1/customers`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({ name: bookingData.name, mobile: bookingData.mobile, address: bookingData.pickup }),
      });

      await fetch(`${supabaseUrl}/rest/v1/bookings`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          customer_name: bookingData.name,
          mobile: bookingData.mobile,
          service: bookingData.service,
          vehicle_type: bookingData.vehicle,
          vehicle_model: bookingData.vehicle,
          pickup: bookingData.pickup,
          drop_location: bookingData.drop,
          booking_date: `${bookingData.bookingDate} ${bookingData.bookingTime}`,
          address: bookingData.pickup,
          fare: "",
          status: "Pending",
        }),
      });
    }

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(bookingData.message)}`, "_blank");
    setShowConfirm(false);
  }
  
  return (
    <main style={pageStyle}>
      {showConfirm && bookingData && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <button type="button" onClick={() => setShowConfirm(false)} style={modalCloseButton}>
              ✕
            </button>

            <img src="/cars/popup_banner.png" alt="Vishwakarma Travels" style={modalBanner} />

            <div style={modalBody}>
              <h2 style={modalTitle}>Please Confirm Booking Details</h2>

              <div style={detailList}>
                <div style={detailRow}><span style={detailIcon}>👤</span><b>Name</b><span>:</span><span>{bookingData.name}</span></div>
                <div style={detailRow}><span style={detailIcon}>📱</span><b>Mobile</b><span>:</span><span>{bookingData.mobile}</span></div>
                <div style={detailRow}><span style={detailIcon}>⚙️</span><b>Service</b><span>:</span><span>{bookingData.service}</span></div>
                <div style={detailRow}><span style={detailIcon}>🚘</span><b>Vehicle</b><span>:</span><span>{bookingData.vehicle}</span></div>
                <div style={detailRow}><span style={detailIcon}>📍</span><b>Pickup</b><span>:</span><span>{bookingData.pickup}</span></div>
                <div style={detailRow}><span style={detailIcon}>📍</span><b>Drop</b><span>:</span><span>{bookingData.drop}</span></div>
                <div style={detailRow}><span style={detailIcon}>📅</span><b>Date</b><span>:</span><span>{bookingData.bookingDate}</span></div>
                <div style={detailRow}><span style={detailIcon}>🕘</span><b>Time</b><span>:</span><span>{bookingData.bookingTime}</span></div>
              </div>

              <div style={modalActions}>
                <button type="button" onClick={() => setShowConfirm(false)} style={cancelButton}>Cancel</button>
                <button type="button" onClick={confirmAndSubmit} style={confirmButton}>Confirm & Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header style={headerStyle}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={logoMark}>V</div>
          <div>
            <h1 style={logoTitle}>VISHWAKARMA</h1>
            <p style={logoSub}>TRAVELS</p>
          </div>
        </a>
      </header>

      <section style={heroStyle}>
        <img
          src="/cars/banner.jpg"
          alt="Vishwakarma Travels Banner"
          style={{
            width: "100%",
            borderRadius: 28,
            display: "block",
            boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
          }}
        />
      </section>

      <section id="booking" style={bookingWrap}>
        <form onSubmit={handleSubmit} style={bookingCard}>
          <h2 style={sectionTitle}>Book Your Ride</h2>
          <p style={mutedText}>For Booking Please Fill The Details Below.</p>

          <input name="customerName" placeholder="Your Name" style={inputStyle} required />
          <input name="mobile" placeholder="Mobile Number" style={inputStyle} required />

          <select name="service" style={inputStyle} required>
            <option value="">Select Service</option>
            <option>One Way Drop Pickup</option>
            <option>Same Day Fair</option>
            <option>Local Movement</option>
            <option>Outstation Movement</option>
            <option>Short Time Booking</option>
            <option>Marriage Function Booking</option>
            <option>Tour Package Service</option>
          </select>

          <select name="vehicle" style={inputStyle} required>
            <option value="">Select Vehicle</option>
            <option>Dzire</option>
            <option>Ertiga</option>
            <option>Innova</option>
            <option>Innova Crysta</option>
            <option>Ertiga With Carrier</option>
            <option>Innova With Carrier</option>
            <option>Crysta With Carrier</option>
            <option>Traveller</option>
          </select>

          <input name="pickup" placeholder="Pickup Location" style={inputStyle} required />
          <input name="drop" placeholder="Drop Location" style={inputStyle} required />

          <div style={dateTimeGrid}>
            <label style={dateTimeBox}>
              <span style={dateTimeIcon}>📅</span>
              <span style={dateTimeContent}>
                <b style={dateTimeLabel}>Pickup Date</b>
                <input type="date" name="bookingDate" style={dateTimeInput} required />
              </span>
            </label>
            <label style={dateTimeBox}>
              <span style={dateTimeIcon}>⏰</span>
              <span style={dateTimeContent}>
                <b style={dateTimeLabel}>Pickup Time</b>
                <input type="time" name="bookingTime" style={dateTimeInput} required />
              </span>
            </label>
          </div>

          <button type="submit" style={searchButton}>Send Booking Request</button>
        </form>
      </section>

      <section style={contentSection}>
        <h2 style={sectionTitle}>Our Services</h2>
        <div style={gridStyle}>
          {services.map((item) => (
            <a key={item.title} href={item.link} style={serviceCard}>
              <div style={serviceIcon}>{item.icon}</div>
              <h3 style={cardTitle}>{item.title}</h3>
              <p style={mutedText}>{item.text}</p>
              {item.link === "/airport-drop" && <b style={openText}>Open One Way Page →</b>}
            </a>
          ))}
        </div>
      </section>

      <section style={contentSection}>
        <h2 style={sectionTitle}>Available Vehicles</h2>
        <div style={vehicleGrid}>
          {vehicles.map((vehicle) => (
            <div key={vehicle.name} style={vehicleCard}>
              <div style={vehicleImageBox}>
                <img src={vehicle.image} alt={vehicle.name} style={vehiclePhoto} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: "#0b2d6b", fontSize: 24 }}>{vehicle.name}</h3>
                <p style={{ margin: "6px 0", color: "#64748b" }}>{vehicle.detail}</p>
                <b style={{ color: "#f97316" }}>{vehicle.price}</b>
              </div>
              <a href={`https://wa.me/${phone}?text=${encodeURIComponent("Hello Vishwakarma Travels, I would like to book a " + vehicle.name + " cab.")}`} style={smallBookButton}>Book</a>
            </div>
          ))}
        </div>
      </section>

      <section style={helpCard}>
        <h2 style={{ margin: 0 }}>Need Help?</h2>
        <p>Call Or Whatsapp.</p>
        <a href={`tel:+${phone}`} style={{ color: "white", fontWeight: "bold", fontSize: 20, textDecoration: "none" }}>+91 7667989203</a>
      </section>

      <footer style={footerStyle}>
        <b>Vishwakarma Travels</b>
        <p style={{ margin: "5px 0 0" }}>Jugsalai, Jamshedpur</p>
      </footer>
    </main>
  );
}

const pageStyle: CSSProperties = { minHeight: "100vh", background: "#f4f7fb", fontFamily: "Arial, sans-serif", color: "#0f172a" };
const headerStyle: CSSProperties = { maxWidth: 1120, margin: "0 auto", padding: "16px", display: "flex", alignItems: "center" };
const logoMark: CSSProperties = { width: 52, height: 52, borderRadius: "14px 6px 14px 6px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,#ff6b00,#ff7a1a)", color: "white", fontSize: 34, fontWeight: 950, transform: "skew(-10deg)", boxShadow: "0 10px 22px rgba(249,115,22,.24)" };
const logoTitle: CSSProperties = { margin: 0, color: "#f97316", fontSize: "clamp(21px,4vw,32px)", lineHeight: .95, fontWeight: 950, letterSpacing: .5 };
const logoSub: CSSProperties = { margin: 0, color: "#0b2d6b", fontSize: "clamp(17px,3vw,25px)", fontWeight: 950, lineHeight: 1 };
const heroStyle: CSSProperties = { maxWidth: 1120, margin: "0 auto", padding: "0 16px 88px" };
const bookingWrap: CSSProperties = { maxWidth: 760, margin: "-72px auto 18px", padding: "0 16px" };
const bookingCard: CSSProperties = { display: "grid", gap: 13, background: "rgba(255,255,255,.97)", backdropFilter: "blur(10px)", padding: 20, borderRadius: 26, boxShadow: "0 18px 45px rgba(15,23,42,.18)", border: "1px solid #e2e8f0" };
const inputStyle: CSSProperties = { padding: "15px", borderRadius: 15, border: "1px solid #cbd5e1", fontSize: 16, width: "100%", boxSizing: "border-box", background: "white" };
const dateTimeGrid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12 };
const dateTimeBox: CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "14px", borderRadius: 18, border: "1px solid #fed7aa", background: "linear-gradient(135deg,#fff7ed,#ffffff)", boxShadow: "0 8px 18px rgba(249,115,22,.12)" };
const dateTimeIcon: CSSProperties = { width: 46, height: 46, borderRadius: 14, display: "grid", placeItems: "center", background: "#f97316", color: "white", fontSize: 23, flexShrink: 0 };
const dateTimeContent: CSSProperties = { display: "grid", gap: 5, flex: 1 };
const dateTimeLabel: CSSProperties = { color: "#0b2d6b", fontSize: 17, fontWeight: 950 };
const dateTimeInput: CSSProperties = { border: 0, outline: 0, background: "transparent", color: "#0f172a", fontSize: 17, fontWeight: 800, width: "100%" };
const searchButton: CSSProperties = { background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", padding: 16, border: 0, borderRadius: 16, fontSize: 18, fontWeight: 950 };
const contentSection: CSSProperties = { maxWidth: 1120, margin: "0 auto", padding: "22px 16px" };
const sectionTitle: CSSProperties = { textAlign: "center", fontSize: 30, margin: "5px 0 6px", color: "#0b2d6b" };
const mutedText: CSSProperties = { color: "#64748b", margin: 0, lineHeight: 1.45 };
const gridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginTop: 18 };
const serviceCard: CSSProperties = { display: "block", background: "white", padding: 17, borderRadius: 20, boxShadow: "0 8px 20px rgba(15,23,42,.08)", border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit" };
const serviceIcon: CSSProperties = { width: 50, height: 50, borderRadius: 16, background: "#fff7ed", display: "grid", placeItems: "center", fontSize: 25 };
const cardTitle: CSSProperties = { margin: "10px 0 6px", color: "#0b2d6b" };
const openText: CSSProperties = { display: "inline-block", marginTop: 10, color: "#f97316", fontSize: 14 };
const vehicleGrid: CSSProperties = { display: "grid", gap: 14 };
const vehicleCard: CSSProperties = { display: "flex", alignItems: "center", gap: 14, background: "white", padding: 14, borderRadius: 22, boxShadow: "0 8px 20px rgba(15,23,42,.08)", border: "1px solid #e2e8f0" };
const vehicleImageBox: CSSProperties = { width: 92, height: 70, borderRadius: 18, display: "grid", placeItems: "center", background: "#eff6ff", overflow: "hidden", flexShrink: 0 };
const vehiclePhoto: CSSProperties = { width: "100%", height: "100%", objectFit: "contain", display: "block" };
const smallBookButton: CSSProperties = { background: "#0b2d6b", color: "white", padding: "10px 14px", borderRadius: 14, textDecoration: "none", fontWeight: 950 };
const helpCard: CSSProperties = { maxWidth: 1088, margin: "18px auto", padding: 22, borderRadius: 24, background: "linear-gradient(135deg,#0b2d6b,#1d4ed8)", color: "white" };
const footerStyle: CSSProperties = { textAlign: "center", padding: "25px 18px 40px", color: "#475569" };
const modalOverlay: CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 14 };
const modalCard: CSSProperties = { width: "100%", maxWidth: 920, maxHeight: "92vh", overflowY: "auto", background: "white", borderRadius: 24, position: "relative", boxShadow: "0 22px 60px rgba(0,0,0,0.35)" };
const modalCloseButton: CSSProperties = { position: "absolute", top: 12, right: 12, width: 44, height: 44, borderRadius: "50%", border: 0, background: "white", color: "#0f172a", fontSize: 28, fontWeight: 900, cursor: "pointer", zIndex: 2, boxShadow: "0 6px 18px rgba(0,0,0,0.2)" };
const modalBanner: CSSProperties = { width: "100%", display: "block" };
const modalBody: CSSProperties = { padding: "22px 26px 26px" };
const modalTitle: CSSProperties = { color: "#0b2d6b", fontSize: "clamp(23px,4vw,34px)", margin: "0 0 18px", fontWeight: 950 };
const detailList: CSSProperties = { display: "grid", gap: 0 };
const detailRow: CSSProperties = { display: "grid", gridTemplateColumns: "36px minmax(86px,140px) 16px 1fr", gap: 10, alignItems: "center", borderBottom: "1px solid #e2e8f0", padding: "11px 0", fontSize: "clamp(16px,3.4vw,22px)", color: "#0f172a" };
const detailIcon: CSSProperties = { color: "#0b57ff", fontSize: 23 };
const modalActions: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 24 };
const cancelButton: CSSProperties = { padding: "15px", borderRadius: 16, border: "2px solid #ef4444", background: "white", color: "#ef4444", fontSize: "clamp(16px,3vw,22px)", fontWeight: 950, cursor: "pointer" };
const confirmButton: CSSProperties = { padding: "15px", borderRadius: 16, border: 0, background: "linear-gradient(135deg,#0b57ff,#0052cc)", color: "white", fontSize: "clamp(16px,3vw,22px)", fontWeight: 950, cursor: "pointer" };
