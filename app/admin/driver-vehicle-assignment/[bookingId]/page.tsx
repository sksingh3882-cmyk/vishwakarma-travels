"use client";

import { useMemo, useState } from "react";

type TripDetails = {
  customerName: string;
  customerPhone: string;
  service: string;
  pickup: string;
  drop: string;
  journeyDate: string;
  journeyTime: string;
  vehicleType: string;
  vehicleModel: string;
};

type DriverSubmit = {
  driverName: string;
  driverMobile: string;
  vehicleNumber: string;
  driverVehicleModel: string;
};

const TEST_TRIP: TripDetails = {
  customer