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
 return <main style={page}><header style={head}><a href="/" style={{display:"flex",gap:6,textDecoration:"none",alignItems:"center"}}><img src="/cars/vt-logo.png" style={{width:42,height:42,objectFit:"contain"}} alt="Vishwakarma Travels" /><div><h1 style={logo1}>VISHWAKARMA</h1><p style={logo2}>TRAVELS</p></div></a></header><section style={hero}><img src="/cars/banner.jpg" style={{width:"100%",borderRadius:16,boxShadow:"0 6px 18px #0002",display:"block"}}/></section></main>}
const page:CSSProperties={minHeight:"100vh",background:"linear-gradient(135deg,#f7fbff 0%,#eef5fb 52%,#fff8ed 100%)",fontFamily:"Arial,sans-serif"},head:CSSProperties={maxWidth:1120,margin:"0 auto",padding:"4px 12px 4px"},logo1:CSSProperties={margin:0,color:"#f97316",fontSize:"clamp(20px,6vw,34px)",lineHeight:1},logo2:CSSProperties={margin:0,color:"#0b2d6b",fontWeight:900,fontSize:"clamp(12px,3.8vw,20px)"},hero:CSSProperties={maxWidth:1120,margin:"0 auto",padding:"0 8px 6px"};
