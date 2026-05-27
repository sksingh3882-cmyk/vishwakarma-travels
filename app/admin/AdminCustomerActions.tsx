"use client";

import { useEffect } from "react";

type CustomerParts = { name: string; mobile: string; address: string };

const cleanPhone = (v: string) => String(v || "").replace(/\D/g, "").slice(-10);

function parseCustomerRow(row: HTMLElement): CustomerParts | null {
  const boldName = row.querySelector("b")?.textContent?.trim() || "";
  const rawText = row.textContent || "";
  const mobile = cleanPhone(rawText);
  if (!boldName || mobile.length !== 10) return null;
  const parts = rawText.split(" - ");
  return {
    name: boldName,
    mobile,
    address: parts.slice(2).join(" - ").replace(/Edit|Delete/gi, "").trim(),
  };
}

export default function AdminCustomerActions() {
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    if (!supabaseUrl || !supabaseKey) return;

    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    async function updateCustomer(oldMobile: string, payload: CustomerParts) {
      const body = JSON.stringify({ name: payload.name, mobile: payload.mobile, address: payload.address });
      let res = await fetch(`${supabaseUrl}/rest/v1/customers?mobile=eq.${encodeURIComponent(oldMobile)}`, { method: "PATCH", headers, body });
      if (!res.ok || (await res.clone().text()) === "[]") {
        res = await fetch(`${supabaseUrl}/rest/v1/customers?phone=eq.${encodeURIComponent(oldMobile)}`, { method: "PATCH", headers, body });
      }
      return res.ok;
    }

    async function deleteCustomer(mobile: string) {
      let res = await fetch(`${supabaseUrl}/rest/v1/customers?mobile=eq.${encodeURIComponent(mobile)}`, { method: "DELETE", headers });
      if (!res.ok) res = await fetch(`${supabaseUrl}/rest/v1/customers?phone=eq.${encodeURIComponent(mobile)}`, { method: "DELETE", headers });
      return res.ok;
    }

    function attachButtons() {
      const rows = Array.from(document.querySelectorAll<HTMLElement>(".admin-shell section p"));
      rows.forEach((row) => {
        if (row.dataset.customerActionsReady === "yes") return;
        const data = parseCustomerRow(row);
        if (!data) return;

        row.dataset.customerActionsReady = "yes";
        row.style.display = "grid";
        row.style.gridTemplateColumns = "1fr auto";
        row.style.gap = "10px";
        row.style.alignItems = "center";
        row.style.padding = "10px 0";
        row.style.borderBottom = "1px dashed #e2e8f0";

        const textWrap = document.createElement("span");
        textWrap.innerHTML = row.innerHTML;
        row.innerHTML = "";
        row.appendChild(textWrap);

        const actions = document.createElement("span");
        actions.style.display = "flex";
        actions.style.gap = "6px";
        actions.style.flexWrap = "wrap";
        actions.style.justifyContent = "flex-end";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.textContent = "Edit";
        editBtn.style.cssText = "border:0;border-radius:10px;background:#2563eb;color:white;padding:8px 10px;font-weight:900;font-size:12px;";
        editBtn.onclick = async () => {
          const current = parseCustomerRow(row) || data;
          const name = window.prompt("Customer name", current.name) || current.name;
          const mobile = cleanPhone(window.prompt("Mobile number", current.mobile) || current.mobile);
          const address = window.prompt("Address", current.address) || current.address;
          if (!name.trim() || mobile.length !== 10) return alert("Please enter valid name and 10 digit mobile number.");
          const ok = await updateCustomer(current.mobile, { name: name.trim(), mobile, address: address.trim() });
          if (!ok) return alert("Customer update failed.");
          textWrap.innerHTML = `<b>${name.trim()}</b> - ${mobile} - ${address.trim()}`;
          alert("Customer updated successfully.");
        };

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.textContent = "Delete";
        delBtn.style.cssText = "border:0;border-radius:10px;background:#dc2626;color:white;padding:8px 10px;font-weight:900;font-size:12px;";
        delBtn.onclick = async () => {
          const current = parseCustomerRow(row) || data;
          if (!window.confirm(`Delete customer ${current.name}?`)) return;
          const ok = await deleteCustomer(current.mobile);
          if (!ok) return alert("Customer delete failed.");
          row.remove();
          alert("Customer deleted successfully.");
        };

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);
        row.appendChild(actions);
      });
    }

    attachButtons();
    const observer = new MutationObserver(attachButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    const timer = window.setInterval(attachButtons, 1000);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, []);

  return null;
}
