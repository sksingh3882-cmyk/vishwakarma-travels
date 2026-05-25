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

function reportingTime(d: DutyData) {
  return `${formatDate(d.journeyDate)} ${d.journeyTime || ""}`.trim() || "-";
}

function driverMessage(d: DutyData) {
  return `🚨 *UPCOMING DUTY ASSIGNMENT* 🚨\nHello *${d.driverName || "Driver"}*,\nThis is your upcoming duty message from *Vishwakarma Travels*.\n\n👤 *Client Name:* ${d.customerName || "-"}\n📞 *Client Mobile:* ${cleanPhone(d.customerPhone) || "-"}\n📍 *Pickup Location:* ${d.pickup || "-"}\n📍 *Drop Location:* ${d.drop || "-"}\n🕒 *Reporting Time:* ${reportingTime(d)}\n\n🚖 *Vehicle Details*\n🔹 Vehicle No: ${vehicleNo(d.vehicleNumber) || "-"}\n🔹 Model: ${d.vehicleModel || "-"}\n🔹 Type: ${d.vehicleType || "-"}\n\n👨‍✈️ *Driver Details*\n🛂 Driver Name: ${d.driverName || "-"}\n📲 Mobile No: ${cleanPhone(d.driverMobile) || "-"}\n\n⚠️ *Important Instructions*\n✅ Please report on time\n✅ Vehicle must be neat and clean\n🔇 Do not play loud music\n📵 Do not use mobile phone while driving\n🚨 Drive safely and avoid overspeeding\n😊 Maintain good customer behaviour\n\n✨ Thank you for your support ✨\n*Vishwakarma Travels*`;
}

function validateDriver(d: DutyData) {
  if (cleanPhone(d.driverMobile).length !== 10) {
    alert("Driver mobile number 10 digit ka hona chahiye.");
    return false;
  }
  if (!d.driverName?.trim()) {
    alert("Driver name fill karo.");
    return false;
  }
  return true;
}

export default function DriverDutyActions({ data, compact = false, onSync }: Props) {
  function sendDriverWhatsApp() {
    if (!validateDriver(data)) return;
    window.open(
      `https://api.whatsapp.com/send?phone=91${cleanPhone(data.driverMobile)}&text=${encodeURIComponent(driverMessage(data))}`,
      "_blank"
    );
  }

  function downloadDriverDutyJpg() {
    if (!validateDriver(data)) return;

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
        } else line = test;
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

      const helloText = `🚨 Hello ${data.driverName || "Driver"}, this is your Upcoming Duty.`;
      x.fillStyle = "#000000";
      x.font = "bold 38px 'Times New Roman', Times, serif";
      x.textAlign = "center";
      x.fillText(helloText, 540, 716, 850);
      x.textAlign = "left";

      let y = 792;
      y = row("Client Name", data.customerName || "-", y);
      y = row("Client Mobile", cleanPhone(data.customerPhone) || "-", y);
      y = row("Pickup Location", data.pickup || "-", y);
      y = row("Drop Location", data.drop || "-", y);
      y = row("Reporting Time", reportingTime(data), y);
      y = row("Vehicle No.", vehicleNo(data.vehicleNumber) || "-", y + 14);
      y = row("Model", data.vehicleModel || "-", y);
      y = row("Type", data.vehicleType || "-", y);
      y = row("Driver Name", data.driverName || "-", y + 14);
      y = row("Driver Mobile", cleanPhone(data.driverMobile) || "-", y);

      x.fillStyle = "#ecfdf5";
      rr(75, y + 62, 930, 315, 26);
      x.fillStyle = "#087a31";
      x.font = "bold 36px 'Times New Roman', Times, serif";
      x.fillText("Important Instructions", 105, y + 112);
      x.fillStyle = "#111";
      x.font = "30px 'Times New Roman', Times, serif";
      let yy = y + 162;
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
        yy += 38;
      }

      x.textAlign = "center";
      x.fillStyle = "#0b2d6b";
      x.font = "bold 30px 'Times New Roman', Times, serif";
      x.fillText("✨ Thank you for your support ✨", 540, 1805);
      x.font = "bold 44px 'Times New Roman', Times, serif";
      x.fillText("Vishwakarma Travels", 540, 1864);
      x.textAlign = "left";

      const a = document.createElement("a");
      a.href = c.toDataURL("image/jpeg", 0.95);
      a.download = `Driver-Duty-${data.driverName || "Vishwakarma"}-${Date.now()}.jpg`;
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

  return (
    <div style={compact ? compactWrap : wrap}>
      <button type="button" onClick={downloadDriverDutyJpg} style={downloadBtn}>{compact ? "Download" : "Download Copy"}</button>
      <button type="button" onClick={sendDriverWhatsApp} style={waBtn}>{compact ? "Driver WA" : "Driver WhatsApp"}</button>
      {onSync && <button type="button" onClick={onSync} style={syncBtn}>Sync</button>}
    </div>
  );
}

const wrap: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 };
const compactWrap: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 };
const baseBtn: CSSProperties = { minWidth: 0, padding: "10px 6px", color: "white", border: 0, borderRadius: 12, fontWeight: 900, fontSize: 12, lineHeight: 1.1 };
const downloadBtn: CSSProperties = { ...baseBtn, background: "#2563eb" };
const waBtn: CSSProperties = { ...baseBtn, background: "#16a34a" };
const syncBtn: CSSProperties = { ...baseBtn, background: "#f97316" };
