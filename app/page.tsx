"use client";

export default function Home() {
  const phone = "917667989203";
  const whatsappText = "Namaste Vishwakarma Travels, mujhe cab booking karni hai.";

  const services = [
    { icon: "✈️", title: "Airport Drop Pickup", text: "Ranchi/Kolkata airport rate page dekhein", link: "/airport-drop" },
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
    const dateTime = String(form.get("dateTime") || "");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/rest/v1/customers`, {
        method: "POST",
        headers: {
          apikey: supabaseKey || "",
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({ name, mobile, address: pickup }),
      });

      await fetch(`${supabaseUrl}/rest/v1/bookings`, {
        method: "POST",
        headers: {
          apikey: supabaseKey || "",
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          customer_name: name,
          mobile,
          service,
          pickup,
          drop_location: drop,
          booking_date: dateTime,
          address: pickup,
          fare: "",
          status: "Pending",
        }),
      });
    }

    const message = `Namaste Vishwakarma Travels,\n\nI want to book a cab.\n\nName: ${name}\nMobile: ${mobile}\nService: ${service}\nPickup: ${pickup}\nDrop: ${drop}\nDate & Time: ${dateTime}\n\nPlease send me the booking confirmation.\n\nVisit vishwakarma-travels-nine.vercel.app\nfor next booking`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <main style={pageStyle}>
      <a href={`https://wa.me/${phone}?text=${encodeURIComponent(whatsappText)}`} style={floatingWhatsApp}>WhatsApp</a>

      <section style={heroStyle}>
        <div style={heroOverlay}>
          <div style={topBar}>
            <div style={logoBox}>
              <div style={logoIcon}>🚖</div>
              <div>
                <h1 style={{ margin: 0, fontSize: 25 }}>Vishwakarma Travels</h1>
                <p style={{ margin: 0, fontSize: 12, opacity: 0.9 }}>Safe Journey, Happy Journey</p>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 720, margin: "22px auto 0", textAlign: "center" }}>
            <p style={badgeStyle}>Cab Booking Service • Jamshedpur</p>
            <h2 style={heroTitle}>Travel Made Easy</h2>
            <p style={heroSub}>Airport Drop Pickup, Local, Outstation aur Family Booking ke liye reliable cab service.</p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 22 }}>
              <a href={`tel:+${phone}`} style={callButton}>Call Now</a>
              <a href="/airport-drop" style={airportButton}>Airport Rates</a>
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
          <input type="datetime-local" name="dateTime" style={inputStyle} required />

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
              <a href={`https://wa.me/${phone}?text=${encodeURIComponent("Namaste Vishwakarma Travels, mujhe " + vehicle.name + " cab book karni hai.")}`} style={smallBookButton}>Book</a>
            </div>
          ))}
        </div>
      </section>

      <section style={helpCard}>
        <h2 style={{ margin: 0 }}>Need Help?</h2>
        <p>Call or WhatsApp anytime for cab booking.</p>
        <a href={`tel:+${phone}`} style={{ color: "white", fontWeight: "bold", fontSize: 20, textDecoration: "none" }}>+91 7667989203</a>
      </section>

      <footer style={{ textAlign: "center", padding: "25px 18px 90px", color: "#475569" }}>
        <b>Vishwakarma Travels</b>
        <p>Jugsalai, Jamshedpur</p>
      </footer>
    </main>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#f4f7fb", fontFamily: "Arial", color: "#0f172a" };
const heroStyle: React.CSSProperties = { background: "linear-gradient(135deg,#dbeafe,#fff7ed)", padding: "18px 14px 90px" };
const heroOverlay: React.CSSProperties = { maxWidth: 1050, margin: "0 auto", background: "linear-gradient(135deg,rgba(11,45,107,.94),rgba(249,115,22,.82))", color: "white", borderRadius: 28, padding: "20px 16px 70px", boxShadow: "0 18px 45px rgba(15,23,42,.25)" };
const topBar: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const logoBox: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12 };
const logoIcon: React.CSSProperties = { width: 52, height: 52, borderRadius: 18, display: "grid", placeItems: "center", background: "white", color: "#0b2d6b", fontSize: 25 };
const badgeStyle: React.CSSProperties = { display: "inline-block", background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.35)", padding: "8px 13px", borderRadius: 999, fontWeight: "bold" };
const heroTitle: React.CSSProperties = { fontSize: "clamp(36px,8vw,62px)", lineHeight: 1, margin: "18px 0 12px", fontWeight: 900 };
const heroSub: React.CSSProperties = { fontSize: 17, lineHeight: 1.5, margin: "0 auto", maxWidth: 650, opacity: .95 };
const callButton: React.CSSProperties = { background: "white", color: "#0b2d6b", padding: "14px 20px", borderRadius: 14, textDecoration: "none", fontWeight: "bold" };
const airportButton: React.CSSProperties = { background: "#0b2d6b", color: "white", padding: "14px 20px", borderRadius: 14, textDecoration: "none", fontWeight: "bold", border: "1px solid rgba(255,255,255,.35)" };
const whatsButton: React.CSSProperties = { background: "#22c55e", color: "white", padding: "14px 20px", borderRadius: 14, textDecoration: "none", fontWeight: "bold" };
const bookingWrap: React.CSSProperties = { maxWidth: 760, margin: "-72px auto 18px", padding: "0 16px" };
const bookingCard: React.CSSProperties = { display: "grid", gap: 13, background: "rgba(255,255,255,.96)", backdropFilter: "blur(10px)", padding: 20, borderRadius: 26, boxShadow: "0 18px 45px rgba(15,23,42,.18)", border: "1px solid #e2e8f0" };
const inputStyle: React.CSSProperties = { padding: "15px", borderRadius: 15, border: "1px solid #cbd5e1", fontSize: 16, width: "100%", boxSizing: "border-box", background: "white" };
const searchButton: React.CSSProperties = { background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", padding: 16, border: 0, borderRadius: 16, fontSize: 18, fontWeight: "bold", boxShadow: "0 10px 20px rgba(249,115,22,.25)" };
const contentSection: React.CSSProperties = { maxWidth: 1050, margin: "0 auto", padding: "20px 16px" };
const sectionTitle: React.CSSProperties = { textAlign: "center", fontSize: 28, margin: "5px 0 6px", color: "#0b2d6b" };
const mutedText: React.CSSProperties = { color: "#64748b", margin: 0, lineHeight: 1.45 };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginTop: 18 };
const serviceCard: React.CSSProperties = { display: "block", background: "white", padding: 16, borderRadius: 20, boxShadow: "0 8px 20px rgba(15,23,42,.08)", border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit", cursor: "pointer" };
const serviceIcon: React.CSSProperties = { width: 48, height: 48, borderRadius: 16, background: "#fff7ed", display: "grid", placeItems: "center", fontSize: 24 };
const openText: React.CSSProperties = { display: "inline-block", marginTop: 10, color: "#f97316", fontSize: 14 };
const vehicleCard: React.CSSProperties = { display: "flex", alignItems: "center", gap: 13, background: "white", padding: 15, borderRadius: 20, boxShadow: "0 8px 20px rgba(15,23,42,.08)", border: "1px solid #e2e8f0" };
const carIcon: React.CSSProperties = { width: 58, height: 58, borderRadius: 18, display: "grid", placeItems: "center", background: "#eff6ff", fontSize: 28 };
const smallBookButton: React.CSSProperties = { background: "#0b2d6b", color: "white", padding: "10px 14px", borderRadius: 14, textDecoration: "none", fontWeight: "bold" };
const helpCard: React.CSSProperties = { maxWidth: 1000, margin: "18px auto", padding: 22, borderRadius: 24, background: "linear-gradient(135deg,#0b2d6b,#1d4ed8)", color: "white", boxShadow: "0 12px 30px rgba(15,23,42,.22)" };
const floatingWhatsApp: React.CSSProperties = { position: "fixed", right: 16, bottom: 18, zIndex: 9998, background: "#25D366", color: "white", padding: "13px 16px", borderRadius: 999, textDecoration: "none", fontWeight: "bold", boxShadow: "0 12px 28px rgba(15,23,42,.25)" };
