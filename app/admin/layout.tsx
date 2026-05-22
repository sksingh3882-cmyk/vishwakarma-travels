import type { CSSProperties, ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div style={menuWrap}>
        <div style={menuInner}>
          <a href="/admin" style={brandLink}>Vishwakarma Admin</a>
          <span style={menuBadge}>Admin Panel</span>
        </div>
      </div>
      {children}
    </>
  );
}

const menuWrap: CSSProperties = {
  background: "#f1f5f9",
  padding: "10px 12px 0",
  fontFamily: "Arial, sans-serif",
};

const menuInner: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: "12px 14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  boxShadow: "0 8px 22px rgba(15,23,42,.08)",
};

const brandLink: CSSProperties = {
  color: "#0b2d6b",
  fontWeight: 950,
  textDecoration: "none",
  fontSize: 20,
  whiteSpace: "nowrap",
};

const menuBadge: CSSProperties = {
  background: "#eff6ff",
  color: "#0b2d6b",
  padding: "8px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 900,
  border: "1px solid #bfdbfe",
  whiteSpace: "nowrap",
};
