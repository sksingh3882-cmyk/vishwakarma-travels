"use client";

import { useEffect, useMemo, useState } from "react";
import { buildGroupMessage } from "../_lib/buildGroupMessage";
import { getMockAssignmentData } from "../_lib/mockAssignmentData";
import type {
  AdminAssignmentDraft,
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

export default function AssignmentShell({ bookingId }: AssignmentShellProps) {
  const booking = useMemo(() => getMockAssignmentData(bookingId), [bookingId]);

  const [isDriverMode, setIsDriverMode] = useState(false);
  const [showTripPopup, setShowTripPopup] = useState(false);
  const [showDriverReceivedPopup, setShowDriverReceivedPopup] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  const [draft, setDraft] = useState<AdminAssignmentDraft>({
    pickupArea: booking.pickupArea,
    dropArea: booking.dropArea,
    note: "",
    vehicleType: booking.vehicleType,
    vehicleModel: booking.vehicleModel,
  });

  const [driverForm, setDriverForm] = useState<DriverVehicleSubmission>(
    emptyDriverSubmission
  );

  const [receivedDriverDetails, setReceivedDriverDetails] =
    useState<DriverVehicleSubmission | null>(null);

  const [savedAssignment, setSavedAssignment] =
    useState<SavedAssignmentPayload | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const driverMode = searchParams.get("driver") === "1";
    setIsDriverMode(driverMode);

    if (!driverMode) {
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
        setShowDriverReceivedPopup(true);
      } catch {
        window.localStorage.removeItem(getDriverStorageKey(bookingId));
      }
    }
  }, [bookingId]);

  const driverDutyLink = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("driver", "1");
    return currentUrl.toString();
  }, []);

  const groupMessage = useMemo(() => {
    return buildGroupMessage({
      booking,
      draft,
    });
  }, [booking, draft]);

  function handleOpenGroupWhatsApp() {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      groupMessage
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function handleCopyDriverLink() {
    if (!driverDutyLink) {
      return;
    }

    await navigator.clipboard.writeText(driverDutyLink);
    setCopyStatus("Driver duty link copied.");
  }

  function handleSendDriverLink() {
    const message = [
      "🚕 *Vishwakarma Travels Driver Duty Link*",
      "",
      "Please open this link and submit your vehicle details:",
      driverDutyLink,
    ].join("\n");

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  function handleDriverSubmit() {
    const cleanedDetails: DriverVehicleSubmission = {
      driverName: driverForm.driverName.trim(),
      driverMobile: driverForm.driverMobile.trim(),
      vehicleNumber: driverForm.vehicleNumber.trim(),
      driverVehicleModel: driverForm.driverVehicleModel.trim(),
    };

    if (
      !cleanedDetails.driverName ||
      !cleanedDetails.driverMobile ||
      !cleanedDetails.vehicleNumber
    ) {
      alert("Driver Name, Driver Mobile aur Vehicle Number required hai.");
      return;
    }

    window.localStorage.setItem(
      getDriverStorageKey(bookingId),
      JSON.stringify(cleanedDetails)
    );

    setDriverForm(emptyDriverSubmission);
    alert("Driver vehicle details submitted successfully.");
  }

  function handleUseVehicleDetails() {
    if (!receivedDriverDetails) {
      return;
    }

    const payload: SavedAssignmentPayload = {
      bookingId,
      driver_name: receivedDriverDetails.driverName,
      driver_mobile: receivedDriverDetails.driverMobile,
      vehicle_number: receivedDriverDetails.vehicleNumber,
    };

    setSavedAssignment(payload);
    setShowDriverReceivedPopup(false);

    alert(
      "Assignment saved in V2 test mode. Supabase save patch next step me connect hoga."
    );
  }

  function handleRemoveVehicleDetails() {
    setReceivedDriverDetails(null);
    setSavedAssignment(null);
    window.localStorage.removeItem(getDriverStorageKey(bookingId));

    alert(
      "Driver Name, Driver Mobile aur Vehicle Number clear ho gaye. Vehicle Type aur Vehicle Model same rahenge."
    );
  }

  if (isDriverMode) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-6">
        <section className="mx-auto max-w-md rounded-2xl bg-white p-5 shadow">
          <div className="mb-5 text-center">
            <h1 className="text-xl font-bold text-slate-900">
              Vishwakarma Travels
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Driver Vehicle Details
            </p>
          </div>

          <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Date:</span> {booking.date}
            </p>
            <p>
              <span className="font-semibold">Time:</span> {booking.time}
            </p>
            <p>
              <span className="font-semibold">Pickup:</span>{" "}
              {draft.pickupArea}
            </p>
            <p>
              <span className="font-semibold">Drop:</span> {draft.dropArea}
            </p>
            <p>
              <span className="font-semibold">Vehicle Required:</span>{" "}
              {draft.vehicleType}
            </p>
          </div>

          <div className="space-y-4">
            <InputBox
              label="Driver Name"
              value={driverForm.driverName}
              onChange={(value) =>
                setDriverForm((previous) => ({
                  ...previous,
                  driverName: value,
                }))
              }
              placeholder="Driver name"
            />

            <InputBox
              label="Driver Mobile"
              value={driverForm.driverMobile}
              onChange={(value) =>
                setDriverForm((previous) => ({
                  ...previous,
                  driverMobile: value,
                }))
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
                  vehicleNumber: value,
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

            <button
              type="button"
              onClick={handleDriverSubmit}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Submit Vehicle Details
            </button>
          </div>
        </section>
      </main>
    );
      }
    return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-3xl space-y-5">
        <div className="rounded-2xl bg-white p-5 shadow">
          <h1 className="text-xl font-bold text-slate-900">
            Driver / Vehicle Assignment V2
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Booking ID: {booking.bookingId}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Assignment Form
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <InputBox
              label="Vehicle Type"
              value={draft.vehicleType}
              onChange={(value) =>
                setDraft((previous) => ({
                  ...previous,
                  vehicleType: value,
                }))
              }
              placeholder="Vehicle type"
            />

            <InputBox
              label="Vehicle Model"
              value={draft.vehicleModel}
              onChange={(value) =>
                setDraft((previous) => ({
                  ...previous,
                  vehicleModel: value,
                }))
              }
              placeholder="Vehicle model"
            />

            <InputBox
              label="Pickup Short Area"
              value={draft.pickupArea}
              onChange={(value) =>
                setDraft((previous) => ({
                  ...previous,
                  pickupArea: value,
                }))
              }
              placeholder="Pickup area"
            />

            <InputBox
              label="Drop Short Area"
              value={draft.dropArea}
              onChange={(value) =>
                setDraft((previous) => ({
                  ...previous,
                  dropArea: value,
                }))
              }
              placeholder="Drop area"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Note
            </label>
            <textarea
              value={draft.note}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  note: event.target.value,
                }))
              }
              placeholder="Admin apne hisab se note likh sakta hai"
              className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-3 text-base font-semibold text-slate-900">
            WhatsApp Group Message
          </h2>

          <pre className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm text-slate-800">
            {groupMessage}
          </pre>

          <button
            type="button"
            onClick={handleOpenGroupWhatsApp}
            className="mt-4 w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Send WhatsApp Group Message
          </button>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-3 text-base font-semibold text-slate-900">
            Driver Duty Link
          </h2>

          <p className="break-all rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
            {driverDutyLink}
          </p>

          {copyStatus ? (
            <p className="mt-2 text-sm font-medium text-green-700">
              {copyStatus}
            </p>
          ) : null}

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={handleCopyDriverLink}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900"
            >
              Copy Driver Link
            </button>

            <button
              type="button"
              onClick={handleSendDriverLink}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Send Link to Driver
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-3 text-base font-semibold text-slate-900">
            Saved Assignment Test Status
          </h2>

          {savedAssignment ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
              <p>
                <span className="font-semibold">Driver Name:</span>{" "}
                {savedAssignment.driver_name}
              </p>
              <p>
                <span className="font-semibold">Driver Mobile:</span>{" "}
                {savedAssignment.driver_mobile}
              </p>
              <p>
                <span className="font-semibold">Vehicle Number:</span>{" "}
                {savedAssignment.vehicle_number}
              </p>
              <p className="mt-2 text-xs">
                Vehicle Type aur Vehicle Model overwrite nahi hua.
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              Abhi koi driver assignment saved nahi hai.
            </p>
          )}

          <button
            type="button"
            onClick={handleRemoveVehicleDetails}
            className="mt-4 w-full rounded-xl border border-red-300 px-4 py-3 text-sm font-semibold text-red-700"
          >
            Remove Vehicle Details
          </button>
        </div>
      </section>

      {showTripPopup ? (
        <Popup>
          <h2 className="text-lg font-bold text-slate-900">Trip Details</h2>

          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <DetailRow label="Customer" value={booking.customerName} />
            <DetailRow label="Mobile" value={booking.customerMobile} />
            <DetailRow label="Service" value={booking.serviceType} />
            <DetailRow label="Date" value={booking.date} />
            <DetailRow label="Time" value={booking.time} />
            <DetailRow label="Pickup" value={booking.pickupFullAddress} />
            <DetailRow label="Drop" value={booking.dropFullAddress} />
            <DetailRow label="Vehicle Type" value={booking.vehicleType} />
            <DetailRow label="Vehicle Model" value={booking.vehicleModel} />
          </div>

          <button
            type="button"
            onClick={() => setShowTripPopup(false)}
            className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            OK
          </button>
        </Popup>
      ) : null}

      {showDriverReceivedPopup && receivedDriverDetails ? (
        <Popup>
          <h2 className="text-lg font-bold text-slate-900">
            Driver Vehicle Details Received
          </h2>

          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <DetailRow
              label="Driver Name"
              value={receivedDriverDetails.driverName}
            />
            <DetailRow
              label="Driver Mobile"
              value={receivedDriverDetails.driverMobile}
            />
            <DetailRow
              label="Vehicle Number"
              value={receivedDriverDetails.vehicleNumber}
            />
            <DetailRow
              label="Driver Vehicle Model"
              value={receivedDriverDetails.driverVehicleModel || "-"}
            />
          </div>

          <p className="mt-3 rounded-xl bg-yellow-50 p-3 text-xs text-yellow-800">
            Save me sirf Driver Name, Driver Mobile aur Vehicle Number use hoga.
            Vehicle Type / Vehicle Model overwrite nahi hoga.
          </p>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={handleUseVehicleDetails}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              OK Use Vehicle
            </button>

            <button
              type="button"
              onClick={() => setShowDriverReceivedPopup(false)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900"
            >
              Close
            </button>
          </div>
        </Popup>
      ) : null}
    </main>
  );
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
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        value={value}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
      />
    </div>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex gap-3 border-b border-slate-100 pb-2">
      <span className="w-32 shrink-0 font-semibold text-slate-900">
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}

type PopupProps = {
  children: React.ReactNode;
};

function Popup({ children }: PopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
        {children}
      </div>
    </div>
  );
      }
