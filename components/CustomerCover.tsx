"use client";

import { useEffect, useState } from "react";

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
    <section className="vt-cover">
      <a href="/admin" className="vt-admin">Admin Login</a>

      <div className="vt-shell">
        
         <h1>

  <span className="vt-welcome-brand">Vishwakarma Travels</span>
</h1>
          <p className="vt-register">Register to continue</p>
        

        <div className="vt-card">
          <div className="vt-tabs">
            <button type="button" onClick={() => setMode("new")} className={mode === "new" ? "active" : ""}>New User</button>
            <button type="button" onClick={() => setMode("existing")} className={mode === "existing" ? "active" : ""}>Existing User</button>
          </div>

          <div className="vt-line" />
          <p className="vt-warning">Please Enter Your Correct Mobile No & Complete Address<br />This Will Using For Your Pickup Location</p>

          <div className="vt-form">
            <label><span>♙</span><input placeholder="Your Name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} /></label>
            <label><span>☎</span><input placeholder="Mobile Number" value={profile.mobile} inputMode="tel" onChange={(e) => setProfile((p) => ({ ...p, mobile: e.target.value }))} /></label>
            {mode === "new" && <label><span>⌖</span><input placeholder="Address" value={profile.address} onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))} /></label>}
          </div>

          <button type="button" onClick={saveAndContinue} className="vt-continue">Continue <span>→</span></button>
          <p className="vt-safe">Your information is safe with us</p>
        </div>

        <div className="vt-features">
          <div><strong>☑</strong><b>Safe & Secure<br />Travel</b></div>
          <div><strong>▰</strong><b>Comfort<br />Assured</b></div>
          <div><strong>◷</strong><b>On-Time<br />Every Time</b></div>
          <div><strong>₹</strong><b>Best Prices<br />Guaranteed</b></div>
        </div>

        <div className="vt-location">📍 Jugsalai, Jamshedpur, Jharkhand - 831006</div>
      </div>

      <style jsx>{`
        .vt-welcome{
  display:block;
  text-align:center;
}
       .vt-welcome-brand{
        font-family:"Montserrat",sans-serif;
        font-weight:900;
        letter-spacing:1px;
        color:#0b2d6b;
       }
      
        .vt-cover {
          position: fixed;
          inset: 0;
          z-index: 999999;
          width: 100vw;
          min-height: 100svh;
          overflow-x: hidden;
          overflow-y: auto;
          background:
            radial-gradient(circle at 50% 18%, rgba(255,255,255,.95) 0 12%, rgba(255,232,184,.78) 28%, rgba(43,95,147,.22) 48%, rgba(5,22,54,.62) 82%),
            linear-gradient(135deg, #77bff5 0%, #fff2cf 30%, #ffb45f 48%, #173d73 72%, #061936 100%);
          font-family: Arial, Helvetica, sans-serif;
          color: #071b3f;
        }
        .vt-cover::before {
          content: "";
          position: fixed;
          inset: auto -10vw 0 -10vw;
          height: 42svh;
          background: linear-gradient(115deg, transparent 0 28%, rgba(11,31,57,.82) 29% 56%, transparent 57%), linear-gradient(180deg, transparent, rgba(0,0,0,.22));
          pointer-events: none;
        }
        .vt-cover::after {
          content: "";
          position: fixed;
          right: -7vw;
          bottom: 21svh;
          width: min(46vw, 430px);
          aspect-ratio: 1.9 / 1;
          border-radius: 56% 0 0 18%;
          background: linear-gradient(135deg, rgba(255,255,255,.98), rgba(173,203,230,.92));
          box-shadow: inset -30px -22px 0 rgba(13,38,76,.28), 0 20px 45px rgba(0,0,0,.28);
          pointer-events: none;
        }
        .vt-admin {
          position: fixed;
          top: 14px;
          right: 14px;
          z-index: 3;
          background: #08296b;
          color: white;
          text-decoration: none;
          border-radius: 999px;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 900;
          box-shadow: 0 10px 24px rgba(0,0,0,.22);
        }
        .vt-shell {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 980px;
          min-height: 100svh;
          margin: 0 auto;
          padding: 44px 16px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
        }
        .vt-hero {
          width: 100%;
          text-align: center;
        }
        .vt-logoBlock {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 0 auto;
        }
        .vt-mark {
          width: clamp(54px, 11vw, 94px);
          height: clamp(54px, 11vw, 94px);
          display: grid;
          place-items: center;
          border-radius: 18px 6px 18px 6px;
          background: linear-gradient(135deg,#ff7a10,#ff8a00);
          color: white;
          font-size: clamp(35px, 8vw, 64px);
          font-weight: 950;
          transform: skew(-10deg);
          box-shadow: 0 14px 30px rgba(249,115,22,.25);
        }
        .vt-brandText { text-align: left; }
        .vt-brandName {
          color: #08296b;
          font-size: clamp(28px, 6.6vw, 60px);
          line-height: .95;
          font-weight: 950;
          letter-spacing: 1px;
        }
        .vt-travel {
          margin-top: 3px;
          color: #f97316;
          font-size: clamp(19px, 4.7vw, 38px);
          line-height: 1;
          font-weight: 950;
          letter-spacing: clamp(5px, 1.1vw, 12px);
          text-align: center;
        }
        .vt-tagline {
          margin-top: 7px;
          color: #08296b;
          font-size: clamp(15px, 3.4vw, 25px);
          font-weight: 750;
          text-align: center;
        }
        .vt-hero h1 {
          margin: 16px 0 4px;
          color: #08296b;
          font-size: clamp(28px, 6.7vw, 54px);
          line-height: 1.06;
          font-weight: 950;
          text-shadow: 0 2px 12px rgba(255,255,255,.38);
        }
        .vt-register {
          margin: 4px 0 12px;
          font-size: clamp(17px, 3.7vw, 25px);
          font-weight: 800;
          color: #071b3f;
        }
        .vt-card {
          width: min(560px, 88vw);
          margin: 0 auto;
          box-sizing: border-box;
          background: rgba(255,255,255,.97);
          border-radius: 24px;
          padding: clamp(14px, 3vw, 24px);
          box-shadow: 0 24px 72px rgba(0,0,0,.24);
          border: 1px solid rgba(255,255,255,.84);
          backdrop-filter: blur(8px);
        }
        .vt-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(9px, 2.4vw, 18px);
          margin-bottom: 12px;
        }
        .vt-tabs button {
          border: 1px solid #d7dde8;
          background: white;
          color: #101827;
          padding: clamp(10px, 2.4vw, 15px) 8px;
          border-radius: 999px;
          font-weight: 950;
          cursor: pointer;
          font-size: clamp(14px, 3.2vw, 18px);
          box-shadow: 0 7px 18px rgba(15,23,42,.04);
        }
        .vt-tabs button.active {
          background: #eef6ff;
          color: #0b55c7;
          border-color: #a9caff;
        }
        .vt-line { height: 1px; background: #e5e7eb; margin-bottom: 11px; }
        .vt-warning {
          text-align: center;
          color: #dc2626;
          font-size: clamp(10.5px, 2.6vw, 13px);
          line-height: 1.32;
          margin: 0 0 12px;
          font-weight: 950;
        }
        .vt-form { display: grid; gap: 10px; }
        .vt-form label {
          display: grid;
          grid-template-columns: 36px 1fr;
          align-items: center;
          border-radius: 15px;
          border: 1px solid #d2dae8;
          background: white;
          color: #08296b;
          padding: 0 13px;
          font-size: 22px;
          box-sizing: border-box;
        }
        .vt-form input {
          width: 100%;
          padding: 13px 0;
          border: 0;
          font-size: 16px;
          outline: none;
          color: #0f172a;
          background: transparent;
        }
        .vt-continue {
          width: 100%;
          margin-top: 13px;
          border: 0;
          border-radius: 15px;
          background: linear-gradient(135deg,#063b9a,#001e70);
          color: white;
          padding: 14px 16px;
          font-size: 19px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(6,59,154,.3);
          display: flex;
          justify-content: center;
          gap: 58px;
        }
        .vt-safe {
          text-align: center;
          color: #6b7280;
          margin: 11px 0 0;
          font-weight: 800;
          font-size: 13px;
        }
        .vt-features {
          width: min(820px, 90vw);
          margin: 18px auto 12px;
          box-sizing: border-box;
          background: rgba(255,255,255,.96);
          border-radius: 26px;
          padding: 11px 9px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          box-shadow: 0 18px 42px rgba(0,0,0,.24);
        }
        .vt-features div {
          display: grid;
          justify-items: center;
          align-items: center;
          gap: 4px;
          color: #08296b;
          text-align: center;
          font-size: clamp(10px, 2.3vw, 15px);
          line-height: 1.22;
          min-width: 0;
        }
        .vt-features strong { color: #f97316; font-size: clamp(22px, 5vw, 36px); line-height: 1; }
        .vt-location {
          width: fit-content;
          max-width: 90vw;
          margin: 0 auto;
          background: #08296b;
          color: white;
          border-radius: 999px;
          padding: 10px 18px;
          font-size: clamp(13px, 3vw, 20px);
          font-weight: 800;
          box-shadow: 0 12px 25px rgba(0,0,0,.2);
          box-sizing: border-box;
        }
        @media (max-height: 780px) {
          .vt-shell { padding-top: 38px; }
          .vt-mark { width: 50px; height: 50px; font-size: 34px; }
          .vt-brandName { font-size: clamp(25px, 6vw, 43px); }
          .vt-travel { font-size: clamp(17px, 4vw, 29px); }
          .vt-tagline { font-size: clamp(13px, 3vw, 19px); margin-top: 4px; }
          .vt-hero h1 { font-size: clamp(25px, 6vw, 42px); margin-top: 10px; }
          .vt-register { margin-bottom: 9px; }
          .vt-card { padding: 13px; }
          .vt-form { gap: 8px; }
          .vt-form input { padding: 10px 0; }
          .vt-continue { padding: 12px 14px; margin-top: 10px; }
          .vt-features { margin-top: 12px; }
        }
        @media (max-width: 430px) {
          .vt-shell { padding-left: 14px; padding-right: 14px; }
          .vt-card { width: 88vw; }
          .vt-features { width: 90vw; }
          .vt-location { max-width: 90vw; }
        }
      `}</style>
    </section>
  );
}
