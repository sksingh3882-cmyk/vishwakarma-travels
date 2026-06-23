"use client";

import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import AdminIncomingBookingRequests from "@/components/booking-request/AdminIncomingBookingRequests";
import { confirmBookingRequestAfterDownload, fetchBookingRequestById, type BookingRequestRecord } from "@/lib/bookingRequestService";
import AdminBookingRequestsReport from "@/components/booking-request/AdminBookingRequestsReport";
import AdminPushSetup from "@/components/admin/AdminPushSetup";
import AdminNotificationWatcher from "@/components/admin/AdminNotificationWatcher";

type Booking = Record<string, any>;
type Customer = Record<string, any>;
type Vehicle = Record<string, any>;

type FormDataState = {
  customerName: string; customerPhone: string; gender: string; service: string;
  pickup: string; drop: string; journeyDate: string; journeyTime: string;
  vehicleType: string; vehicleModel: string; vehicleNumber: string;
  fare: string; advance: string; driverName: string; driverMobile: string;
};

const initialForm: FormDataState = {
  customerName: "", customerPhone: "", gender: "👋 Hii", service: "One Way Drop Pickup",
  pickup: "", drop: "", journeyDate: "", journeyTime: "",
  vehicleType: "Sedan", vehicleModel: "Desire", vehicleNumber: "",
  fare: "", advance: "0", driverName: "", driverMobile: "",
};

function cleanPhone(v: string) {
  let p = String(v || "").replace(/\D/g, "");
  if (p.startsWith("91") && p.length > 10) p = p.slice(-10);
  if (p.startsWith("0") && p.length > 10) p = p.slice(-10);
  return p.slice(-10);
}
function vehicleNo(v: string) { return String(v || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase(); }
function vehicleTypeFromModel(model: any, fallback: any = "") {
  const m = String(model || "").toLowerCase();

  if (
    m.includes("ertiga") ||
    m.includes("innova") ||
    m.includes("crysta")
  ) {
    return "SUV";
  }

  if (
    m.includes("traveller") ||
    m.includes("force") ||
    m.includes("bus")
  ) {
    return "Mini Passenger Bus";
  }

  if (m.includes("desire") || m.includes("dzire") || m.includes("sedan")) {
    return "Sedan";
  }

  return String(fallback || "Sedan");
}
function formatDate(v: string) { return v && v.includes("-") ? v.split("-").reverse().join("-") : v || ""; }
function safe(v: string | number) { return String(v || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<FormDataState>(initialForm);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeView, setActiveView] = useState<"customers" | "vehicles" | "bookings" | "">("");
  const [searchBooking, setSearchBooking] = useState("");
    const [showRecentBookings, setShowRecentBookings] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastBookingId, setLastBookingId] = useState("");
  const [pendingBookingId, setPendingBookingId] = useState("");
  const [confirmMode, setConfirmMode] = useState<"save" | "whatsapp">("save");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showCustomerSendPopup, setShowCustomerSendPopup] = useState(false);
const [customerSendLoading, setCustomerSendLoading] = useState(false);
  const [showDriverSendPopup, setShowDriverSendPopup] = useState(false);
const [driverSendLoading, setDriverSendLoading] = useState(false);
  const [deletingBookingId, setDeletingBookingId] = useState("");
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [showVehicleSuggestions, setShowVehicleSuggestions] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(false);
  const [activeBookingRequest, setActiveBookingRequest] = useState<BookingRequestRecord | null>(null); const [driverAssignmentPopup, setDriverAssignmentPopup] = useState<BookingRequestRecord | null>(null);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";
  const headers = useMemo(() => ({ apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, "Content-Type": "application/json", Prefer: "return=representation" }), [supabaseKey]);
  const fare = Number(form.fare || 0);
  const advance = Number(form.advance || 0);
  const net = fare - advance;

  useEffect(() => { if (localStorage.getItem("vt_admin_login") === "yes") setIsLogin(true); }, []);
  useEffect(() => {
  function applyAssignedVehicleFromStorage() {
    const raw = window.localStorage.getItem("vt-driver-assignment-autofill");

    if (!raw) return;

    try {
      const data = JSON.parse(raw) as {
        vehicleNumber?: string;
        driverName?: string;
        driverMobile?: string;
        vehicleType?: string;
        vehicleModel?: string;
      };

      setForm((previous) => ({
        ...previous,
        vehicleNumber: vehicleNo(data.vehicleNumber || previous.vehicleNumber),
        driverName: data.driverName || previous.driverName,
        driverMobile: cleanPhone(data.driverMobile || previous.driverMobile),
        vehicleType: data.vehicleType || previous.vehicleType,
        vehicleModel: data.vehicleModel || previous.vehicleModel,
      }));

      window.localStorage.removeItem("vt-driver-assignment-autofill");
    } catch {
      window.localStorage.removeItem("vt-driver-assignment-autofill");
    }
  }

  applyAssignedVehicleFromStorage();

  window.addEventListener("focus", applyAssignedVehicleFromStorage);

  return () => {
    window.removeEventListener("focus", applyAssignedVehicleFromStorage);
  };
}, []);
  useEffect(() => { if (!isLogin || !supabaseUrl || !supabaseKey || !activeBookingRequest?.id) return; let stopped = false; async function checkAcceptedBookingDriverDetails() { try { const record = await fetchBookingRequestById({ supabaseUrl, supabaseKey, requestId: activeBookingRequest.id }); if (stopped || !record) return; const hasDriverDetails = Boolean(record.driverName) || Boolean(record.driverMobile) || Boolean(record.vehicleNo); if (!hasDriverDetails) return; const dismissedKey = `vt-driver-assignment-confirm-dismissed-${record.id}`; if (window.localStorage.getItem(dismissedKey) === "yes") return; setDriverAssignmentPopup(record); } catch (error) { console.log("Driver assignment confirmation popup check failed:", error); } } checkAcceptedBookingDriverDetails(); return () => { stopped = true; }; }, [isLogin, supabaseUrl, supabaseKey, activeBookingRequest]);
  useEffect(() => {
    async function load() {
      if (!isLogin || !supabaseUrl || !supabaseKey) return;
      const [c, v, b] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/customers?select=*`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/vehicles?select=*`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc&limit=50`, { headers }),
      ]);
      if (c.ok) setCustomers(await c.json());
      if (v.ok) setVehicles(await v.json());
      if (b.ok) setBookings(await b.json());
    }
    load().catch(console.log);
  }, [isLogin, supabaseUrl, supabaseKey, headers]);

  function update<K extends keyof FormDataState>(key: K, value: FormDataState[K]) { setForm((p) => ({ ...p, [key]: value })); }
  function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password === adminPassword) { localStorage.setItem("vt_admin_login", "yes"); setIsLogin(true); } else alert("Wrong admin password");
  }
    function logout() { localStorage.removeItem("vt_admin_login"); setIsLogin(false); }
  function openRatingPerformance() { window.location.href = "/rating-performance"; }

  function applyCustomer(c: Customer) {
    setForm((p) => ({ ...p, customerName: c.name || p.customerName, customerPhone: cleanPhone(c.mobile || c.phone || p.customerPhone), pickup: c.address || p.pickup }));
    setShowCustomerSuggestions(false);
  }
  function findCustomer() {
    const name = form.customerName.toLowerCase().trim();
    const phone = cleanPhone(form.customerPhone);
    const found = customers.find((c) => (name && (c.name || "").toLowerCase().trim() === name) || (phone && cleanPhone(c.mobile || c.phone || "") === phone));
    if (found) applyCustomer(found);
  }
  function applyVehicle(v: Vehicle) {
    setForm((p) => ({
      ...p,
    vehicleNumber: vehicleNo(v.vehicle_number || v.vehicleNumber || p.vehicleNumber),
      vehicleType: v.vehicle_type || v.vehicleType || p.vehicleType,
      vehicleModel: v.vehicle_model || v.vehicleModel || p.vehicleModel,
      driverName: v.driver_name || v.driverName || p.driverName,
      driverMobile: cleanPhone(v.phone || v.driver_mobile || v.driverMobile || p.driverMobile),
    }));
    setShowVehicleSuggestions(false);
  }
  function fillVehicle(value: string) {
    const no = vehicleNo(value);
    update("vehicleNumber", no);
    setShowVehicleSuggestions(true);
    const found = vehicles.find((v) => vehicleNo(v.vehicle_number || v.vehicleNumber || "") === no);
    if (no.length > 3 && found) applyVehicle(found);
  }
  function useAssignedDriverVehicleOnConfirmation(record: BookingRequestRecord) { setForm((previous) => ({ ...previous, vehicleNumber: vehicleNo(record.vehicleNo || previous.vehicleNumber), driverName: record.driverName || previous.driverName, driverMobile: cleanPhone(record.driverMobile || previous.driverMobile), vehicleType: previous.vehicleType || vehicleTypeFromModel(record.vehicleModel || record.requestedVehicle || "", previous.vehicleType), vehicleModel: previous.vehicleModel || record.vehicleModel || record.requestedVehicle || "" })); if (record.id) { window.localStorage.setItem(`vt-driver-assignment-confirm-dismissed-${record.id}`, "yes"); } setDriverAssignmentPopup(null); }
  function acceptIncomingBookingRequest(request: BookingRequestRecord) {
  setActiveBookingRequest(request);

  setForm((p) => ({
    ...p,
    customerName: request.customerName || p.customerName,
    customerPhone: cleanPhone(request.customerPhone || p.customerPhone),
    service: request.service || p.service,
    pickup: request.pickup || p.pickup,
    drop: request.drop || p.drop,
    journeyDate: request.journeyDate || p.journeyDate,
    journeyTime: request.journeyTime || p.journeyTime,
    vehicleModel: request.requestedVehicle || p.vehicleModel,
vehicleType: vehicleTypeFromModel(request.requestedVehicle || p.vehicleModel, p.vehicleType),
  }));

  window.scrollTo({ top: 0, behavior: "smooth" });
  }
    
    function formatTime(t:any){
  if(t === undefined || t === null) return "";

  const raw = String(t).trim();
  if(!raw) return "";

  // Agar already AM/PM hai, duplicate AM/PM clean karo
  const cleaned = raw
    .replace(/\s+/g, " ")
    .replace(/\b(am|pm)\s+\1\b/ig, "$1")
    .toUpperCase();

  if(/\b(AM|PM)\b/.test(cleaned)){
    return cleaned;
  }

  const [h, m = "00"] = cleaned.split(":");
  const hour = Number(h);

  if(Number.isNaN(hour)) return cleaned;

  return `${hour % 12 || 12}:${String(m).slice(0,2).padStart(2,"0")} ${hour >= 12 ? "PM" : "AM"}`;
    }
   
    function msg(id: string) {
      const serviceText = form.service || "Service Not Selected";
      
  return `🚨 *BOOKING CONFIRMATION MESSAGE* 

${form.gender} *${form.customerName}*
Namaste! Here are your upcoming trip details.

✏️ *Booking ID:* ${id}
⚠️ *Service:* ${serviceText}
📞 *Contact No:* +91 ${cleanPhone(form.customerPhone)}

📍 *Pickup:* ${form.pickup}
📍 *Drop:* ${form.drop}

📆 *Journey Date:* ${formatDate(form.journeyDate)}
⌚ *Reporting Time:* ${formatTime(form.journeyTime)}

🚖 *Vehicle Details*
🔹 Type: ${form.vehicleType}
🔹 Model: ${form.vehicleModel}
🔹 Vehicle No: ${vehicleNo(form.vehicleNumber)}

👨‍✈️ *Driver Details*
🛂 Driver Name: ${form.driverName}
📲 Driver Mobile: +91 ${cleanPhone(form.driverMobile)}

💵 *Payment Details*
🔹 Total Fare: Rs ${fare}
🔹 Advance Paid: Rs ${advance}
🔹 Net Payable: Rs ${net}

⚠️ *Declaration*
🔹 Please Check all the Details before Start Travling. 
🔹 Final Fare May Vary Depending on Final Km.
🔹 Toll Charges,Night Hold and Extra Running.

✨ *Thank You For Choosing Vishwakarma Travels* 
       😊 *Wish You A Very Happy Journey* 
                    🙏🙏🙏`;
    }
  function driverReportingTime() {
  const d = formatDate(form.journeyDate);
  const t = formatTime(form.journeyTime);
  return `${d} ${t}`.trim() || "-";
}

function driverDutyMessage() {
  return `🚨 *UPCOMING DUTY ASSIGNMENT* 🚨
Hello *${form.driverName || "Driver"}*,
This is your upcoming duty message from *Vishwakarma Travels*.

👤 *Client Name:* ${form.customerName || "-"}
📞 *Client Mobile:* ${cleanPhone(form.customerPhone) || "-"}
📍 *Pickup Location:* ${form.pickup || "-"}
📍 *Drop Location:* ${form.drop || "-"}
📅 *Journey Date:* ${formatDate(form.journeyDate) || "-"}
🕒 *Reporting Time:* ${formatTime(form.journeyTime) || "-"}

🚖 *Vehicle Details*
🔹 Vehicle No: ${vehicleNo(form.vehicleNumber) || "-"}
🔹 Model: ${form.vehicleModel || "-"}
🔹 Type: ${form.vehicleType || "-"}

👨‍✈️ *Driver Details*
🛂 Driver Name: ${form.driverName || "-"}
📲 Mobile No: ${cleanPhone(form.driverMobile) || "-"}

⚠️ *Important Instructions*
✅ Please report on time
✅ Vehicle must be neat and clean
🔇 Do not play loud music
📵 Do not use mobile phone while driving
🚨 Drive safely and avoid overspeeding
😊 Maintain good customer behaviour

✨ Thank you for your support ✨
*Vishwakarma Travels*`;
}

function downloadDriverDutyCopyFromForm() {
  const c = document.createElement("canvas");
  c.width = 1080;
  c.height = 1920;
  const x = c.getContext("2d");
  if (!x) return;

  const rr = (a: number, b: number, w: number, h: number, r: number, stroke = false) => {
    x.beginPath();
    x.roundRect(a, b, w, h, r);
    if (stroke) x.stroke();
    else x.fill();
  };

  const wrap = (t: string, xx: number, y: number, w: number, lh: number) => {
    let line = "";
    for (const word of String(t || "-").split(" ")) {
      const test = line + word + " ";
      if (x.measureText(test).width > w && line) {
        x.fillText(line.trim(), xx, y);
        line = word + " ";
        y += lh;
      } else {
        line = test;
      }
    }
    x.fillText(line.trim(), xx, y);
    return y;
  };

  const row = (label: string, value: string, y: number) => {
    x.fillStyle = "#0b2d6b";
    x.font = "bold 34px 'Times New Roman', Times, serif";
    x.fillText(label, 75, y);
    x.fillText(":", 310, y);
    x.fillStyle = "#111827";
    x.font = "34px 'Times New Roman', Times, serif";
    const ly = wrap(value || "-", 370, y, 625, 40);
    return Math.max(y + 56, ly + 34);
  };

  const drawDetails = () => {
    x.fillStyle = "#0b2d6b";
    x.font = "bold 30px 'Times New Roman', Times, serif";
    x.textAlign = "center";
    x.fillText("Driver Duty Assignment", 540, 635);

    x.strokeStyle = "#111111";
    x.lineWidth = 2;
    rr(75, 665, 930, 78, 10, true);

    const helloText = `🚨 Hello ${form.driverName || "Driver"}, this is your Upcoming Duty.`;
    x.fillStyle = "#000000";
    x.font = "bold 38px 'Times New Roman', Times, serif";
    x.textAlign = "center";
    x.fillText(helloText, 540, 716, 850);
    x.textAlign = "left";

    let y = 792;
    y = row("Client Name", form.customerName || "-", y);
    y = row("Client Mobile", cleanPhone(form.customerPhone) || "-", y);
    y = row("Pickup Location", form.pickup || "-", y);
    y = row("Drop Location", form.drop || "-", y);
    y = row("Journey Date", formatDate(form.journeyDate) || "-", y);
    y = row("Reporting Time", formatTime(form.journeyTime) || "-", y);
    y = row("Vehicle No.", vehicleNo(form.vehicleNumber) || "-", y + 14);
    y = row("Model", form.vehicleModel || "-", y);
    y = row("Type", form.vehicleType || "-", y);
    y = row("Driver Name", form.driverName || "-", y + 14);
    y = row("Driver Mobile", cleanPhone(form.driverMobile) || "-", y);

    const instructionsY = y + 35;

x.fillStyle = "#ecfdf5";
rr(75, instructionsY, 930, 250, 24);

x.fillStyle = "#087a31";
x.font = "bold 30px 'Times New Roman', Times, serif";
x.fillText("Important Instructions", 105, instructionsY + 48);

x.fillStyle = "#111";
x.font = "25px 'Times New Roman', Times, serif";

let yy = instructionsY + 90;
for (const t of [
  "Please report on time",
  "Vehicle must be neat and clean",
  "Do not play loud music",
  "Do not use mobile phone while driving",
  "Drive safely and avoid overspeeding",
  "Maintain good customer behaviour",
]) {
  x.fillText("•", 112, yy);
  x.fillText(t, 150, yy);
  yy += 32;
}

x.textAlign = "center";
x.fillStyle = "#0b2d6b";
x.font = "bold 22px 'Times New Roman', Times, serif";
x.fillText("✨ Thank you for your support ✨", 540, instructionsY + 318);

// blue footer bar
x.fillStyle = "#0b2d6b";
rr(30, instructionsY + 346, 1020, 46, 10);

// left footer text
x.textAlign = "left";
x.fillStyle = "#ffffff";
x.font = "16px Arial, sans-serif";
x.fillText("🌐 http://vishwakarma-travel-nine.vercel.app", 70, instructionsY + 376);

// right footer text
x.textAlign = "right";
x.fillStyle = "#ffffff";
x.font = "italic 19px 'Times New Roman', Times, serif";
x.fillText("Thank You! Have a Safe Journey", 1020, instructionsY + 376);

x.textAlign = "left";
    const a = document.createElement("a");
    a.href = c.toDataURL("image/jpeg", 0.95);
    a.download = `Driver-Duty-${form.driverName || "Vishwakarma"}-${Date.now()}.jpg`;
    a.click();
  };

  x.fillStyle = "#f4f7fb";
  x.fillRect(0, 0, 1080, 1920);
  x.fillStyle = "#fff";
  rr(18, 18, 1044, 1884, 28);

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    x.drawImage(img, 42, 42, 996, 480);
    drawDetails();
  };
  img.onerror = drawDetails;
  img.src = "/cars/popup_banner.png";
}

function driverTripLink(){const shortTripCode =
  "VT" +
  String(activeBookingRequest.id)
    .replace(/[^0-9]/g, "")
    .slice(-5)
    .padStart(5, "0");

return `${window.location.origin}/t/${shortTripCode}`;
function openDriverWhatsAppFromForm() {
  if (!activeBookingRequest?.id) {
    return alert("Pehle customer booking request accept/select karo.");
  }

  const driverPhone = cleanPhone(form.driverMobile);

  const message = `🚕 *Vishwakarma Travels - Trip Assigned*

Hello *${form.driverName || "Driver"}*,

Your trip has been assigned.

👤 *Customer:* ${form.customerName || "-"}
📍 *Pickup:* ${form.pickup || "-"}
📍 *Drop:* ${form.drop || "-"}
📅 *Date:* ${formatDate(form.journeyDate) || "-"}
🕒 *Time:* ${formatTime(form.journeyTime) || "-"}
🚖 *Vehicle:* ${form.vehicleType || "-"} ${form.vehicleModel || "-"}
🔢 *Vehicle No:* ${vehicleNo(form.vehicleNumber) || "-"}

👇 Tap this link to view trip details:
${driverTripLink()}

Please call the customer from trip details page before starting the trip.

- Vishwakarma Travels`;

  window.location.href = `https://api.whatsapp.com/send?phone=91${driverPhone}&text=${encodeURIComponent(message)}`;
}
  function makeCustomerConfirmationCode(){const source=activeBookingRequest?.confirmationCode||activeBookingRequest?.id||`${Date.now()}`;let hash=0;for(let i=0;i<source.length;i+=1){hash=(hash*31+source.charCodeAt(i))%100000;}return `VT${String(hash).padStart(5,"0")}`;}function customerConfirmationLink(){if(!activeBookingRequest?.id)return "";return `${window.location.origin}/c/${encodeURIComponent(makeCustomerConfirmationCode())}`;}function customerConfirmationLinkMessage(){const link=customerConfirmationLink();return `✅ *Booking Confirmed - Vishwakarma Travels*\n\n${form.gender} *${form.customerName||"Customer"}*\n\nYour booking is confirmed.\n\n📍 *Route:* ${form.pickup||"-"} to ${form.drop||"-"}\n📅 *Date:* ${formatDate(form.journeyDate)||"-"}\n🕒 *Time:* ${formatTime(form.journeyTime)||"-"}\n🚖 *Vehicle:* ${form.vehicleType||"-"} ${form.vehicleModel||"-"}\n🔢 *Vehicle No:* ${vehicleNo(form.vehicleNumber)||"-"}\n👨‍✈️ *Driver:* ${form.driverName||"-"}\n💵 *Fare Charges:* Rs ${fare||0}\n\n👇 Tap this link to view your confirmed booking details:\n${link}\n\n- Vishwakarma Travels`;}async function sendConfirmationLinkToCustomer(){if(!activeBookingRequest?.id){alert("Pehle customer booking request accept/select karo.");return;}const customerPhone=cleanPhone(form.customerPhone);if(customerPhone.length!==10){alert("Customer WhatsApp number invalid hai.");return;}if(!vehicleNo(form.vehicleNumber)){alert("Vehicle number fill/select karo.");return;}if(!form.driverName.trim()||cleanPhone(form.driverMobile).length!==10){alert("Driver name aur driver mobile fill karo.");return;}const confirmationCode=makeCustomerConfirmationCode();const finalBookingId=confirmationCode||activeBookingRequest.id;try{const saved=await saveBooking(finalBookingId);if(!saved){alert("Final booking Supabase me save nahi hua.");return;}await Promise.all([saveCustomer(),saveVehicle()]);await confirmBookingRequestAfterDownload({supabaseUrl,supabaseKey,requestId:activeBookingRequest.id,vehicleNo:vehicleNo(form.vehicleNumber),vehicleType:form.vehicleType,vehicleModel:form.vehicleModel,driverName:form.driverName,driverMobile:form.driverMobile,confirmationCode,fare,advance,netPayable:net});setLastBookingId(finalBookingId);notifyCustomerBookingConfirmed().catch((err)=>console.log("Customer confirmed notification failed:",err));window.location.href=`https://api.whatsapp.com/send?phone=91${customerPhone}&text=${encodeURIComponent(customerConfirmationLinkMessage())}`;}catch(err){console.log("Customer confirmation link send failed:",err);alert("Booking confirmation link send nahi ho paya.");}}
  
  function validate() {
    if (!supabaseUrl || !supabaseKey) return alert("Supabase URL/KEY missing hai."), false;
    if (cleanPhone(form.customerPhone).length !== 10) return alert("Customer WhatsApp number 10 digit ka hona chahiye."), false;
    if (fare <= 0) return alert("Total fare valid enter karo."), false;
    if (advance > fare) return alert("Advance fare se zyada nahi ho sakta."), false;
    return true;
  }
  function validateDownload() {
    if (!form.customerName.trim()) return alert("Customer name fill karo."), false;
    if (cleanPhone(form.customerPhone).length !== 10) return alert("Customer WhatsApp number 10 digit ka hona chahiye."), false;
    if (!form.pickup.trim() || !form.drop.trim()) return alert("Pickup aur drop location fill karo."), false;
    return true;
  }
  function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); if (!validate()) return; setPendingBookingId(`VT-${Date.now()}`); setConfirmMode("save"); setShowConfirmPopup(true); }
  function sendWhatsApp() { if (!validate()) return; setPendingBookingId(lastBookingId || `VT-${Date.now()}`); setConfirmMode("whatsapp"); setShowConfirmPopup(true); }
  async function runSendToCustomer() {
  if (!validate()) return;

  setCustomerSendLoading(true);

  try {
    downloadBookingCopy(false);
    setShowCustomerSendPopup(false);
    await sendConfirmationLinkToCustomer();
  } finally {
    setCustomerSendLoading(false);
  }
  }
  async function runSendToDriver() {
  if (!validateDownload()) return;

  if (!form.driverName.trim()) {
    alert("Driver name fill karo.");
    return;
  }

  if (cleanPhone(form.driverMobile).length !== 10) {
    alert("Driver mobile number 10 digit ka hona chahiye.");
    return;
  }

  setDriverSendLoading(true);

  try {
    await releaseDriverDetailsToCustomer();

    downloadDriverDutyCopyFromForm();
    openDriverWhatsAppFromForm();

    setShowDriverSendPopup(false);
  } finally {
    setDriverSendLoading(false);
  }
  }
  async function saveBooking(id: string) {
    if (bookings.some((b) => b.booking_id === id)) return true;
    const payload = { booking_id: id, customer_name: form.customerName, customer_phone: cleanPhone(form.customerPhone), gender: form.gender, service: form.service, pickup: form.pickup, drop_location: form.drop, journey_date: form.journeyDate, journey_time: form.journeyTime, vehicle_type: form.vehicleType, vehicle_model: form.vehicleModel, vehicle_number: vehicleNo(form.vehicleNumber), fare, advance, net_payable: net, driver_name: form.driverName, driver_mobile: cleanPhone(form.driverMobile) };
    const r = await fetch(`${supabaseUrl}/rest/v1/bookings`, { method: "POST", headers, body: JSON.stringify(payload) });
    if (!r.ok) return false;
    setBookings((p) => [payload, ...p]);
    return true;
  }
  async function saveCustomer() {
    const phone = cleanPhone(form.customerPhone);
    if (!phone || customers.some((c) => cleanPhone(c.mobile || c.phone || "") === phone)) return;
    const payload = { name: form.customerName.trim(), mobile: phone, address: form.pickup.trim() };
    const r = await fetch(`${supabaseUrl}/rest/v1/customers`, { method: "POST", headers, body: JSON.stringify(payload) });
    if (r.ok) setCustomers((p) => [payload, ...p]);
  }
  async function saveVehicle() {
    const no = vehicleNo(form.vehicleNumber);
    if (!no) return alert("Vehicle number is blank, so the vehicle data will not be saved.");
    if (vehicles.some((v) => vehicleNo(v.vehicle_number || v.vehicleNumber || "") === no)) return;

    const payload = {
      vehicle_number: no,
      vehicle_type: form.vehicleType,
      vehicle_model: form.vehicleModel,
      driver_name: form.driverName,
      phone: cleanPhone(form.driverMobile),
      route: `${form.pickup} to ${form.drop}`,
      status: "Active"
    };

    const r = await fetch(`${supabaseUrl}/rest/v1/vehicles`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (r.ok) {
      setVehicles((p) => [payload, ...p]);
    } else {
      const err = await r.text();
      alert("Vehicle data could not be saved: " + err);
      console.log("Vehicle save error:", err);
    }
  }
  function pdf(id: string) {
    const w = window.open("", "_blank"); if (!w) return alert("Popup allow karo.");
    const today = new Date().toLocaleDateString("en-IN");
    const html = `<!doctype html><html><head><meta charset="utf-8" /><title>Invoice ${safe(id)}</title><style>
      @page{size:A4;margin:8mm}*{box-sizing:border-box}body{margin:0;background:#e5e7eb;font-family:Arial,Helvetica,sans-serif;color:#102033}.sheet{width:100%;max-width:210mm;min-height:297mm;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 12px 35px rgba(0,0,0,.16)}.content{padding:10mm 12mm}.top{display:grid;grid-template-columns:1.2fr .8fr;gap:8mm;margin-bottom:7mm}.box{border:1px solid #dbe3ef;border-radius:14px;overflow:hidden;background:#fff}.box h2{margin:0;background:#0b2d6b;color:#fff;font-size:14px;padding:8px 10px}.box .in{padding:10px 12px}.kv{display:grid;grid-template-columns:118px 1fr;gap:7px;border-bottom:1px dashed #d6deea;padding:6px 0;font-size:12.5px}.kv:last-child{border-bottom:0}.kv b{color:#0b2d6b}.route{display:grid;grid-template-columns:1fr 34px 1fr;gap:8px;align-items:center;margin:7mm 0}.routeCard{border-radius:15px;background:#eff6ff;border:1px solid #bfdbfe;padding:13px;min-height:64px}.routeCard small{display:block;color:#64748b;font-weight:800;margin-bottom:5px}.arrow{height:34px;width:34px;border-radius:50%;background:#f97316;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:7mm}.pay{background:linear-gradient(135deg,#0b2d6b,#174ea6);color:#fff;border-radius:16px;padding:13px}.payRow{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.25);font-size:13px}.payRow:last-child{border-bottom:0}.net{margin-top:8px;background:#f97316;border-radius:12px;padding:10px 12px;display:flex;justify-content:space-between;font-size:18px;font-weight:900}.note{margin-top:8mm;border-left:5px solid #f97316;background:#fff7ed;border-radius:10px;padding:10px 12px;font-size:12px;line-height:1.45}.footer{margin-top:8mm;display:flex;justify-content:space-between;align-items:flex-end;font-size:12px;color:#475569}.sign{text-align:right}.sign b{display:block;color:#0b2d6b;margin-top:22px}.printBtn{position:fixed;right:18px;top:18px;background:#16a34a;color:white;border:0;border-radius:12px;padding:12px 18px;font-weight:900;box-shadow:0 8px 20px rgba(0,0,0,.2)}@media print{body{background:#fff}.sheet{box-shadow:none;border-radius:0;width:auto;min-height:auto}.printBtn{display:none}.content{padding:8mm 10mm}}
    </style></head><body><button class="printBtn" onclick="window.print()">Print / Save PDF</button><div class="sheet"><div class="content"><div class="top"><div><h1 style="color:#0b2d6b;margin:0">Vishwakarma Travels</h1><p style="margin:4px 0 0;color:#64748b">Premium Taxi • Airport Drop • Outstation Booking</p></div><div style="text-align:right;font-weight:900;color:#0b2d6b">BOOKING INVOICE</div></div><div class="top"><div class="box"><h2>Customer Details</h2><div class="in"><div class="kv"><b>Name</b><span>${safe(form.gender)} ${safe(form.customerName)}</span></div><div class="kv"><b>Mobile</b><span>+91 ${safe(cleanPhone(form.customerPhone))}</span></div><div class="kv"><b>Service</b><span>${safe(form.service)}</span></div></div></div><div class="box"><h2>Invoice Details</h2><div class="in"><div class="kv"><b>Booking ID</b><span>${safe(id)}</span></div><div class="kv"><b>Invoice Date</b><span>${safe(today)}</span></div><div class="kv"><b>Journey</b><span>${safe(formatDate(form.journeyDate))} ${safe(form.journeyTime)}</span></div></div></div></div><div class="route"><div class="routeCard"><small>PICKUP LOCATION</small><b>${safe(form.pickup)}</b></div><div class="arrow">→</div><div class="routeCard"><small>DROP LOCATION</small><b>${safe(form.drop)}</b></div></div><div class="grid2"><div class="box"><h2>Vehicle & Driver</h2><div class="in"><div class="kv"><b>Vehicle Type</b><span>${safe(form.vehicleType)}</span></div><div class="kv"><b>Vehicle Model</b><span>${safe(form.vehicleModel)}</span></div><div class="kv"><b>Vehicle No.</b><span>${safe(vehicleNo(form.vehicleNumber))}</span></div><div class="kv"><b>Driver Name</b><span>${safe(form.driverName)}</span></div><div class="kv"><b>Driver Mobile</b><span>${safe(form.driverMobile)}</span></div></div></div><div><div class="pay"><div class="payRow"><span>Total Fare</span><b>Rs ${safe(fare)}</b></div><div class="payRow"><span>Advance Paid</span><b>Rs ${safe(advance)}</b></div><div class="net"><span>Net Payable</span><span>Rs ${safe(net)}</span></div></div><div class="note"><b>Note:</b> Please verify all booking details before journey. Toll, parking or extra waiting charges may be additional if applicable.</div></div></div><div class="footer"><div><b>Thank you for choosing Vishwakarma Travels</b><br/>Safe journey wishes from our team.</div><div class="sign"><span>Authorized By</span><b>Vishwakarma Travels</b></div></div></div></div><script>setTimeout(function(){window.print()},500)</script></body></html>`;
    w.document.write(html);
    w.document.close();
  }
function sendRatingLink(b: Booking) { const bookingId = String(b.booking_id || b.id || "").trim(); const customerPhone = cleanPhone(b.customer_phone || b.mobile || b.customer_mobile || b.phone || ""); if (!bookingId) { alert("Booking ID missing hai."); return; } if (customerPhone.length !== 10) { alert("Customer mobile number missing ya invalid hai."); return; } const ratingLink = `${window.location.origin}/rating/${encodeURIComponent(bookingId)}`; const message = `🙏 Thank you for travelling with Vishwakarma Travels.\n\nPlease rate your trip experience:\n\n⭐ Rate your trip here:\n${ratingLink}\n\nYour feedback helps us improve our service.\n\n- Vishwakarma Travels`; window.location.href = `https://api.whatsapp.com/send?phone=91${customerPhone}&text=${encodeURIComponent(message)}`; }
  async function notifyCustomerBookingConfirmed() {
  if (!activeBookingRequest?.id) return;

  const summary = [
    form.service || "Service",
    formatDate(form.journeyDate) || form.journeyDate || "Date",
    `${form.pickup || "Pickup"} to ${form.drop || "Drop"}`,
  ].join(" | ");

  await fetch("/api/push/customer/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bookingRequestId: activeBookingRequest.id,
      customerPhone: cleanPhone(form.customerPhone),
      title: `Booking Confirmed (${summary})`,
      body: "Please Check My Booking Section to see your Booking Status",
      url: `/?bookingRequestId=${encodeURIComponent(activeBookingRequest.id)}`,
      tag: `vt-customer-confirmed-${activeBookingRequest.id}`,
    }),
  });
  }
async function releaseDriverDetailsToCustomer() {
  if (!activeBookingRequest?.id) return;

  try {
    await confirmBookingRequestAfterDownload({
      supabaseUrl,
      supabaseKey,
      requestId: activeBookingRequest.id,
      vehicleNo: vehicleNo(form.vehicleNumber),
      vehicleType: form.vehicleType,
      vehicleModel: form.vehicleModel,
      driverName: form.driverName,
      driverMobile: form.driverMobile,
      fare,
      advance,
      netPayable: net,
    });
      notifyCustomerBookingConfirmed().catch((err) =>
      console.log("Customer confirmed notification failed:", err)
    );
  } catch (err) {
    console.log("Booking request confirm update failed:", err);
  }
}
function downloadBookingCopy(releaseToCustomer = true) {
  if (!validateDownload()) return;

  const c = document.createElement("canvas");
  c.width = 1080;
  c.height = 1920;

  const x = c.getContext("2d");
  if (!x) return;

  const wrap = (t: string, xx: number, y: number, w: number, lh: number) => {
    let line = "";
    for (const word of String(t || "-").split(" ")) {
      const test = line + word + " ";
      if (x.measureText(test).width > w && line) {
        x.fillText(line.trim(), xx, y);
        line = word + " ";
        y += lh;
      } else line = test;
    }
    x.fillText(line.trim(), xx, y);
    return y;
  };

  const rr = (a: number, b: number, w: number, h: number, r: number) => {
    x.beginPath();
    x.roundRect(a, b, w, h, r);
    x.fill();
  };

  const row = (l: string, v: string, y: number) => {
    x.fillStyle = "#111";
    x.font = "bold 30px 'Times New Roman', Times, serif";
    x.fillText(l, 110, y);

    x.font = "30px 'Times New Roman', Times, serif";
    const ly = wrap(v || "-", 480, y, 500, 34);

    x.strokeStyle = "#e5e7eb";
    x.lineWidth = 1;
    x.beginPath();
    x.moveTo(110, y + 18);
    x.lineTo(965, y + 18);
    x.stroke();

    return Math.max(y + 48, ly + 30);
  };

  const drawDetails = () => {
    x.textAlign = "center";
    x.fillStyle = "#0b2d6b";
    x.font = "bold 34px 'Times New Roman', Times, serif";
    x.fillText("Confirm Booking Details", 540, 610);
    x.textAlign = "left";

    x.fillStyle = "#eff6ff";
    rr(95, 640, 890, 100, 14);
    x.strokeStyle = "#0b2d6b";
    x.lineWidth = 3;
    x.strokeRect(95, 640, 890, 100);

    x.fillStyle = "#0b2d6b";
    x.font = "bold 32px 'Times New Roman', Times, serif";
    x.fillText(`👋 Namaste ${form.customerName}`, 135, 685);

    x.font = "28px 'Times New Roman', Times, serif";
    x.fillText("Here is Your Upcoming Trip Details", 190, 720);

    let y = 790;
    y = row("Mobile No.", cleanPhone(form.customerPhone), y);
    y = row("Pickup", form.pickup, y);
    y = row("Drop", form.drop, y);
    y = row("Date", formatDate(form.journeyDate), y);
    y = row("Time", formatTime(form.journeyTime), y);
    y = row("Vehicle No.", vehicleNo(form.vehicleNumber), y);
    y = row("Vehicle Type", form.vehicleType, y);
    y = row("Vehicle Model", form.vehicleModel, y);
    y = row("Driver Name", form.driverName, y);
    y = row("Driver Mobile", cleanPhone(form.driverMobile), y);
    y = row("Fare", `Rs ${fare}`, y);
    y = row("Advance", `Rs ${advance}`, y);

    x.fillStyle = "#ecfdf5";
    rr(95, y + 18, 890, 82, 12);
    x.strokeStyle = "#15803d";
    x.lineWidth = 2;
    x.strokeRect(95, y + 18, 890, 82);

    x.fillStyle = "#15803d";
    x.font = "bold 34px 'Times New Roman', Times, serif";
    x.fillText("Net Payable", 125, y + 70);

    x.textAlign = "right";
    x.fillText(`Rs ${net}`, 955, y + 70);
    x.textAlign = "left";

    x.fillStyle = "#087a31";
    x.font = "bold 32px 'Times New Roman', Times, serif";
    x.fillText("Declaration", 95, y + 150);

    x.strokeStyle = "#087a31";
    x.lineWidth = 5;
    x.beginPath();
    x.moveTo(95, y + 180);
    x.lineTo(985, y + 180);
    x.stroke();

    x.fillStyle = "#111";
    x.font = "24px 'Times New Roman', Times, serif";

    let yy = y + 225;
    for (const t of [
      "Final Fare may vary Depending on Final Km. Waiting Time . Extra Km and Night Hold",
      "After the booking is Confirmed, Customer will have to make the Advance Payment",
      "Rs.500 Cancellation Charge will have to be paid on Cancellation of Booking under any Circumtances",
    ]) {
      x.fillText("*", 100, yy);
      yy = wrap(t, 135, yy, 830, 30) + 30;
    }

    x.fillStyle = "#0b2d6b";
    rr(25, 1840, 1030, 58, 8);

    x.fillStyle = "#fff";
    x.textAlign = "left";
    x.font = "22px Arial";
    x.fillText("🌐 http://vishwakrma-travel-nine.vercel.app", 90, 1877);

    x.textAlign = "right";
    x.font = "italic 28px 'Times New Roman', Times, serif";
    x.fillText("Thank You! Have a Safe Journey", 990, 1878);

    x.textAlign = "left";

    const a = document.createElement("a");
    a.href = c.toDataURL("image/jpeg", 0.95);
    a.download = `Vishwakarma-Booking-${Date.now()}.jpg`;
    a.click();

    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3500);
    if (releaseToCustomer) releaseDriverDetailsToCustomer();
  };

  x.fillStyle = "#f4f7fb";
  x.fillRect(0, 0, 1080, 1920);

  x.fillStyle = "#fff";
  rr(18, 18, 1044, 1884, 28);

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    x.drawImage(img, 42, 42, 996, 480);
    drawDetails();
  };
  img.onerror = drawDetails;
  img.src = "/cars/popup_banner.png";
      }
  async function confirm() {
    const id = pendingBookingId || lastBookingId || `VT-${Date.now()}`;
    setLoading(true);
    try {
      const ok = await saveBooking(id); if (!ok) return alert("Booking save nahi hua.");
      await Promise.all([saveCustomer(), saveVehicle()]);
      setLastBookingId(id);
      if (confirmMode === "save") window.open(`/invoice?bookingId=${encodeURIComponent(id)}&customerName=${encodeURIComponent(form.customerName)}&customerPhone=${encodeURIComponent(cleanPhone(form.customerPhone))}&service=${encodeURIComponent(form.service)}&pickup=${encodeURIComponent(form.pickup)}&drop=${encodeURIComponent(form.drop)}&journeyDate=${encodeURIComponent(formatDate(form.journeyDate))}&journeyTime=${encodeURIComponent(form.journeyTime)}&vehicleType=${encodeURIComponent(form.vehicleType)}&vehicleModel=${encodeURIComponent(form.vehicleModel)}&vehicleNumber=${encodeURIComponent(vehicleNo(form.vehicleNumber))}&driverName=${encodeURIComponent(form.driverName)}&driverMobile=${encodeURIComponent(cleanPhone(form.driverMobile))}&fare=${encodeURIComponent(String(fare))}&advance=${encodeURIComponent(String(advance))}`,"_blank");
      window.location.href = `https://api.whatsapp.com/send?phone=91${cleanPhone(form.customerPhone)}&text=${encodeURIComponent(msg(id))}`;
      setShowConfirmPopup(false);
    } finally { setLoading(false); }
  }
   async function removeBooking(id?: string) { if (!id || !window.confirm("Delete booking?")) return; setDeletingBookingId(id); try { const response = await fetch(`${supabaseUrl}/rest/v1/bookings?booking_id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers }); if (!response.ok) { const errorText = await response.text(); alert("Booking could not be deleted: " + errorText); return; } setBookings((previous) => previous.filter((booking) => booking.booking_id !== id)); } catch (error: any) { alert("Booking delete failed: " + (error?.message || "Unknown error")); } finally { setDeletingBookingId(""); } }
  function edit(b: Booking) {
    setForm({ customerName: b.customer_name || "", customerPhone: b.customer_phone || "", gender: "👋 Hii", service: b.service || "One Way Drop Pickup", pickup: b.pickup || "", drop: b.drop_location || "", journeyDate: b.journey_date || "", journeyTime: b.journey_time || "", vehicleType: b.vehicle_type || "Sedan", vehicleModel: b.vehicle_model || "Desire", vehicleNumber: b.vehicle_number || "", fare: String(b.fare || ""), advance: String(b.advance || "0"), driverName: b.driver_name || "", driverMobile: b.driver_mobile || "" }); setLastBookingId(b.booking_id || ""); window.scrollTo({ top: 0, behavior: "smooth" });
  }
function editCustomer(c: Customer){setForm((p)=>({...p,customerName:c.name||"",customerPhone:cleanPhone(c.mobile||c.phone||""),pickup:c.address||""}));setActiveView("");window.scrollTo({top:0,behavior:"smooth"});}async function deleteCustomer(c: Customer){const phone=cleanPhone(c.mobile||c.phone||"");if(!phone||!window.confirm("Delete customer?"))return;try{const mobileResponse=await fetch(`${supabaseUrl}/rest/v1/customers?mobile=eq.${encodeURIComponent(phone)}`,{method:"DELETE",headers});if(!mobileResponse.ok){const phoneResponse=await fetch(`${supabaseUrl}/rest/v1/customers?phone=eq.${encodeURIComponent(phone)}`,{method:"DELETE",headers});if(!phoneResponse.ok){const errorText=await phoneResponse.text();alert("Customer could not be deleted: "+errorText);return;}}setCustomers((previous)=>previous.filter((customer)=>cleanPhone(customer.mobile||customer.phone||"")!==phone));}catch(error:any){alert("Customer delete failed: "+(error?.message||"Unknown error"));}}
  function editVehicle(v: Vehicle){setForm((p)=>({...p,vehicleNumber:vehicleNo(v.vehicle_number||v.vehicleNumber||""),vehicleType:v.vehicle_type||v.vehicleType||p.vehicleType,vehicleModel:v.vehicle_model||v.vehicleModel||p.vehicleModel,driverName:v.driver_name||v.driverName||p.driverName,driverMobile:cleanPhone(v.phone||v.driver_mobile||v.driverMobile||p.driverMobile)}));setActiveView("");window.scrollTo({top:0,behavior:"smooth"});}async function deleteVehicle(v: Vehicle){const no=vehicleNo(v.vehicle_number||v.vehicleNumber||"");if(!no||!window.confirm(`Delete vehicle ${no}?`))return;try{const response=await fetch(`${supabaseUrl}/rest/v1/vehicles?vehicle_number=eq.${encodeURIComponent(no)}`,{method:"DELETE",headers});if(!response.ok){const errorText=await response.text();alert("Vehicle could not be deleted: "+errorText);return;}setVehicles((previous)=>previous.filter((vehicle)=>vehicleNo(vehicle.vehicle_number||vehicle.vehicleNumber||"")!==no));}catch(error:any){alert("Vehicle delete failed: "+(error?.message||"Unknown error"));}}
  
  const filtered = bookings.filter((b) => `${b.booking_id || ""} ${b.customer_name || ""} ${b.customer_phone || ""} ${b.pickup || ""} ${b.drop_location || ""}`.toLowerCase().includes(searchBooking.toLowerCase()));
  const customerSearch = `${form.customerName} ${form.customerPhone}`.toLowerCase().trim();
  const customerSuggestions = customerSearch.length < 2 ? [] : customers.filter((c) => `${c.name || ""} ${c.mobile || c.phone || ""} ${c.address || ""}`.toLowerCase().includes(customerSearch) || cleanPhone(c.mobile || c.phone || "").includes(cleanPhone(form.customerPhone))).slice(0, 6);
  const vehicleSearch = vehicleNo(form.vehicleNumber);
  const vehicleSuggestions = vehicleSearch.length < 2 ? [] : vehicles.filter(Boolean).filter((v) => `${v?.vehicle_number || v?.vehicleNumber || ""} ${v?.vehicle_type || v?.vehicleType || ""} ${v?.vehicle_model || v?.vehicleModel || ""} ${v?.driver_name || v?.driverName || ""}`.toUpperCase().includes(vehicleSearch)).slice(0, 6);
  const hasExactVehicle = vehicles.filter(Boolean).some((v) => vehicleNo(v?.vehicle_number || v?.vehicleNumber || "") === vehicleSearch);
  const drops = Array.from(new Set(bookings.filter((b) => cleanPhone(b.customer_phone || "") === cleanPhone(form.customerPhone) || (form.customerName && (b.customer_name || "").toLowerCase().includes(form.customerName.toLowerCase()))).map((b) => b.drop_location).filter(Boolean))).slice(0, 6);

  if (!isLogin) return <main style={loginPage}><form onSubmit={login} style={card}><h1>Vishwakarma Travels</h1><p>Admin Login</p><input type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} style={input} /><button style={blueBtn}>Login</button></form></main>;

  return <main style={page}> 
    <AdminIncomingBookingRequests
  isActive={isLogin}
  onAcceptBooking={(request) => acceptIncomingBookingRequest(request)}
/>
    {driverAssignmentPopup && <div style={overlay}><div style={modal}><button onClick={() => { if (driverAssignmentPopup.id) { window.localStorage.setItem(`vt-driver-assignment-confirm-dismissed-${driverAssignmentPopup.id}`, "yes"); } setDriverAssignmentPopup(null); }} style={close}>x</button><img src="/cars/popup_banner.png" style={banner} alt="Vishwakarma Travels" /><div style={body}><h2 style={title}>Driver Vehicle Details Received</h2><Row l="Driver Name" v={driverAssignmentPopup.driverName || "-"} /><Row l="Driver Mobile" v={driverAssignmentPopup.driverMobile || "-"} /><Row l="Vehicle Number" v={vehicleNo(driverAssignmentPopup.vehicleNo || "") || "-"} /><Row l="Vehicle Model" v={driverAssignmentPopup.vehicleModel || driverAssignmentPopup.requestedVehicle || "-"} /><Row l="Vehicle Type" v={vehicleTypeFromModel(driverAssignmentPopup.vehicleModel || driverAssignmentPopup.requestedVehicle || "", form.vehicleType)} /><div style={masterInfoBox}>Only Driver Name, Driver Mobile, and Vehicle Number will be used for this booking confirmation. Vehicle Type and Vehicle Model will not be overwritten.</div></div><div style={actions}><button onClick={() => { if (driverAssignmentPopup.id) { window.localStorage.setItem(`vt-driver-assignment-confirm-dismissed-${driverAssignmentPopup.id}`, "yes"); } setDriverAssignmentPopup(null); }} style={cancelBtn}>Close</button><button onClick={() => useAssignedDriverVehicleOnConfirmation(driverAssignmentPopup)} style={greenBtn}>OK Use This Vehicle</button></div></div></div>}
    {showConfirmPopup && <div style={overlay}><div style={modal}><button onClick={() => setShowConfirmPopup(false)} style={close}>x</button><img src="/cars/popup_banner.png" style={banner} alt="Vishwakarma Travels" /><div style={body}><h2 style={title}>Confirm Booking Details</h2><Row l="Customer Name" v={form.customerName} /><Row l="Mobile No." v={form.customerPhone} /><Row l="Pickup" v={form.pickup} /><Row l="Drop" v={form.drop} /><Row l="Date" v={formatDate(form.journeyDate)} /><Row l="Time" v={form.journeyTime} /><Row l="Vehicle No." v={vehicleNo(form.vehicleNumber)} /><Row l="Vehicle Type" v={form.vehicleType} /><Row l="Vehicle Model" v={form.vehicleModel} /><Row l="Driver Name" v={form.driverName} /><Row l="Driver Mobile" v={form.driverMobile} /><Row l="Fare" v={`Rs ${fare}`} /><Row l="Advance" v={`Rs ${advance}`} /><div style={netRow}><b>Net Payable</b><b>Rs {net}</b></div></div><div style={actions}><button onClick={() => setShowConfirmPopup(false)} style={cancelBtn}>Cancel</button><button disabled={loading} onClick={confirm} style={greenBtn}>{loading ? "Please wait..." : "Confirm & Submit"}</button></div></div></div>}

    {showCustomerSendPopup && (
  <div style={overlay}>
    <div style={modal}>
      <button onClick={() => setShowCustomerSendPopup(false)} style={close}>x</button>
      <img src="/cars/popup_banner.png" style={banner} alt="Vishwakarma Travels" />

      <div style={body}>
        <h2 style={title}>Send Booking to Customer?</h2>

        <Row l="Customer Name" v={form.customerName} />
        <Row l="Mobile No." v={form.customerPhone} />
        <Row l="Pickup" v={form.pickup} />
        <Row l="Drop" v={form.drop} />
        <Row l="Date" v={formatDate(form.journeyDate)} />
        <Row l="Time" v={formatTime(form.journeyTime)} />
        <Row l="Service" v={form.service} />
        <Row l="Vehicle No." v={vehicleNo(form.vehicleNumber)} />
        <Row l="Vehicle Type" v={form.vehicleType} />
        <Row l="Vehicle Model" v={form.vehicleModel} />
        <Row l="Driver Name" v={form.driverName} />
        <Row l="Driver Mobile" v={form.driverMobile} />
        <Row l="Fare" v={`Rs ${fare}`} />
        <Row l="Advance" v={`Rs ${advance}`} />

        <div style={netRow}>
          <b>Net Payable</b>
          <b>Rs {net}</b>
        </div>

        <div style={masterInfoBox}>
          Confirm karne par Customer Booking Copy download hogi, final booking Supabase me save hogi, aur Customer WhatsApp open hoga.
        </div>
      </div>

      <div style={actions}>
        <button onClick={() => setShowCustomerSendPopup(false)} style={cancelBtn}>Cancel</button>
        <button disabled={customerSendLoading} onClick={runSendToCustomer} style={greenBtn}>
          {customerSendLoading ? "Please wait..." : "Confirm Send to Customer"}
        </button>
      </div>
    </div>
  </div>
)}
    {showDriverSendPopup && (
  <div style={overlay}>
    <div style={modal}>
      <button onClick={() => setShowDriverSendPopup(false)} style={close}>x</button>
      <img src="/cars/popup_banner.png" style={banner} alt="Vishwakarma Travels" />

      <div style={body}>
        <h2 style={title}>Send Booking to Driver?</h2>

        <Row l="Customer Name" v={form.customerName} />
        <Row l="Mobile No." v={form.customerPhone} />
        <Row l="Pickup" v={form.pickup} />
        <Row l="Drop" v={form.drop} />
        <Row l="Date" v={formatDate(form.journeyDate)} />
        <Row l="Time" v={formatTime(form.journeyTime)} />
        <Row l="Service" v={form.service} />
        <Row l="Vehicle No." v={vehicleNo(form.vehicleNumber)} />
        <Row l="Vehicle Type" v={form.vehicleType} />
        <Row l="Vehicle Model" v={form.vehicleModel} />
        <Row l="Driver Name" v={form.driverName} />
        <Row l="Driver Mobile" v={form.driverMobile} />

        <div style={masterInfoBox}>
          Confirm karne par customer page me Vehicle Details + Call Driver Now active hoga, Driver Duty Copy download hogi, aur Driver WhatsApp open hoga.
        </div>
      </div>

      <div style={actions}>
        <button onClick={() => setShowDriverSendPopup(false)} style={cancelBtn}>Cancel</button>
        <button disabled={driverSendLoading} onClick={runSendToDriver} style={greenBtn}>
          {driverSendLoading ? "Please wait..." : "Confirm Send to Driver"}
        </button>
      </div>
    </div>
  </div>
)}
        <div style={{ maxWidth: 1200, margin: "0 auto" }}><header style={header}><h1>Vishwakarma Travels Admin Dashboard</h1><p>Booking, Bill, WhatsApp aur Database Management</p><div style={heroActionRow}><button onClick={logout} style={whiteBtn}>Logout</button><button type="button" onClick={openRatingPerformance} style={ratingPerformanceBtn}>⭐ Rating Performance</button></div></header>
    <section style={stats}><Stat title="Customers" value={customers.length} onClick={() => setActiveView("customers")} /><Stat title="Vehicles" value={vehicles.length} onClick={() => setActiveView("vehicles")} /><Stat title="Bookings" value={bookings.length} onClick={() => setActiveView("bookings")} /></section>
      <AdminPushSetup />
          <AdminNotificationWatcher />
    {activeView && <section style={panel}><button onClick={() => setActiveView("")} style={whiteBtn}>Close</button>{activeView === "customers" && customers.filter(Boolean).map((c, i) => <div key={i} style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,alignItems:"center",padding:"10px 0",borderBottom:"1px solid #e5e7eb"}}><p style={{margin:0}}><b>{c?.name || "-"}</b> - {c?.mobile || c?.phone || "-"} - {c?.address || "-"}</p><button onClick={()=>editCustomer(c)} style={editBtn}>Edit</button><button onClick={()=>deleteCustomer(c)} style={delBtn}>Delete</button></div>)}{activeView === "vehicles" && vehicles.filter(Boolean).map((v, i) => <div key={i} style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,alignItems:"center",padding:"10px 0",borderBottom:"1px solid #e5e7eb"}}><p style={{margin:0}}><b>{vehicleNo(v?.vehicle_number || v?.vehicleNumber || "") || "-"}</b> - {v?.vehicle_model || v?.vehicleModel || "-"} - {v?.driver_name || v?.driverName || "-"}</p><button onClick={()=>editVehicle(v)} style={editBtn}>Edit</button><button onClick={()=>deleteVehicle(v)} style={delBtn}>Delete</button></div>)}{activeView === "bookings" && bookings.filter(Boolean).map((b, i) => <p key={i}><b>{b?.booking_id || "-"}</b> - {b?.customer_name || "-"} - Rs {b?.fare || 0}</p>)}</section>}
    <form onSubmit={submit} style={panel}><h2>New Booking</h2><div style={grid}><select value={form.gender} onChange={(e) => update("gender", e.target.value)} style={input}><option>👋 Hii</option><option>Mr.</option><option>Mrs.</option><option>Ms.</option></select><div style={fieldWrap}><input placeholder="Customer Name" value={form.customerName} onFocus={() => setShowCustomerSuggestions(true)} onChange={(e) => { update("customerName", e.target.value); setShowCustomerSuggestions(true); }} onBlur={() => setTimeout(() => { findCustomer(); setShowCustomerSuggestions(false); }, 180)} style={input} required />{showCustomerSuggestions && customerSuggestions.length > 0 && <div style={suggestBox}>{customerSuggestions.map((c, i) => <button key={`${c.mobile || c.phone || i}-${i}`} type="button" onMouseDown={() => applyCustomer(c)} style={suggestItem}><b>{c.name || "No Name"}</b><span>{cleanPhone(c.mobile || c.phone || "") || "No Mobile"}</span><small>{c.address || "No Address"}</small></button>)}</div>}</div><input type="text" inputMode="tel" placeholder="Customer WhatsApp Number" value={form.customerPhone} onChange={(e) => { update("customerPhone", e.target.value); setShowCustomerSuggestions(true); }} onBlur={findCustomer} style={input} required /><input placeholder="Pickup Location / Address" value={form.pickup} onChange={(e) => update("pickup", e.target.value)} style={input} required /><input placeholder="Drop Location" value={form.drop} onChange={(e) => update("drop", e.target.value)} style={input} required />{drops.length > 0 && <div style={fullRow}><b style={{ color: "#0b2d6b" }}>Old Drop Location:</b><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{drops.map((d) => <button key={d} type="button" onClick={() => update("drop", d)} style={chip}>{d}</button>)}</div></div>}<input type="date" value={form.journeyDate} onChange={(e) => update("journeyDate", e.target.value)} style={input} required /><input placeholder="Time e.g. 5:30 PM" value={form.journeyTime} onChange={(e) => update("journeyTime", e.target.value)} style={input} required /><div style={fieldWrap}><input placeholder="Vehicle Number" value={form.vehicleNumber} onFocus={() => setShowVehicleSuggestions(true)} onChange={(e) => fillVehicle(e.target.value)} onBlur={() => setTimeout(() => setShowVehicleSuggestions(false), 180)} style={input} />{showVehicleSuggestions && vehicleSearch.length >= 2 && <div style={suggestBox}>{vehicleSuggestions.map((v, i) => <button key={`${v.vehicle_number || v.vehicleNumber || i}-${i}`} type="button" onMouseDown={() => applyVehicle(v)} style={suggestItem}><b>{vehicleNo(v.vehicle_number || v.vehicleNumber || "")}</b><span>{v.vehicle_type || v.vehicleType || "Vehicle"} • {v.vehicle_model || v.vehicleModel || "Model"}</span><small>{v.driver_name || v.driverName || "Driver not saved"} {cleanPhone(v.phone || v.driver_mobile || v.driverMobile || "") ? `• ${cleanPhone(v.phone || v.driver_mobile || v.driverMobile || "")}` : ""}</small></button>)}{!hasExactVehicle && <div style={newHint}>+ New vehicle "{vehicleSearch}" — type, model, driver details fill karke submit karte hi save ho jayega.</div>}</div>}</div><select value={form.vehicleType} onChange={(e) => update("vehicleType", e.target.value)} style={input}><option>Sedan</option><option>SUV</option><option>SUV With Carrier</option><option>Sedan With Carrier</option><option>Mini Passenger Bus</option></select><select value={form.vehicleModel} onChange={(e) => update("vehicleModel", e.target.value)} style={input}><option>Desire</option><option>Ertiga</option><option>Innova</option><option>Innova Crysta</option><option>Ertiga With Carrier</option><option>Innova With Carrier</option><option>Crysta With Carrier</option><option>Force Traveller</option></select><input placeholder="Driver Name" value={form.driverName} onChange={(e) => update("driverName", e.target.value)} style={input} /><input type="text" inputMode="tel" placeholder="Driver Mobile" value={form.driverMobile} onChange={(e) => update("driverMobile", e.target.value)} style={input} /><select value={form.service} onChange={(e) => update("service", e.target.value)} style={input}><option>One Way Drop Pickup</option><option>Round Trip</option><option>Jamshedpur to Ranchi Airport Drop</option><option>Ranchi Airport to Jamshedpur Drop</option><option>Jamshedpur to Kolkata Airport Drop</option><option>Kolkata Airport to Jamshedpur Drop</option><option>Local Movement</option><option>Outstation Movement</option><option>Short Time Booking</option><option>Marriage Function Booking</option></select><input type="number" placeholder="Total Fare" value={form.fare} onChange={(e) => update("fare", e.target.value)} style={input} required /><input type="number" placeholder="Advance Paid" value={form.advance} onChange={(e) => update("advance", e.target.value)} style={input} /><button type="button" onClick={() => { const assignmentId = activeBookingRequest?.id || lastBookingId || "test-booking-001"; window.open(`/admin/driver-vehicle-assignment/${encodeURIComponent(assignmentId)}`, "_blank"); }} style={{ width: "100%", minHeight: 48, border: "2px solid #0b2d6b", borderRadius: 12, background: "#eff6ff", color: "#0b2d6b", fontWeight: 900, fontSize: 14, cursor: "pointer" }}>🚕 Assignment</button>
<AdminBookingRequestsReport
  onAcceptRequest={(request) => acceptIncomingBookingRequest(request)}
/>
</div>
<div style={masterButtonRow}>
  <button type="button" onClick={() => setShowCustomerSendPopup(true)} style={sendCustomerBtn}>
    Send to Customer
  </button>
  <button type="button" onClick={() => setShowDriverSendPopup(true)} style={sendDriverBtn}>
    Send to Driver
  </button>
</div>
<div style={finalActionRow}><button type="button" onClick={sendConfirmationLinkToCustomer} style={sendConfirmLinkBtn}>Send Booking Confirmation Link</button><button type="submit" disabled={loading} style={finalSavePdfBtn}>{loading ? "Saving..." : "Save + PDF"}</button></div>{downloadNotice && <div style={downloadOk}>✓ Booking copy downloaded successfully!</div>}</form>
      <section style={panel}>
      <div style={recentBookingHeader}>
        <h2 style={{ margin: 0 }}>Recent Bookings</h2>
        <button
          type="button"
          onClick={() => setShowRecentBookings((value) => !value)}
          style={hideRecentBtn}
        >
          {showRecentBookings ? "Hide" : "Show"}
        </button>
      </div>

      {showRecentBookings && (
        <>
          <input
            placeholder="Search booking by name, phone, pickup..."
            value={searchBooking}
            onChange={(e) => setSearchBooking(e.target.value)}
            style={input}
          />

          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0b2d6b", color: "white" }}>
                  <th style={th}>Booking ID</th>
                  <th style={th}>Customer</th>
                  <th style={th}>Phone</th>
                  <th style={th}>Route</th>
                  <th style={th}>Date</th>
                  <th style={th}>Fare</th>
                  <th style={th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b.booking_id || i}>
                    <td style={td}>{b.booking_id || "-"}</td>
                    <td style={td}>{b.customer_name || "-"}</td>
                    <td style={td}>{b.customer_phone || "-"}</td>
                    <td style={td}>{b.pickup || "-"} to {b.drop_location || "-"}</td>
                    <td style={td}>{b.journey_date || "-"}</td>
                    <td style={td}>Rs {b.fare || 0}</td>
                    <td style={td}>
                      <button onClick={() => edit(b)} style={editBtn}>Edit</button>
                      <button onClick={() => pdf(b.booking_id || "")} style={pdfBtn}>PDF</button>
                      <button onClick={() => sendRatingLink(b)} style={ratingBtn}>Rating</button>
                      <button
                        disabled={deletingBookingId === b.booking_id}
                        onClick={() => removeBooking(b.booking_id)}
                        style={delBtn}
                      >
                        {deletingBookingId === b.booking_id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}

                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: 20, textAlign: "center" }}>
                      No booking found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  </div>
  </main>;
}

function Row({ l, v }: { l: string; v: string }) { return <div style={detailRow}><b>{l}</b><span>{v || "-"}</span></div>; }
function Stat({ title, value, onClick }: { title: string; value: number; onClick: () => void }) { return <div onClick={onClick} style={stat}><p>{title}</p><h2>{value}</h2><b>View all</b></div>; }

const page: CSSProperties = { minHeight: "100vh", background: "#f1f5f9", padding: 16 };
const loginPage: CSSProperties = { minHeight: "100vh", background: "#f1f5f9", padding: 20, display: "flex", alignItems: "center", justifyContent: "center" };
const card: CSSProperties = { width: "100%", maxWidth: 380, background: "white", padding: 24, borderRadius: 18, boxShadow: "0 8px 25px rgba(0,0,0,.12)" };
const header: CSSProperties = { background: "#0b2d6b", color: "white", padding: 20, borderRadius: 18, marginBottom: 16 };
const heroActionRow: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginTop: 14 };
const ratingPerformanceBtn: CSSProperties = { padding: "10px 14px", borderRadius: 12, border: 0, background: "#f59e0b", color: "white", fontWeight: "bold" };
const stats: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 16 };
const stat: CSSProperties = { background: "white", padding: 16, borderRadius: 16, cursor: "pointer" };
const panel: CSSProperties = { background: "white", padding: 18, borderRadius: 18, marginBottom: 16 };
const recentBookingHeader: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 };
const hideRecentBtn: CSSProperties = { border: 0, borderRadius: 999, background: "#0b2d6b", color: "white", padding: "9px 16px", fontWeight: 900, fontSize: 14 };
const grid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 };
const fieldWrap: CSSProperties = { position: "relative" };
const fullRow: CSSProperties = { gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" };
const suggestBox: CSSProperties = { position: "absolute", left: 0, right: 0, top: "calc(100% + 4px)", zIndex: 50, background: "white", border: "1px solid #cbd5e1", borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,.14)", overflow: "hidden" };
const suggestItem: CSSProperties = { width: "100%", display: "grid", gridTemplateColumns: "1fr", gap: 2, padding: "10px 12px", textAlign: "left", background: "white", border: 0, borderBottom: "1px solid #e2e8f0", cursor: "pointer" };
const newHint: CSSProperties = { padding: "10px 12px", color: "#0b2d6b", fontWeight: 800, background: "#eff6ff", borderTop: "1px solid #dbeafe" };
const input: CSSProperties = { padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", width: "100%", boxSizing: "border-box" };
const blueBtn: CSSProperties = { width: "100%", padding: 13, borderRadius: 12, border: 0, background: "#0b2d6b", color: "white", fontWeight: "bold", marginTop: 15 };
const whiteBtn: CSSProperties = { padding: "10px 16px", borderRadius: 10, border: 0, fontWeight: "bold" };
const chip: CSSProperties = { padding: "8px 10px", borderRadius: 10, border: "1px solid #0b2d6b", background: "white", color: "#0b2d6b", fontWeight: "bold" };
const buttonRow: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 };
const masterButtonRow: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 };
const masterBaseBtn: CSSProperties = { minWidth: 0, padding: "13px 8px", color: "white", border: 0, borderRadius: 14, fontWeight: 950, fontSize: 14, lineHeight: 1.15 };
const sendCustomerBtn: CSSProperties = { ...masterBaseBtn, background: "#16a34a" };
const sendDriverBtn: CSSProperties = { ...masterBaseBtn, background: "#0b2d6b" };
const finalActionRow: CSSProperties = { display: "grid", gridTemplateColumns: "1.35fr .65fr", gap: 10, marginTop: 14 }; const sendConfirmLinkBtn: CSSProperties = { minWidth: 0, padding: "13px 8px", borderRadius: 14, border: 0, background: "#7c3aed", color: "white", fontWeight: 950, fontSize: 13, lineHeight: 1.15 }; const finalSavePdfBtn: CSSProperties = { minWidth: 0, padding: "13px 8px", borderRadius: 14, border: 0, background: "#15803d", color: "white", fontWeight: 950, fontSize: 14, lineHeight: 1.15 };
const smallBaseBtn: CSSProperties = { minWidth: 0, padding: "11px 6px", color: "white", border: 0, borderRadius: 12, fontWeight: 900, fontSize: 13, lineHeight: 1.1 };
const smallDownloadBtn: CSSProperties = { ...smallBaseBtn, background: "#f97316" };
const smallSaveBtn: CSSProperties = { ...smallBaseBtn, background: "#15803d" };
const smallWaBtn: CSSProperties = { ...smallBaseBtn, background: "#25D366" };
const masterInfoBox: CSSProperties = { marginTop: 10, padding: "10px 12px", borderRadius: 12, background: "#eff6ff", color: "#0b2d6b", fontSize: 12, fontWeight: 800, lineHeight: 1.35 };
const downloadOk: CSSProperties = { marginTop: 12, background: "#dcfce7", color: "#166534", padding: "12px 14px", borderRadius: 14, fontWeight: 800 };
const th: CSSProperties = { padding: 10, textAlign: "left" };
const td: CSSProperties = { padding: 10, borderBottom: "1px solid #e2e8f0" };
const editBtn: CSSProperties = { padding: "8px 12px", borderRadius: 10, border: 0, background: "#2563eb", color: "white", fontWeight: "bold", marginRight: 8 };
const pdfBtn: CSSProperties = { padding: "8px 12px", borderRadius: 10, border: 0, background: "#059669", color: "white", fontWeight: "bold", marginRight: 8 };
const ratingBtn: CSSProperties = { padding: "8px 12px", borderRadius: 10, border: 0, background: "#f59e0b", color: "white", fontWeight: "bold", marginRight: 8 };
const delBtn: CSSProperties = { padding: "8px 12px", borderRadius: 10, border: 0, background: "#dc2626", color: "white", fontWeight: "bold" };
const overlay: CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,.68)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 8 };
const modal: CSSProperties = { width: "96%", maxWidth: 390, maxHeight: "90vh", overflowY: "auto", background: "white", borderRadius: 20, position: "relative" };
const close: CSSProperties = { position: "absolute", top: 7, right: 7, width: 34, height: 34, borderRadius: "50%", border: 0, background: "white", fontSize: 20, fontWeight: 900, zIndex: 2 };
const banner: CSSProperties = { width: "100%", height: "auto", objectFit: "contain", display: "block", borderRadius: "20px 20px 0 0", background: "white" };
const body: CSSProperties = { padding: "10px 14px 8px" };
const title: CSSProperties = { color: "#0b2d6b", fontSize: 18, margin: "0 0 8px", fontWeight: 950 };
const detailRow: CSSProperties = { display: "grid", gridTemplateColumns: "130px 1fr", gap: 8, borderBottom: "1px solid #e2e8f0", padding: "4px 0", fontSize: 13 };
const netRow: CSSProperties = { display: "flex", justifyContent: "space-between", marginTop: 8, padding: "8px 10px", borderRadius: 12, background: "#ecfdf5", color: "#15803d", fontSize: 15 };
const actions: CSSProperties = { position: "sticky", bottom: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 10, background: "white", borderTop: "1px solid #e2e8f0" };
const cancelBtn: CSSProperties = { padding: 11, borderRadius: 12, border: "2px solid #ef4444", background: "white", color: "#ef4444", fontWeight: 950 };
const greenBtn: CSSProperties = { padding: 11, borderRadius: 12, border: 0, background: "#16a34a", color: "white", fontWeight: 950 };

