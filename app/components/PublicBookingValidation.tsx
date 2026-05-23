"use client";
import { useEffect } from "react";

const phone10 = (v: string) => String(v || "").replace(/\D/g, "").slice(-10);
const text = (el: Element | null) => (el?.textContent || "").trim();

export default function PublicBookingValidation() {
  useEffect(() => {
    const clearErrors = (form: HTMLElement) => form.querySelectorAll(".vt-field-error").forEach((e) => e.remove());
    const showError = (target: HTMLElement | null, message: string) => {
      if (!target) return;
      const holder = target.parentElement || target;
      const msg = document.createElement("div");
      msg.className = "vt-field-error";
      msg.textContent = message;
      msg.style.cssText = "grid-column:1/-1;color:#dc2626;font-size:12px;font-weight:800;margin:4px 0 0 6px;line-height:1.2;";
      holder.insertAdjacentElement("afterend", msg);
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    const validate = (event: Event) => {
      const form = document.getElementById("booking-form") as HTMLFormElement | null;
      if (!form || event.target !== form) return;
      clearErrors(form);

      const inputs = Array.from(form.querySelectorAll<HTMLInputElement>("input"));
      const byPlaceholderEl = (word: string) => inputs.find((i) => (i.placeholder || "").toLowerCase().includes(word)) || null;
      const buttons = Array.from(form.querySelectorAll<HTMLButtonElement>('button[type="button"]'));
      const serviceBtn = buttons.find((b) => ["One Way", "Same Day", "Local", "Outstation", "Short", "Marriage", "Tour", "Select Service"].some((x) => text(b).includes(x))) || null;
      const vehicleBtn = buttons.find((b) => ["Dzire", "Ertiga", "Innova", "Traveller", "Select Vehicle"].some((x) => text(b).includes(x))) || null;
      const dateBtn = buttons.find((b) => text(b).includes("📅") || text(b).includes("Select Date")) || null;
      const timeBtn = buttons.find((b) => text(b).includes("🕘") || text(b).includes("Select Time")) || null;
      const serviceText = text(serviceBtn);
      const vehicleText = text(vehicleBtn);
      const dateText = text(dateBtn);
      const timeText = text(timeBtn);

      const checks: [boolean, HTMLElement | null, string][] = [
        [!!byPlaceholderEl("name")?.value.trim(), byPlaceholderEl("name"), "Please enter name."],
        [phone10(byPlaceholderEl("mobile")?.value || "").length === 10, byPlaceholderEl("mobile"), "Please enter valid 10 digit mobile number."],
        [!!serviceText && !serviceText.includes("Select Service"), serviceBtn, "Please select service."],
        [!!vehicleText && !vehicleText.includes("Select Vehicle"), vehicleBtn, "Please select vehicle."],
        [!!byPlaceholderEl("pickup")?.value.trim(), byPlaceholderEl("pickup"), "Please enter pickup location."],
        [!!byPlaceholderEl("drop")?.value.trim(), byPlaceholderEl("drop"), "Please enter drop location."],
        [!!dateText && !dateText.includes("Select Date"), dateBtn, "Please select date."],
        [!!timeText && !timeText.includes("Select Time"), timeBtn, "Please select time."],
      ];

      const failed = checks.find(([ok]) => !ok);
      if (failed) {
        event.preventDefault();
        event.stopPropagation();
        (event as any).stopImmediatePropagation?.();
        showError(failed[1], failed[2]);
      }
    };
    document.addEventListener("submit", validate, true);
    return () => document.removeEventListener("submit", validate, true);
  }, []);
  return null;
}
