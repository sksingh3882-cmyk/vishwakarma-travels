"use client";

import { useEffect } from "react";

function labelForSelect(select: HTMLSelectElement, index: number) {
  const options = Array.from(select.options).map((option) => option.text);
  if (options.includes("Mr.") && options.includes("Mrs.")) return "Select Gender";
  if (options.includes("Sedan") && options.includes("SUV")) return "Select Vehicle Type";
  if (options.includes("Desire") && options.includes("Ertiga")) return "Select Vehicle Model";
  if (options.includes("One Way Drop Pickup")) return "Select Service";
  return `Select Option ${index + 1}`;
}

function niceDate(value: string) {
  if (!value) return "Select Date";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function isoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function timeLabel(value: string) {
  if (!value) return "Select Time";
  const clean = value.trim();
  if (/am|pm/i.test(clean)) return clean;
  const match = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return clean;
  return new Date(`2000-01-01T${match[1].padStart(2, "0")}:${match[2]}`).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function buildCustomSelect(select: HTMLSelectElement, index: number) {
  if (select.dataset.customDropdownReady === "yes") return;
  select.dataset.customDropdownReady = "yes";

  const wrapper = document.createElement("div");
  wrapper.className = "vt-custom-select";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "vt-custom-select-btn";
  const setButtonText = () => {
    const selectedText = select.options[select.selectedIndex]?.text || labelForSelect(select, index);
    button.innerHTML = `<span>${selectedText}</span><b>⌄</b>`;
  };
  setButtonText();

  const menu = document.createElement("div");
  menu.className = "vt-custom-select-menu";

  Array.from(select.options).forEach((option) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "vt-custom-select-item";
    item.textContent = option.text;
    item.onclick = (event) => {
      event.stopPropagation();
      select.value = option.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      setButtonText();
      wrapper.classList.remove("open");
    };
    menu.appendChild(item);
  });

  button.onclick = (event) => {
    event.stopPropagation();
    document.querySelectorAll(".vt-custom-select.open,.vt-picker.open").forEach((el) => {
      if (el !== wrapper) el.classList.remove("open");
    });
    wrapper.classList.toggle("open");
  };

  select.addEventListener("change", setButtonText);
  wrapper.appendChild(button);
  wrapper.appendChild(menu);
  select.parentElement?.insertBefore(wrapper, select);
  select.style.display = "none";
}

function buildDatePicker(input: HTMLInputElement) {
  if (input.dataset.customPickerReady === "yes") return;
  input.dataset.customPickerReady = "yes";

  let month = input.value ? new Date(`${input.value}T00:00:00`) : new Date();
  const wrapper = document.createElement("div");
  wrapper.className = "vt-picker vt-date-picker";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "vt-custom-select-btn";
  const setButtonText = () => { button.innerHTML = `<span>📅 ${niceDate(input.value)}</span><b>⌄</b>`; };
  setButtonText();

  const menu = document.createElement("div");
  menu.className = "vt-picker-menu vt-calendar-menu";

  const render = () => {
    const y = month.getFullYear();
    const m = month.getMonth();
    const first = new Date(y, m, 1).getDay();
    const total = new Date(y, m + 1, 0).getDate();
    const selected = input.value;
    const today = isoDate(new Date());
    menu.innerHTML = `<div class="vt-cal-head"><button type="button" data-nav="prev">‹</button><b>${month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</b><button type="button" data-nav="next">›</button></div><div class="vt-cal-week"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div><div class="vt-cal-grid"></div><button type="button" class="vt-today-btn">📅 Today</button>`;
    const grid = menu.querySelector(".vt-cal-grid") as HTMLDivElement;
    for (let i = 0; i < 42; i++) {
      const day = i - first + 1;
      const d = new Date(y, m, day);
      const val = isoDate(d);
      const item = document.createElement("button");
      item.type = "button";
      item.textContent = String(d.getDate());
      item.className = "vt-cal-day";
      if (day < 1 || day > total) item.classList.add("muted");
      if (val === today) item.classList.add("today");
      if (val === selected) item.classList.add("selected");
      item.onclick = (event) => { event.stopPropagation(); setInputValue(input, val); setButtonText(); wrapper.classList.remove("open"); render(); };
      grid.appendChild(item);
    }
    menu.querySelector('[data-nav="prev"]')?.addEventListener("click", (event) => { event.stopPropagation(); month = new Date(y, m - 1, 1); render(); });
    menu.querySelector('[data-nav="next"]')?.addEventListener("click", (event) => { event.stopPropagation(); month = new Date(y, m + 1, 1); render(); });
    menu.querySelector(".vt-today-btn")?.addEventListener("click", (event) => { event.stopPropagation(); const val = isoDate(new Date()); month = new Date(); setInputValue(input, val); setButtonText(); wrapper.classList.remove("open"); render(); });
  };

  button.onclick = (event) => { event.stopPropagation(); document.querySelectorAll(".vt-custom-select.open,.vt-picker.open").forEach((el) => { if (el !== wrapper) el.classList.remove("open"); }); wrapper.classList.toggle("open"); };
  input.addEventListener("change", setButtonText);
  render();
  wrapper.appendChild(button);
  wrapper.appendChild(menu);
  input.parentElement?.insertBefore(wrapper, input);
}

function buildTimePicker(input: HTMLInputElement) {
  if (input.dataset.customPickerReady === "yes") return;
  input.dataset.customPickerReady = "yes";

  const wrapper = document.createElement("div");
  wrapper.className = "vt-picker vt-time-picker";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "vt-custom-select-btn";
  const setButtonText = () => { button.innerHTML = `<span>🕘 ${timeLabel(input.value)}</span><b>⌄</b>`; };
  setButtonText();
  const menu = document.createElement("div");
  menu.className = "vt-picker-menu vt-time-menu";
  menu.innerHTML = `<div class="vt-time-head"><b>🕘 Select Time</b></div><div class="vt-time-grid"></div><div class="vt-custom-time"><span>Custom</span><select class="vt-h"></select><select class="vt-m"></select><select class="vt-ap"><option>AM</option><option>PM</option></select><button type="button">Done</button></div>`;
  const grid = menu.querySelector(".vt-time-grid") as HTMLDivElement;
  for (let i = 0; i < 30; i++) {
    const h24 = 7 + Math.floor(i / 2);
    const min = i % 2 ? "30" : "00";
    const value24 = `${String(h24).padStart(2, "0")}:${min}`;
    const item = document.createElement("button");
    item.type = "button";
    item.className = "vt-time-slot";
    item.textContent = timeLabel(value24);
    item.onclick = (event) => { event.stopPropagation(); setInputValue(input, item.textContent || value24); setButtonText(); wrapper.classList.remove("open"); };
    grid.appendChild(item);
  }
  const hSel = menu.querySelector(".vt-h") as HTMLSelectElement;
  const mSel = menu.querySelector(".vt-m") as HTMLSelectElement;
  for (let i = 1; i <= 12; i++) hSel.add(new Option(String(i).padStart(2, "0"), String(i).padStart(2, "0")));
  for (let i = 0; i < 60; i++) mSel.add(new Option(String(i).padStart(2, "0"), String(i).padStart(2, "0")));
  menu.querySelector(".vt-custom-time button")?.addEventListener("click", (event) => { event.stopPropagation(); const ap = (menu.querySelector(".vt-ap") as HTMLSelectElement).value; setInputValue(input, `${hSel.value}:${mSel.value} ${ap}`); setButtonText(); wrapper.classList.remove("open"); });
  button.onclick = (event) => { event.stopPropagation(); document.querySelectorAll(".vt-custom-select.open,.vt-picker.open").forEach((el) => { if (el !== wrapper) el.classList.remove("open"); }); wrapper.classList.toggle("open"); };
  input.addEventListener("change", setButtonText);
  wrapper.appendChild(button);
  wrapper.appendChild(menu);
  input.parentElement?.insertBefore(wrapper, input);
}

export default function AdminCustomDropdowns() {
  useEffect(() => {
    const setup = () => {
      Array.from(document.querySelectorAll<HTMLSelectElement>(".admin-shell form select")).forEach(buildCustomSelect);
      const dateInput = document.querySelector<HTMLInputElement>('.admin-shell form input[type="date"]');
      if (dateInput) buildDatePicker(dateInput);
      const timeInput = Array.from(document.querySelectorAll<HTMLInputElement>(".admin-shell form input")).find((el) => (el.placeholder || "").toLowerCase().includes("time"));
      if (timeInput) buildTimePicker(timeInput);
    };
    setup();
    const timer = window.setTimeout(setup, 700);
    const closeAll = () => document.querySelectorAll(".vt-custom-select.open,.vt-picker.open").forEach((el) => el.classList.remove("open"));
    document.addEventListener("click", closeAll);
    return () => { window.clearTimeout(timer); document.removeEventListener("click", closeAll); };
  }, []);

  return null;
}
