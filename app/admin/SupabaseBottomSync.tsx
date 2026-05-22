"use client";

import { useState } from "react";

export default function SupabaseBottomSync() {
  const [syncing, setSyncing] = useState(false);

  function handleSync() {
    if (syncing) return;
    setSyncing(true);
    window.setTimeout(() => window.location.reload(), 250);
  }

  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={syncing}
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 10,
        zIndex: 99999,
        height: 50,
        border: 0,
        borderRadius: 16,
        background: "#0b2d6b",
        color: "white",
        fontWeight: 950,
        fontSize: 15,
        boxShadow: "0 10px 28px rgba(15,23,42,.25)",
      }}
    >
      {syncing ? "Syncing..." : "↻ Supabase Sync"}
    </button>
  );
}
