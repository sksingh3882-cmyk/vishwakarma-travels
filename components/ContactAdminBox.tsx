"use client";

import { type CSSProperties } from "react";
import { ADMIN_CONTACT } from "@/lib/adminContact";

export default function ContactAdminBox() {
  const message = encodeURIComponent("Hello Vishwakarma Travels, I need help with my booking.");

  return (
    <div style={box}>
      <div style={headRow}>
        <div style={iconCircle}>Call</div>
        <div>
          <h3 style={title}>Need Help? Contact Vishwakarma Travels Admin</h3>
          <p style={text}>For booking help, vehicle details, driver update, fare details, or trip support, you can contact our admin team directly.</p>
        </div>
      </div>

      <div style={buttonGrid}>
        <a href={`tel:${ADMIN_CONTACT.phoneCall}`} style={{ ...button, background: "#2563eb" }}>Call Admin</a>
        <a href={`https://wa.me/${ADMIN_CONTACT.whatsappNumber}?text=${message}`} target="_blank" rel="noopener noreferrer" style={{ ...button, background: "#16a34a" }}>WhatsApp Admin</a>
      </div>

      <p style={support}>Official support number: {ADMIN_CONTACT.phoneDisplay}</p>
    </div>
  );
}

const box: CSSProperties = { gridColumn: "1/-1", marginTop: 10, border: "1px solid #bfdbfe", borderRadius: 18, padding: 14, background: "#ffffff", boxShadow: "0 8px 22px rgba(15,23,42,.08)", fontFamily: "Arial, sans-serif" };
const headRow: CSSProperties = { display: "flex", gap: 12, alignItems: "flex-start" };
const iconCircle: CSSProperties = { width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#dbeafe", color: "#1d4ed8", fontSize: 11, fontWeight: 900, flexShrink: 0 };
const title: CSSProperties = { margin: 0, color: "#0b2d6b", fontSize: 16, lineHeight: 1.25, fontWeight: 900 };
const text: CSSProperties = { margin: "6px 0 0", color: "#475569", fontSize: 13, lineHeight: 1.45 };
const buttonGrid: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 };
const button: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, borderRadius: 14, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 900, boxShadow: "0 6px 14px rgba(15,23,42,.16)" };
const support: CSSProperties = { margin: "10px 0 0", textAlign: "center", color: "#64748b", fontSize: 12 };
