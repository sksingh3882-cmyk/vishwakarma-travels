"use client";

const phone = "917667989203";

function whiteCarImage(name: string, type: "sedan" | "mpv" | "suv" = "sedan") {
  const isSedan = type === "sedan";
  const bodyPath = isSedan
    ? "M80 185 C105 150 136 130 178 126 L330 126 C382 128 422 150 452 184 L514 194 C538 198 554 215 554 238 L554 252 C554 266 543 276 528 276 L84 276 C66 276 52 264 52 247 L52 230 C52 207 61 193 80 185 Z"
    : "M73 188 C94 146 128 122 178 118 L375 118 C425 120 470 150 505 191 L536 198 C555 203 566 218 566 240 L566 253 C566 267 555 276 540 276 L76 276 C59 276 46 264 46 248 L46 229 C46 207 55 194 73 188 Z";
  const windowPath = isSedan
    ? "M164 143 L222 143 L208 185 L116 185 C127 166 142 151 164 143 Z M236 143 L321 143 C352 145 380 160 404 184 L224 184 Z"
    : "M150 137 L225 137 L210 184 L98 184 C111 160 128 145 150 137 Z M238 137 L365 137 C397 140 426 158 451 184 L222 184 Z";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="390" viewBox="0 0 700 390"><rect width="700" height="390" fill="white"/><ellipse cx="350" cy="302" rx="250" ry="28" fill="#e5e7eb" opacity=".75"/><path d="${bodyPath}" fill="#ffffff" stroke="#cbd5e1" stroke-width="7"/><path d="${windowPath}" fill="#dbeafe" stroke="#94a3b8" stroke-width="4"/><path d="M86 204 L528 204" stroke="#e2e8f0" stroke-width="4"/><path d="M132 214 L163 214" stroke="#f97316" stroke-width="8" stroke-linecap="round"/><path d="M486 214 L523 214" stroke="#f97316" stroke-width="8" stroke-linecap="round"/><circle cx="166" cy="278" r="42" fill="#0b2d6b"/><circle cx="482" cy="278" r="42" fill="#0b2d6b"/><circle cx="166" cy="278" r="20" fill="white"/><circle cx="482" cy="278" r="20" fill="white"/><circle cx="166" cy="278" r="9" fill="#94a3b8"/><circle cx="482" cy="278" r="9" fill="#94a3b8"/><rect x="285" y="230" width="130" height="32" rx="8" fill="#0b2d6b"/><text x="350" y="253" text-anchor="middle" font-family="Arial" font-size="21" font-weight="900" fill="white">${name.toUpperCase()}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const carImages = {
  Dzire: whiteCarImage("Dzire", "sedan"),
  Ertiga: whiteCarImage("Ertiga", "mpv"),
  Innova: whiteCarImage("Innova", "mpv"),
  Crysta: whiteCarImage("Crysta", "suv"),
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
  const quickMessage = "Hello Vishwakarma Travels, I would like to book a one way drop cab.";

  return (
    <main style={pageStyle}>
      <a href={`https://wa.me/${phone}?text=${encodeURIComponent(quickMessage)}`} style={floatingWhatsApp}>WhatsApp</a>

      <header style={headerStyle}>
        <a href="/" style={logoBox}>
          <div style={logoMark}>V</div>
          <div>
            <h1 style={logoTitle}>VISHWAKARMA</h1>
            <p style={logoSub}>TRAVELS</p>
          </div>
        </a>
      </header>

      <section style={heroStyle}>
        <div style={heroContent}>
          <p style={badgeStyle}>One Way Drop Service</p>
          <h2 style={heroTitle}>One Way Drop Service</h2>
          <p style={heroSub}>Safe • Reliable • On Time</p>

          <div style={featureBar}>
            <div style={featureItem}><span style={featureIcon}>✈️</span><b>24x7 Service</b><small>Always Available</small></div>
            <div style={featureItem}><span style={featureIcon}>🛡️</span><b>Safe & Secure</b><small>Your Safety Our Priority</small></div>
            <div style={featureItem}><span style={featureIcon}>🟢</span><b>Quick Booking</b><small>Through WhatsApp</small></div>
          </div>
        </div>
      </section>

      {routes.map((route) => (
        <section key={route.title} style={routeCard}>
          <div style={routeHead}>
            <div>
              <p style={routeLabel}>ONE WAY ROUTE</p>
              <h2 style={routeTitle}>{route.title}</h2>
              <p style={routeSub}>{route.subtitle}</p>
            </div>
            <div style={timePill}>○ {route.time}</div>
          </div>

          <div style={vehicleGrid}>
            {route.cars.map((car) => {
              const message = `Hello Vishwakarma Travels,\n\nI would like to book a one way drop cab.\n\nRoute: ${route.title}\nVehicle: ${car.name}\n\nPlease share the booking confirmation details.\n\nThank you.`;

              return (
                <article key={`${route.title}-${car.name}`} style={cardStyle}>
                  <div style={carImageWrap}>
                    <img src={car.image} alt={`${car.name} white cab`} style={carPhoto} loading="eager" decoding="async" />
                  </div>

                  <div style={cardBody}>
                    <div style={nameRow}>
                      <h3 style={carName}>{car.name}</h3>
                      <span style={seatTag}>{car.seats}</span>
                    </div>
                    <p style={muted}>Starting From</p>
                    <div style={priceStyle}>{car.price}</div>
                    <a href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`} style={bookButton}>☏ Book Now</a>
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

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "linear-gradient(180deg,#f7fbff,#eef5fb)", fontFamily: "Arial, sans-serif", color: "#0f172a", paddingBottom: 86 };
const headerStyle: React.CSSProperties = { maxWidth: 1180, margin: "0 auto", padding: "18px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" };
const logoBox: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" };
const logoMark: React.CSSProperties = { width: 52, height: 52, borderRadius: "14px 6px 14px 6px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,#ff6b00,#ff7a1a)", color: "white", fontSize: 34, fontWeight: 950, transform: "skew(-10deg)", boxShadow: "0 10px 22px rgba(249,115,22,.22)" };
const logoTitle: React.CSSProperties = { margin: 0, color: "#f97316", fontSize: "clamp(21px,4vw,32px)", lineHeight: .95, fontWeight: 950, letterSpacing: .5 };
const logoSub: React.CSSProperties = { margin: 0, color: "#0b2d6b", fontSize: "clamp(17px,3vw,25px)", fontWeight: 950, lineHeight: 1 };
const heroStyle: React.CSSProperties = { maxWidth: 1180, margin: "0 auto", padding: "16px" };
const heroContent: React.CSSProperties = { background: "linear-gradient(135deg,#eaf5ff,#ffffff)", borderRadius: 28, padding: "clamp(24px,5vw,56px)", boxShadow: "0 14px 36px rgba(15,23,42,.10)", border: "1px solid #dbeafe" };
const badgeStyle: React.CSSProperties = { display: "inline-block", margin: 0, padding: "8px 12px", borderRadius: 999, background: "#fff7ed", color: "#f97316", border: "1px solid #fed7aa", fontWeight: 900, fontSize: 13 };
const heroTitle: React.CSSProperties = { color: "#0b2d6b", fontSize: "clamp(38px,8vw,76px)", lineHeight: 1, margin: "18px 0 10px", fontWeight: 950 };
const heroSub: React.CSSProperties = { color: "#0b2d6b", fontSize: "clamp(18px,3vw,30px)", margin: 0, fontWeight: 700 };
const featureBar: React.CSSProperties = { marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12, background: "rgba(255,255,255,.86)", border: "1px solid #dbeafe", borderRadius: 22, padding: 14, boxShadow: "0 10px 28px rgba(15,23,42,.08)" };
const featureItem: React.CSSProperties = { display: "grid", gridTemplateColumns: "48px 1fr", columnGap: 10, alignItems: "center", color: "#0b2d6b" };
const featureIcon: React.CSSProperties = { gridRow: "span 2", width: 48, height: 48, borderRadius: 999, background: "#0b2d6b", color: "white", display: "grid", placeItems: "center", fontSize: 22 };
const routeCard: React.CSSProperties = { maxWidth: 1180, margin: "0 auto 20px", padding: "clamp(16px,3vw,28px)", background: "white", borderRadius: 26, boxShadow: "0 12px 32px rgba(15,23,42,.10)", border: "1px solid #dbeafe" };
const routeHead: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap", marginBottom: 18 };
const routeLabel: React.CSSProperties = { margin: 0, color: "#f97316", fontWeight: 950, fontSize: 14 };
const routeTitle: React.CSSProperties = { margin: "5px 0", color: "#0b2d6b", fontSize: "clamp(26px,4.8vw,44px)", lineHeight: 1.1, fontWeight: 950 };
const routeSub: React.CSSProperties = { margin: 0, color: "#64748b", fontSize: "clamp(15px,2.5vw,22px)" };
const timePill: React.CSSProperties = { background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa", padding: "9px 13px", borderRadius: 999, fontWeight: 950, fontSize: 14 };
const vehicleGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 };
const cardStyle: React.CSSProperties = { background: "white", borderRadius: 22, overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,.10)", border: "1px solid #e2e8f0" };
const carImageWrap: React.CSSProperties = { height: 165, display: "grid", placeItems: "center", background: "white", padding: "10px 10px 0" };
const carPhoto: React.CSSProperties = { width: "100%", height: "100%", objectFit: "contain", display: "block" };
const cardBody: React.CSSProperties = { padding: 16 };
const nameRow: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 };
const seatTag: React.CSSProperties = { background: "#eff6ff", color: "#0b2d6b", padding: "7px 10px", borderRadius: 999, fontWeight: 950, fontSize: 13, whiteSpace: "nowrap" };
const carName: React.CSSProperties = { margin: 0, fontSize: 26, color: "#0b2d6b", fontWeight: 950 };
const muted: React.CSSProperties = { margin: "10px 0 0", color: "#64748b", fontSize: 16 };
const priceStyle: React.CSSProperties = { color: "#f97316", fontSize: 34, fontWeight: 950, margin: "2px 0 12px" };
const bookButton: React.CSSProperties = { display: "block", textAlign: "center", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", textDecoration: "none", padding: "13px 14px", borderRadius: 16, fontWeight: 950, fontSize: 17, boxShadow: "0 8px 18px rgba(249,115,22,.24)" };
const noteCard: React.CSSProperties = { maxWidth: 1148, margin: "18px auto", padding: 18, borderRadius: 20, background: "#0b2d6b", color: "white", fontSize: 15, lineHeight: 1.5 };
const footerStyle: React.CSSProperties = { textAlign: "center", padding: "20px 16px 90px", color: "#475569", fontSize: 14 };
const floatingWhatsApp: React.CSSProperties = { position: "fixed", right: 16, bottom: 18, zIndex: 9999, background: "#25D366", color: "white", textDecoration: "none", padding: "13px 16px", borderRadius: 999, fontWeight: 950, boxShadow: "0 12px 28px rgba(15,23,42,.25)" };
