"use client";

import { useMemo, useState } from "react";

const trip = {
  service: "Outstation",
  date: "10 June 2026",
  time: "08:00 AM",
  vehicleRequired: "Sedan",
  pickupArea: "Sonari",
  dropArea: "Ranchi Airport",
  contact: "98xxxxxx12",
};

const emptyVehicle = {
  driverName: "",
  driverMobile: "",
  vehicleModel: "",
  vehicleNumber: "",
  vehicle