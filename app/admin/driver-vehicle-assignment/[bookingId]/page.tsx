"use client";

import { useMemo, useState } from "react";
import {
  Car,
  CheckCircle2,
  ClipboardCopy,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCcw,
  Send,
  Trash2,
  UserRound,
} from "lucide-react";

type VehicleDetails = {
  driverName: string;
  driverMobile: string;
  vehicleModel: string;
  vehicleNumber: string;
  vehicleType: string;
  remark: string;
};

const sampleTrip = {
  service: "Outstation",
  date: "10 June 