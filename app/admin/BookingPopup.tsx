"use client";

import html2canvas from "html2canvas";
import type { CSSProperties } from "react";

export type BookingPopupData = {
  bookingId: string;
  gender: string;
  customerName: string;
  customerPhone: string;
  service: string;
  pickup: string;
  drop: string;
  journeyDate: string;
  journeyTime: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleNumber: string;
  driverName: string;
  driverMobile: string;
  fare: number;
  advance: number;
  net: number;
};

type Props = {
  data: BookingPopupData;
  loading?: boolean;
  onClose: () => void;
  onSavePdf: () => void | Promise<void>;
  onWhatsApp: () => void | Promise<void>;
};

function value(v?: string | number) {
  return v === undefined || v === null || v === "" ? "-" : String(v);
}

async function downloadBookingImage(bookingId: string) {
  const popup = document.getElementById("booking-popup");
  if (!popup) {
    alert("Booking popup nahi mila.");
    return;
  }

  const canvas = await html2canvas(popup, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
  });

  const link = document.createElement("a");
  link.download = `booking-${bookingId || Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export default function BookingPopup({ data, loading, onClose, onSavePdf, onWhatsApp }: Props) {
  return (
    <div style={overlay}>
      <div style={popupWrap}>
        <button onClick={onClose} style={closeBtn}>×</button>

        <div id="booking-popup" style={card}>
          <img src="/cars/popup_banner.png" alt="Vishwakarma Travels" style={banner} />

          <div style={content}>
            <div style={copyBadge}>BOOKING COPY</div>
            <h2 style={title}>Vishwakarma Travels</h2>
            <p style={subTitle}>Booking Confirmation</p>

            <div style={twoCol}>
              <Info label="Booking ID" value={data.bookingId} />
              <Info label="Service" value={data.service} />
              <Info label="Customer" value={`${value(data.gender)} ${value(data.customerName)}`} />
              <Info label="Mobile" value={`+91 ${value(data.customerPhone)}`} />
              <Info label="Date" value={data.journeyDate} />
              <Info label="Time" value={data.journeyTime} />
            </div>

            <div style={routeBox}>
              <div style={routeCell}>
                <small style={routeLabel}>Pickup</small>
                <b style={routeText}>{value(data.pickup)}</b>
              </div>
              <div style={arrow}>→</div>
              <div style={routeCell}>
                <small style={routeLabel}>Drop</small>
                <b style={routeText}>{value(data.drop)}</b>
              </div>
            </div>

            <div style={section}>
              <h3 style={sectionTitle}>Vehicle & Driver Details</h3>
              <div style={twoCol}>
                <Info label="Vehicle Type" value={data.vehicleType} />
                <Info label="Vehicle Model" value={data.vehicleModel} />
                <Info label="Vehicle No." value={data.vehicleNumber} />
                <Info label="Driver Name" value={data.driverName} />
                <Info label="Driver Mobile" value={data.driverMobile} />
              </div>
            </div>

            <div style={fareBox}>
              <Money label="Total Fare" value={data.fare} />
              <Money label="Advance Paid" value={data.advance} />
              <div style={netRow}><span>Net Payable</span><b>₹ {data.net}</b></div>
            </div>

            <div style={declaration}>
              <b>Declaration:</b> Please verify pickup, drop, journey date, time, vehicle and fare details before starting the journey. Toll, parking, state tax or extra waiting charges will be payable separately if applicable.
            </div>

            <div style={thankYou}>THANK YOU</div>
            <div style={footer}>Thank you for choosing Vishwakarma Travels. Wish you a very happy and safe journey.</div>
          </div>
        </div>

        <div style={actions}>
          <button disabled={loading} onClick={onSavePdf} style={savePdfBtn}>{loading ? "Please wait..." : "Save + PDF"}</button>
          <button disabled={loading} onClick={() => downloadBookingImage(data.bookingId)} style={imageBtn}>Download Image</button>
          <button disabled={loading} onClick={onWhatsApp} style={waBtn}>WhatsApp</button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value: v }: { label: string; value?: string | number }) {
  return <div style={infoRow}><span>{label}</span><b>{value(v)}</b></div>;
}

function Money({ label, value: v }: { label: string; value: number }) {
  return <div style={moneyRow}><span>{label}</span><b>₹ {v}</b></div>;
}

const overlay: CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 10 };
const popupWrap: CSSProperties = { width: "100%", maxWidth: 430, maxHeight: "94vh", overflowY: "auto", position: "relative" };
const closeBtn: CSSProperties = { position: "sticky", top: 8, float: "right", zIndex: 5, width: 34, height: 34, borderRadius: "50%", border: 0, background: "white", fontSize: 24, fontWeight: 900, boxShadow: "0 4px 12px rgba(0,0,0,.2)" };
const card: CSSProperties = { clear: "both", background: "white", borderRadius: 22, overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,.35)", fontFamily: "Arial, sans-serif", color: "#102033" };
const banner: CSSProperties = { width: "100%", display: "block", background: "white" };
const content: CSSProperties = { padding: "12px 14px 14px" };
const copyBadge: CSSProperties = { display: "inline-block", background: "#0b2d6b", color: "white", borderRadius: 999, padding: "5px 11px", fontSize: 11.5, fontWeight: 900, letterSpacing: .4 };
const title: CSSProperties = { color: "#0b2d6b", margin: "8px 0 1px", fontSize: 23, fontWeight: 950 };
const subTitle: CSSProperties = { margin: "0 0 10px", color: "#f97316", fontWeight: 900 };
const twoCol: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 };
const infoRow: CSSProperties = { border: "1px solid #e2e8f0", borderRadius: 11, padding: "7px 8px", display: "grid", gap: 2, fontSize: 12.2 };
const routeBox: CSSProperties = { margin: "9px 0", border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: "9px 10px", display: "grid", gridTemplateColumns: "minmax(0, 1fr) 30px minmax(0, 1fr)", gap: 7, alignItems: "center" };
const routeCell: CSSProperties = { minWidth: 0 };
const routeLabel: CSSProperties = { display: "block", color: "#64748b", fontWeight: 900, marginBottom: 2, textTransform: "uppercase", fontSize: 10.5 };
const routeText: CSSProperties = { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word", lineHeight: 1.22, fontSize: 12.5 };
const arrow: CSSProperties = { width: 30, height: 30, borderRadius: "50%", background: "#f97316", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 950 };
const section: CSSProperties = { marginTop: 8 };
const sectionTitle: CSSProperties = { margin: "0 0 7px", color: "#0b2d6b", fontSize: 14.5 };
const fareBox: CSSProperties = { marginTop: 9, background: "#0b2d6b", color: "white", borderRadius: 14, padding: "9px 11px" };
const moneyRow: CSSProperties = { display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,.25)", fontSize: 12.5 };
const netRow: CSSProperties = { marginTop: 7, background: "#f97316", color: "white", borderRadius: 11, padding: "8px 10px", display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 950 };
const declaration: CSSProperties = { marginTop: 8, borderLeft: "4px solid #f97316", background: "#fff7ed", borderRadius: 10, padding: "8px 10px", fontSize: 11.7, lineHeight: 1.32 };
const thankYou: CSSProperties = { marginTop: 9, textAlign: "center", color: "#0b2d6b", fontSize: 23, fontWeight: 950, letterSpacing: 1.1, lineHeight: 1 };
const footer: CSSProperties = { textAlign: "center", color: "#475569", fontSize: 11.6, marginTop: 4, lineHeight: 1.25 };
const actions: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, background: "white", padding: 10, borderRadius: 18, marginTop: 10 };
const savePdfBtn: CSSProperties = { padding: "12px 8px", background: "#15803d", color: "white", border: 0, borderRadius: 12, fontWeight: 900 };
const imageBtn: CSSProperties = { padding: "12px 8px", background: "#f97316", color: "white", border: 0, borderRadius: 12, fontWeight: 900 };
const waBtn: CSSProperties = { padding: "12px 8px", background: "#25D366", color: "white", border: 0, borderRadius: 12, fontWeight: 900 };