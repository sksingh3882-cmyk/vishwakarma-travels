"use client";

import { useEffect } from "react";

const slotTimes = Array.from({ length: 30 }, (_, i) => {
  const hour24 = 7 + Math.floor(i / 2);
  const minute = i % 2 ? 30 : 0;
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm}`;
});

function setReactInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function isTimeTrigger(el: HTMLElement) {
  const text = (el.textContent || "").toLowerCase();
  if (text.includes("select time") || text.includes("🕘")) return true;
  if (el instanceof HTMLInputElement) return (el.placeholder || "").toLowerCase().includes("time");
  return false;
}

export default function AdminTimePickerEnhancer() {
  useEffect(() => {
    if (!window.location.pathname.startsWith("/admin")) return;

    let activeControl: HTMLElement | null = null;
    let activeInput: HTMLInputElement | null = null;

    const host = document.createElement("div");
    host.setAttribute("data-vt-admin-time-popup", "true");
    host.style.cssText = "position:fixed;z-index:2147483647;display:none;width:292px;max-width:calc(100vw - 32px);";
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        *{box-sizing:border-box;font-family:Arial,sans-serif}
        .card{width:292px;max-width:calc(100vw - 32px);background:white;border:1px solid #dbe5f1;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,.16);overflow:hidden}
        .head{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;color:#0b2d6b;border-bottom:1px solid #edf2f7;font-weight:900;font-size:14px}
        .close{border:0;background:white;font-size:20px;color:#0b2d6b;font-weight:900;line-height:1}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:10px;max-height:144px;overflow-y:auto}
        .slot{padding:8px 4px;border:1px solid #dbe5f1;border-radius:9px;background:white;color:#0b2d6b;font-weight:900;font-size:12px;line-height:1.1}
        .slot:hover,.slot.active{background:#2563eb;color:white;border-color:#2563eb}
        .custom{display:grid;grid-template-columns:auto 1fr 1fr 1fr auto;gap:5px;align-items:center;padding:10px;border-top:1px solid #edf2f7;color:#0b2d6b;font-weight:900;font-size:12px}
        select{height:34px;border:1px solid #dbe5f1;border-radius:8px;color:#0b2d6b;font-weight:900;background:white;min-width:0}
        .done{height:34px;border:0;border-radius:8px;background:#2563eb;color:white;font-weight:900;padding:0 9px}
      </style>
      <div class="card">
        <div class="head"><b>🕘 Select Time</b><button type="button" class="close" data-close>×</button></div>
        <div class="grid">${slotTimes.map((t) => `<button type="button" class="slot" data-time="${t}">${t}</button>`).join("")}</div>
        <div class="custom"><span>Custom</span><select data-h>${Array.from({ length: 12 }, (_, i) => `<option>${String(i + 1).padStart(2, "0")}</option>`).join("")}</select><select data-m>${Array.from({ length: 60 }, (_, i) => `<option ${i === 40 ? "selected" : ""}>${String(i).padStart(2, "0")}</option>`).join("")}</select><select data-ap><option>AM</option><option>PM</option></select><button type="button" class="done" data-done>Done</button></div>
      </div>`;

    function closePopup() {
      host.style.display = "none";
      activeControl = null;
      activeInput = null;
    }

    function findInputNear(el: HTMLElement | null) {
      const form = el?.closest("form") || document.querySelector("form");
      return form?.querySelector<HTMLInputElement>('input[placeholder*="Time"], input[placeholder*="time"]') || null;
    }

    function positionPopup(anchor: HTMLElement) {
      const rect = anchor.getBoundingClientRect();
      host.style.display = "block";
      const width = host.offsetWidth || 292;
      const height = host.offsetHeight || 246;
      let left = rect.right - width;
      left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
      let top = rect.top - height - 6;
      if (top < 8) top = rect.bottom + 6;
      host.style.left = `${left}px`;
      host.style.top = `${top}px`;
    }

    function openPopup(anchor: HTMLElement) {
      activeControl = anchor;
      activeInput = anchor instanceof HTMLInputElement ? anchor : findInputNear(anchor);
      positionPopup(anchor);
    }

    function setTime(value: string) {
      if (activeInput) setReactInputValue(activeInput, value);
      if (activeControl && !(activeControl instanceof HTMLInputElement)) {
        const current = activeControl.textContent || "";
        if (current.toLowerCase().includes("select time") || current.includes("🕘")) activeControl.textContent = `🕘 ${value}`;
      }
      closePopup();
    }

    function hideBrokenInlinePickers() {
      document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
        if (el.closest("[data-vt-admin-time-popup]")) return;
        const txt = (el.innerText || "").toLowerCase();
        const looksBroken = txt.includes("select time") && txt.includes("custom") && txt.includes("07:00") && txt.includes("done");
        if (looksBroken) el.style.setProperty("display", "none", "important");
      });
    }

    function attach() {
      hideBrokenInlinePickers();
      document.querySelectorAll<HTMLElement>('input[placeholder*="Time"], input[placeholder*="time"], button, [role="button"]').forEach((el) => {
        if (el.dataset.vtTimeReady === "yes") return;
        if (!isTimeTrigger(el)) return;
        el.dataset.vtTimeReady = "yes";
        el.style.cursor = "pointer";
        el.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          hideBrokenInlinePickers();
          openPopup(el);
        }, true);
        el.addEventListener("focus", (e) => {
          e.preventDefault();
          hideBrokenInlinePickers();
          openPopup(el);
        }, true);
      });
    }

    shadow.addEventListener("click", (e) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const quick = target.closest<HTMLButtonElement>("[data-time]");
      if (quick) return setTime(quick.dataset.time || "");
      if (target.closest("[data-close]")) return closePopup();
      if (target.closest("[data-done]")) {
        const h = shadow.querySelector<HTMLSelectElement>("[data-h]")?.value || "07";
        const m = shadow.querySelector<HTMLSelectElement>("[data-m]")?.value || "40";
        const ap = shadow.querySelector<HTMLSelectElement>("[data-ap]")?.value || "AM";
        setTime(`${h}:${m} ${ap}`);
      }
    });

    document.addEventListener("click", closePopup);
    window.addEventListener("resize", closePopup);
    window.addEventListener("scroll", closePopup, true);

    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });
    attach();

    return () => {
      observer.disconnect();
      document.removeEventListener("click", closePopup);
      window.removeEventListener("resize", closePopup);
      window.removeEventListener("scroll", closePopup, true);
      host.remove();
    };
  }, []);

  return null;
}
