export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#eef4ff",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "450px",
          margin: "auto",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#0f172a" }}>
          Vishwakarma Travels
        </h1>

        <p>24×7 Cab Service Available</p>

        <p>Ranchi Airport Drop Starting ₹1700</p>

        <p>Jamshedpur to Kolkata Airport ₹4500</p>

        <p>Luxury Cars Available For Marriage</p>

        <a
          href="tel:+917667989203"
          style={{
            display: "inline-block",
            marginTop: "20px",
            background: "#2563eb",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Call Now
        </a>
      </div>
    </main>
  );
}
