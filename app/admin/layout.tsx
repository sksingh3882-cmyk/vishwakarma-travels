import type { CSSProperties, ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div style={menuWrap}>
        <div style={menuInner}>
          <a href="/admin" style={brandLink}>Vishwakarma Admin</a>
          <a href="/admin/vehicle-documents" style={menuButton}>Vehicle Documents</a>
        </div>
      </div>
      {children}
    </>
  );
}

const menuWrap: CSSProperties = {
  background: "#f1f5f9",
  padding: "12px 16px 0",
  fontFamily: "Arial, sans-serif",
};

const menuInner: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 12,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
  boxShadow: "0 8px 22px rgba(15,23,42,.08)",
};

const brandLink: CSSProperties = {
  color: "#0b2d6b",
  fontWeight: 950,
  textDecoration: "none",
  fontSize: 18,
};

const menuButton: CSSProperties = {
  background: "linear-gradient(135deg,#f97316,#ea580c)",
  color: "white",
  textDecoration: "none",
  padding: "11px 14px",
  borderRadius: 12,
  fontWeight: 950,
};
