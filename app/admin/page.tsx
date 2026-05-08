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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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

        if (customerRes.ok) setCustomers(await customerRes.json());
        if (vehicleRes.ok) setVehicles(await vehicleRes.json());
        if (bookingRes.ok) setBookings(await bookingRes.json());
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

  function normalize(value: string) {
    return value.toLowerCase().trim();
  }

  const customerSuggestions = useMemo(() => {
    const q = normalize(form.customerName);
    if (q.length < 1) return [];

    return customers
      .filter((c) => {
        const name = normalize(c.name || "");
        const mobile = cleanPhone(c.mobile || "");
        const address = normalize(c.address || "");
        return name.includes(q) || mobile.includes(q) || address.includes(q);
      })
      .slice(0, 10);
  }, [customers, form.customerName]);

  function fillCustomer(value: string) {
    updateForm("customerName", value);

    const q = normalize(value);
    if (q.length < 2) return;

    const exactMobileMatch = customers.find(
      (c) => cleanPhone(c.mobile || "") === cleanPhone(q)
    );

    const nameStartsMatch = customers.find((c) =>
      normalize(c.name || "").startsWith(q)
    );

    const genericMatch = customers.find((c) => {
      const name = normalize(c.name || "");
      const mobile = cleanPhone(c.mobile || "");
      const address = normalize(c.address || "");
      return name.includes(q) || mobile.includes(q) || address.includes(q);
    });

    const customer = exactMobileMatch || nameStartsMatch || genericMatch;
    if (!customer) return;

    setForm((prev) => ({
      ...prev,
      customerName: customer.name || prev.customerName,
      customerPhone: cleanPhone(customer.mobile || prev.customerPhone),
      pickup: customer.address || prev.pickup,
    }));
  }

  const vehicleSuggestions = useMemo(() => {
    const q = normalize(form.vehicleNumber).toUpperCase();
    if (q.length < 1) return [];

    return vehicles
      .filter((v) => {
        const fullNo = (v.vehicleNumber || "").toUpperCase();
        return fullNo.includes(q) || fullNo.endsWith(q);
      })
      .slice(0, 10);
  }, [vehicles, form.vehicleNumber]);

  function fillVehicle(value: string) {
    const vehicleNo = value.toUpperCase();
    updateForm("vehicleNumber", vehicleNo);

    const q = vehicleNo.trim();
    if (q.length < 2) return;

    const exactMatch = vehicles.find(
      (v) => (v.vehicleNumber || "").toUpperCase() === q
    );

    const endsWithMatch = vehicles.find((v) =>
      (v.vehicleNumber || "").toUpperCase().endsWith(q)
    );

    const includesMatch = vehicles.find((v) =>
      (v.vehicleNumber || "").toUpperCase().includes(q)
    );

    const vehicle = exactMatch || endsWithMatch || includesMatch;
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
    const all = [...customers.map((c) => c.address || ""), form.pickup, form.drop].filter(
      Boolean
    );
    return Array.from(new Set(all));
  }, [customers, form.pickup, form.drop]);

  const pickupSuggestions = useMemo(
    () =>
      addressPool
        .filter((a) => a.toLowerCase().includes(form.pickup.toLowerCase()))
        .slice(0, 10),
    [addressPool, form.pickup]
  );

  const dropSuggestions = useMemo(
    () =>
      addressPool
        .filter((a) => a.toLowerCase().includes(form.drop.toLowerCase()))
        .slice(0, 10),
    [addressPool, form.drop]
  );

  const repeatCustomer = useMemo(() => {
    const phone = form.customerPhone.trim();
    if (phone.length !== 10) return null;

    const matches = bookings.filter(
      (b) => cleanPhone(b.customer_phone || "") === phone
    );

    if (!matches.length) return null;
    return { totalBookings: matches.length, lastBooking: matches[0] };
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
    if (phone.length !== 10 || !form.customerName.trim()) return;

    const exists = customers.some((c) => cleanPhone(c.mobile || "") === phone);
    if (exists) return;

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

    const exists = vehicles.some(
      (v) => (v.vehicleNumber || "").toUpperCase() === vehicleNo
    );
    if (exists) return;

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
    const billDate = new Date().toLocaleDateString("en-GB");

    const safe = {
      customerName: escapeHtml(form.customerName),
      customerPhone: escapeHtml(form.customerPhone),
      gender: escapeHtml(form.gender),
      pickup: escapeHtml(form.pickup),
      drop: escapeHtml(form.drop),
      journeyDate: escapeHtml(form.journeyDate),
      journeyTime: escapeHtml(form.journeyTime),
      vehicleType: escapeHtml(form.vehicleType),
      vehicleModel: escapeHtml(form.vehicleModel),
      vehicleNumber: escapeHtml(form.vehicleNumber),
      driverName: escapeHtml(form.driverName),
      driverMobile: escapeHtml(form.driverMobile),
    };

    const win = window.open("", "_blank");
    if (!win) {
      alert("Popup blocked hai. Browser me popup allow karo.");
      return;
    }

    const html = `
<html>
<head>
<title>${escapeHtml(bookingId)} Invoice</title>
<style>
@page { size:A4; margin:8mm; }
body { font-family: Arial, sans-serif; color:#0b1f4d; margin:0; }
.invoice { border:2px solid #0b2d6b; border-radius:10px; overflow:hidden; }
.header { display:flex; justify-content:space-between; align-items:center; padding:14px; border-bottom:2px solid #0b2d6b; }
.brand h1 { margin:0; font-size:36px; color:#0b2d6b; }
.brand p { margin:4px 0; font-weight:bold; }
.invbox { border:2px solid #0b2d6b; border-radius:8px; overflow:hidden; min-width:180px; text-align:center; }
.invbox .t { background:#0b2d6b; color:#fff; font-size:36px; font-weight:bold; padding:6px; }
.invbox .b { padding:10px; font-size:24px; font-weight:bold; color:#c41212; }
.sec { margin:10px; border:1px solid #0b2d6b; border-radius:8px; overflow:hidden; }
.secTitle { background:#0b2d6b; color:#fff; font-weight:bold; padding:6px 10px; }
.twocol { display:grid; grid-template-columns:1fr 1fr; }
.col { padding:10px; }
.col:first-child { border-right:1px solid #d1d5db; }
.row { display:grid; grid-template-columns:130px 10px 1fr; margin:6px 0; font-size:14px; }
.label { font-weight:bold; }
table { width:100%; border-collapse:collapse; font-size:14px; }
th { background:#0b2d6b; color:#fff; padding:8px; text-align:left; }
td { border:1px solid #d1d5db; padding:8px; }
.right { text-align:right; }
.total { font-weight:bold; font-size:16px; }
.pay { margin:10px; border:1px solid #0b2d6b; display:grid; grid-template-columns:250px 1fr 220px; }
.pay div { padding:10px; font-weight:bold; border-right:1px solid #0b2d6b; }
.pay div:last-child { border-right:none; background:#0b2d6b; color:#fff; text-align:right; font-size:28px; }
.footer { margin-top:8px; text-align:center; background:#0b2d6b; color:#fff; font-weight:bold; padding:10px; }
.copy { margin:10px; border-top:2px dashed #0b2d6b; padding-top:8px; text-align:center; font-weight:bold; color:#0b2d6b; }
.declare { margin:10px; border:1px dashed #0b2d6b; border-radius:8px; padding:10px; font-size:13px; }
.small { font-size:12px; color:#334155; }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="brand">
      <h1>Vishwakarma Travels</h1>
      <p>H No 19 Bagbera Jugsalai Jamshedpur</p>
      <p>+91 7667989203</p>
    </div>
    <div class="invbox">
      <div class="t">INVOICE</div>
      <div class="b">${escapeHtml(bookingId)}</div>
      <div class="small">Date: ${escapeHtml(billDate)}</div>
    </div>
  </div>

  <div class="sec">
    <div class="twocol">
      <div class="col">
        <div class="secTitle">BOOKING DETAILS</div>
        <div class="row"><span class="label">Trip Detail</span><span>:</span><span>${safe.pickup} to ${safe.drop}</span></div>
        <div class="row"><span class="label">Client Name</span><span>:</span><span>${safe.gender} ${safe.customerName}</span></div>
        <div class="row"><span class="label">Address</span><span>:</span><span>${safe.pickup}</span></div>
        <div class="row"><span class="label">Contact No.</span><span>:</span><span>+91${safe.customerPhone}</span></div>
        <div class="row"><span class="label">Booking Date</span><span>:</span><span>${safe.journeyDate}</span></div>
        <div class="row"><span class="label">Reporting Time</span><span>:</span><span>${safe.journeyTime}</span></div>
      </div>
      <div class="col">
        <div class="secTitle">VEHICLE DETAILS</div>
        <div class="row"><span class="label">REG NO.</span><span>:</span><span>${safe.vehicleNumber}</span></div>
        <div class="row"><span class="label">MODEL</span><span>:</span><span>${safe.vehicleModel}</span></div>
        <div class="row"><span class="label">CAB TYPE</span><span>:</span><span>${safe.vehicleType}</span></div>
        <div class="row"><span class="label">DRIVER NAME</span><span>:</span><span>${safe.driverName}</span></div>
        <div class="row"><span class="label">CONTACT NO.</span><span>:</span><span>+91${safe.driverMobile}</span></div>
      </div>
    </div>
  </div>

  <div class="sec">
    <table>
      <tr>
        <th>FARE CHARGES</th>
        <th>TYPE</th>
        <th class="right">AMOUNT ₹</th>
      </tr>
      <tr>
        <td>${safe.pickup} to ${safe.drop}</td>
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
      <tr class="total">
        <td colspan="2" class="right">Total Amount</td>
        <td class="right">${netPay.toFixed(2)}</td>
      </tr>
    </table>
  </div>

  <div class="pay">
    <div>TOTAL AMOUNT PAYABLE</div>
    <div>Rupees ${netPay.toFixed(2)} Only</div>
    <div>₹ ${netPay.toFixed(2)}</div>
  </div>

  <div class="copy">BOOKING CONFIRMATION COPY</div>

  <div class="sec">
    <div class="twocol">
      <div class="col">
        <div class="secTitle">TRIP DETAILS</div>
        <div class="row"><span class="label">Trip</span><span>:</span><span>${safe.pickup} to ${safe.drop}</span></div>
        <div class="row"><span class="label">Client</span><span>:</span><span>${safe.gender} ${safe.customerName}</span></div>
        <div class="row"><span class="label">Contact</span><span>:</span><span>+91${safe.customerPhone}</span></div>
      </div>
      <div class="col">
        <div class="secTitle">VEHICLE DETAILS</div>
        <div class="row"><span class="label">Type</span><span>:</span><span>${safe.vehicleType}</span></div>
        <div class="row"><span class="label">Vehicle</span><span>:</span><span>${safe.vehicleNumber}</span></div>
        <div class="row"><span class="label">Driver</span><span>:</span><span>${safe.driverName} (+91${safe.driverMobile})</span></div>
      </div>
    </div>
  </div>

  <div class="declare">
    <b>DECLARATION</b><br/>
    ➤ Book A Cab Atleast 24 Hour Before Travelling Otherwise Booking May Not Be Confirmed<br/>
    ➤ After booking is confirmed, customer will have to make advance payment<br/>
    ➤ Rs.500 cancellation charge will apply
  </div>

  <div class="footer">THANK YOU & WISH YOU A VERY HAPPY JOURNEY</div>
</div>

<script>window.print();</script>
</body>
</html>
`;

    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fare = Number(form.fare || 0);
    const advance = Number(form.advance || 0);

    if (form.customerPhone.length !== 10) {
      alert("Customer WhatsApp number 10 digit ka hona chahiye.");
      return;
    }

    if (fare <= 0) {
      alert("Total Fare valid enter karo.");
      return;
    }

    if (advance > fare) {
      alert("Advance Fare se zyada nahi ho sakta.");
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
          fare,
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
      <main style={{ minHeight: "100vh", padding: "20px", background: "#f5f5f5" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
  <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
    Admin Dashboard
  </h1>
</div>
</main>
    );
  }
}
