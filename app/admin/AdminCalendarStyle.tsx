export default function AdminCalendarStyle() {
  return <style>{css}</style>;
}

const css = `
.admin-shell .vt-date-picker.open .vt-cal-menu{display:block!important;position:fixed!important;left:12px!important;right:12px!important;bottom:76px!important;top:auto!important;width:auto!important;max-width:none!important;max-height:50vh!important;overflow:auto!important;background:linear-gradient(135deg,#fff,#fff7ed)!important;border:1px solid #dbeafe!important;border-radius:20px!important;padding:10px!important;box-shadow:0 14px 34px rgba(15,23,42,.16)!important;z-index:99990!important}
.admin-shell .vt-cal-head{display:grid!important;grid-template-columns:42px 1fr 42px!important;align-items:center!important;margin-bottom:6px!important;color:#0b2d6b!important}
.admin-shell .vt-cal-head b{font-size:18px!important;font-weight:950!important;text-align:left!important}
.admin-shell .vt-cal-head button{height:36px!important;min-height:36px!important;border:0!important;border-radius:14px!important;background:#fff!important;color:#0b2d6b!important;font-size:22px!important;font-weight:950!important;box-shadow:0 6px 16px rgba(15,23,42,.05)!important;padding:0!important}
.admin-shell .vt-cal-week,.admin-shell .vt-cal-grid{display:grid!important;grid-template-columns:repeat(7,1fr)!important;gap:4px!important;text-align:center!important}
.admin-shell .vt-cal-week span{font-size:12px!important;font-weight:950!important;color:#0b2d6b!important;padding:5px 0!important}
.admin-shell .vt-cal-day{height:34px!important;min-height:34px!important;border:0!important;border-radius:12px!important;background:#fff!important;color:#111827!important;font-size:13px!important;font-weight:950!important;padding:0!important;box-shadow:none!important}
.admin-shell .vt-cal-day.muted{color:#94a3b8!important}.admin-shell .vt-cal-day.today{background:#eff6ff!important;color:#2563eb!important}.admin-shell .vt-cal-day.selected{background:#eff6ff!important;color:#2563eb!important;border:2px solid #2563eb!important}
.admin-shell .vt-cal-footer{width:100%!important;border:1px solid #dbeafe!important;background:#f8fbff!important;color:#2563eb!important;border-radius:14px!important;margin-top:8px!important;padding:9px!important;font-size:13px!important;font-weight:950!important}
@media(max-width:720px){
.admin-shell .vt-custom-select.open .vt-custom-select-menu{display:grid!important;position:fixed!important;left:12px!important;right:12px!important;bottom:76px!important;top:auto!important;width:auto!important;max-width:none!important;max-height:34vh!important;overflow:auto!important;padding:8px!important;border-radius:18px!important;z-index:99990!important;gap:5px!important;background:#fff!important;border:1px solid #dbeafe!important;box-shadow:0 14px 30px rgba(15,23,42,.15)!important}
.admin-shell .vt-custom-select-item{min-height:34px!important;height:auto!important;padding:8px 10px!important;border-radius:12px!important;font-size:12px!important;line-height:1.12!important;font-weight:900!important;white-space:normal!important;word-break:break-word!important;text-align:left!important;background:#f8fafc!important;color:#0f172a!important;box-shadow:none!important}
.admin-shell .vt-custom-select-btn{overflow:hidden!important}.admin-shell .vt-custom-select-btn span{display:block!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;max-width:calc(100% - 22px)!important}
}
@media(min-width:721px){.admin-shell .vt-date-picker.open .vt-cal-menu{position:absolute!important;left:auto!important;right:0!important;bottom:calc(100% + 8px)!important;width:330px!important;max-height:420px!important}.admin-shell .vt-custom-select.open .vt-custom-select-menu{left:auto!important;right:0!important;width:300px!important;max-height:280px!important;overflow:auto!important}}
`;
