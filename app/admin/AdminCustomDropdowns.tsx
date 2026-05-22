"use client";

import { useEffect } from "react";

function labelForSelect(select: HTMLSelectElement, index: number) {
  const options = Array.from(select.options).map((option) => option.text);
  if (options.includes("Mr.")) return "Select Gender";
  if (options.includes("Sedan")) return "Select Vehicle Type";
  if (options.includes("Desire")) return "Select Vehicle Model";
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
  const setButtonText = () => button.innerHTML = `<span>${select.options[select.selectedIndex]?.text || labelForSelect(select, index)}</span><b>⌄</b>`;
  setButtonText();
  const menu = document.createElement("div");
  menu.className = "vt-custom-select-menu";
  Array.from(select.options).forEach((option) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "vt-custom-select-item";
    item.textContent = option.text;
    item.onclick = (e) => {
      e.stopPropagation();
      select.value = option.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      setButtonText();
      wrapper.classList.remove("open");
    };
    menu.appendChild(item);
  });
  button.onclick = (e) => {
    e.stopPropagation();
    document.querySelectorAll(".open").forEach((el) => el !== wrapper && el.classList.remove("open"));
    wrapper.classList.toggle("open");
  };
  wrapper.append(button, menu);
  select.parentElement?.insertBefore(wrapper, select);
  select.style.display = "none";
}

function buildDatePicker(input: HTMLInputElement) {
  if (input.dataset.customPickerReady === "yes") return;
  input.dataset.customPickerReady = "yes";
  const wrapper = document.createElement("div");
  wrapper.className = "vt-picker";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "vt-custom-select-btn";
  const setButtonText = () => button.innerHTML = `<span>📅 ${niceDate(input.value)}</span><b>⌄</b>`;
  setButtonText();
  const menu = document.createElement("div");
  menu.className = "vt-picker-menu";
  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const val = isoDate(d);
    const item = document.createElement("button");
    item.type = "button";
    item.className = "vt-custom-select-item";
    item.textContent = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", weekday: "short" });
    item.onclick = (e) => {
      e.stopPropagation();
      setInputValue(input, val);
      setButtonText();
      wrapper.classList.remove("open");
    };
    menu.appendChild(item);
  }
  button.onclick = (e) => {
    e.stopPropagation();
    document.querySelectorAll(".open").forEach((el) => el !== wrapper && el.classList.remove("open"));
    wrapper.classList.toggle("open");
  };
  wrapper.append(button, menu);
  input.parentElement?.insertBefore(wrapper, input);
}

function buildTimePicker(input: HTMLInputElement) {
  if (input.dataset.customPickerReady === "yes") return;
  input.dataset.customPickerReady = "yes";
  const wrapper = document.createElement("div");
  wrapper.className = "vt-picker";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "vt-custom-select-btn";
  const setButtonText = () => button.innerHTML = `<span>🕘 ${input.value || "Select Time"}</span><b>⌄</b>`;
  setButtonText();
  const menu = document.createElement("div");
  menu.className = "vt-picker-menu";
  const grid = document.createElement("div");
  grid.className = "vt-time-grid";
  const times = ["12:00","12:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30"];
  times.forEach((time) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "vt-time-slot";
    item.textContent = time;
    item.onclick = (e) => {
      e.stopPropagation();
      const ap = (menu.querySelector(".vt-ap") as HTMLSelectElement).value;
      setInputValue(input, `${time} ${ap}`);
      setButtonText();
      wrapper.classList.remove("open");
    };
    grid.appendChild(item);
  });
  const footer = document.createElement("div");
  footer.className = "vt-custom-time";
  footer.innerHTML = `<select class="vt-ap"><option>AM</option><option>PM</option></select><button type="button">Done</button>`;
  footer.querySelector("button")?.addEventListener("click", (e) => {
    e.stopPropagation();
    wrapper.classList.remove("open");
  });
  menu.append(grid, footer);
  button.onclick = (e) => {
    e.stopPropagation();
    document.querySelectorAll(".open").forEach((el) => el !== wrapper && el.classList.remove("open"));
    wrapper.classList.toggle("open");
  };
  wrapper.append(button, menu);
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
    const closeAll = () => document.querySelectorAll(".open").forEach((el) => el.classList.remove("open"));
    document.addEventListener("click", closeAll);
    return () => document.removeEventListener("click", closeAll);
  }, []);
  return null;
}
