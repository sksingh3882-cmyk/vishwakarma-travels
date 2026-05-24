"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

export default function WelcomePage() {
  return (
    <main style={page}>
      <style jsx global>{`
        @keyframes introFade {
          from { opacity: 0; transform: translateY(18px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cardRise {
          from { opacity: 0; transform: translateY(34px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cityDrift {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes forestDrift {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @keyframes carRide {
          0% { transform: translateX(-35vw) translateY(0) scale(.96); }
          45% { transform: translateX(18vw) translateY(-3px) scale(1.02); }
          100% { transform: translateX(92vw) translateY(0) scale(.98); }
        }
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes laneMove {
          from { background-position-x: 0; }
          to { background-position-x: -220px; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 16px 42px rgba(249,115,22,.34); }
          50% { box-shadow: 0 20px 70px rgba(249,115,22,.62); }
        }
        @keyframes textShine {
          from { background-position: 0% 50%; }
          to { background-position: 200% 50%; }
        }
        @keyframes softFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .vt-scene { animation: introFade .85s ease both; }
        .vt-card { animation: cardRise .9s ease .25s both; }
        .vt-city { animation: cityDrift 18s linear infinite; }
        .vt-forest { animation: forestDrift 22s linear infinite; }
        .vt-car { animation: carRide 6.8s ease-in-out infinite; }
        .vt-wheel { animation: wheelSpin .7s linear infinite; transform-origin: center; }
        .vt-road { animation: laneMove 1.2s linear infinite; }
        .vt-cta { animation: glowPulse 2.1s ease-in-out infinite; }
        .vt-shine {
          background: linear-gradient(90deg, #fff7ed, #fed7aa, #ffffff, #fff7ed);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: textShine 3.3s linear infinite;
        }
        .vt-logo { animation: softFloat 3.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .vt-scene, .vt-card, .vt-city, .vt-forest, .vt-car, .vt-wheel, .vt-road, .vt-cta, .vt-shine, .vt-logo { animation: none !important; }
        }
      `}</style>

      <section style={scene} className="vt-scene">
        <div style={skyGlow} />
        <div style={sun} />

        <div style={cityLayer} className="vt-city" aria-hidden="true">
          <span style={buildingTall} />
          <span style={buildingMid} />
          <span style={buildingSmall} />
          <span style={buildingWide} />
          <span style={buildingMid} />
          <span style={buildingSmall} />
          <span style={buildingTall} />
          <span style={buildingWide} />
          <span style={buildingSmall} />
          <span style={buildingMid} />
          <span style={buildingTall} />
          <span style={buildingWide} />
        </div>

        <div style={forestLayer} className="vt-forest" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, i) => (
            <span key={i} style={{ ...tree, height: 36 + (i % 5) * 9 }} />
          ))}
        </div>

        <div style={topBar}>
          <div style={brandPill}>
            <img src="/cars/vt-logo.png" alt="Vishwakarma Travels" style={smallLogo} />
            <div>
              <h1 style={brandMain}>VISHWAKARMA</h1>
              <p style={brandSub}>TRAVELS</p>
            </div>
          </div>
          <Link href="/admin" style={adminTop}>Admin</Link>
        </div>

        <div style={messagePanel}>
          <p style={overline}>Premium Cab Booking Experience</p>
          <h2 style={heroText} className="vt-shine">Travel Made Easy</h2>
          <p style={heroSub}>with Vishwakarma Travels</p>
        </div>

        <div style={roadWrap}>
          <div style={road} className="vt-road" />
          <div style={carWrap} className="vt-car" aria-hidden="true">
            <div style={carBody}>
              <span style={carTop} />
              <span style={carWindow} />
              <span style={headLight} />
              <span style={tailLight} />
              <span style={wheelLeft} className="vt-wheel" />
              <span style={wheelRight} className="vt-wheel" />
            </div>
          </div>
        </div>

        <div style={bookingCard} className="vt-card">
          <div style={logoWrap}>
            <img src="/cars/vt-logo.png" alt="Vishwakarma Travels Logo" style={logo} className="vt-logo" />
          </div>
          <h3 style={headline}>Welcome to Vishwakarma Travels</h3>
          <p style={subtitle}>Safe rides, clean cars and quick booking support for every journey.</p>

          <div style={trustGrid}>
            <span style={trustItem}>🛡️ Safe & Secure</span>
            <span style={trustItem}>🚕 Clean Cars</span>
            <span style={trustItem}>⏱️ On-Time Service</span>
          </div>

          <Link href="/" style={continueBtn} className="vt-cta">
            Continue Booking →
          </Link>
          <Link href="/admin" style={adminBtn}>Admin Login</Link>
        </div>

        <p style={footerText}>Jamshedpur • Jharkhand • Vishwakarma Travels</p>
      </section>
    </main>
  );
}

const page: CSSProperties = {
  minHeight: "100vh",
  margin: 0,
  overflow: "hidden",
  fontFamily: "Arial, sans-serif",
  background: "#061126",
};

const scene: CSSProperties = {
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  padding: "18px 14px 12px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  background: "linear-gradient(180deg, #071b44 0%, #0b2d6b 36%, #07152d 68%, #030815 100%)",
};

const skyGlow: CSSProperties = {
  position: "absolute",
  inset: "-20% -30% auto -30%",
  height: "55%",
  background: "radial-gradient(circle at 22% 20%, rgba(255,202,138,.65), transparent 28%), radial-gradient(circle at 78% 12%, rgba(85,150,255,.36), transparent 32%)",
  pointerEvents: "none",
};

const sun: CSSProperties = {
  position: "absolute",
  right: 44,
  top: 86,
  width: 70,
  height: 70,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #fed7aa, #fb923c)",
  boxShadow: "0 0 70px rgba(251,146,60,.55)",
  opacity: .85,
};

const topBar: CSSProperties = {
  position: "relative",
  zIndex: 5,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const brandPill: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  padding: "8px 12px 8px 8px",
  borderRadius: 22,
  background: "rgba(255,255,255,.12)",
  border: "1px solid rgba(255,255,255,.16)",
  backdropFilter: "blur(10px)",
};

const smallLogo: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 14,
  objectFit: "contain",
  background: "white",
  padding: 4,
  boxSizing: "border-box",
};

const brandMain: CSSProperties = { margin: 0, color: "#fb923c", fontSize: 16, fontWeight: 900, letterSpacing: .6, lineHeight: 1 };
const brandSub: CSSProperties = { margin: 0, color: "white", fontSize: 12, fontWeight: 900, letterSpacing: 3 };

const adminTop: CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontWeight: 900,
  fontSize: 13,
  padding: "10px 14px",
  borderRadius: 999,
  background: "rgba(255,255,255,.13)",
  border: "1px solid rgba(255,255,255,.18)",
};

const messagePanel: CSSProperties = {
  position: "relative",
  zIndex: 4,
  marginTop: 24,
  textAlign: "center",
};

const overline: CSSProperties = { margin: 0, color: "#fed7aa", fontSize: 12, fontWeight: 900, letterSpacing: .8 };
const heroText: CSSProperties = { margin: "7px 0 2px", fontSize: "clamp(38px, 11vw, 58px)", lineHeight: .95, fontWeight: 1000, textShadow: "0 14px 32px rgba(0,0,0,.38)" };
const heroSub: CSSProperties = { margin: 0, color: "rgba(255,255,255,.9)", fontSize: 17, fontWeight: 800 };

const cityLayer: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: "38%",
  width: "200%",
  height: 118,
  display: "flex",
  alignItems: "flex-end",
  gap: 10,
  opacity: .34,
  zIndex: 1,
};

const buildingBase: CSSProperties = { display: "block", width: 42, borderRadius: "8px 8px 0 0", background: "linear-gradient(180deg, rgba(255,255,255,.42), rgba(255,255,255,.08))", border: "1px solid rgba(255,255,255,.12)" };
const buildingTall: CSSProperties = { ...buildingBase, height: 102 };
const buildingMid: CSSProperties = { ...buildingBase, height: 74 };
const buildingSmall: CSSProperties = { ...buildingBase, height: 52 };
const buildingWide: CSSProperties = { ...buildingBase, width: 72, height: 64 };

const forestLayer: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: "32%",
  width: "200%",
  height: 94,
  display: "flex",
  alignItems: "flex-end",
  gap: 12,
  zIndex: 2,
  opacity: .7,
};

const tree: CSSProperties = {
  width: 0,
  borderLeft: "16px solid transparent",
  borderRight: "16px solid transparent",
  borderBottom: "58px solid rgba(17,94,48,.88)",
  filter: "drop-shadow(0 10px 10px rgba(0,0,0,.22))",
};

const roadWrap: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: "24%",
  height: 118,
  zIndex: 3,
};

const road: CSSProperties = {
  position: "absolute",
  inset: "34px -40px 0",
  transform: "skewY(-3deg)",
  background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
  borderTop: "5px solid rgba(255,255,255,.24)",
  boxShadow: "0 -18px 40px rgba(0,0,0,.24)",
  backgroundImage: "linear-gradient(90deg, transparent 0 52px, rgba(255,255,255,.72) 52px 94px, transparent 94px 150px)",
  backgroundSize: "220px 5px",
  backgroundRepeat: "repeat-x",
  backgroundPosition: "0 51px",
};

const carWrap: CSSProperties = { position: "absolute", bottom: 40, left: 0, width: 170, height: 72 };
const carBody: CSSProperties = { position: "relative", width: 166, height: 54, marginTop: 16, borderRadius: "28px 38px 22px 18px", background: "linear-gradient(135deg, #f97316, #ffbd59)", boxShadow: "0 18px 28px rgba(0,0,0,.35)" };
const carTop: CSSProperties = { position: "absolute", left: 38, top: -24, width: 72, height: 34, borderRadius: "28px 30px 0 0", background: "linear-gradient(135deg, #fef3c7, #fdba74)" };
const carWindow: CSSProperties = { position: "absolute", left: 53, top: -16, width: 42, height: 19, borderRadius: "16px 18px 3px 3px", background: "linear-gradient(135deg, #dbeafe, #60a5fa)", border: "2px solid rgba(255,255,255,.7)" };
const headLight: CSSProperties = { position: "absolute", right: -8, top: 21, width: 18, height: 9, borderRadius: 999, background: "#fef9c3", boxShadow: "18px 0 32px #fef9c3" };
const tailLight: CSSProperties = { position: "absolute", left: 4, top: 23, width: 10, height: 12, borderRadius: 999, background: "#ef4444" };
const wheelLeft: CSSProperties = { position: "absolute", left: 28, bottom: -13, width: 29, height: 29, borderRadius: "50%", background: "radial-gradient(circle, #cbd5e1 0 23%, #0f172a 24% 100%)", border: "4px solid #020617" };
const wheelRight: CSSProperties = { ...wheelLeft, left: 112 };

const bookingCard: CSSProperties = {
  position: "relative",
  zIndex: 6,
  marginTop: "auto",
  width: "100%",
  maxWidth: 430,
  alignSelf: "center",
  boxSizing: "border-box",
  textAlign: "center",
  padding: "18px 16px 16px",
  borderRadius: 28,
  background: "linear-gradient(180deg, rgba(255,255,255,.96), rgba(241,245,249,.92))",
  border: "1px solid rgba(255,255,255,.74)",
  boxShadow: "0 26px 80px rgba(0,0,0,.42)",
  backdropFilter: "blur(16px)",
};

const logoWrap: CSSProperties = { display: "grid", placeItems: "center", marginBottom: 6 };
const logo: CSSProperties = { width: 82, height: 82, objectFit: "contain", borderRadius: 22, background: "white", padding: 8, boxSizing: "border-box", boxShadow: "0 12px 28px rgba(11,45,107,.18)" };
const headline: CSSProperties = { margin: "6px 0 7px", color: "#0b2d6b", fontSize: "clamp(26px, 7.2vw, 34px)", lineHeight: 1.05, fontWeight: 1000 };
const subtitle: CSSProperties = { margin: "0 auto 12px", maxWidth: 330, color: "#475569", fontSize: 14, lineHeight: 1.45, fontWeight: 700 };
const trustGrid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7, margin: "12px 0 14px" };
const trustItem: CSSProperties = { minHeight: 48, display: "grid", placeItems: "center", padding: "8px 4px", borderRadius: 15, background: "#ffffff", color: "#0f172a", fontWeight: 900, fontSize: 12, border: "1px solid #e2e8f0", boxShadow: "0 8px 18px rgba(15,23,42,.06)" };

const continueBtn: CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "15px 16px",
  borderRadius: 18,
  background: "linear-gradient(135deg, #f97316, #fb923c)",
  color: "white",
  textDecoration: "none",
  fontWeight: 1000,
  fontSize: 17,
};

const adminBtn: CSSProperties = { display: "inline-block", marginTop: 12, color: "#0b2d6b", textDecoration: "none", fontWeight: 900, fontSize: 13 };
const footerText: CSSProperties = { position: "relative", zIndex: 6, textAlign: "center", color: "rgba(255,255,255,.78)", fontWeight: 800, fontSize: 12, margin: "10px 0 0" };
