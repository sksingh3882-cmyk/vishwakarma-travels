diff --git a/app/admin/page.tsx b/app/admin/page.tsx
index c660a15bd47e686592fc962a8c15c81ac159c9bb..fb1268d1833409d75bf19919ec9cccb6475c3413 100644
--- a/app/admin/page.tsx
+++ b/app/admin/page.tsx
@@ -1,247 +1,374 @@
 "use client";
 
-import { useState } from "react";
+import { useEffect, useMemo, useState } from "react";
+
+type Customer = {
+  name?: string;
+  mobile?: string;
+  address?: string;
+};
+
+type Vehicle = {
+  vehicleNumber?: string;
+  vehicleType?: string;
+  vehicleModel?: string;
+  driverName?: string;
+  driverMobile?: string;
+};
+
+type BookingForm = {
+  customerName: string;
+  customerPhone: string;
+  gender: string;
+  service: string;
+  pickup: string;
+  drop: string;
+  journeyDate: string;
+  journeyTime: string;
+  vehicleType: string;
+  vehicleModel: string;
+  vehicleNumber: string;
+  fare: string;
+  advance: string;
+  driverName: string;
+  driverMobile: string;
+};
+
+const initialForm: BookingForm = {
+  customerName: "",
+  customerPhone: "",
+  gender: "",
+  service: "",
+  pickup: "",
+  drop: "",
+  journeyDate: "",
+  journeyTime: "",
+  vehicleType: "",
+  vehicleModel: "",
+  vehicleNumber: "",
+  fare: "",
+  advance: "",
+  driverName: "",
+  driverMobile: "",
+};
 
 export default function AdminPage() {
   const [isLogin, setIsLogin] = useState(false);
   const [password, setPassword] = useState("");
+  const [customers, setCustomers] = useState<Customer[]>([]);
+  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
+  const [form, setForm] = useState<BookingForm>(initialForm);
+
+  useEffect(() => {
+    async function loadData() {
+      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
+      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
+
+      if (!supabaseUrl || !supabaseKey) return;
+
+      const headers = {
+        apikey: supabaseKey,
+        Authorization: `Bearer ${supabaseKey}`,
+      };
+
+      const [customerRes, vehicleRes] = await Promise.all([
+        fetch(`${supabaseUrl}/rest/v1/customers?select=*`, { headers }),
+        fetch(`${supabaseUrl}/rest/v1/vehicles?select=*`, { headers }),
+      ]);
+
+      if (customerRes.ok) setCustomers(await customerRes.json());
+      if (vehicleRes.ok) setVehicles(await vehicleRes.json());
+    }
+
+    loadData();
+  }, []);
+
+  const addressPool = useMemo(() => {
+    const all = [
+      ...customers.map((c) => c.address || ""),
+      ...customers.map((c) => c.name || ""),
+      form.pickup,
+      form.drop,
+    ].filter(Boolean);
+
+    return Array.from(new Set(all));
+  }, [customers, form.pickup, form.drop]);
+
+  const filteredPickupSuggestions = useMemo(() => {
+    if (!form.pickup.trim()) return addressPool.slice(0, 10);
+    return addressPool
+      .filter((x) => x.toLowerCase().includes(form.pickup.toLowerCase()))
+      .slice(0, 10);
+  }, [addressPool, form.pickup]);
+
+  const filteredDropSuggestions = useMemo(() => {
+    if (!form.drop.trim()) return addressPool.slice(0, 10);
+    return addressPool
+      .filter((x) => x.toLowerCase().includes(form.drop.toLowerCase()))
+      .slice(0, 10);
+  }, [addressPool, form.drop]);
+
+  function updateForm<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
+    setForm((prev) => ({ ...prev, [key]: value }));
+  }
 
-  const phone = "917667989203";
-  const [customers, setCustomers] = useState<any[]>([]);
-const [vehicles, setVehicles] = useState<any[]>([]);
-
-function setField(name: string, value: string) {
-  const input = document.querySelector(
-    `[name="${name}"]`
-  ) as HTMLInputElement;
+  function fillCustomer(value: string) {
+    updateForm("customerName", value);
+    if (value.trim().length < 2) return;
 
-  if (input) input.value = value;
-}
+    const c = customers.find((x) => x.name?.toLowerCase().includes(value.toLowerCase()));
+    if (!c) return;
 
-function loadCustomer(value: string) {
-  const c = customers.find((x) =>
-    x.name?.toLowerCase().includes(value.toLowerCase())
-  );
+    setForm((prev) => ({
+      ...prev,
+      customerName: c.name || prev.customerName,
+      customerPhone: c.mobile || prev.customerPhone,
+      pickup: c.address || prev.pickup,
+    }));
+  }
 
-  if (c) {
-    setField("customerName", c.name);
-    setField("customerPhone", c.mobile);
-    setField("pickup", c.address);
+  function fillVehicle(value: string) {
+    updateForm("vehicleNumber", value.toUpperCase());
+    const v = vehicles.find((x) => x.vehicleNumber?.toLowerCase().includes(value.toLowerCase()));
+    if (!v) return;
+
+    setForm((prev) => ({
+      ...prev,
+      vehicleNumber: v.vehicleNumber || prev.vehicleNumber,
+      vehicleType: v.vehicleType || prev.vehicleType,
+      vehicleModel: v.vehicleModel || prev.vehicleModel,
+      driverName: v.driverName || prev.driverName,
+      driverMobile: v.driverMobile || prev.driverMobile,
+    }));
   }
-}
 
-function loadVehicle(value: string) {
-  const v = vehicles.find((x) =>
-    x.vehicleNumber?.toLowerCase().includes(value.toLowerCase())
-  );
+  function buildMessage(bookingId: string) {
+    const netPay = Number(form.fare || 0) - Number(form.advance || 0);
 
-  if (v) {
-    setField("vehicleType", v.vehicleType);
-    setField("vehicleModel", v.vehicleModel);
-    setField("vehicleNumber", v.vehicleNumber);
-    setField("driverName", v.driverName);
-    setField("driverMobile", v.driverMobile);
+    return `✅ Booking Confirmed - Vishwakarma Travels
+
+${form.gender} ${form.customerName},
+Namaste, Your Booking is Confirmed.
+
+Booking ID: ${bookingId}
+
+Service: ${form.service}
+Contact No: +91${form.customerPhone}
+
+📍 Pickup: ${form.pickup}
+📍 Drop: ${form.drop}
+📆 Date: ${form.journeyDate}
+⌚ Time: ${form.journeyTime}
+
+🚕 Vehicle Details:
+Vehicle Type: ${form.vehicleType}
+Vehicle Model: ${form.vehicleModel}
+Vehicle No: ${form.vehicleNumber}
+Driver Name: ${form.driverName}
+Driver Mobile: ${form.driverMobile}
+
+💵 Fare Charges:
+Fare: ₹${form.fare}
+Advance Paid: ₹${form.advance || "0"}
+Net Payable Amount: ₹${netPay}
+
+Thank You For Choosing Vishwakarma Travels`;
+  }
+
+  function openBillPdf(bookingId: string) {
+    const netPay = Number(form.fare || 0) - Number(form.advance || 0);
+    const win = window.open("", "_blank");
+    if (!win) return;
+
+    win.document.write(`
+      <html><head><title>${bookingId} Invoice</title>
+      <style>
+        body { font-family: Arial, sans-serif; padding: 30px; color: #0f172a; }
+        .card { border: 1px solid #cbd5e1; border-radius: 16px; padding: 24px; max-width: 760px; margin: auto; }
+        h1 { margin: 0; font-size: 28px; }
+        .muted { color: #475569; }
+        .row { display: flex; justify-content: space-between; margin: 8px 0; }
+        .total { margin-top: 14px; padding-top: 14px; border-top: 1px dashed #94a3b8; font-weight: bold; }
+      </style></head>
+      <body>
+      <div class="card">
+      <h1>Vishwakarma Travels - Premium Invoice</h1>
+      <p class="muted">Booking ID: ${bookingId}</p>
+      <p><strong>Customer:</strong> ${form.gender} ${form.customerName}</p>
+      <p><strong>Contact:</strong> +91${form.customerPhone}</p>
+      <p><strong>Route:</strong> ${form.pickup} → ${form.drop}</p>
+      <p><strong>Date & Time:</strong> ${form.journeyDate} ${form.journeyTime}</p>
+      <p><strong>Vehicle:</strong> ${form.vehicleType} / ${form.vehicleModel} (${form.vehicleNumber})</p>
+      <p><strong>Driver:</strong> ${form.driverName} (${form.driverMobile})</p>
+      <div class="row"><span>Fare</span><span>₹${form.fare}</span></div>
+      <div class="row"><span>Advance</span><span>₹${form.advance || "0"}</span></div>
+      <div class="row total"><span>Net Payable</span><span>₹${netPay}</span></div>
+      </div>
+      <script>window.print()</script>
+      </body></html>
+    `);
+    win.document.close();
   }
-}
 
   if (!isLogin) {
     return (
       <main style={pageStyle}>
         <div style={cardStyle}>
-          <h1>Admin Login</h1>
-
+          <h1 style={{ marginTop: 0 }}>Admin Login</h1>
           <input
             type="password"
             placeholder="Enter Admin Password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             style={inputStyle}
           />
-
-          <button
-            style={buttonStyle}
-            onClick={() => {
-              if (password === "1234") {
-                setIsLogin(true);
-              } else {
-                alert("Wrong password");
-              }
-            }}
-          >
+          <button style={buttonStyle} onClick={() => (password === "1234" ? setIsLogin(true) : alert("Wrong password"))}>
             Login
           </button>
         </div>
       </main>
     );
   }
 
   return (
     <main style={pageStyle}>
       <div style={cardStyle}>
-        <h1>Booking Confirmation</h1>
+        <h1 style={{ marginTop: 0 }}>Premium Admin Booking</h1>
 
         <form
           style={{ display: "grid", gap: "12px" }}
           onSubmit={(e) => {
             e.preventDefault();
+            const bookingId = `VT-${Date.now()}`;
+            const message = buildMessage(bookingId);
 
-            const form = new FormData(e.currentTarget);
-
-            const customerPhone = form.get("customerPhone");
-            const message = `✅ Booking Confirmation.
-
-${form.get("gender") } ${form.get("customerName")}
-
-Namaste, Your Booking is Confirmed.
-
-Booking ID: VT-${Date.now()}
-
-Service: ${form.get("service")}
-📍 Pickup: ${form.get("pickup")}
-📍 Drop: ${form.get("drop")}
-📆 Date: ${form.get("dateTime")?.toString().split("T")[0]}
-⌚ Time: ${new Date(form.get("dateTime")).toLocaleTimeString("en-IN", {
-  hour: "numeric",
-  minute: "2-digit",
-  hour12: true,
-})}
-
-🚕 Vehicle Details:
-Vehicle Type: ${form.get("vehicleType")}
-Vehicle Model: ${form.get("vehicleModel")}
-Vehicle No: ${form.get("vehicleNumber")}
-Driver Name: ${form.get("driverName")}
-Driver Mobile: ${form.get("driverMobile")}
-
-💵 Fare Charges:
-Fare: ₹${form.get("fare")}
-Advance Paid: ₹${form.get("advance")}
-Net Payable Amount: ₹${Number(form.get("fare")) - Number(form.get("advance") || 0)}
-
-Thank You For Choosing Vishwakarma Travels 
-Wish You A Very Happy Journey
-
-For Queries Please Call or Whatsapp 
-+91 7667989203`;
-
-            window.open(
-              `https://wa.me/91${customerPhone}?text=${encodeURIComponent(
-                message
-              )}`,
-              "_blank"
-            );
+            window.open(`https://wa.me/91${form.customerPhone}?text=${encodeURIComponent(message)}`, "_blank");
+            alert("Booking saved and WhatsApp opened");
           }}
         >
           <input
-  name="customerName"
-  placeholder="Customer Name"
-  style={inputStyle}
-  list="customerList"
-  onChange={(e) => loadCustomer(e.currentTarget.value)}
-  required
-/>
-
-<datalist id="customerList">
-  {customers.map((c, i) => (
-    <option key={i} value={c.name} />
-  ))}
-</datalist>
-          <input name="customerPhone" placeholder="Customer WhatsApp Number" style={inputStyle} required />
-<select name="gender" style={inputStyle} required>
-  <option value="">Select Gender</option>
-  <option value="Mr.">Male</option>
-  <option value="Ms.">Female</option>
-</select>
-          <select name="service" style={inputStyle} required>
+            name="customerName"
+            placeholder="Customer Name"
+            style={inputStyle}
+            list="customerList"
+            value={form.customerName}
+            onChange={(e) => fillCustomer(e.currentTarget.value)}
+            required
+          />
+          <datalist id="customerList">
+            {customers.map((c, i) => (
+              <option key={i} value={c.name} />
+            ))}
+          </datalist>
+
+          <input
+            name="customerPhone"
+            placeholder="Customer WhatsApp Number"
+            style={inputStyle}
+            value={form.customerPhone}
+            onChange={(e) => updateForm("customerPhone", e.currentTarget.value.replace(/\D/g, ""))}
+            required
+          />
+
+          <select name="gender" style={inputStyle} value={form.gender} onChange={(e) => updateForm("gender", e.currentTarget.value)} required>
+            <option value="">Select Gender</option>
+            <option value="Mr.">Male</option>
+            <option value="Ms.">Female</option>
+          </select>
+
+          <select name="service" style={inputStyle} value={form.service} onChange={(e) => updateForm("service", e.currentTarget.value)} required>
             <option value="">Select Service</option>
             <option>Airport Drop & Pickup</option>
             <option>Local Cab Service</option>
             <option>Outstation Booking</option>
             <option>Short Order Cab Service</option>
             <option>Marriage Function Booking</option>
             <option>Tour Package Service</option>
           </select>
 
-          <input name="pickup" placeholder="Pickup Location" style={inputStyle} required />
-          <input name="drop" placeholder="Drop Location" style={inputStyle} required />
-          <input type="datetime-local" name="dateTime" style={inputStyle} required />
-
-          <select name="vehicleType" style={inputStyle} required>
-  <option value="">Select Vehicle Type</option>
-  <option>Sedan</option>
-  <option>SUV</option>
-  <option>BUS</option>
-</select>
-
-<select name="vehicleModel" style={inputStyle} required>
-  <option value="">Select Vehicle Model</option>
-  <option>Dzire</option>
-  <option>Ertiga</option>
-  <option>Innova</option>
-  <option>Crysta</option>
-</select>
-
-<input
-  name="vehicleNumber"
-  placeholder="Vehicle Number"
-  style={inputStyle}
-  list="vehicleList"
-onChange={(e) => loadVehicle(e.currentTarget.value)}
-  onInput={(e) => {
-    e.currentTarget.value =
-      e.currentTarget.value.toUpperCase();
-  }}
-  required
-/>
-         <datalist id="vehicleList">
-  {vehicles.map((v, i) => (
-    <option key={i} value={v.vehicleNumber} />
-  ))}
-</datalist>
-          <input name="fare" placeholder="Total Fare" style={inputStyle} required />
-          <input name="advance" placeholder="Advance Paid" style={inputStyle} />
-
-          <input name="driverName" placeholder="Driver Name" style={inputStyle} />
-          <input name="driverMobile" placeholder="Driver Mobile" style={inputStyle} />
-
-          <button type="submit" style={buttonStyle}>
-            Send Confirmation On WhatsApp
-          </button>
+          <input name="pickup" placeholder="Pickup Location" style={inputStyle} list="pickupList" value={form.pickup} onChange={(e) => updateForm("pickup", e.currentTarget.value)} required />
+          <datalist id="pickupList">
+            {filteredPickupSuggestions.map((item) => (
+              <option key={item} value={item} />
+            ))}
+          </datalist>
+
+          <input name="drop" placeholder="Drop Location" style={inputStyle} list="dropList" value={form.drop} onChange={(e) => updateForm("drop", e.currentTarget.value)} required />
+          <datalist id="dropList">
+            {filteredDropSuggestions.map((item) => (
+              <option key={item} value={item} />
+            ))}
+          </datalist>
+
+          <input type="date" name="journeyDate" style={inputStyle} value={form.journeyDate} onChange={(e) => updateForm("journeyDate", e.currentTarget.value)} required />
+          <input type="time" name="journeyTime" style={inputStyle} value={form.journeyTime} onChange={(e) => updateForm("journeyTime", e.currentTarget.value)} required />
+
+          <input name="vehicleNumber" placeholder="Vehicle Number" style={inputStyle} list="vehicleList" value={form.vehicleNumber} onChange={(e) => fillVehicle(e.currentTarget.value)} required />
+          <datalist id="vehicleList">
+            {vehicles.map((v, i) => (
+              <option key={i} value={v.vehicleNumber} />
+            ))}
+          </datalist>
+
+          <input name="vehicleType" placeholder="Vehicle Type" style={inputStyle} value={form.vehicleType} onChange={(e) => updateForm("vehicleType", e.currentTarget.value)} required />
+          <input name="vehicleModel" placeholder="Vehicle Model" style={inputStyle} value={form.vehicleModel} onChange={(e) => updateForm("vehicleModel", e.currentTarget.value)} required />
+
+          <input name="fare" placeholder="Total Fare" style={inputStyle} value={form.fare} onChange={(e) => updateForm("fare", e.currentTarget.value.replace(/\D/g, ""))} required />
+          <input name="advance" placeholder="Advance Paid" style={inputStyle} value={form.advance} onChange={(e) => updateForm("advance", e.currentTarget.value.replace(/\D/g, ""))} />
+
+          <input name="driverName" placeholder="Driver Name" style={inputStyle} value={form.driverName} onChange={(e) => updateForm("driverName", e.currentTarget.value)} />
+          <input name="driverMobile" placeholder="Driver Mobile" style={inputStyle} value={form.driverMobile} onChange={(e) => updateForm("driverMobile", e.currentTarget.value.replace(/\D/g, ""))} />
+
+          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
+            <button type="submit" style={buttonStyle}>Send Confirmation On WhatsApp</button>
+            <button type="button" style={secondaryButtonStyle} onClick={() => openBillPdf(`VT-${Date.now()}`)}>Bill PDF</button>
+          </div>
         </form>
       </div>
     </main>
   );
 }
 
 const pageStyle = {
   minHeight: "100vh",
-  background: "#f3f7ff",
+  background: "linear-gradient(180deg, #e0ecff 0%, #f8fbff 100%)",
   fontFamily: "Arial",
   padding: "25px",
 };
 
 const cardStyle = {
-  maxWidth: "650px",
+  maxWidth: "740px",
   margin: "auto",
   background: "white",
   padding: "25px",
-  borderRadius: "16px",
-  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
+  borderRadius: "18px",
+  border: "1px solid #dbeafe",
+  boxShadow: "0 18px 35px rgba(15,23,42,0.12)",
 };
 
 const inputStyle = {
   padding: "14px",
   borderRadius: "10px",
   border: "1px solid #cbd5e1",
   fontSize: "16px",
 };
 
 const buttonStyle = {
-  background: "#2563eb",
+  background: "linear-gradient(90deg,#1d4ed8,#2563eb)",
+  color: "white",
+  padding: "14px 16px",
+  border: "none",
+  borderRadius: "10px",
+  fontSize: "16px",
+  fontWeight: "bold",
+};
+
+const secondaryButtonStyle = {
+  background: "#0f172a",
   color: "white",
-  padding: "15px",
+  padding: "14px 16px",
   border: "none",
   borderRadius: "10px",
-  fontSize: "18px",
+  fontSize: "16px",
   fontWeight: "bold",
 };
  
