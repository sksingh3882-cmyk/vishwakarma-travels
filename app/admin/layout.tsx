import type { CSSProperties, ReactNode } from "react";
import AdminCustomDropdowns from "./AdminCustomDropdowns";
import AdminCalendarStyle from "./AdminCalendarStyle";
import AdminRecentPdfFix from "./AdminRecentPdfFix";
import AdminCustomerAutofill from "./AdminCustomerAutofill";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div style={menuWrap}>
        <div style={menuInner}>
          <a href="/admin" style={brandLink}>Vishwakarma Admin</a>
          <span style={menuBadge}>Admin Panel</span>
        </div>
      </div>
      <div className="admin-shell"><AdminCustomDropdowns /><AdminRecentPdfFix /><AdminCustomerAutofill />{children}</div>
      <style>{adminCss}</style>
      <AdminCalendarStyle />
    </>
  );
}

const menuWrap: CSSProperties = { background: "#eef4fb", padding: "10px 12px 0", fontFamily: "Arial, sans-serif" };
const menuInner: CSSProperties = { maxWidth: 1200, margin: "0 auto", background: "linear-gradient(135deg,#ffffff,#f8fbff)", border: "1px solid #dbeafe", borderRadius: 18, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, boxShadow: "0 10px 26px rgba(15,23,42,.08)" };
const brandLink: CSSProperties = { color: "#0b2d6b", fontWeight: 950, textDecoration: "none", fontSize: 20, whiteSpace: "nowrap" };
const menuBadge: CSSProperties = { background: "#eff6ff", color: "#0b2d6b", padding: "8px 10px", borderRadius: 999, fontSize: 12, fontWeight: 900, border: "1px solid #bfdbfe", whiteSpace: "nowrap" };

const adminCss = `
.admin-shell select[data-custom-dropdown-ready="yes"],.admin-shell input[data-custom-picker-ready="yes"]{display:none!important;visibility:hidden!important;position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
`;
