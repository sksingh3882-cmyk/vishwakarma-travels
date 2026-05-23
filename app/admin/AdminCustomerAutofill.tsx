"use client";
import { useEffect, useRef } from "react";

type R = Record<string, any>;
const txt = (v: any) => String(v || "").trim();
const phone = (v: any) => { let p = txt(v).replace(/\D/g, ""); if ((p.startsWith("91") || p.startsWith("0")) && p.length > 10) p = p.slice(-10); return p.slice(-10); };
const dateOnly = (v: any) => { const s = txt(v); const m = s.match(/(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[1]}-${m[2]}-${m[3]}` : ""; };
const timeOnly = (v: any) => { const s = txt(v); const ap = s.match(/(\d{1,2}:\d{2})\s*([AP]M)/i); if (ap) return `${ap[1].padStart(5, "0")} ${ap[2].toUpperCase()}`; const hm = s.match(/(\d{2}):(\d{2})/); if (!hm) return ""; const h = Number(hm[1]), mm = hm[2]; return `${String(h % 12 || 12).padStart(2, "0")}:${mm} ${h >= 12 ? "PM" : "AM"}`; };
const model = (v: any) => { const s = txt(v), m = s.toLowerCase(); if (m.includes("dzire") || m.includes("desire")) return "Desire"; if (m.includes("ertiga")) return "Ertiga"; if (m.includes("crysta")) return "Innova Crysta"; if (m.includes("innova")) return "Innova"; if (m.includes("traveller") || m.includes("force")) return "Force Traveller"; return s; };
const type = (v: any) => { const m = txt(v).toLowerCase(); if (m.includes("dzire") || m.includes("desire") || m.includes("sedan")) return "Sedan"; if (m.includes("traveller") || m.includes("bus")) return "Mini Passenger Bus"; if (m.includes("ertiga") || m.includes("innova") || m.includes("suv")) return "SUV"; return "Sedan"; };
function inp(ph: string) { return Array.from(document.querySelectorAll<HTMLInputElement>(".admin-shell form input")).find(i => (i.placeholder || "").toLowerCase().includes(ph)) || null; }
function sel(opts: string[]) { return Array.from(document.querySelectorAll<HTMLSelectElement>(".admin-shell form select")).find(s => opts.some(o => Array.from(s.options).some(x => x.text.toLowerCase() === o.toLowerCase()))) || null; }
function setVal(el: HTMLInputElement | HTMLSelectElement | null, v: string) { if (!el || !v) return; const proto = el instanceof HTMLInputElement ? window.HTMLInputElement.prototype : window.HTMLSelectElement.prototype; const d = Object.getOwnPropertyDescriptor(proto, "value"); if (d?.set) d.set.call(el, v); else el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); const span = (el.previousElementSibling as HTMLElement | null)?.querySelector(".vt-custom-select-btn span") as HTMLElement | null; if (span) span.textContent = v; }
function find(rows: R[], name: string, mobile: string) { const n = name.toLowerCase(), p = phone(mobile); return rows.find(r => { const rn = txt(r.customer_name || r.name).toLowerCase(); const rp = phone(r.customer_phone || r.mobile || r.phone); return (p && rp === p) || (n.length >= 3 && rn && (rn === n || rn.includes(n) || n.includes(rn))); }); }

export default function AdminCustomerAutofill() {
  const rows = useRef<R[]>([]), customers = useRef<R[]>([]);
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
    async function load() { if (!url || !key || localStorage.getItem("vt_admin_login") !== "yes") return; const [b, c] = await Promise.all([fetch(`${url}/rest/v1/bookings?select=*&order=created_at.desc&limit=500`, { headers }), fetch(`${url}/rest/v1/customers?select=*`, { headers })]); if (b.ok) rows.current = await b.json(); if (c.ok) customers.current = await c.json(); }
    function fill() { const ni = inp("customer name"), pi = inp("whatsapp"); if (!ni) return; const n = txt(ni.value), p = txt(pi?.value); if (n.length < 3 && phone(p).length < 10) return; const b = find(rows.current, n, p), c = find(customers.current, n, p); if (!b && !c) return; const veh = txt(b?.vehicle_model || b?.vehicle_type || b?.vehicle); setVal(pi, phone(b?.customer_phone || b?.mobile || c?.mobile || c?.phone || p)); setVal(inp("pickup"), txt(b?.pickup || b?.address || c?.address)); setVal(inp("drop"), txt(b?.drop_location || b?.drop)); setVal(document.querySelector<HTMLInputElement>('.admin-shell form input[type="date"]'), dateOnly(b?.journey_date || b?.booking_date || b?.date)); setVal(inp("time"), timeOnly(b?.journey_time || b?.booking_time || b?.booking_date)); setVal(sel(["Sedan", "SUV", "Mini Passenger Bus"]), type(veh)); setVal(sel(["Desire", "Ertiga", "Innova", "Force Traveller"]), model(veh)); setVal(sel(["One Way Drop Pickup", "Local Movment", "Outstation Movment"]), txt(b?.service)); }
    const run = () => setTimeout(fill, 700);
    load().then(run); const t = setInterval(() => load().then(fill), 5000); document.addEventListener("blur", run, true); document.addEventListener("mousedown", run, true); document.addEventListener("touchstart", run, true); document.addEventListener("change", run, true); return () => { clearInterval(t); document.removeEventListener("blur", run, true); document.removeEventListener("mousedown", run, true); document.removeEventListener("touchstart", run, true); document.removeEventListener("change", run, true); };
  }, []);
  return null;
}
