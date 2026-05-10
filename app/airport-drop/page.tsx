"use client";

const phone = "917667989203";

const carImages = {
  Dzire: "https://imgd.aeplcdn.com/664x374/n/cw/ec/159099/dzire-exterior-right-front-three-quarter.jpeg",
  Ertiga: "https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/ertiga-exterior-right-front-three-quarter-5.jpeg",
  Innova: "https://imgd.aeplcdn.com/664x374/n/cw/ec/51435/innova-crysta-exterior-right-front-three-quarter-2.jpeg",
  Crysta: "https://imgd.aeplcdn.com/664x374/n/cw/ec/51435/innova-crysta-exterior-right-front-three-quarter-2.jpeg",
};

const routes = [
  {
    title: "Jamshedpur ⇄ Ranchi Airport / City",
    subtitle: "Airport pickup and drop service",
    time: "3.5 - 4.5 Hours",
    cars: [
      { name: "Dzire", price: "₹1700", seats: "4 Seats", image: carImages.Dzire },
      { name: "Ertiga", price: "₹2000", seats: "6 Seats", image: carImages.Ertiga },
      { name: "Innova", price: "₹2400", seats: "6 Seats", image: carImages.Innova },
      { name: "Crysta", price: "₹2700", seats: "6 Seats", image: carImages.Crysta },
    ],
  },
  {
    title: "Jamshedpur ⇄ Kolkata Airport / City",
    subtitle: "Long route airport cab service",
    time: "5.5 - 7 Hours",
    cars: [
      { name: "Dzire", price: "₹4300", seats: "4 Seats", image: carImages.Dzire },
      { name: "Ertiga", price: "₹5700", seats: "6 Seats", image: carImages.Ertiga },
      { name: "Innova", price: "₹7000", seats: "6 Seats", image: carImages.Innova },
      { name: "Crysta", price: "₹7500", seats: "6 Seats", image: carImages.Crysta },
    ],
  },
];

export default function AirportDropPage() {
  const quickMessage = "Hello Vishwakarma Travels, I would like to book an airport pickup/drop cab.";

  return (
    <main style={pageStyle}>
      <a href={`https://wa.me/${phone}?text=${encodeURIComponent(quickMessage)}`} style={floatingWhatsApp}>WhatsApp</a>

      <header style={heroStyle}>
        <nav style={topBar}>
          <a href="/" style={backButton}>← Back</a>
          <a href={`tel:+${phone}`} style={callMini}>Call Now</a>
        </nav>

        <div style={heroContent}>
          <p style={badgeStyle}>Airport Drop & Pickup</p>
          <h1 style={heroTitle}>Airport Cab Service From Jamshedpur</h1>
          <p style={heroText}>Book comfortable and reliable cab service for Ranchi and Kolkata Airport with direct WhatsApp support.</p>

          <div style={heroActions}>
            <a href={`tel:+${phone}`} style={primaryButton}>Call</a>
            <a href={`https://wa.me/${phone}?text=${encodeURIComponent(quickMessage)}`} style={greenButton}>Book on WhatsApp</a>
          </div>
        </div>
      </header>

      <section style={infoStrip}>
        <div style={infoItem}><b>Fixed Rates</b><span>Transparent pricing before booking</span></div>
        <div style={infoItem}><b>On-time Pickup</b><span>Perfect for airport schedules</span></div>
        <div style={infoItem}><b>Easy Booking</b><span>Quick booking through WhatsApp</span></div>
      </section>

      {routes.map((route) => (
        <section key={route.title} style={routeSection}>
          <div style={routeHeader}>
            <div>
              <p style={routeLabel}>Airport Route</p>
              <h2 style={routeTitle}>{route.title}</h2>
              <p style={routeSub}>{route.subtitle}</p>
            </div>
            <div style={timePill}>{route.time}</div>
          </div>

          <div style={vehicleGrid}>
            {route.cars.map((car) => {
              const message = `Hello Vishwakarma Travels,\n\nI would like to book an airport cab.\n\nRoute: ${route.title}\nVehicle: ${car.name}\nStarting Fare: ${car.price}\n\nPlease share the booking confirmation details.\n\nVisit vishwakarma-travels-nine.vercel.app for future bookings.`;

              return (
                <article key={`${route.title}-${car.name}`} style={cardStyle}>
                  <img src={car.image} alt={`${car.name} cab`} style={carPhoto} />

                  <div style={cardBody}>
                    <div style={nameRow}>
                      <h3 style={carName}>{car.name}</h3>
                      <span style={seatTag}>{car.seats}</span>
                    </div>

                    <p style={muted}>Starting From</p>
                    <div style={priceStyle}>{car.price}</div>

                    <a href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`} style={bookButton}>Book Now</a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <section style={noteCard}>
        <b>Booking Note: </b>
        <span>Final fare may vary depending on pickup location, waiting time, tolls, parking charges, and late-night travel timing.</span>
      </section>

      <footer style={footerStyle}>
        <b>Vishwakarma Travels</b>
        <p style={{ margin: "5px 0 0" }}>Jugsalai, Jamshedpur</p>
      </footer>
    </main>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#f3f7fb", fontFamily: "Arial, sans-serif", color: "#0f172a", paddingBottom: 72 };
const heroStyle: React.CSSProperties = { background: "linear-gradient(135deg,#061a40,#0b2d6b 60%,#f97316)", color: "white", padding: "12px 12px 48px", borderBottomLeftRadius: 24, borderBottomRightRadius: 24, boxShadow: "0 12px 30px rgba(15,23,42,.2)" };
const topBar: React.CSSProperties = { maxWidth: 1050, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" };
const backButton: React.CSSProperties = { color: "white", textDecoration: "none", fontWeight: 800, background: "rgba(255,255,255,.14)", padding: "8px 11px", borderRadius: 999, fontSize: 14 };
const callMini: React.CSSProperties = { color: "#0b2d6b", background: "white", textDecoration: "none", fontWeight: 900, padding: "8px 11px", borderRadius: 999, fontSize: 14 };
const heroContent: React.CSSProperties = { maxWidth: 720, margin: "22px auto 0", textAlign: "center" };
const badgeStyle: React.CSSProperties = { display: "inline-block", margin: 0, padding: "7px 11px", borderRadius: 999, background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.28)", fontWeight: 800, fontSize: 13 };
const heroTitle: React.CSSProperties = { fontSize: "clamp(26px,6vw,42px)", lineHeight: 1.05, margin: "12px 0 8px", fontWeight: 950 };
const heroText: React.CSSProperties = { maxWidth: 560, margin: "0 auto", fontSize: 14, lineHeight: 1.45, opacity: .96 };
const heroActions: React.CSSProperties = { display: "flex", gap: 9, justifyContent: "center", flexWrap: "wrap", marginTop: 16 };
const primaryButton: React.CSSProperties = { background: "white", color: "#0b2d6b", textDecoration: "none", padding: "10px 14px", borderRadius: 13, fontWeight: 900, fontSize: 14 };
const greenButton: React.CSSProperties = { background: "#22c55e", color: "white", textDecoration: "none", padding: "10px 14px", borderRadius: 13, fontWeight: 900, fontSize: 14 };
const infoStrip: React.CSSProperties = { maxWidth: 960, margin: "-28px auto 8px", padding: "0 12px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 9 };
const infoItem: React.CSSProperties = { display: "grid", gap: 3, background: "white", padding: 12, borderRadius: 15, boxShadow: "0 8px 20px rgba(15,23,42,.1)", border: "1px solid #e2e8f0", fontSize: 13 };
const routeSection: React.CSSProperties = { maxWidth: 1050, margin: "0 auto", padding: "14px 12px" };
const routeHeader: React.CSSProperties = { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 };
const routeLabel: React.CSSProperties = { margin: 0, color: "#f97316", fontWeight: 900, fontSize: 12, letterSpacing: .3 };
const routeTitle: React.CSSProperties = { margin: "3px 0", color: "#0b2d6b", fontSize: "clamp(20px,4.6vw,30px)", lineHeight: 1.12 };
const routeSub: React.CSSProperties = { margin: 0, color: "#64748b", fontSize: 13 };
const timePill: React.CSSProperties = { background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa", padding: "8px 10px", borderRadius: 999, fontWeight: 900, fontSize: 12 };
const vehicleGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(165px,1fr))", gap: 10 };
const cardStyle: React.CSSProperties = { background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 20px rgba(15,23,42,.08)", border: "1px solid #e2e8f0" };
const carPhoto: React.CSSProperties = { width: "100%", height: 105, objectFit: "cover", display: "block", background: "#e2e8f0" };
const cardBody: React.CSSProperties = { padding: 12 };
const nameRow: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 };
const seatTag: React.CSSProperties = { background: "#eff6ff", color: "#0b2d6b", padding: "5px 7px", borderRadius: 999, fontWeight: 900, fontSize: 11, whiteSpace: "nowrap" };
const carName: React.CSSProperties = { margin: 0, fontSize: 19, color: "#0f172a" };
const muted: React.CSSProperties = { margin: "8px 0 0", color: "#64748b", fontSize: 12 };
const priceStyle: React.CSSProperties = { color: "#f97316", fontSize: 25, fontWeight: 950, margin: "2px 0 10px" };
const bookButton: React.CSSProperties = { display: "block", textAlign: "center", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", textDecoration: "none", padding: "10px 12px", borderRadius: 12, fontWeight: 950, fontSize: 14 };
const noteCard: React.CSSProperties = { maxWidth: 960, margin: "12px auto", padding: 15, borderRadius: 18, background: "#0b2d6b", color: "white", fontSize: 14, lineHeight: 1.45 };
const footerStyle: React.CSSProperties = { textAlign: "center", padding: "16px 12px", color: "#475569", fontSize: 14 };
const floatingWhatsApp: React.CSSProperties = { position: "fixed", right: 14, bottom: 14, zIndex: 9999, background: "#25D366", color: "white", textDecoration: "none", padding: "11px 13px", borderRadius: 999, fontWeight: 950, boxShadow: "0 10px 22px rgba(15,23,42,.22)", fontSize: 14 };
