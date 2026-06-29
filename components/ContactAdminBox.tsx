"use client";

import { type CSSProperties } from "react";
import { ADMIN_CONTACT } from "@/lib/adminContact";

export default function ContactAdminBox() {
  const message = encodeURIComponent(
    "Hello Vishwakarma Travels, I need assistance with my booking."
  );

  return (
    <section style={section}>
      <div style={card}>
        <p style={eyebrow}>Customer Support</p>

        <h3 style={title}>Need Assistance?</h3>

        <p style={description}>
          For booking confirmation, vehicle details, driver update, fare information,
          or trip support, please contact Vishwakarma Travels admin team.
        </p>

        <div style={buttonGrid}>
          <a
            href={`tel:${ADMIN_CONTACT.phoneCall}`}
            style={{ ...button, background: "#2563eb" }}
          >
            Call
          </a>

          <a
            href={`https://wa.me/${ADMIN_CONTACT.whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...button, background: "#16a34a" }}
          >
            WhatsApp
          </a>
        </div>

        <p style={supportText}>
          Official Support: {ADMIN_CONTACT.phoneDisplay}
        </p>
      </div>
    </section>
  );
}

const section: CSSProperties = {
  maxWidth: 760,
  margin: "8px auto 0",
  padding: "0 14px",
  boxSizing: "border-box",
};

const card: CSSProperties = {
  border: "1px solid rgba(255,255,255,.18)",
  borderRadius: 20,
  padding: 16,
  background: "rgba(255,255,255,.10)",
  backdropFilter: "blur(8px)",
  boxShadow: "0 16px 36px rgba(0,0,0,.22)",
  fontFamily: "Arial, sans-serif",
  textAlign: "center",
};

const eyebrow: CSSProperties = {
  margin: 0,
  color: "#2563eb",
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 0.4,
  textTransform: "uppercase",
};

const title: CSSProperties = {
  margin: "6px 0 0",
  color: "#0b2d6b",
  fontSize: 20,
  lineHeight: 1.2,
  fontWeight: 900,
};

const description: CSSProperties = {
  margin: "8px auto 0",
  maxWidth: 620,
  color: "#475569",
  fontSize: 13,
  lineHeight: 1.55,
};

const buttonGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginTop: 14,
};

const button: CSSProperties = {
  minHeight: 46,
  borderRadius: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 900,
  boxShadow: "0 7px 16px rgba(15,23,42,.16)",
};

const supportText: CSSProperties = {
  margin: "10px 0 0",
  color: "#64748b",
  fontSize: 12,
  fontWeight: 700,
};
