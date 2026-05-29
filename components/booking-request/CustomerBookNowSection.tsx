"use client";

import { useState } from "react";
import CustomerBookingStatusPopup from "./CustomerBookingStatusPopup";
import type { BookingRequestInput } from "@/lib/bookingRequestService";

type Props = {
  bookingData: BookingRequestInput;
  onDownloadCopy?: () => void;
  onWhatsAppRequest?: () => void;
};

export default function CustomerBookNowSection({ bookingData, onDownloadCopy, onWhatsAppRequest }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div style={wrap}>
      <button type="button" style={bookNowBtn} onClick={() => setOpen(true)}>
        Book Now
      </button>

      <div style={smallRow}>
        <button type="button" style={smallBtn} onClick={onDownloadCopy}>
          Download Copy
        </button>
        <button type="button" style={whatsBtn} onClick={onWhatsAppRequest}>
          WhatsApp
        </button>
      </div>

      <CustomerBookingStatusPopup open={open} bookingData={bookingData} onClose={() => setOpen(false)} />
    </div>
  );
}

const wrap = { width: "100%", display: "grid", gap: 8, marginTop: 10 } as const;
const bookNowBtn = {
  width: "min(92vw, 330px)",
  minHeight: 38,
  border: 0,
  borderRadius: 14,
  justifySelf: "center",
  background: "linear-gradient(135deg,#f97316,#ea580c)",
  color: "#fff",
  fontSize: 16,
  fontWeight: 900,
  letterSpacing: ".2px",
  boxShadow: "0 12px 26px rgba(234,88,12,.28)",
} as const;
const smallRow = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "min(92vw, 330px)", justifySelf: "center" } as const;
const smallBtn = { minHeight: 32, border: "1px solid #cbd5e1", borderRadius: 12, background: "#fff", color: "#0f172a", fontWeight: 800, fontSize: 12 } as const;
const whatsBtn = { minHeight: 32, border: "1px solid #bbf7d0", borderRadius: 12, background: "#ecfdf5", color: "#047857", fontWeight: 800, fontSize: 12 } as const;
