"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const phone = "917667989203";

  useEffect(() => {
    async function loadData() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) return;

      const customerRes = await fetch(`${supabaseUrl}/rest/v1/customers`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });

      const vehicleRes = await fetch(`${supabaseUrl}/rest/v1/vehicles`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });

      setCustomers(await customerRes.json());
      setVehicles(await vehicleRes.json());
    }

    loadData();
  }, []);

  function setField(name: string, value: string) {
    const input = document.querySelector(`[name="${name}"]`) as HTMLInputElement;
    if (input) input.value = value;
  }

  function fillCustomer(value: string) {
    const c = customers.find((x) =>
      x.name?.toLowerCase().includes(value.toLowerCase())
    );

    if (c) {
      setField("customerName", c.name || "");
      setField("customerPhone", c.mobile || "");
      setField("pickup", c.address || "");
    }
  }

  function fillVehicle(value: string) {
    const v = vehicles.find((x) =>
      x.vehicleNumber?.toLowerCase().includes(value.toLowerCase())
    );

    if (v) {
      setField("vehicleNumber", v.vehicleNumber || "");
      setField("vehicleType", v.vehicleType || "");
      setField("vehicleModel", v.vehicleModel || "");
      setField("driverName", v.driverName || "");
      setField("driverMobile", v.driverMobile || "");
    }
  }

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

            const message = `✅ Booking Confirmed - Vishwakarma Travels

Dear ${form.get("customerName")},
Your cab booking is confirmed.

Booking ID: VT-${Date.now()}

Service: ${form.get("service")}

Name: ${form.get("customerName")}
Address: ${form.get("pickup")}
Contact No: +91${form.get("customerPhone")}

Pickup: ${form.get("pickup")}
Drop: ${form.get("drop")}
Date & Time: ${form.get("dateTime")}

Vehicle No: ${form.get("vehicleNumber")}
Vehicle Type: ${form.get("vehicleType")}
Vehicle Model: ${form.get("vehicleModel")}

Fare: ₹${form.get("fare")}
Advance Paid: ₹${form.get("advance")}

Driver Name: ${form.get("driverName")}
Driver Mobile: ${form.get("driverMobile")}

Thank you,
Vishwakarma Travels
Bagbera, Jamshedpur
+91 7667989203`;

            window.open(
              `https://wa.me/91${customerPhone}?text=${encodeURIComponent(
                message
              )}`,
              "_blank"
            );
          }}
        >
          <input
            name="customerName"
            placeholder="Customer Name"
            style={inputStyle}
            list="customerList"
            onChange={(e) => fillCustomer(e.currentTarget.value)}
            required
          />

          <datalist id="customerList">
            {customers.map((c, i) => (
              <option key={i} value={c.name} />
            ))}
          </datalist>

          <input
            name="customerPhone"
            placeholder="Customer WhatsApp Number"
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

          <input name="pickup" placeholder="Pickup Location" style={inputStyle} required />
          <input name="drop" placeholder="Drop Location" style={inputStyle} required />
          <input type="datetime-local" name="dateTime" style={inputStyle} required />

          <input
            name="vehicleNumber"
            placeholder="Vehicle Number"
            style={inputStyle}
            list="vehicleList"
            onChange={(e) => fillVehicle(e.currentTarget.value)}
            required
          />

          <datalist id="vehicleList">
            {vehicles.map((v, i) => (
              <option key={i} value={v.vehicleNumber} />
            ))}
          </datalist>

          <input name="vehicleType" placeholder="Vehicle Type" style={inputStyle} />
          <input name="vehicleModel" placeholder="Vehicle Model" style={inputStyle} />

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
