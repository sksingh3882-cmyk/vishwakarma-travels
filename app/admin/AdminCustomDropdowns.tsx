"use client";

import { useEffect } from "react";

const vehicleTypeOptions = [
  "Sedan",
  "SUV",
  "SUV With Carrier",
  "Sedan With Carrier",
  "Mini Passenger Bus",
];

export default function AdminCustomDropdowns() {
  useEffect(() => {
    const select = Array.from(document.querySelectorAll<HTMLSelectElement>("select")).find((el) =>
      vehicleTypeOptions.every((option) => Array.from(el.options).some((item) => item.text === option))
    );

    if (!select || select.dataset.customDropdownReady === "yes") return;
    select.dataset.customDropdownReady = "yes";

    const wrapper = document.createElement("div");
    wrapper.className = "vt-custom-select";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "vt-custom-select-btn";
    button.innerHTML = `<span>${select.value || "Select Vehicle Type"}</span><b>⌄</b>`;

    const menu = document.createElement("div");
    menu.className = "vt-custom-select-menu";

    Array.from(select.options).forEach((option) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "vt-custom-select-item";
      item.textContent = option.text;
      item.onclick = () => {
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        button.innerHTML = `<span>${option.text}</span><b>⌄</b>`;
        wrapper.classList.remove("open");
      };
      menu.appendChild(item);
    });

    button.onclick = (event) => {
      event.stopPropagation();
      wrapper.classList.toggle("open");
    };

    document.addEventListener("click", () => wrapper.classList.remove("open"));

    wrapper.appendChild(button);
    wrapper.appendChild(menu);
    select.parentElement?.insertBefore(wrapper, select);
    select.style.display = "none";
  }, []);

  return null;
}
