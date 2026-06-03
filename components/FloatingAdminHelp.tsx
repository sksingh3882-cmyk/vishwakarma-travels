"use client";

import { type CSSProperties } from "react";
import { ADMIN_CONTACT } from "@/lib/adminContact";

export default function FloatingAdminHelp() {
  const message = encodeURIComponent("Hello Vishwakarma Travels, I need help.");

  return (
    <a
      href={`https://wa.me/${ADMIN_CONTACT.whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      style={button}
      aria-label="Contact Vishwakarma Travels Admin on WhatsApp"
    >
      Help
    </a>
  );
}

const button: CSSProperties = {
  position: "fixed",
  right: 16,
  bottom: 18,
  zIndex: 999,
  minHeight: 46,
  padding: "0 18px",
  borderRadius: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#16a34a",
  color: "#fff",
  fontSize: 14,
  fontWeight: 900,
  textDecoration: "none",
  boxShadow: "0 10px 24px rgba(22,163,74,.35)",
};
