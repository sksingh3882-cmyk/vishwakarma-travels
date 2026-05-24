export default function WelcomePage() {
  return (
    <main className="welcomePage">
      <style>{`
        @keyframes brandEnter {
          0% { opacity: 0; transform: translateX(-18px) translateY(-8px); filter: blur(8px); }
          100% { opacity: 1; transform: translateX(0) translateY(0); filter: blur(0); }
        }

        @keyframes orangeGlow {
          0%, 100% { text-shadow: 0 0 0 rgba(249,115,22,0); }
          50% { text-shadow: 0 0 18px rgba(249,115,22,.65); }
        }

        @keyframes travelSpacing {
          0% { letter-spacing: 5px; opacity: .75; }
          50% { letter-spacing: 7px; opacity: 1; }
          100% { letter-spacing: 5px; opacity: .75; }
        }

        @keyframes shineLine {
          0% { transform: translateX(-120%); opacity: 0; }
          25% { opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }

        @keyframes leftText {
          0% { transform: translateX(-120px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes rightText {
          0% { transform: translateX(120px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        .welcomePage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background-image: url('/cars/welcome-road.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          font-family: Arial, sans-serif;
        }

        .welcomePage::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,22,58,.20), rgba(0,0,0,0) 42%, rgba(0,0,0,.18));
          pointer-events: none;
        }

        .brandOverlay {
          position: absolute;
          top: 24px;
          left: 20px;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px 10px 10px;
          border-radius: 22px;
          background: rgba(255,255,255,.14);
          border: 1px solid rgba(255,255,255,.28);
          backdrop-filter: blur(10px);
          animation: brandEnter .9s ease both;
        }

        .brandLogo {
          width: 54px;
          height: 54px;
          object-fit: contain;
          border-radius: 15px;
          background: rgba(255,255,255,.92);
          padding: 4px;
          box-shadow: 0 14px 35px rgba(0,0,0,.18);
        }

        .brandText h1 {
          margin: 0;
          color: #ff7a00;
          font-size: clamp(22px, 6vw, 34px);
          line-height: 1;
          font-weight: 1000;
          letter-spacing: .5px;
          animation: orangeGlow 2.8s ease-in-out infinite;
        }

        .brandText p {
          margin: 5px 0 0;
          color: #ffffff;
          font-size: clamp(13px, 3.6vw, 19px);
          line-height: 1;
          font-weight: 900;
          animation: travelSpacing 3s ease-in-out infinite;
        }

        .brandLine {
          position: absolute;
          left: 88px;
          right: 16px;
          bottom: 8px;
          height: 2px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.22);
        }

        .brandLine::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, #ff9f1c, transparent);
          animation: shineLine 2.4s ease-in-out infinite;
        }

        .menuIcon {
          position: absolute;
          top: 28px;
          right: 24px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .menuIcon span {
          width: 30px;
          height: 3px;
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 2px 10px rgba(0,0,0,.25);
        }

        .travelTitle {
          position: absolute;
          top: 120px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: clamp(30px, 7vw, 60px);
          font-weight: 1000;
          letter-spacing: 1px;
          text-shadow:
            -2px -2px 0 #000,
             2px -2px 0 #000,
            -2px  2px 0 #000,
             2px  2px 0 #000,
             0 10px 34px rgba(0,0,0,.38);
          font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
          font-style: italic;
        }

        .travelLeft {
          color: #ffffff;
          animation: leftText 1s ease both;
        }

        .travelRight {
          color: #7dd3fc;
          animation: rightText 1s ease both;
        }

        .userCards {
          position: absolute;
          top: 260px;
          left: 50%;
          transform: translateX(-50%);
          width: min(92%, 900px);
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 24px;
          z-index: 2;
        }

        .glassCard {
          padding: 34px 28px;
          border-radius: 28px;
          background: rgba(255,255,255,.16);
          border: 1px solid rgba(255,255,255,.28);
          backdrop-filter: blur(14px);
          box-shadow: 0 18px 45px rgba(0,0,0,.18);
          text-align: center;
        }

        .glassCard h2 {
          margin: 0 0 14px;
          font-size: 34px;
          font-weight: 1000;
          color: white;
          text-shadow: 0 4px 16px rgba(0,0,0,.45);
        }

        .glassCard p {
          margin: 0 0 24px;
          color: #e2e8f0;
          font-size: 17px;
          line-height: 1.5;
        }

        .glassBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 54px;
          border-radius: 16px;
          text-decoration: none;
          color: white;
          font-size: 18px;
          font-weight: 900;
          background: rgba(255,255,255,.18);
          border: 1px solid rgba(255,255,255,.28);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0,0,0,.18);
        }

        @media (max-width: 520px) {
          .brandOverlay {
            top: 18px;
            left: 14px;
            max-width: calc(100vw - 40px);
            padding: 8px 12px 8px 8px;
          }

          .brandLogo {
            width: 48px;
            height: 48px;
          }

          .menuIcon {
            top: 22px;
            right: 16px;
          }

          .travelTitle {
            top: 120px;
            gap: 6px;
            flex-direction: column;
            font-size: 36px;
          }

          .userCards {
            top: 270px;
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .glassCard {
            padding: 26px 20px;
          }
        }
      `}</style>

      <div className="brandOverlay">
        <img src="/cars/vt-logo.png" alt="Vishwakarma Travels" className="brandLogo" />
        <div className="brandText">
          <h1>VISHWAKARMA</h1>
          <p>TRAVELS</p>
        </div>
        <span className="brandLine" />
      </div>

      <div className="travelTitle">
        <span className="travelLeft">Travel</span>
        <span className="travelRight">Made Easy</span>
      </div>

      <div className="userCards">
        <div className="glassCard">
          <h2>New User</h2>
          <p>Create your account and start booking premium rides with Vishwakarma Travels.</p>
          <a href="/" className="glassBtn">Register Now</a>
        </div>

        <div className="glassCard">
          <h2>Existing User</h2>
          <p>Login to manage your bookings, view trips and continue your journey.</p>
          <a href="/" className="glassBtn">Login</a>
        </div>
      </div>

      <div className="menuIcon">
        <span />
        <span />
        <span />
      </div>
    </main>
  )
}
