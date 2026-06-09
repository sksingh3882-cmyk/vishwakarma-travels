import type {
  AdminAssignmentDraft,
  AssignmentBookingDetails,
} from "./assignmentTypes";

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
type BuildGroupMessageInput = {
  booking: AssignmentBookingDetails;
  draft: AdminAssignmentDraft;
};

export function buildGroupMessage({
  booking,
  draft,
}: BuildGroupMessageInput): string {
  return [
    "⚠️ *🚨 New Booking 🚨*",
    "",
    `🧾 Service: ${booking.serviceType}`,
    `📅 Date: ${booking.date}`,
    `⏰ Time: ${formatTimeForDisplay(booking.time)}`,
    `🚘 Vehicle Required: ${draft.vehicleType}`,
    "",
    `📍 Pickup Area: ${draft.pickupArea}`,
    `🏁 Drop Area: ${draft.dropArea}`,
    "",
    "Interested Person please Call.",
    `📞 Contact: ${booking.adminContact}`,
    "",
    `📝 Note: ${draft.note}`,
  ].join("\n");
}
