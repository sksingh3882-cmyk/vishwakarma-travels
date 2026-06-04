"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "vishwakarma_customer_profile";

export default function WelcomePage() {
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [alert, setAlert] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (mode !== "existing") return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const profile = JSON.parse(saved);
      const savedName = String(profile.name || "");
      const typedName = name.trim().toLowerCase();

      if (!typedName || savedName.toLowerCase().includes(typedName) || typedName.includes(savedName.toLowerCase())) {
        if (savedName && !name.trim()) setName(savedName);
        setMobile(String(profile.mobile || ""));
        setAddress(String(profile.address || ""));
      }
    } catch {}
  }, [mode, name]);

  const switchMode = (nextMode: "new" | "existing") => {
    setMode(nextMode);
    setAlert(false);

    if (nextMode === "existing") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        const profile = JSON.parse(saved);
        setName(String(profile.name || ""));
        setMobile(String(profile.mobile || ""));
        setAddress(String(profile.address || ""));
      } catch {}
    }
  };

  const startWelcomeAnimations = () => {
    const video = videoRef.current;

    if (video) {
      try {
        if (video.currentTime < 1) video.currentTime = 1;
      } catch {}
    }

    setVideoReady(true);
  };

  const continueBooking = () => {
    const cleanName = name.trim();
    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
    const cleanAddress = address.trim();

    if (mode === "existing") {
      if (!cleanName) {
        setAlert(true);
        return;
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ name: cleanName, mobile: cleanMobile, address: cleanAddress, mode })
      );

      window.location.href = "/?booking=1";
      return;
    }

    if (!cleanName || !cleanMobile || !cleanAddress) {
      setAlert(true);
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name: cleanName, mobile: cleanMobile, address: cleanAddress, mode })
    );

    window.location.href = "/?booking=1";
  };

  return (
    <main className={`welcomePage ${videoReady ? "videoStarted" : ""}`}>

      <div className="videoBg">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={startWelcomeAnimations}
          onPlaying={startWelcomeAnimations}
        >
          <source src="/cars/welcome-road.mp4" type="video/mp4" />
        </video>
      </div>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Yellowtail&display=swap');
      .videoBg{
  position:absolute;
  inset:0;
  z-index:0;
  overflow:hidden;
}

.videoBg video{
  width:100%;
  height:100%;
  object-fit:cover;
}

.welcomePage::before{
  content:"";
  position:absolute;
  inset:0;
  background:rgba(0,0,0,.38);
  z-index:1;
}
        body{margin:0}
        .welcomePage{min-height:100vh;position:relative;overflow:hidden;font-family:Inter,sans-serif;background:#000}
        .mainHeading{position:absolute;top:70px;left:50%;transform:translateX(-50%);width:100%;text-align:center;z-index:3}
        .headingRow{display:flex;align-items:center;justify-content:center;gap:1px}
        
        .scriptLogo{
  margin:0;
  text-align:center;
  font-family:Arial,sans-serif;
  font-style:normal;
  font-weight:900;
  text-transform:uppercase;
  letter-spacing:-1px;
  line-height:.96;
  text-shadow:0 5px 0 rgba(0,0,0,.28),0 12px 20px rgba(0,0,0,.38);
}

.scriptVish{
  display:block;
  color:#ffffff;
  font-size:clamp(31px,8vw,54px);
}

.scriptTravels{
  display:block;
  margin-top:6px;
  color:#ff7a00;
  font-size:clamp(38px,10vw,66px);
  letter-spacing:1px;
}

.logoPopLetter{
  display:inline-block;
  opacity:0;
  transform:translateY(14px) scale(.75);
}
        .tagline{margin-top:8px;font-size:13px;font-style:italic;font-weight:700;color:#ffffff;text-shadow:-1px -1px 0 #0b3aa4,1px -1px 0 #0b3aa4,-1px 1px 0 #0b3aa4,1px 1px 0 #0b3aa4}
        .travelTitle{position:absolute;top:190px;width:100%;text-align:center;z-index:3}
        .travelWord,.madeWord{
  display:block;
  font-family:Arial,sans-serif;
  font-style:normal;
  font-weight:900;
  text-transform:uppercase;
  letter-spacing:-1px;
  line-height:.96;
  text-shadow:0 5px 0 rgba(0,0,0,.28),0 12px 20px rgba(0,0,0,.38);
}

.travelWord{
  font-size:34px;
  color:#ffffff;
}

.madeWord{
  margin-top:4px;
  font-size:34px;
  color:#ff7a00;
}

.popLetter{
  display:inline-block;
  opacity:0;
  transform:translateY(14px) scale(.75);
}

.videoStarted .logoPopLetter,
.videoStarted .popLetter{
  animation:letterPop .5s ease forwards;
}

@keyframes letterPop{
  0%{opacity:0;transform:translateY(14px) scale(.75)}
  70%{opacity:1;transform:translateY(-3px) scale(1.08)}
  100%{opacity:1;transform:translateY(0) scale(1)}
}
        @keyframes leftIn{from{opacity:0;transform:translateX(-120vw)}to{opacity:1;transform:translateX(0)}}
        @keyframes rightIn{from{opacity:0;transform:translateX(120vw)}to{opacity:1;transform:translateX(0)}}
        @keyframes formUp{
  from{opacity:0;transform:translate(-50%,100vh)}
  to{opacity:1;transform:translate(-50%,0)}
}
        .userForm{position:absolute;top:430px;left:50%;transform:translate(-50%,100vh);width:min(88vw,360px);padding:12px;border-radius:18px;background:rgba(0,0,0,.22);border:none;box-shadow:none;z-index:3;opacity:0}
        .videoStarted .userForm{animation:formUp 1s cubic-bezier(.16,1,.3,1) forwards}
        .formTop{display:flex;gap:8px;margin-bottom:10px}
        .topBtn{flex:1;height:40px;border:none;border-radius:13px;font-size:14px;font-weight:800;color:#fff;background:rgba(255,255,255,.18)}
        .topBtn.active{background:linear-gradient(135deg,#0b3aa4,#2563eb);box-shadow:0 10px 24px rgba(37,99,235,.45)}
        .inputWrap{display:grid;gap:8px}
        .input{height:42px;border:none;outline:none;border-radius:13px;padding:0 14px;background:rgba(255,255,255,.92);font-size:14px;font-weight:700;color:#111827;box-shadow:none}
        .continueBtn{width:100%;height:46px;border:none;border-radius:14px;margin-top:10px;font-size:16px;font-weight:900;color:#fff;background:linear-gradient(135deg,#ff7a00,#ff4500);box-shadow:none}
        .smallAlert{margin-top:10px;text-align:center;font-size:11px;font-weight:800;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.7)}
      .featureStrip{
  margin:12px auto 0;
  width:100%;
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:2px;
  background:rgba(255,255,255,.92);
  border-radius:12px;
  padding:6px 4px;
  color:#08245c;
}

.featureStrip div{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
}

.featureStrip span{
  font-size:16px;
  line-height:1;
}

.featureStrip b{
  font-size:7px;
  line-height:1.1;
  color:#08245c;
}
      `}</style>

      <div className="mainHeading">
        <div className="headingRow">
          
          <h1 className="scriptLogo">
            <span className="scriptVish">
              {"Vishwakarma".split("").map((letter, index) => (
                <span
                  key={`logo-vish-${index}`}
                  className="logoPopLetter"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {letter}
                </span>
              ))}
            </span>

            <span className="scriptTravels">
              {"Travels".split("").map((letter, index) => (
                <span
                  key={`logo-travels-${index}`}
                  className="logoPopLetter"
                  style={{ animationDelay: `${(11 + index) * 0.08}s` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </h1>
        </div>
        <div className="tagline">most Reliable and Affordable Cab Service Of Jamshedpur</div>
      </div>

      <div className="travelTitle">
        <span className="travelWord">
          {"Reliable And".split("").map((letter, index) => (
            <span
              key={`reliable-${index}`}
              className="popLetter"
              style={{ animationDelay: `${(19 + index) * 0.08}s` }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>

        <span className="madeWord">
          {"Comfortable".split("").map((letter, index) => (
            <span
              key={`comfortable-${index}`}
              className="popLetter"
              style={{ animationDelay: `${(31 + index) * 0.08}s` }}
            >
              {letter}
            </span>
          ))}
        </span>
      </div>

      <div className="userForm">
        <div className="formTop">
          <button type="button" className={`topBtn ${mode === "new" ? "active" : ""}`} onClick={() => switchMode("new")}>New User</button>
          <button type="button" className={`topBtn ${mode === "existing" ? "active" : ""}`} onClick={() => switchMode("existing")}>Existing User</button>
        </div>
        <div className="inputWrap">
          <input className="input" placeholder="Enter Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Mobile Number" value={mobile} inputMode="tel" onChange={(e) => setMobile(e.target.value)} />
          <input className="input" placeholder="Complete Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <button type="button" className="continueBtn" onClick={continueBooking}>Continue Booking</button>
        <div className="featureStrip">
  <div><span>🛡️</span><b>Safe & Secure</b></div>
  <div><span>👨‍✈️</span><b>Professional Drivers</b></div>
  <div><span>🕘</span><b>24/7 Service</b></div>
  <div><span>₹</span><b>Best Prices</b></div>
  <div><span>🚘</span><b>Wide Range Cars</b></div>
</div>
        {alert && <div className="smallAlert">{mode === "existing" ? "Please enter your name before continuing" : "Please fill name, mobile and address before continuing"}</div>}
      </div>
    </main>
  );
}
