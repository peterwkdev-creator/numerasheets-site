import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, SpreadsheetCountWord } from "@/lib/products";
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
// A contagem sai de `products`, nao escrita a mao. O corpo da pagina ja usava
// os helpers derivados enquanto esta description cravava "Nine" -- as duas
// estavam certas em 31/08/2026 por coincidencia, e divergiriam sozinhas assim
// que um produto entrasse no catalogo.
const description =
  `${SpreadsheetCountWord} Excel and Google Sheets workbooks that calculate, ` +
  "flag and total on their own, plus a Notion template that does the same. " +
  "Instant download, no macros, no subscription.";

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
    // Tokens publicos do Search Console: aparecem no HTML para qualquer
    // visitante, entao versiona-los nao expoe nada. Nao remover depois de
    // verificado -- o Google reconfere e a propriedade cai se a tag sumir.
    //
    // Sao DOIS porque cada propriedade tem token proprio: o primeiro e da
    // propriedade antiga (numerasheets.vercel.app, que continua respondendo),
    // o segundo e de numerasheets.com. Supor que o token se reaproveita entre
    // propriedades da mesma conta esta errado -- conferido na tela.
    google: [
      "lqhciSQPtUNdh3d7rm58pBCr5Y2p2KmjFgfIl1mKoRA",
      "BZASGIYon-NPey7nFDgURfMmF3zuhGUXJ263HmeMYYE",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        {/* Os blocos revelados ao rolar comecam invisiveis e o JS os mostra.
            Sem JS isso deixaria a pagina em branco -- esta regra devolve a
            visibilidade. Fica aqui, e nao no componente, para nao repetir uma
            vez por instancia. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
        {/* Sem isto o projeto nao reporta visita nenhuma, e a medicao de
            trafego do site fica cega -- era o caso ate 31/08/2026. */}
        <Analytics />
      </body>
    </html>
  );
}
