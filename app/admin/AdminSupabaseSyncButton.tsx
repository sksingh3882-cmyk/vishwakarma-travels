"use client";

import { useState } from "react";

export default function AdminSupabaseSyncButton() {
  const [syncing, setSyncing] = useState(false);

  async function sync() {
    if (syncing) return;
    setSyncing(true);
    try {
      window.dispatchEvent(new Event("vt-supabase-sync"));
      window.setTimeout(() => window.location.reload(), 350);
    } catch {
      window.location.reload();
    }
  }

  return (
    <button className="vt-supabase-sync-fixed" type="button" onClick={sync} disabled={syncing}>
      {syncing ? "Syncing..." : "↻ Supabase Sync"}
    </button>
  );
}
