import type { Metadata } from "next";
import AppMenu from "./components/AppMenu";
import "./compact-booking.css";

const siteUrl = "https://vishwakarma-travels-nine.vercel.app";
const previewImage = `${siteUrl}/Vishwakarma.jpg`;

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
      </body>
    </html>
  );
}
