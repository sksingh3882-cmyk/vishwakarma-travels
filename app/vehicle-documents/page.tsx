"use client";

import { useEffect, useMemo, useState } from "react";

type Vehicle = {
  id: number;
  number: string;
  name: string;
  insurance: string;
  pollution: string;
};

const STORAGE_KEY = "vehicle-documents-data";

function getDaysLeft(dateValue: string) {
  if (!dateValue) return 99999;
  return Math.ceil((new Date(dateValue).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function getStatus(dateValue: string) {
  const days = getDaysLeft(dateValue);
  if (!dateValue) return { label: "Not Added", bg: "#f1f5f9", color: "#64748b" };
  if (days < 0) return { label: "Expired", bg: "#fee2e2", color: "#b91c1c" };
  if (days <= 30) return { label: `Expiring in ${days} days`, bg: "#ffedd5", color: "#c2410c" };
  return { label: "Valid", bg: "#dcfce7", color: "#15803d" };
}

export default function VehicleDocumentsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [insurance, setInsurance] = useState("");
  const [pollution, setPollution] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setVehicles(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  }, [vehicles]);

  const alerts = useMemo(() => vehicles.filter((v) => getDaysLeft(v.insurance) <= 30 || getDaysLeft(v.pollution) <= 30), [vehicles]);

  function addVehicle() {
    if (!number || !name) {
      alert("Vehicle number and vehicle name are required.");
      return;
    }

    setVehicles([{ id: Date.now(), number: number.toUpperCase(), name, insurance, pollution }, ...vehicles]);
    setNumber("");
    setName("");
    setInsurance("");
    setPollution("");
  }

  function deleteVehicle(id: number) {
    if (!confirm("Delete this vehicle record?")) return;
    setVehicles(vehicles.filter((v) => v.id !== id));
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <header style={heroStyle}>
          <h1 style={titleStyle}>Vehicle Documents</h1>
          <p style={subTitleStyle}>Manual insurance and pollution record manager.</p>
        </header>

        <section style={summaryGrid}>
          <div style={summaryCard}><span>Total Vehicles</span><b>{vehicles.length}</b></div>
          <div style={summaryCard}><span>Expiry Alerts</span><b style={{ color: alerts.length ? "#dc2626" : "#15803d" }}>{alerts.length}</b></div>
          <div style={summaryCard}><span>Data Save</span><b>Local Storage</b></div>
        </section>

        {alerts.length > 0 && (
          <section style={alertBox}>
            <h2 style={{ margin: "0 0 10px", color: "#c2410c" }}>Expiry Alerts</h2>
            {alerts.map((v) => (
              <p key={v.id} style={{ margin: "6px 0" }}><b>{v.number}</b> - {v.name}: insurance or pollution is expired/expiring soon.</p>
            ))}
          </section>
        )}

        <section style={cardStyle}>
          <h2 style={sectionTitle}>Add Vehicle</h2>
          <div style={formGrid}>
            <input value={number} onChange={(e) => setNumber(e.target.value.toUpperCase())} placeholder="Vehicle Number" style={inputStyle} />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vehicle Name" style={inputStyle} />
            <label style={dateBox}><span>Insurance Expiry</span><input type="date" value={insurance} onChange={(e) => setInsurance(e.target.value)} style={dateInput} /></label>
            <label style={dateBox}><span>Pollution Expiry</span><input type="date" value={pollution} onChange={(e) => setPollution(e.target.value)} style={dateInput} /></label>
          </div>
          <button onClick={addVehicle} style={saveButton}>Save Vehicle</button>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitle}>Saved Vehicles</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {vehicles.length === 0 && <p style={{ color: "#64748b" }}>No vehicles added yet.</p>}
            {vehicles.map((v) => {
              const insuranceStatus = getStatus(v.insurance);
              const pollutionStatus = getStatus(v.pollution);
              return (
                <article key={v.id} style={vehicleCard}>
                  <div>
                    <h3 style={{ margin: "0 0 6px", color: "#0b2d6b", fontSize: 24 }}>{v.number}</h3>
                    <p style={{ margin: "0 0 10px", color: "#475569" }}>{v.name}</p>
                    <p style={docLine}>Insurance: <b>{v.insurance || "Not Added"}</b> <span style={{ ...pillStyle, background: insuranceStatus.bg, color: insuranceStatus.color }}>{insuranceStatus.label}</span></p>
                    <p style={docLine}>Pollution: <b>{v.pollution || "Not Added"}</b> <span style={{ ...pillStyle, background: pollutionStatus.bg, color: pollutionStatus.color }}>{pollutionStatus.label}</span></p>
                  </div>
                  <button onClick={() => deleteVehicle(v.id)} style={deleteButton}>Delete</button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#f1f5f9", padding: 16, fontFamily: "Arial, sans-serif", color: "#0f172a" };
const containerStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
const heroStyle: React.CSSProperties = { background: "linear-gradient(135deg,#0b2d6b,#1d4ed8)", color: "white", padding: 24, borderRadius: 24, boxShadow: "0 14px 34px rgba(15,23,42,.18)" };
const titleStyle: React.CSSProperties = { margin: 0, fontSize: "clamp(34px,7vw,58px)", lineHeight: 1, fontWeight: 950 };
const subTitleStyle: React.CSSProperties = { margin: "10px 0 0", opacity: .95, fontSize: 16 };
const summaryGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 16 };
const summaryCard: React.CSSProperties = { background: "white", padding: 16, borderRadius: 18, boxShadow: "0 8px 22px rgba(15,23,42,.08)", display: "grid", gap: 6 };
const alertBox: React.CSSProperties = { background: "#fff7ed", border: "1px solid #fdba74", padding: 16, borderRadius: 18, marginTop: 16 };
const cardStyle: React.CSSProperties = { background: "white", marginTop: 16, padding: 18, borderRadius: 20, boxShadow: "0 8px 22px rgba(15,23,42,.08)" };
const sectionTitle: React.CSSProperties = { margin: "0 0 14px", color: "#0b2d6b", fontSize: 26 };
const formGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 };
const inputStyle: React.CSSProperties = { padding: 14, borderRadius: 14, border: "1px solid #cbd5e1", fontSize: 16 };
const dateBox: React.CSSProperties = { display: "grid", gap: 6, padding: 12, borderRadius: 15, border: "1px solid #fed7aa", background: "#fff7ed", color: "#0b2d6b", fontWeight: 900 };
const dateInput: React.CSSProperties = { border: 0, outline: 0, background: "transparent", fontSize: 16, fontWeight: 800 };
const saveButton: React.CSSProperties = { marginTop: 14, background: "#0b2d6b", color: "white", border: 0, padding: "13px 16px", borderRadius: 14, fontWeight: 900 };
const vehicleCard: React.CSSProperties = { border: "1px solid #e2e8f0", borderRadius: 18, padding: 16, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" };
const docLine: React.CSSProperties = { margin: "6px 0", color: "#334155" };
const pillStyle: React.CSSProperties = { display: "inline-block", padding: "5px 8px", borderRadius: 999, fontSize: 12, fontWeight: 900, marginLeft: 6 };
const deleteButton: React.CSSProperties = { background: "#dc2626", color: "white", border: 0, padding: "10px 14px", borderRadius: 12, fontWeight: 900, height: 42 };
