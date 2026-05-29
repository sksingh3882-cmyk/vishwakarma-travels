"use client";

import { useEffect } from "react";

function moveSyncButton() {
  const syncBtn = document.getElementById("vt-supabase-sync-bottom") as HTMLButtonElement | null;
  const header = document.querySelector(".admin-shell header") as HTMLElement | null;
  const logoutBtn = Array.from(document.querySelectorAll<HTMLButtonElement>(".admin-shell header button"))
    .find((btn) => (btn.textContent || "").trim().toLowerCase() === "logout");

  if (!syncBtn || !header || !logoutBtn) return;

  syncBtn.id = "vt-supabase-sync-top";
  syncBtn.textContent = syncBtn.textContent?.includes("Syncing") ? "Syncing..." : "↻ Supabase Sync";
  syncBtn.style.cssText = "position:static!important;left:auto!important;right:auto!important;bottom:auto!important;z-index:auto!important;height:auto!important;min-height:0!important;border:0!important;border-radius:10px!important;background:#0b2d6b!important;color:#fff!important;font-weight:900!important;font-size:14px!important;box-shadow:none!important;padding:10px 16px!important;margin-left:8px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:auto!important;white-space:nowrap!important;vertical-align:middle!important;";

  if (syncBtn.parentElement !== header) {
    logoutBtn.insertAdjacentElement("afterend", syncBtn);
  }
}

export default function AdminSyncButtonRelocator() {
  useEffect(() => {
    moveSyncButton();
    const interval = window.setInterval(moveSyncButton, 500);
    const observer = new MutationObserver(moveSyncButton);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return null;
}
