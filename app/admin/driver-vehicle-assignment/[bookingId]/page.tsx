"use client";

import { useMemo, useState } from "react";

type DriverVehicleDetails = {
  driverName: string;
  driverPhone: string;
  vehicleName: string;
  vehicleNumber: string;
  vehicleColor: string;
  note: string;
};

export default function DriverVehicleAssignmentPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const [pickupArea, setPickupArea] = useState("Sonari");
  const [dropArea, setDropArea] = useState("Ranchi Airport");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);
  const [vehiclePopupOpen, setVehiclePopupOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] =
    useState<DriverVehicleDetails | null>(null);

  const bookingId = params?.bookingId || "test-booking-1";

  const trip = {
    service: "Outstation / Local / Airport",
    date: "10 June 2026",
    time: "08:00 AM",
    vehicleRequired: "Sedan",
    customerName: "Test Customer",
    customerPhone: "98xxxxxx12",
    pickupFull: "Sonari, Jamshedpur",
    dropFull: "Ranchi Airport",
  };

  const receivedVehicleDetails: DriverVehicleDetails = {
    driverName: "Ramesh Kumar",
    driverPhone: "98765 43210",
    vehicleName: "Swift Dzire",
    vehicleNumber: "JH05 AB 1234",
    vehicleColor: "White",
    note: "Driver confirmed availability for this duty.",
  };

  const driverLink = `https://vishwakarma-travels-nine.vercel.app/driver-duty/${bookingId}`;

  const groupMessage = useMemo(() => {
    return `🚕 *New Duty Available - Vishwakarma Travels*

🛣️ Service: ${trip.service}
📅 Date: ${trip.date}
⏰ Time: ${trip.time}
🚘 Vehicle Required: ${trip.vehicleRequired}

📍 Pickup Area: ${pickupArea || "-"}
🏁 Drop Area: ${dropArea || "-"}

📞 Interested Person please Call.
☎️ Contact: ${trip.customerPhone}

📝 Note: ${note || ""}`;
  }, [pickupArea, dropArea, note, trip.customerPhone, trip.date, trip.service, trip.time, trip.vehicleRequired]);

  async function copyGroupMessage() {
    try {
      await navigator.clipboard.writeText(groupMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
      alert("Copy failed. Please copy message manually.");
    }
  }

  function sendWhatsAppGroupMessage() {
    const url = `https://wa.me/?text=${encodeURIComponent(groupMessage)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyDriverLink() {
    try {
      await navigator.clipboard.writeText(driverLink);
      alert("Driver link copied. You can send this link to driver.");
    } catch {
      alert("Copy failed. Please copy driver link manually.");
    }
  }

  function useVehicleDetails() {
    setSelectedVehicle(receivedVehicleDetails);
    setVehiclePopupOpen(false);
  }

  function removeVehicleDetails() {
    setSelectedVehicle(null);
  }
  return (
    <main className="page">
      <section className="topBar">
        <div>
          <p className="eyebrow">Vishwakarma Travels Admin</p>
          <h1>Driver & Vehicle Assignment</h1>
          <p className="subText">Booking ID: {bookingId}</p>
        </div>

        <div className="statusPill">Design Preview</div>
      </section>

      <section className="grid">
        <div className="leftCol">
          <div className="card">
            <div className="cardHead">
              <div>
                <p className="eyebrow">Trip Details</p>
                <h2>Customer Duty Request</h2>
              </div>
              <span className="miniBadge">New Duty</span>
            </div>

            <div className="detailsGrid">
              <Info label="Service" value={trip.service} />
              <Info label="Date" value={trip.date} />
              <Info label="Time" value={trip.time} />
              <Info label="Vehicle Required" value={trip.vehicleRequired} />
              <Info label="Customer Name" value={trip.customerName} />
              <Info label="Customer Contact" value={trip.customerPhone} />
              <Info label="Pickup Full Address" value={trip.pickupFull} />
              <Info label="Drop Full Address" value={trip.dropFull} />
            </div>
          </div>

          <div className="card">
            <div className="cardHead">
              <div>
                <p className="eyebrow">Editable Short Areas</p>
                <h2>Group Message Pickup / Drop</h2>
              </div>
            </div>

            <div className="fieldGrid">
              <label>
                <span>Pickup Area</span>
                <input
                  value={pickupArea}
                  onChange={(e) => setPickupArea(e.target.value)}
                  placeholder="Pickup Area"
                />
              </label>
              <label>
                <span>Drop Area</span>
                <input
                  value={dropArea}
                  onChange={(e) => setDropArea(e.target.value)}
                  placeholder="Drop Area"
                />
              </label>
            </div>

            <label className="fullField">
              <span>Note</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Admin note optional. Leave blank if not needed."
                rows={3}
              />
            </label>
          </div>

          <div className="card">
            <div className="cardHead">
              <div>
                <p className="eyebrow">Driver Response</p>
                <h2>Vehicle Details Received</h2>
              </div>

              <button
                type="button"
                className="outlineBtn"
                onClick={() => setVehiclePopupOpen(true)}
              >
                Preview Popup
              </button>
            </div>

            {selectedVehicle ? (
              <div className="selectedVehicleBox">
                <div>
                  <p className="eyebrow">Selected Vehicle</p>
                  <h3>
                    {selectedVehicle.vehicleName} • {selectedVehicle.vehicleNumber}
                  </h3>
                  <p>
                    Driver: {selectedVehicle.driverName} •{" "}
                    {selectedVehicle.driverPhone}
                  </p>
                  <p>Color: {selectedVehicle.vehicleColor}</p>
                </div>

                <button
                  type="button"
                  className="dangerBtn"
                  onClick={removeVehicleDetails}
                >
                  Remove Vehicle Details
                </button>
              </div>
            ) : (
              <div className="emptyBox">
                No driver vehicle details selected yet.
              </div>
            )}
          </div>
        </div>
        <div className="rightCol">
          <div className="card stickyCard">
            <div className="cardHead">
              <div>
                <p className="eyebrow">WhatsApp Group Message</p>
                <h2>Message Preview</h2>
              </div>
            </div>

            <pre className="messagePreview">{groupMessage}</pre>

            <div className="buttonStack">
              <button type="button" className="primaryBtn" onClick={copyGroupMessage}>
                {copied ? "Copied!" : "Copy Group Message"}
              </button>

              <button
                type="button"
                className="whatsappBtn"
                onClick={sendWhatsAppGroupMessage}
              >
                Send WhatsApp Group Message
              </button>

              <button type="button" className="darkBtn" onClick={copyDriverLink}>
                Send Link to Driver
              </button>
            </div>

            <div className="driverLinkBox">
              <p className="eyebrow">Driver Link</p>
              <p>{driverLink}</p>
            </div>
          </div>
        </div>
      </section>

      {vehiclePopupOpen && (
        <div className="overlay">
          <div className="popup">
            <div className="popupHandle" />

            <div className="popupHead">
              <div>
                <p className="eyebrow">Driver Vehicle Details Received</p>
                <h2>Use this vehicle for booking?</h2>
              </div>

              <button
                type="button"
                className="closeBtn"
                onClick={() => setVehiclePopupOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="popupDetails">
              <Info label="Driver Name" value={receivedVehicleDetails.driverName} />
              <Info label="Driver Phone" value={receivedVehicleDetails.driverPhone} />
              <Info label="Vehicle Name" value={receivedVehicleDetails.vehicleName} />
              <Info
                label="Vehicle Number"
                value={receivedVehicleDetails.vehicleNumber}
              />
              <Info label="Vehicle Color" value={receivedVehicleDetails.vehicleColor} />
              <Info label="Driver Note" value={receivedVehicleDetails.note} />
            </div>

            <div className="popupActions">
              <button
                type="button"
                className="dangerBtn"
                onClick={() => setVehiclePopupOpen(false)}
              >
                Cancel
              </button>

              <button type="button" className="primaryBtn" onClick={useVehicleDetails}>
                OK Use Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: linear-gradient(180deg, #eef5ff 0%, #f8fafc 45%, #ffffff 100%);
          padding: 18px;
          color: #0f172a;
          font-family: Arial, sans-serif;
        }

        .topBar {
          max-width: 1180px;
          margin: 0 auto 18px;
          background: #ffffff;
          border: 1px solid #dbeafe;
          border-radius: 22px;
          padding: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        }

        h1,
        h2,
        h3,
        p {
          margin: 0;
        }

        h1 {
          font-size: 28px;
          font-weight: 900;
          color: #0b3d91;
        }

        h2 {
          font-size: 20px;
          font-weight: 900;
          color: #0f172a;
        }

        h3 {
          font-size: 18px;
          font-weight: 900;
          color: #0b3d91;
          margin-bottom: 8px;
        }

        .eyebrow {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #f97316;
          margin-bottom: 5px;
        }

        .subText {
          margin-top: 6px;
          color: #64748b;
          font-size: 13px;
          font-weight: 800;
        }
        .statusPill,
        .miniBadge {
          border-radius: 999px;
          background: #eff6ff;
          color: #0b3d91;
          padding: 9px 12px;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .grid {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 18px;
          align-items: start;
        }

        .leftCol,
        .rightCol {
          display: grid;
          gap: 18px;
        }

        .card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 16px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        }

        .stickyCard {
          position: sticky;
          top: 14px;
        }

        .cardHead {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 14px;
        }

        .detailsGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .infoBox {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 16px;
          padding: 12px;
        }

        .infoLabel {
          display: block;
          font-size: 11px;
          color: #64748b;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 5px;
        }

        .infoValue {
          display: block;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 900;
          color: #0f172a;
          word-break: break-word;
        }

        .fieldGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        label {
          display: grid;
          gap: 7px;
          font-size: 12px;
          font-weight: 900;
          color: #475569;
        }

        input,
        textarea {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          padding: 12px;
          font-size: 15px;
          font-weight: 800;
          outline: none;
          color: #0f172a;
          background: #ffffff;
          box-sizing: border-box;
        }

        input:focus,
        textarea:focus {
          border-color: #0b3d91;
          box-shadow: 0 0 0 3px rgba(11, 61, 145, 0.12);
        }

        .fullField {
          margin-top: 12px;
        }

        .messagePreview {
          white-space: pre-wrap;
          background: #0f172a;
          color: #ffffff;
          border-radius: 18px;
          padding: 16px;
          font-size: 14px;
          line-height: 1.55;
          font-family: Arial, sans-serif;
          margin: 0;
          min-height: 315px;
        }

        .buttonStack {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }

        button {
          cursor: pointer;
          transition: transform 0.12s ease, opacity 0.12s ease;
        }

        button:active {
          transform: scale(0.98);
        }

        .primaryBtn,
        .whatsappBtn,
        .darkBtn,
        .outlineBtn,
        .dangerBtn {
          min-height: 46px;
          border-radius: 15px;
          border: 0;
          padding: 10px 14px;
          font-size: 14px;
          font-weight: 900;
        }

        .primaryBtn {
          color: #ffffff;
          background: linear-gradient(135deg, #f97316, #ea580c);
          box-shadow: 0 12px 24px rgba(234, 88, 12, 0.22);
        }

        .whatsappBtn {
          color: #ffffff;
          background: #16a34a;
        }

        .darkBtn {
          color: #ffffff;
          background: #0b3d91;
        }

        .outlineBtn {
          color: #0b3d91;
          background: #ffffff;
          border: 1px solid #bfdbfe;
        }
        .dangerBtn {
          color: #b91c1c;
          background: #fff1f2;
          border: 1px solid #fecdd3;
        }

        .driverLinkBox {
          margin-top: 12px;
          border: 1px dashed #bfdbfe;
          background: #eff6ff;
          border-radius: 16px;
          padding: 12px;
          color: #0b3d91;
          font-size: 12px;
          font-weight: 800;
          word-break: break-all;
        }

        .selectedVehicleBox {
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          border-radius: 18px;
          padding: 14px;
          display: grid;
          gap: 12px;
        }

        .selectedVehicleBox p {
          color: #166534;
          font-size: 13px;
          font-weight: 800;
          margin-top: 4px;
        }

        .emptyBox {
          border: 1px dashed #cbd5e1;
          background: #f8fafc;
          color: #64748b;
          border-radius: 18px;
          padding: 20px;
          font-weight: 900;
          text-align: center;
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(15, 23, 42, 0.55);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 14px;
        }

        .popup {
          width: 100%;
          max-width: 480px;
          max-height: 88vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 26px 26px 18px 18px;
          padding: 16px;
          box-shadow: 0 24px 90px rgba(0, 0, 0, 0.32);
        }

        .popupHandle {
          width: 48px;
          height: 5px;
          border-radius: 999px;
          background: #cbd5e1;
          margin: 0 auto 14px;
        }

        .popupHead {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 14px;
        }

        .closeBtn {
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 999px;
          background: #f1f5f9;
          color: #0f172a;
          font-size: 24px;
          font-weight: 900;
        }

        .popupDetails {
          display: grid;
          gap: 10px;
        }

        .popupActions {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 10px;
          margin-top: 16px;
        }

        @media (max-width: 820px) {
          .page {
            padding: 12px;
          }

          .topBar {
            border-radius: 18px;
            align-items: flex-start;
            flex-direction: column;
          }

          h1 {
            font-size: 23px;
          }
          .grid {
            grid-template-columns: 1fr;
          }

          .stickyCard {
            position: static;
          }

          .detailsGrid,
          .fieldGrid {
            grid-template-columns: 1fr;
          }

          .messagePreview {
            min-height: auto;
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="infoBox">
      <span className="infoLabel">{label}</span>
      <span className="infoValue">{value || "-"}</span>
    </div>
  );
}
