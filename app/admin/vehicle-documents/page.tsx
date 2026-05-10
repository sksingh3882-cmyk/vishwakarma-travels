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

export default function VehicleDocumentsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [insurance, setInsurance] = useState("");
  const [pollution, setPollution] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setVehicles(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  }, [vehicles]);

  const alerts = useMemo(() => {
    return vehicles.filter((v) => {
      const insuranceDays = Math.ceil((new Date(v.insurance).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const pollutionDays = Math.ceil((new Date(v.pollution).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return insuranceDays <= 30 || pollutionDays <= 30;
    });
  }, [vehicles]);

  function addVehicle() {
    if (!number || !name) return;

    setVehicles([
      {
        id: Date.now(),
        number,
        name,
        insurance,
        pollution,
      },
      ...vehicles,
    ]);

    setNumber("");
    setName("");
    setInsurance("");
    setPollution("");
  }

  function deleteVehicle(id: number) {
    setVehicles(vehicles.filter((v) => v.id !== id));
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f1f5f9", padding: 16, fontFamily: "Arial" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#0b2d6b,#1d4ed8)", color: "white", padding: 24, borderRadius: 24 }}>
          <a href="/admin" style={{ color: "white", textDecoration: "none", fontWeight: 700 }}>← Back to Admin</a>
          <h1 style={{ margin: "12px 0 6px", fontSize: 42 }}>Vehicle Documents</h1>
          <p style={{ margin: 0 }}>Track insurance and pollution expiry dates.</p>
        </div>

        {alerts.length > 0 && (
          <div style={{ marginTop: 16, background: "#fff7ed", border: "1px solid #fdba74", padding: 16, borderRadius: 18 }}>
            <h2 style={{ marginTop: 0, color: "#c2410c" }}>Expiry Alerts</h2>
            {alerts.map((v) => (
              <p key={v.id}><b>{v.number}</b> - {v.name} documents are expiring soon.</p>
            ))}
          </div>
        )}

        <div style={{ background: "white", marginTop: 16, padding: 18, borderRadius: 20 }}>
          <h2>Add Vehicle</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
            <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Vehicle Number" style={inputStyle} />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vehicle Name" style={inputStyle} />
            <input type="date" value={insurance} onChange={(e) => setInsurance(e.target.value)} style={inputStyle} />
            <input type="date" value={pollution} onChange={(e) => setPollution(e.target.value)} style={inputStyle} />
          </div>

          <button onClick={addVehicle} style={buttonStyle}>Save Vehicle</button>
        </div>

        <div style={{ background: "white", marginTop: 16, padding: 18, borderRadius: 20 }}>
          <h2>Saved Vehicles</h2>

          <div style={{ display: "grid", gap: 12 }}>
            {vehicles.map((v) => (
              <div key={v.id} style={{ border: "1px solid #e2e8f0", borderRadius: 18, padding: 16, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ margin: "0 0 6px" }}>{v.number}</h3>
                  <p style={{ margin: 0 }}>{v.name}</p>
                  <p style={{ margin: "6px 0 0" }}>Insurance: {v.insurance || "Not Added"}</p>
                  <p style={{ margin: "4px 0 0" }}>Pollution: {v.pollution || "Not Added"}</p>
                </div>

                <button onClick={() => deleteVehicle(v.id)} style={{ ...buttonStyle, background: "#dc2626" }}>Delete</button>
              </div>
            ))}

            {vehicles.length === 0 && <p>No vehicles added yet.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  fontSize: 16,
};

const buttonStyle: React.CSSProperties = {
  marginTop: 14,
  background: "#0b2d6b",
  color: "white",
  border: 0,
  padding: "13px 16px",
  borderRadius: 14,
  fontWeight: 800,
};