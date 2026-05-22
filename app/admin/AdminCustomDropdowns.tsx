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
    document.querySelectorAll(".vt-custom-select.open").forEach((el) => {
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

export default function AdminCustomDropdowns() {
  useEffect(() => {
    const setup = () => {
      Array.from(document.querySelectorAll<HTMLSelectElement>(".admin-shell form select")).forEach(buildCustomSelect);
    };

    setup();
    const timer = window.setTimeout(setup, 600);
    const closeAll = () => document.querySelectorAll(".vt-custom-select.open").forEach((el) => el.classList.remove("open"));
    document.addEventListener("click", closeAll);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", closeAll);
    };
  }, []);

  return null;
}
