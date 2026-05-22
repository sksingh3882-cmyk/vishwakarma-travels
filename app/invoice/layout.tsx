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
.logoImg{box-shadow:none!important;border:0!important;border-radius:0!important;filter:none!important;background:transparent!important}
.top{grid-template-columns:1.2fr .9fr .9fr!important;align-items:center!important}
.top::after{content:""!important;display:block!important;justify-self:end!important;align-self:center!important;width:132px!important;height:92px!important;background:url('/cars/pdflogo.png') center/contain no-repeat!important;border:0!important;border-radius:0!important;box-shadow:none!important;filter:none!important}
.invoiceTitle{text-align:center!important}
@media screen and (max-width:720px){
  .screen{background:white!important;overflow-x:auto!important;width:100vw!important}
  .invoice{width:200mm!important;min-height:282mm!important;margin:0 auto!important;padding:4mm 7mm!important;overflow:hidden!important}
  .printBtn{right:72px!important;top:12px!important;transform:scale(.9)!important;transform-origin:top right!important}
  .top::after{width:122px!important;height:84px!important}
}
@media print{
  @page{size:letter portrait;margin:2mm!important}
  html,body{margin:0!important;padding:0!important;width:auto!important;min-height:auto!important;overflow:hidden!important}
  .screen{background:white!important;width:100%!important;min-height:auto!important;overflow:hidden!important}
  .invoice{width:176mm!important;min-height:0!important;height:auto!important;margin:0 auto!important;padding:2.5mm 5mm!important;overflow:hidden!important;page-break-after:avoid!important;break-after:avoid!important}
  .printBtn,.printBtn *,body>button,body>div[style*="position: fixed"],body>div[style*="position:fixed"]{display:none!important}
  .top::after{width:108px!important;height:76px!important;box-shadow:none!important;border-radius:0!important;filter:none!important;background:url('/cars/pdflogo.png') center/contain no-repeat!important}
}
`;
