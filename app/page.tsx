"use client";

export default function Home() {
  const phone = "917667989203";
  const whatsappText = "Hello Vishwakarma Travels, I would like to book a cab.";

  const services = [
    { icon: "✈️", title: "Airport Drop Pickup", text: "View Ranchi/Kolkata airport fare page", link: "/airport-drop" },
    { icon: "🚕", title: "Local Movement", text: "City ride and daily travel", link: "#booking" },
    { icon: "🛣️", title: "Outstation Movement", text: "Long route comfortable ride", link: "#booking" },
    { icon: "⏱️", title: "Short Time Booking", text: "Quick cab for short work", link: "#booking" },
    { icon: "🎉", title: "Marriage Function", text: "Event and family travel", link: "#booking" },
  ];

  const vehicles = [
    { name: "Sedan", detail: "Dzire, Etios, Amaze", price: "Best Price" },
    { name: "SUV", detail: "Ertiga, Innova", price: "Comfort Ride" },
    { name: "Premium", detail: "Crysta, Traveller", price: "Family Trip" },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const name = String(form.get("customerName") || "");
    const mobile = String(form.get("mobile") || "");
    const service = String(form.get("service") || "");
    const pickup = String(form.get("pickup") || "");
    const drop = String(form.get("drop") || "");
    const bookingDate = String(form.get("bookingDate") || "");
    const bookingTime = String(form.get("bookingTime") || "");

    const message = `Hello Vishwakarma Travels,\n\nI would like to book a cab.\n\nName: ${name}\nMobile: ${mobile}\nService: ${service}\nPickup: ${pickup}\nDrop: ${drop}\nDate: ${bookingDate}\nTime: ${bookingTime}`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <div style={heroOverlay}>
          <div style={topBar}>
            <div style={logoBox}>
              <div style={logoMark}>V</div>
              <div>
                <h1 style={logoTitle}>VISHWAKARMA</h1>
                <p style={logoSub}>TRAVELS</p>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 720, margin: "30px auto 0", textAlign: "center" }}>
            <h2 style={heroTitle}>Travel Made Easy</h2>
            <p style={heroSub}>Reliable cab service for Airport Drop Pickup, Local rides, Outstation travel, and Family bookings.</p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 22 }}>
              <a href={`tel:+${phone}`} style={callButton}>Call Now</a>
              <a href={`https://wa.me/${phone}?text=${encodeURIComponent(whatsappText)}`} style={whatsButton}>Book on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      <section id="booking" style={bookingWrap}>
        <form onSubmit={handleSubmit} style={bookingCard}>
          <h2 style={sectionTitle}>Book Your Ride</h2>
          <p style={mutedText}>Fill details and send booking request directly on WhatsApp.</p>

          <input name="customerName" placeholder="Your Name" style={inputStyle} required />
          <input name="mobile" placeholder="Mobile Number" style={inputStyle} required />

          <select name="service" style={inputStyle} required>
            <option value="">Select Service</option>
            <option>Airport Drop Pickup</option>
            <option>Local Movement</option>
            <option>Outstation Movement</option>
            <option>Short Time Booking</option>
            <option>Marriage Function Booking</option>
            <option>Tour Package Service</option>
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

          <button type="submit" style={searchButton}>Send Booking On WhatsApp</button>
        </form>
      </section>

      <section style={contentSection}>
        <h2 style={sectionTitle}>Our Services</h2>
        <div style={gridStyle}>
          {services.map((item) => (
            <a key={item.title} href={item.link} style={serviceCard}>
              <div style={serviceIcon}>{item.icon}</div>
              <h3 style={{ margin: "10px 0 6px", color: "#0b2d6b" }}>{item.title}</h3>
              <p style={mutedText}>{item.text}</p>
              {item.link === "/airport-drop" && <b style={openText}>Open Airport Page →</b>}
            </a>
          ))}
        </div>
      </section>

      <section style={contentSection}>
        <h2 style={sectionTitle}>Available Vehicles</h2>
        <div style={{ display: "grid", gap: 14 }}>
          {vehicles.map((vehicle) => (
            <div key={vehicle.name} style={vehicleCard}>
              <div style={carIcon}>🚘</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: "#0f172a" }}>{vehicle.name}</h3>
                <p style={{ margin: "4px 0", color: "#64748b" }}>{vehicle.detail}</p>
                <b style={{ color: "#f97316" }}>{vehicle.price}</b>
              </div>
              <a href={`https://wa.me/${phone}?text=${encodeURIComponent("Hello Vishwakarma Travels, I would like to book a " + vehicle.name + " cab.")}`} style={smallBookButton}>Book</a>
            </div>
          ))}
        </div>
      </section>

      <section style={helpCard}>
        <h2 style={{ margin: 0 }}>Need Help?</h2>
        <p>Call or WhatsApp anytime for cab booking.</p>
        <a href={`tel:+${phone}`} style={{ color: "white", fontWeight: "bold", fontSize: 20, textDecoration: "none" }}>+91 7667989203</a>
      </section>

      <footer style={{ textAlign: "center", padding: "25px 18px 40px", color: "#475569" }}>
        <b>Vishwakarma Travels</b>
        <p>Jugsalai, Jamshedpur</p>
      </footer>
    </main>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#f4f7fb", fontFamily: "Arial", color: "#0f172a" };
const heroStyle: React.CSSProperties = { background: "linear-gradient(135deg,#dbeafe,#fff7ed)", padding: "18px 14px 90px" };
const heroOverlay: React.CSSProperties = { maxWidth: 1050, margin: "0 auto", background: "linear-gradient(135deg,rgba(11,45,107,.94),rgba(249,115,22,.82))", color: "white", borderRadius: 28, padding: "20px 16px 70px", boxShadow: "0 18px 45px rgba(15,23,42,.25)" };
const topBar: React.CSSProperties = { display: "flex", alignItems: "center" };
const logoBox: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10 };
const logoMark: React.CSSProperties = { width: 52, height: 52, borderRadius: "14px 6px 14px 6px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,#ff6b00,#ff7a1a)", color: "white", fontSize: 34, fontWeight: 950, transform: "skew(-10deg)" };
const logoTitle: React.CSSProperties = { margin: 0, color: "#f97316", fontSize: "clamp(21px,4vw,32px)", lineHeight: .95, fontWeight: 950 };
const logoSub: React.CSSProperties = { margin: 0, color: "#ffffff", fontSize: "clamp(17px,3vw,25px)", fontWeight: 950, lineHeight: 1 };
const heroTitle: React.CSSProperties = { fontSize: "clamp(36px,8vw,62px)", lineHeight: 1, margin: "18px 0 12px", fontWeight: 900 };
const heroSub: React.CSSProperties = { fontSize: 17, lineHeight: 1.5, margin: "0 auto", maxWidth: 650, opacity: .95 };
const callButton: React.CSSProperties = { background: "white", color: "#0b2d6b", padding: "14px 20px", borderRadius: 14, textDecoration: "none", fontWeight: "bold" };
const whatsButton: React.CSSProperties = { background: "#22c55e", color: "white", padding: "14px 20px", borderRadius: 14, textDecoration: "none", fontWeight: "bold" };
const bookingWrap: React.CSSProperties = { maxWidth: 760, margin: "-72px auto 18px", padding: "0 16px" };
const bookingCard: React.CSSProperties = { display: "grid", gap: 13, background: "rgba(255,255,255,.96)", backdropFilter: "blur(10px)", padding: 20, borderRadius: 26, boxShadow: "0 18px 45px rgba(15,23,42,.18)", border: "1px solid #e2e8f0" };
const inputStyle: React.CSSProperties = { padding: "15px", borderRadius: 15, border: "1px solid #cbd5e1", fontSize: 16, width: "100%", boxSizing: "border-box", background: "white" };
const dateTimeGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12 };
const dateTimeBox: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "12px 13px", borderRadius: 18, border: "1px solid #fed7aa", background: "linear-gradient(135deg,#fff7ed,#ffffff)", boxShadow: "0 8px 18px rgba(249,115,22,.12)" };
const dateTimeIcon: React.CSSProperties = { width: 44, height: 44, borderRadius: 14, display: "grid", placeItems: "center", background: "#f97316", color: "white", fontSize: 22, flexShrink: 0 };
const dateTimeContent: React.CSSProperties = { display: "grid", gap: 4, flex: 1 };
const dateTimeLabel: React.CSSProperties = { color: "#0b2d6b", fontSize: 13 };
const dateTimeInput: React.CSSProperties = { border: 0, outline: 0, background: "transparent", color: "#0f172a", fontSize: 16, fontWeight: 700, width: "100%" };
const searchButton: React.CSSProperties = { background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", padding: 16, border: 0, borderRadius: 16, fontSize: 18, fontWeight: "bold" };
const contentSection: React.CSSProperties = { maxWidth: 1050, margin: "0 auto", padding: "20px 16px" };
const sectionTitle: React.CSSProperties = { textAlign: "center", fontSize: 28, margin: "5px 0 6px", color: "#0b2d6b" };
const mutedText: React.CSSProperties = { color: "#64748b", margin: 0, lineHeight: 1.45 };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginTop: 18 };
const serviceCard: React.CSSProperties = { display: "block", background: "white", padding: 16, borderRadius: 20, boxShadow: "0 8px 20px rgba(15,23,42,.08)", border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit" };
const serviceIcon: React.CSSProperties = { width: 48, height: 48, borderRadius: 16, background: "#fff7ed", display: "grid", placeItems: "center", fontSize: 24 };
const openText: React.CSSProperties = { display: "inline-block", marginTop: 10, color: "#f97316", fontSize: 14 };
const vehicleCard: React.CSSProperties = { display: "flex", alignItems: "center", gap: 13, background: "white", padding: 15, borderRadius: 20, boxShadow: "0 8px 20px rgba(15,23,42,.08)", border: "1px solid #e2e8f0" };
const carIcon: React.CSSProperties = { width: 58, height: 58, borderRadius: 18, display: "grid", placeItems: "center", background: "#eff6ff", fontSize: 28 };
const smallBookButton: React.CSSProperties = { background: "#0b2d6b", color: "white", padding: "10px 14px", borderRadius: 14, textDecoration: "none", fontWeight: "bold" };
const helpCard: React.CSSProperties = { maxWidth: 1000, margin: "18px auto", padding: 22, borderRadius: 24, background: "linear-gradient(135deg,#0b2d6b,#1d4ed8)", color: "white" };
