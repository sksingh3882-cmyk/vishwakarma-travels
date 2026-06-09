"use client";
import {useEffect} from "react";
type Row=Record<string,any>;
const clean=(v:any)=>String(v||"").trim();
const mobile=(v:any)=>String(v||"").replace(/\D/g,"").slice(-10);
const isoDate=(v:any)=>{const s=clean(v);let m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);if(m)return `${m[1]}-${m[2]}-${m[3]}`;m=s.match(/^(\d{2})-(\d{2})-(\d{4})/);return m?`${m[3]}-${m[2]}-${m[1]}`:s};
const showDate=(v:any)=>{const s=isoDate(v),m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?`${m[3]}-${m[2]}-${m[1]}`:s};
const vehicleModel=(model:any)=>{const m=clean(model).toLowerCase();if(m.includes("traveller")||m.includes("traveler")||m.includes("tempo"))return "Force Traveller";if(m.includes("crysta"))return "Innova Crysta";if(m.includes("innova"))return "Innova";if(m.includes("ertiga"))return "Ertiga";if(m.includes("dzire")||m.includes("desire"))return "Desire";return clean(model)};
const vehicleTypeFromModel=(model:any,savedType?:any)=>{const saved=clean(savedType);if(saved)return saved;const m=vehicleModel(model).toLowerCase();if(m.includes("traveller")||m.includes("traveler")||m.includes("tempo"))return "Mini Passenger Bus";if(m.includes("ertiga")||m.includes("innova")||m.includes("crysta"))return "SUV";return "Sedan"};
function input(name:string){return Array.from(document.querySelectorAll<HTMLInputElement>(".admin-shell form input")).find(el=>(el.placeholder||"").toLowerCase().includes(name))||null}
function refreshPicker(el:HTMLInputElement|HTMLSelectElement|null,label:string){const span=(el?.previousElementSibling as HTMLElement|null)?.querySelector(".vt-custom-select-btn span") as HTMLElement|null;if(span)span.textContent=label}
function nativeSet(el:HTMLInputElement|HTMLSelectElement|null,val:string,label?:string){if(!el)return;const proto=el instanceof HTMLSelectElement?window.HTMLSelectElement.prototype:window.HTMLInputElement.prototype;const d=Object.getOwnPropertyDescriptor(proto,"value");if(d?.set)d.set.call(el,val);else el.value=val;el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));refreshPicker(el,label||val||"Select");window.setTimeout(()=>{if(d?.set)d.set.call(el,val);else el.value=val;el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));refreshPicker(el,label||val||"Select")},120)}
function setSelect(options:string[],val:string){const s=Array.from(document.querySelectorAll<HTMLSelectElement>(".admin-shell form select")).find(el=>options.some(o=>Array.from(el.options).some(x=>x.text.toLowerCase()===o.toLowerCase())));nativeSet(s||null,val)}
function match(rows:Row[],name:string,phone:string){const n=name.toLowerCase(),p=mobile(phone);return rows.find(r=>(p&&mobile(r.mobile||r.phone)===p)||(n.length>=3&&clean(r.name).toLowerCase().includes(n)))}
function fill(r:Row){
  nativeSet(input("whatsapp"),mobile(r.mobile||r.phone));
  nativeSet(input("pickup"),clean(r.address));
}
function clearAuto(){
  nativeSet(input("pickup"),"");
}
export default function AdminCustomerAutofill(){useEffect(()=>{const url=process.env.NEXT_PUBLIC_SUPABASE_URL||"",key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"";let last="";async function run(){if(!url||!key||localStorage.getItem("vt_admin_login")!=="yes")return;const name=clean(input("customer name")?.value),ph=clean(input("whatsapp")?.value),sig=`${name}|${ph}`;if(sig===last||(name.length<3&&mobile(ph).length<10))return;const res=await fetch(`${url}/rest/v1/customers?select=*&order=created_at.desc&limit=500`,{headers:{apikey:key,Authorization:"Bearer "+key}});if(!res.ok)return;const row=match(await res.json(),name,ph);if(row){last=sig;fill(row)}}const timer=window.setInterval(run,1500);return()=>window.clearInterval(timer)},[]);return null;}
