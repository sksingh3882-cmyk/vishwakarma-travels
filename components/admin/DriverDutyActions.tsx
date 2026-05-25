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
  feedback?: string;
};

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

function driverMessage(d: DutyData) {
  return `🚨 *UPCOMING DUTY ASSIGNMENT* 🚨\n\nHello *${d.driverName || "Driver"}*,\n\nThis is your upcoming duty message from *Vishwakarma Travels*.\n\n━━━━━━━━━━━━━━━\n\n👤 *Client Name:* ${d.customerName || "-"}\n📞 *Client Mobile:* ${cleanPhone(d.customerPhone) || "-"}\n\n📍 *Pickup Location:*\n${d.pickup || "-"}\n\n📍 *Drop Location:*\n${d.drop || "-"}\n\n🕒 *Reporting Time:*\n${formatDate(d.journeyDate)} ${d.journeyTime || ""}\n\n━━━━━━━━━━━━━━━\n\n🚖 *Vehicle Details*\n🔹 Vehicle No: ${vehicleNo(d.vehicleNumber) || "-"}\n🔹 Model: ${d.vehicleModel || "-"}\n🔹 Type: ${d.vehicleType || "-"}\n\n👨‍✈️ *Driver Details*\n🛂 Driver Name: ${d.driverName || "-"}\n📲 Mobile No: ${cleanPhone(d.driverMobile) || "-"}\n\n━━━━━━━━━━━━━━━\n\n⚠️ *Important Instructions*\n\n✅ Please report on time\n✅ Vehicle must be neat and clean\n🔇 Do not play loud music\n📵 Do not use mobile phone while driving\n🚨 Drive safely and avoid overspeeding\n😊 Maintain good customer behaviour\n\n━━━━━━━━━━━━━━━\n\n📝 *Customer Feedback / Special Instructions:*\n${d.feedback || "-"}\n\n━━━━━━━━━━━━━━━\n\n✨ Thank you for your support ✨\n\n           *Vishwakarma Travels*`;
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

export default function DriverDutyActions({ data }: { data: DutyData }) {
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

    const rr = (a: number, b: number, w: number, h: number, r: number) => {
      x.beginPath();
      x.roundRect(a, b, w, h, r);
      x.fill();
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
      x.font = "bold 33px 'Times New Roman', Times, serif";
      x.fillText(label, 75, y);
      x.fillStyle = "#111827";
      x.font = "32px 'Times New Roman', Times, serif";
      const ly = wrap(value || "-", 430, y, 575, 38);
      return Math.max(y + 58, ly + 36);
    };

    const drawDetails = () => {
      x.fillStyle = "#0b2d6b";
      x.font = "bold 48px 'Times New Roman', Times, serif";
      x.fillText("Driver Duty Assignment", 75, 620);

      x.fillStyle = "#fff7ed";
      rr(75, 650, 930, 64, 20);
      x.fillStyle = "#ea580c";
      x.font = "bold 32px 'Times New Roman', Times, serif";
      x.fillText(`Hello ${data.driverName || "Driver"}, this is your upcoming duty.`, 105, 692);

      let y = 765;
      y = row("Client Name", data.customerName || "-", y);
      y = row("Client Mobile", cleanPhone(data.customerPhone) || "-", y);
      y = row("Pickup Location", data.pickup || "-", y);
      y = row("Drop Location", data.drop || "-", y);
      y = row("Reporting Time", `${formatDate(data.journeyDate)} ${data.journeyTime || ""}`, y);
      y = row("Vehicle No.", vehicleNo(data.vehicleNumber) || "-", y);
      y = row("Model", data.vehicleModel || "-", y);
      y = row("Type", data.vehicleType || "-", y);
      y = row("Driver Name", data.driverName || "-", y);
      y = row("Driver Mobile", cleanPhone(data.driverMobile) || "-", y);

      x.fillStyle = "#ecfdf5";
      rr(75, y + 10, 930, 345, 26);
      x.fillStyle = "#087a31";
      x.font = "bold 34px 'Times New Roman', Times, serif";
      x.fillText("Important Instructions", 105, y + 58);
      x.fillStyle = "#111";
      x.font = "29px 'Times New Roman', Times, serif";
      let yy = y + 110;
      for (const t of [
        "Please report on time",
        "Vehicle must be neat and clean",
        "Do not play loud music",
        "Do not use mobile phone while driving",
        "Drive safely and avoid overspeeding",
        "Maintain good customer behaviour",
      ]) {
        x.fillText("•", 110, yy);
        x.fillText(t, 145, yy);
        yy += 38;
      }

      x.fillStyle = "#0b2d6b";
      x.font = "bold 30px 'Times New Roman', Times, serif";
      x.fillText("Customer Feedback / Special Instructions", 75, y + 420);
      x.fillStyle = "#111";
      x.font = "28px 'Times New Roman', Times, serif";
      wrap(data.feedback || "-", 75, y + 465, 900, 34);

      x.textAlign = "center";
      x.fillStyle = "#0b2d6b";
      x.font = "bold 28px 'Times New Roman', Times, serif";
      x.fillText("Thank You For Your Support", 540, 1800);
      x.font = "bold 36px 'Times New Roman', Times, serif";
      x.fillText("Vishwakarma Travels", 540, 1848);
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
    <div style={wrap}>
      <button type="button" onClick={downloadDriverDutyJpg} style={downloadBtn}>Driver Duty JPG</button>
      <button type="button" onClick={sendDriverWhatsApp} style={waBtn}>Driver WhatsApp</button>
    </div>
  );
}

const wrap: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 };
const baseBtn: CSSProperties = { minWidth: 0, padding: "11px 6px", color: "white", border: 0, borderRadius: 12, fontWeight: 900, fontSize: 13, lineHeight: 1.1 };
const downloadBtn: CSSProperties = { ...baseBtn, background: "#7c3aed" };
const waBtn: CSSProperties = { ...baseBtn, background: "#128C7E" };
