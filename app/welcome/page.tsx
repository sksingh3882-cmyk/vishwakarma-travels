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

        .travelTitle{
          position:absolute;
          top:120px;
          width:100%;
          text-align:center;
          z-index:2;
        }

        .travelWord{
          display:block;
          color:#fff;
          font-size:58px;
          font-style:italic;
          font-weight:900;
          animation:leftIn 1.4s ease forwards;
          text-shadow:0 10px 30px rgba(0,0,0,.45);
        }

        .madeWord{
          display:block;
          color:#8fd3ff;
          font-size:58px;
          font-style:italic;
          font-weight:900;
          animation:rightIn 1.6s ease forwards;
          text-shadow:0 10px 30px rgba(0,0,0,.45);
        }

        @keyframes leftIn{
          from{opacity:0;transform:translateX(-120vw)}
          to{opacity:1;transform:translateX(0)}
        }

        @keyframes rightIn{
          from{opacity:0;transform:translateX(120vw)}
          to{opacity:1;transform:translateX(0)}
        }

        .userForm{
          position:absolute;
          top:270px;
          left:50%;
          transform:translateX(-50%);
          width:min(92vw,430px);
          background:rgba(255,255,255,.9);
          backdrop-filter:blur(18px);
          border-radius:28px;
          padding:18px;
          z-index:3;
          box-shadow:0 20px 60px rgba(0,0,0,.35);
          animation:formUp 1s cubic-bezier(.16,1,.3,1) forwards;
        }

        @keyframes formUp{
          from{opacity:0;transform:translate(-50%,140px)}
          to{opacity:1;transform:translate(-50%,0)}
        }

        .tabs{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
          margin-bottom:16px;
        }

        .tab{
          height:52px;
          border:none;
          border-radius:16px;
          font-size:18px;
          font-weight:800;
          background:#eef4ff;
          color:#0f172a;
        }

        .active{
          background:#0b3aa4;
          color:#fff;
        }

        .grid{
          display:grid;
          gap:12px;
        }

        .input{
          height:54px;
          border-radius:16px;
          border:1px solid #dbe4f0;
          padding:0 16px;
          font-size:16px;
          font-weight:600;
        }

        .btn{
          margin-top:14px;
          width:100%;
          height:58px;
          border:none;
          border-radius:18px;
          background:linear-gradient(135deg,#0b3aa4,#1459ff);
          color:#fff;
          font-size:24px;
          font-weight:900;
        }

        .alert{
          margin-top:10px;
          text-align:center;
          font-size:11px;
          color:#dc2626;
          font-weight:700;
        }
      `}</style>

      <div className="travelTitle">
        <span className="travelWord">Travel</span>
        <span className="madeWord">Made Easy</span>
      </div>

      <div className="userForm">
        <div className="tabs">
          <button className="tab active">New User</button>
          <button className="tab">Existing User</button>
        </div>

        <div className="grid">
          <input className="input" placeholder="Your Name" />
          <input className="input" placeholder="Mobile Number" />
          <input className="input" placeholder="Complete Address" />
        </div>

        <button className="btn">Continue →</button>

        <div className="alert">
          Please fill all details before continuing
        </div>
      </div>
    </main>
  )
}
