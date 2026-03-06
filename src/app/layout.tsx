import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { GrainOverlay } from "@/components/layout/grain-overlay";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Letters to The Void",
    template: "%s | Letters to The Void",
  },
  description:
    "Thoughts cast into the darkness. A collection of letters addressed to no one and everyone.",
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    siteName: "Letters to The Void",
    title: "Letters to The Void",
    description:
      "Thoughts cast into the darkness. A collection of letters addressed to no one and everyone.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${lora.variable}`}>
      <body className="min-h-screen bg-void text-void-text antialiased">
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}
