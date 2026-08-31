import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/products";
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

const title = "NumeraSheets — spreadsheet templates that do the math for you";
const description =
  "Nine Excel and Google Sheets workbooks that calculate, flag and total on their own, plus a Notion template that does the same. Instant download, no macros, no subscription.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    "notion template",
    "assignment tracker",
  ],
  authors: [{ name: "NumeraSheets" }],
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "NumeraSheets",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: { canonical: SITE_URL },
  // Proves to Pinterest that we own this domain, so Pins linking here are
  // attributed to the NumeraSheets account and report per-Pin analytics.
  verification: {
    other: { "p:domain_verify": "c5a980820f5face6bc6c73e484bb766a" },
    // Token publico do Search Console: aparece no HTML para qualquer visitante,
    // entao versiona-lo nao expoe nada. Nao remover depois de verificado -- o
    // Google reconfere periodicamente e a propriedade cai se a tag sumir.
    google: "lqhciSQPtUNdh3d7rm58pBCr5Y2p2KmjFgfIl1mKoRA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        {children}
        {/* Sem isto o projeto nao reporta visita nenhuma, e a medicao de
            trafego do site fica cega -- era o caso ate 31/08/2026. */}
        <Analytics />
      </body>
    </html>
  );
}
