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
      <div className="vt-shade" />
      <a href="/admin" className="vt-admin">Admin Login</a>

      <div className="vt-shell">
        <header className="vt-hero">
          <div className="vt-logoBlock">
            <div className="vt-mark">V</div>
            <div className="vt-brandText">
              <div className="vt-brandName">VISHWAKARMA</div>
              <div className="vt-travel">TRAVELS</div>
              <div className="vt-tagline">Travels Made Easy</div>
            </div>
          </div>

          <h1>Welcome to<br />Vishwakarma Travels</h1>
          <div className="vt-pin"><span />●<span /></div>
          <p className="vt-register">Register to continue</p>
        </header>

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
          <p className="vt-safe">▣ Your information is safe with us</p>
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
        .vt-cover {
          position: fixed;
          inset: 0;
          z-index: 999999;
          min-height: 100svh;
          overflow-y: auto;
          background-image: url('/bg-travel.jpg');
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          font-family: Arial, Helvetica, sans-serif;
          color: #071b3f;
        }
        .vt-shade {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 12%, rgba(255,255,255,.88), rgba(255,255,255,.48) 28%, rgba(255,255,255,.05) 58%),
            linear-gradient(180deg, rgba(255,255,255,.10), rgba(0,0,0,.06) 68%, rgba(0,0,0,.28));
        }
        .vt-admin {
          position: fixed;
          top: clamp(10px, 2vw, 24px);
          right: clamp(10px, 2vw, 24px);
          z-index: 3;
          background: #08296b;
          color: white;
          text-decoration: none;
          border-radius: 999px;
          padding: clamp(8px, 1.5vw, 12px) clamp(13px, 2vw, 20px);
          font-size: clamp(12px, 2.4vw, 16px);
          font-weight: 900;
          box-shadow: 0 10px 24px rgba(0,0,0,.22);
        }
        .vt-shell {
          position: relative;
          z-index: 1;
          width: min(100%, 980px);
          min-height: 100svh;
          margin: 0 auto;
          padding: clamp(16px, 2.8svh, 32px) clamp(12px, 3vw, 26px) clamp(18px, 3svh, 30px);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .vt-hero {
          width: 100%;
          text-align: center;
          margin-top: clamp(30px, 4.8svh, 54px);
        }
        .vt-logoBlock {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(8px, 2vw, 18px);
          margin: 0 auto;
        }
        .vt-mark {
          width: clamp(54px, 11vw, 98px);
          height: clamp(54px, 11vw, 98px);
          display: grid;
          place-items: center;
          border-radius: 18px 6px 18px 6px;
          background: linear-gradient(135deg,#ff7a10,#ff8a00);
          color: white;
          font-size: clamp(35px, 8vw, 68px);
          font-weight: 950;
          transform: skew(-10deg);
          box-shadow: 0 14px 30px rgba(249,115,22,.25);
        }
        .vt-brandText { text-align: left; }
        .vt-brandName {
          color: #08296b;
          font-size: clamp(30px, 7.1vw, 64px);
          line-height: .95;
          font-weight: 950;
          letter-spacing: clamp(1px,.35vw,3px);
        }
        .vt-travel {
          margin-top: 3px;
          color: #f97316;
          font-size: clamp(21px, 5vw, 42px);
          line-height: 1;
          font-weight: 950;
          letter-spacing: clamp(5px,1.35vw,13px);
          text-align: center;
        }
        .vt-tagline {
          margin-top: 8px;
          color: #08296b;
          font-size: clamp(16px,3.5vw,27px);
          font-weight: 750;
          text-align: center;
          letter-spacing: 0;
        }
        .vt-hero h1 {
          margin: clamp(17px, 3svh, 32px) 0 4px;
          color: #08296b;
          font-size: clamp(31px, 7.4vw, 60px);
          line-height: 1.06;
          font-weight: 950;
          text-shadow: 0 2px 12px rgba(255,255,255,.34);
        }
        .vt-pin {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(10px, 2vw, 18px);
          color: #08296b;
          font-size: clamp(18px, 4vw, 30px);
          margin-top: 4px;
        }
        .vt-pin span {
          width: clamp(58px, 18vw, 165px);
          height: 3px;
          background: #f97316;
          border-radius: 999px;
          display: block;
        }
        .vt-register {
          margin: clamp(5px, 1svh, 8px) 0 clamp(10px, 1.8svh, 18px);
          font-size: clamp(18px, 3.8vw, 27px);
          font-weight: 800;
          color: #071b3f;
        }
        .vt-card {
          width: min(600px, 90vw);
          background: rgba(255,255,255,.96);
          border-radius: clamp(18px, 3.2vw, 28px);
          padding: clamp(16px, 3vw, 26px);
          box-shadow: 0 24px 72px rgba(0,0,0,.24);
          border: 1px solid rgba(255,255,255,.84);
          backdrop-filter: blur(8px);
        }
        .vt-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(9px, 2.4vw, 22px);
          margin-bottom: clamp(11px, 2vw, 18px);
        }
        .vt-tabs button {
          border: 1px solid #d7dde8;
          background: white;
          color: #101827;
          padding: clamp(11px, 2.4vw, 17px) 8px;
          border-radius: 999px;
          font-weight: 950;
          cursor: pointer;
          font-size: clamp(14px, 3.2vw, 20px);
          box-shadow: 0 7px 18px rgba(15,23,42,.04);
        }
        .vt-tabs button.active {
          background: #eef6ff;
          color: #0b55c7;
          border-color: #a9caff;
        }
        .vt-line { height: 1px; background: #e5e7eb; margin-bottom: clamp(11px,1.8vw,18px); }
        .vt-warning {
          text-align: center;
          color: #dc2626;
          font-size: clamp(11px, 2.6vw, 15px);
          line-height: 1.32;
          margin: 0 0 clamp(12px, 2vw, 20px);
          font-weight: 950;
        }
        .vt-form { display: grid; gap: clamp(10px, 2vw, 16px); }
        .vt-form label {
          display: grid;
          grid-template-columns: clamp(34px, 7vw, 48px) 1fr;
          align-items: center;
          border-radius: clamp(13px, 2vw, 18px);
          border: 1px solid #d2dae8;
          background: white;
          color: #08296b;
          padding: 0 clamp(10px, 2vw, 16px);
          font-size: clamp(20px, 4vw, 27px);
        }
        .vt-form input {
          width: 100%;
          padding: clamp(13px, 2.8vw, 19px) 0;
          border: 0;
          font-size: clamp(15px, 3.3vw, 21px);
          outline: none;
          color: #0f172a;
          background: transparent;
        }
        .vt-continue {
          width: 100%;
          margin-top: clamp(13px, 2.4vw, 22px);
          border: 0;
          border-radius: clamp(13px, 2vw, 18px);
          background: linear-gradient(135deg,#063b9a,#001e70);
          color: white;
          padding: clamp(13px, 2.7vw, 19px) 16px;
          font-size: clamp(18px, 3.8vw, 25px);
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(6,59,154,.3);
          display: flex;
          justify-content: center;
          gap: clamp(45px, 14vw, 95px);
        }
        .vt-safe {
          text-align: center;
          color: #6b7280;
          margin: clamp(12px, 2vw, 18px) 0 0;
          font-weight: 800;
          font-size: clamp(13px, 2.8vw, 17px);
        }
        .vt-features {
          width: min(900px, 92vw);
          margin: clamp(18px, 3svh, 28px) auto 12px;
          background: rgba(255,255,255,.95);
          border-radius: clamp(18px, 3vw, 30px);
          padding: clamp(9px, 2vw, 15px);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          box-shadow: 0 18px 42px rgba(0,0,0,.24);
        }
        .vt-features div {
          display: grid;
          justify-items: center;
          align-items: center;
          gap: 5px;
          color: #08296b;
          text-align: center;
          font-size: clamp(10px, 2.3vw, 16px);
          line-height: 1.25;
          min-width: 0;
        }
        .vt-features strong { color: #f97316; font-size: clamp(22px, 5vw, 42px); line-height: 1; }
        .vt-location {
          width: fit-content;
          max-width: 92vw;
          margin: 0 auto;
          background: #08296b;
          color: white;
          border-radius: 999px;
          padding: clamp(9px, 2vw, 14px) clamp(16px, 4vw, 28px);
          font-size: clamp(13px, 3vw, 22px);
          font-weight: 800;
          box-shadow: 0 12px 25px rgba(0,0,0,.2);
        }
        @media (max-height: 780px) {
          .vt-shell { padding-top: 10px; }
          .vt-hero { margin-top: 26px; }
          .vt-mark { width: 54px; height: 54px; font-size: 36px; }
          .vt-brandName { font-size: clamp(27px, 6.6vw, 46px); }
          .vt-travel { font-size: clamp(18px, 4.4vw, 31px); }
          .vt-tagline { font-size: clamp(14px, 3.3vw, 21px); margin-top: 5px; }
          .vt-hero h1 { font-size: clamp(26px, 6.4vw, 46px); margin-top: 12px; }
          .vt-card { padding: 14px; }
          .vt-form { gap: 9px; }
          .vt-form input { padding: 11px 0; }
          .vt-features { margin-top: 14px; }
        }
        @media (max-width: 430px) {
          .vt-admin { font-size: 12px; padding: 8px 12px; }
          .vt-card { width: 90vw; }
          .vt-features { width: 94vw; }
          .vt-location { max-width: 94vw; }
        }
      `}</style>
    </section>
  );
}
