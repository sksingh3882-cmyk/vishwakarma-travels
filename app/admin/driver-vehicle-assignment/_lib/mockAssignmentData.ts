import type { AssignmentBookingDetails } from "./assignmentTypes";

export function getMockAssignmentData(
  bookingId: string
): AssignmentBookingDetails {
  return {
    bookingId,
    customerName: "Test Customer",
    customerMobile: "98xxxxxx12",
    adminContact: "7667989203",
    serviceType: "Outstation / Local / Airport",
    date: "10 June 2026",
    time: "08:00 AM",
    pickupArea: "Sonari",
    dropArea: "Ranchi Airport",
    pickupFullAddress: "Sonari, Jamshedpur",
    dropFullAddress: "Ranchi Airport",
    vehicleType: "Sedan",
    vehicleModel: "Dzire / Etios / Similar",
  };
}
