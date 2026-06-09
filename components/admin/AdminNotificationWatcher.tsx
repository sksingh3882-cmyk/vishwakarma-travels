"use client";

import { useEffect, useRef, useState } from "react";

type NoticeType = "driver_vehicle" | "rating";

type Notice = {
  type: NoticeType;
  id: string;
  title: string;
  body: string;
  link?: string;
};

type DriverVehicleRow = {
  id: string;
  customer_name?: string;
  pickup?: string;
  drop_location?: string;
  driver_name?: string;
  driver_mobile?: string;
  vehicle_no?: string;
    created_at?: string;
  confirmed_at?: string;
};

type RatingRow = {
  booking_id?: string;
  customer_name?: string;
  driver_name?: string;
  vehicle_number?: string;
  overall_average_rating?: number;
  driver_average_rating?: number;
  vehicle_average_rating?: number;
  feedback?: string;
  updated_at?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function headers() {
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
  };
}

function hasDriverVehicleDetails(row: DriverVehicleRow) {
  return Boolean(
    String(row.driver_name || "").trim() ||
      String(row.driver_mobile || "").trim() ||
      String(row.vehicle_no || "").trim()
  );
}

function driverVehicleKey(row: DriverVehicleRow) {
  return [
    row.id,
    row.driver_name || "",
    row.driver_mobile || "",
    row.vehicle_no || "",
        row.created_at || "",
    row.confirmed_at || "",
  ].join("|");
}

function ratingKey(row: RatingRow) {
  return [
    row.booking_id || "",
    row.overall_average_rating || "",
    row.driver_average_rating || "",
    row.vehicle_average_rating || "",
    row.updated_at || "",
  ].join("|");
}

function showBrowserNotification(title: string, body: string, tag: string) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    tag,
  });
}

export default function AdminNotificationWatcher() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const seenDriverVehicleRef = useRef<Set<string>>(new Set());
  const seenRatingRef = useRef<Set<string>>(new Set());
  const firstLoadDoneRef = useRef(false);

  useEffect(() => {
    if (!supabaseUrl || !supabaseKey) return;

    let stopped = false;

    async function checkDriverVehicleDetails() {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/booking_requests?select=id,customer_name,pickup,drop_location,driver_name,driver_mobile,vehicle_no,created_at,confirmed_at&or=(driver_name.neq.,driver_mobile.neq.,vehicle_no.neq.)&order=created_at.desc&limit=10`,
        { headers: headers() }
      );

      if (!response.ok) return null;

      const rows = await response.json();
      const list = Array.isArray(rows) ? rows.filter(hasDriverVehicleDetails) : [];

      if (!firstLoadDoneRef.current) {
        list.forEach((row) => seenDriverVehicleRef.current.add(driverVehicleKey(row)));
        return null;
      }

      const fresh = list.find((row) => !seenDriverVehicleRef.current.has(driverVehicleKey(row)));
      list.forEach((row) => seenDriverVehicleRef.current.add(driverVehicleKey(row)));

      if (!fresh) return null;

      return {
        type: "driver_vehicle" as const,
        id: fresh.id,
        title: "Vehicle Details Received",
        body: `${fresh.driver_name || "Driver"} • ${fresh.vehicle_no || "Vehicle details received"}`,
        link: `/admin/driver-vehicle-assignment/${encodeURIComponent(fresh.id)}`,
      };
    }

    async function checkRatings() {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/trip_ratings?select=booking_id,customer_name,driver_name,vehicle_number,overall_average_rating,driver_average_rating,vehicle_average_rating,feedback,updated_at&order=updated_at.desc&limit=10`,
        { headers: headers() }
      );

      if (!response.ok) return null;

      const rows = await response.json();
      const list = Array.isArray(rows) ? rows : [];

      if (!firstLoadDoneRef.current) {
        list.forEach((row) => seenRatingRef.current.add(ratingKey(row)));
        return null;
      }

      const fresh = list.find((row) => !seenRatingRef.current.has(ratingKey(row)));
      list.forEach((row) => seenRatingRef.current.add(ratingKey(row)));

      if (!fresh) return null;

      const ratingText = fresh.overall_average_rating
        ? `⭐ ${Number(fresh.overall_average_rating).toFixed(2)}`
        : "Rating received";

      return {
        type: "rating" as const,
        id: String(fresh.booking_id || Date.now()),
        title: "New Customer Rating Received",
        body: `${fresh.customer_name || "Customer"} • ${ratingText}`,
        link: "/rating-performance",
      };
    }

    async function checkNotifications() {
      try {
        if (localStorage.getItem("vt_admin_login") !== "yes") return;

        const driverVehicleNotice = await checkDriverVehicleDetails();
        const ratingNotice = await checkRatings();

        if (!firstLoadDoneRef.current) {
          firstLoadDoneRef.current = true;
          return;
        }

        const freshNotice = ratingNotice || driverVehicleNotice;

        if (!freshNotice || stopped) return;

        setNotice(freshNotice);

        showBrowserNotification(
          freshNotice.title,
          freshNotice.body,
          `vt-admin-${freshNotice.type}-${freshNotice.id}`
        );
      } catch (error) {
        console.log("Admin notification watcher failed:", error);
      }
    }

    checkNotifications();
    const timer = window.setInterval(checkNotifications, 12000);

    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, []);

  if (!notice) return null;

  return (
    <div style={toast}>
      <button type="button" style={closeBtn} onClick={() => setNotice(null)}>
        ×
      </button>

      <div style={icon}>{notice.type === "rating" ? "⭐" : "🚕"}</div>

      <div style={content}>
        <b style={title}>{notice.title}</b>
        <span style={line}>{notice.body}</span>

        {notice.link && (
          <button type="button" style={openBtn} onClick={() => window.open(notice.link, "_blank")}>
            {notice.type === "rating" ? "Open Ratings" : "Open Assignment"}
          </button>
        )}
      </div>
    </div>
  );
}

const toast: React.CSSProperties = {
  position: "fixed",
  right: 14,
  top: 92,
  zIndex: 100000,
  width: "min(360px, calc(100vw - 28px))",
  display: "grid",
  gridTemplateColumns: "42px 1fr",
  gap: 10,
  padding: 12,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #bbf7d0",
  boxShadow: "0 18px 45px rgba(15,23,42,.18)",
};

const icon: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 14,
  background: "#dcfce7",
  display: "grid",
  placeItems: "center",
  fontSize: 22,
};

const content: React.CSSProperties = {
  display: "grid",
  gap: 4,
  paddingRight: 24,
};

const title: React.CSSProperties = {
  color: "#14532d",
  fontSize: 14,
};

const line: React.CSSProperties = {
  color: "#334155",
  fontSize: 12,
  fontWeight: 700,
};

const openBtn: React.CSSProperties = {
  marginTop: 8,
  border: 0,
  borderRadius: 999,
  background: "#16a34a",
  color: "#ffffff",
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 900,
};

const closeBtn: React.CSSProperties = {
  position: "absolute",
  top: 8,
  right: 8,
  width: 28,
  height: 28,
  borderRadius: 999,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 18,
  fontWeight: 900,
};
