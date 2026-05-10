"use client";

import { useMemo, useState, type FormEvent } from "react";

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
  const [documents, setDocuments] = useState<VehicleDocument[]>([
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
  ]);
  const [form, setForm] = useState<VehicleDocumentForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);

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

  return (
    <main style={pageStyle}>
      <header style={headerStyle}>
        <div>
          <a href="/admin" style={backLink}>← Back to Admin</a>
          <h1 style={titleStyle}>Vehicle Documents</h1>
          <p style={subtitleStyle}>Insurance, Pollution, Fitness and Permit expiry tracking.</p>
        </div>
        <a href="#add-vehicle" style={topButton}>+ Add Vehicle</a>
      </header>

      <section style={summaryGrid}>
        <div style={summaryCard}><span>Total Vehicles</span><b>{documents.length}</b></div>
        <div style={summaryCard}><span>Alerts</span><b style={{ color: alerts.length ? "#dc2626" : "#16a34a" }}>{alerts.length}</b></div>
        <div style={summaryCard}><span>Reminder Rule</span><b>30 Days</b></div>
      </section>

      {alerts.length > 0 && (
        <section style={alertBox}>
          <h2 style={{ margin: "0 0 10px", color: "#9a3412" }}>Document Alerts</h2>
          {alerts.map((vehicle) => (
            <p key={vehicle.id} style={{ margin: "6px 0" }}>
              <b>{vehicle.vehicleNumber}</b> - {vehicle.vehicleName}: Please check expiring or expired documents.
            </p>
          ))}
        </section>
      )}

      <section id="add-vehicle" style={formCard}>
        <h2 style={sectionTitle}>{editingId ? "Edit Vehicle Record" : "Add Vehicle Record"}</h2>
        <form onSubmit={submitVehicle} style={formGrid}>
          <input value={form.vehicleNumber} onChange={(e) => updateForm("vehicleNumber", e.target.value.toUpperCase())} placeholder="Vehicle Number" style={inputStyle} required />
          <input value={form.vehicleName} onChange={(e) => updateForm("vehicleName", e.target.value)} placeholder="Vehicle Name / Model" style={inputStyle} required />
          <label style={fieldBox}><span>Insurance Expiry</span><input type="date" value={form.insuranceExpiry} onChange={(e) => updateForm("insuranceExpiry", e.target.value)} style={dateInput} required /></label>
          <label style={fieldBox}><span>Pollution / PUC Expiry</span><input type="date" value={form.pollutionExpiry} onChange={(e) => updateForm("pollutionExpiry", e.target.value)} style={dateInput} required /></label>
          <label style={fieldBox}><span>Fitness Expiry</span><input type="date" value={form.fitnessExpiry} onChange={(e) => updateForm("fitnessExpiry", e.target.value)} style={dateInput} /></label>
          <label style={fieldBox}><span>Permit Expiry</span><input type="date" value={form.permitExpiry} onChange={(e) => updateForm("permitExpiry", e.target.value)} style={dateInput} /></label>
          <textarea value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} placeholder="Notes" style={textareaStyle} />
          <div style={buttonRow}>
            <button type="submit" style={saveButton}>{editingId ? "Update Record" : "Save Vehicle"}</button>
            {editingId && <button type="button" onClick={resetForm} style={cancelButton}>Cancel</button>}
          </div>
        </form>
      </section>

      <section style={tableCard}>
        <h2 style={sectionTitle}>Vehicle Document Records</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Vehicle</th>
                <th style={thStyle}>Insurance</th>
                <th style={thStyle}>Pollution</th>
                <th style={thStyle}>Fitness</th>
                <th style={thStyle}>Permit</th>
                <th style={thStyle}>Overall</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((vehicle) => {
                const overall = getWorstStatus(vehicle);
                return (
                  <tr key={vehicle.id}>
                    <td style={tdStyle}><b>{vehicle.vehicleNumber}</b><br /><span>{vehicle.vehicleName}</span></td>
                    <DocCell date={vehicle.insuranceExpiry} />
                    <DocCell date={vehicle.pollutionExpiry} />
                    <DocCell date={vehicle.fitnessExpiry} />
                    <DocCell date={vehicle.permitExpiry} />
                    <td style={tdStyle}><span style={{ ...statusPill, background: overall.bg, color: overall.color }}>{overall.label}</span></td>
                    <td style={tdStyle}>
                      <button onClick={() => editVehicle(vehicle)} style={editButton}>Edit</button>
                      <button onClick={() => deleteVehicle(vehicle.id)} style={deleteButton}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function DocCell({ date }: { date: string }) {
  const status = getStatus(date);
  return (
    <td style={tdStyle}>
      <b>{date || "Not Added"}</b><br />
      <span style={{ ...statusPill, background: status.bg, color: status.color }}>{status.label}</span>
    </td>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#f1f5f9", padding: 16, fontFamily: "Arial, sans-serif", color: "#0f172a" };
const headerStyle: React.CSSProperties = { maxWidth: 1200, margin: "0 auto 16px", background: "linear-gradient(135deg,#0b2d6b,#1d4ed8)", color: "white", padding: 22, borderRadius: 22, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" };
const backLink: React.CSSProperties = { color: "white", textDecoration: "none", fontWeight: 800, opacity: .9 };
const titleStyle: React.CSSProperties = { margin: "10px 0 4px", fontSize: "clamp(30px,6vw,52px)", lineHeight: 1, fontWeight: 950 };
const subtitleStyle: React.CSSProperties = { margin: 0, opacity: .92 };
const topButton: React.CSSProperties = { background: "#f97316", color: "white", textDecoration: "none", padding: "13px 16px", borderRadius: 14, fontWeight: 950 };
const summaryGrid: React.CSSProperties = { maxWidth: 1200, margin: "0 auto 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 };
const summaryCard: React.CSSProperties = { background: "white", padding: 16, borderRadius: 18, boxShadow: "0 8px 22px rgba(15,23,42,.08)", display: "grid", gap: 6 };
const alertBox: React.CSSProperties = { maxWidth: 1200, margin: "0 auto 16px", background: "#fff7ed", border: "1px solid #fed7aa", padding: 16, borderRadius: 18 };
const formCard: React.CSSProperties = { maxWidth: 1200, margin: "0 auto 16px", background: "white", padding: 18, borderRadius: 20, boxShadow: "0 10px 25px rgba(15,23,42,.08)" };
const sectionTitle: React.CSSProperties = { margin: "0 0 14px", color: "#0b2d6b", fontSize: 26 };
const formGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 };
const inputStyle: React.CSSProperties = { padding: 14, borderRadius: 14, border: "1px solid #cbd5e1", fontSize: 16 };
const fieldBox: React.CSSProperties = { display: "grid", gap: 6, padding: 12, borderRadius: 15, border: "1px solid #fed7aa", background: "#fff7ed", color: "#0b2d6b", fontWeight: 900 };
const dateInput: React.CSSProperties = { border: 0, outline: 0, background: "transparent", fontSize: 16, fontWeight: 800 };
const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 52, resize: "vertical" };
const buttonRow: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap" };
const saveButton: React.CSSProperties = { background: "#15803d", color: "white", padding: "13px 16px", border: 0, borderRadius: 14, fontWeight: 950 };
const cancelButton: React.CSSProperties = { background: "#64748b", color: "white", padding: "13px 16px", border: 0, borderRadius: 14, fontWeight: 950 };
const tableCard: React.CSSProperties = { maxWidth: 1200, margin: "0 auto 16px", background: "white", padding: 18, borderRadius: 20, boxShadow: "0 10px 25px rgba(15,23,42,.08)" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", minWidth: 920 };
const thStyle: React.CSSProperties = { background: "#0b2d6b", color: "white", padding: 12, textAlign: "left" };
const tdStyle: React.CSSProperties = { borderBottom: "1px solid #e2e8f0", padding: 12, verticalAlign: "top" };
const statusPill: React.CSSProperties = { display: "inline-block", marginTop: 6, padding: "5px 8px", borderRadius: 999, fontSize: 12, fontWeight: 900 };
const editButton: React.CSSProperties = { background: "#0b2d6b", color: "white", border: 0, padding: "8px 10px", borderRadius: 10, fontWeight: 800, marginRight: 6 };
const deleteButton: React.CSSProperties = { background: "#dc2626", color: "white", border: 0, padding: "8px 10px", borderRadius: 10, fontWeight: 800 };
