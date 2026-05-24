"use client";

import Link from "next/link";

export default function WelcomePage() {
  return (
    <main style={{minHeight:'100vh',background:'linear-gradient(180deg,#eef8ff,#ffffff)',fontFamily:'Arial,sans-serif',overflow:'hidden'}}>
      <section style={{padding:'20px',paddingBottom:'120px',position:'relative'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <img src='/cars/vt-logo.png' alt='VT Logo' style={{width:'64px',height:'64px',borderRadius:'18px',background:'#fff',padding:'4px'}} />
            <div>
              <h1 style={{margin:0,fontSize:'30px',fontWeight:900,color:'#f97316'}}>VISHWAKARMA</h1>
              <p style={{margin:'4px 0 0',letterSpacing:'6px',fontWeight:800,color:'#082d6d'}}>TRAVELS</p>
            </div>
          </div>

          <button style={{width:'50px',height:'50px',borderRadius:'16px',border:'none',background:'#082d6d',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:'5px'}}>
            <span style={{width:'26px',height:'3px',background:'#fff',borderRadius:'20px'}}></span>
            <span style={{width:'26px',height:'3px',background:'#fff',borderRadius:'20px'}}></span>
            <span style={{width:'26px',height:'3px',background:'#fff',borderRadius:'20px'}}></span>
          </button>
        </div>

        <div style={{marginTop:'70px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',fontWeight:800,letterSpacing:'5px',color:'#082d6d'}}>
            <span style={{width:'45px',height:'2px',background:'#f97316'}}></span>
            WELCOME TO
            <span style={{width:'45px',height:'2px',background:'#f97316'}}></span>
          </div>

          <h2 style={{fontSize:'64px',lineHeight:'0.95',margin:'18px 0 0',fontWeight:900}}>
            <span style={{display:'block',color:'#082d6d'}}>Vishwakarma</span>
            <span style={{display:'block',color:'#f97316'}}>Travels</span>
          </h2>

          <div style={{fontSize:'42px',fontStyle:'italic',marginTop:'12px',background:'linear-gradient(90deg,#082d6d,#f97316)',WebkitBackgroundClip:'text',color:'transparent',fontWeight:700}}>
            Travel Made Easy
          </div>

          <p style={{maxWidth:'420px',fontSize:'24px',lineHeight:'1.4',color:'#163b65',fontWeight:600}}>
            Safe, Comfortable and Reliable Cab booking for your journey
          </p>

          <div style={{display:'inline-block',padding:'12px 18px',borderRadius:'999px',background:'#fff',color:'#15803d',fontWeight:800,boxShadow:'0 10px 20px rgba(0,0,0,0.08)'}}>
            Your Safety, Our Priority
          </div>
        </div>
      </section>

      <section style={{padding:'0 14px 40px',marginTop:'-40px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          <div style={{background:'linear-gradient(180deg,#fff,#fff3e7)',borderRadius:'28px',padding:'55px 18px 24px',position:'relative',boxShadow:'0 20px 40px rgba(0,0,0,0.08)'}}>
            <div style={{position:'absolute',top:'-35px',left:'50%',transform:'translateX(-50%)',width:'74px',height:'74px',borderRadius:'50%',background:'#ff8a00'}}></div>
            <h3 style={{textAlign:'center',fontSize:'32px',color:'#f97316',marginBottom:'12px'}}>New User</h3>
            <p style={{textAlign:'center',color:'#163b65'}}>Create a new account to get started</p>
            <Link href='/' style={{marginTop:'30px',display:'flex',justifyContent:'center',alignItems:'center',height:'54px',borderRadius:'16px',background:'linear-gradient(135deg,#ff8a00,#f45b00)',color:'#fff',textDecoration:'none',fontWeight:800,fontSize:'18px'}}>Register Now</Link>
          </div>

          <div style={{background:'linear-gradient(180deg,#fff,#eaf2ff)',borderRadius:'28px',padding:'55px 18px 24px',position:'relative',boxShadow:'0 20px 40px rgba(0,0,0,0.08)'}}>
            <div style={{position:'absolute',top:'-35px',left:'50%',transform:'translateX(-50%)',width:'74px',height:'74px',borderRadius:'50%',background:'#0b72ff'}}></div>
            <h3 style={{textAlign:'center',fontSize:'32px',color:'#0b72ff',marginBottom:'12px'}}>Existing User</h3>
            <p style={{textAlign:'center',color:'#163b65'}}>Login to your account to continue</p>
            <Link href='/' style={{marginTop:'30px',display:'flex',justifyContent:'center',alignItems:'center',height:'54px',borderRadius:'16px',background:'linear-gradient(135deg,#0b72ff,#003ea5)',color:'#fff',textDecoration:'none',fontWeight:800,fontSize:'18px'}}>Login</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
