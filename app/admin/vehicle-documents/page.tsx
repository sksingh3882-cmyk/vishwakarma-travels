"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

type VehicleDocument = {
  id: number;
  vehicleNumber: string;
  vehicleName: string;
  insuranceExpiry: string;
  pollutionExpiry: string;
  fitnessExpiry: string;
  permitExpiry: string;
  notes: string;
};

type VehicleDocumentForm = Omit<VehicleDocument, "id">;

const STORAGE_KEY = "vishwakarma-vehicle-documents";

const demoVehicles: VehicleDocument[] = [
  {
    id: 1,
    vehicleNumber: "JH05AB1234",
    vehicleName: "Dzire",
    insuranceExpiry: "2026-08-20",
    pollutionExpiry: "2026-06-12",
    fitnessExpiry: "2026-12-30",
    permitExpiry: "2026-11-10",
    notes: "Demo vehicle record",
  },
];

const initialForm: VehicleDocumentForm = {
  vehicleNumber: "",
  vehicleName: "",
  insuranceExpiry: "",
  pollutionExpiry: "",
  fitnessExpiry: "",
  permitExpiry: "",
  notes: "",
};

function daysLeft(dateValue: string) {
  if (!dateValue) return 99999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateValue);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getStatus(dateValue: string) {
  const days = daysLeft(dateValue);
  if (!dateValue) return { label: "Missing", color: "#64748b", bg: "#f1f5f9" };
  if (days < 0) return { label: "Expired", color: "#b91c1c", bg: "#fee2e2" };
  if (days <= 30) return { label: `Expiring in ${days} days`, color: "#c2410c", bg: "#ffedd5" };
  return { label: "Valid", color: "#15803d", bg: "#dcfce7" };
}

function getWorstStatus(vehicle: VehicleDocument) {
  const values = [vehicle.insuranceExpiry, vehicle.pollutionExpiry, vehicle.fitnessExpiry, vehicle.permitExpiry].map(daysLeft);
  const min = Math.min(...values);
  if (min < 0) return { label: "Expired Document", color: "#b91c1c", bg: "#fee2e2" };
  if (min <= 30) return { label: "Action Needed", color: "#c2410c", bg: "#ffedd5" };
  return { label: "All Valid", color: "#15803d", bg: "#dcfce7" };
}

export default function VehicleDocumentsPage() {
  const [documents, setDocuments] = useState<VehicleDocument[]>(demoVehicles);
  const [form, setForm] = useState<VehicleDocumentForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as VehicleDocument[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDocuments(parsed);
          return;
        }
      } catch {}
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoVehicles));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }, [documents]);

  const alerts = useMemo(
    () =>
      documents.filter((vehicle) =>
        [vehicle.insuranceExpiry, vehicle.pollutionExpiry, vehicle.fitnessExpiry, vehicle.permitExpiry].some((date) => daysLeft(date) <= 30)
      ),
    [documents]
  );

  function updateForm(key: keyof VehicleDocumentForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function submitVehicle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (editingId) {
      setDocuments((prev) => prev.map((item) => (item.id === editingId ? { ...form, id: editingId } : item)));
    } else {
      setDocuments((prev) => [{ ...form, id: Date.now() }, ...prev]);
    }

    resetForm();
  }

  function editVehicle(vehicle: VehicleDocument) {
    setEditingId(vehicle.id);
    setForm({
      vehicleNumber: vehicle.vehicleNumber,
      vehicleName: vehicle.vehicleName,
      insuranceExpiry: vehicle.insuranceExpiry,
      pollutionExpiry: vehicle.pollutionExpiry,
      fitnessExpiry: vehicle.fitnessExpiry,
      permitExpiry: vehicle.permitExpiry,
      notes: vehicle.notes,
    });
  }

  function deleteVehicle(id: number) {
    const confirmDelete = window.confirm("Delete this vehicle document record?");
    if (!confirmDelete) return;
    setDocuments((prev) => prev.filter((item) => item.id !== id));
  }

  return <main />;
}
