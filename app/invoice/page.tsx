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

  const bookingId = getParam(p, "bookingId", getParam(p, "id", "VT 1779269641437"));
  const service = getParam(p, "service", "Airport Drop Pickup");
  const pickup = getParam(p, "pickup", "Ranchi Airport");
  const drop = getParam(p, "drop", "Jamshedpur");
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
    const safeCustomer = customerName.replace(/\s+/g, "-");
    const safeService = service.replace(/\s+/g, "-");
    document.title = `${safeCustomer}-${safeService}`;
  }, [customerName, service]);

  return (
    <main className="screen">
      <button className="printBtn" onClick={() => window.print()}>Print / Save PDF</button>

      <section className="invoice">
        <div className="top">
          <div className="company leftCompany">
            <h2>Vishwakarma Travels</h2>
            <p>H No 19, Bagbera, Jugsalai</p>
            <p>Jamshedpur, Jharkhand - 831006</p>
            <b>Phone: +91 917667989203</b>
            <b>Phone: +91 917321083570</b>
          </div>

          <div className="invoiceTitle">INVOICE</div>

          <div className="topLogo">
            <img src="/cars/pdflogo.png" alt="Vishwakarma Travels Logo" className="topLogoImg" />
          </div>
        </div>

        <div className="detailsGrid">
          <div className="leftInfo">
            <Info label="Booking ID" value={bookingId} strong />
            <Info label="Trip Detail" value={service} />
            <Info label="Pickup Location" value={pickup} />
            <Info label="Drop Location" value={drop} />
            <Info label="Client Name" value={customerName} />
            <Info label="Address" value={pickup} />
            <Info label="Contact No." value={customerPhone} />
            <Info label="Booking Date" value={journeyDate} />
            <Info label="Reporting Time" value={journeyTime} />
          </div>

          <div className="rightInfo">
            <div className="blueHead">VEHICLE DETAILS</div>
            <Info label="Reg No." value={vehicleNumber} />
            <Info label="Model" value={vehicleModel} />
            <Info label="Cab Type" value={vehicleType} />
            <Info label="Driver Name" value={driverName} />
            <Info label="Contact No." value={driverMobile} />
          </div>
        </div>

        <table className="serviceTable">
          <thead><tr><th>SERVICE</th><th>AMOUNT (₹)</th></tr></thead>
          <tbody>
            <tr className="serviceRow">
              <td><b>{service}</b><span>{pickup} - {drop}</span></td>
              <td className="amount">{money(fare)}</td>
            </tr>
            <tr className="totalRow"><td>TOTAL AMOUNT</td><td className="amount">{money(fare)}</td></tr>
          </tbody>
        </table>

        <div className="payGrid">
          <div className="payableBox"><span>TOTAL AMOUNT PAYABLE</span><b>₹ {money(payable)}</b></div>
          <div className="adjustments"><Info label="Advance" value={money(advance)} /><Info label="Discount" value="0.00" /><Info label="Round Off" value="0.00" /></div>
        </div>

        <div className="thanksText"><p>Thank You Dear Sir/Madam For Giving Us Booking.</p><p>Thank You For Your Support & Booking.</p></div>
        <div className="cutLine"><span>✂</span></div>
        <div className="copyHead">BOOKING CONFIRMATION COPY</div>
        <div className="copyGrid">
          <div><Info label="Trip Detail" value={service} /><Info label="Pickup Location" value={pickup} /><Info label="Drop Location" value={drop} /><Info label="Client Name" value={customerName} /><Info label="Address" value={pickup} /><Info label="Contact No." value={customerPhone} /><Info label="Booking Date" value={journeyDate} /></div>
          <div className="copyVehicle"><h3>VEHICLE DETAILS</h3><Info label="Vehicle Requirement" value={vehicleType} /><Info label="Vehicle Model" value={vehicleModel} /><Info label="Vehicle No." value={vehicleNumber} /><Info label="Driver Name" value={driverName} /><Info label="Contact No." value={driverMobile} /></div>
        </div>
        <div className="declaration"><b>DECLARATION</b><p>• Book a cab at least 24 hours before travelling; otherwise, booking may not be confirmed.</p><p>• After the booking is confirmed, the customer must make the advance payment.</p><p>• A Rs. 500 cancellation charge applies if the booking is cancelled.</p></div>
        <div className="footerLine">THANK YOU & WISH YOU A VERY HAPPY JOURNEY</div>
      </section>

      <style jsx global>{`
        @page { size: A4 portrait; margin: 0; }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        .screen { background: #e5e7eb; font-family: Arial, Helvetica, sans-serif; color: #111; padding: 0; }
        .printBtn { position: fixed; right: 14px; top: 14px; z-index: 10; border: 0; border-radius: 10px; background: #16a34a; color: white; padding: 10px 16px; font-weight: 900; }
        .invoice { width: 205mm; margin: 0 auto; background: white; padding: 3mm 6mm 2mm; overflow: hidden; }
        .top { display: grid; grid-template-columns: 1.18fr .92fr .9fr; align-items: center; gap: 8px; border-bottom: 1px solid #333; padding-bottom: 4px; }
        .invoiceTitle { text-align: center; font-size: 38px; font-weight: 900; color: #0b2d6b; border-bottom: 2px solid #0b2d6b; padding-bottom: 2px; }
        .topLogo { display: flex; justify-content: flex-end; }
        .topLogoImg { width: 120px; height: auto; }
        .company h2 { margin: 0 0 2px; font-size: 24px; color: #0b2d6b; }
        .company p { margin: 0; font-size: 13px; }
        .company b { display: block; margin-top: 2px; font-size: 13px; }
        .detailsGrid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 14px; margin-top: 6px; }
        .leftInfo, .rightInfo { font-size: 13px; line-height: 1.25; }
        .rightInfo { border-left: 1px solid #333; padding-left: 18px; }
        .blueHead { background: #0b2d6b; color: white; text-align: center; font-weight: 900; padding: 4px; border-radius: 4px; margin-bottom: 6px; }
        .info { display: grid; grid-template-columns: 140px 10px 1fr; gap: 4px; }
        .info label { font-weight: 700; }
        .strongValue { font-weight: 900; }
        .serviceTable { width: 100%; border-collapse: collapse; margin-top: 7px; font-size: 13px; }
        .serviceTable th,.serviceTable td { border: 1px solid #555; padding: 6px 8px; }
        .serviceTable th { background: #f1f5f9; color: #0b2d6b; }
        .amount { text-align: right; font-weight: 900; }
        .payGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 6px; }
        .payableBox { display: flex; justify-content: space-between; align-items: center; border: 1px solid #333; padding: 8px 10px; font-weight: 900; }
        .payableBox span { font-size: 14px; }
        .payableBox b { font-size: 24px; }
        .thanksText { margin-top: 5px; font-size: 12px; }
        .thanksText p { margin: 0; }
        .adjustments { font-size: 12px; }
        .cutLine { display: flex; align-items: center; gap: 10px; margin: 5px 0; }
        .cutLine:before,.cutLine:after { content:""; flex:1; border-top:1px dashed #333; }
        .copyHead { background: #0b2d6b; color: white; text-align: center; font-weight: 900; padding: 4px; border-radius: 4px; margin-bottom: 5px; }
        .copyGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 11px; }
        .copyVehicle { border-left: 1px solid #333; padding-left: 14px; }
        .copyVehicle h3 { margin: 0 0 4px; color: #0b2d6b; }
        .declaration { border: 1px solid #777; border-radius: 4px; margin-top: 5px; padding: 5px 8px; font-size: 10px; }
        .declaration p { margin: 2px 0; }
        .footerLine { display: flex; align-items: center; gap: 10px; margin-top: 5px; color: #0b2d6b; font-weight: 900; font-size: 11px; }
        .footerLine:before,.footerLine:after { content:""; flex:1; border-top:1px solid #333; }

        @media print {
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; overflow: hidden !important; }
          .printBtn { display: none !important; }
          .screen { padding: 0 !important; margin: 0 !important; background: white !important; }
          .invoice {
            width: 100%;
            max-width: 205mm;
            margin: 0 auto !important;
            padding: 2mm 5mm 1mm !important;
            transform: none !important;
            min-height: auto !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .top { margin-top: 0 !important; padding-top: 0 !important; }
          .footerLine { margin-bottom: 0 !important; padding-bottom: 0 !important; }
        }
      `}</style>
    </main>
  );
}

function Info({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className="info"><label>{label}</label><span>:</span><span className={strong ? "strongValue" : ""}>{value || "-"}</span></div>;
}
