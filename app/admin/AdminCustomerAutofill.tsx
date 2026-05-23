"use client";
import { useEffect } from "react";

type Row = Record<string, any>;
const clean = (v: any) => String(v || "").trim();
const mobile = (v: any) => String(v || "").replace(/\D/g, "").slice(-10);
function input(name: string) { return Array.from(document.querySelectorAll<HTMLInputElement>(".admin-shell form input")).find((el) => (el.placeholder || "").toLowerCase().includes(name)) || null; }
function nativeSet(el: HTMLInputElement | HTMLSelectElement | null, val: string) { if (!el) return; const proto = el instanceof HTMLSelectElement ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype; const d = Object.getOwnPropertyDescriptor(proto, "value"); if (d?.set) d.set.call(el, val); else el.value = val; el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); const span = (el.previousElementSibling as HTMLElement | null)?.querySelector(".vt-custom-select-btn span") as HTMLElement | null; if (span) span.textContent = val || "Select"; }
function setSelect(options: string[], val: string) { const s = Array.from(document.querySelectorAll<HTMLSelectElement>(".admin-shell form select")).find((el) => options.some((o) => Array.from(el.options).some((x) => x.text.toLowerCase() === o.toLowerCase()))); nativeSet(s || null, val); }
function match(rows: Row[], name: string, phone: string) { const n = name.toLowerCase(); const p = mobile(phone); return rows.find((r) => (p && mobile(r.mobile || r.phone) === p) || (n.length >= 3 && clean(r.name).toLowerCase().includes(n))); }
function fill(r: Row) { nativeSet(input("whatsapp"), mobile(r.mobile || r.phone)); nativeSet(input("pickup"), clean(r.address)); nativeSet(input("drop"), clean(r.drop_location)); nativeSet(document.querySelector<HTMLInputElement>('.admin-shell form input[type="date"]'), clean(r.journey_date)); nativeSet(input("time"), clean(r.journey_time)); setSelect(["Sedan", "SUV", "Mini Passenger Bus"], clean(r.vehicle_type)); setSelect(["Desire", "Ertiga", "Innova", "Force Traveller"], clean(r.vehicle_model)); setSelect(["One Way Drop Pickup", "Local Movement", "Local Movment", "Outstation Movement", "Outstation Movment"], clean(r.service)); }
function clearAuto() { nativeSet(input("pickup"), ""); nativeSet(input("drop"), ""); nativeSet(document.querySelector<HTMLInputElement>('.admin-shell form input[type="date"]'), ""); nativeSet(input("time"), ""); setSelect(["Sedan", "SUV", "Mini Passenger Bus"], "Sedan"); setSelect(["Desire", "Ertiga", "Innova", "Force Traveller"], "Desire"); setSelect(["One Way Drop Pickup", "Local Movement", "Local Movment", "Outstation Movement", "Outstation Movment"], "One Way Drop Pickup"); }

export default function AdminCustomerAutofill() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    let last = "";
    async function run() {
      if (!url || !key || localStorage.getItem("vt_admin_login") !== "yes") return;
      const name = clean(input("customer name")?.value);
      const ph = clean(input("whatsapp")?.value);
      const sig = `${name}|${ph}`;
      if (sig === last || (name.length < 3 && mobile(ph).length < 10)) return;
      const res = await fetch(`${url}/rest/v1/customers?select=*&order=created_at.desc&limit=500`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
      if (!res.ok) return;
      const row = match(await res.json(), name, ph);
      if (row) { last = sig; fill(row); }
    }
    const timer = window.setInterval(run, 1500);
    return () => window.clearInterval(timer);
  }, []);
  return <button type="button" onClick={clearAuto} style={{position:"fixed",right:14,bottom:72,zIndex:99999,border:0,borderRadius:14,background:"#ef4444",color:"white",padding:"10px 12px",fontWeight:900,boxShadow:"0 8px 22px rgba(0,0,0,.18)"}}>Clear Autofill</button>;
}
