"use client";

import { useEffect, useState, type CSSProperties } from "react";

type CustomerProfile = { name: string; mobile: string; address: string };
type Props = { onContinue: (profile: CustomerProfile) => void };

const STORAGE_KEY = "vishwakarma_customer_profile";

export default function CustomerCover({ onContinue }: Props) {
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [profile, setProfile] = useState<CustomerProfile>({ name: "", mobile: "", address: "" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      setProfile({ name: parsed.name || "", mobile: parsed.mobile || "", address: parsed.address || "" });
      setMode("existing");
    } catch {}
  }, []);

  const saveAndContinue = () => {
    const cleanProfile = {
      name: profile.name.trim(),
      mobile: profile.mobile.trim(),
      address: profile.address.trim(),
    };

    try {
      const oldSaved = localStorage.getItem(STORAGE_KEY);
      const oldProfile = oldSaved ? JSON.parse(oldSaved) : {};
      const finalProfile = {
        ...oldProfile,
        ...cleanProfile,
        address: mode === "existing" ? oldProfile.address || cleanProfile.address : cleanProfile.address,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProfile));
      onContinue(finalProfile);
    } catch {
      onContinue(cleanProfile);
    }
  };

  return (
    <section style={coverOverlay}>
      <div style={shade} />
      <a href="/admin" style={adminLink}>♙ Admin Login</a>

      <div style={layout}>
        <header style={heroBlock}>
          <div style={logoLine}>
            <div style={vtLogo}>V</div>
            <div style={logoTextBox}>
              <h1 style={brandName}>VISHWAKARMA</h1>
              <div style={travelLine}><span />TRAVELS<span /></div>
            </div>
          </div>

          <p style={tagline}>Travels Made Easy</p>
          <div style={miniDivider}><span /><b /> <span /></div>

          <h2 style={welcome}>Welcome to<br />Vishwakarma Travels</h2>
          <div style={pinDivider}><span />●<span /></div>
          <p style={registerText}>Register to continue</p>
        </header>

        <div style={coverCard}>
          <div style={modeRow}>
            <button type="button" onClick={() => setMode("new")} style={mode === "new" ? activeModeBtn : modeBtn}>♟ New User</button>
            <button type="button" onClick={() => setMode("existing")} style={mode === "existing" ? activeModeBtn : modeBtn}>♙ Existing User</button>
          </div>

          <div style={divider} />
          <p style={warningText}>Please Enter Your Correct Mobile No & Complete Address<br />This Will Using For Your Pickup Location</p>

          <div style={formBox}>
            <label style={inputWrap}><span>♙</span><input style={inputStyle} placeholder="Your Name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} /></label>
            <label style={inputWrap}><span>☎</span><input style={inputStyle} placeholder="Mobile Number" value={profile.mobile} inputMode="tel" onChange={(e) => setProfile((p) => ({ ...p, mobile: e.target.value }))} /></label>
            {mode === "new" && <label style={inputWrap}><span>⌖</span><input style={inputStyle} placeholder="Address" value={profile.address} onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))} /></label>}
          </div>

          <button type="button" onClick={saveAndContinue} style={continueBtn}>Continue <span>→</span></button>
          <p style={safeText}>▣ Your information is safe with us</p>
        </div>

        <div style={featureBar}>
          <div style={featureItem}><span style={featureIcon}>☑</span><b>Safe & Secure<br />Travel</b></div>
          <div style={featureItem}><span style={featureIcon}>▰</span><b>Comfort<br />Assured</b></div>
          <div style={featureItem}><span style={featureIcon}>◷</span><b>On-Time<br />Every Time</b></div>
          <div style={featureItem}><span style={featureIcon}>₹</span><b>Best Prices<br />Guaranteed</b></div>
        </div>

        <div style={locationPill}>📍 Jugsalai, Jamshedpur, Jharkhand - 831006</div>
      </div>
    </section>
  );
}

const coverOverlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 999999,
  minHeight: "100svh",
  overflowY: "auto",
  backgroundImage: "url('/bg-travel.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  fontFamily: "Arial, Helvetica, sans-serif",
  color: "#071b3f",
};

const shade: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "radial-gradient(circle at 50% 14%, rgba(255,255,255,.9), rgba(255,255,255,.48) 26%, rgba(255,255,255,.04) 58%), linear-gradient(180deg,rgba(255,255,255,.12),rgba(0,0,0,.08) 70%,rgba(0,0,0,.28))",
  pointerEvents: "none",
};

const layout: CSSProperties = {
  position: "relative",
  zIndex: 1,
  width: "min(980px,100%)",
  minHeight: "100svh",
  margin: "0 auto",
  padding: "clamp(18px,3svh,34px) clamp(14px,3vw,26px) clamp(18px,3svh,30px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const adminLink: CSSProperties = {
  position: "fixed",
  top: "clamp(12px,2vw,22px)",
  right: "clamp(12px,2vw,26px)",
  zIndex: 3,
  background: "#08296b",
  color: "white",
  textDecoration: "none",
  borderRadius: 999,
  padding: "clamp(8px,1.6vw,12px) clamp(12px,2vw,18px)",
  fontSize: "clamp(12px,2.4vw,16px)",
  fontWeight: 900,
  boxShadow: "0 10px 24px rgba(0,0,0,.22)",
};

const heroBlock: CSSProperties = {
  textAlign: "center",
  width: "100%",
  marginTop: "clamp(34px,5svh,58px)",
};

const logoLine: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "clamp(10px,2vw,24px)",
};

const vtLogo: CSSProperties = {
  width: "clamp(62px,13vw,108px)",
  height: "clamp(62px,13vw,108px)",
  borderRadius: "18px 6px 18px 6px",
  display: "grid",
  placeItems: "center",
  background: "linear-gradient(135deg,#ff7a10,#ff8a00)",
  color: "white",
  fontSize: "clamp(42px,9vw,74px)",
  fontWeight: 950,
  transform: "skew(-10deg)",
  boxShadow: "0 14px 30px rgba(249,115,22,.25)",
};

const logoTextBox: CSSProperties = { textAlign: "left" };
const brandName: CSSProperties = { margin: 0, color: "#08296b", fontSize: "clamp(31px,7.4vw,68px)", lineHeight: .95, fontWeight: 950, letterSpacing: "clamp(1px,.35vw,3px)" };
const travelLine: CSSProperties = { marginTop: 4, color: "#f97316", fontSize: "clamp(21px,5vw,42px)", lineHeight: 1, fontWeight: 950, letterSpacing: "clamp(5px,1.4vw,13px)", display: "flex", alignItems: "center", gap: "clamp(8px,2vw,18px)", justifyContent: "center" };
const tagline: CSSProperties = { margin: "clamp(8px,1.4svh,12px) 0 0", color: "#08296b", fontSize: "clamp(18px,3.8vw,28px)", fontWeight: 800 };
const miniDivider: CSSProperties = { margin: "8px auto 0", color: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 };
const welcome: CSSProperties = { margin: "clamp(18px,3.2svh,34px) 0 4px", color: "#08296b", fontSize: "clamp(31px,7.5vw,62px)", lineHeight: 1.08, fontWeight: 950, textShadow: "0 2px 12px rgba(255,255,255,.34)" };
const pinDivider: CSSProperties = { display: "flex", justifyContent: "center", alignItems: "center", gap: "clamp(10px,2vw,18px)", color: "#08296b", fontSize: "clamp(18px,4vw,30px)", marginTop: 4 };
const registerText: CSSProperties = { margin: "clamp(5px,1svh,8px) 0 clamp(10px,1.8svh,18px)", fontSize: "clamp(18px,3.8vw,27px)", fontWeight: 800, color: "#071b3f" };

const coverCard: CSSProperties = {
  width: "min(620px,92vw)",
  background: "rgba(255,255,255,.96)",
  borderRadius: "clamp(18px,3.2vw,28px)",
  padding: "clamp(16px,3vw,28px)",
  boxShadow: "0 24px 72px rgba(0,0,0,.24)",
  border: "1px solid rgba(255,255,255,.84)",
  backdropFilter: "blur(8px)",
};

const modeRow: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(9px,2.4vw,22px)", marginBottom: "clamp(11px,2vw,18px)" };
const modeBtn: CSSProperties = { border: "1px solid #d7dde8", background: "white", color: "#101827", padding: "clamp(11px,2.4vw,17px) 8px", borderRadius: 999, fontWeight: 950, cursor: "pointer", fontSize: "clamp(14px,3.2vw,20px)", boxShadow: "0 7px 18px rgba(15,23,42,.04)" };
const activeModeBtn: CSSProperties = { ...modeBtn, background: "#eef6ff", color: "#0b55c7", border: "1px solid #a9caff" };
const divider: CSSProperties = { height: 1, background: "#e5e7eb", marginBottom: "clamp(11px,1.8vw,18px)" };
const warningText: CSSProperties = { textAlign: "center", color: "#dc2626", fontSize: "clamp(11px,2.6vw,15px)", lineHeight: 1.32, margin: "0 0 clamp(12px,2vw,20px)", fontWeight: 950 };
const formBox: CSSProperties = { display: "grid", gap: "clamp(10px,2vw,17px)" };
const inputWrap: CSSProperties = { display: "grid", gridTemplateColumns: "clamp(34px,7vw,48px) 1fr", alignItems: "center", borderRadius: "clamp(13px,2vw,18px)", border: "1px solid #d2dae8", background: "white", color: "#08296b", padding: "0 clamp(10px,2vw,16px)", fontSize: "clamp(20px,4vw,27px)" };
const inputStyle: CSSProperties = { width: "100%", padding: "clamp(13px,2.8vw,20px) 0", border: 0, fontSize: "clamp(15px,3.3vw,21px)", outline: "none", color: "#0f172a", background: "transparent" };
const continueBtn: CSSProperties = { width: "100%", marginTop: "clamp(13px,2.4vw,22px)", border: 0, borderRadius: "clamp(13px,2vw,18px)", background: "linear-gradient(135deg,#063b9a,#001e70)", color: "white", padding: "clamp(13px,2.7vw,19px) 16px", fontSize: "clamp(18px,3.8vw,25px)", fontWeight: 950, cursor: "pointer", boxShadow: "0 10px 28px rgba(6,59,154,.3)", display: "flex", justifyContent: "center", gap: "clamp(45px,14vw,95px)" };
const safeText: CSSProperties = { textAlign: "center", color: "#6b7280", margin: "clamp(12px,2vw,18px) 0 0", fontWeight: 800, fontSize: "clamp(13px,2.8vw,17px)" };

const featureBar: CSSProperties = { width: "min(900px,92vw)", margin: "clamp(18px,3svh,28px) auto 12px", background: "rgba(255,255,255,.95)", borderRadius: "clamp(18px,3vw,30px)", padding: "clamp(9px,2vw,15px)", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, boxShadow: "0 18px 42px rgba(0,0,0,.24)" };
const featureItem: CSSProperties = { display: "grid", justifyItems: "center", alignItems: "center", gap: 5, color: "#08296b", textAlign: "center", fontSize: "clamp(10px,2.3vw,16px)", lineHeight: 1.25, minWidth: 0 };
const featureIcon: CSSProperties = { color: "#f97316", fontSize: "clamp(22px,5vw,42px)", lineHeight: 1 };
const locationPill: CSSProperties = { width: "fit-content", maxWidth: "92vw", margin: "0 auto", background: "#08296b", color: "white", borderRadius: 999, padding: "clamp(9px,2vw,14px) clamp(16px,4vw,28px)", fontSize: "clamp(13px,3vw,22px)", fontWeight: 800, boxShadow: "0 12px 25px rgba(0,0,0,.2)" };
