"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

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

type BookingRecord = {
  customer_name?: string;
  customer_phone?: string;
  pickup?: string;
  drop_location?: string;
  journey_date?: string;
  fare?: number;
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
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
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
        const [customerRes, vehicleRes, bookingRes] = await Promise.all([
          fetch(`${supabaseUrl}/rest/v1/customers?select=*`, { headers }),
          fetch(`${supabaseUrl}/rest/v1/vehicles?select=*`, { headers }),
          fetch(`${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc`, {
            headers,
          }),
        ]);

        if (customerRes.ok) {
          setCustomers(await customerRes.json());
        }

        if (vehicleRes.ok) {
          setVehicles(await vehicleRes.json());
        }

        if (bookingRes.ok) {
          setBookings(await bookingRes.json());
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

    const search = value.toLowerCase().trim();
    if (search.length < 2) return;

    const customer = customers.find((item) => {
      const name = item.name?.toLowerCase() || "";
      const mobile = cleanPhone(item.mobile || "");
      const address = item.address?.toLowerCase() || "";

      return (
        name.includes(search) ||
        mobile.includes(search) ||
        address.includes(search)
      );
    });

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

    if (!vehicleNo.trim()) return;

    const vehicle = vehicles.find((item) => {
      const fullNo = item.vehicleNumber?.toUpperCase() || "";
      return fullNo.includes(vehicleNo) || fullNo.endsWith(vehicleNo);
    });

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
      .filter((item) => item.toLowerCase().includes(form.pickup.toLowerCase()))
      .slice(0, 10);
  }, [addressPool, form.pickup]);

  const dropSuggestions = useMemo(() => {
    return addressPool
      .filter((item) => item.toLowerCase().includes(form.drop.toLowerCase()))
      .slice(0, 10);
  }, [addressPool, form.drop]);

  const repeatCustomer = useMemo(() => {
    const phone = form.customerPhone.trim();
    if (phone.length !== 10) return null;

    const matches = bookings.filter(
      (booking) => cleanPhone(booking.customer_phone || "") === phone
    );

    if (matches.length === 0) return null;

    return {
      totalBookings: matches.length,
      lastBooking: matches[0],
    };
  }, [bookings, form.customerPhone]);

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
      fare,
      advance,
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
      console.log("Supabase booking save error:", await response.text());
      return false;
    }

    return true;
  }

  async function saveCustomerIfNew() {
    const phone = cleanPhone(form.customerPhone);

    if (!supabaseUrl || !supabaseKey) return;
    if (!phone || phone.length !== 10 || !form.customerName.trim()) return;

    const alreadyExists = customers.some(
      (item) => cleanPhone(item.mobile || "") === phone
    );

    if (alreadyExists) return;

    const payload: Customer = {
      name: form.customerName.trim(),
      mobile: phone,
      address: form.pickup.trim(),
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/customers`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setCustomers((prev) => [payload, ...prev]);
    } else {
      console.log("Customer auto-save failed:", await response.text());
    }
  }

  async function saveVehicleIfNew() {
    const vehicleNo = form.vehicleNumber.trim().toUpperCase();

    if (!supabaseUrl || !supabaseKey) return;
    if (!vehicleNo) return;

    const alreadyExists = vehicles.some(
      (item) => item.vehicleNumber?.toUpperCase() === vehicleNo
    );

    if (alreadyExists) return;

    const payload: Vehicle = {
      vehicleNumber: vehicleNo,
      vehicleType: form.vehicleType.trim(),
      vehicleModel: form.vehicleModel.trim(),
      driverName: form.driverName.trim(),
      driverMobile: cleanPhone(form.driverMobile),
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/vehicles`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setVehicles((prev) => [payload, ...prev]);
    } else {
      console.log("Vehicle auto-save failed:", await response.text());
    }
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

    const html = `
<html>
<head>
<title>${bookingId} Invoice</title>
<style>
@page {
  size: A4;
  margin: 10mm;
}

body {
  font-family: Arial, sans-serif;
  color: #071633;
  margin: 0;
  background: white;
}

.invoice {
  border: 2px solid #071633;
  padding: 14px;
  max-width: 900px;
  margin: auto;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #071633;
  padding-bottom: 8px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logoBox {
  width: 130px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
}

.logoCar {
  font-size: 42px;
}

.company h1 {
  margin: 0;
  font-size: 30px;
  font-style: italic;
}

.company p {
  margin: 4px 0;
  font-size: 13px;
  font-weight: bold;
}

.invoiceBox {
  border: 1px solid #071633;
  border-radius: 8px;
  overflow: hidden;
  min-width: 150px;
  text-align: center;
}

.invoiceTitle {
  background: #071633;
  color: white;
  font-size: 24px;
  font-weight: bold;
  padding: 8px;
}

.billNo {
  padding: 10px;
  font-weight: bold;
}

.section {
  margin-top: 10px;
  border: 1px solid #071633;
  border-radius: 8px;
  overflow: hidden;
}

.sectionTitle {
  background: #071633;
  color: white;
  font-weight: bold;
  padding: 6px 10px;
  font-size: 15px;
}

.twoCol {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.leftCol,
.rightCol {
  padding: 10px;
}

.leftCol {
  border-right: 1px solid #071633;
}

.row {
  display: grid;
  grid-template-columns: 130px 12px 1fr;
  margin: 7px 0;
  font-size: 14px;
}

.label {
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th {
  background: #071633;
  color: white;
  padding: 7px;
  text-align: left;
}

td {
  border: 1px solid #9ca3af;
  padding: 7px;
}

.right {
  text-align: right;
}

.totalRow td {
  font-weight: bold;
  font-size: 16px;
}

.payable {
  display: grid;
  grid-template-columns: 220px 1fr 220px;
  border: 1px solid #071633;
  margin-top: 10px;
}

.payable div {
  padding: 10px;
  font-weight: bold;
  border-right: 1px solid #071633;
}

.payable div:last-child {
  border-right: none;
  background: #071633;
  color: white;
  text-align: right;
  font-size: 22px;
}

.thanks {
  display: grid;
  grid-template-columns: 1fr 1fr 170px;
  border: 1px solid #071633;
  margin-top: 10px;
  align-items: center;
}

.thanks div {
  padding: 10px;
}

.qr {
  width: 120px;
  height: 120px;
  border: 1px solid #cccccc;
  display: grid;
  place-items: center;
  font-size: 13px;
  text-align: center;
}

.cut {
  text-align: center;
  border-top: 2px dashed #071633;
  margin: 12px 0;
  font-size: 22px;
}

.copyTitle {
  text-align: center;
  background: #071633;
  color: white;
  width: fit-content;
  margin: -2px auto 8px auto;
  padding: 4px 12px;
  font-weight: bold;
  border-radius: 4px;
}

.declaration {
  border: 1px dashed #071633;
  padding: 10px;
  margin-top: 8px;
  font-size: 13px;
}

.footer {
  margin-top: 10px;
  background: #071633;
  color: white;
  text-align: center;
  padding: 12px;
  font-weight: bold;
  font-size: 16px;
}
</style>
</head>

<body>
<div class="invoice">
  <div class="top">
    <div class="brand">
      <div class="logoBox">
        <div class="logoCar">🚘</div>
        VISHWAKARMA<br />TRAVELS
      </div>

      <div class="company">
        <h1>Vishwakarma Travels</h1>
        <p>H No 19 Bagbera Jugsalai Jamshedpur</p>
        <p>+91 7667989203</p>
      </div>
    </div>

    <div class="invoiceBox">
      <div class="invoiceTitle">INVOICE</div>
      <div class="billNo">Bill No.<br />${bookingId}</div>
    </div>
  </div>

  <div class="section">
    <div class="twoCol">
      <div class="leftCol">
        <div class="sectionTitle">BOOKING DETAILS</div>
        <div class="row"><span class="label">Trip Detail</span><span>:</span><span>${form.pickup} to ${form.drop}</span></div>
        <div class="row"><span class="label">Client Name</span><span>:</span><span>${form.gender} ${form.customerName}</span></div>
        <div class="row"><span class="label">Address</span><span>:</span><span>${form.pickup}</span></div>
        <div class="row"><span class="label">Contact No.</span><span>:</span><span>+91${form.customerPhone}</span></div>
        <div class="row"><span class="label">Booking Date</span><span>:</span><span>${form.journeyDate}</span></div>
        <div class="row"><span class="label">Reporting Time</span><span>:</span><span>${form.journeyTime}</span></div>
      </div>

      <div class="rightCol">
        <div class="sectionTitle">VEHICLE DETAILS</div>
        <div class="row"><span class="label">REG NO.</span><span>:</span><span>${form.vehicleNumber}</span></div>
        <div class="row"><span class="label">MODEL</span><span>:</span><span>${form.vehicleModel}</span></div>
        <div class="row"><span class="label">CAB TYPE</span><span>:</span><span>${form.vehicleType}</span></div>
        <div class="row"><span class="label">DRIVER NAME</span><span>:</span><span>${form.driverName}</span></div>
        <div class="row"><span class="label">CONTACT NO.</span><span>:</span><span>+91${form.driverMobile}</span></div>
      </div>
    </div>
  </div>

  <div class="section">
    <table>
      <tr>
        <th>FARE CHARGES</th>
        <th>TYPE</th>
        <th class="right">AMOUNT ₹</th>
      </tr>

      <tr>
        <td>${form.pickup} to ${form.drop}</td>
        <td>Per Trip</td>
        <td class="right">${fare.toFixed(2)}</td>
      </tr>

      <tr>
        <td>Advance Paid</td>
        <td>-</td>
        <td class="right">${advance.toFixed(2)}</td>
      </tr>

      <tr>
        <td>Discount / Round Off</td>
        <td>-</td>
        <td class="right">0.00</td>
      </tr>

      <tr class="totalRow">
        <td colspan="2" class="right">Total Amount</td>
        <td class="right">${netPay.toFixed(2)}</td>
      </tr>
    </table>
  </div>

  <div class="payable">
    <div>TOTAL AMOUNT PAYABLE</div>
    <div>Rupees ${netPay.toFixed(2)} Only</div>
    <div>₹ ${netPay.toFixed(2)}</div>
  </div>

  <div class="thanks">
    <div>
      Thank You Dear Sir/Madam<br />
      For Giving Us Booking<br />
      Thank You For Your<br />
      Support & Booking
    </div>

    <div style="text-align:center;font-weight:bold;">
      PhonePe | GPay | BHIM UPI<br /><br />
      Scan This QR Code To Pay Us
    </div>

    <div class="qr">QR Code<br />Here</div>
  </div>

  <div class="cut">✂</div>
  <div class="copyTitle">BOOKING CONFIRMATION COPY</div>

  <div class="twoCol">
    <div class="leftCol">
      <div class="sectionTitle">TRIP DETAILS</div>
      <div class="row"><span class="label">Trip Detail</span><span>:</span><span>${form.pickup} to ${form.drop}</span></div>
      <div class="row"><span class="label">Client Name</span><span>:</span><span>${form.gender} ${form.customerName}</span></div>
      <div class="row"><span class="label">Contact No</span><span>:</span><span>+91${form.customerPhone}</span></div>
      <div class="row"><span class="label">Booking Date</span><span>:</span><span>${form.journeyDate}</span></div>
    </div>

    <div class="rightCol">
      <div class="sectionTitle">VEHICLE DETAILS</div>
      <div class="row"><span class="label">Vehicle Type</span><span>:</span><span>${form.vehicleType}</span></div>
      <div class="row"><span class="label">Vehicle No</span><span>:</span><span>${form.vehicleNumber}</span></div>
      <div class="row"><span class="label">Model</span><span>:</span><span>${form.vehicleModel}</span></div>
      <div class="row"><span class="label">Driver Name</span><span>:</span><span>${form.driverName}</span></div>
      <div class="row"><span class="label">Contact No</span><span>:</span><span>+91${form.driverMobile}</span></div>
    </div>
  </div>

  <div class="declaration">
    <b>DECLARATION</b><br />
    ➤ Book A Cab Atleast 24 Hour Before Travelling Otherwise Booking May Not Be Confirmed<br />
    ➤ After the booking is Confirmed, Customer will have to make the Advance Payment<br />
    ➤ Rs.500 Cancellation Charge will have to be paid on Cancellation of Booking under any Circumstances
  </div>

  <div class="footer">THANK YOU & WISH YOU A VERY HAPPY JOURNEY</div>
</div>

<script>
  window.print();
</script>
</body>
</html>
`;

    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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

      await Promise.all([saveCustomerIfNew(), saveVehicleIfNew()]);

      setBookings((prev) => [
        {
          customer_name: form.customerName,
          customer_phone: form.customerPhone,
          pickup: form.pickup,
          drop_location: form.drop,
          journey_date: form.journeyDate,
          fare: Number(form.fare || 0),
        },
        ...prev,
      ]);

      window.open(
        `https://wa.me/91${form.customerPhone}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      alert("Booking saved, customer/vehicle updated and WhatsApp opened.");
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
            
