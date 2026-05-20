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
    const cleanProfile = { name: profile.name.trim(), mobile: profile.mobile.trim(), address: profile.address.trim() };
    try {
      const oldSaved = localStorage.getItem(STORAGE_KEY);
      const oldProfile = oldSaved ? JSON.parse(oldSaved) : {};
      const finalProfile = { ...oldProfile, ...cleanProfile, address: mode === "existing" ? oldProfile.address || cleanProfile.address : cleanProfile.address };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProfile));
      onContinue(finalProfile);
    } catch {
      onContinue(cleanProfile);
    }
  };

  return (
    <section style={coverOverlay}>
      <div style={shade} />
      <a href="/admin" style={adminLink}>Admin Login</a>

      <div style={contentWrap}>
        <div style={topArea}>
          <div style={logoRow}>
            <div style={brandMark}>V</div>
            <div>
              <h1 style={brandTitle}>VISHWAKARMA</h1>
              <p style={brandSub}>TRAVELS</p>
            </div>
          </div>
          <p style={tagline}>Travels Made Easy</p>
          <h2 style={welcome}>Welcome to<br />Vishwakarma Travels</h2>
          <div style={linePin}><span style={smallLine}></span><b>●</b><span style={smallLine}></span></div>
          <p style={registerText}>Register to continue</p>
        </div>

        <div style={coverCard}>
          <div style={modeRow}>
            <button type="button" onClick={() => setMode("new")} style={mode === "new" ? activeModeBtn : modeBtn}>New User</button>
            <button type="button" onClick={() => setMode("existing")} style={mode === "existing" ? activeModeBtn : modeBtn}>Existing User</button>
          </div>

          <div style={divider} />
          <p style={warningText}>Please Enter Your Correct Mobile No & Complete Address<br />This Will Using For Your Pickup Location</p>

          <div style={formBox}>
            <input style={inputStyle} placeholder="Your Name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
            <input style={inputStyle} placeholder="Mobile Number" value={profile.mobile} inputMode="tel" onChange={(e) => setProfile((p) => ({ ...p, mobile: e.target.value }))} />
            {mode === "new" && <input style={inputStyle} placeholder="Address" value={profile.address} onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))} />}
          </div>

          <button type="button" onClick={saveAndContinue} style={continueBtn}>Continue <span>→</span></button>
          <p style={safeText}>Your information is safe with us</p>
        </div>
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
  padding: "clamp(10px,2.5vw,24px)",
  backgroundImage: "url('/bg-travel.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  fontFamily: "Arial, sans-serif",
  color: "#061a3d",
};
const shade: CSSProperties = { position: "fixed", inset: 0, background: "linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.02) 44%,rgba(3,7,18,.22))", pointerEvents: "none" };
const contentWrap: CSSProperties = { position: "relative", zIndex: 1, minHeight: "calc(100svh - 20px)", display: "grid", alignContent: "start" };
const adminLink: CSSProperties = { position: "fixed", top: 12, right: 12, zIndex: 3, background: "rgba(255,255,255,.92)", color: "#0f172a", textDecoration: "none", border: "1px solid rgba(255,255,255,.9)", borderRadius: 999, padding: "9px 13px", fontSize: "clamp(12px,2.6vw,14px)", fontWeight: 950, boxShadow: "0 10px 25px rgba(15,23,42,.15)" };
const topArea: CSSProperties = { width: "min(760px,100%)", margin: "clamp(14px,5svh,44px) auto clamp(8px,2svh,14px)", textAlign: "center" };
const logoRow: CSSProperties = { display: "flex", justifyContent: "center", alignItems: "center", gap: "clamp(8px,2vw,13px)" };
const brandMark: CSSProperties = { width: "clamp(42px,11vw,68px)", height: "clamp(42px,11vw,68px)", borderRadius: "17px 7px 17px 7px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,#ff6b00,#ff8a1f)", color: "white", fontSize: "clamp(27px,7vw,42px)", fontWeight: 950, transform: "skew(-10deg)", boxShadow: "0 10px 24px rgba(249,115,22,.28)" };
const brandTitle: CSSProperties = { margin: 0, color: "#0b2d6b", fontSize: "clamp(25px,8vw,52px)", lineHeight: .95, fontWeight: 950, letterSpacing: "clamp(.4px,.25vw,1.3px)" };
const brandSub: CSSProperties = { margin: "2px 0 0", color: "#f97316", fontSize: "clamp(18px,5.3vw,32px)", fontWeight: 950, letterSpacing: "clamp(4px,1.2vw,8px)" };
const tagline: CSSProperties = { margin: "clamp(7px,1.5vw,12px) 0 0", color: "#0b2d6b", fontWeight: 800, fontSize: "clamp(16px,4.2vw,25px)" };
const welcome: CSSProperties = { margin: "clamp(13px,3svh,28px) 0 4px", color: "#0b2d6b", fontSize: "clamp(29px,8.2vw,56px)", lineHeight: 1.05, fontWeight: 950, textShadow: "0 1px 8px rgba(255,255,255,.35)" };
const linePin: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#f97316", fontSize: 18 };
const smallLine: CSSProperties = { display: "block", width: "clamp(52px,17vw,105px)", height: 3, background: "#f97316", borderRadius: 999 };
const registerText: CSSProperties = { margin: "5px 0 clamp(8px,2svh,14px)", color: "#0f172a", fontSize: "clamp(18px,4.5vw,25px)", fontWeight: 800 };
const coverCard: CSSProperties = { width: "min(620px,100%)", margin: "0 auto", background: "rgba(255,255,255,.96)", borderRadius: "clamp(18px,5vw,28px)", padding: "clamp(14px,3.8vw,22px)", boxShadow: "0 24px 70px rgba(0,0,0,.24)", border: "1px solid rgba(255,255,255,.82)", backdropFilter: "blur(10px)" };
const modeRow: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(8px,2.6vw,14px)", marginBottom: 12 };
const modeBtn: CSSProperties = { border: "1px solid #cbd5e1", background: "white", color: "#0f172a", padding: "clamp(10px,3vw,14px) 8px", borderRadius: 999, fontWeight: 950, cursor: "pointer", fontSize: "clamp(14px,3.8vw,17px)" };
const activeModeBtn: CSSProperties = { ...modeBtn, background: "#eff6ff", color: "#0b2d6b", border: "1px solid #93c5fd" };
const divider: CSSProperties = { height: 1, background: "#e5e7eb", marginBottom: 11 };
const warningText: CSSProperties = { textAlign: "center", color: "#dc2626", fontSize: "clamp(10px,2.8vw,12px)", lineHeight: 1.35, margin: "0 0 13px", fontWeight: 950 };
const formBox: CSSProperties = { display: "grid", gap: "clamp(9px,2.4vw,12px)" };
const inputStyle: CSSProperties = { width: "100%", padding: "clamp(13px,3.5vw,16px) clamp(14px,4vw,18px)", borderRadius: 15, border: "1px solid #cbd5e1", fontSize: "clamp(16px,4.2vw,18px)", outline: "none", color: "#0f172a", background: "white" };
const continueBtn: CSSProperties = { width: "100%", marginTop: "clamp(12px,3vw,16px)", border: 0, borderRadius: 14, background: "linear-gradient(135deg,#063b9a,#001e70)", color: "white", padding: "clamp(13px,3.5vw,15px) 16px", fontSize: "clamp(17px,4.8vw,20px)", fontWeight: 950, cursor: "pointer", boxShadow: "0 10px 24px rgba(6,59,154,.28)", display: "flex", justifyContent: "center", gap: "clamp(40px,14vw,70px)" };
const safeText: CSSProperties = { textAlign: "center", color: "#6b7280", margin: "12px 0 0", fontWeight: 800, fontSize: "clamp(13px,3.4vw,15px)" };
