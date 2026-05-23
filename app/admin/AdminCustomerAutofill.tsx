"use client";
import { useEffect } from "react";

type Row = Record<string, any>;
const clean = (v: any) => String(v || "").trim();
const mobile = (v: any) => { let p = clean(v).replace(/\D/g, ""); if ((p.startsWith("91") || p.startsWith("0")) && p.length > 10) p = p.slice(-10); return p.slice(-10); };
const getDate = (v: any) => { const m = clean(v).match(/(\d{4})-(\d{2})-(\d{2})/); return m ? m[0] : ""; };
const getTime = (v: any) => { const s = clean(v); const am = s.match(/(\d{1,2}:\d{2})\s*([AP]M)/i); if (am) return `${am[1].padStart(5, "0")} ${am[2].toUpperCase()}`; const h = s.match(/(\d{2}):(\d{2})/); if (!h) return ""; const hh = Number(h[1]); return `${String(hh % 12 || 12).padStart(2, "0")}:${h[2]} ${hh >= 12 ? "PM" : "AM"}`; };
const getModel = (v: any) => { const s = clean(v), x = s.toLowerCase(); if (x.includes("dzire") || x.includes("desire")) return "Desire"; if (x.includes("ertiga")) return "Ertiga"; if (x.includes("crysta")) return "Innova Crysta"; if (x.includes("innova")) return "Innova"; if (x.includes("traveller")) return "Force Traveller"; return s; };
const getType = (v: any) => { const x = clean(v).toLowerCase(); if (x.includes("dzire") || x.includes("desire") || x.includes("sedan")) return "Sedan"; if (x.includes("traveller") || x.includes("bus")) return "Mini Passenger Bus"; if (x.includes("ertiga") || x.includes("innova") || x.includes("suv")) return "SUV"; return "Sedan"; };
function input(name: string) { return Array.from(document.querySelectorAll<HTMLInputElement>(".admin-shell form input")).find((el) => (el.placeholder || "").toLowerCase().includes(name)) || null; }
function nativeSet(el: HTMLInputElement | HTMLSelectElement | null, val: string) { if (!el || !val) return; const proto = el instanceof HTMLSelectElement ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype; const d = Object.getOwnPropertyDescriptor(proto, "value"); if (d?.set) d.set.call(el, val); else el.value = val; el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); }
function selectFor(options: string[]) { return Array.from(document.querySelectorAll<HTMLSelectElement>(".admin-shell form select")).find((s) => options.some((o) => Array.from(s.options).some((x) => x.text.toLowerCase() === o.toLowerCase()))) || null; }
function match(rows: Row[], name: string, phone: string) { const n = name.toLowerCase(); const p = mobile(phone); return rows.find((r) => (p && mobile(r.customer_phone || r.mobile || r.customer_mobile || r.phone) === p) || (n.length >= 3 && clean(r.customer_name || r.name).toLowerCase().includes(n))); }
function fill(r: Row) { const veh = clean(r.vehicle_model || r.vehicle_type || r.vehicle); nativeSet(input("whatsapp"), mobile(r.customer_phone || r.mobile || r.phone)); nativeSet(input("pickup"), clean(r.pickup || r.address)); nativeSet(input("drop"), clean(r.drop_location || r.drop)); nativeSet(document.querySelector<HTMLInputElement>('.admin-shell form input[type="date"]'), getDate(r.journey_date || r.booking_date || r.date)); nativeSet(input("time"), getTime(r.journey_time || r.booking_time || r.booking_date)); nativeSet(selectFor(["Sedan", "SUV", "Mini Passenger Bus"]), getType(veh)); nativeSet(selectFor(["Desire", "Ertiga", "Innova", "Force Traveller"]), getModel(veh)); nativeSet(selectFor(["One Way Drop Pickup", "Local Movement", "Local Movment", "Outstation Movement", "Outstation Movment"]), clean(r.service)); }

export default function AdminCustomerAutofill() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const headers = { apikey: key, Authorization: `Bearer ${key}` };
    let last = "";
    async function run() {
      if (!url || !key || localStorage.getItem("vt_admin_login") !== "yes") return;
      const name = clean(input("customer name")?.value);
      const ph = clean(input("whatsapp")?.value);
      const sig = `${name}|${ph}`;
      if (sig === last || (name.length < 3 && mobile(ph).length < 10)) return;
      const res = await fetch(`${url}/rest/v1/bookings?select=*&order=created_at.desc&limit=500`, { headers });
      if (!res.ok) return;
      const row = match(await res.json(), name, ph);
      if (row) { last = sig; fill(row); }
    }
    const timer = window.setInterval(run, 1500);
    document.addEventListener("blur", run, true);
    document.addEventListener("change", run, true);
    document.addEventListener("touchstart", run, true);
    return () => { window.clearInterval(timer); document.removeEventListener("blur", run, true); document.removeEventListener("change", run, true); document.removeEventListener("touchstart", run, true); };
  }, []);
  return null;
}
