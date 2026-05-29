export type BookingRequestStatus = "pending" | "accepted" | "confirmed" | "cancelled";

export type BookingRequestInput = {
  customerName: string;
  customerPhone: string;
  service?: string;
  requestedVehicle?: string;
  pickup: string;
  drop: string;
  journeyDate: string;
  journeyTime: string;
};

export type BookingRequestRecord = BookingRequestInput & {
  id: string;
  status: BookingRequestStatus;
  vehicleNo?: string;
  vehicleType?: string;
  vehicleModel?: string;
  driverName?: string;
  driverMobile?: string;
  createdAt?: string;
  acceptedAt?: string;
  confirmedAt?: string;
};

type HeadersMap = Record<string, string>;

function cleanPhone(value: string) {
  let phone = String(value || "").replace(/\D/g, "");
  if ((phone.startsWith("91") || phone.startsWith("0")) && phone.length > 10) phone = phone.slice(-10);
  return phone.slice(-10);
}

function headers(supabaseKey: string, prefer = "return=representation"): HeadersMap {
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
    Prefer: prefer,
  };
}

function toDb(input: BookingRequestInput) {
  return {
    customer_name: input.customerName,
    customer_phone: cleanPhone(input.customerPhone),
    service: input.service || "",
    requested_vehicle: input.requestedVehicle || "",
    pickup: input.pickup,
    drop_location: input.drop,
    journey_date: input.journeyDate,
    journey_time: input.journeyTime,
    status: "pending",
  };
}

export function fromDb(row: any): BookingRequestRecord {
  return {
    id: String(row.id || ""),
    customerName: row.customer_name || "",
    customerPhone: cleanPhone(row.customer_phone || row.mobile || ""),
    service: row.service || "",
    requestedVehicle: row.requested_vehicle || row.vehicle || row.vehicle_model || "",
    pickup: row.pickup || "",
    drop: row.drop_location || row.drop || "",
    journeyDate: row.journey_date || "",
    journeyTime: row.journey_time || "",
    status: (row.status || "pending") as BookingRequestStatus,
    vehicleNo: row.vehicle_no || row.vehicle_number || "",
    vehicleType: row.vehicle_type || "",
    vehicleModel: row.vehicle_model || "",
    driverName: row.driver_name || "",
    driverMobile: cleanPhone(row.driver_mobile || ""),
    createdAt: row.created_at || "",
    acceptedAt: row.accepted_at || "",
    confirmedAt: row.confirmed_at || "",
  };
}

export async function createBookingRequest(params: {
  supabaseUrl: string;
  supabaseKey: string;
  input: BookingRequestInput;
}) {
  const res = await fetch(`${params.supabaseUrl}/rest/v1/booking_requests`, {
    method: "POST",
    headers: headers(params.supabaseKey),
    body: JSON.stringify(toDb(params.input)),
  });

  if (!res.ok) throw new Error("Booking request create nahi ho paya.");
  const rows = await res.json();
  return fromDb(rows?.[0] || rows);
}

export async function fetchBookingRequestById(params: { supabaseUrl: string; supabaseKey: string; requestId: string }) {
  const res = await fetch(
    `${params.supabaseUrl}/rest/v1/booking_requests?select=*&id=eq.${params.requestId}&limit=1`,
    { headers: headers(params.supabaseKey, "return=minimal") }
  );
  if (!res.ok) throw new Error("Booking request status fetch nahi ho paya.");
  const rows = await res.json();
  return rows?.[0] ? fromDb(rows[0]) : null;
}

export async function fetchBookingRequestsByPhone(params: { supabaseUrl: string; supabaseKey: string; customerPhone: string }) {
  const phone = cleanPhone(params.customerPhone);
  if (!phone) return [];

  const res = await fetch(
    `${params.supabaseUrl}/rest/v1/booking_requests?select=*&customer_phone=eq.${phone}&order=created_at.desc&limit=20`,
    { headers: headers(params.supabaseKey, "return=minimal") }
  );
  if (!res.ok) throw new Error("Unable to load your bookings.");
  const rows = await res.json();
  return Array.isArray(rows) ? rows.map(fromDb) : [];
}

export async function fetchPendingBookingRequests(params: { supabaseUrl: string; supabaseKey: string }) {
  const res = await fetch(
    `${params.supabaseUrl}/rest/v1/booking_requests?select=*&status=eq.pending&order=created_at.asc`,
    { headers: headers(params.supabaseKey, "return=minimal") }
  );
  if (!res.ok) throw new Error("Pending booking requests fetch nahi ho paya.");
  const rows = await res.json();
  return Array.isArray(rows) ? rows.map(fromDb) : [];
}

export async function acceptBookingRequest(params: { supabaseUrl: string; supabaseKey: string; requestId: string }) {
  const res = await fetch(`${params.supabaseUrl}/rest/v1/booking_requests?id=eq.${params.requestId}`, {
    method: "PATCH",
    headers: headers(params.supabaseKey, "return=representation"),
    body: JSON.stringify({ status: "accepted", accepted_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error("Booking request accept nahi ho paya.");
  const rows = await res.json();
  return fromDb(rows?.[0] || rows);
}

export async function cancelBookingRequest(params: { supabaseUrl: string; supabaseKey: string; requestId: string }) {
  const res = await fetch(`${params.supabaseUrl}/rest/v1/booking_requests?id=eq.${params.requestId}`, {
    method: "PATCH",
    headers: headers(params.supabaseKey, "return=representation"),
    body: JSON.stringify({ status: "cancelled" }),
  });
  if (!res.ok) throw new Error("Booking request cancel nahi ho paya.");
  const rows = await res.json();
  return fromDb(rows?.[0] || rows);
}

export async function confirmBookingRequestAfterDownload(params: {
  supabaseUrl: string;
  supabaseKey: string;
  requestId: string;
  vehicleNo: string;
  vehicleType?: string;
  vehicleModel?: string;
  driverName: string;
  driverMobile: string;
}) {
  const res = await fetch(`${params.supabaseUrl}/rest/v1/booking_requests?id=eq.${params.requestId}`, {
    method: "PATCH",
    headers: headers(params.supabaseKey, "return=representation"),
    body: JSON.stringify({
      status: "confirmed",
      vehicle_no: params.vehicleNo,
      vehicle_type: params.vehicleType || "",
      vehicle_model: params.vehicleModel || "",
      driver_name: params.driverName,
      driver_mobile: cleanPhone(params.driverMobile),
      confirmed_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error("Booking request final confirm nahi ho paya.");
  const rows = await res.json();
  return fromDb(rows?.[0] || rows);
}
