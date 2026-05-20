import { useState } from "react";

const phone = "917667989203";

const carImages = {
  Dzire: "/cars/dzire.png",
  Ertiga: "/cars/ertiga.jpg",
  Innova: "/cars/innova.png",
  Crysta: "/cars/crysta.png",
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
  const [bookingOpen, setBookingOpen] = useState(false);

const [selectedBooking, setSelectedBooking] = useState({
  service: "",
  route: "",
  vehicle: "",
  vehicleType: "",
  price: "",
});

const [formData, setFormData] = useState({
  name: "",
  mobile: "",
  pickup: "",
  drop: "",
  date: "",
  time: "",
});
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
                    <button
  type="button"
  onClick={() => {
    setSelectedBooking({
      service: "One Way Drop Pickup",
      route: route.title,
      vehicle: car.name,
      vehicleType:
        car.name === "Dzire"
          ? "Sedan"
          : "SUV",
      price: car.price,
    });

    setBookingOpen(true);
  }}
  style={bookButton}
>
  ☏ Book Now
</button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <section style={noteCard}>
        <b>Booking Note: </b>
        <span>Our one-way service is available throughout Entire Jharkhand, Bihar, Bengal, Chhattisgarh, and Odisha.</span>
        <span>Final fare may vary depending on pickup location, waiting time, tolls, parking charges, and late-night travel timing.</span>
      </section>

      <footer style={footerStyle}>
        <b>Vishwakarma Travels</b>
        <p style={{ margin: "5px 0 0" }}>Jugsalai, Jamshedpur</p>
      </footer>

{bookingOpen && (
  <div style={modalOverlay}>
    <div style={modalBox}>
      <button
        onClick={() => setBookingOpen(false)}
        style={closeButton}
      >
        ✕
      </button>

      <h2 style={modalTitle}>Confirm Your Ride Details</h2>

      <div style={autoInfoBox}>
        <p><b>Service:</b> {selectedBooking.service}</p>
        <p><b>Route:</b> {selectedBooking.route}</p>
        <p><b>Vehicle:</b> {selectedBooking.vehicle}</p>
        <p><b>Vehicle Type:</b> {selectedBooking.vehicleType}</p>
        <p><b>Fare:</b> {selectedBooking.price}</p>
      </div>

      <div style={formGrid}>
        <input
          type="text"
          placeholder="Your Name"
          style={formInput}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <input
          type="tel"
          placeholder="Mobile Number"
          style={formInput}
          onChange={(e) =>
            setFormData({
              ...formData,
              mobile: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Pickup Location"
          style={formInput}
          onChange={(e) =>
            setFormData({
              ...formData,
              pickup: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Drop Location"
          style={formInput}
          onChange={(e) =>
            setFormData({
              ...formData,
              drop: e.target.value,
            })
          }
        />

        <input
          type="date"
          style={formInput}
          onChange={(e) =>
            setFormData({
              ...formData,
              date: e.target.value,
            })
          }
        />

        <input
          type="time"
          style={formInput}
          onChange={(e) =>
            setFormData({
              ...formData,
              time: e.target.value,
            })
          }
        />
      </div>

      <button
        style={submitButton}
        onClick={() => {
          const message = `Hello Vishwakarma Travels,

Booking Request

Name: ${formData.name}
Mobile: ${formData.mobile}

Service: ${selectedBooking.service}
Route: ${selectedBooking.route}
Vehicle: ${selectedBooking.vehicle}
Vehicle Type: ${selectedBooking.vehicleType}
Fare: ${selectedBooking.price}

Pickup: ${formData.pickup}
Drop: ${formData.drop}

Date: ${formData.date}
Time: ${formData.time}

Please confirm this booking.`;

          window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
            "_blank"
          );
        }}
      >
        Confirm & Send WhatsApp
      </button>
    </div>
  </div>
)}

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
