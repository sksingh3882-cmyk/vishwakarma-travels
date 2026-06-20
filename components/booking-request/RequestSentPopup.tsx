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
          <svg viewBox="0 0 96 96" style={tickSvg} aria-hidden="true">
            <circle cx="48" cy="48" r="31" style={tickCircle} />
            <path d="M31 49 L43 61 L66 35" style={tickPath} />
          </svg>
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
  background: "rgba(0,0,0,.62)",
  backdropFilter: "blur(3px)",
  WebkitBackdropFilter: "blur(3px)",
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
  background: "linear-gradient(145deg, rgba(4,8,13,.96), rgba(15,23,42,.90))",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(212,175,55,.55)",
  borderRadius: 26,
  padding: "30px 22px 24px",
  textAlign: "center",
  boxShadow: "0 28px 90px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.08)",
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
  background: "linear-gradient(90deg,#8a5a16,#f6d56f,#8a5a16)",
  boxShadow: "0 0 14px rgba(246,213,111,.45)",
};

const tickWrap: CSSProperties = {
  width: 112,
  height: 112,
  margin: "10px auto 18px",
  borderRadius: "50%",
  background: "#e9fbf1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "vtRequestPulseGlow 1.25s infinite, vtRequestTickScale .35s ease-out both",
};

const tickSvg: CSSProperties = {
  width: 86,
  height: 86,
  display: "block",
};

const tickCircle: CSSProperties = {
  fill: "none",
  stroke: "#22c55e",
  strokeWidth: 6,
  strokeLinecap: "round",
  strokeDasharray: 195,
  strokeDashoffset: 195,
  animation: "vtRequestDrawCircle .62s ease forwards",
};

const tickPath: CSSProperties = {
  fill: "none",
  stroke: "#16a34a",
  strokeWidth: 8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeDasharray: 70,
  strokeDashoffset: 70,
  animation: "vtRequestDrawTick .42s ease forwards",
  animationDelay: ".48s",
};

const title: CSSProperties = {
  margin: 0,
  color: "#ffffff",
  fontSize: 28,
  lineHeight: 1.1,
  fontWeight: 950,
};

const text: CSSProperties = {
  margin: "14px 0 0",
  color: "rgba(255,255,255,.78)",
  fontSize: 17,
  lineHeight: 1.45,
  fontWeight: 700,
};

const myBookingBtn: CSSProperties = {
  width: "100%",
  marginTop: 22,
  minHeight: 54,
  border: "1px solid rgba(212,175,55,.48)",
  borderRadius: 12,
  background: "linear-gradient(135deg, rgba(22,163,74,.78), rgba(5,80,42,.90))",
  color: "#ffffff",
  fontSize: 17,
  fontWeight: 950,
  boxShadow: "0 14px 30px rgba(22,163,74,.22)",
};

const closeBtn: CSSProperties = {
  width: "100%",
  marginTop: 10,
  minHeight: 50,
  border: "1px solid rgba(212,175,55,.45)",
  borderRadius: 12,
  background: "rgba(255,255,255,.04)",
  color: "#f6d56f",
  fontSize: 16,
  fontWeight: 950,
};
