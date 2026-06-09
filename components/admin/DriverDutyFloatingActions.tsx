"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import DriverDutyActions from "./DriverDutyActions";

function byPlaceholder(key: string) {
  if (typeof document === "undefined") return "";
  const fields = Array.from(document.getElementsByTagName("input")) as HTMLInputElement[];
  const found = fields.find((f) => String(f.placeholder || "").toLowerCase().includes(key.toLowerCase()));
  return found?.value || "";
}

function selectAt(index: number) {
  if (typeof document === "undefined") return "";
  const items = Array.from(document.getElementsByTagName("select")) as HTMLSelectElement[];
  return items[index]?.value || "";
}

function readForm() {
  return {
    customerName: byPlaceholder("Customer Name"),
    customerPhone: byPlaceholder("Customer WhatsApp"),
    pickup: byPlaceholder("Pickup"),
    drop: byPlaceholder("Drop"),
    journeyDate: byPlaceholder("date"),
    journeyTime: byPlaceholder("Time"),
    vehicleNumber: byPlaceholder("Vehicle Number"),
    vehicleType: selectAt(1),
    vehicleModel: selectAt(2),
    driverName: byPlaceholder("Driver Name"),
    driverMobile: byPlaceholder("Driver Mobile"),
  };
}

export default function DriverDutyFloatingActions() {
  return null;
}
