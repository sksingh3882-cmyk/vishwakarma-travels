"use client";

import type { CSSProperties } from "react";

type DutyData = {
  customerName?: string;
  customerPhone?: string;
  pickup?: string;
  drop?: string;
  journeyDate?: string;
  journeyTime?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleNumber?: string;
  driverName?: string;
  driverMobile?: string;
};

type Props = { data: DutyData; compact?: boolean; onSync?: () => void };

function cleanPhone(v?: string) {
  let p = String(v || "").replace(/\D/g, "");
  if ((p.startsWith("91") || p.startsWith("0")) && p.length > 10) p = p.slice(-10);
  return p.slice(-10);
}

function vehicleNo(v?: string) {
  return String(v || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function formatDate(v?: string) {
  return v && v.includes("-") ? v.split("-").reverse().join("-") : v || "";
}

function formatTime(v?: string) {
  if (!v) return "";
  const t = String(v).trim().toUpperCase();
  if (t.includes("AM") || t.includes("PM")) return t;

  const parts = t.split(":");
  if (parts.length < 2) return t;

  let hour = Number(parts[0]);
  const minute = parts[1];
  const suffix = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${suffix}`;
}

function reportingTime(d: DutyData) {
  return `${formatDate(d.journeyDate)} ${formatTime(d.journeyTime)}`.trim() || "-";
}
