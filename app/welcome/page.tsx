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

        .mainHeading{position:absolute;top:70px;left:50%;transform:translateX(-50%);width:100%;text-align:center;z-index:5}
        .headingRow{display:flex;align-items:center;justify-content:center;gap:1px}
        .vtLogoWrap{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#ff7a00,#0b3aa4);display:flex;align-items:center;justify-content:center;animation:leftIn 1.4s ease forwards;box-shadow:0 8px 18px rgba(0,0,0,.35);margin-right:-2px}
        .vtLogo{color:#fff;font-size:20px;font-weight:900;font-family:Poppins,sans-serif;letter-spacing:-1px}
        .mainHeading h1{margin:0;font-family:Poppins,sans-serif;font-size:40px;font-weight:900;line-height:1;letter-spacing:-1px}
        .headingWhite{display:inline-block;color:#ffffff;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000,0 10px 30px rgba(0,0,0,.45);animation:leftIn 1.5s ease forwards}
        .headingRed{display:inline-block;margin-left:8px;color:#7a0000;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000,0 10px 30px rgba(0,0,0,.45);animation:rightIn 1.5s ease forwards}
        .tagline{margin-top:8px;font-size:13px;font-style:italic;font-weight:700;color:#ffffff;text-shadow:-1px -1px 0 #0b3aa4,1px -1px 0 #0b3aa4,-1px 1px 0 #0b3aa4,1px 1px 0 #0b3aa4}

        .travelTitle{position:absolute;top:190px;width:100%;text-align:center;z-index:2}
        .travelWord,.madeWord{display:block;font-size:38px;font-family:Poppins,sans-serif;font-style:italic;font-weight:900;letter-spacing:0;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000,0 12px 26px rgba(0,0,0,.45)}
        .travelWord{color:#fff;animation:leftIn 1.4s ease forwards}
        .madeWord{color:#8fd3ff;animation:rightIn 1.6s ease forwards}

        @keyframes leftIn{from{opacity:0;transform:translateX(-120vw)}to{opacity:1;transform:translateX(0)}}
        @keyframes rightIn{from{opacity:0;transform:translateX(120vw)}to{opacity:1;transform:translateX(0)}}
        @keyframes formUp{from{opacity:0;transform:translate(-50%,140px)}to{opacity:1;transform:translate(-50%,0)}}

        .userForm{position:absolute;top:300px;left:50%;transform:translateX(-50%);width:min(92vw,430px);padding:22px;border-radius:30px;background:rgba(255,255,255,.16);backdrop-filter:blur(22px);border:1px solid rgba(255,255,255,.28);box-shadow:0 25px 60px rgba(0,0,0,.35);z-index:4;animation:formUp 1s cubic-bezier(.16,1,.3,1) forwards}
        .formTop{display:flex;gap:10px;margin-bottom:18px}
        .topBtn{flex:1;height:52px;border:none;border-radius:18px;font-size:16px;font-weight:800;color:#fff;background:rgba(255,255,255,.14);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.2)}
        .topBtn.active{background:linear-gradient(135deg,#0b3aa4,#2563eb);box-shadow:0 10px 24px rgba(37,99,235,.45)}
        .inputWrap{display:grid;gap:14px}
        .input{height:58px;border:none;outline:none;border-radius:18px;padding:0 18px;background:rgba(255,255,255,.92);font-size:16px;font-weight:700;color:#111827;box-shadow:0 8px 20px rgba(0,0,0,.12)}
        .continueBtn{width:100%;height:60px;border:none;border-radius:20px;margin-top:18px;font-size:20px;font-weight:900;color:#fff;background:linear-gradient(135deg,#ff7a00,#ff4500);box-shadow:0 16px 30px rgba(255,122,0,.35)}
        .smallAlert{margin-top:10px;text-align:center;font-size:11px;font-weight:700;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.5)}
      `}</style>

      <div className="mainHeading">
        <div className="headingRow">
          <div className="vtLogoWrap"><div className="vtLogo">VT</div></div>
          <h1><span className="headingWhite">VISHWAKARMA</span><span className="headingRed">TRAVELS</span></h1>
        </div>
        <div className="tagline">most Reliable and Affordable Cab Service Of Jamshedpur</div>
      </div>

      <div className="travelTitle">
        <span className="travelWord">Travel</span>
        <span className="madeWord">Made Easy</span>
      </div>

      <div className="userForm">
        <div className="formTop">
          <button className="topBtn active">New User</button>
          <button className="topBtn">Existing User</button>
        </div>
        <div className="inputWrap">
          <input className="input" placeholder="Enter Your Name" />
          <input className="input" placeholder="Mobile Number" />
          <input className="input" placeholder="Complete Address" />
        </div>
        <button className="continueBtn">Continue Booking</button>
        <div className="smallAlert">Fill all details before entering booking page</div>
      </div>
    </main>
  )
}
