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
        <div style={spacer} />

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

const coverOverlay: CSSProperties = { position: "fixed", inset: 0, zIndex: 999999, minHeight: "100svh", overflowY: "auto", padding: "10px", backgroundImage: "url('/bg-travel.jpg')", backgroundSize: "cover", backgroundPosition: "center top", backgroundRepeat: "no-repeat", fontFamily: "Arial, sans-serif", color: "#061a3d" };
const shade: CSSProperties = { position: "fixed", inset: 0, background: "linear-gradient(180deg,rgba(255,255,255,.02),rgba(255,255,255,.01) 45%,rgba(3,7,18,.12))", pointerEvents: "none" };
const contentWrap: CSSProperties = { position: "relative", zIndex: 1, minHeight: "calc(100svh - 20px)", display: "grid", alignContent: "start" };
const adminLink: CSSProperties = { position: "fixed", top: 12, right: 12, zIndex: 3, background: "rgba(255,255,255,.92)", color: "#0f172a", textDecoration: "none", border: "1px solid rgba(255,255,255,.9)", borderRadius: 999, padding: "8px 12px", fontSize: 13, fontWeight: 950, boxShadow: "0 10px 25px rgba(15,23,42,.15)" };
const spacer: CSSProperties = { height: "clamp(245px,39svh,430px)" };
const coverCard: CSSProperties = { width: "min(420px,100%)", margin: "0 auto 12px", background: "rgba(255,255,255,.97)", borderRadius: 20, padding: "12px", boxShadow: "0 18px 50px rgba(0,0,0,.22)", border: "1px solid rgba(255,255,255,.82)", backdropFilter: "blur(8px)" };
const modeRow: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 9 };
const modeBtn: CSSProperties = { border: "1px solid #cbd5e1", background: "white", color: "#0f172a", padding: "9px 6px", borderRadius: 999, fontWeight: 950, cursor: "pointer", fontSize: 14 };
const activeModeBtn: CSSProperties = { ...modeBtn, background: "#eff6ff", color: "#0b2d6b", border: "1px solid #93c5fd" };
const divider: CSSProperties = { height: 1, background: "#e5e7eb", marginBottom: 8 };
const warningText: CSSProperties = { textAlign: "center", color: "#dc2626", fontSize: 10.5, lineHeight: 1.25, margin: "0 0 9px", fontWeight: 950 };
const formBox: CSSProperties = { display: "grid", gap: 8 };
const inputStyle: CSSProperties = { width: "100%", padding: "11px 13px", borderRadius: 12, border: "1px solid #cbd5e1", fontSize: 15, outline: "none", color: "#0f172a", background: "white" };
const continueBtn: CSSProperties = { width: "100%", marginTop: 10, border: 0, borderRadius: 13, background: "linear-gradient(135deg,#063b9a,#001e70)", color: "white", padding: "12px 14px", fontSize: 17, fontWeight: 950, cursor: "pointer", boxShadow: "0 8px 20px rgba(6,59,154,.25)", display: "flex", justifyContent: "center", gap: 45 };
const safeText: CSSProperties = { textAlign: "center", color: "#6b7280", margin: "8px 0 0", fontWeight: 800, fontSize: 13 };
