export default function WelcomePage() {
  return (
    <main className="welcomePage">
      <style>{`
        body{margin:0}
        .welcomePage{
          min-height:100vh;
          background:url('/cars/welcome-road.jpg') center/cover no-repeat;
          position:relative;
          overflow:hidden;
          font-family:Inter,sans-serif;
        }

        .mainHeading{
          position:absolute;
          top:70px;
          left:50%;
          transform:translateX(-50%);
          width:100%;
          text-align:center;
          z-index:5;
        }

        .headingRow{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:1px;
        }

        .vtLogoWrap{
          width:42px;
          height:42px;
          border-radius:50%;
          background:linear-gradient(135deg,#ff7a00,#0b3aa4);
          display:flex;
          align-items:center;
          justify-content:center;
          animation:leftIn 1.4s ease forwards;
          box-shadow:0 8px 18px rgba(0,0,0,.35);
          margin-right:-2px;
        }

        .vtLogo{
          color:#fff;
          font-size:20px;
          font-weight:900;
          font-family:Poppins,sans-serif;
          letter-spacing:-1px;
        }

        .mainHeading h1{
          margin:0;
          font-family:Poppins,sans-serif;
          font-size:40px;
          font-weight:900;
          line-height:1;
          letter-spacing:-1px;
        }

        .headingWhite{
          display:inline-block;
          color:#ffffff;
          text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000,0 10px 30px rgba(0,0,0,.45);
          animation:leftIn 1.5s ease forwards;
        }

        .headingRed{
          display:inline-block;
          margin-left:8px;
          color:#7a0000;
          text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000,0 10px 30px rgba(0,0,0,.45);
          animation:rightIn 1.5s ease forwards;
        }
      `}</style>

      <div className="mainHeading">
        <div className="headingRow">
          <div className="vtLogoWrap">
            <div className="vtLogo">VT</div>
          </div>

          <h1>
            <span className="headingWhite">VISHWAKARMA</span>
            <span className="headingRed">TRAVELS</span>
          </h1>
        </div>
      </div>
    </main>
  )
}
