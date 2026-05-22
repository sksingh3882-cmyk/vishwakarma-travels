import type { CSSProperties, ReactNode } from "react";
import AdminCustomDropdowns from "./AdminCustomDropdowns";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div style={menuWrap}>
        <div style={menuInner}>
          <a href="/admin" style={brandLink}>Vishwakarma Admin</a>
          <span style={menuBadge}>Admin Panel</span>
        </div>
      </div>
      <div className="admin-shell">
        <AdminCustomDropdowns />
        {children}
      </div>
      <style>{adminCss}</style>
    </>
  );
}

const menuWrap: CSSProperties = {
  background: "#eef4fb",
  padding: "10px 12px 0",
  fontFamily: "Arial, sans-serif",
};

const menuInner: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  background: "linear-gradient(135deg,#ffffff,#f8fbff)",
  border: "1px solid #dbeafe",
  borderRadius: 18,
  padding: "12px 14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  boxShadow: "0 10px 26px rgba(15,23,42,.08)",
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

const adminCss = `
.vt-custom-select{position:relative;width:100%;margin:0}.vt-custom-select-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #cbd5e1;background:linear-gradient(135deg,#ffffff,#eff6ff);display:flex;align-items:center;justify-content:space-between;padding:0 16px;font-weight:900;color:#0f172a;box-shadow:0 8px 18px rgba(15,23,42,.05)}.vt-custom-select-btn b{font-size:18px;color:#0b2d6b}.vt-custom-select-menu{display:none;position:absolute;left:0;right:0;top:calc(100% + 6px);background:#fff;border:1px solid #dbeafe;border-radius:18px;padding:8px;box-shadow:0 16px 36px rgba(15,23,42,.12);z-index:80}.vt-custom-select.open .vt-custom-select-menu{display:grid;gap:6px}.vt-custom-select-item{border:0;background:#f8fafc;padding:12px 14px;border-radius:12px;text-align:left;font-weight:800;color:#0f172a}.vt-custom-select-item:hover{background:#dbeafe}
.admin-shell main{background:linear-gradient(180deg,#eef4fb 0%,#f8fafc 48%,#eef4fb 100%)!important;padding:12px!important;font-family:Arial,sans-serif!important}
`;
