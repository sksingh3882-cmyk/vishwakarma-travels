export type BookingSnapshot = {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  service: string;
  pickupLocation: string;
  dropLocation: string;
  journeyDate: string;
  journeyTime: string;
  vehicleType: string;
  vehicleModel: string;
};

export type AssignmentFormState = {
  pickupArea: string;
  dropArea: string;
  note: string;
