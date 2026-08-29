import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl = "https://numerasheets.vercel.app";
const title = "NumeraSheets — spreadsheet templates that do the math for you";
const description =
  "Eight Excel and Google Sheets workbooks that calculate, flag and total on their own. Instant download, no macros, no subscription.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — NumeraSheets",
  },
  description,
  keywords: [
    "spreadsheet templates",
    "excel templates",
    "google sheets templates",
    "budget spreadsheet",
    "bookkeeping template",
    "wedding planner spreadsheet",
    "debt payoff tracker",
    "homeschool planner",
  ],
  authors: [{ name: "NumeraSheets" }],
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "NumeraSheets",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
