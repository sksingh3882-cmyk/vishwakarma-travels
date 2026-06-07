"use client";

import { useMemo, useState } from "react";
import { Car, CheckCircle2, ClipboardCopy, MessageCircle, Phone, Send, Trash2 } from "lucide-react";

type VehicleDetails = {
  driverName: string;
  driverMobile: string;
  vehicleModel: string;
  vehicleNumber: string;
  vehicleType: string;
};

const trip