"use client";

const phone = "917667989203";

const routes = [
  {
    title: "Jamshedpur ⇄ Ranchi Airport / City",
    subtitle: "Fast airport pickup and drop service",
    time: "Approx 3.5 - 4.5 hrs",
    cars: [
      { name: "Dzire", price: "₹1700", seats: "4 Seats", icon: "🚘" },
      { name: "Ertiga", price: "₹2000", seats: "6 Seats", icon: "🚙" },
      { name: "Innova", price: "₹2400", seats: "6 Seats", icon: "🚐" },
      { name: "Crysta", price: "₹2700", seats: "6 Seats", icon: "🚐" },
    ],
  },
  {
    title: "Jamshedpur ⇄ Kolkata Airport / City",
    subtitle: "Comfortable long route airport service",
    time: "Approx 5.5 - 7 hrs",
    cars: [
      { name: "Dzire", price: "₹4300", seats: "4 Seats", icon: "🚘" },
      { name: "Ertiga", price: "₹5700", seats: "6 Seats", icon: "🚙" },
      { name: "Innova", price: "₹7000", seats: "6 Seats", icon: "🚐" },
      { name: "Crysta", price: "₹7500", seats: "6 Seats", icon: "🚐" },
    ],
  },
];

export default function AirportDropPage() {
  const quickMessage = "Namaste Vishwakarma Travels, mujhe airport drop/pickup cab book karni hai.";

  return (
    <main style={pageStyle}>
      <a href={`https://wa.me/${phone}?text=${encodeURIComponent(quickMessage)}`} style={floatingWhatsApp}>WhatsApp</a>

      <header style={heroStyle}>
        <nav style={topBar}>
          <a href="/" style={backButton}>← Back</a>
          <a href={`tel:+${phone}`} style={callMini}>Call Now</a>
        </nav>

        <div style={heroContent}>
          <p style={badgeStyle}>✈️ Airport Drop / Pickup</p>
          <h1 style={heroTitle}>Book Airport Cab From Jamshedpur</h1>
          <p style={heroText}>Ranchi Airport, Kolkata Airport aur city drop ke liye clean cab, experienced driver aur direct WhatsApp booking.</p>

          <div style={heroActions}>
            <a href={`tel:+${phone}`} style={primaryButton}>Call +91 7667989203</a>
            <a href={`https://wa.me/${phone}?text=${encodeURIComponent(quickMessage)}`} style={greenButton}>Book on WhatsApp</a>
          </div>
        </div>
      </header>

      <section style={infoStrip}>
        <div style={infoItem}><b>✅ Fixed Route Rates</b><span>No confusion before booking</span></div>
        <div style={infoItem}><b>🕘 On-time Pickup</b><span>Airport timing ke hisab se</span></div>
        <div style={infoItem}><b>📲 WhatsApp Booking</b><span>One tap direct message</span></div>
      </section>

      {routes.map((route) => (
        <section key={route.title} style={routeSection}>
          <div style={routeHeader}>
            <div>
              <p style={routeLabel}>Airport Cab Route</p>
              <h2 style={routeTitle}>{route.title}</h2>
              <p style={routeSub}>{route.subtitle}</p>
            </div>
            <div style={timePill}>{route.time}</div>
          </div>

          <div style={vehicleGrid}>
            {route.cars.map((car) => {
              const message = `Namaste Vishwakarma Travels,\n\nMujhe airport cab book karni hai.\n\nRoute: ${route.title}\nCar: ${car.name}\nStarting Fare: ${car.price}\n\nPlease booking confirmation bhej dijiye.\n\nVisit vishwakarma-travels-nine.vercel.app for next booking`;

              return (
                <article key={`${route.title}-${car.name}`} style={cardStyle}>
                  <div style={carTopRow}>
                    <div style={carIcon}>{car.icon}</div>
                    <div style={seatTag}>{car.seats}</div>
                  </div>

                  <h3 style={carName}>{car.name}</h3>
                  <p style={muted}>Starting From</p>
                  <div style={priceStyle}>{car.price}</div>

                  <a href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`} style={bookButton}>Book {car.name}</a>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <section style={noteCard}>
        <h2 style={{ margin: "0 0 8px" }}>Booking Note</h2>
        <p style={{ margin: 0, lineHeight: 1.6 }}>Fare pickup location, night timing, toll/parking aur waiting ke hisab se change ho sakta hai. Final confirmation WhatsApp par milega.</p>
      </section>

      <footer style={footerStyle}>
        <b>Vishwakarma Travels</b>
        <p style={{ margin: "6px 0 0" }}>Jugsalai, Jamshedpur • Safe Journey, Happy Journey</p>
      </footer>
    </main>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#f3f7fb", fontFamily: "Arial, sans-serif", color: "#0f172a", paddingBottom: 90 };
const heroStyle: React.CSSProperties = { background: "linear-gradient(135deg,#061a40,#0b2d6b 55%,#f97316)", color: "white", padding: "14px 14px 80px", borderBottomLeftRadius: 34, borderBottomRightRadius: 34, boxShadow: "0 18px 45px rgba(15,23,42,.25)" };
const topBar: React.CSSProperties = { maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" };
const backButton: React.CSSProperties = { color: "white", textDecoration: "none", fontWeight: 800, background: "rgba(255,255,255,.14)", padding: "10px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,.22)" };
const callMini: React.CSSProperties = { color: "#0b2d6b", background: "white", textDecoration: "none", fontWeight: 900, padding: "10px 14px", borderRadius: 999 };
const heroContent: React.CSSProperties = { maxWidth: 820, margin: "34px auto 0", textAlign: "center" };
const badgeStyle: React.CSSProperties = { display: "inline-block", margin: 0, padding: "9px 14px", borderRadius: 999, background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.28)", fontWeight: 800 };
const heroTitle: React.CSSProperties = { fontSize: "clamp(34px,8vw,64px)", lineHeight: 1.04, margin: "18px 0 12px", fontWeight: 950 };
const heroText: React.CSSProperties = { maxWidth: 680, margin: "0 auto", fontSize: 17, lineHeight: 1.6, opacity: .96 };
const heroActions: React.CSSProperties = { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 24 };
const primaryButton: React.CSSProperties = { background: "white", color: "#0b2d6b", textDecoration: "none", padding: "14px 18px", borderRadius: 16, fontWeight: 900 };
const greenButton: React.CSSProperties = { background: "#22c55e", color: "white", textDecoration: "none", padding: "14px 18px", borderRadius: 16, fontWeight: 900, boxShadow: "0 12px 24px rgba(34,197,94,.25)" };
const infoStrip: React.CSSProperties = { maxWidth: 1000, margin: "-44px auto 18px", padding: "0 14px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12 };
const infoItem: React.CSSProperties = { display: "grid", gap: 5, background: "white", padding: 16, borderRadius: 20, boxShadow: "0 12px 28px rgba(15,23,42,.12)", border: "1px solid #e2e8f0" };
const routeSection: React.CSSProperties = { maxWidth: 1080, margin: "0 auto", padding: "20px 14px" };
const routeHeader: React.CSSProperties = { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 14 };
const routeLabel: React.CSSProperties = { margin: 0, color: "#f97316", fontWeight: 900, letterSpacing: .4 };
const routeTitle: React.CSSProperties = { margin: "5px 0", color: "#0b2d6b", fontSize: "clamp(26px,5vw,42px)", lineHeight: 1.12 };
const routeSub: React.CSSProperties = { margin: 0, color: "#64748b", fontSize: 16 };
const timePill: React.CSSProperties = { background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa", padding: "10px 13px", borderRadius: 999, fontWeight: 900 };
const vehicleGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14 };
const cardStyle: React.CSSProperties = { background: "white", borderRadius: 24, padding: 16, boxShadow: "0 10px 25px rgba(15,23,42,.09)", border: "1px solid #e2e8f0" };
const carTopRow: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const carIcon: React.CSSProperties = { width: 70, height: 62, borderRadius: 18, background: "linear-gradient(135deg,#eff6ff,#fff7ed)", display: "grid", placeItems: "center", fontSize: 36 };
const seatTag: React.CSSProperties = { background: "#eff6ff", color: "#0b2d6b", padding: "7px 10px", borderRadius: 999, fontWeight: 900, fontSize: 13 };
const carName: React.CSSProperties = { margin: "14px 0 6px", fontSize: 25, color: "#0f172a" };
const muted: React.CSSProperties = { margin: 0, color: "#64748b" };
const priceStyle: React.CSSProperties = { color: "#f97316", fontSize: 34, fontWeight: 950, margin: "6px 0 14px" };
const bookButton: React.CSSProperties = { display: "block", textAlign: "center", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", textDecoration: "none", padding: "13px 14px", borderRadius: 16, fontWeight: 950, boxShadow: "0 10px 20px rgba(249,115,22,.22)" };
const noteCard: React.CSSProperties = { maxWidth: 1000, margin: "18px auto", padding: 20, borderRadius: 24, background: "#0b2d6b", color: "white", boxShadow: "0 12px 30px rgba(15,23,42,.18)" };
const footerStyle: React.CSSProperties = { textAlign: "center", padding: "20px 16px", color: "#475569" };
const floatingWhatsApp: React.CSSProperties = { position: "fixed", right: 16, bottom: 18, zIndex: 9999, background: "#25D366", color: "white", textDecoration: "none", padding: "13px 16px", borderRadius: 999, fontWeight: 950, boxShadow: "0 12px 28px rgba(15,23,42,.25)" };
