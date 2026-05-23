export default function AdminCalendarStyle() {
  return <style>{css}</style>;
}

const css = `
.admin-shell header{margin-bottom:12px!important}
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
.admin-shell main{padding:8px!important}
.admin-shell header{margin-bottom:10px!important;padding:14px 12px!important;border-radius:22px!important}
.admin-shell header p{margin:5px 0 10px!important}
.admin-shell input,.admin-shell select,.admin-shell .vt-custom-select-btn{min-height:38px!important;height:38px!important;border-radius:13px!important;font-size:13px!important;padding-left:12px!important;padding-right:10px!important}
.admin-shell form>div:first-of-type{gap:7px!important}
.admin-shell .vt-picker.open .vt-picker-menu{bottom:76px!important}
.admin-shell .vt-time-picker.open .vt-time-menu{bottom:76px!important;max-height:42vh!important;padding:8px!important;border-radius:18px!important}
.admin-shell .vt-time-head{padding:2px 6px!important;font-size:16px!important;margin-bottom:6px!important}
.admin-shell .vt-time-close{width:28px!important;height:28px!important;min-height:28px!important;padding:0!important;font-size:18px!important}
.admin-shell .vt-time-grid{grid-template-columns:repeat(4,1fr)!important;gap:5px!important}
.admin-shell .vt-time-slot{height:34px!important;min-height:34px!important;padding:0 2px!important;font-size:11px!important;border-radius:12px!important}
.admin-shell .vt-custom-row{position:sticky!important;bottom:0!important;background:#fff!important;grid-template-columns:auto 1fr 1fr 1fr auto!important;gap:4px!important;padding:6px 0 0!important;margin-top:5px!important;font-size:11px!important}
.admin-shell .vt-custom-row select{height:30px!important;min-height:30px!important;font-size:11px!important;border-radius:10px!important}
.admin-shell .vt-custom-row button{height:30px!important;min-height:30px!important;padding:0 8px!important;font-size:11px!important;border-radius:10px!important}
.admin-shell .vt-custom-select.open .vt-custom-select-menu{display:grid!important;position:fixed!important;left:12px!important;right:12px!important;bottom:76px!important;top:auto!important;width:auto!important;max-width:none!important;max-height:30vh!important;overflow:auto!important;padding:7px!important;border-radius:16px!important;z-index:99990!important;gap:4px!important;background:#fff!important;border:1px solid #dbeafe!important;box-shadow:0 14px 30px rgba(15,23,42,.15)!important}
.admin-shell .vt-custom-select-item{min-height:32px!important;height:auto!important;padding:7px 10px!important;border-radius:11px!important;font-size:11.5px!important;line-height:1.1!important;font-weight:900!important;white-space:normal!important;word-break:break-word!important;text-align:left!important;background:#f8fafc!important;color:#0f172a!important;box-shadow:none!important}
.admin-shell .vt-custom-select-btn{overflow:hidden!important}.admin-shell .vt-custom-select-btn span{display:block!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;max-width:calc(100% - 22px)!important}
}
@media(min-width:721px){.admin-shell .vt-date-picker.open .vt-cal-menu{position:absolute!important;left:auto!important;right:0!important;bottom:calc(100% + 8px)!important;width:330px!important;max-height:420px!important}.admin-shell .vt-custom-select.open .vt-custom-select-menu{left:auto!important;right:0!important;width:300px!important;max-height:280px!important;overflow:auto!important}}
`;
