"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import DriverDutyActions from "./DriverDutyActions";

type FieldNode = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

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
    feedback: "Please provide safe, clean and comfortable service.",
  };
}

export default function DriverDutyFloatingActions() {
  const pathname = usePathname();
  const [data, setData] = useState(readForm());

  if (pathname !== "/admin") return null;

  return (
    <div
      onClick={() => setData(readForm())}
      style={{ position: "fixed", left: 16, right: 16, bottom: 78, zIndex: 9998, padding: 10, borderRadius: 18, background: "rgba(255,255,255,.96)", boxShadow: "0 12px 30px rgba(0,0,0,.22)", border: "1px solid rgba(15,23,42,.12)" }}
    >
      <DriverDutyActions data={data} />
    </div>
  );
}
