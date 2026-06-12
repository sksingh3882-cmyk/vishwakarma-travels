"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  fetchBookingRequestById,
  updateBookingRequestDriverVehicle,
  clearBookingRequestDriverVehicle,
  type BookingRequestRecord,
} from "@/lib/bookingRequestService";
import { buildGroupMessage } from "../_lib/buildGroupMessage";
import { getMockAssignmentData } from "../_lib/mockAssignmentData";
import type {
  AdminAssignmentDraft,
  AssignmentBookingDetails,
  AssignmentShellProps,
  DriverVehicleSubmission,
  SavedAssignmentPayload,
} from "../_lib/assignmentTypes";

const emptyDriverSubmission: DriverVehicleSubmission = {
  driverName: "",
  driverMobile: "",
  vehicleNumber: "",
  driverVehicleModel: "",
};

export default function AssignmentShell({ bookingId, forceDriverMode = false }: AssignmentShellProps) {
  const mockBooking = useMemo(() => getMockAssignmentData(bookingId), [bookingId]);

  const [booking, setBooking] = useState<AssignmentBookingDetails>(mockBooking);
  const [isDriverMode, setIsDriverMode] = useState(false);
  const [showTripPopup, setShowTripPopup] = useState(false);
  const [showDriverReceivedPopup, setShowDriverReceivedPopup] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [loadStatus, setLoadStatus] = useState("Loading booking details...");

  const [draft, setDraft] = useState<AdminAssignmentDraft>({
    pickupArea: mockBooking.pickupArea,
    dropArea: mockBooking.dropArea,
    note: "",
    vehicleType: mockBooking.vehicleType,
    vehicleModel: mockBooking.vehicleModel,
  });

  const [driverForm, setDriverForm] =
    useState<DriverVehicleSubmission>(emptyDriverSubmission);

  const [receivedDriverDetails, setReceivedDriverDetails] =
    useState<DriverVehicleSubmission | null>(null);

  const [savedAssignment, setSavedAssignment] =
    useState<SavedAssignmentPayload | null>(null);

  useEffect(() => {
  const searchParams = new URLSearchParams(window.location.search);
  const driverMode = forceDriverMode || searchParams.get("driver") === "1";
  setIsDriverMode(driverMode);

  if (driverMode) {
    document.body.classList.add("vt-driver-clean-page");
  } else {
    document.body.classList.remove("vt-driver-clean-page");
    setShowTripPopup(true);
  }

  const storedDriverDetails = window.localStorage.getItem(
    getDriverStorageKey(bookingId)
  );

  if (storedDriverDetails) {
    try {
      const parsedDetails = JSON.parse(
        storedDriverDetails
      ) as DriverVehicleSubmission;

      setReceivedDriverDetails(parsedDetails);

      if (!driverMode) {
        setShowDriverReceivedPopup(true);
      }
    } catch {
      window.localStorage.removeItem(getDriverStorageKey(bookingId));
    }
  }

  return () => {
    document.body.classList.remove("vt-driver-clean-page");
  };
}, [bookingId, forceDriverMode]);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    let stopped = false;

    async function loadBooking() {
      if (!supabaseUrl || !supabaseKey) {
        setLoadStatus("Supabase env missing. Mock data showing.");
        return;
      }

      try {
        const record = await fetchBookingRequestById({
          supabaseUrl,
          supabaseKey,
          requestId: bookingId,
        });

        if (stopped) return;

        if (!record) {
          setLoadStatus("Booking not found. Mock data showing.");
          return;
        }

        const mappedBooking = mapRequestToAssignmentBooking(record, mockBooking);

        setBooking(mappedBooking);
        setDraft((previous) => ({
          ...previous,
          pickupArea: mappedBooking.pickupArea,
          dropArea: mappedBooking.dropArea,
          vehicleType: mappedBooking.vehicleType,
          vehicleModel: mappedBooking.vehicleModel,
        }));
        setLoadStatus("Real booking loaded.");
        if (record.driverName || record.driverMobile || record.vehicleNo) {
  const receivedDetails: DriverVehicleSubmission = {
    driverName: record.driverName || "",
    driverMobile: record.driverMobile || "",
    vehicleNumber: record.vehicleNo || "",
    driverVehicleModel: "",
  };

  setReceivedDriverDetails(receivedDetails);

  if (!driverMode) {
    setShowDriverReceivedPopup(true);
  }
        }
      } catch {
        if (!stopped) {
          setLoadStatus("Booking load failed. Mock data showing.");
        }
      }
    }

    loadBooking();

    return () => {
      stopped = true;
    };
  }, [bookingId, mockBooking]);

  const driverDutyLink = useMemo(() => {
    if (typeof window === "undefined") return "";

    return `${window.location.origin}/driver-vehicle-assignment/${encodeURIComponent(bookingId)}`;
  }, [bookingId]);

  const groupMessage = useMemo(() => {
    return buildGroupMessage({
      booking,
      draft,
    });
  }, [booking, draft]);

  function handleOpenGroupWhatsApp() {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(groupMessage)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

    async function handleCopyDriverLink() {
    if (!driverDutyLink) return;

    await prepareFreshDriverAssignmentLink();

    await navigator.clipboard.writeText(driverDutyLink);
    setCopyStatus("Fresh driver duty link copied.");
    }

    async function handleSendDriverLink() {
    await prepareFreshDriverAssignmentLink();

    const message = [
      "Vishwakarma Travels Driver Duty Link",
      "",
      "Please open this link and submit your vehicle details:",
      driverDutyLink,
    ].join("\n");

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }

   async function prepareFreshDriverAssignmentLink() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    if (!supabaseUrl || !supabaseKey) {
      setCopyStatus("Supabase URL or key is missing.");
      return;
    }

    try {
      await clearBookingRequestDriverVehicle({
        supabaseUrl,
        supabaseKey,
        requestId: bookingId,
      });

      setReceivedDriverDetails(null);
      setSavedAssignment(null);
      setDriverForm(emptyDriverSubmission);
      window.localStorage.removeItem(getDriverStorageKey(bookingId));

      setCopyStatus("Fresh assignment form is ready.");
    } catch (error) {
      console.log("Fresh driver assignment link prepare failed:", error);
      setCopyStatus("Fresh assignment link could not be prepared.");
    }
   }
  async function handleDriverSubmit() {
  const cleanedDetails: DriverVehicleSubmission = {
    driverName: driverForm.driverName.trim(),
    driverMobile: cleanPhoneForAssignment(driverForm.driverMobile),
    vehicleNumber: normalizeVehicleNumber(driverForm.vehicleNumber),
    driverVehicleModel: driverForm.driverVehicleModel.trim(),
  };

  if (
    !cleanedDetails.driverName ||
    !cleanedDetails.driverMobile ||
    !cleanedDetails.vehicleNumber
  ) {
    alert("Driver name, driver mobile number, and Vehicle number are Required..");
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    alert("Supbase and Missing: Driver details could not be saved..");
    return;
  }

  try {
    await updateBookingRequestDriverVehicle({
      supabaseUrl,
      supabaseKey,
      requestId: bookingId,
      driverName: cleanedDetails.driverName,
      driverMobile: cleanedDetails.driverMobile,
      vehicleNo: cleanedDetails.vehicleNumber,
    });

        window.localStorage.setItem(
      getDriverStorageKey(bookingId),
      JSON.stringify(cleanedDetails)
    );

    setReceivedDriverDetails(cleanedDetails);
    setDriverForm(emptyDriverSubmission);

    alert(
  "Your vehicle details have been submitted successfully. Confirmation Massage will Send you On your Whatsapp Shortly."
);
  
  } catch {
    alert("Driver and vehicle details could not be saved in the database. Please try again..");
  }
  }

  async function handleUseVehicleDetails() {
  if (!receivedDriverDetails) return;

  const payload: SavedAssignmentPayload = {
    bookingId,
    driver_name: receivedDriverDetails.driverName,
    driver_mobile: receivedDriverDetails.driverMobile,
    vehicle_number: receivedDriverDetails.vehicleNumber,
  };

  const adminAutofillPayload = {
    bookingId,
    vehicleNumber: receivedDriverDetails.vehicleNumber,
    driverName: receivedDriverDetails.driverName,
    driverMobile: receivedDriverDetails.driverMobile,
    vehicleType: booking.vehicleType,
    vehicleModel: booking.vehicleModel,
  };

  window.localStorage.setItem(
    "vt-driver-assignment-autofill",
    JSON.stringify(adminAutofillPayload)
  );

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (supabaseUrl && supabaseKey) {
    try {
      await saveAssignedVehicleToVehicleList({
        supabaseUrl,
        supabaseKey,
        booking,
        details: receivedDriverDetails,
      });
    } catch (error) {
      console.log("Assigned vehicle list save failed:", error);
    }
  }

  setSavedAssignment(payload);
  setShowDriverReceivedPopup(false);

  alert(
    "Driver vehicle details have been selected. Admin form will be auto-filled. Vehicle Type and Vehicle Model were not overwritten."
  );
  }

  async function handleRemoveVehicleDetails() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  try {
    if (supabaseUrl && supabaseKey) {
      await clearBookingRequestDriverVehicle({
        supabaseUrl,
        supabaseKey,
        requestId: bookingId,
      });
    }

    setReceivedDriverDetails(null);
    setSavedAssignment(null);
    window.localStorage.removeItem(getDriverStorageKey(bookingId));

    alert(
      "The driver's name, mobile number, and vehicle number have been finalized. The vehicle type and model will remain the same.."
    );
  } catch {
    alert("Vehicle details could not be removed. Please try again..");
  }
  }

    const isBookingStillLoading = loadStatus === "Loading booking details...";
  const isRealBookingLoaded = loadStatus === "Real booking loaded.";
  const driverDetailsAlreadySubmitted = Boolean(
    receivedDriverDetails?.driverName ||
      receivedDriverDetails?.driverMobile ||
      receivedDriverDetails?.vehicleNumber
  );
    if (isDriverMode) {
    return (
      <>
        <style>{hideAdminChromeCss}</style>
        <main className="vt-driver-assignment-page" style={pageWrap}>
          <section style={cardNarrow}>
            <div style={centerBlock}>
              <h1 style={smallTitle}>Vishwakarma Travels</h1>
              <p style={{ ...mutedText, fontWeight: 900, color: "#0b2d6b" }}>
                Vehicle Driver Assignment System
              </p>
              <p style={{ ...mutedText, fontSize: 12 }}>By Sanjay Singh</p>
            </div>

            {isBookingStillLoading ? (
              <div style={driverMessageBox}>
                <h2 style={driverMessageTitle}>Loading booking details...</h2>
                <p style={driverMessageText}>
                  Please wait while we load your actual trip details.
                </p>
              </div>
            ) : !isRealBookingLoaded ? (
              <div style={driverMessageBox}>
                <h2 style={driverMessageTitle}>Booking details could not be loaded.</h2>
                <p style={driverMessageText}>
                  Please ask admin for a new link.
                </p>
              </div>
            ) : driverDetailsAlreadySubmitted ? (
              <div style={driverMessageBox}>
                <h2 style={driverMessageTitle}>
                  You already submitted your vehicle details.
                </h2>
                <p style={driverMessageText}>
                  Please ask admin for the new link to add another vehicle details.
                </p>
              </div>
            ) : (
              <>
                <div style={infoBox}>
                  <InfoLine label="Date" value={booking.date} />
                  <InfoLine label="Time" value={formatTimeForDisplay(booking.time)} />
                  <InfoLine label="Pickup" value={draft.pickupArea} />
                  <InfoLine label="Drop" value={draft.dropArea} />
                  <InfoLine label="Vehicle Required" value={draft.vehicleModel || draft.vehicleType} />
                </div>

                <div style={formStack}>
                  <InputBox
                    label="Driver Name"
                    value={driverForm.driverName}
                    onChange={(value) =>
                      setDriverForm((previous) => ({ ...previous, driverName: value }))
                    }
                    placeholder="Driver name"
                  />

                  <InputBox
                    label="Driver Mobile"
                    value={driverForm.driverMobile}
                    onChange={(value) =>
                      setDriverForm((previous) => ({ ...previous, driverMobile: value }))
                    }
                    placeholder="Driver mobile number"
                    inputMode="tel"
                  />

                  <InputBox
                    label="Vehicle Number"
                    value={driverForm.vehicleNumber}
                    onChange={(value) =>
                      setDriverForm((previous) => ({
                        ...previous,
                        vehicleNumber: normalizeVehicleNumber(value),
                      }))
                    }
                    placeholder="JH05AB1234"
                  />

                  <InputBox
                    label="Driver Vehicle Model"
                    value={driverForm.driverVehicleModel}
                    onChange={(value) =>
                      setDriverForm((previous) => ({
                        ...previous,
                        driverVehicleModel: value,
                      }))
                    }
                    placeholder="Dzire / Ertiga / Innova etc."
                  />

                  <button type="button" onClick={handleDriverSubmit} style={primaryBtn}>
                    Submit Vehicle Details
                  </button>
                </div>
              </>
            )}
          </section>
        </main>
      </>
    );
    }
  return (
    <main style={pageWrap}>
      <section style={cardWide}>
        <div style={headerBox}>
          <h1 style={mainTitle}>Driver / Vehicle Assignment V2</h1>
          <p style={mutedText}>Booking ID: {booking.bookingId}</p>
          <p style={statusText}>{loadStatus}</p>
        </div>

        <div style={sectionBox}>
          <h2 style={sectionTitle}>Assignment Form</h2>

          <div style={formGrid}>
            <InputBox
              label="Vehicle Type"
              value={draft.vehicleType}
              onChange={(value) =>
                setDraft((previous) => ({ ...previous, vehicleType: value }))
              }
              placeholder="Vehicle type"
            />

            <InputBox
              label="Vehicle Model"
              value={draft.vehicleModel}
              onChange={(value) =>
                setDraft((previous) => ({ ...previous, vehicleModel: value }))
              }
              placeholder="Vehicle model"
            />

            <InputBox
              label="Pickup Short Area"
              value={draft.pickupArea}
              onChange={(value) =>
                setDraft((previous) => ({ ...previous, pickupArea: value }))
              }
              placeholder="Pickup area"
            />

            <InputBox
              label="Drop Short Area"
              value={draft.dropArea}
              onChange={(value) =>
                setDraft((previous) => ({ ...previous, dropArea: value }))
              }
              placeholder="Drop area"
            />
          </div>

          <label style={fieldLabel}>Note</label>
          <textarea
            value={draft.note}
            onChange={(event) =>
              setDraft((previous) => ({ ...previous, note: event.target.value }))
            }
            placeholder="Admin apne hisab se note likh sakta hai"
            style={textAreaStyle}
          />
        </div>

        <div style={sectionBox}>
          <h2 style={sectionTitle}>WhatsApp Group Message</h2>

          <pre style={messagePreview}>{groupMessage}</pre>

          <button type="button" onClick={handleOpenGroupWhatsApp} style={greenBtn}>
            Send WhatsApp Group Message
          </button>
        </div>
                <div style={sectionBox}>
          <h2 style={sectionTitle}>Driver Duty Link</h2>

          <p style={linkBox}>{driverDutyLink}</p>

          {copyStatus ? <p style={successText}>{copyStatus}</p> : null}

          <div style={twoBtnGrid}>
            <button type="button" onClick={handleCopyDriverLink} style={outlineBtn}>
              Copy Driver Link
            </button>

            <button type="button" onClick={handleSendDriverLink} style={primaryBtn}>
              Send Link to Driver
            </button>
          </div>
        </div>

        <div style={sectionBox}>
          <h2 style={sectionTitle}>Saved Assignment Test Status</h2>

          {savedAssignment ? (
            <div style={successBox}>
              <InfoLine label="Driver Name" value={savedAssignment.driver_name} />
              <InfoLine label="Driver Mobile" value={savedAssignment.driver_mobile} />
              <InfoLine label="Vehicle Number" value={savedAssignment.vehicle_number} />
              <p style={smallNote}>
                Vehicle Type aur Vehicle Model overwrite nahi hua.
              </p>
            </div>
          ) : (
            <p style={mutedText}>Abhi koi driver assignment saved nahi hai.</p>
          )}

          <button type="button" onClick={handleRemoveVehicleDetails} style={dangerBtn}>
            Remove Vehicle Details
          </button>
        </div>
      </section>

      {showTripPopup ? (
        <Popup>
          <h2 style={popupTitle}>Trip Details</h2>

          <div style={popupRows}>
            <DetailRow label="Customer" value={booking.customerName} />
            <DetailRow label="Mobile" value={booking.customerMobile} />
            <DetailRow label="Service" value={booking.serviceType} />
            <DetailRow label="Date" value={booking.date} />
            <DetailRow label="Time" value={formatTimeForDisplay(booking.time)} />
            <DetailRow label="Pickup" value={booking.pickupFullAddress} />
            <DetailRow label="Drop" value={booking.dropFullAddress} />
            <DetailRow label="Vehicle Type" value={booking.vehicleType} />
            <DetailRow label="Vehicle Model" value={booking.vehicleModel} />
          </div>

          <button
            type="button"
            onClick={() => setShowTripPopup(false)}
            style={primaryBtn}
          >
            OK
          </button>
        </Popup>
      ) : null}

      {showDriverReceivedPopup && receivedDriverDetails ? (
        <Popup>
          <h2 style={popupTitle}>Driver Vehicle Details Received</h2>

          <div style={popupRows}>
            <DetailRow label="Driver Name" value={receivedDriverDetails.driverName} />
            <DetailRow label="Driver Mobile" value={receivedDriverDetails.driverMobile} />
            <DetailRow label="Vehicle Number" value={receivedDriverDetails.vehicleNumber} />
            <DetailRow
              label="Driver Vehicle Model"
              value={receivedDriverDetails.driverVehicleModel || "-"}
            />
          </div>

          <p style={warningBox}>
            Only the driver's name, driver's mobile number, and vehicle number will be used during the save operation.
            The vehicle type and vehicle model will not be overwritten.
          </p>

          <button type="button" onClick={handleUseVehicleDetails} style={primaryBtn}>
            OK Use Vehicle
          </button>

          <button
            type="button"
            onClick={() => setShowDriverReceivedPopup(false)}
            style={outlineBtn}
          >
            Close
          </button>
        </Popup>
      ) : null}
    </main>
  );
}

function mapRequestToAssignmentBooking(
  record: BookingRequestRecord,
  fallback: AssignmentBookingDetails
): AssignmentBookingDetails {
  const requestedVehicle = record.requestedVehicle || "";
const inferredVehicleType = inferVehicleTypeFromModel(requestedVehicle);

const vehicleType =
  record.vehicleType || inferredVehicleType || fallback.vehicleType;

const vehicleModel =
  record.vehicleModel || requestedVehicle || fallback.vehicleModel;

  return {
    bookingId: record.id || fallback.bookingId,
    customerName: record.customerName || fallback.customerName,
    customerMobile: record.customerPhone || fallback.customerMobile,
    adminContact: fallback.adminContact,
    serviceType: record.service || fallback.serviceType,
    date: record.journeyDate || fallback.date,
    time: record.journeyTime || fallback.time,
    pickupArea: shortArea(record.pickup || fallback.pickupArea),
    dropArea: shortArea(record.drop || fallback.dropArea),
    pickupFullAddress: record.pickup || fallback.pickupFullAddress,
    dropFullAddress: record.drop || fallback.dropFullAddress,
    vehicleType,
    vehicleModel,
  };
}
function inferVehicleTypeFromModel(value: string) {
  const text = String(value || "").toLowerCase();

  if (
    text.includes("dzire") ||
    text.includes("desire") ||
    text.includes("etios") ||
    text.includes("sedan")
  ) {
    return "Sedan";
  }

  if (
    text.includes("ertiga") ||
    text.includes("innova") ||
    text.includes("crysta") ||
    text.includes("suv")
  ) {
    return "SUV";
  }

  if (text.includes("tempo") || text.includes("traveller")) {
    return "Tempo Traveller";
  }

  return "";
}

function formatTimeForDisplay(value: string) {
  const raw = String(value || "").trim();

  if (!raw) return "-";

  if (/\b(am|pm)\b/i.test(raw)) {
    return raw.toUpperCase();
  }

  const match = raw.match(/^(\d{1,2}):(\d{2})$/);

  if (!match) {
    return raw;
  }

  const hour = Number(match[1]);
  const minute = match[2];

  if (Number.isNaN(hour)) {
    return raw;
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${minute} ${suffix}`;
}
function shortArea(value: string) {
  return String(value || "").split(",")[0].trim();
}

function normalizeVehicleNumber(value: string) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12);
}

function cleanPhoneForAssignment(value: string) {
  let phone = String(value || "").replace(/\D/g, "");

  if ((phone.startsWith("91") || phone.startsWith("0")) && phone.length > 10) {
    phone = phone.slice(-10);
  }

  return phone.slice(-10);
}
async function saveAssignedVehicleToVehicleList(params: {
  supabaseUrl: string;
  supabaseKey: string;
  booking: AssignmentBookingDetails;
  details: DriverVehicleSubmission;
}) {
  const vehicleNumber = normalizeVehicleNumber(params.details.vehicleNumber);

  if (!vehicleNumber) return;

  const headers = {
    apikey: params.supabaseKey,
    Authorization: `Bearer ${params.supabaseKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  const check = await fetch(
    `${params.supabaseUrl}/rest/v1/vehicles?select=vehicle_number&vehicle_number=eq.${vehicleNumber}&limit=1`,
    { headers }
  );

  if (check.ok) {
    const rows = await check.json();

    if (Array.isArray(rows) && rows.length > 0) {
      return;
    }
  }

  const payload = {
    vehicle_number: vehicleNumber,
    vehicle_type: params.booking.vehicleType,
    vehicle_model: params.booking.vehicleModel,
    driver_name: params.details.driverName,
    phone: cleanPhoneForAssignment(params.details.driverMobile),
    route: `${params.booking.pickupArea} to ${params.booking.dropArea}`,
    status: "Active",
  };

  const res = await fetch(`${params.supabaseUrl}/rest/v1/vehicles`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Assigned vehicle could not be saved to vehicle list.");
  }
}
function getDriverStorageKey(bookingId: string) {
  return `v2-driver-vehicle-details-${bookingId}`;
}

type InputBoxProps = {
  label: string;
  value: string;
  placeholder: string;
  inputMode?: "text" | "tel";
  onChange: (value: string) => void;
};
function InputBox({
  label,
  value,
  placeholder,
  inputMode = "text",
  onChange,
}: InputBoxProps) {
  return (
    <div style={inputWrap}>
      <label style={fieldLabel}>{label}</label>
      <input
        value={value}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        enterKeyHint="next"
data-assignment-field="1"
onKeyDown={(event) => {
  if (event.key !== "Enter") return;

  event.preventDefault();

  const fields = Array.from(
    document.querySelectorAll<HTMLElement>("[data-assignment-field='1']")
  );

  const currentIndex = fields.indexOf(event.currentTarget);

  if (currentIndex >= 0 && fields[currentIndex + 1]) {
    fields[currentIndex + 1].focus();
  }
}}
        style={inputStyle}
      />
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p style={infoLine}>
      <b>{label}:</b> {value || "-"}
    </p>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={detailRow}>
      <span style={detailLabel}>{label}</span>
      <span style={detailValue}>{value || "-"}</span>
    </div>
  );
}

function Popup({ children }: { children: ReactNode }) {
  return (
    <div style={popupOverlay}>
      <div style={popupCard}>{children}</div>
    </div>
  );
}
const hideAdminChromeCss = `
  body.vt-driver-clean-page {
    overflow-x: hidden !important;
  }

  body.vt-driver-clean-page .admin-shell > div:first-child,
  body.vt-driver-clean-page .admin-shell > div:nth-child(2),
  body.vt-driver-clean-page .admin-shell > div:nth-child(3),
  body.vt-driver-clean-page .admin-shell > div:nth-child(4),
  body.vt-driver-clean-page [aria-label*="menu" i],
  body.vt-driver-clean-page [class*="menu" i],
  body.vt-driver-clean-page [class*="floating" i],
  body.vt-driver-clean-page [class*="Floating" i],
  body.vt-driver-clean-page [style*="position: fixed"],
  body.vt-driver-clean-page [style*="position:fixed"] {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }

  body.vt-driver-clean-page .vt-driver-assignment-page,
  body.vt-driver-clean-page .vt-driver-assignment-page * {
    display: revert !important;
    visibility: visible !important;
    pointer-events: auto !important;
  }

  body.vt-driver-clean-page main.vt-driver-assignment-page {
    display: block !important;
    min-height: 100vh !important;
    padding-top: 14px !important;
  }
`;
const driverMessageBox = {
  marginTop: 18,
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 18,
  padding: 16,
  textAlign: "center",
} as const;

const driverMessageTitle = {
  margin: 0,
  color: "#0b2d6b",
  fontSize: 18,
  lineHeight: 1.25,
  fontWeight: 900,
} as const;

const driverMessageText = {
  margin: "8px 0 0",
  color: "#475569",
  fontSize: 14,
  lineHeight: 1.45,
  fontWeight: 800,
} as const;
const pageWrap = {
  minHeight: "100vh",
  background: "#eef5fb",
  padding: "14px",
  fontFamily: "Arial, sans-serif",
  color: "#0f172a",
} as const;

const cardWide = {
  width: "100%",
  maxWidth: 760,
  margin: "0 auto",
  background: "#ffffff",
  border: "1px solid #dbe7f3",
  borderRadius: 24,
  overflow: "hidden",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
} as const;

const cardNarrow = {
  width: "100%",
  maxWidth: 430,
  margin: "0 auto",
  background: "#ffffff",
  border: "1px solid #dbe7f3",
  borderRadius: 22,
  padding: 16,
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
} as const;

const headerBox = {
  padding: "22px 16px",
  textAlign: "center",
  borderBottom: "1px solid #e2e8f0",
} as const;

const sectionBox = {
  padding: "18px 14px",
  borderBottom: "1px solid #e2e8f0",
} as const;

const centerBlock = {
  textAlign: "center",
  marginBottom: 16,
} as const;

const mainTitle = {
  margin: 0,
  fontSize: 30,
  lineHeight: 1.15,
  fontWeight: 900,
  color: "#0b2d6b",
} as const;

const smallTitle = {
  margin: 0,
  fontSize: 22,
  fontWeight: 900,
  color: "#0b2d6b",
} as const;

const sectionTitle = {
  margin: "0 0 14px",
  textAlign: "center",
  fontSize: 24,
  fontWeight: 900,
  color: "#0b2d6b",
} as const;

const popupTitle = {
  margin: "0 0 14px",
  fontSize: 22,
  fontWeight: 900,
  color: "#0b2d6b",
} as const;

const mutedText = {
  margin: "6px 0 0",
  fontSize: 14,
  color: "#475569",
} as const;

const statusText = {
  margin: "8px 0 0",
  fontSize: 12,
  fontWeight: 800,
  color: "#16a34a",
} as const;

const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 12,
} as const;

const formStack = {
  display: "grid",
  gap: 12,
} as const;

const inputWrap = {
  display: "grid",
  gap: 6,
  marginBottom: 12,
} as const;

const fieldLabel = {
  fontSize: 13,
  fontWeight: 900,
  color: "#334155",
} as const;

const inputStyle = {
  width: "100%",
  minHeight: 46,
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: "0 12px",
  fontSize: 15,
  fontWeight: 800,
  color: "#0f172a",
  background: "#f8fafc",
  outline: "none",
  boxSizing: "border-box",
} as const;

const textAreaStyle = {
  width: "100%",
  minHeight: 82,
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: 12,
  fontSize: 15,
  color: "#0f172a",
  background: "#f8fafc",
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
} as const;

const messagePreview = {
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  margin: 0,
  padding: 12,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#0f172a",
  fontSize: 14,
  lineHeight: 1.55,
  fontFamily: "Arial, sans-serif",
} as const;

const linkBox = {
  wordBreak: "break-all",
  margin: 0,
  padding: 12,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  fontSize: 12,
  color: "#334155",
} as const;

const twoBtnGrid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 10,
  marginTop: 12,
} as const;

const primaryBtn = {
  width: "100%",
  minHeight: 46,
  border: 0,
  borderRadius: 14,
  background: "#0b2d6b",
  color: "#ffffff",
  fontWeight: 900,
  fontSize: 15,
  cursor: "pointer",
  marginTop: 12,
} as const;

const greenBtn = {
  ...primaryBtn,
  background: "#16a34a",
} as const;

const outlineBtn = {
  width: "100%",
  minHeight: 46,
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  background: "#ffffff",
  color: "#0b2d6b",
  fontWeight: 900,
  fontSize: 15,
  cursor: "pointer",
  marginTop: 12,
} as const;

const dangerBtn = {
  ...outlineBtn,
  color: "#dc2626",
  border: "1px solid #fecaca",
  background: "#fff1f2",
} as const;

const infoBox = {
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  background: "#f8fafc",
  padding: 14,
  marginBottom: 14,
  textAlign: "left",
} as const;

const successBox = {
  border: "1px solid #bbf7d0",
  borderRadius: 16,
  background: "#f0fdf4",
  padding: 12,
} as const;

const warningBox = {
  border: "1px solid #fde68a",
  borderRadius: 14,
  background: "#fffbeb",
  color: "#92400e",
  padding: 12,
  fontSize: 13,
  fontWeight: 800,
} as const;

const successText = {
  margin: "8px 0 0",
  color: "#15803d",
  fontWeight: 900,
  fontSize: 13,
} as const;

const smallNote = {
  margin: "8px 0 0",
  fontSize: 12,
  color: "#166534",
} as const;

const infoLine = {
  margin: "0 0 10px",
  fontSize: 16,
  lineHeight: 1.45,
  color: "#334155",
  textAlign: "left",
} as const;

const detailRow = {
  display: "grid",
  gridTemplateColumns: "112px 1fr",
  gap: 10,
  padding: "9px 0",
  borderBottom: "1px dashed #e2e8f0",
} as const;

const detailLabel = {
  fontSize: 13,
  color: "#64748b",
  fontWeight: 900,
} as const;

const detailValue = {
  fontSize: 13,
  color: "#0f172a",
  fontWeight: 800,
  wordBreak: "break-word",
} as const;

const popupRows = {
  marginBottom: 14,
} as const;

const popupOverlay = {
  position: "fixed",
  inset: 0,
  zIndex: 99999,
  background: "rgba(15, 23, 42, 0.62)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 14,
} as const;

const popupCard = {
  width: "100%",
  maxWidth: 460,
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#ffffff",
  borderRadius: 22,
  padding: 16,
  boxShadow: "0 28px 80px rgba(0,0,0,.32)",
} as const;
