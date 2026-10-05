import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import WhatsAppChat from "@/components/WhatsAppChat";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "StayBD – Hotel & Resort Booking | Sylhet, Sreemangal, Cox's Bazar",
  description:
    "Bangladesh's premium hotel & resort booking marketplace. Find and book hotels, resorts, cottages & eco resorts in Sylhet, Sreemangal, Moulvibazar, Sunamganj and more.",
  keywords: "hotel booking bangladesh, sylhet hotel, sreemangal resort, cox's bazar hotel, resort booking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans bg-white text-gray-900 antialiased`}>
        <Providers>
          {children}
          <WhatsAppChat />
        </Providers>
      </body>
    </html>
  );
}
