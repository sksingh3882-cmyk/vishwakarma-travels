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
      <div className="admin-shell"><AdminCustomDropdowns />{children}</div>
      <style>{adminCss}</style>
    </>
  );
}

const menuWrap: CSSProperties = { background: "#eef4fb", padding: "10px 12px 0", fontFamily: "Arial, sans-serif" };
const menuInner: CSSProperties = { maxWidth: 1200, margin: "0 auto", background: "linear-gradient(135deg,#ffffff,#f8fbff)", border: "1px solid #dbeafe", borderRadius: 18, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, boxShadow: "0 10px 26px rgba(15,23,42,.08)" };
const brandLink: CSSProperties = { color: "#0b2d6b", fontWeight: 950, textDecoration: "none", fontSize: 20, whiteSpace: "nowrap" };
const menuBadge: CSSProperties = { background: "#eff6ff", color: "#0b2d6b", padding: "8px 10px", borderRadius: 999, fontSize: 12, fontWeight: 900, border: "1px solid #bfdbfe", whiteSpace: "nowrap" };

const adminCss = `
.admin-shell select[data-custom-dropdown-ready="yes"]{display:none!important;visibility:hidden!important;position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
.vt-custom-select{position:relative;width:100%;margin:0}.vt-custom-select-btn{width:100%;min-height:42px;border-radius:14px;border:1px solid #cbd5e1;background:linear-gradient(135deg,#fff,#eff6ff);display:flex;align-items:center;justify-content:space-between;padding:0 14px;font-weight:900;color:#0f172a;box-shadow:0 8px 18px rgba(15,23,42,.05)}.vt-custom-select-menu{display:none;position:absolute;left:0;right:0;top:calc(100% + 6px);background:#fff;border:1px solid #dbeafe;border-radius:18px;padding:8px;box-shadow:0 16px 36px rgba(15,23,42,.12);z-index:80}.vt-custom-select.open .vt-custom-select-menu{display:grid;gap:6px}.vt-custom-select-item{border:0;background:#f8fafc;padding:12px 14px;border-radius:12px;text-align:left;font-weight:800;color:#0f172a}.vt-custom-select-item:hover{background:#dbeafe}
.admin-shell main{background:linear-gradient(180deg,#eef4fb 0%,#f8fafc 48%,#eef4fb 100%)!important;padding:12px!important;font-family:Arial,sans-serif!important}.admin-shell header{background:linear-gradient(135deg,#071a44,#0b2d6b 58%,#f97316)!important;border-radius:24px!important;padding:18px 16px!important;margin-bottom:12px!important;box-shadow:0 14px 34px rgba(11,45,107,.22)!important}.admin-shell header h1{margin:0!important;font-size:clamp(22px,5vw,34px)!important;line-height:1.05!important}.admin-shell header p{margin:6px 0 12px!important;opacity:.9!important;font-size:13px!important}.admin-shell form,.admin-shell section{background:rgba(255,255,255,.98)!important;border:1px solid #e2e8f0!important;box-shadow:0 10px 28px rgba(15,23,42,.08)!important;border-radius:22px!important}.admin-shell form h2,.admin-shell section h2{color:#0b2d6b!important;margin-top:0!important;font-size:21px!important}.admin-shell input,.admin-shell select{background:#f8fafc!important;border:1px solid #cbd5e1!important;border-radius:14px!important;min-height:42px!important;font-weight:700!important;color:#0f172a!important}.admin-shell button{border-radius:14px!important}.admin-shell table{border-collapse:separate!important;border-spacing:0 10px!important;min-width:0!important}.admin-shell tbody tr{background:#fff!important;box-shadow:0 8px 20px rgba(15,23,42,.06)!important}.admin-shell td,.admin-shell th{border-bottom:0!important}
@media(max-width:720px){.admin-shell main{padding:10px!important}.admin-shell header{padding:16px 14px!important}.admin-shell section:nth-of-type(1){grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important}.admin-shell section:nth-of-type(1)>div{min-width:0!important;padding:12px 8px!important;text-align:center!important;border:1px solid #e2e8f0!important;box-shadow:0 8px 22px rgba(15,23,42,.07)!important}.admin-shell section:nth-of-type(1) p{font-size:11px!important;margin:0 0 6px!important}.admin-shell section:nth-of-type(1) h2{font-size:22px!important;margin:0!important}.admin-shell section:nth-of-type(1) b{font-size:10px!important}.admin-shell form>div:first-of-type{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.admin-shell form>div:last-of-type{position:sticky!important;bottom:8px!important;background:rgba(255,255,255,.94)!important;padding:8px!important;border-radius:18px!important;box-shadow:0 8px 22px rgba(15,23,42,.12)!important;z-index:5!important}.admin-shell table,.admin-shell thead,.admin-shell tbody,.admin-shell tr,.admin-shell td{display:block!important;width:100%!important}.admin-shell thead{display:none!important}.admin-shell tbody tr{border:1px solid #e2e8f0!important;border-radius:18px!important;margin-bottom:10px!important;padding:10px!important;overflow:hidden!important}.admin-shell tbody td{display:flex!important;justify-content:space-between!important;gap:12px!important;padding:7px 4px!important;font-size:12px!important;border-bottom:1px dashed #e2e8f0!important}.admin-shell tbody td:last-child{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important;border-bottom:0!important}.admin-shell tbody td:last-child button{margin-right:0!important;padding:10px 8px!important;font-size:12px!important}}
`;
