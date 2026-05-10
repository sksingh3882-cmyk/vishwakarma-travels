"use client";

const phone = "917667989203";

const ranchiCars = [
  { name: "Desire", price: "1700 ₹", icon: "🚘" },
  { name: "Ertiga", price: "2000 ₹", icon: "🚙" },
  { name: "Innova", price: "2400 ₹", icon: "🚐" },
  { name: "Crysta", price: "2700 ₹", icon: "🚐" },
];

const kolkataCars = [
  { name: "Desire", price: "4300 ₹", icon: "🚘" },
  { name: "Ertiga", price: "5700 ₹", icon: "🚙" },
  { name: "Innova", price: "7000 ₹", icon: "🚐" },
  { name: "Crysta", price: "7500 ₹", icon: "🚐" },
];

export default function AirportDropPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f4f7fb", fontFamily: "Arial", color: "#0f172a", paddingBottom: 40 }}>
      <header style={headerStyle}>
        <a href="/" style={backStyle}>←</a>
        <h1 style={{ margin: 0, fontSize: 22 }}>Airport Drop / Pickup</h1>
      </header>

      <section style={routeSection}>
        <h2 style={routeTitle}>Jamshedpur to<br />Ranchi Airport / City Drop</h2>
        <div style={arrowStyle}>↕</div>
        <VehicleList cars={ranchiCars} route="Jamshedpur to Ranchi Airport / City Drop" />
      </section>

      <section style={routeSection}>
        <h2 style={routeTitle}>Jamshedpur to<br />Kolkata Airport / City Drop</h2>
        <div style={arrowStyle}>↕</div>
        <VehicleList cars={kolkataCars} route="Jamshedpur to Kolkata Airport / City Drop" />
      </section>
    </main>
  );
}

function VehicleList({ cars, route }: { cars: { name: string; price: string; icon: string }[]; route: string }) {
  return (
    <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
      {cars.map((car) => {
        const message = `Namaste Vishwakarma Travels,\n\nMujhe ${route} ke liye ${car.name} cab book karni hai.\nStarting From ${car.price}`;
        return (
          <div key={car.name} style={cardStyle}>
            <div style={carImageStyle}>{car.icon}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 24, color: "#0b2d6b" }}>{car.name}</h3>
              <p style={{ margin: 0, color: "#64748b", fontSize: 16 }}>Starting From</p>
              <h2 style={{ margin: "6px 0", color: "#f97316", fontSize: 32 }}>{car.price}</h2>
            </div>
            <a href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`} style={bookStyle}>Book</a>
          </div>
        );
      })}
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  background: "#0b2d6b",
  color: "white",
  padding: "18px 16px",
  display: "flex",
  alignItems: "center",
  gap: 14,
  boxShadow: "0 8px 25px rgba(15,23,42,.18)",
};

const backStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontSize: 34,
  fontWeight: "bold",
  lineHeight: 1,
};

const routeSection: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: "26px 16px 12px",
};

const routeTitle: React.CSSProperties = {
  textAlign: "center",
  color: "#0b2d6b",
  fontSize: "clamp(28px,7vw,44px)",
  lineHeight: 1.25,
  margin: "12px 0 8px",
  fontWeight: 900,
};

const arrowStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#0b2d6b",
  fontSize: 58,
  fontWeight: 900,
  margin: "6px 0 10px",
};

const cardStyle: React.CSSProperties = {
  background: "white",
  borderRadius: 22,
  padding: 16,
  display: "flex",
  alignItems: "center",
  gap: 14,
  boxShadow: "0 10px 25px rgba(15,23,42,.10)",
  border: "1px solid #e2e8f0",
};

const carImageStyle: React.CSSProperties = {
  width: 105,
  minWidth: 105,
  height: 82,
  borderRadius: 18,
  background: "linear-gradient(135deg,#eff6ff,#fff7ed)",
  display: "grid",
  placeItems: "center",
  fontSize: 48,
};

const bookStyle: React.CSSProperties = {
  background: "#f97316",
  color: "white",
  padding: "10px 13px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: "bold",
};
