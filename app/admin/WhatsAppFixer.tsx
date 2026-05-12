"use client";

import { useEffect } from "react";

function onlyPhone(value: string) {
  let phone = value.replace(/\D/g, "");
  if (phone.startsWith("91") && phone.length === 12) phone = phone.slice(2);
  return phone.slice(0, 10);
}

function time12(value: string) {
  if (!value) return "";
  const [h, m = "00"] = value.split(":");
  const hour = Number(h);
  if (Number.isNaN(hour)) return value;
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m.padStart(2, "0")} ${ampm}`;
}

function inputValue(placeholder: string) {
  return document.querySelector<HTMLInputElement>(`input[placeholder="${placeholder}"]`)?.value || "";
}

function selectWith(text: string) {
  return Array.from(document.querySelectorAll<HTMLSelectElement>("select")).find((select) =>
    Array.from(select.options).some((option) => option.text.includes(text))
  );
}

function selectedText(select?: HTMLSelectElement) {
  return select?.selectedOptions?.[0]?.text || select?.value || "";
}

function updateLabels() {
  const serviceSelect = selectWith("Airport Drop Pickup") || selectWith("One Way Drop Pickup");
  if (!serviceSelect) return;

  Array.from(serviceSelect.options).forEach((option) => {
    if (option.text === "Airport Drop Pickup") option.text = "One Way Drop Pickup";
    if (option.value === "Airport Drop Pickup") option.value = "One Way Drop Pickup";
    if (option.text === "Local Movment") option.text = "Local Movement";
    if (option.value === "Local Movment") option.value = "Local Movement";
    if (option.text === "Outstation Movment") option.text = "Outstation Movement";
    if (option.value === "Outstation Movment") option.value = "Outstation Movement";
  });
}

function buildMessage() {
  const customerPhone = onlyPhone(inputValue("Customer WhatsApp Number"));
  const fare = inputValue("Total Fare") || "0";
  const advance = inputValue("Advance Paid") || "0";
  const netPayable = String(Number(fare) - Number(advance));
  const date = document.querySelector<HTMLInputElement>('input[type="date"]')?.value || "";
  const time = time12(document.querySelector<HTMLInputElement>('input[type="time"]')?.value || "");
  const service = selectedText(selectWith("One Way Drop Pickup")) || "One Way Drop Pickup";

  const message = `✅ Booking Confirmation

${selectedText(selectWith("Mr.")) || "Mr."} ${inputValue("Customer Name")} Sir,
Namaste, Your Booking is Confirmed.

Booking ID: VT-${Date.now()}

Service: ${service}
Contact No: +91${customerPhone}

📍 Pickup: ${inputValue("Pickup Location")}
📍 Drop: ${inputValue("Drop Location")}
📅 Date: ${date}
⌚ Time: ${time}

🚕 Vehicle Details:
Vehicle Type: ${selectedText(selectWith("Sedan"))}
Vehicle Model: ${selectedText(selectWith("Desire"))}
Vehicle No: ${inputValue("Vehicle Number")}
Driver Name: ${inputValue("Driver Name")}
Driver Mobile: ${onlyPhone(inputValue("Driver Mobile"))}

💵 Fare Charges:
Fare: ₹${fare}
Advance Paid: ₹${advance}
Net Payable Amount: ₹${netPayable}

Visit- vishwakarma-travels-nine.vercel.app
           for next booking

Thank You For Choosing Vishwakarma Travels`;

  return { customerPhone, message };
}

export default function WhatsAppFixer() {
  useEffect(() => {
    updateLabels();
    const timer = window.setInterval(updateLabels, 700);

    function onClick(event: MouseEvent) {
      const button = (event.target as HTMLElement | null)?.closest("button");
      if (!button?.textContent?.includes("Send WhatsApp")) return;

      const { customerPhone, message } = buildMessage();
      if (customerPhone.length !== 10) return;

      event.preventDefault();
      event.stopPropagation();
      window.open(`https://api.whatsapp.com/send?phone=91${customerPhone}&text=${encodeURIComponent(message)}`, "_self");
    }

    document.addEventListener("click", onClick, true);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
