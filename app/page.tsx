"use client";
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
        <h2 style={{ fontSize: "20px", margin: "0 0 8px" }}>
  The Most Reliable And Affordable Cab Service Of Jamshedpur
</h2>

<h3 style={{ fontSize: "18px", margin: 0 }}>
  Airport Drop - Pickup • Local • Outstation
</h3>

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
          { [
  "Airport Drop & Pickup",
  "Local Cab Service",
  "Outstation Booking",
  "Short Order Cab Service",
  "Marriage Function Booking",
  "All Types Of Vehicle Available",
  "Tour Package Service",
  "24×7 / 365 Days Service",
]
          .map((item) => (
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

onSubmit={async (e) => {
  e.preventDefault();

  const form = new FormData(e.currentTarget);

  const name = form.get("customerName");
  const mobile = form.get("mobile");
  const service = form.get("service");
  const pickup = form.get("pickup");
  const drop = form.get("drop");
  const dateTime = form.get("dateTime");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  await fetch(`${supabaseUrl}/rest/v1/customers`, {
    method: "POST",
    headers: {
      apikey: supabaseKey || "",
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      name: name,
      mobile: mobile,
      address: pickup,
    }),
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
      mobile: mobile,
      service: service,
      pickup: pickup,
      drop_location: drop,
      booking_date: dateTime,
      address: pickup,
      fare: "",
      status: "Pending",
    }),
  });

  const message = `Namaste Vishwakarma Travels,

I want to book a cab.

Name: ${name}
Mobile: ${mobile}
Service: ${service}
Pickup: ${pickup}
Drop: ${drop}
Date & Time: ${dateTime}

Please send me the booking confirmation as soon as possible.`;

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}}
  >
    <input
      name="customerName"
      placeholder="Your Name"
      style={inputStyle}
      required
    />

    <input
      name="mobile"
      placeholder="Mobile Number"
      style={inputStyle}
      required
    />

    <select name="service" style={inputStyle} required>
      <option value="">Select Service</option>
      <option>Airport Drop & Pickup</option>
      <option>Local Cab Service</option>
      <option>Outstation Booking</option>
      <option>Short Order Cab Service</option>
      <option>Marriage Function Booking</option>
      <option>Tour Package Service</option>
    </select>

    <input
      name="pickup"
      placeholder="Pickup Location"
      style={inputStyle}
      required
    />

    <input
      name="drop"
      placeholder="Drop Location"
      style={inputStyle}
      required
    />

<input
  type="datetime-local"
  name="dateTime"
  style={inputStyle}
  required
/>

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
