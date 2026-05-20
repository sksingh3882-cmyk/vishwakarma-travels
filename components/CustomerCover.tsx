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
      <a href="/admin" style={adminLink}>Admin Login</a>

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
        <div style={linePin}><span></span><b>●</b><span></span></div>
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

      <div style={featureBar}>
        <div style={featureItem}><b>Safe & Secure<br />Travel</b></div>
        <div style={featureItem}><b>Comfort<br />Assured</b></div>
        <div style={featureItem}><b>On-Time<br />Every Time</b></div>
        <div style={featureItem}><b>Best Prices<br />Guaranteed</b></div>
      </div>

      <div style={locationPill}>Jugsalai, Jamshedpur, Jharkhand - 831006</div>
    </section>
  );
}

const coverOverlay: CSSProperties = { position: "fixed", inset: 0, zIndex: 999999, minHeight: "100vh", overflowY: "auto", padding: "22px 18px 26px", background: "radial-gradient(circle at 50% 10%, rgba(255,255,255,.95), rgba(255,255,255,.45) 24%, transparent 42%), linear-gradient(135deg,#a8d8ff 0%,#ffe3ae 36%,#0c2854 73%,#061936 100%)", fontFamily: "Arial, sans-serif", color: "#061a3d" };
const adminLink: CSSProperties = { position: "fixed", top: 14, right: 14, zIndex: 2, background: "rgba(255,255,255,.9)", color: "#0f172a", textDecoration: "none", border: "1px solid rgba(255,255,255,.9)", borderRadius: 999, padding: "10px 14px", fontSize: 13, fontWeight: 950, boxShadow: "0 10px 25px rgba(15,23,42,.15)" };
const topArea: CSSProperties = { maxWidth: 760, margin: "14px auto 10px", textAlign: "center" };
const logoRow: CSSProperties = { display: "flex", justifyContent: "center", alignItems: "center", gap: 12 };
const brandMark: CSSProperties = { width: 58, height: 58, borderRadius: "17px 7px 17px 7px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,#ff6b00,#ff8a1f)", color: "white", fontSize: 36, fontWeight: 950, transform: "skew(-10deg)", boxShadow: "0 10px 24px rgba(249,115,22,.28)" };
const brandTitle: CSSProperties = { margin: 0, color: "#0b2d6b", fontSize: "clamp(28px,7vw,48px)", lineHeight: .95, fontWeight: 950, letterSpacing: 1 };
const brandSub: CSSProperties = { margin: "2px 0 0", color: "#f97316", fontSize: "clamp(19px,4.8vw,30px)", fontWeight: 950, letterSpacing: 7 };
const tagline: CSSProperties = { margin: "10px 0 0", color: "#0b2d6b", fontWeight: 700, fontSize: "clamp(18px,4vw,26px)" };
const welcome: CSSProperties = { margin: "22px 0 6px", color: "#0b2d6b", fontSize: "clamp(30px,8vw,54px)", lineHeight: 1.08, fontWeight: 950 };
const linePin: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#f97316" };
const registerText: CSSProperties = { margin: "5px 0 14px", color: "#0f172a", fontSize: 22, fontWeight: 700 };
const coverCard: CSSProperties = { width: "min(680px,100%)", margin: "0 auto", background: "rgba(255,255,255,.96)", borderRadius: 26, padding: 20, boxShadow: "0 28px 80px rgba(0,0,0,.28)", border: "1px solid rgba(255,255,255,.8)" };
const modeRow: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 13 };
const modeBtn: CSSProperties = { border: "1px solid #cbd5e1", background: "white", color: "#0f172a", padding: "14px 8px", borderRadius: 999, fontWeight: 950, cursor: "pointer", fontSize: 16 };
const activeModeBtn: CSSProperties = { ...modeBtn, background: "#eff6ff", color: "#0b2d6b", border: "1px solid #93c5fd" };
const divider: CSSProperties = { height: 1, background: "#e5e7eb", marginBottom: 12 };
const warningText: CSSProperties = { textAlign: "center", color: "#dc2626", fontSize: 12, lineHeight: 1.35, margin: "0 0 15px", fontWeight: 950 };
const formBox: CSSProperties = { display: "grid", gap: 12 };
const inputStyle: CSSProperties = { width: "100%", padding: "16px 18px", borderRadius: 15, border: "1px solid #cbd5e1", fontSize: 18, outline: "none", color: "#0f172a", background: "white" };
const continueBtn: CSSProperties = { width: "100%", marginTop: 16, border: 0, borderRadius: 14, background: "linear-gradient(135deg,#063b9a,#001e70)", color: "white", padding: "15px 16px", fontSize: 20, fontWeight: 950, cursor: "pointer", boxShadow: "0 10px 24px rgba(6,59,154,.28)", display: "flex", justifyContent: "center", gap: 70 };
const safeText: CSSProperties = { textAlign: "center", color: "#6b7280", margin: "14px 0 0", fontWeight: 700 };
const featureBar: CSSProperties = { maxWidth: 900, margin: "20px auto 12px", background: "rgba(255,255,255,.92)", borderRadius: 28, padding: "13px 10px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, boxShadow: "0 18px 42px rgba(0,0,0,.22)" };
const featureItem: CSSProperties = { display: "grid", justifyItems: "center", alignItems: "center", color: "#0b2d6b", fontSize: 14, textAlign: "center", gap: 3 };
const locationPill: CSSProperties = { width: "fit-content", maxWidth: "96%", margin: "0 auto", background: "#0b2d6b", color: "white", borderRadius: 999, padding: "12px 18px", fontSize: 16, fontWeight: 800 };
