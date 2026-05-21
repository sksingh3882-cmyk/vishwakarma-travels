"use client";
import {useEffect,useState,type FormEvent,type CSSProperties} from "react";
import CustomerCover from "@/components/CustomerCover";
const phone="917667989203";
type F={name:string;mobile:string;service:string;vehicle:string;pickup:string;drop:string;bookingDate:string;bookingTime:string};
const empty:F={name:"",mobile:"",service:"",vehicle:"",pickup:"",drop:"",bookingDate:"",bookingTime:""};
const cleanPhone=(v:string)=>{let p=String(v||"").replace(/\D/g,"");if((p.startsWith("91")||p.startsWith("0"))&&p.length>10)p=p.slice(-10);return p.slice(-10)};
const fmt=(v:string)=>v&&v.includes("-")?v.split("-").reverse().join("-"):v||"";
export default function Home(){
 const [showCover,setShowCover]=useState(true);
 const [form,setForm]=useState<F>(empty),[customers,setCustomers]=useState<any[]>([]),[bookings,setBookings]=useState<any[]>([]),[showSug,setShowSug]=useState(false),[pending,setPending]=useState<any>(null),[notice,setNotice]=useState(false);
 const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL||"",supabaseKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"";
 const headers={apikey:supabaseKey,Authorization:`Bearer ${supabaseKey}`,"Content-Type":"application/json"};
 useEffect(()=>{(async()=>{if(!supabaseUrl||!supabaseKey)return;const [c,b]=await Promise.all([fetch(`${supabaseUrl}/rest/v1/customers?select=*`,{headers}),fetch(`${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc&limit=200`,{headers})]);if(c.ok)setCustomers(await c.json());if(b.ok)setBookings(await b.json())})().catch(console.log)},[]);
 const set=(k:keyof F,v:string)=>setForm(p=>({...p,[k]:v}));
 const apply=(c:any)=>{setForm(p=>({...p,name:c.name||p.name,mobile:cleanPhone(c.mobile||c.phone||p.mobile),pickup:c.address||p.pickup}));setShowSug(false)};
 const find=()=>{const n=form.name.toLowerCase().trim(),m=cleanPhone(form.mobile);const f=customers.find(c=>(n&&(c.name||"").toLowerCase().trim()===n)||(m&&cleanPhone(c.mobile||c.phone||"")===m));if(f)apply(f)};
 const q=`${form.name} ${form.mobile}`.toLowerCase().trim();
 const suggestions=q.length<2?[]:customers.filter(c=>`${c.name||""} ${c.mobile||c.phone||""} ${c.address||""}`.toLowerCase().includes(q)||cleanPhone(c.mobile||c.phone||"").includes(cleanPhone(form.mobile))).slice(0,6);
 const oldDrops=Array.from(new Set(bookings.filter(b=>{const bp=cleanPhone(b.customer_phone||b.mobile||b.customer_mobile||"");const bn=String(b.customer_name||b.name||"").toLowerCase();return(bp&&bp===cleanPhone(form.mobile))||(form.name&&bn.includes(form.name.toLowerCase()))}).map(b=>b.drop_location||b.drop||"").filter(Boolean))).slice(0,8);
 const data=()=>{const mobile=cleanPhone(form.mobile);return{...form,mobile,message:`Hello Vishwakarma Travels,\n\nI would like to book a cab.\n\nName: ${form.name}\nMobile: ${mobile}\nService: ${form.service}\nVehicle: ${form.vehicle}\nPickup: ${form.pickup}\nDrop: ${form.drop}\nDate: ${form.bookingDate}\nTime: ${new Date(`2000-01-01T${form.bookingTime}`).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true})}\n\nPlease share the booking confirmation details.\n\nThank you.`}};
 function submit(e:FormEvent){e.preventDefault();setPending(data())}
 async function send(){if(!pending)return;if(supabaseUrl&&supabaseKey){await fetch(`${supabaseUrl}/rest/v1/customers`,{method:"POST",headers:{...headers,Prefer:"resolution=merge-duplicates"},body:JSON.stringify({name:pending.name,mobile:pending.mobile,address:pending.pickup})});await fetch(`${supabaseUrl}/rest/v1/bookings`,{method:"POST",headers:{...headers,Prefer:"return=minimal"},body:JSON.stringify({customer_name:pending.name,customer_phone:pending.mobile,mobile:pending.mobile,service:pending.service,vehicle_type:pending.vehicle,vehicle_model:pending.vehicle,pickup:pending.pickup,drop_location:pending.drop,booking_date:`${pending.bookingDate} ${pending.bookingTime}`,address:pending.pickup,status:"Pending"})})}window.open(`https://wa.me/${phone}?text=${encodeURIComponent(pending.message)}`,"_blank");setPending(null)}
 function downloadCopy(){const d=data();if(!d.name||!d.mobile||!d.pickup||!d.drop)return alert("Please fill name, mobile number, pickup and drop location to download booking copy.");const c=document.createElement("canvas");c.width=1080;c.height=1920;const x=c.getContext("2d");if(!x)return;const wrap=(t:string,xx:number,y:number,w:number,lh:number)=>{let line="";for(const word of String(t||"-").split(" ")){const test=line+word+" ";if(x.measureText(test).width>w&&line){x.fillText(line.trim(),xx,y);line=word+" ";y+=lh}else line=test}x.fillText(line.trim(),xx,y);return y};const row=(l:string,v:string,y:number)=>{x.fillStyle="#0b2d6b";x.font="bold 38px 'Times New Roman', Times, serif";x.fillText(l,95,y);x.fillStyle="#111";x.font="38px 'Times New Roman', Times, serif";const ly=wrap(v,430,y,690,42);return Math.max(y+72,ly+38)};const rr=(a:number,b:number,w:number,h:number,r:number)=>{x.beginPath();x.roundRect(a,b,w,h,r);x.fill()};x.fillStyle="#f4f7fb";x.fillRect(0,0,1080,1920);x.fillStyle="#fff";rr(18,18,1044,1884,28);const draw=()=>{x.fillStyle="#fff7ed";rr(60,560,230,58,25);x.fillStyle="#ea580c";x.font="bold 34px 'Times New Roman', Times, serif";x.fillText("Booking Copy",86,599);x.fillStyle="#0b2d6b";x.font="bold 58px 'Times New Roman', Times, serif";x.fillText("Vishwakarma Travels",78,700);x.fillStyle="#64748b";x.font="35px 'Times New Roman', Times, serif";x.fillText("Your ride booking details",80,748);let y=800;y=row("Customer Name",d.name,y);y=row("Mobile",d.mobile,y);y=row("Service",d.service,y);y=row("Vehicle",d.vehicle,y);y=row("Pickup",d.pickup,y);y=row("Drop",d.drop,y);y=row("Date",fmt(d.bookingDate),y);y=row("Time",new Date(`2000-01-01T${d.bookingTime}`).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}),y); const dy=y-10;x.fillStyle="#087a31";x.font="bold 36px 'Times New Roman', Times, serif";x.fillText("Declaration",95,dy);x.strokeStyle="#087a31";x.lineWidth=6;x.beginPath();x.moveTo(75,dy+28);x.lineTo(1005,dy+28);x.stroke();x.fillStyle="#111";x.font="33px 'Times New Roman', Times, serif";let yy=dy+70;for(const t of ["Book A Cab Atleast 24 Hour Before Travelling Otherwise Booking May Not Be Confirmed","After the booking is Confirmed , Customer will have to make the Advance Payment","Rs.500 Cancellation Charge will have to be paid on Cancellation of Booking under any Circumtances"]){x.fillText("*",100,yy);yy=wrap(t,145,yy,830,48)+65}x.strokeStyle="#111";x.lineWidth=4;x.fillStyle="#0b2d6b";x.textAlign="center";x.font="bold 26px 'Times New Roman', Times, serif";const fy=yy+10;x.fillText("Thank You And Wish You A Very Happy Journey",540,fy);x.font="bold 32px 'Times New Roman', Times, serif";x.fillText("Vishwakarma Travels",540,fy+50);const a=document.createElement("a");a.href=c.toDataURL("image/jpeg",.95);a.download=`Vishwakarma-Booking-${Date.now()}.jpg`;a.click();setNotice(true);setTimeout(()=>setNotice(false),3500)};const img=new Image();img.crossOrigin="anonymous";img.onload=()=>{x.drawImage(img,42,42,996,480);draw()};img.onerror=draw;img.src="/cars/popup_banner.png"}
 return <main style={page}>{showCover&&<CustomerCover onContinue={(profile)=>{setForm(p=>({...p,name:profile.name||p.name,mobile:cleanPhone(profile.mobile||p.mobile),pickup:profile.address||p.pickup}));setShowCover(false)}}/>}{pending&&<div style={overlay}><div style={modal}><button onClick={()=>setPending(null)} style={close}>×</button><img src="/cars/popup_banner.png" style={banner}/><div style={{padding:14}}><h2 style={{color:"#0b2d6b",margin:0}}>Confirm Your Ride Details</h2><p>Please check details before WhatsApp submit.</p><div style={grid}>{["name","mobile","service","vehicle","bookingDate","bookingTime"].map(k=><div style={info} key={k}><b>{k}</b><span>{pending[k]}</span></div>)}</div><div style={route}><b>Pickup</b><span>{pending.pickup}</span><b>Drop</b><span>{pending.drop}</span></div><div style={actions}><button onClick={()=>setPending(null)} style={cancel}>Cancel</button><button onClick={send} style={confirm}>Confirm & Submit</button></div></div></div></div>}
 <header style={head}><a href="/" style={{display:"flex",gap:10,textDecoration:"none"}}><div style={mark}>V</div><div><h1 style={logo1}>VISHWAKARMA</h1><p style={logo2}>TRAVELS</p></div></a></header><section style={hero}><img src="/cars/banner.jpg" style={{width:"100%",borderRadius:28,boxShadow:"0 12px 35px #0002"}}/></section><section style={wrap}><form id="booking-form" onSubmit={submit} style={card}><h2 style={title}>Book Your Ride</h2><p>For Booking Please Fill The Details Below.</p><div style={{position:"relative"}}><input placeholder="Your Name" value={form.name} onFocus={()=>setShowSug(true)} onChange={e=>{set("name",e.target.value);setShowSug(true)}} onBlur={()=>setTimeout(()=>{find();setShowSug(false)},180)} style={inp} required/>{showSug&&suggestions.length>0&&<div style={sbox}>{suggestions.map((c,i)=><button key={i} type="button" onMouseDown={()=>apply(c)} style={sitem}><b>{c.name}</b><span>{cleanPhone(c.mobile||c.phone||"")}</span><small>{c.address}</small></button>)}</div>}</div><input placeholder="Mobile Number" value={form.mobile} onChange={e=>set("mobile",cleanPhone(e.target.value))} onBlur={find} style={inp} required/><select value={form.service} onChange={e=>set("service",e.target.value)} style={inp} required><option value="">Select Service</option><option>One Way Drop Pickup</option><option>Same Day Fair</option><option>Local Movement</option><option>Outstation Movement</option><option>Short Time Booking</option><option>Marriage Function Booking</option><option>Tour Package Service</option></select><select value={form.vehicle} onChange={e=>set("vehicle",e.target.value)} style={inp} required><option value="">Select Vehicle</option><option>Dzire</option><option>Ertiga</option><option>Innova</option><option>Innova Crysta</option><option>Traveller</option></select><input placeholder="Pickup Location" value={form.pickup} onChange={e=>set("pickup",e.target.value)} style={inp} required/><input placeholder="Drop Location" value={form.drop} onChange={e=>set("drop",e.target.value)} style={inp} required/>{oldDrops.length>0&&<div style={chips}><b>Old Drop Locations</b><div>{oldDrops.map(d=><button type="button" key={d} onClick={()=>set("drop",d)} style={chip}>{d}</button>)}</div></div>}<input type="date" value={form.bookingDate} onChange={e=>set("bookingDate",e.target.value)} style={inp} required/><input type="time" value={form.bookingTime} onChange={e=>set("bookingTime",e.target.value)} style={inp} required/><div style={rowBtns}><button type="button" onClick={downloadCopy} style={dl}>↧ Download Booking Copy</button><button type="submit" style={sendBtn}>Send Booking Request</button></div>{notice&&<div style={ok}>✓ Booking copy downloaded successfully!</div>}</form></section><section style={sec}><h2 style={title}>Our Services</h2><div style={svcGrid}>{["One Way Drop Pickup","Local Movement","Outstation Movement","Short Trip & Hourly Booking"].map(s=>
<div
  key={s}
  style={{...svc,cursor:"pointer"}}
  onClick={()=>{
    if(s==="One Way Drop Pickup"){
      window.location.href="/airport-drop";
      return;
    }

    set("service",s);

    document
      .getElementById("booking-form")
      ?.scrollIntoView({behavior:"smooth"});
  }}
><h3>{s}</h3><div style={{display:"flex",alignItems:"center",gap:8,color:"#64748b",marginTop:10}}>

<span style={{fontSize:22}}>
{
s==="One Way Drop Pickup"
? "✈️"

: s==="Local Movement"
? "🚖"

: s==="Outstation Movement"
? "🛣️"

: "⏱️"
}
</span>

<p style={{margin:0}}>
{
s==="One Way Drop Pickup"
? "Airport & city drop service"

: s==="Local Movement"
? "Local cab for daily travel"

: s==="Outstation Movement"
? "Outstation taxi booking"

: "Short trip & hourly booking"
}
</p>

</div></div>)}</div></section><footer style={{textAlign:"center",padding:30}}>Vishwakarma Travels</footer></main>}
const page:CSSProperties={minHeight:"100vh",background:"#f4f7fb",fontFamily:"Arial,sans-serif"},head:CSSProperties={maxWidth:1120,margin:"0 auto",padding:16},mark:CSSProperties={width:52,height:52,borderRadius:14,display:"grid",placeItems:"center",background:"#f97316",color:"white",fontSize:34,fontWeight:900},logo1:CSSProperties={margin:0,color:"#f97316"},logo2:CSSProperties={margin:0,color:"#0b2d6b",fontWeight:900},hero:CSSProperties={maxWidth:1120,margin:"0 auto",padding:"0 16px 88px"},wrap:CSSProperties={maxWidth:760,margin:"-72px auto 18px",padding:"0 16px"},card:CSSProperties={display:"grid",gap:13,background:"white",padding:20,borderRadius:26,boxShadow:"0 18px 45px #0002"},title:CSSProperties={textAlign:"center",fontSize:30,color:"#0b2d6b"},inp:CSSProperties={padding:15,borderRadius:15,border:"1px solid #cbd5e1",fontSize:16},sbox:CSSProperties={position:"absolute",left:0,right:0,top:"100%",zIndex:10,background:"white",border:"1px solid #ddd",borderRadius:12},sitem:CSSProperties={display:"grid",width:"100%",padding:10,border:0,borderBottom:"1px solid #eee",background:"white",textAlign:"left"},chips:CSSProperties={background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:16,padding:10},chip:CSSProperties={margin:4,padding:"8px 10px",borderRadius:999,border:"1px solid #0b2d6b",background:"white",color:"#0b2d6b",fontWeight:900},rowBtns:CSSProperties={display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},dl:CSSProperties={padding:12,borderRadius:14,border:"2px solid #f97316",background:"white",color:"#f97316",fontWeight:900},sendBtn:CSSProperties={padding:12,border:0,borderRadius:14,background:"#f97316",color:"white",fontWeight:900},ok:CSSProperties={background:"#dcfce7",color:"#166534",padding:12,borderRadius:14},overlay:CSSProperties={position:"fixed",inset:0,background:"#0008",zIndex:99,display:"grid",placeItems:"center",padding:12},modal:CSSProperties={width:"100%",maxWidth:430,background:"white",borderRadius:22,position:"relative",overflow:"hidden"},close:CSSProperties={position:"absolute",right:8,top:8,border:0,borderRadius:"50%",fontSize:24,background:"white"},banner:CSSProperties={width:"100%",display:"block"},grid:CSSProperties={display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},info:CSSProperties={display:"grid",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:12,padding:8},route:CSSProperties={display:"grid",gap:4,marginTop:10,padding:10,borderRadius:12,background:"#eff6ff"},actions:CSSProperties={display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10},cancel:CSSProperties={padding:12,borderRadius:14,border:"2px solid #ef4444",background:"white",color:"#ef4444",fontWeight:900},confirm:CSSProperties={padding:12,border:0,borderRadius:14,background:"#0b57ff",color:"white",fontWeight:900},sec:CSSProperties={maxWidth:1120,margin:"0 auto",padding:16},svcGrid:CSSProperties={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:14},svc:CSSProperties={background:"white",padding:18,borderRadius:18,boxShadow:"0 8px 20px #0001"};
