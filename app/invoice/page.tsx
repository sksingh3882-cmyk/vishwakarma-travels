"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type ParamsLike = { get: (key: string) => string | null };

function getParam(params: ParamsLike, key: string, fallback = "-") {
  return params.get(key) || fallback;
}

function money(v: string) {
  const n = Number(v || 0);
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<main style={{ padding: 24 }}>Loading invoice...</main>}>
      <InvoiceContent />
    </Suspense>
  );
}

function InvoiceContent() {
  const p = useSearchParams();
  const bookingId = getParam(p, "bookingId", getParam(p, "id", "VT-000000"));
  const service = getParam(p, "service", "Airport Drop Pickup");
  const pickup = getParam(p, "pickup", "-");
  const drop = getParam(p, "drop", "-");
  const customerName = getParam(p, "customerName", "Customer");
  const customerPhone = getParam(p, "customerPhone", "-");
  const journeyDate = getParam(p, "journeyDate", "-");
  const journeyTime = getParam(p, "journeyTime", "-");
  const vehicleType = getParam(p, "vehicleType", "-");
  const vehicleModel = getParam(p, "vehicleModel", "-");
  const vehicleNumber = getParam(p, "vehicleNumber", "-");
  const driverName = getParam(p, "driverName", "-");
  const driverMobile = getParam(p, "driverMobile", "-");
  const fare = getParam(p, "fare", "0");
  const advance = getParam(p, "advance", "0");
  const payable = String(Math.max(Number(fare || 0) - Number(advance || 0), 0));

  useEffect(() => {
    document.title = `Invoice-${bookingId}`;
  }, [bookingId]);

  return (
    <main className="screen invoicePage">
      <button className="printBtn" onClick={() => window.print()}>Print / Save PDF</button>
      <section className="invoice">
        <div className="top">
          <div className="company">
            <h2>Vishwakarma Travels</h2>
            <p>H No 19, Bagbera, Jugsalai</p>
            <p>Jamshedpur, Jharkhand - 831006</p>
            <b>Phone: +91 917667989203</b>
            <b>Phone: +91 917321083570</b>
          </div>
          <div className="invoiceTitle">INVOICE</div>
          <div className="topLogo"><img src="/cars/pdflogo.png" alt="Logo" className="topLogoImg" /></div>
        </div>

        <div className="detailsGrid">
          <div className="leftInfo">
            <Info label="Booking ID" value={bookingId} strong />
            <Info label="Trip Detail" value={service} />
            <Info label="Pickup Location" value={pickup} />
            <Info label="Drop Location" value={drop} />
            <Info label="Client Name" value={customerName} />
            <Info label="Contact No." value={customerPhone} />
            <Info label="Journey Date" value={journeyDate} />
            <Info label="Reporting Time" value={journeyTime} />
          </div>
          <div className="rightInfo">
            <div className="blueHead">VEHICLE DETAILS</div>
            <Info label="Vehicle Type" value={vehicleType} />
            <Info label="Vehicle Model" value={vehicleModel} />
            <Info label="Vehicle No." value={vehicleNumber} />
            <Info label="Driver Name" value={driverName} />
            <Info label="Driver Contact" value={driverMobile} />
          </div>
        </div>

        <table className="serviceTable"><thead><tr><th>SERVICE</th><th>AMOUNT (₹)</th></tr></thead><tbody><tr><td><b>{service}</b><div className="route">{pickup} - {drop}</div></td><td className="amount">{money(fare)}</td></tr><tr><td className="totalLabel">TOTAL AMOUNT</td><td className="amount">{money(fare)}</td></tr></tbody></table>
        <div className="payableBox"><span>Total Amount Payable</span><b>₹ {money(payable)}</b></div>
        <div className="thanksText"><p>Thank You Dear Sir/Madam For Giving Us Booking.</p><p>Thank You For Your Support & Booking.</p></div>
        <div className="cutLine"><span>✂</span></div>
        <div className="copyHead">BOOKING CONFIRMATION COPY</div>
        <div className="copyGrid"><div><Info label="Trip Detail" value={service} /><Info label="Pickup Location" value={pickup} /><Info label="Drop Location" value={drop} /><Info label="Client Name" value={customerName} /><Info label="Contact No." value={customerPhone} /><Info label="Booking Date" value={journeyDate} /></div><div className="copyVehicle"><h3>VEHICLE DETAILS</h3><Info label="Vehicle Type" value={vehicleType} /><Info label="Vehicle Model" value={vehicleModel} /><Info label="Vehicle No." value={vehicleNumber} /><Info label="Driver Name" value={driverName} /><Info label="Contact No." value={driverMobile} /></div></div>
        <div className="declaration"><b>DECLARATION</b><p>• Book a cab at least 24 hours before travelling; otherwise, booking may not be confirmed.</p><p>• After the booking is confirmed, the customer must make the advance payment.</p><p>• A Rs. 500 cancellation charge applies if the booking is cancelled.</p></div>
        <div className="footerLine">THANK YOU & WISH YOU A VERY HAPPY JOURNEY</div>
      </section>

      <style jsx global>{`
        @page{size:A4 portrait;margin:5mm}
        *{box-sizing:border-box}html,body{margin:0;padding:0}.invoicePage{background:#eef2f7;font-family:Arial,Helvetica,sans-serif;color:#111;padding:14px 0;overflow-x:auto}.printBtn{position:fixed;right:18px;top:18px;z-index:1000;border:0;border-radius:10px;background:#16a34a;color:#fff;padding:10px 16px;font-weight:900}body>div[style*="position: fixed"],body>div[style*="position:fixed"],body>button[style*="position: fixed"],body>button[style*="position:fixed"],[class*="AppMenu"],[class*="appMenu"],[aria-label*="menu" i]{display:none!important;visibility:hidden!important}.invoice{width:190mm;margin:0 auto;background:#fff;padding:6mm 8mm 5mm;box-shadow:0 2px 14px rgba(15,23,42,.12)}.top{display:grid;grid-template-columns:1.25fr .8fr .7fr;align-items:center;gap:8px;border-bottom:2px solid #111;padding-bottom:5px;margin-bottom:8px}.company h2{margin:0 0 2px;font-size:24px;color:#0b2d6b}.company p,.company b{display:block;margin:1px 0;font-size:13px}.invoiceTitle{text-align:center;font-size:31px;font-weight:900;color:#0b2d6b;border-bottom:2px solid #0b2d6b}.topLogo{text-align:right}.topLogoImg{width:92px;height:auto;box-shadow:none!important;border:0!important;border-radius:0!important;filter:none!important;background:transparent!important}.detailsGrid{display:grid;grid-template-columns:1.15fr .85fr;gap:14px;margin-top:5px}.leftInfo,.rightInfo{font-size:14px;line-height:1.22}.rightInfo{border-left:2px solid #333;padding-left:14px}.blueHead{background:#0b2d6b;color:white;text-align:center;font-weight:900;padding:3px 4px;margin-bottom:5px}.info{display:grid;grid-template-columns:125px 10px 1fr;gap:4px;margin-bottom:3px}.info label,.strongValue{font-weight:900}.serviceTable{width:100%;border-collapse:collapse;margin-top:7px;font-size:13.5px}.serviceTable th,.serviceTable td{border:1px solid #333;padding:6px 7px}.serviceTable th{background:#f1f5f9;color:#0b2d6b}.amount{text-align:right;font-weight:900}.totalLabel{font-weight:900}.payableBox{margin-top:7px;border:2px solid #333;padding:8px 10px;display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:900}.payableBox b{font-size:25px}.thanksText{font-size:12px;margin-top:5px}.thanksText p{margin:0}.cutLine{display:flex;align-items:center;gap:10px;margin:5px 0}.cutLine:before,.cutLine:after{content:"";flex:1;border-top:1px dashed #333}.copyHead{background:#0b2d6b;color:white;text-align:center;font-weight:900;padding:4px;margin-bottom:5px}.copyGrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:12.5px}.copyVehicle{border-left:2px solid #333;padding-left:14px}.copyVehicle h3{margin:0 0 4px;color:#0b2d6b}.declaration{border:1px solid #777;border-radius:4px;margin-top:5px;padding:5px 8px;font-size:10.5px}.declaration p{margin:2px 0}.footerLine{display:flex;align-items:center;gap:10px;margin-top:5px;color:#0b2d6b;font-weight:900;font-size:11px}.footerLine:before,.footerLine:after{content:"";flex:1;border-top:1px solid #333}@media print{.printBtn,body>div[style*="position: fixed"],body>div[style*="position:fixed"],body>button[style*="position: fixed"],body>button[style*="position:fixed"],[class*="AppMenu"],[class*="appMenu"],[aria-label*="menu" i]{display:none!important;visibility:hidden!important}.invoicePage{background:#fff;padding:0!important;overflow:visible!important}.invoice{width:190mm!important;box-shadow:none!important;margin:0 auto!important;padding:4mm 7mm 3mm!important}.topLogoImg{box-shadow:none!important;border-radius:0!important;filter:none!important}}
      `}</style>
    </main>
  );
}

function Info({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className="info"><label>{label}</label><span>:</span><span className={strong ? "strongValue" : ""}>{value || "-"}</span></div>;
}
