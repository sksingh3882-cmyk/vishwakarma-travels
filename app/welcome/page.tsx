"use client";

import { useEffect, useRef, useState } from "react";

export default function WelcomePage() {
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVideoReady(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const startWelcomeAnimations = () => {
    setVideoReady(true);
  };

  const continueBooking = () => {
    window.location.href = "/?booking=1";
  };

  const serviceLine = "Well Maintained Cars | Professional Drivers | 24/ 7 Day & Night Service";

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
          onCanPlay={startWelcomeAnimations}
          onPlaying={startWelcomeAnimations}
        >
          <source src="/cars/welcome-road.mp4" type="video/mp4" />
        </video>
      </div>

      <style>{`
        body{margin:0}
        .welcomePage{min-height:100vh;position:relative;overflow:hidden;font-family:Inter,Arial,sans-serif;background:#000}
        .videoBg{position:absolute;inset:0;z-index:0;overflow:hidden}
        .videoBg video{width:100%;height:100%;object-fit:cover}
        .welcomePage::before{content:"";position:absolute;inset:0;background:rgba(0,0,0,.38);z-index:1}

        .mainHeading{position:absolute;top:74px;left:50%;transform:translateX(-50%);width:100%;text-align:center;z-index:3;padding:0 12px;box-sizing:border-box}
        .scriptLogo{margin:0;text-align:center;font-family:Arial,sans-serif;font-style:normal;font-weight:900;text-transform:uppercase;letter-spacing:-1px;line-height:.96;text-shadow:0 5px 0 rgba(0,0,0,.28),0 12px 20px rgba(0,0,0,.38)}
        .scriptVish{display:block;color:#ffffff;font-size:clamp(31px,8vw,54px)}
        .scriptTravels{display:block;margin-top:6px;color:#ff7a00;font-size:clamp(38px,10vw,66px);letter-spacing:1px}
        .logoPopLetter{display:inline-block;opacity:0;transform:translateY(14px) scale(.75)}

        .travelTitle{position:absolute;top:200px;left:50%;transform:translateX(-50%);width:min(92vw,430px);text-align:center;z-index:3}
        .travelWord,.madeWord,.serviceLine{display:block;font-family:Arial,sans-serif;font-style:normal;font-weight:900;text-shadow:0 5px 0 rgba(0,0,0,.28),0 12px 20px rgba(0,0,0,.38)}
        .travelWord{font-size:34px;color:#ffffff;text-transform:uppercase;letter-spacing:-1px;line-height:.96}
        .madeWord{margin-top:4px;font-size:34px;color:#ff7a00;text-transform:uppercase;letter-spacing:-1px;line-height:.96}
        .serviceLine{margin:18px auto 0;max-width:330px;color:#ffffff;font-size:clamp(12px,3.3vw,15px);line-height:1.35;letter-spacing:.1px;text-transform:none}

        .popLetter,.servicePopLetter{display:inline-block;opacity:0;transform:translateY(14px) scale(.75)}
        .videoStarted .logoPopLetter,.videoStarted .popLetter,.videoStarted .servicePopLetter{animation:letterPop .5s ease forwards}
        @keyframes letterPop{0%{opacity:0;transform:translateY(14px) scale(.75)}70%{opacity:1;transform:translateY(-3px) scale(1.08)}100%{opacity:1;transform:translateY(0) scale(1)}}

        @keyframes actionUp{from{opacity:0;transform:translate(-50%,80px)}to{opacity:1;transform:translate(-50%,0)}}
        .welcomeActions{position:absolute;top:470px;left:50%;transform:translate(-50%,80px);width:min(88vw,360px);z-index:3;opacity:0}
        .videoStarted .welcomeActions{animation:actionUp 1s cubic-bezier(.16,1,.3,1) forwards}
        .continueBtn{width:100%;height:52px;border:none;border-radius:16px;font-size:17px;font-weight:900;color:#fff;background:linear-gradient(135deg,#ff7a00,#ff4500);box-shadow:0 14px 30px rgba(0,0,0,.35)}
        .trustNote{margin-top:10px;text-align:center;color:#ffffff;font-size:12px;font-weight:800;text-shadow:0 2px 8px rgba(0,0,0,.7)}
      `}</style>

      <div className="mainHeading">
        <h1 className="scriptLogo">
          <span className="scriptVish">
            {"Vishwakarma".split("").map((letter, index) => (
              <span key={`logo-vish-${index}`} className="logoPopLetter" style={{ animationDelay: `${index * 0.08}s` }}>
                {letter}
              </span>
            ))}
          </span>

          <span className="scriptTravels">
            {"Travels".split("").map((letter, index) => (
              <span key={`logo-travels-${index}`} className="logoPopLetter" style={{ animationDelay: `${(11 + index) * 0.08}s` }}>
                {letter}
              </span>
            ))}
          </span>
        </h1>
      </div>

      <div className="travelTitle">
        <span className="travelWord">
          {"Reliable And".split("").map((letter, index) => (
            <span key={`reliable-${index}`} className="popLetter" style={{ animationDelay: `${(19 + index) * 0.08}s` }}>
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>

        <span className="madeWord">
          {"Comfortable".split("").map((letter, index) => (
            <span key={`comfortable-${index}`} className="popLetter" style={{ animationDelay: `${(31 + index) * 0.08}s` }}>
              {letter}
            </span>
          ))}
        </span>

        <span className="serviceLine">
          {serviceLine.split("").map((letter, index) => (
            <span key={`service-${index}`} className="servicePopLetter" style={{ animationDelay: `${(43 + index) * 0.035}s` }}>
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>
      </div>

      <div className="welcomeActions">
        <button type="button" className="continueBtn" onClick={continueBooking}>Continue Booking</button>
        <div className="trustNote">Tap to continue to the booking form</div>
      </div>
    </main>
  );
}
