"use client";
import {useEffect,useState,type FormEvent,type CSSProperties} from "react";
import CustomerCover from "@/components/CustomerCover";
import CustomerBookNowSection from "@/components/booking-request/CustomerBookNowSection";
import SecureBookingPopup from "@/components/SecureBookingPopup";
import ContactAdminBox from "@/components/ContactAdminBox";

const phone="917667989203";
type F={name:string;mobile:string;service:string;vehicle:string;pickup:string;drop:string;bookingDate:string;bookingTime:string};
type FormErrors=Partial<Record<keyof F,string>>;
const empty:F={name:"",mobile:"",service:"",vehicle:"",pickup:"",drop:"",bookingDate:"",bookingTime:""};
const serviceOptions=["One Way Drop Pickup","Round Trip","Jamshedpur to Ranchi Airport Drop","Ranchi Airport to Jamshedpur Drop","Jamshedpur to Kolkata Airport Drop","Kolkata Airport to Jamshedpur Drop","Local Movement","Outstation Movement","Short Time Booking","Marriage Function Booking"];
const vehicleOptions=["Dzire","Ertiga","Innova","Innova Crysta","Traveller"];
const vehicleImages:Record<string,string>={Dzire:"/cars/desire2.png",Ertiga:"/cars/ertiga2.png",Innova:"/cars/innova2.png","Innova Crysta":"/cars/crysta2.png"};
const cleanPhone=(v:string)=>{let p=String(v||"").replace(/\D/g,"");if((p.startsWith("91")||p.startsWith("0"))&&p.length>10)p=p.slice(-10);return p.slice(-10)};
const fmt=(v:string)=>v&&v.includes("-")?v.split("-").reverse().join("-"):v||"";
export default function Home(){
const [showCover,setShowCover]=useState(true);
 useEffect(() => {
  const requestId = new URLSearchParams(window.location.search).get("bookingRequestId");
  if (requestId) setShowCover(false);
}, []);
 const [form,setForm]=useState<F>(empty),[errors,setErrors]=useState<FormErrors>({}),[customers,setCustomers]=useState<any[]>([]),[bookings,setBookings]=useState<any[]>([]),[showSug,setShowSug]=useState(false),[pending,setPending]=useState<any>(null),[notice,setNotice]=useState(false),[openDrop,setOpenDrop]=useState<"service"|"vehicle"|"date"|"time"|null>(null),[calMonth,setCalMonth]=useState(()=>new Date()),[customTime,setCustomTime]=useState({h:"07",m:"40",ap:"AM"});
 const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL||"",supabaseKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"";
 const headers={apikey:supabaseKey,Authorization:`Bearer ${supabaseKey}`,"Content-Type":"application/json"};
 useEffect(()=>{(async()=>{if(!supabaseUrl||!supabaseKey)return;const [c,b]=await Promise.all([fetch(`${supabaseUrl}/rest/v1/customers?select=*`,{headers}),fetch(`${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc&limit=200`,{headers})]);if(c.ok)setCustomers(await c.json());if(b.ok)setBookings(await b.json())})().catch(console.log)},[]);
 const set=(k:keyof F,v:string)=>{setForm(p=>({...p,[k]:v}));setErrors(e=>({...e,[k]:""}))};
 const iso=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
 const niceDate=(v:string)=>v?new Date(`${v}T00:00:00`).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"Select Date";
 const time12=(v:string)=>v?new Date(`2000-01-01T${v}`).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}):"Select Time";
 const to24=()=>{let h=Number(customTime.h)%12;if(customTime.ap==="PM")h+=12;return `${String(h).padStart(2,"0")}:${customTime.m}`};
 const timeSlots=Array.from({length:30},(_,i)=>{const h=7+Math.floor(i/2),m=i%2?30:0;const v=`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;return{v,t:time12(v)}});
 const apply=(c:any)=>{setForm(p=>({...p,name:c.name||p.name,mobile:cleanPhone(c.mobile||c.phone||p.mobile),pickup:c.address||p.pickup}));setShowSug(false)};
 const find=()=>{const n=form.name.toLowerCase().trim(),m=cleanPhone(form.mobile);const f=customers.find(c=>(n&&(c.name||"").toLowerCase().trim()===n)||(m&&cleanPhone(c.mobile||c.phone||"")===m));if(f)apply(f)};
 const q=`${form.name} ${form.mobile}`.toLowerCase().trim();
const suggestions:any[]=[];
 const oldDrops=Array.from(new Set(bookings.filter(b=>{const bp=cleanPhone(b.customer_phone||b.mobile||b.customer_mobile||"");const bn=String(b.customer_name||b.name||"").toLowerCase();return(bp&&bp===cleanPhone(form.mobile))||(form.name&&bn.includes(form.name.toLowerCase()))}).map(b=>b.drop_location||b.drop||"").filter(Boolean))).slice(0,8);
 const data=()=>{const mobile=cleanPhone(form.mobile);return{...form,mobile,message:`👋 Hello Vishwakarma Travels,\n\n🚕 I would like to book a cab.\n\n🔹Name: ${form.name}\n📲 Mobile: ${mobile}\n⚙️ Service: ${form.service}\n🚖 Vehicle: ${form.vehicle}\n📌 Pickup: ${form.pickup}\n📌 Drop: ${form.drop}\n📆 Date: ${form.bookingDate}\n🕛 Time: ${new Date(`2000-01-01T${form.bookingTime}`).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true})}\n\n📝 Please share the booking confirmation details soon.\n\nThank you.`}};
  const validateBooking=()=>{const e:FormErrors={};if(!form.service.trim())e.service="Please select a service.";if(!form.vehicle.trim())e.vehicle="Please select a vehicle.";if(!form.name.trim())e.name="Please enter your name.";if(cleanPhone(form.mobile).length!==10)e.mobile="Please enter a valid 10 digit mobile number.";if(!form.pickup.trim())e.pickup="Please enter pickup location.";if(!form.drop.trim())e.drop="Please enter drop location.";if(!form.bookingDate.trim())e.bookingDate="Please select a journey date.";if(!form.bookingTime.trim())e.bookingTime="Please select a journey time.";setErrors(e);return Object.keys(e).length===0};
 const isBookingReady=!!form.service.trim()&&!!form.vehicle.trim()&&!!form.name.trim()&&cleanPhone(form.mobile).length===10&&!!form.pickup.trim()&&!!form.drop.trim()&&!!form.bookingDate.trim()&&!!form.bookingTime.trim();
 const Drop=({kind,label,options,value}:{kind:"service"|"vehicle";label:string;options:string[];value:string})=><div style={ddWrap}><button type="button" style={ddBtn} onClick={()=>setOpenDrop(openDrop===kind?null:kind)}>{value||label}<span>⌄</span></button>{openDrop===kind&&<div style={kind==="vehicle"?vehicleMenu:serviceMenu}>{kind==="vehicle"?options.map(o=><button key={o} type="button" style={{...vehicleItem,...(value===o?selectedItem:{})}} onClick={()=>{set(kind,o);setOpenDrop(null)}}>{vehicleImages[o]?<img src={vehicleImages[o]} alt={o} style={vehicleImg}/>:<span style={vehicleFallback}>🚐</span>}<span>{o}</span></button>):<div style={serviceGrid}>{options.map(o=><button key={o} type="button" style={{...serviceChip,...(value===o?selectedChip:{})}} onClick={()=>{set(kind,o);setOpenDrop(null)}}>{o}</button>)}</div>}</div>}</div>;
 const DatePick=()=>{const y=calMonth.getFullYear(),m=calMonth.getMonth(),first=new Date(y,m,1).getDay(),total=new Date(y,m+1,0).getDate();const cells=Array.from({length:42},(_,i)=>{const day=i-first+1;return{d:new Date(y,m,day),muted:day<1||day>total}});const today=iso(new Date()),selected=form.bookingDate;return <div style={ddWrap}><button type="button" style={ddBtn} onClick={()=>setOpenDrop(openDrop==="date"?null:"date")}>📅 {niceDate(form.bookingDate)}<span>⌄</span></button>{openDrop==="date"&&<div style={calMenu}><div style={calHead}><button type="button" style={calNav} onClick={()=>setCalMonth(new Date(y,m-1,1))}>📆</button><b>{calMonth.toLocaleDateString("en-IN",{month:"long",year:"numeric"})}</b><button type="button" style={calNav} onClick={()=>setCalMonth(new Date(y,m+1,1))}>🗓️</button></div><div style={calWeek}>{["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><span key={d}>{d}</span>)}</div><div style={calGrid}>{cells.map(({d,muted})=>{const v=iso(d),sel=v===selected,td=v===today;return <button key={v} type="button" style={{...calDay,...(muted?calMuted:{}),...(td?calToday:{}),...(sel?calSelected:{})}} onClick={()=>{set("bookingDate",v);setOpenDrop(null)}}>{d.getDate()}</button>})}</div><button type="button" style={calFooter} onClick={()=>{const t=iso(new Date());set("bookingDate",t);setCalMonth(new Date());setOpenDrop(null)}}>📆 Today, {niceDate(today)}</button></div>}<input value={form.bookingDate} required readOnly style={hiddenReq}/></div>};
 const TimePick=()=>{return <div style={ddWrap}><button type="button" style={ddBtn} onClick={()=>setOpenDrop(openDrop==="time"?null:"time")}>🕘 {time12(form.bookingTime)}<span>⌄</span></button>{openDrop==="time"&&<div style={timeMenu}><div style={timeHead}><b>🕛 Select Time</b><button type="button" style={timeClose} onClick={()=>setOpenDrop(null)}>×</button></div><div style={timeGrid}>{timeSlots.map(({v,t})=><button key={v} type="button" style={{...timeSlot,...(form.bookingTime===v?timeSelected:{})}} onClick={()=>{set("bookingTime",v);setOpenDrop(null)}}>{t}</button>)}</div><div style={customRow}><span>Custom</span><select style={miniSel} value={customTime.h} onChange={e=>setCustomTime(p=>({...p,h:e.target.value}))}>{Array.from({length:12},(_,i)=>String(i+1).padStart(2,"0")).map(h=><option key={h}>{h}</option>)}</select><select style={miniSel} value={customTime.m} onChange={e=>setCustomTime(p=>({...p,m:e.target.value}))}>{Array.from({length:60},(_,i)=>String(i).padStart(2,"0")).map(mm=><option key={mm}>{mm}</option>)}</select><select style={miniSel} value={customTime.ap} onChange={e=>setCustomTime(p=>({...p,ap:e.target.value}))}><option>AM</option><option>PM</option></select><button type="button" style={miniBtn} onClick={()=>{set("bookingTime",to24());setOpenDrop(null)}}>Done</button></div></div>}<input value={form.bookingTime} required readOnly style={hiddenReq}/></div>};
 function submit(e:FormEvent){e.preventDefault();setPending(data())}
 async function send(){if(!pending)return;const p=pending;const wa=`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(p.message)}`;const opened=window.open(wa,"_blank","noopener,noreferrer");if(!opened)window.location.assign(wa);setPending(null);try{if(supabaseUrl&&supabaseKey){await fetch(`${supabaseUrl}/rest/v1/customers?on_conflict=mobile`,{method:"POST",headers:{...headers,Prefer:"resolution=merge-duplicates"},body:JSON.stringify({name:p.name,mobile:p.mobile,address:p.pickup,drop_location:p.drop,service:p.service,journey_date:p.bookingDate,journey_time:p.bookingTime,vehicle_type:p.vehicleType||"",vehicle_model:p.vehicle})});await fetch(`${supabaseUrl}/rest/v1/bookings`,{method:"POST",headers:{...headers,Prefer:"return=minimal"},body:JSON.stringify({customer_name:p.name,customer_phone:p.mobile,mobile:p.mobile,service:p.service,vehicle_type:p.vehicle,vehicle_model:p.vehicle,pickup:p.pickup,drop_location:p.drop,booking_date:`${p.bookingDate} ${p.bookingTime}`,address:p.pickup,status:"Pending"})})}}catch(err){console.log(err)}}
function downloadBookingCopy(){if(!form.name||!form.mobile||!form.pickup||!form.drop)return alert("Please fill name, mobile number, pickup and drop location to download booking copy.");const c=document.createElement("canvas");c.width=1080;c.height=1920;const x=c.getContext("2d");if(!x)return;const wrap=(t:string,xx:number,y:number,w:number,lh:number)=>{let line="";for(const word of String(t||"-").split(" ")){const test=line+word+" ";if(x.measureText(test).width>w&&line){x.fillText(line.trim(),xx,y);line=word+" ";y+=lh}else line=test}x.fillText(line.trim(),xx,y);return y};const rr=(a:number,b:number,w:number,h:number,r:number)=>{x.beginPath();x.roundRect(a,b,w,h,r);x.fill()};const row=(l:string,v:string,y:number)=>{x.fillStyle="#0b2d6b";x.font="bold 32px 'Times New Roman', Times, serif";x.fillText(l,115,y);x.fillStyle="#111";x.font="31px 'Times New Roman', Times, serif";const ly=wrap(v||"-",385,y,535,36);const endY=Math.max(y+42,ly+14);x.strokeStyle="#d7dee8";x.lineWidth=1;x.setLineDash([4,4]);x.beginPath();x.moveTo(110,endY+10);x.lineTo(930,endY+10);x.stroke();x.setLineDash([]);return endY+50};const drawDetails=()=>{x.fillStyle="#fff7ed";rr(22,28,190,52,24);x.fillStyle="#ea580c";x.font="bold 29px 'Times New Roman', Times, serif";x.fillText("Booking Copy",42,63);x.fillStyle="#eff6ff";rr(140,610,800,110,12);x.strokeStyle="#0b2d6b";x.lineWidth=3;x.strokeRect(140,610,800,110);x.fillStyle="#0b2d6b";x.textAlign="center";x.font="bold 33px 'Times New Roman', Times, serif";x.fillText(`👋 Namaste ${form.name||"Customer"}`,540,662);x.font="bold 27px 'Times New Roman', Times, serif";x.fillText("Here is your Upcoming Trip Request",540,700);x.textAlign="left";let y=805;y=row("Mobile",cleanPhone(form.mobile),y);y=row("Service",form.service,y);y=row("Vehicle",form.vehicle,y);y=row("Pickup",form.pickup,y);y=row("Drop",form.drop,y);y=row("Date",fmt(form.bookingDate),y);y=row("Time",formatTime(form.bookingTime),y);x.fillStyle="#087a31";x.font="bold 31px 'Times New Roman', Times, serif";x.fillText("Declaration",75,y+20);x.strokeStyle="#087a31";x.lineWidth=5;x.beginPath();x.moveTo(75,y+47);x.lineTo(1005,y+47);x.stroke();x.fillStyle="#111";x.font="25px 'Times New Roman', Times, serif";let yy=y+92;for(const t of["Book A Cab Atleast 24 Hour Before Travelling Otherwise Booking May Not Be Confirmed","After the booking is Confirmed, Customer will have to make the Advance Payment","Rs.500 Cancellation Charge will have to be paid on Cancellation of Booking under any Circumtances"]){x.fillText("*",80,yy);yy=wrap(t,115,yy,880,32)+32}x.fillStyle="#0b2d6b";x.textAlign="center";x.font="bold 27px 'Times New Roman', Times, serif";x.fillText("Thank You And Wish You A Very Happy Journey",540,yy+30);x.font="bold 36px 'Times New Roman', Times, serif";x.fillText("Vishwakarma Travels",540,yy+72);x.textAlign="left";x.fillStyle="#0b2d6b";rr(20,1840,1040,55,8);x.fillStyle="#fff";x.textAlign="left";x.font="20px Arial";x.fillText("🌐 http://vishwakarma-travel-nine.vercel.app",55,1875);x.textAlign="right";x.font="italic 22px 'Times New Roman', Times, serif";x.fillText("Thank You! Have a Safe Journey",1010,1875);x.textAlign="left";const a=document.createElement("a");a.href=c.toDataURL("image/jpeg",.95);a.download=`Vishwakarma-Booking-${Date.now()}.jpg`;a.click();setNotice(true);setTimeout(()=>setNotice(false),3500)};x.fillStyle="#f4f7fb";x.fillRect(0,0,1080,1920);x.fillStyle="#fff";rr(8,8,1064,1904,26);const img=new Image();img.crossOrigin="anonymous";img.onload=()=>{x.drawImage(img,42,42,996,480);drawDetails()};img.onerror=drawDetails;img.src="/cars/popup_banner.png"}
 function formatTime(t:string){if(!t)return "";const [h,m]=t.split(":");const hour=Number(h);return `${hour%12||12}:${m} ${hour>=12?"PM":"AM"}`;}
 return <main style={page} onClick={()=>openDrop&&setOpenDrop(null)}>{showCover&&<CustomerCover onContinue={(profile)=>{setForm(p=>({...p,name:profile.name||p.name,mobile:cleanPhone(profile.mobile||p.mobile),pickup:profile.address||p.pickup}));setShowCover(false)}}/>}{pending&&<div style={overlay}><div style={modal}><button onClick={()=>setPending(null)} style={close}>❎</button><img src="/cars/popup_banner.png" style={banner}/><div style={{padding:14}}><h2 style={{color:"#0b2d6b",margin:0}}>Confirm Your Ride Details</h2><p>Please check details before WhatsApp submit.</p><div style={grid}>{["name","mobile","service","vehicle","bookingDate","bookingTime"].map(k=><div style={info} key={k}><b>{k}</b><span>{pending[k]}</span></div>)}</div><div style={route}><b>Pickup</b><span>{pending.pickup}</span><b>Drop</b><span>{pending.drop}</span></div><div style={actions}><button onClick={()=>setPending(null)} style={cancel}>Cancel</button><button onClick={send} style={confirm}>Confirm & Submit</button></div></div></div></div>}
<SecureBookingPopup />
  <header style={head}>
  <a href="/" style={{display:"flex",textDecoration:"none",alignItems:"center"}}>
    <img
      src="/cars/vt-logo-new.png"
      style={{width:220,height:58,objectFit:"contain"}}
      alt="Vishwakarma Travels"
    />
  </a>
</header><section style={hero}>
  <div style={textHeroBanner}>
   

    <div style={textHeroFeatures}>
      <div style={textHeroFeature}>
        <span style={textHeroIcon}>🛡️</span>
        <span>Well Maintained Cars</span>
      </div>

      <div style={textHeroFeature}>
        <span style={textHeroIcon}>👨‍✈️</span>
        <span>Professional Drivers</span>
      </div>

      <div style={textHeroFeature}>
        <span style={textHeroIcon}>📞</span>
        <span>24/7 Support</span>
      </div>

      <div style={textHeroFeature}>
        <span style={textHeroIcon}>🌃</span>
        <span>Day Night Service</span>
      </div>
    </div>
  </div>
</section>
  <section style={wrap}><form id="booking-form" onClick={e=>e.stopPropagation()} onSubmit={submit} style={card}>
  <div className="vt-premium-booking-hero">
    <div className="vt-premium-hero-copy">
      <span>SAFE. RELIABLE. COMFORTABLE.</span>
      <h2>Book Your<br />Ride</h2>
      <p>Fill in the details below to book your ride</p>
    </div>
  </div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,gridColumn:"1/-1"}}><Drop kind="service" label="Select Service" options={serviceOptions} value={form.service}/><Drop kind="vehicle" label="Select Vehicle" options={vehicleOptions} value={form.vehicle}/></div><div style={{position:"relative"}}><input placeholder="Your Name" value={form.name} onFocus={()=>setShowSug(true)} onChange={e=>{set("name",e.target.value);setShowSug(true)}} onBlur={()=>setTimeout(()=>{find();setShowSug(false)},180)} style={inp} required/>{showSug&&suggestions.length>0&&<div style={sbox}>{suggestions.map((c,i)=><button key={i} type="button" onMouseDown={()=>apply(c)} style={sitem}><b>{c.name}</b><span>{cleanPhone(c.mobile||c.phone||"")}</span><small>{c.address}</small></button>)}</div>}</div><input placeholder="Mobile Number" value={form.mobile} onChange={e=>set("mobile",cleanPhone(e.target.value))} onBlur={find} style={inp} required/><input placeholder="Pickup Location" value={form.pickup} onChange={e=>set("pickup",e.target.value)} style={inp} required/><input placeholder="Drop Location" value={form.drop} onChange={e=>set("drop",e.target.value)} style={inp} required/>{oldDrops.length>0&&<div style={chips}><b>Old Drop Locations</b><div>{oldDrops.map(d=><button type="button" key={d} onClick={()=>set("drop",d)} style={chip}>{d}</button>)}</div></div>}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,gridColumn:"1/-1"}}><DatePick/><TimePick/></div><div style={{gridColumn:"1/-1"}}>
  <CustomerBookNowSection
  bookingData={{
    customerName: form.name,
    customerPhone: form.mobile,
    service: form.service,
    requestedVehicle: form.vehicle,
    pickup: form.pickup,
    drop: form.drop,
    journeyDate: form.bookingDate,
    journeyTime: form.bookingTime,
  }}
  onDownloadCopy={downloadBookingCopy}
  onWhatsAppRequest={() => setPending(data())}
    onRequestSentSuccess={() => {setForm(empty);setErrors({})}}
  onValidateBeforeOpen={validateBooking}
  isBookNowReady={isBookingReady}
/>
   
</div>{notice&&<div style={ok}>⌄ Booking copy downloaded successfully!</div>}</form></section><section style={sec}><h2 style={title}>Our Services</h2><div style={svcGrid}>{["One Way Drop Pickup","Local Movement","Outstation Movement","Short Trip & Hourly Booking"].map(s=>
<div
  key={s}
 style={{...svc,cursor:"pointer"}}
  onClick={()=>{
    if(s==="One Way Drop Pickup"){
      window.location.href="/airport-drop";
      return;
    }
    set("service",s);
    document.getElementById("booking-form")?.scrollIntoView({behavior:"smooth"});
  }}
><h3>{s}</h3><div style={{display:"flex",alignItems:"center",gap:8,color:"#64748b",marginTop:10}}><span style={{fontSize:16}}>{s==="One Way Drop Pickup"?"✈️":s==="Local Movement"?"🚖":s==="Outstation Movement"?"🛣️":"⏱️"}</span><p style={{margin:0}}>{s==="One Way Drop Pickup"?"Airport & city drop service":s==="Local Movement"?"Local cab for daily travel":s==="Outstation Movement"?"Outstation taxi booking":"Short trip & hourly booking"}</p></div></div>)}</div></section><ContactAdminBox /><footer style={{textAlign:"center",padding:30}}>Vishwakarma Travels</footer></main>}
const textHeroBanner:CSSProperties={
  position:"relative",
  overflow:"hidden",
  background:"linear-gradient(135deg,#ffffff 0%,#f8fbff 52%,#fff7ed 100%)",
  border:"1px solid #dbeafe",
  borderRadius:28,
  padding:"12px 14px",
  minHeight:92,
  boxShadow:"0 10px 28px #0b2d6b22",
  textAlign:"center"
};

const textHeroTitle:CSSProperties={
  margin:"0 auto",
  display:"grid",
  gap:0,
  lineHeight:.98,
  letterSpacing:"-.5px"
};

const textHeroBlue:CSSProperties={
  color:"#0B3D91",
  fontSize:"clamp(28px,8vw,64px)",
  fontWeight:1000
};

const textHeroOrange:CSSProperties={
  color:"#FF6B00",
  fontSize:"clamp(36px,10vw,78px)",
  fontWeight:1000
};

const textHeroFeatures:CSSProperties={
  marginTop:14,
  height:118,
  padding:"8px 10px",
  backgroundImage:`url("/cars/premium-strip.png")`,
  backgroundSize:"cover",
  backgroundPosition:"center",
  border:"1px solid rgba(246,213,111,.45)",
  borderRadius:18,
  boxShadow:"0 12px 32px rgba(0,0,0,.35)",
  overflow:"hidden"
};
const textHeroFeature:CSSProperties={
  display:"none"
};

const textHeroIcon:CSSProperties={
  fontSize:"clamp(18px,5vw,28px)"
};
const page:CSSProperties={minHeight:"100vh",backgroundImage:"linear-gradient(#02061766,#02061766),url('/cars/customer-bg.png')",backgroundSize:"cover",backgroundPosition:"center top",backgroundAttachment:"fixed",fontFamily:"Arial,sans-serif"},head:CSSProperties={maxWidth:1120,margin:"0 auto",padding:"4px 18px 10px",background:"transparent"},mark:CSSProperties={width:52,height:52,borderRadius:14,display:"grid",placeItems:"center",background:"#f97316",color:"white",fontSize:34,fontWeight:900},logo1:CSSProperties={margin:0,color:"#f97316",fontSize:"clamp(16px,4vw,24px)",lineHeight:1},logo2:CSSProperties={margin:0,color:"#ffffff",fontWeight:900,fontSize:"clamp(12px,3.8vw,20px)",textShadow:"0 2px 8px rgba(0,0,0,.45)"},hero:CSSProperties={maxWidth:1120,margin:"0 auto",padding:"0 8px 6px"},wrap:CSSProperties={maxWidth:760,margin:"-72px auto 6px",padding:"0 14px",boxSizing:"border-box"},card:CSSProperties={display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,background:"rgba(255,255,255,.04)",backdropFilter:"blur(4px)",padding:14,borderRadius:22,boxShadow:"0 14px 34px #0004"},title:CSSProperties={gridColumn:"1/-1",textAlign:"center",fontSize:26,color:"#0b2d6b",margin:"0 0 2px"},inp:CSSProperties={padding:"10px 11px",borderRadius:6,border:"1px solid rgba(255,255,255,.20)",fontSize:14,minHeight:42,width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,.08)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",color:"#ffffff",fontWeight:900},hiddenReq:CSSProperties={position:"absolute",opacity:0,pointerEvents:"none",width:1,height:1,left:0,top:0},errBorder:CSSProperties={border:"1px solid #ef4444",boxShadow:"0 0 0 3px rgba(239,68,68,.18)"},fieldErr:CSSProperties={gridColumn:"1/-1",margin:"-3px 2px 2px",color:"#fecaca",fontSize:11,fontWeight:900,textShadow:"0 1px 5px rgba(0,0,0,.55)"},ddWrap:CSSProperties={position:"relative",minWidth:0},ddBtn:CSSProperties={...inp,display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,.08)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",color:"#ffffff",fontWeight:900,textAlign:"left",cursor:"pointer",borderRadius:6},ddMenu:CSSProperties={position:"absolute",bottom:"calc(100% + 6px)",left:0,right:0,zIndex:45,background:"white",border:"1px solid #dbe5f1",borderRadius:16,boxShadow:"0 12px 26px #0002",overflow:"hidden",maxHeight:210,overflowY:"auto"},ddItem:CSSProperties={display:"block",width:"100%",padding:"10px 12px",border:0,borderBottom:"1px solid #eef2f7",background:"white",color:"#0b2d6b",fontWeight:900,textAlign:"left",fontSize:13,lineHeight:1.2},serviceMenu:CSSProperties={position:"absolute",top:"calc(100% + 6px)",left:0,width:"calc(200% + 8px)",zIndex:80,background:"rgba(15,23,42,.78)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",border:"1px solid rgba(255,255,255,.18)",borderRadius:18,boxShadow:"0 20px 60px rgba(0,0,0,.45)",padding:10},serviceGrid:CSSProperties={display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,maxHeight:280,overflowY:"auto"},serviceChip:CSSProperties={border:"1px solid rgba(255,255,255,.18)",borderRadius:999,background:"rgba(255,255,255,.08)",color:"#ffffff",fontSize:11,fontWeight:900,padding:"9px 7px",lineHeight:1.15},selectedChip:CSSProperties={background:"#0b57ff",borderColor:"#0b57ff",color:"white"},vehicleMenu:CSSProperties={position:"absolute",top:"calc(100% + 6px)",right:0,width:"calc(200% + 8px)",zIndex:80,background:"rgba(15,23,42,.78)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",border:"1px solid rgba(255,255,255,.18)",borderRadius:18,boxShadow:"0 20px 60px rgba(0,0,0,.45)",padding:8},vehicleItem:CSSProperties={width:"100%",display:"grid",gridTemplateColumns:"58px 1fr",gap:9,alignItems:"center",padding:7,border:"1px solid rgba(255,255,255,.16)",borderRadius:14,background:"rgba(255,255,255,.08)",color:"#ffffff",fontWeight:900,textAlign:"left",marginBottom:6},selectedItem:CSSProperties={borderColor:"#0b57ff",background:"#eff6ff"},vehicleImg:CSSProperties={width:58,height:38,objectFit:"contain",borderRadius:10,background:"#f8fafc"},vehicleFallback:CSSProperties={width:58,height:38,display:"grid",placeItems:"center",borderRadius:10,background:"#f8fafc",fontSize:24},calMenu:CSSProperties={position:"absolute",bottom:"calc(100% + 6px)",left:0,zIndex:40,width:292,maxWidth:"calc(100vw - 40px)",background:"rgba(15,23,42,.82)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",border:"1px solid rgba(255,255,255,.18)",borderRadius:14,boxShadow:"0 20px 60px rgba(0,0,0,.45)",overflow:"hidden"},calHead:CSSProperties={display:"grid",gridTemplateColumns:"34px 1fr 34px",alignItems:"center",padding:"8px 10px",color:"#0b2d6b"},calNav:CSSProperties={border:0,background:"white",fontSize:24,color:"#0b2d6b",fontWeight:900},calWeek:CSSProperties={display:"grid",gridTemplateColumns:"repeat(7,1fr)",padding:"4px 10px",textAlign:"center",fontSize:12,fontWeight:900,color:"#0b2d6b"},calGrid:CSSProperties={display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,padding:"4px 10px 10px"},calDay:CSSProperties={height:30,border:0,borderRadius:999,background:"white",fontWeight:800,color:"#111827",fontSize:12},calMuted:CSSProperties={color:"#94a3b8"},calToday:CSSProperties={border:"1px solid #2563eb",color:"#2563eb",background:"#eff6ff"},calSelected:CSSProperties={background:"#2563eb",color:"white",boxShadow:"0 6px 14px #2563eb55"},calFooter:CSSProperties={width:"100%",border:0,borderTop:"1px solid #e5edf7",background:"#f8fbff",padding:10,color:"#2563eb",fontWeight:900},timeMenu:CSSProperties={position:"absolute",bottom:"calc(100% + 6px)",right:0,zIndex:40,width:292,maxWidth:"calc(100vw - 40px)",background:"rgba(15,23,42,.82)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",border:"1px solid rgba(255,255,255,.18)",borderRadius:14,boxShadow:"0 20px 60px rgba(0,0,0,.45)",overflow:"hidden"},timeHead:CSSProperties={display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",color:"#0b2d6b",borderBottom:"1px solid #edf2f7"},timeClose:CSSProperties={border:0,background:"white",fontSize:20,color:"#0b2d6b"},timeGrid:CSSProperties={display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,padding:10,maxHeight:144,overflowY:"auto"},timeSlot:CSSProperties={padding:"8px 4px",border:"1px solid #dbe5f1",borderRadius:9,background:"white",color:"#0b2d6b",fontWeight:900,fontSize:12},timeSelected:CSSProperties={background:"#2563eb",color:"white",borderColor:"#2563eb"},customRow:CSSProperties={display:"grid",gridTemplateColumns:"auto 1fr 1fr 1fr auto",gap:5,alignItems:"center",padding:10,borderTop:"1px solid #edf2f7",color:"#0b2d6b",fontWeight:900,fontSize:12},miniSel:CSSProperties={height:34,border:"1px solid #dbe5f1",borderRadius:8,color:"#0b2d6b",fontWeight:900,background:"white"},miniBtn:CSSProperties={height:34,border:0,borderRadius:8,background:"#2563eb",color:"white",fontWeight:900,padding:"0 9px"},sbox:CSSProperties={position:"absolute",left:0,right:0,top:"100%",zIndex:10,background:"white",border:"1px solid #ddd",borderRadius:12},sitem:CSSProperties={display:"grid",width:"100%",padding:10,border:0,borderBottom:"1px solid #eee",background:"white",textAlign:"left"},chips:CSSProperties={gridColumn:"1/-1",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:16,padding:10},chip:CSSProperties={margin:4,padding:"8px 10px",borderRadius:999,border:"1px solid #0b2d6b",background:"white",color:"#0b2d6b",fontWeight:900},rowBtns:CSSProperties={gridColumn:"1/-1",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},dl:CSSProperties={padding:12,borderRadius:6,border:"1px solid rgba(255,255,255,.20)",background:"rgba(255,255,255,.08)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",color:"#ffffff",fontWeight:900},sendBtn:CSSProperties={padding:12,border:0,borderRadius:14,background:"#f97316",color:"white",fontWeight:900},ok:CSSProperties={background:"#dcfce7",color:"#166534",padding:12,borderRadius:14},overlay:CSSProperties={position:"fixed",inset:0,background:"#0008",zIndex:99,display:"grid",placeItems:"center",padding:12},modal:CSSProperties={width:"100%",maxWidth:430,background:"white",borderRadius:22,position:"relative",overflow:"hidden"},close:CSSProperties={position:"absolute",right:8,top:8,border:0,borderRadius:"50%",fontSize:24,background:"white"},banner:CSSProperties={width:"100%",display:"block"},grid:CSSProperties={display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},info:CSSProperties={display:"grid",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:12,padding:8},route:CSSProperties={display:"grid",gap:4,marginTop:10,padding:10,borderRadius:12,background:"#eff6ff"},actions:CSSProperties={display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10},cancel:CSSProperties={padding:12,borderRadius:14,border:"2px solid #ef4444",background:"white",color:"#ef4444",fontWeight:900},confirm:CSSProperties={padding:12,border:0,borderRadius:14,background:"#0b57ff",color:"white",fontWeight:900},sec:CSSProperties={maxWidth:1120,margin:"-8px auto 0",padding:"0 6px 6px"},svcGrid:CSSProperties={display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:-10},svc:CSSProperties={background:"white",padding:10,borderRadius:12,boxShadow:"0 4px 10px #0001"}

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
