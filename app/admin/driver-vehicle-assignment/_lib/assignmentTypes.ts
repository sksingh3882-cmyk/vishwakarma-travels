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

export type AdminAssignmentDraft = {
  pickupArea: string;
  dropArea: string;
  note: string;
  vehicleType: string;
  vehicleModel: string;
};

export type AssignmentBookingDetails = {
  bookingId: string;
  customerName: string;
  customerMobile: string;
  adminContact: string;
  serviceType: string;
  date: string;
  time: string;
  pickupArea: string;
  dropArea: string;
  pickupFullAddress: string;
  dropFullAddress: string;
  vehicleType: string;
  vehicleModel: string;
};

export type DriverVehicleSubmission = {
  driverName: string;
  driverMobile: string;
  vehicleNumber: string;
  driverVehicleModel: string;
  driverImageUrl?: string;
  driverSelfieUrl?: string;
};

export type SavedAssignmentPayload = {
  bookingId: string;
  driver_name: string;
  driver_mobile: string;
  vehicle_number: string;
};
