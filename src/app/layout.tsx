import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";

import { BubbleCursor } from "@/components/site/bubble-cursor";
import { ContactDialogProvider } from "@/components/site/contact-dialog";
import { SupportWidget } from "@/components/site/support-widget";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rightclixs — Website Design & Development Agency",
  description:
    "Rightclixs builds custom websites, e-commerce stores and marketing programmes that drive measurable growth.",
  authors: [{ name: "Rightclixs" }],
  openGraph: { type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${instrument.variable}`}>
      <body>
        <ContactDialogProvider>{children}</ContactDialogProvider>
        <SupportWidget />
        <BubbleCursor />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
