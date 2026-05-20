"use client";

import { Suspense } from "react";
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

  const billNo = getParam(p, "billNo", "1056");
  const custId = getParam(p, "custId", billNo);
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

  return (
    <main className="screen">
      <button className="printBtn" onClick={() => window.print()}>Print / Save PDF</button>

      <section className="invoice">
        <div className="top">
          <div className="brand">
            <div className="carMark">🚕</div>
            <h1>VISHWAKARMA</h1>
            <p>TRAVELS</p>
          </div>

          <div className="invoiceTitle">INVOICE</div>

          <div className="company">
            <h2>Vishwakarma Travels</h2>
            <p>H No 19, Bagbera, Jugsalai</p>
            <p>Jamshedpur, Jharkhand - 831006</p>
            <b>☎ +91 917667989203</b>
            <b>☎ +91 917321083570</b>
          </div>
        </div>

        <div className="detailsGrid">
          <div className="leftInfo">
            <Info label="Bill No." value={billNo} />
            <Info label="Cust ID" value={custId} />
            <Info label="Trip Detail" value={service} />
            <Info label="Pickup Location" value={pickup} />
            <Info label="Drop Location" value={drop} />
            <Info label="Client Name" value={customerName} />
            <Info label="Address" value={pickup} />
            <Info label="Contact No." value={customerPhone} />
            <Info label="Booking Date" value={journeyDate} />
            <Info label="Reporting Time" value={journeyTime} />
            <Info label="Note" value="-" />
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
          <div>
            <div className="payableBox"><div>TOTAL AMOUNT PAYABLE</div><b>₹ {money(payable)}</b></div>
            <div className="thanksText"><p>Thank You Dear Sir/Madam</p><p>For Giving Us Booking</p><p>Thank You For Your</p><p>Support & Booking</p></div>
            <div className="payLogos">PhonePe &nbsp; BHIM &nbsp; UPI</div>
          </div>
          <div className="adjustments"><Info label="Advance" value={money(advance)} /><Info label="Discount" value="0.00" /><Info label="Round Off" value="0.00" /></div>
        </div>

        <div className="cutLine"><span>✂</span></div>
        <div className="copyHead">BOOKING CONFIRMATION COPY</div>

        <div className="copyGrid">
          <div>
            <Info label="Trip Detail" value={service} />
            <Info label="Pickup Location" value={pickup} />
            <Info label="Drop Location" value={drop} />
            <Info label="Client Name" value={customerName} />
            <Info label="Address" value={pickup} />
            <Info label="Contact No." value={customerPhone} />
            <Info label="Booking Date" value={journeyDate} />
          </div>
          <div className="copyVehicle">
            <h3>VEHICLE DETAILS</h3>
            <Info label="Vehicle Requirement" value={vehicleType} />
            <Info label="Vehicle No." value={vehicleNumber} />
            <Info label="Driver Name" value={driverName} />
            <Info label="Contact No." value={driverMobile} />
            <div className="stamp">V<br/>TAXI<br/>SERVICE</div>
          </div>
        </div>

        <div className="declaration">
          <b>DECLARATION</b>
          <p>• Book A Cab Atleast 24 Hour Before Travelling Otherwise Booking May Not Be Confirmed</p>
          <p>• After the booking is Confirmed, Customer will have to make the Advance Payment</p>
          <p>• Rs.500 Cancellation Charge will have to be paid on Cancellation of Booking under any Circumtances</p>
        </div>
        <div className="footerLine">THANK YOU & WISH YOU A VERY HAPPY JOURNEY</div>
      </section>

      <style jsx>{`
        @page { size: A4; margin: 7mm; }
        * { box-sizing: border-box; }
        .screen { min-height: 100vh; background: #e5e7eb; font-family: Arial, Helvetica, sans-serif; color: #111; }
        .printBtn { position: fixed; right: 14px; top: 14px; z-index: 10; border: 0; border-radius: 10px; background: #16a34a; color: white; padding: 10px 16px; font-weight: 900; box-shadow: 0 8px 22px rgba(0,0,0,.18); }
        .invoice { width: 210mm; min-height: 297mm; margin: 0 auto; background: white; padding: 7mm; border: 1px solid #222; }
        .top { display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; gap: 12px; border-bottom: 1px solid #333; padding-bottom: 8px; }
        .brand { color: #0b2d6b; font-weight: 900; }
        .carMark { font-size: 42px; line-height: 1; }
        .brand h1 { margin: 0; font-size: 28px; letter-spacing: .5px; }
        .brand p { margin: 3px 0 0; font-size: 15px; letter-spacing: 8px; }
        .invoiceTitle { text-align: center; font-size: 44px; font-weight: 900; color: #0b2d6b; border-bottom: 2px solid #0b2d6b; padding-bottom: 10px; }
        .company { text-align: right; color: #0b2d6b; line-height: 1.45; }
        .company h2 { margin: 0 0 4px; font-size: 25px; }
        .company p { margin: 0; font-size: 15px; }
        .company b { display: block; margin-top: 4px; font-size: 16px; }
        .detailsGrid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 22px; margin-top: 14px; }
        .leftInfo, .rightInfo { font-size: 14px; line-height: 1.65; }
        .rightInfo { border-left: 1px solid #333; padding-left: 28px; }
        .blueHead { width: 220px; background: #0b2d6b; color: white; text-align: center; font-weight: 900; padding: 7px; border-radius: 4px; margin: 0 auto 10px; }
        .info { display: grid; grid-template-columns: 150px 12px 1fr; gap: 4px; margin: 2px 0; }
        .info label { font-weight: 800; }
        .serviceTable { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 15px; }
        .serviceTable th { background: #f1f5f9; color: #0b2d6b; text-align: left; padding: 8px 12px; border: 1px solid #555; font-size: 17px; }
        .serviceTable th:last-child { width: 27%; text-align: center; }
        .serviceTable td { border: 1px solid #555; padding: 10px 12px; vertical-align: top; }
        .serviceRow td { height: 118px; }
        .serviceRow b { display: block; margin-bottom: 10px; }
        .serviceRow span { display: block; }
        .amount { text-align: right; font-weight: 900; font-size: 17px; }
        .totalRow td { height: auto; font-size: 18px; font-weight: 900; }
        .payGrid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 28px; margin-top: 14px; }
        .payableBox { display: grid; grid-template-columns: 1.25fr .95fr; border: 1px solid #333; border-radius: 4px; overflow: hidden; }
        .payableBox div { background: #0b2d6b; color: white; font-size: 18px; font-weight: 900; padding: 14px; }
        .payableBox b { text-align: center; font-size: 25px; padding: 13px; }
        .thanksText { margin-top: 20px; line-height: 1.55; font-size: 15px; }
        .thanksText p { margin: 0; }
        .payLogos { text-align: center; color: #5b21b6; font-weight: 900; font-size: 22px; margin-top: -58px; }
        .adjustments { font-size: 15px; line-height: 1.7; padding-top: 2px; }
        .cutLine { display: flex; align-items: center; gap: 10px; margin: 18px 0 10px; color: #333; }
        .cutLine:before, .cutLine:after { content: ""; flex: 1; border-top: 1px dashed #333; }
        .cutLine span { font-size: 24px; }
        .copyHead { width: 365px; margin: 0 auto 12px; background: #0b2d6b; color: white; text-align: center; font-weight: 900; border-radius: 4px; padding: 7px; }
        .copyGrid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 24px; font-size: 13px; line-height: 1.55; }
        .copyGrid .info { grid-template-columns: 128px 12px 1fr; }
        .copyVehicle { border-left: 1px solid #333; padding-left: 25px; position: relative; min-height: 120px; }
        .copyVehicle h3 { color: #0b2d6b; margin: 0 0 8px; font-size: 15px; }
        .stamp { position: absolute; right: 12px; top: 35px; width: 105px; height: 105px; border: 2px solid #0b2d6b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0b2d6b; font-weight: 900; text-align: center; transform: rotate(-12deg); }
        .declaration { border: 1px solid #777; border-radius: 4px; margin-top: 14px; padding: 8px 10px; font-size: 12.5px; line-height: 1.45; }
        .declaration b { color: #0b2d6b; font-size: 16px; }
        .declaration p { margin: 2px 0; }
        .footerLine { display: flex; align-items: center; gap: 12px; margin-top: 16px; color: #0b2d6b; font-weight: 900; text-align: center; font-size: 16px; }
        .footerLine:before, .footerLine:after { content: ""; flex: 1; border-top: 1px solid #333; }
        @media print { .screen { background: white; } .invoice { margin: 0; border: 0; width: auto; min-height: auto; } .printBtn { display: none; } }
      `}</style>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="info"><label>{label}</label><span>:</span><span>{value || "-"}</span></div>;
}
