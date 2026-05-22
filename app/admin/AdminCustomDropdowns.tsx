"use client";

import { useEffect } from "react";

function hideNative(el: HTMLInputElement | HTMLSelectElement) {
  el.style.setProperty("display", "none", "important");
  el.style.setProperty("position", "absolute", "important");
  el.style.setProperty("left", "-9999px", "important");
}

function setInputValue(input: HTMLInputElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
  if (descriptor && descriptor.set) descriptor.set.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function setSelectValue(select: HTMLSelectElement, value: string) {
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

function formatDateValue(value: string) {
  if (!value) return "Select Date";
  return new Date(value + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function isoDate(date: Date) {
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}

function formatTime(value: string) {
  if (!value) return "Select Time";
  if (/am|pm/i.test(value)) return value;
  return new Date("2000-01-01T" + value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function closeAll() {
  document.querySelectorAll(".open").forEach((el) => el.classList.remove("open"));
}

function selectLabel(select: HTMLSelectElement, index: number) {
  const options = Array.from(select.options).map((option) => option.text);
  if (options.includes("Mr.")) return "Select Gender";
  if (options.includes("Sedan")) return "Select Vehicle Type";
  if (options.includes("Desire")) return "Select Vehicle Model";
  if (options.includes("One Way Drop Pickup")) return "Select Service";
  return "Select Option " + (index + 1);
}

function enhanceSelect(select: HTMLSelectElement, index: number) {
  if (select.dataset.customDropdownReady === "yes") { hideNative(select); return; }
  select.dataset.customDropdownReady = "yes";
  const wrap = document.createElement("div");
  const button = document.createElement("button");
  const menu = document.createElement("div");
  wrap.className = "vt-custom-select";
  button.type = "button";
  button.className = "vt-custom-select-btn";
  menu.className = "vt-custom-select-menu";
  const refreshText = () => { button.innerHTML = "<span>" + (select.options[select.selectedIndex]?.text || selectLabel(select, index)) + "</span><b>⌄</b>"; };
  refreshText();
  Array.from(select.options).forEach((option) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "vt-custom-select-item";
    item.textContent = option.text;
    item.onclick = (event) => { event.stopPropagation(); setSelectValue(select, option.value); refreshText(); wrap.classList.remove("open"); };
    menu.appendChild(item);
  });
  button.onclick = (event) => { event.stopPropagation(); closeAll(); wrap.classList.toggle("open"); };
  wrap.append(button, menu);
  select.parentElement?.insertBefore(wrap, select);
  hideNative(select);
}

function enhanceDate(input: HTMLInputElement) {
  if (input.dataset.customPickerReady === "yes") { hideNative(input); return; }
  input.dataset.customPickerReady = "yes";
  let viewMonth = input.value ? new Date(input.value + "T00:00:00") : new Date();
  const wrap = document.createElement("div");
  const button = document.createElement("button");
  const menu = document.createElement("div");
  wrap.className = "vt-picker vt-date-picker";
  button.type = "button";
  button.className = "vt-custom-select-btn";
  menu.className = "vt-picker-menu vt-cal-menu";
  const refreshText = () => { button.innerHTML = "<span>📅 " + formatDateValue(input.value) + "</span><b>⌄</b>"; };
  const render = () => {
    const y = viewMonth.getFullYear();
    const m = viewMonth.getMonth();
    const first = new Date(y, m, 1).getDay();
    const total = new Date(y, m + 1, 0).getDate();
    const today = isoDate(new Date());
    const selected = input.value;
    menu.innerHTML = '<div class="vt-cal-head"><button type="button" data-nav="prev">‹</button><b>' + viewMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" }) + '</b><button type="button" data-nav="next">›</button></div><div class="vt-cal-week"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div><div class="vt-cal-grid"></div><button type="button" class="vt-cal-footer">📅 Today, ' + formatDateValue(today) + '</button>';
    const grid = menu.querySelector(".vt-cal-grid") as HTMLDivElement;
    for (let n = 0; n < 42; n += 1) {
      const day = n - first + 1;
      const d = new Date(y, m, day);
      const value = isoDate(d);
      const item = document.createElement("button");
      item.type = "button";
      item.className = "vt-cal-day" + (day < 1 || day > total ? " muted" : "") + (value === today ? " today" : "") + (value === selected ? " selected" : "");
      item.textContent = String(d.getDate());
      item.onclick = (event) => { event.stopPropagation(); setInputValue(input, value); refreshText(); closeAll(); };
      grid.appendChild(item);
    }
    menu.querySelector('[data-nav="prev"]')?.addEventListener("click", (event) => { event.stopPropagation(); viewMonth = new Date(y, m - 1, 1); render(); });
    menu.querySelector('[data-nav="next"]')?.addEventListener("click", (event) => { event.stopPropagation(); viewMonth = new Date(y, m + 1, 1); render(); });
    menu.querySelector(".vt-cal-footer")?.addEventListener("click", (event) => { event.stopPropagation(); const val = isoDate(new Date()); viewMonth = new Date(); setInputValue(input, val); refreshText(); closeAll(); });
  };
  refreshText();
  render();
  button.onclick = (event) => { event.stopPropagation(); closeAll(); wrap.classList.toggle("open"); };
  wrap.append(button, menu);
  input.parentElement?.insertBefore(wrap, input);
  hideNative(input);
}

function enhanceTime(input: HTMLInputElement) {
  if (input.dataset.customPickerReady === "yes") { hideNative(input); return; }
  input.dataset.customPickerReady = "yes";
  const wrap = document.createElement("div");
  const button = document.createElement("button");
  const menu = document.createElement("div");
  wrap.className = "vt-picker vt-time-picker";
  button.type = "button";
  button.className = "vt-custom-select-btn";
  menu.className = "vt-picker-menu vt-time-menu";
  menu.innerHTML = '<div class="vt-time-head"><b>🕘 Select Time</b><button type="button" class="vt-time-close">×</button></div><div class="vt-time-grid"></div><div class="vt-custom-row"><span>Custom</span><select class="vt-h"></select><select class="vt-m"></select><select class="vt-ap"><option>AM</option><option>PM</option></select><button type="button" class="vt-custom-done">Done</button></div>';
  const refreshText = () => { button.innerHTML = "<span>🕘 " + formatTime(input.value) + "</span><b>⌄</b>"; };
  refreshText();
  const grid = menu.querySelector(".vt-time-grid") as HTMLDivElement;
  for (let n = 0; n < 30; n += 1) {
    const hour24 = 7 + Math.floor(n / 2);
    const minute = n % 2 ? 30 : 0;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    const text = String(hour12).padStart(2, "0") + ":" + String(minute).padStart(2, "0") + " " + ampm;
    const item = document.createElement("button");
    item.type = "button";
    item.className = "vt-time-slot";
    item.textContent = text;
    item.onclick = (event) => { event.stopPropagation(); setInputValue(input, text); refreshText(); closeAll(); };
    grid.appendChild(item);
  }
  const hourSelect = menu.querySelector(".vt-h") as HTMLSelectElement;
  const minuteSelect = menu.querySelector(".vt-m") as HTMLSelectElement;
  const ampmSelect = menu.querySelector(".vt-ap") as HTMLSelectElement;
  for (let n = 1; n <= 12; n += 1) hourSelect.add(new Option(String(n).padStart(2, "0")));
  for (let n = 0; n < 60; n += 1) minuteSelect.add(new Option(String(n).padStart(2, "0")));
  hourSelect.value = "07"; minuteSelect.value = "40";
  menu.onclick = (event) => { event.stopPropagation(); const target = event.target as HTMLElement; if (target.closest(".vt-time-close")) closeAll(); if (target.closest(".vt-custom-done")) { setInputValue(input, hourSelect.value + ":" + minuteSelect.value + " " + ampmSelect.value); refreshText(); closeAll(); } };
  button.onclick = (event) => { event.stopPropagation(); closeAll(); wrap.classList.toggle("open"); };
  wrap.append(button, menu);
  input.parentElement?.insertBefore(wrap, input);
  hideNative(input);
}

export default function AdminCustomDropdowns() {
  useEffect(() => {
    const setup = () => {
      document.querySelectorAll<HTMLSelectElement>(".admin-shell form select:not(.vt-ap):not(.vt-h):not(.vt-m)").forEach(enhanceSelect);
      const dateInput = document.querySelector<HTMLInputElement>('.admin-shell form input[type="date"]');
      if (dateInput) enhanceDate(dateInput);
      const timeInput = Array.from(document.querySelectorAll<HTMLInputElement>(".admin-shell form input")).find((item) => (item.placeholder || "").toLowerCase().includes("time"));
      if (timeInput) enhanceTime(timeInput);
    };
    setup();
    const interval = window.setInterval(setup, 800);
    const observer = new MutationObserver(setup);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("click", closeAll);
    return () => { window.clearInterval(interval); observer.disconnect(); document.removeEventListener("click", closeAll); };
  }, []);
  return null;
}
