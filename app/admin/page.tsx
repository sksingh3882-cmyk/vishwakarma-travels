"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Customer = {
  name?: string;
  mobile?: string;
  address?: string;
};

type Vehicle = {
  vehicleNumber?: string;
  vehicleType?: string;
  vehicleModel?: string;
  driverName?: string;
  driverMobile?: string;
};

type BookingForm = {
  customerName: string;
  customerPhone: string;
  gender: string;
  service: string;
  pickup: string;
  drop: string;
  journeyDate: string;
  journeyTime: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleNumber: string;
  fare: string;
  advance: string;
  driverName: string;
  driverMobile: string;
};

const initialForm: BookingForm = {
  customerName: "",
  customerPhone: "",
  gender: "",
  service: "",
  pickup: "",
  drop: "",
  journeyDate: "",
  journeyTime: "",
  vehicleType: "",
  vehicleModel: "",
  vehicleNumber: "",
  fare: "",
  advance: "",
  driverName: "",
  driverMobile: "",
};

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [loading, setLoading] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const headers = useMemo(
    () => ({
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    }),
    [supabaseKey]
  );

  useEffect(() => {
    async function loadData() {
      if (!supabaseUrl || !supabaseKey) return;

      try {
        const customerRes = await fetch(
          `${supabaseUrl}/rest/v1/customers?select=*`,
          { headers }
        );

        const vehicleRes = await fetch(
          `${supabaseUrl}/rest/v1/vehicles?select=*`,
          { headers }
        );

        if (customerRes.ok) {
          const data: Customer[] = await customerRes.json();
          setCustomers(data);
        }

        if (vehicleRes.ok) {
          const data: Vehicle[] = await vehicleRes.json();
          setVehicles(data);
        }
      } catch (error) {
        console.log("Data loading error:", error);
      }
    }

    loadData();
  }, [supabaseUrl, supabaseKey, headers]);

  function updateForm<K extends keyof BookingForm>(
    key: K,
    value: BookingForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function cleanPhone(value: string) {
    let phone = value.replace(/\D/g, "");

    if (phone.startsWith("91") && phone.length === 12) {
      phone = phone.slice(2);
    }

    return phone.slice(0, 10);
  }

  function fillCustomer(value: string) {
    updateForm("customerName", value);

    const customer = customers.find((item) =>
      item.name?.toLowerCase().includes(value.toLowerCase())
    );

    if (!customer) return;

    setForm((prev) => ({
      ...prev,
      customerName: customer.name || prev.customerName,
      customerPhone: cleanPhone(customer.mobile || prev.customerPhone),
      pickup: customer.address || prev.pickup,
    }));
  }

  function fillVehicle(value: string) {
    const vehicleNo = value.toUpperCase();
    updateForm("vehicleNumber", vehicleNo);

    const vehicle = vehicles.find((item) =>
      item.vehicleNumber?.toLowerCase().includes(vehicleNo.toLowerCase())
    );

    if (!vehicle) return;

    setForm((prev) => ({
      ...prev,
      vehicleNumber: vehicle.vehicleNumber || prev.vehicleNumber,
      vehicleType: vehicle.vehicleType || prev.vehicleType,
      vehicleModel: vehicle.vehicleModel || prev.vehicleModel,
      driverName: vehicle.driverName || prev.driverName,
      driverMobile: cleanPhone(vehicle.driverMobile || prev.driverMobile),
    }));
  }

  const addressPool = useMemo(() => {
    const allAddresses = [
      ...customers.map((item) => item.address || ""),
      form.pickup,
      form.drop,
    ].filter(Boolean);

    return Array.from(new Set(allAddresses));
  }, [customers, form.pickup, form.drop]);

  const pickupSuggestions = useMemo(() => {
    return addressPool
      .filter((item) =>
        item.toLowerCase().includes(form.pickup.toLowerCase())
      )
      .slice(0, 10);
  }, [addressPool, form.pickup]);

  const dropSuggestions = useMemo(() => {
    return addressPool
      .filter((item) => item.toLowerCase().includes(form.drop.toLowerCase()))
      .slice(0, 10);
  }, [addressPool, form.drop]);

  function buildMessage(bookingId: string) {
    const fare = Number(form.fare || 0);
    const advance = Number(form.advance || 0);
    const netPay = fare - advance;

    return `✅ Booking Confirmed - Vishwakarma Travels

${form.gender} ${form.customerName},
Namaste, Your Booking is Confirmed.

Booking ID: ${bookingId}

Service: ${form.service}
Contact No: +91${form.customerPhone}

📍 Pickup: ${form.pickup}
📍 Drop: ${form.drop}
📆 Date: ${form.journeyDate}
⌚ Time: ${form.journeyTime}

🚕 Vehicle Details:
Vehicle Type: ${form.vehicleType}
Vehicle Model: ${form.vehicleModel}
Vehicle No: ${form.vehicleNumber}
Driver Name: ${form.driverName}
Driver Mobile: ${form.driverMobile}

💵 Fare Charges:
Fare: ₹${form.fare}
Advance Paid: ₹${form.advance || "0"}
Net Payable Amount: ₹${netPay}

Thank You For Choosing Vishwakarma Travels
Wish You A Very Happy Journey

For Queries Please Call or WhatsApp:
+91 7667989203`;
  }

  async function saveBooking(bookingId: string) {
    if (!supabaseUrl || !supabaseKey) {
      alert("Supabase URL ya ANON KEY missing hai.");
      return false;
    }

    const fare = Number(form.fare || 0);
    const advance = Number(form.advance || 0);

    const payload = {
      booking_id: bookingId,
      customer_name: form.customerName,
      customer_phone: form.customerPhone,
      gender: form.gender,
      service: form.service,
      pickup: form.pickup,
      drop_location: form.drop,
      journey_date: form.journeyDate,
      journey_time: form.journeyTime,
      vehicle_type: form.vehicleType,
      vehicle_model: form.vehicleModel,
      vehicle_number: form.vehicleNumber,
      fare: fare,
      advance: advance,
      net_payable: fare - advance,
      driver_name: form.driverName,
      driver_mobile: form.driverMobile,
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Supabase save error:", errorText);
      return false;
    }

    return true;
  }

  function openBillPdf(bookingId: string) {
    const fare = Number(form.fare || 0);
    const advance = Number(form.advance || 0);
    const netPay = fare - advance;

    const win = window.open("", "_blank");
    if (!win) {
      alert("Popup blocked hai. Browser me popup allow karo.");
      return;
    }

    win.document.write(`
      <html>
        <head>
          <title>${bookingId} Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 25px;
              color: #0f172a;
            }
            .card {
              border: 1px solid #cbd5e1;
              border-radius: 16px;
              padding: 24px;
              max-width: 760px;
              margin: auto;
            }
            h1 {
              margin: 0;
              font-size: 26px;
              color: #1d4ed8;
            }
            .muted {
              color: #475569;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
            }
            .total {
              margin-top: 14px;
              padding-top: 14px;
              border-top: 1px dashed #94a3b8;
              font-weight: bold;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Vishwakarma Travels</h1>
            <p class="muted">Premium Booking Invoice</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Customer:</strong> ${form.gender} ${form.customerName}</p>
            <p><strong>Contact:</strong> +91${form.customerPhone}</p>
            <p><strong>Service:</strong> ${form.service}</p>
            <p><strong>Route:</strong> ${form.pickup} → ${form.drop}</p>
            <p><strong>Date & Time:</strong> ${form.journeyDate} ${form.journeyTime}</p>
            <p><strong>Vehicle:</strong> ${form.vehicleType} / ${form.vehicleModel} (${form.vehicleNumber})</p>
            <p><strong>Driver:</strong> ${form.driverName} (${form.driverMobile})</p>
            <div class="row"><span>Fare</span><span>₹${fare}</span></div>
            <div class="row"><span>Advance</span><span>₹${advance}</span></div>
            <div class="row total"><span>Net Payable</span><span>₹${netPay}</span></div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);

    win.document.close();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (form.customerPhone.length !== 10) {
      alert("Customer WhatsApp number 10 digit ka hona chahiye.");
      return;
    }

    const bookingId = `VT-${Date.now()}`;
    const message = buildMessage(bookingId);

    setLoading(true);

    try {
      const saved = await saveBooking(bookingId);

      if (!saved) {
        alert("Booking database me save nahi hua. Supabase table/column check karo.");
        return;
      }

      window.open(
        `https://wa.me/91${form.customerPhone}?text=${encodeURIComponent(
          message
        )}`,
        "_blank"
      );

      alert("Booking saved and WhatsApp opened.");
      setForm(initialForm);
    } catch (error) {
      console.log("Booking submit error:", error);
      alert("Booking save karte time error aaya.");
    } finally {
      setLoading(false);
    }
  }

  if (!isLogin) {
    return (
      <main style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Admin Login</h1>

          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button
            type="button"
            style={buttonStyle}
            onClick={() =>
              password === "1234" ? setIsLogin(true) : alert("Wrong password")
            }
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
        <h1 style={{ marginTop: 0 }}>Premium Admin Booking</h1>

        <form style={{ display: "grid", gap: "12px" }} onSubmit={handleSubmit}>
          <input
            placeholder="Customer Name"
            style={inputStyle}
            list="customerList"
            value={form.customerName}
            onChange={(e) => fillCustomer(e.currentTarget.value)}
            required
          />

          <datalist id="customerList">
            {customers.map((customer, index) => (
              <option key={index} value={customer.name || ""} />
            ))}
          </datalist>

          <input
            placeholder="Customer WhatsApp Number"
            style={inputStyle}
            value={form.customerPhone}
            onChange={(e) =>
              updateForm("customerPhone", cleanPhone(e.currentTarget.value))
            }
            required
          />

          <select
            style={inputStyle}
            value={form.gender}
            onChange={(e) => updateForm("gender", e.currentTarget.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Mr.">Male</option>
            <option value="Ms.">Female</option>
          </select>

          <select
            style={inputStyle}
            value={form.service}
            onChange={(e) => updateForm("service", e.currentTarget.value)}
            required
          >
            <option value="">Select Service</option>
            <option value="Airport Drop & Pickup">Airport Drop & Pickup</option>
            <option value="Local Cab Service">Local Cab Service</option>
            <option value="Outstation Booking">Outstation Booking</option>
            <option value="Short Order Cab Service">
              Short Order Cab Service
            </option>
            <option value="Marriage Function Booking">
              Marriage Function Booking
            </option>
            <option value="Tour Package Service">Tour Package Service</option>
          </select>

          <input
            placeholder="Pickup Location"
            style={inputStyle}
            list="pickupList"
            value={form.pickup}
            onChange={(e) => updateForm("pickup", e.currentTarget.value)}
            required
          />

          <datalist id="pickupList">
            {pickupSuggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>

          <input
            placeholder="Drop Location"
            style={inputStyle}
            list="dropList"
            value={form.drop}
            onChange={(e) => updateForm("drop", e.currentTarget.value)}
            required
          />

          <datalist id="dropList">
            {dropSuggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>

          <input
            type="date"
            style={inputStyle}
            value={form.journeyDate}
            onChange={(e) => updateForm("journeyDate", e.currentTarget.value)}
            required
          />

          <input
            type="time"
            style={inputStyle}
            value={form.journeyTime}
            onChange={(e) => updateForm("journeyTime", e.currentTarget.value)}
            required
          />

          <input
            placeholder="Vehicle Number"
            style={inputStyle}
            list="vehicleList"
            value={form.vehicleNumber}
            onChange={(e) => fillVehicle(e.currentTarget.value)}
            required
          />

          <datalist id="vehicleList">
            {vehicles.map((vehicle, index) => (
              <option key={index} value={vehicle.vehicleNumber || ""} />
            ))}
          </datalist>

          <input
            placeholder="Vehicle Type"
            style={inputStyle}
            value={form.vehicleType}
            onChange={(e) => updateForm("vehicleType", e.currentTarget.value)}
            required
          />

          <input
            placeholder="Vehicle Model"
            style={inputStyle}
            value={form.vehicleModel}
            onChange={(e) => updateForm("vehicleModel", e.currentTarget.value)}
            required
          />

          <input
            placeholder="Total Fare"
            style={inputStyle}
            value={form.fare}
            onChange={(e) =>
              updateForm("fare", e.currentTarget.value.replace(/\D/g, ""))
            }
            required
          />

          <input
            placeholder="Advance Paid"
            style={inputStyle}
            value={form.advance}
            onChange={(e) =>
              updateForm("advance", e.currentTarget.value.replace(/\D/g, ""))
            }
          />

          <input
            placeholder="Driver Name"
            style={inputStyle}
            value={form.driverName}
            onChange={(e) => updateForm("driverName", e.currentTarget.value)}
          />

          <input
            placeholder="Driver Mobile"
            style={inputStyle}
            value={form.driverMobile}
            onChange={(e) =>
              updateForm("driverMobile", cleanPhone(e.currentTarget.value))
            }
          />

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? "Saving..." : "Send Confirmation On WhatsApp"}
            </button>

            <button
              type="button"
              style={secondaryButtonStyle}
              onClick={() => openBillPdf(`VT-${Date.now()}`)}
            >
              Bill PDF
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #e0ecff 0%, #f8fbff 100%)",
  fontFamily: "Arial, sans-serif",
  padding: "25px",
};

const cardStyle: CSSProperties = {
  maxWidth: "740px",
  margin: "auto",
  background: "white",
  padding: "25px",
  borderRadius: "18px",
  border: "1px solid #dbeafe",
  boxShadow: "0 18px 35px rgba(15,23,42,0.12)",
};

const inputStyle: CSSProperties = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box",
};

const buttonStyle: CSSProperties = {
  background: "linear-gradient(90deg,#1d4ed8,#2563eb)",
  color: "white",
  padding: "14px 16px",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

const secondaryButtonStyle: CSSProperties = {
  background: "#0f172a",
  color: "white",
  padding: "14px 16px",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};
