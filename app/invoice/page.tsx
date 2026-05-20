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

          <div className="pdfLogo">
            <img src="/cars/pdflogo.png" alt="Vishwakarma Travels Logo" className="logoImg" />
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
          <div className="copyVehicle"><h3>VEHICLE DETAILS</h3><Info label="Vehicle Requirement" value={vehicleType} /><Info label="Vehicle No." value={vehicleNumber} /><Info label="Driver Name" value={driverName} /><Info label="Contact No." value={driverMobile} /></div>
        </div>

        <div className="declaration"><b>DECLARATION</b><p>• Book A Cab Atleast 24 Hour Before Travelling Otherwise Booking May Not Be Confirmed</p><p>• After the booking is Confirmed, Customer will have to make the Advance Payment</p><p>• Rs.500 Cancellation Charge will have to be paid on Cancellation of Booking under any Circumtances</p></div>

        <div className="footerLine">{"THANK YOU & WISH YOU A VERY HAPPY JOURNEY"}</div>
      </section>

      <style jsx global>{`
        @page { size: A4; margin: 2mm; }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        .screen { background: #e5e7eb; font-family: Arial, Helvetica, sans-serif; color: #111; padding: 0; }
        .printBtn { position: fixed; right: 14px; top: 14px; z-index: 10; border: 0; border-radius: 10px; background: #16a34a; color: white; padding: 10px 16px; font-weight: 900; box-shadow: 0 8px 22px rgba(0,0,0,.18); }
        .invoice { width: 200mm; min-height: 282mm; margin: 0 auto; background: white; padding: 4mm 7mm; overflow: hidden; page-break-after: avoid; break-after: avoid; }
        .top { display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; gap: 10px; border-bottom: 1px solid #333; padding-bottom: 5px; }
        .pdfLogo { text-align: center; color: #111; font-weight: 900; line-height: 1; }
        .logoImg { width: 190px; height: auto; object-fit: contain; display: block; margin: 0 auto; }
        .invoiceTitle { text-align: center; font-size: 36px; font-weight: 900; color: #0b2d6b; border-bottom: 2px solid #0b2d6b; padding-bottom: 4px; letter-spacing: .5px; }
        .company { color: #0b2d6b; line-height: 1.24; }
        .leftCompany { text-align: left; }
        .company h2 { margin: 0 0 2px; font-size: 22px; }
        .company p { margin: 0; font-size: 13px; }
        .company b { display: block; margin-top: 2px; font-size: 14px; }
        .detailsGrid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 18px; margin-top: 8px; }
        .leftInfo, .rightInfo { font-size: 12.8px; line-height: 1.33; }
        .rightInfo { border-left: 1px solid #333; padding-left: 28px; }
        .blueHead { width: 210px; background: #0b2d6b; color: white; text-align: center; font-weight: 900; padding: 5px; border-radius: 4px; margin: 0 auto 7px; font-size: 15px; }
        .info { display: grid; grid-template-columns: 150px 11px 1fr; gap: 4px; margin: 1px 0; align-items: start; }
        .info label { font-weight: 700; }
        .info .strongValue { font-weight: 900; font-size: 14px; }
        .serviceTable { width: 100%; border-collapse: collapse; margin-top: 9px; font-size: 13px; }
        .serviceTable th { background: #f1f5f9; color: #0b2d6b; text-align: left; padding: 6px 10px; border: 1px solid #555; font-size: 15px; }
        .serviceTable th:last-child { width: 27%; text-align: center; }
        .serviceTable td { border: 1px solid #555; padding: 7px 10px; vertical-align: top; }
        .serviceRow td { height: 64px; }
        .serviceRow b { display: block; margin-bottom: 5px; }
        .serviceRow span { display: block; }
        .amount { text-align: right; font-weight: 900; font-size: 15px; }
        .totalRow td { height: auto; font-size: 16px; font-weight: 900; }
        .payGrid { display: grid; grid-template-columns: 1.1fr 1.25fr; gap: 14px; margin-top: 8px; align-items: stretch; }
        .payableBox { display: grid; grid-template-columns: 1.25fr .85fr; align-items: center; border: 1px solid #333; border-radius: 4px; overflow: hidden; width: 100%; min-height: 37px; }
        .payableBox span { background: #f8fafc; color: #777; font-size: 15px; line-height: 1; font-weight: 900; padding: 10px 12px; white-space: nowrap; }
        .payableBox b { text-align: center; font-size: 22px; padding: 8px 10px; white-space: nowrap; }
        .thanksText { margin-top: 8px; line-height: 1.26; font-size: 12.5px; }
        .thanksText p { margin: 0; }
        .adjustments { font-size: 12.5px; line-height: 1.35; padding-top: 2px; }
        .adjustments .info { grid-template-columns: 115px 11px 1fr; }
        .cutLine { display: flex; align-items: center; gap: 10px; margin: 7px 0 7px; color: #333; }
        .cutLine:before, .cutLine:after { content: ""; flex: 1; border-top: 1px dashed #333; }
        .cutLine span { font-size: 18px; }
        .copyHead { width: 390px; margin: 0 auto 7px; background: #0b2d6b; color: white; text-align: center; font-weight: 900; border-radius: 4px; padding: 5px; font-size: 14px; }
        .copyGrid { display: grid; grid-template-columns: 1.08fr .92fr; gap: 20px; font-size: 11.4px; line-height: 1.25; }
        .copyGrid .info { grid-template-columns: 125px 11px 1fr; }
        .copyVehicle { border-left: 1px solid #333; padding-left: 26px; min-height: 84px; }
        .copyVehicle h3 { color: #0b2d6b; margin: 0 0 5px; font-size: 15px; }
        .declaration { border: 1px solid #777; border-radius: 4px; margin-top: 7px; padding: 5px 9px; font-size: 10.4px; line-height: 1.18; }
        .declaration b { color: #0b2d6b; font-size: 14px; }
        .declaration p { margin: 1px 0; }
        .footerLine { display: flex; align-items: center; gap: 10px; margin-top: 7px; color: #0b2d6b; font-weight: 900; text-align: center; font-size: 12.5px; }
        .footerLine:before, .footerLine:after { content: ""; flex: 1; border-top: 1px solid #333; }
        @media print {
          html, body { width: 210mm; min-height: 297mm; margin: 0; padding: 0; }
          .screen { background: white; width: 210mm; min-height: 297mm; overflow: hidden; }
          .invoice { margin: 0; width: 204mm; min-height: 289mm; padding: 4mm 7mm; page-break-after: avoid; break-after: avoid; }
          .printBtn { display: none; }
        }
      `}</style>
    </main>
  );
}

function Info({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className="info"><label>{label}</label><span>:</span><span className={strong ? "strongValue" : ""}>{value || "-"}</span></div>;
}
