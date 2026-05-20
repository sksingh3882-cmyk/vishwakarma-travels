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

  return (
    <main className="screen">
      <button className="printBtn" onClick={() => window.print()}>Print / Save PDF</button>

      <section className="invoice">
        <div className="top">
          <div className="company leftCompany">
            <h2>Vishwakarma Travels</h2>
            <p>H No 19, Bagbera, Jugsalai</p>
            <p>Jamshedpur, Jharkhand - 831006</p>
            <b>☎ +91 917667989203</b>
            <b>☎ +91 917321083570</b>
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
            <div className="payableBox"><div>TOTAL AMOUNT<br/>PAYABLE</div><b>₹ {money(payable)}</b></div>
            <div className="thanksText">
              <p>Thank You Dear Sir/Madam For Giving Us Booking.</p>
              <p>Thank You For Your Support & Booking.</p>
            </div>
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
          </div>
        </div>

        <div className="declaration">
          <b>DECLARATION</b>
          <p>• Book A Cab Atleast 24 Hour Before Travelling Otherwise Booking May Not Be Confirmed</p>
          <p>• After the booking is Confirmed, Customer will have to make the Advance Payment</p>
          <p>• Rs.500 Cancellation Charge will have to be paid on Cancellation of Booking under any Circumtances</p>
        </div>

        <div className="footerLine">
          {"THANK YOU & WISH YOU A VERY HAPPY JOURNEY"}
        </div>
      </section>

      <style jsx global>{`
        @page { size: A4; margin: 3mm; }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        .screen { background: #e5e7eb; font-family: Arial, Helvetica, sans-serif; color: #111; padding: 0; }
        .printBtn { position: fixed; right: 14px; top: 14px; z-index: 10; border: 0; border-radius: 10px; background: #16a34a; color: white; padding: 10px 16px; font-weight: 900; box-shadow: 0 8px 22px rgba(0,0,0,.18); }
        .invoice { width: 200mm; min-height: 286mm; margin: 0 auto; background: white; padding: 5mm 7mm; overflow: hidden; page-break-after: avoid; break-after: avoid; }
        .top { display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; gap: 12px; border-bottom: 1px solid #333; padding-bottom: 7px; }
        .pdfLogo { text-align: center; color: #111; font-weight: 900; line-height: 1; }
        .logoImg { width: 220px; height: auto; object-fit: contain; display: block; margin: 0 auto; }
      `}</style>
    </main>
  );
}

function Info({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className="info"><label>{label}</label><span>:</span><span className={strong ? "strongValue" : ""}>{value || "-"}</span></div>;
}
