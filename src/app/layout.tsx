import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gearup-frontend.vercel.app"),
  title: {
    default: "GearUp | Rent Sports & Outdoor Gear Instantly",
    template: "%s | GearUp Marketplace",
  },
  description:
    "GearUp is a premier sports & outdoor equipment rental platform. Rent verified camping, cycling, water sports, and athletic gear from trusted providers near you.",
  keywords: [
    "sports gear rental",
    "outdoor equipment rental",
    "camping gear rental",
    "kayak rental",
    "mountain bike rental",
    "GearUp marketplace",
  ],
  authors: [{ name: "GearUp Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gearup-frontend.vercel.app",
    siteName: "GearUp Sports Rental Marketplace",
    title: "GearUp | Rent Sports & Outdoor Gear Instantly",
    description:
      "Browse top-quality outdoor, camping, and athletic equipment from trusted providers near you.",
    images: [
      {
        url: "/main_logo.svg",
        width: 1200,
        height: 630,
        alt: "GearUp Sports & Outdoor Rental Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GearUp | Rent Sports & Outdoor Gear Instantly",
    description:
      "Browse top-quality outdoor, camping, and athletic equipment from trusted providers near you.",
    images: ["/main_logo.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
