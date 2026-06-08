export type BookingSnapshot = {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  adminContact: string;
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
};

export type AssignmentShellProps = {
  bookingId: string;
  forceDriverMode?: boolean;
};
export type AssignmentShellProps = {
  bookingId: string;
  forceDriverMode?: boolean;
};
