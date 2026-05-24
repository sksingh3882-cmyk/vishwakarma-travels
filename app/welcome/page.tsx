"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

export default function WelcomePage() {
  return (
    <main style={page}>
      <style jsx global>{`
        @keyframes pageReveal {
          0% { opacity: 0; transform: translateY(18px) scale(.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.03); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 18px 45px rgba(249,115,22,.30); }
          50% { box-shadow: 0 18px 70px rgba(249,115,22,.55); }
        }
        @keyframes trainMove {
          0% { transform: translateX(115vw); opacity: 0; }
          8% { opacity: 1; }
          88% { opacity: 1; }
          100% { transform: translateX(-135vw); opacity: 0; }
        }
        @keyframes shimmerLine {
          0% { transform: translateX(-80%); opacity: .2; }
          50% { opacity: .9; }
          100% { transform: translateX(80%); opacity: .2; }
        }
        @keyframes lightSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(22px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .vt-welcome-shell {
          animation: pageReveal .85s ease both;
        }
        .vt-logo-float {
          animation: floatLogo 3.4s ease-in-out infinite;
        }
        .vt-glow-button {
          animation: glowPulse 2.2s ease-in-out infinite;
        }
        .vt-train-row {
          animation: trainMove 12s linear infinite;
        }
        .vt-shimmer {
          animation: shimmerLine 4.6s ease-in-out infinite;
        }
        .vt-orbit {
          animation: lightSpin 18s linear infinite;
        }
        .vt-card-in {
          animation: slideUp .9s ease .25s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .vt-welcome-shell, .vt-logo-float, .vt-glow-button, .vt-train-row, .vt-shimmer, .vt-orbit, .vt-card-in {
            animation: none !important;
          }
        }
      `}</style>

      <div style={orbitA} className="vt-orbit" />
      <div style={orbitB} className="vt-orbit" />
      <div style={roadGlow} className="vt-shimmer" />

      <section style={shell} className="vt-welcome-shell">
        <div style={topBar}>
          <img src="/cars/vt-logo.png" alt="Vishwakarma Travels" style={smallLogo} />
          <div>
            <h1 style={brandMain}>VISHWAKARMA</h1>
            <p style={brandSub}>TRAVELS</p>
          </div>
        </div>

        <div style={trainTrack} aria-label="Animated travel message">
          <div style={trainRow} className="vt-train-row">
            <span style={trainIcon}>🚆</span>
            <span style={movingText}>Travels Made Easy with Vishwakarma Travels</span>
          </div>
        </div>

        <div style={coverCard} className="vt-card-in">
          <div style={heroBadge}>Premium Cab Booking</div>
          <img src="/cars/vt-logo.png" alt="Vishwakarma Travels Logo" style={logo} className="vt-logo-float" />
          <h2 style={headline}>Welcome to Vishwakarma Travels</h2>
          <p style={subtitle}>Safe, comfortable and reliable cab booking for your journey.</p>

          <div style={trustGrid}>
            <div style={trustItem}>✅ Trusted Service</div>
            <div style={trustItem}>🚕 Clean Cabs</div>
            <div style={trustItem}>📞 Easy Support</div>
          </div>

          <Link href="/" style={continueBtn} className="vt-glow-button">
            Continue Booking
          </Link>

          <Link href="/admin" style={adminBtn}>
            Admin Login
          </Link>
        </div>

        <p style={footerText}>Adityapur, Jamshedpur • Vishwakarma Travels</p>
      </section>
    </main>
  );
}

const page: CSSProperties = {
  minHeight: "100vh",
  overflow: "hidden",
  position: "relative",
  display: "grid",
  placeItems: "center",
  padding: "18px",
  boxSizing: "border-box",
  fontFamily: "Arial, sans-serif",
  background:
    "radial-gradient(circle at 20% 15%, rgba(249,115,22,.26), transparent 28%), radial-gradient(circle at 85% 12%, rgba(37,99,235,.24), transparent 30%), linear-gradient(145deg, #071735 0%, #0b2d6b 48%, #061126 100%)",
};

const shell: CSSProperties = {
  width: "100%",
  maxWidth: 430,
  minHeight: "calc(100vh - 36px)",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 16,
  zIndex: 2,
};

const topBar: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 4px",
};

const smallLogo: CSSProperties = {
  width: 46,
  height: 46,
  objectFit: "contain",
  background: "rgba(255,255,255,.92)",
  borderRadius: 14,
  padding: 4,
};

const brandMain: CSSProperties = {
  margin: 0,
  color: "#fb923c",
  fontSize: 18,
  lineHeight: 1,
  letterSpacing: .7,
  fontWeight: 900,
};

const brandSub: CSSProperties = {
  margin: 0,
  color: "white",
  fontSize: 14,
  fontWeight: 900,
  letterSpacing: 2.5,
};

const trainTrack: CSSProperties = {
  height: 54,
  borderRadius: 999,
  overflow: "hidden",
  position: "relative",
  background: "rgba(255,255,255,.10)",
  border: "1px solid rgba(255,255,255,.18)",
  boxShadow: "inset 0 0 18px rgba(255,255,255,.08)",
};

const trainRow: CSSProperties = {
  position: "absolute",
  top: 8,
  left: 0,
  display: "flex",
  alignItems: "center",
  gap: 10,
  whiteSpace: "nowrap",
};

const trainIcon: CSSProperties = {
  fontSize: 30,
  filter: "drop-shadow(0 8px 12px rgba(0,0,0,.35))",
};

const movingText: CSSProperties = {
  color: "#fff7ed",
  fontWeight: 900,
  fontSize: 18,
  textShadow: "0 4px 16px rgba(0,0,0,.55)",
};

const coverCard: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  textAlign: "center",
  borderRadius: 30,
  padding: "26px 18px 20px",
  background: "linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,255,255,.88))",
  border: "1px solid rgba(255,255,255,.55)",
  boxShadow: "0 24px 70px rgba(0,0,0,.35)",
  backdropFilter: "blur(14px)",
};

const heroBadge: CSSProperties = {
  display: "inline-flex",
  padding: "8px 13px",
  borderRadius: 999,
  color: "#9a3412",
  background: "#ffedd5",
  border: "1px solid #fed7aa",
  fontWeight: 900,
  fontSize: 12,
  marginBottom: 14,
};

const logo: CSSProperties = {
  width: 98,
  height: 98,
  objectFit: "contain",
  margin: "0 auto 10px",
  display: "block",
  borderRadius: 24,
  background: "white",
  padding: 8,
  boxShadow: "0 14px 34px rgba(11,45,107,.18)",
};

const headline: CSSProperties = {
  margin: "6px 0 8px",
  color: "#0b2d6b",
  fontSize: "clamp(27px, 8vw, 34px)",
  lineHeight: 1.05,
  fontWeight: 900,
};

const subtitle: CSSProperties = {
  margin: "0 auto 16px",
  maxWidth: 315,
  color: "#475569",
  fontSize: 14,
  lineHeight: 1.45,
};

const trustGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 8,
  marginBottom: 18,
};

const trustItem: CSSProperties = {
  padding: "10px 12px",
  borderRadius: 15,
  background: "#f8fafc",
  color: "#0f172a",
  fontWeight: 800,
  border: "1px solid #e2e8f0",
};

const continueBtn: CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "15px 16px",
  borderRadius: 18,
  background: "linear-gradient(135deg, #f97316, #fb923c)",
  color: "white",
  textDecoration: "none",
  fontWeight: 900,
  fontSize: 16,
  letterSpacing: .2,
};

const adminBtn: CSSProperties = {
  display: "inline-block",
  marginTop: 14,
  color: "#0b2d6b",
  textDecoration: "none",
  fontWeight: 900,
  fontSize: 13,
};

const footerText: CSSProperties = {
  textAlign: "center",
  color: "rgba(255,255,255,.78)",
  fontWeight: 700,
  fontSize: 12,
  margin: 0,
  paddingBottom: 6,
};

const orbitA: CSSProperties = {
  position: "absolute",
  width: 360,
  height: 360,
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,.12)",
  top: -110,
  right: -160,
};

const orbitB: CSSProperties = {
  position: "absolute",
  width: 430,
  height: 430,
  borderRadius: "50%",
  border: "1px dashed rgba(251,146,60,.18)",
  bottom: -180,
  left: -190,
};

const roadGlow: CSSProperties = {
  position: "absolute",
  width: "150%",
  height: 2,
  left: "-25%",
  top: "29%",
  background: "linear-gradient(90deg, transparent, rgba(251,146,60,.85), transparent)",
  boxShadow: "0 0 24px rgba(251,146,60,.7)",
};
