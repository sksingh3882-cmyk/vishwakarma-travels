import type {
  AdminAssignmentDraft,
  AssignmentBookingDetails,
} from "./assignmentTypes";

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
    `⏰ Time: ${booking.time}`,
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
