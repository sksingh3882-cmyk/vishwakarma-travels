"use client";

import type { CSSProperties } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onMyBooking: () => void;
};

export default function RequestSentPopup({ open, onClose, onMyBooking }: Props) {
  if (!open) return null;

  return (
    <div style={overlay}>
      <style>{`
        @keyframes vtRequestPopIn {
          from { opacity: 0; transform: translateY(24px) scale(0.92); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
                @keyframes vtRequestTickScale {
          0% { transform: scale(0.82); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes vtRequestDrawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes vtRequestDrawTick {
          to { stroke-dashoffset: 0; }
        }
        @keyframes vtRequestPulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.24); }
          50% { box-shadow: 0 0 0 14px rgba(22, 163, 74, 0.06); }
        }
      `}</style>

      <div style={card}>
        <div style={handle} />
                <div style={tickWrap}>
          <div style={tick}>
            <svg viewBox="0 0 80 80" style={tickSvg} aria-hidden="true">
              <circle cx="40" cy="40" r="28" style={tickCircle} />
              <path d="M24 41 L35 52 L57 29" style={tickPath} />
            </svg>
          </div>
        </div>

        <h2 style={title}>Request Sent</h2>
        <p style={text}>
          Please wait for Confirmation.<br />
          Go to <b>My Booking</b> to see Booking Status.
        </p>

        <button type="button" style={myBookingBtn} onClick={onMyBooking}>
          Go to My Booking
        </button>
        <button type="button" style={closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,.55)",
  zIndex: 10000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 18,
  fontFamily: "Arial, sans-serif",
};

const card: CSSProperties = {
  width: "100%",
  maxWidth: 340,
  background: "#fff",
  borderRadius: 30,
  padding: "30px 22px 24px",
  textAlign: "center",
  boxShadow: "0 25px 70px rgba(0,0,0,.28)",
  position: "relative",
  animation: "vtRequestPopIn .34s ease-out",
};

const handle: CSSProperties = {
  position: "absolute",
  top: 10,
  left: "50%",
  transform: "translateX(-50%)",
  width: 52,
  height: 6,
  borderRadius: 999,
  background: "#dbe5f0",
};

const tickWrap: CSSProperties = {
  width: 92,
  height: 92,
  margin: "10px auto 18px",
  borderRadius: 28,
  background: "#ecfdf5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "vtRequestPulseGlow 1.25s infinite",
};

const tick: CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: 18,
  background: "#16a34a",
  display: "grid",
  placeItems: "center",
  animation: "vtRequestTickScale .45s ease-out both",
};

const tickSvg: CSSProperties = {
  width: 44,
  height: 44,
  display: "block",
};

const tickCircle: CSSProperties = {
  fill: "none",
  stroke: "rgba(255,255,255,.35)",
  strokeWidth: 5,
  strokeDasharray: 176,
  strokeDashoffset: 176,
  animation: "vtRequestDrawCircle .55s ease forwards",
};

const tickPath: CSSProperties = {
  fill: "none",
  stroke: "#ffffff",
  strokeWidth: 7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeDasharray: 60,
  strokeDashoffset: 60,
  animation: "vtRequestDrawTick .38s ease forwards",
  animationDelay: ".38s",
};

const title: CSSProperties = {
  margin: 0,
  color: "#07122b",
  fontSize: 28,
  lineHeight: 1.1,
  fontWeight: 900,
};

const text: CSSProperties = {
  margin: "14px 0 0",
  color: "#64748b",
  fontSize: 17,
  lineHeight: 1.45,
  fontWeight: 700,
};

const myBookingBtn: CSSProperties = {
  width: "100%",
  marginTop: 22,
  minHeight: 54,
  border: 0,
  borderRadius: 17,
  background: "#16a34a",
  color: "#fff",
  fontSize: 17,
  fontWeight: 900,
};

const closeBtn: CSSProperties = {
  width: "100%",
  marginTop: 10,
  minHeight: 50,
  border: "1px solid #d7e2ef",
  borderRadius: 16,
  background: "#fff",
  color: "#07122b",
  fontSize: 16,
  fontWeight: 900,
};
