"use client";
import { useEffect } from "react";

const phone10 = (v: string) => String(v || "").replace(/\D/g, "").slice(-10);
const text = (el: Element | null) => (el?.textContent || "").trim();

export default function PublicBookingValidation() {
  useEffect(() => {
    const validate = (event: Event) => {
      const form = document.getElementById("booking-form") as HTMLFormElement | null;
      if (!form || event.target !== form) return;

      const inputs = Array.from(form.querySelectorAll<HTMLInputElement>("input"));
      const byPlaceholder = (word: string) => inputs.find((i) => (i.placeholder || "").toLowerCase().includes(word))?.value.trim() || "";
      const hidden = inputs.filter((i) => i.type === "hidden").map((i) => i.value.trim());
      const buttons = Array.from(form.querySelectorAll<HTMLButtonElement>('button[type="button"]'));
      const service = hidden[0] || "";
      const vehicle = hidden[1] || "";
      const date = hidden[2] || "";
      const time = hidden[3] || "";
      const dateText = text(buttons.find((b) => text(b).includes("Select Date") || text(b).includes("📅")) || null);
      const timeText = text(buttons.find((b) => text(b).includes("Select Time") || text(b).includes("🕘")) || null);

      const checks: [boolean, string][] = [
        [!!byPlaceholder("name"), "Please enter name."],
        [phone10(byPlaceholder("mobile")).length === 10, "Please enter valid 10 digit mobile number."],
        [!!service, "Please select service."],
        [!!vehicle, "Please select vehicle."],
        [!!byPlaceholder("pickup"), "Please enter pickup location."],
        [!!byPlaceholder("drop"), "Please enter drop location."],
        [!!date && !dateText.includes("Select Date"), "Please select date."],
        [!!time && !timeText.includes("Select Time"), "Please select time."],
      ];

      const failed = checks.find(([ok]) => !ok);
      if (failed) {
        event.preventDefault();
        event.stopPropagation();
        (event as any).stopImmediatePropagation?.();
        alert(failed[1]);
      }
    };
    document.addEventListener("submit", validate, true);
    return () => document.removeEventListener("submit", validate, true);
  }, []);
  return null;
}
