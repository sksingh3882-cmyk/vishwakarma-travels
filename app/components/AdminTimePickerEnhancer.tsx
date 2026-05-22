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

export default function AdminTimePickerEnhancer() {
  useEffect(() => {
    if (!window.location.pathname.startsWith("/admin")) return;

    let activeInput: HTMLInputElement | null = null;
    const popup = document.createElement("div");
    popup.setAttribute("data-vt-admin-time-popup", "true");
    popup.style.cssText = [
      "position:fixed",
      "z-index:99999",
      "width:292px",
      "max-width:calc(100vw - 32px)",
      "background:#fff",
      "border:1px solid #dbe5f1",
      "border-radius:14px",
      "box-shadow:0 12px 26px rgba(0,0,0,.14)",
      "overflow:hidden",
      "display:none",
      "font-family:Arial,sans-serif",
    ].join(";");

    popup.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;color:#0b2d6b;border-bottom:1px solid #edf2f7;font-weight:900">
        <b>🕘 Select Time</b><button type="button" data-vt-close style="border:0;background:white;font-size:20px;color:#0b2d6b;font-weight:900">×</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:10px;max-height:144px;overflow-y:auto">
        ${slotTimes.map((t) => `<button type="button" data-vt-time="${t}" style="padding:8px 4px;border:1px solid #dbe5f1;border-radius:9px;background:white;color:#0b2d6b;font-weight:900;font-size:12px">${t}</button>`).join("")}
      </div>
      <div style="display:grid;grid-template-columns:auto 1fr 1fr 1fr auto;gap:5px;align-items:center;padding:10px;border-top:1px solid #edf2f7;color:#0b2d6b;font-weight:900;font-size:12px">
        <span>Custom</span>
        <select data-vt-h style="height:34px;border:1px solid #dbe5f1;border-radius:8px;color:#0b2d6b;font-weight:900;background:white">${Array.from({ length: 12 }, (_, i) => `<option>${String(i + 1).padStart(2, "0")}</option>`).join("")}</select>
        <select data-vt-m style="height:34px;border:1px solid #dbe5f1;border-radius:8px;color:#0b2d6b;font-weight:900;background:white">${Array.from({ length: 60 }, (_, i) => `<option ${i === 40 ? "selected" : ""}>${String(i).padStart(2, "0")}</option>`).join("")}</select>
        <select data-vt-ap style="height:34px;border:1px solid #dbe5f1;border-radius:8px;color:#0b2d6b;font-weight:900;background:white"><option>AM</option><option>PM</option></select>
        <button type="button" data-vt-done style="height:34px;border:0;border-radius:8px;background:#2563eb;color:white;font-weight:900;padding:0 9px">Done</button>
      </div>`;

    document.body.appendChild(popup);

    function closePopup() {
      popup.style.display = "none";
      activeInput = null;
    }

    function positionPopup(input: HTMLInputElement) {
      const rect = input.getBoundingClientRect();
      popup.style.display = "block";
      const popupHeight = popup.offsetHeight || 250;
      let left = rect.right - popup.offsetWidth;
      left = Math.max(8, Math.min(left, window.innerWidth - popup.offsetWidth - 8));
      const top = Math.max(8, rect.top - popupHeight - 6);
      popup.style.left = `${left}px`;
      popup.style.top = `${top}px`;
    }

    function openPopup(input: HTMLInputElement) {
      activeInput = input;
      positionPopup(input);
    }

    function attach() {
      const input = document.querySelector<HTMLInputElement>('input[placeholder="Time e.g. 5:30 PM"]');
      if (!input || input.dataset.vtTimeReady === "yes") return;
      input.dataset.vtTimeReady = "yes";
      input.style.cursor = "pointer";
      input.addEventListener("focus", () => openPopup(input));
      input.addEventListener("click", (e) => { e.stopPropagation(); openPopup(input); });
    }

    function setTime(value: string) {
      if (!activeInput) return;
      setReactInputValue(activeInput, value);
      closePopup();
    }

    popup.addEventListener("click", (e) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const quick = target.closest<HTMLButtonElement>("[data-vt-time]");
      if (quick) return setTime(quick.dataset.vtTime || "");
      if (target.closest("[data-vt-close]")) return closePopup();
      if (target.closest("[data-vt-done]")) {
        const h = popup.querySelector<HTMLSelectElement>("[data-vt-h]")?.value || "07";
        const m = popup.querySelector<HTMLSelectElement>("[data-vt-m]")?.value || "40";
        const ap = popup.querySelector<HTMLSelectElement>("[data-vt-ap]")?.value || "AM";
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
      popup.remove();
    };
  }, []);

  return null;
}
