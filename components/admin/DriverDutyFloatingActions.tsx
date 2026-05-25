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
  const pathname = usePathname();
  const [data, setData] = useState(readForm());

  if (pathname !== "/admin") return null;

  return (
    <div
      onClick={() => setData(readForm())}
      style={{
        position: "fixed",
        top: 84,
        left: 80,
        zIndex: 9998,
        padding: 6,
        borderRadius: 16,
        background: "rgba(255,255,255,.96)",
        boxShadow: "0 8px 20px rgba(0,0,0,.18)",
        border: "1px solid rgba(15,23,42,.08)",
        width: 170,
      }}
    >
      <DriverDutyActions compact data={data} />
    </div>
  );
}
