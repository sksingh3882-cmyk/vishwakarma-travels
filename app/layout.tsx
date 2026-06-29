import type { Metadata, Viewport } from "next";
import AppMenu from "./components/AppMenu";
import PublicBookingValidation from "./components/PublicBookingValidation";
import DriverDutyFloatingActions from "@/components/admin/DriverDutyFloatingActions";
import "../compact-booking.css";
import "../ui-banner-override.css";
import RegisterServiceWorker from "./RegisterServiceWorker";

const siteUrl = "https://vishwakarma-travels-nine.vercel.app";
const previewImage = `${siteUrl}/Vishwakarma.jpg`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Vishwakarma Travels | Cab Booking Service Jamshedpur",
  description:
      manifest: "/manifest.webmanifest",
  applicationName: "Vishwakarma Travels",
  themeColor: "#071b2d",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
       <RegisterServiceWorker />
        <AppMenu />
        <PublicBookingValidation />
        {children}
                <DriverDutyFloatingActions />
      </body>
    </html>
  );
}
