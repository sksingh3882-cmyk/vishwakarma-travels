export default function Home() {
  const phone = "917667989203";
  const whatsappText =
    "Namaste Vishwakarma Travels, mujhe cab booking karni hai.";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f7ff",
        fontFamily: "Arial",
        color: "#0f172a",
      }}
    >
      <section
        style={{
          background: "linear-gradient(135deg, #0f172a, #2563eb)",
          color: "white",
          padding: "35px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "42px", margin: "0 0 10px" }}>
          Vishwakarma Travels
        </h1>
        <p style={{ fontSize: "20px", margin: 0 }}>
          24×7 Cab Service • Airport Drop • Marriage Luxury Cars
        </p>

        <div style={{ marginTop: "25px" }}>
          <a
            href={`tel:+${phone}`}
            style={{
              background: "#22c55e",
              color: "white",
              padding: "14px 22px",
              borderRadius: "10px",
              textDecoration: "none",
              marginRight: "10px",
              display: "inline-block",
              fontWeight: "bold",
            }}
          >
            Call Now
          </a>

          <a
            href={`https://wa.me/${phone}?text=${encodeURIComponent(
              whatsappText
            )}`}
            style={{
              background: "#25D366",
              color: "white",
              padding: "14px 22px",
              borderRadius: "10px",
              textDecoration: "none",
              display: "inline-block",
              fontWeight: "bold",
            }}
          >
            WhatsApp
          </a>
        </div>
      </section>

      <section style={{ padding: "25px 18px", maxWidth: "1000px", margin: "auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "30px" }}>
          Our Services
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          {[
            "Tata to Ranchi Airport Drop Starting ₹1700",
            "Jamshedpur to Kolkata Airport Drop Starting ₹4500",
            "24×7 / 365 Days Cab Service",
            "Luxury Cars Available For Marriage",
            "Well Maintained New Cars",
            "Experienced & Well Behaved Drivers",
            "100% On Time Reporting",
            "Local & Outstation Booking",
          ].map((item) => (
            <div
              key={item}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "14px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                fontSize: "17px",
                fontWeight: "600",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          background: "white",
          padding: "25px 18px",
          maxWidth: "700px",
          margin: "20px auto",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "28px" }}>
          Book Your Cab
        </h2>

        <form
          action={`https://wa.me/${phone}`}
          method="get"
          style={{ display: "grid", gap: "12px" }}
        >
          <input name="text" type="hidden" value="Namaste Vishwakarma Travels, mujhe cab booking karni hai." />

          <input placeholder="Your Name" style={inputStyle} />
          <input placeholder="Mobile Number" style={inputStyle} />
          <input placeholder="Pickup Location" style={inputStyle} />
          <input placeholder="Drop Location" style={inputStyle} />
          <input placeholder="Date & Time" style={inputStyle} />

          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "white",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Send Booking On WhatsApp
          </button>
        </form>
      </section>

      <section style={{ textAlign: "center", padding: "25px 18px" }}>
        <h2>Contact Us</h2>
        <p>Bagbera, Jamshedpur</p>
        <p>
          <b>Phone:</b> +91 7667989203
        </p>
      </section>
    </main>
  );
}

const inputStyle = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
};
