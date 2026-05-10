"use client";

const phone = "917667989203";

const vehicles = [
  {
    name: "Dzire / Etios / Similar",
    shortName: "Dzire",
    price: "₹2,999",
    seats: "4 Seats",
    bags: "2 Bags",
    fuel: "Petrol / Diesel",
    tags: ["AC", "Comfortable", "Budget Friendly"],
    image: "/cars/dzire.png",
  },
  {
    name: "Ertiga / Similar",
    shortName: "Ertiga",
    price: "₹4,499",
    seats: "6 Seats",
    bags: "4 Bags",
    fuel: "Petrol / Diesel",
    tags: ["AC", "Spacious", "Family Car"],
    image: "/cars/ertiga.jpg",
  },
  {
    name: "Innova Crysta / Similar",
    shortName: "Crysta",
    price: "₹6,499",
    seats: "6 Seats",
    bags: "4 Bags",
    fuel: "Diesel",
    tags: ["AC", "Spacious", "Premium"],
    image: "/cars/crysta.png",
  },
  {
    name: "Innova / Similar",
    shortName: "Innova",
    price: "₹5,999",
    seats: "6 Seats",
    bags: "4 Bags",
    fuel: "Diesel",
    tags: ["AC", "Comfort", "Outstation"],
    image: "/cars/innova.png",
  },
];

export default function AirportDropPage() {
  return (
    <main style={pageStyle}>
      <header style={headerStyle}>
        <a href="/" style={logoBox}>
          <div style={logoMark}>V</div>
          <div>
            <h1 style={logoTitle}>VISHWAKARMA</h1>
            <p style={logoSub}>TRAVELS</p>
          </div>
        </a>

        <nav style={navStyle}>
          <a href="/" style={navLink}>Home</a>
          <a href="#vehicles" style={navLink}>Fleet</a>
          <a href={`tel:+${phone}`} style={trackButton}>Call Now</a>
        </nav>
      </header>

      <section style={heroStyle}>
        <div style={heroShade}>
          <div style={heroInner}>
            <h2 style={heroTitle}>One Way Drop</h2>
            <div style={redLine} />
            <p style={heroText}>Book your one way drop taxi at affordable rates.</p>
            <p style={heroText}>Comfortable rides to your destination.</p>
          </div>
        </div>
      </section>

      <section style={featureWrap}>
        <div style={featureItem}><span style={featureIcon}>↗</span><b>One Way Trip</b></div>
        <div style={featureItem}><span style={featureIcon}>🛡</span><b>Professional Drivers</b></div>
        <div style={featureItem}><span style={featureIcon}>🏷</span><b>No Hidden Charges</b></div>
        <div style={featureItem}><span style={featureIcon}>♨</span><b>Safe & Comfortable</b></div>
      </section>

      <section style={mainGrid}>
        <aside style={leftColumn}>
          <div style={searchCard}>
            <h3 style={sideTitle}>Search One Way Drop</h3>
            <label style={fieldLabel}>From</label>
            <div style={inputBox}><span>⌖</span><input style={inputStyle} placeholder="Enter pickup location" /></div>
            <label style={fieldLabel}>To</label>
            <div style={inputBox}><span>⌖</span><input style={inputStyle} placeholder="Enter drop location" /></div>
            <label style={fieldLabel}>Travel Date</label>
            <div style={inputBox}><span>▣</span><input style={inputStyle} type="date" /></div>
            <a href={`https://wa.me/${phone}?text=${encodeURIComponent("Hello Vishwakarma Travels, I want to search one way drop vehicles.")}`} style={searchButton}>Search Vehicles</a>
          </div>

          <div style={noteBox}>
            <h3 style={noteTitle}>ⓘ Important Note</h3>
            <ul style={noteList}>
              <li>This is a one way drop service.</li>
              <li>Return journey is not included.</li>
              <li>Toll, Parking, State Tax as applicable.</li>
            </ul>
          </div>

          <div style={helpBox}>
            <div style={helpIcon}>☎</div>
            <div>
              <b>Need Help?</b>
              <p style={{ margin: "6px 0", color: "#4b5563" }}>Call us anytime</p>
              <a href={`tel:+${phone}`} style={helpPhone}>+91 76679 89203</a>
            </div>
          </div>
        </aside>

        <section id="vehicles" style={vehiclePanel}>
          <div style={panelHead}>
            <div>
              <h3 style={panelTitle}>Available Vehicles</h3>
              <p style={panelSub}>Showing best options for your one way trip</p>
            </div>
            <select style={sortBox} defaultValue="low">
              <option value="low">Sort by: Price (Low to High)</option>
              <option value="high">Sort by: Price (High to Low)</option>
            </select>
          </div>

          <div style={vehicleList}>
            {vehicles.map((vehicle) => {
              const message = `Hello Vishwakarma Travels,\n\nI would like to book a one way drop cab.\nVehicle: ${vehicle.name}\nFare shown: ${vehicle.price}\n\nPlease share confirmation details.\n\nThank you.`;
              return (
                <article key={vehicle.name} style={vehicleCard}>
                  <div style={imageWrap}>
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      style={carImage}
                      loading="eager"
                      decoding="async"
                      onError={(event) => {
                        const img = event.currentTarget;
                        img.style.display = "none";
                        const fallback = img.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = "grid";
                      }}
                    />
                    <div style={{ ...fallbackCar, display: "none" }}>🚘 {vehicle.shortName}</div>
                  </div>

                  <div style={vehicleInfo}>
                    <h3 style={vehicleName}>{vehicle.name}</h3>
                    <div style={metaRow}>
                      <span>👤 {vehicle.seats}</span>
                      <span>🧳 {vehicle.bags}</span>
                      <span>⛽ {vehicle.fuel}</span>
                    </div>
                    <div style={tagRow}>
                      {vehicle.tags.map((tag) => <span key={tag} style={tagStyle}>{tag}</span>)}
                    </div>
                  </div>

                  <div style={priceCol}>
                    <div style={priceText}>{vehicle.price}</div>
                    <p style={priceSub}>One Way<br />All Inclusive</p>
                    <a href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`} style={bookButton}>Book Now</a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>

      <footer style={footerStyle}>
        <b>Vishwakarma Travels</b>
        <p style={{ margin: "5px 0 0" }}>Jugsalai, Jamshedpur</p>
      </footer>
    </main>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif", color: "#111827" };
const headerStyle: React.CSSProperties = { height: 76, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 42px", background: "white", boxShadow: "0 2px 12px rgba(15,23,42,.08)", position: "sticky", top: 0, zIndex: 50 };
const logoBox: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" };
const logoMark: React.CSSProperties = { width: 50, height: 50, borderRadius: "14px 6px 14px 6px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,#111827,#dc0000)", color: "white", fontSize: 32, fontWeight: 950, transform: "skew(-10deg)" };
const logoTitle: React.CSSProperties = { margin: 0, color: "#d40000", fontSize: "clamp(20px,3vw,30px)", lineHeight: .95, fontWeight: 950, letterSpacing: .4 };
const logoSub: React.CSSProperties = { margin: 0, color: "#111827", fontSize: "clamp(15px,2.5vw,20px)", letterSpacing: 4, fontWeight: 950 };
const navStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 30 };
const navLink: React.CSSProperties = { color: "#111827", textDecoration: "none", fontWeight: 800 };
const trackButton: React.CSSProperties = { background: "#d40000", color: "white", textDecoration: "none", padding: "13px 22px", borderRadius: 7, fontWeight: 950, boxShadow: "0 8px 18px rgba(212,0,0,.22)" };
const heroStyle: React.CSSProperties = { minHeight: 250, backgroundImage: "linear-gradient(90deg,rgba(0,0,0,.84),rgba(0,0,0,.58),rgba(0,0,0,.7)), url('/cars/dzire.png')", backgroundSize: "cover", backgroundPosition: "center", color: "white" };
const heroShade: React.CSSProperties = { minHeight: 250, display: "flex", alignItems: "center" };
const heroInner: React.CSSProperties = { width: "100%", maxWidth: 1240, margin: "0 auto", padding: "35px 22px" };
const heroTitle: React.CSSProperties = { fontSize: "clamp(42px,7vw,68px)", lineHeight: 1, margin: 0, fontWeight: 950 };
const redLine: React.CSSProperties = { width: 58, height: 5, background: "#e00000", margin: "18px 0" };
const heroText: React.CSSProperties = { margin: "3px 0", fontSize: "clamp(16px,2.5vw,22px)", fontWeight: 600 };
const featureWrap: React.CSSProperties = { maxWidth: 1240, margin: "-34px auto 26px", background: "linear-gradient(135deg,#111827,#172234)", color: "white", borderRadius: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 0, padding: "18px 18px", boxShadow: "0 16px 34px rgba(15,23,42,.25)", position: "relative", zIndex: 10 };
const featureItem: React.CSSProperties = { display: "flex", alignItems: "center", gap: 14, padding: "0 12px", fontSize: 16 };
const featureIcon: React.CSSProperties = { width: 28, height: 28, borderRadius: 999, background: "#d40000", color: "white", display: "grid", placeItems: "center", fontWeight: 950 };
const mainGrid: React.CSSProperties = { maxWidth: 1240, margin: "0 auto", padding: "0 18px 30px", display: "grid", gridTemplateColumns: "340px 1fr", gap: 24, alignItems: "start" };
const leftColumn: React.CSSProperties = { display: "grid", gap: 18 };
const searchCard: React.CSSProperties = { background: "white", borderRadius: 14, padding: 20, boxShadow: "0 8px 28px rgba(15,23,42,.10)", border: "1px solid #e5e7eb" };
const sideTitle: React.CSSProperties = { margin: "0 0 18px", fontSize: 21, fontWeight: 950 };
const fieldLabel: React.CSSProperties = { display: "block", margin: "13px 0 7px", fontWeight: 850 };
const inputBox: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, border: "1px solid #d6dbe3", borderRadius: 8, padding: "0 12px", height: 46, color: "#64748b" };
const inputStyle: React.CSSProperties = { border: 0, outline: 0, width: "100%", fontSize: 14, background: "transparent", color: "#111827" };
const searchButton: React.CSSProperties = { display: "block", marginTop: 20, textAlign: "center", background: "linear-gradient(135deg,#df0000,#c40000)", color: "white", textDecoration: "none", borderRadius: 8, padding: "14px", fontWeight: 950 };
const noteBox: React.CSSProperties = { background: "linear-gradient(135deg,#fff,#fff0f0)", borderRadius: 14, padding: 20, boxShadow: "0 8px 26px rgba(15,23,42,.08)", border: "1px solid #fee2e2" };
const noteTitle: React.CSSProperties = { margin: "0 0 12px", color: "#111827", fontSize: 17 };
const noteList: React.CSSProperties = { margin: 0, paddingLeft: 18, color: "#334155", lineHeight: 1.9 };
const helpBox: React.CSSProperties = { background: "white", borderRadius: 14, padding: 20, boxShadow: "0 8px 26px rgba(15,23,42,.09)", display: "flex", alignItems: "center", gap: 17, border: "1px solid #e5e7eb" };
const helpIcon: React.CSSProperties = { width: 56, height: 56, borderRadius: 999, display: "grid", placeItems: "center", background: "#fee2e2", color: "#d40000", fontSize: 24, fontWeight: 950 };
const helpPhone: React.CSSProperties = { color: "#d40000", fontWeight: 950, textDecoration: "none", fontSize: 20 };
const vehiclePanel: React.CSSProperties = { display: "grid", gap: 0 };
const panelHead: React.CSSProperties = { background: "white", borderRadius: 14, padding: "20px 24px", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", boxShadow: "0 6px 22px rgba(15,23,42,.08)", border: "1px solid #e5e7eb", marginBottom: 0 };
const panelTitle: React.CSSProperties = { margin: 0, fontSize: 23, fontWeight: 950 };
const panelSub: React.CSSProperties = { margin: "8px 0 0", color: "#64748b" };
const sortBox: React.CSSProperties = { border: "1px solid #d6dbe3", borderRadius: 8, padding: "12px 15px", background: "white", color: "#111827", fontWeight: 650 };
const vehicleList: React.CSSProperties = { display: "grid", gap: 12 };
const vehicleCard: React.CSSProperties = { display: "grid", gridTemplateColumns: "210px 1fr 150px", alignItems: "center", gap: 24, background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 20px", boxShadow: "0 6px 20px rgba(15,23,42,.06)" };
const imageWrap: React.CSSProperties = { height: 118, display: "grid", placeItems: "center", background: "#fff", borderRadius: 12, overflow: "hidden" };
const carImage: React.CSSProperties = { width: "100%", height: "100%", objectFit: "contain", display: "block" };
const fallbackCar: React.CSSProperties = { width: "100%", height: "100%", placeItems: "center", background: "#f1f5f9", color: "#111827", fontWeight: 950, fontSize: 18 };
const vehicleInfo: React.CSSProperties = { minWidth: 0 };
const vehicleName: React.CSSProperties = { margin: "0 0 14px", fontSize: 21, fontWeight: 950, color: "#111827" };
const metaRow: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 22, color: "#334155", fontSize: 14, marginBottom: 14 };
const tagRow: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 10 };
const tagStyle: React.CSSProperties = { background: "#fee2e2", color: "#d40000", borderRadius: 7, padding: "7px 10px", fontSize: 13, fontWeight: 800 };
const priceCol: React.CSSProperties = { display: "grid", justifyItems: "center", gap: 8, textAlign: "center" };
const priceText: React.CSSProperties = { color: "#d40000", fontSize: 27, fontWeight: 950 };
const priceSub: React.CSSProperties = { margin: 0, color: "#334155", lineHeight: 1.45 };
const bookButton: React.CSSProperties = { background: "linear-gradient(135deg,#df0000,#c40000)", color: "white", textDecoration: "none", padding: "12px 27px", borderRadius: 6, fontWeight: 950, minWidth: 116 };
const footerStyle: React.CSSProperties = { textAlign: "center", padding: "18px 16px 36px", color: "#64748b" };
