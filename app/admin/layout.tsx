import type { CSSProperties, ReactNode } from "react";
import AdminCalendarStyle from "./AdminCalendarStyle";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div style={menuWrap}>
        <div style={menuInner}>
          <a href="/admin" style={brandLink}>Vishwakarma Admin</a>
          <span style={menuBadge}>Admin Panel</span>
        </div>
      </div>
      <div className="admin-shell">{children}</div>
      <style>{adminCss}</style>
      <AdminCalendarStyle />
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
.admin-shell main{background:linear-gradient(180deg,#eef4fb 0%,#f8fafc 48%,#eef4fb 100%)!important;padding:12px!important;font-family:Arial,sans-serif!important}
.admin-shell header{background:linear-gradient(135deg,#071a44,#0b2d6b 58%,#f97316)!important;border-radius:24px!important;padding:18px 16px!important;margin-bottom:20px!important;box-shadow:0 14px 34px rgba(11,45,107,.22)!important}
.admin-shell form,.admin-shell section{background:rgba(255,255,255,.98)!important;border:1px solid #e2e8f0!important;box-shadow:0 10px 28px rgba(15,23,42,.08)!important;border-radius:22px!important}
.admin-shell form h2,.admin-shell section h2{color:#0b2d6b!important;margin-top:0!important;font-size:21px!important}
.admin-shell input,.admin-shell select{background:#f8fafc!important;border:1px solid #cbd5e1!important;border-radius:14px!important;min-height:42px!important;font-weight:700!important;color:#0f172a!important}
.admin-shell button{border-radius:14px!important}
@media(max-width:720px){.admin-shell main{padding:10px!important}.admin-shell form>div:first-of-type{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}}
`;
