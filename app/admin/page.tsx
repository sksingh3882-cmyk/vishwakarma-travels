"use client";

import { useState } from "react";

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [password, setPassword] = useState("");

  const phone = "917667989203";

  if (!isLogin) {
    return (
      <main style={pageStyle}>
        <div style={cardStyle}>
          <h1>Admin Login</h1>

          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button
            style={buttonStyle}
            onClick={() => {
              if (password === "1234") {
                setIsLogin(true);
              } else {
                alert("Wrong password");
              }
            }}
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <h1>Booking Confirmation</h1>

        <form
          style={{ display: "grid", gap: "12px" }}
          onSubmit={(e) => {
            e.preventDefault();

            const form = new FormData(e.currentTarget);

            const customerPhone = form.get("customerPhone");
            const message = `✅ Booking Confirmed

${form.get("gender") } ${form.get("customerName")}

Namaste, Your Booking is Confirmed.

Booking ID: VT-${Date.now()}

Service: ${form.get("service")}
📍 Pickup: ${form.get("pickup")}
📍 Drop: ${form.get("drop")}
📆 Date: ${form.get("dateTime")?.toString().split("T")[0]}
⌚ Time: ${new Date(form.get("dateTime")).toLocaleTimeString("en-IN", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})}

🚕 Vehicle Details:
Vehicle Type: ${form.get("vehicleType")}
Vehicle Model: ${form.get("vehicleModel")}
Vehicle No: ${form.get("vehicleNumber")}
Driver Name: ${form.get("driverName")}
Driver Mobile: ${form.get("driverMobile")}

💵 Fare Charges:
Fare: ₹${form.get("fare")}
Advance Paid: ₹${form.get("advance")}
Net Payable Amount: ₹${Number(form.get("fare")) - Number(form.get("advance") || 0)}

Thank You For Choosing Vishwakarma Travels 
Wish You A Very Happy Journey

For Queries Please Call or Whatsapp 
+91 7667989203`;

            window.open(
              `https://wa.me/91${customerPhone}?text=${encodeURIComponent(
                message
              )}`,
              "_blank"
            );
          }}
        >
          <input name="customerName" placeholder="Customer Name" style={inputStyle} required />
          <input name="customerPhone" placeholder="Customer WhatsApp Number" style={inputStyle} required />
<select name="gender" style={inputStyle} required>
  <option value="">Select Gender</option>
  <option value="Mr.">Male</option>
  <option value="Ms.">Female</option>
</select>
          <select name="service" style={inputStyle} required>
            <option value="">Select Service</option>
            <option>Airport Drop & Pickup</option>
            <option>Local Cab Service</option>
            <option>Outstation Booking</option>
            <option>Short Order Cab Service</option>
            <option>Marriage Function Booking</option>
            <option>Tour Package Service</option>
          </select>

          <input name="pickup" placeholder="Pickup Location" style={inputStyle} required />
          <input name="drop" placeholder="Drop Location" style={inputStyle} required />
          <input type="datetime-local" name="dateTime" style={inputStyle} required />

          <select name="vehicleType" style={inputStyle} required>
  <option value="">Select Vehicle Type</option>
  <option>Sedan</option>
  <option>SUV</option>
  <option>BUS</option>
</select>

<select name="vehicleModel" style={inputStyle} required>
  <option value="">Select Vehicle Model</option>
  <option>Dzire</option>
  <option>Ertiga</option>
  <option>Innova</option>
  <option>Crysta</option>
</select>

<input
  name="vehicleNumber"
  placeholder="Vehicle Number"
  style={inputStyle}
  onInput={(e) => {
    e.currentTarget.value =
      e.currentTarget.value.toUpperCase();
  }}
  required
/>
          <input name="fare" placeholder="Total Fare" style={inputStyle} required />
          <input name="advance" placeholder="Advance Paid" style={inputStyle} />

          <input name="driverName" placeholder="Driver Name" style={inputStyle} />
          <input name="driverMobile" placeholder="Driver Mobile" style={inputStyle} />

          <button type="submit" style={buttonStyle}>
            Send Confirmation On WhatsApp
          </button>
        </form>
      </div>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f3f7ff",
  fontFamily: "Arial",
  padding: "25px",
};

const cardStyle = {
  maxWidth: "650px",
  margin: "auto",
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
};

const inputStyle = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
};

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  padding: "15px",
  border: "none",
  borderRadius: "10px",
  fontSize: "18px",
  fontWeight: "bold",
};
