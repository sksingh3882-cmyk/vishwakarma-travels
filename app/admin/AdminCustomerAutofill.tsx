"use client";
import { useEffect } from "react";

type R = Record<string, any>;
const txt = (v: any) => String(v || "").trim();
const phone = (v: any) => { let p = txt(v).replace(/\D/g, ""); if ((p.startsWith("91") || p.startsWith("0")) && p.length > 10) p = p.slice(-10); return p.slice(-10); };
const dateOnly = (v: any) => { const s = txt(v); const m = s.match(/(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[1]}-${m[2]}-${m[3]}` : ""; };
const timeOnly = (v: any) => { const s = txt(v); const ap = s.match(/(\d{1,2}:\d{2})\s*([AP]M)/i); if (ap) return `${ap[1].padStart(5, "0")} ${ap[2].toUpperCase()}`; return s; };
function inp(ph: string) { return Array.from(document.querySelectorAll<HTMLInputElement>("input")).find(i => (i.placeholder || "").toLowerCase().includes(ph)) || null; }
function setVal(el: HTMLInputElement | null, v: string) { if (!el || !v) return; const d = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value"); if (d?.set) d.set.call(el, v); else el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); }

export default function AdminCustomerAutofill() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const headers = { apikey: key, Authorization: `Bearer ${key}` };

    async function fill() {
      if (!url || !key || localStorage.getItem("vt_admin_login") !== "yes") return;
      const nameInput = inp("customer name");
      const phoneInput = inp("whatsapp");
      if (!nameInput) return;

      const name = txt(nameInput.value);
      const mob = phone(phoneInput?.value);
      if (name.length < 3 && mob.length < 10) return;

      let booking: R | null = null;

      if (mob.length === 10) {
        const r = await fetch(`${url}/rest/v1/bookings?select=*&customer_phone=eq.${mob}&order=created_at.desc&limit=1`, { headers });
        if (r.ok) {
          const j = await r.json();
          booking = j?.[0] || null;
        }
      }

      if (!booking && name.length >= 3) {
        const r = await fetch(`${url}/rest/v1/bookings?select=*&customer_name=ilike.*${encodeURIComponent(name)}*&order=created_at.desc&limit=1`, { headers });
        if (r.ok) {
          const j = await r.json();
          booking = j?.[0] || null;
        }
      }

      if (!booking) return;

      setVal(phoneInput, phone(booking.customer_phone));
      setVal(inp("pickup"), txt(booking.pickup));
      setVal(inp("drop"), txt(booking.drop_location));
      setVal(document.querySelector('input[type="date"]') as HTMLInputElement, dateOnly(booking.journey_date));
      setVal(inp("time"), timeOnly(booking.journey_time));

      const selects = Array.from(document.querySelectorAll("select"));
      if (selects[1]) {
        (selects[1] as HTMLSelectElement).value = booking.vehicle_type || "Sedan";
        selects[1].dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (selects[2]) {
        (selects[2] as HTMLSelectElement).value = booking.vehicle_model || "Desire";
        selects[2].dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (selects[3]) {
        (selects[3] as HTMLSelectElement).value = booking.service || "One Way Drop Pickup";
        selects[3].dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    const run = () => setTimeout(fill, 800);
    document.addEventListener("blur", run, true);
    document.addEventListener("change", run, true);
    document.addEventListener("touchstart", run, true);

    return () => {
      document.removeEventListener("blur", run, true);
      document.removeEventListener("change", run, true);
      document.removeEventListener("touchstart", run, true);
    };
  }, []);

  return null;
}
