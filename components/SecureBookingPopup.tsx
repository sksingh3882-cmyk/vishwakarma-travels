"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

const STORAGE_KEY = "vt_safety_note_seen";

export default function SecureBookingPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setShowPopup(true);
    } catch {
      setShowPopup(true);
    }
  }, []);

  const closePopup = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "yes");
    } catch {}
    setShowPopup(false);
    window.dispatchEvent(new Event("vt_privacy_popup_closed"));
  };

  if (!showPopup) return null;

  return (
    <div style={overlay} role="dialog" aria-modal="true" aria-label="Vishwakarma Travels Safety Note">
      <div style={popup}>
        <button type="button" onClick={closePopup} style={closeButton} aria-label="Close popup">X</button>

        <div style={shieldWrap} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="none">
            <path d="M12 3L5 6v5c0 4.4 2.9 8.5 7 10 4.1-1.5 7-5.6 7-10V6l-7-3z" fill="currentColor" opacity="0.18" />
            <path d="M12 3L5 6v5c0 4.4 2.9 8.5 7 10 4.1-1.5 7-5.6 7-10V6l-7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M8.5 12.2l2.1 2.1 4.9-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 style={heading}>Vishwakarma Travels Safety Note</h2>
        <p style={subHeading}>Official Cab Booking Web App</p>

        <div style={noticeBox}>
          <NoticePoint number="1">Your booking information is handled securely by Vishwakarma Travels.</NoticePoint>
          <NoticePoint number="2">Please use only our official booking link for cab booking and trip support.</NoticePoint>
          <NoticePoint number="3">Your personal details are used only for booking confirmation, vehicle assignment, driver contact, and trip support.</NoticePoint>
        </div>

        <div style={guidanceBox}>
          <strong style={guidanceTitle}>Important Guidance:</strong><br />
          Some phones or browsers may show an alert. Please verify that the website address is the official Vishwakarma Travels link and starts with <strong>https://</strong> before using the web app.
        </div>

        <button type="button" onClick={closePopup} style={continueButton}>I Understand, Continue to Booking</button>
        <p style={footerNote}>Your privacy and booking support are important to us.</p>
      </div>
    </div>
  );
}

function NoticePoint({ number, children }: { number: string; children: ReactNode }) {
  return (
    <div style={noticeRow}>
      <span style={numberBadge}>{number}</span>
      <span>{children}</span>
    </div>
  );
}

const overlay: CSSProperties = { position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,.62)" };
const popup: CSSProperties = { position: "relative", width: "100%", maxWidth: 430, maxHeight: "92vh", overflowY: "auto", borderRadius: 26, background: "#fff", padding: "22px 18px 18px", boxShadow: "0 20px 50px rgba(0,0,0,.35)", fontFamily: "Arial, sans-serif" };
const closeButton: CSSProperties = { position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%", border: 0, background: "#f3f4f6", color: "#4b5563", fontSize: 16, lineHeight: "34px", cursor: "pointer", fontWeight: 900 };
const shieldWrap: CSSProperties = { width: 68, height: 68, borderRadius: "50%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", background: "#dcfce7", color: "#15803d", boxShadow: "0 8px 20px rgba(21,128,61,.18)" };
const heading: CSSProperties = { margin: "14px 24px 0", textAlign: "center", color: "#111827", fontSize: 21, lineHeight: 1.2, fontWeight: 900 };
const subHeading: CSSProperties = { margin: "6px 0 0", textAlign: "center", color: "#0f766e", fontSize: 13, fontWeight: 800 };
const noticeBox: CSSProperties = { marginTop: 16, border: "1px solid #bbf7d0", borderRadius: 18, padding: 14, background: "#f0fdf4" };
const noticeRow: CSSProperties = { display: "flex", gap: 10, marginBottom: 12, color: "#374151", fontSize: 13, lineHeight: 1.45 };
const numberBadge: CSSProperties = { minWidth: 22, height: 22, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#22c55e", color: "#fff", fontSize: 12, fontWeight: 900 };
const guidanceBox: CSSProperties = { marginTop: 12, border: "1px solid #bfdbfe", borderRadius: 16, padding: 12, background: "#eff6ff", color: "#1e3a8a", fontSize: 12, lineHeight: 1.5 };
const guidanceTitle: CSSProperties = { color: "#0f172a" };
const continueButton: CSSProperties = { width: "100%", marginTop: 16, border: 0, borderRadius: 18, padding: "14px 12px", background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff", fontSize: 14, fontWeight: 900, boxShadow: "0 8px 18px rgba(22,163,74,.35)", cursor: "pointer" };
const footerNote: CSSProperties = { margin: "10px 0 0", textAlign: "center", color: "#6b7280", fontSize: 11 };
