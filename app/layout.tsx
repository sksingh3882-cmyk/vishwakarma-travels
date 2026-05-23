import type { Metadata, Viewport } from "next";
import AppMenu from "./components/AppMenu";
import "../compact-booking.css";
import "../ui-banner-override.css";

const siteUrl = "https://vishwakarma-travels-nine.vercel.app";
const previewImage = `${siteUrl}/Vishwakarma.jpg`;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Vishwakarma Travels | Cab Booking Service Jamshedpur",
  description:
    "Book Desire, Ertiga and Innova Crysta for one way drop, airport drop and local travel in Jamshedpur.",
  openGraph: {
    title: "Vishwakarma Travels",
    description: "Travel Made Easy | Cab Booking Service in Jamshedpur",
    url: siteUrl,
    siteName: "Vishwakarma Travels",
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 630,
        alt: "Vishwakarma Travels - Travel Made Easy",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vishwakarma Travels",
    description: "Travel Made Easy | Cab Booking Service in Jamshedpur",
    images: [previewImage],
  },
};

const customerSyncScript = `
(function(){
  var supabaseUrl=${JSON.stringify(supabaseUrl)};
  var supabaseKey=${JSON.stringify(supabaseKey)};
  function cleanPhone(v){var p=String(v||'').replace(/\D/g,'');if((p.indexOf('91')===0||p.indexOf('0')===0)&&p.length>10)p=p.slice(-10);return p.slice(-10)}
  function text(el){return el && el.textContent ? el.textContent.trim() : ''}
  function inputByPlaceholder(form,word){var all=form.querySelectorAll('input');for(var i=0;i<all.length;i++){var p=(all[i].placeholder||'').toLowerCase();if(p.indexOf(word)>=0)return all[i]}return null}
  function saveCustomerRequest(){
    try{
      if(!supabaseUrl||!supabaseKey)return;
      var form=document.getElementById('booking-form');
      if(!form)return;
      var name=(inputByPlaceholder(form,'your name')||{}).value||'';
      var mobile=cleanPhone((inputByPlaceholder(form,'mobile')||{}).value||'');
      var pickup=(inputByPlaceholder(form,'pickup')||{}).value||'';
      var drop=(inputByPlaceholder(form,'drop')||{}).value||'';
      var hidden=form.querySelectorAll('input[type="hidden"]');
      var requiredReadonly=form.querySelectorAll('input[readonly][required]');
      var service=(hidden[0]||{}).value||'';
      var vehicle=(hidden[1]||{}).value||'';
      var journeyDate=(requiredReadonly[0]||{}).value||'';
      var journeyTime=(requiredReadonly[1]||{}).value||'';
      if(!name||!mobile)return;
      var payload={name:name,mobile:mobile,address:pickup,drop_location:drop,service:service,vehicle_type:vehicle,vehicle_model:vehicle,journey_date:journeyDate,journey_time:journeyTime};
      fetch(supabaseUrl+'/rest/v1/customers?on_conflict=mobile',{method:'POST',headers:{apikey:supabaseKey,Authorization:'Bearer '+supabaseKey,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(payload)}).catch(function(e){console.log('customer request sync failed',e)});
    }catch(e){console.log('customer request sync skipped',e)}
  }
  document.addEventListener('click',function(e){var label=text(e.target);if(label.indexOf('Confirm')>-1||label.indexOf('Send Booking Request')>-1){setTimeout(saveCustomerRequest,150)}},true);
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppMenu />
        {children}
        <script dangerouslySetInnerHTML={{ __html: customerSyncScript }} />
      </body>
    </html>
  );
}
