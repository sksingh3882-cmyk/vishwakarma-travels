"use client";

import { useEffect, useState, type CSSProperties } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone || window.localStorage.getItem("vt_pwa_prompt_closed")) return;

    const showAfterPrivacy = () => {
      setTimeout(() => {
        if (deferredPrompt) setShow(true);
        else setUnsupported(true);
      }, 500);
    };

    const beforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as InstallPromptEvent);
      if (window.localStorage.getItem("vt_safety_note_seen")) {
        setTimeout(() => setShow(true), 700);
      }
    };

    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("vt_privacy_popup_closed", showAfterPrivacy);

  

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("vt_privacy_popup_closed", showAfterPrivacy);
    };
  }, [deferredPrompt]);

  const close = () => {
    window.localStorage.setItem("vt_pwa_prompt_closed", "yes");
    setShow(false);
    setUnsupported(false);
  };

  const install = async () => {
    if (!deferredPrompt) {
      setUnsupported(true);
      return;
    }

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    close();
  };

  if (!show && !unsupported) return null;

  return (
    <div style={overlay}>
      <div style={box}>
        <button type="button" onClick={close} style={x}>×</button>
        <img src="/icon-192.png" alt="Vishwakarma Travels" style={icon} />
        <h2 style={title}>Install Vishwakarma Travels App</h2>
        <p style={text}>
          Add this app to your phone home screen for faster booking access.
        </p>

        {unsupported ? (
          <p style={note}>
           Install option is not available in this browser.<br /><br />
           Please open this link in Google Chrome:<br />
        1. Tap the menu ⋮<br />
        2. Tap “Open in Chrome”<br />
        3. Then tap “Install app”
        </p>
        ) : (
          <button type="button" onClick={install} style={btn}>Install App</button>
        )}
      </div>
    </div>
  );
}

const overlay: CSSProperties = { position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,.55)", display: "grid", placeItems: "center", padding: 16 };
const box: CSSProperties = { position: "relative", width: "100%", maxWidth: 380, background: "#fff", borderRadius: 24, padding: 20, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,.35)", fontFamily: "Arial,sans-serif" };
const x: CSSProperties = { position: "absolute", right: 12, top: 10, border: 0, background: "#f3f4f6", width: 34, height: 34, borderRadius: "50%", fontSize: 24, fontWeight: 900 };
const icon: CSSProperties = { width: 72, height: 72, borderRadius: 18, marginBottom: 10 };
const title: CSSProperties = { margin: "4px 0 8px", fontSize: 22, color: "#111827" };
const text: CSSProperties = { margin: "0 0 14px", color: "#4b5563", fontSize: 14, lineHeight: 1.45 };
const note: CSSProperties = { margin: 0, color: "#0b2d6b", background: "#eff6ff", borderRadius: 14, padding: 12, fontSize: 13, fontWeight: 800 };
const btn: CSSProperties = { width: "100%", border: 0, borderRadius: 16, padding: "14px 12px", background: "#071b2d", color: "#fff", fontSize: 15, fontWeight: 900 };
