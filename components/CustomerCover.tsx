"use client";

import { useEffect, useState, type CSSProperties } from "react";

type CustomerProfile = {
  name: string;
  mobile: string;
  address: string;
};

type Props = {
  onContinue: (profile: CustomerProfile) => void;
};

const STORAGE_KEY = "vishwakarma_customer_profile";

export default function CustomerCover({ onContinue }: Props) {
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [profile, setProfile] = useState<CustomerProfile>({
    name: "",
    mobile: "",
    address: "",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      setProfile({
        name: parsed.name || "",
        mobile: parsed.mobile || "",
        address: parsed.address || "",
      });
      setMode("existing");
    } catch {
      // Ignore corrupted saved data and show new user form.
    }
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

  const showAddress = mode === "new";

  return (
    <section style={coverOverlay}>
      <a href="/admin" style={adminLink}>Admin Login</a>

      <div style={coverCard}>
        <div style={brandWrap}>
          <div style={brandMark}>V</div>
          <div>
            <h1 style={brandTitle}>VISHWAKARMA</h1>
            <p style={brandSub}>TRAVELS</p>
          </div>
        </div>

        <h2 style={mainTitle}>Travels Made Easy</h2>
        <p style={warningText}>Please Enter Your Correct Mobile No & Complete Address This Will Using For Your Pickup Location</p>

        <div style={modeRow}>
          <button type="button" onClick={() => setMode("new")} style={mode === "new" ? activeModeBtn : modeBtn}>New User</button>
          <button type="button" onClick={() => setMode("existing")} style={mode === "existing" ? activeModeBtn : modeBtn}>Existing User</button>
        </div>

        <div style={formBox}>
          <input
            style={inputStyle}
            placeholder="Name"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
          />
          <input
            style={inputStyle}
            placeholder="Mobile No"
            value={profile.mobile}
            inputMode="tel"
            onChange={(e) => setProfile((p) => ({ ...p, mobile: e.target.value }))}
          />

          {showAddress && (
            <textarea
              style={addressStyle}
              placeholder="Address"
              value={profile.address}
              onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
            />
          )}
        </div>

        <button type="button" onClick={saveAndContinue} style={continueBtn}>Continue Booking</button>
      </div>
    </section>
  );
}

const coverOverlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 999999,
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 18,
  background: "linear-gradient(135deg,#071a3d 0%,#0b2d6b 42%,#f97316 130%)",
  fontFamily: "Arial, sans-serif",
};

const adminLink: CSSProperties = {
  position: "fixed",
  top: 16,
  right: 16,
  zIndex: 2,
  background: "rgba(255,255,255,.16)",
  color: "white",
  textDecoration: "none",
  border: "1px solid rgba(255,255,255,.32)",
  borderRadius: 999,
  padding: "9px 13px",
  fontSize: 13,
  fontWeight: 900,
  backdropFilter: "blur(8px)",
};

const coverCard: CSSProperties = {
  width: "min(440px,100%)",
  background: "rgba(255,255,255,.96)",
  borderRadius: 28,
  padding: 22,
  boxShadow: "0 28px 80px rgba(0,0,0,.28)",
  border: "1px solid rgba(255,255,255,.7)",
};

const brandWrap: CSSProperties = { display: "flex", justifyContent: "center", alignItems: "center", gap: 10 };
const brandMark: CSSProperties = { width: 54, height: 54, borderRadius: "16px 7px 16px 7px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,#ff6b00,#ff8a1f)", color: "white", fontSize: 34, fontWeight: 950, transform: "skew(-10deg)", boxShadow: "0 10px 24px rgba(249,115,22,.28)" };
const brandTitle: CSSProperties = { margin: 0, color: "#f97316", fontSize: 28, lineHeight: .95, fontWeight: 950 };
const brandSub: CSSProperties = { margin: 0, color: "#0b2d6b", fontSize: 22, fontWeight: 950, lineHeight: 1 };
const mainTitle: CSSProperties = { textAlign: "center", color: "#0b2d6b", fontSize: 31, margin: "20px 0 7px", fontWeight: 950 };
const warningText: CSSProperties = { textAlign: "center", color: "#dc2626", fontSize: 11, lineHeight: 1.35, margin: "0 0 14px", fontWeight: 950 };
const modeRow: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 };
const modeBtn: CSSProperties = { border: "1px solid #fed7aa", background: "#fff7ed", color: "#c2410c", padding: "10px 8px", borderRadius: 999, fontWeight: 950, cursor: "pointer" };
const activeModeBtn: CSSProperties = { ...modeBtn, background: "#f97316", color: "white", border: "1px solid #f97316" };
const formBox: CSSProperties = { display: "grid", gap: 11 };
const inputStyle: CSSProperties = { width: "100%", padding: "14px 15px", borderRadius: 15, border: "1px solid #cbd5e1", fontSize: 16, outline: "none", color: "#0f172a", background: "white" };
const addressStyle: CSSProperties = { ...inputStyle, minHeight: 86, resize: "vertical" };
const continueBtn: CSSProperties = { width: "100%", marginTop: 16, border: 0, borderRadius: 16, background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", padding: "14px 16px", fontSize: 17, fontWeight: 950, cursor: "pointer", boxShadow: "0 10px 24px rgba(249,115,22,.26)" };
