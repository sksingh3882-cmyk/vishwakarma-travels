import type { ReactNode } from "react";

export default function InvoiceLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <style>{css}</style>
    </>
  );
}

const css = `
.pdfLogo{display:none!important}
.top{grid-template-columns:1fr 1fr!important}
@media screen and (max-width:720px){
.screen{background:white!important;overflow-x:hidden!important;width:100vw!important}
.invoice{width:100vw!important;min-height:auto!important;margin:0!important;padding:12px 10px 28px!important;overflow:hidden!important}
.printBtn{right:72px!important;top:12px!important;transform:scale(.9)!important;transform-origin:top right!important}
.invoiceTitle{font-size:31px!important;text-align:right!important}
.detailsGrid{grid-template-columns:1fr!important;gap:8px!important}
.rightInfo{border-left:0!important;border-top:1px solid #333!important;padding-left:0!important;padding-top:8px!important}
}
@media print{.pdfLogo{display:none!important}.top{grid-template-columns:1fr 1fr!important}.printBtn{display:none!important}}
`;
