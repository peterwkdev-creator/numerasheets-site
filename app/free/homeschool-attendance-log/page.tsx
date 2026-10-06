import { statSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SheetPreview, { type PreviewData } from "@/components/SheetPreview";
import { freebieBySlug, freebieFile, freebiePath } from "@/lib/freebies";
import logRows from "@/lib/previews/free-attendance-log.json";
import summary from "@/lib/previews/free-attendance-summary.json";
import { SITE_URL, productPath, requireProduct } from "@/lib/products";

const free = freebieBySlug("homeschool-attendance-log");
const path = freebiePath(free);
const title = "Free homeschool attendance and hours log";
const description =
  "A free spreadsheet for homeschool families: log each school day and its hours, and see both against your own targets. Excel or Google Sheets, no sign-up.";

const full = requireProduct(free.productSlug, `free/${free.slug}`);

// A imagem do proprio arquivo gratis desde 06/10/2026: ate ali era a do
// planner pago, que mostrava o que nao vem no arquivo. Gerada pelo
// `make_free_promo.py` do produto, sempre em 1200x630.
const og = {
  url: "/free/homeschool-attendance-log-og.png",
  width: 1200,
  height: 630,
  alt: "The free homeschool attendance and hours log: the Log tab with sample data",
};

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}${path}` },
  openGraph: {
    title: `${title} — NumeraSheets`,
    description,
    url: `${SITE_URL}${path}`,
    siteName: "NumeraSheets",
    type: "website",
    images: [og],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — NumeraSheets`,
    description,
    images: [og],
  },
};

/*
  O tamanho sai do arquivo no build, não escrito à mão: o `.xlsx` é regerado
  pelo `build_free.py` e o número digitado ficaria velho sozinho. Se o arquivo
  faltar em `public/free/`, o build quebra aqui, antes de publicar um link 404.
*/
const kb = Math.round(statSync(join(process.cwd(), "public", freebieFile(free))).size / 1024);

const steps = [
  {
    tab: "Settings",
    text: "The date your school year starts, your children's names, and your own targets for days and hours.",
  },
  {
    tab: "Log",
    text: "One row per subject, per child, per day: date, child, subject, hours. A day with four subjects still counts as one school day.",
  },
  {
    tab: "Summary",
    text: "For each child: school days, hours, the percentage of each target, days still to go, and the last day logged.",
  },
];

const fullAdds = [
  "Hours by subject, for each child",
  "Hours by quarter of the school year",
  "Credits from subject hours, with your own hours per credit",
  "Grades and averages by subject",
  "A dashboard with charts, and a projection of when you reach your days target",
  "Up to six children",
  "A filled-in example file to explore first",
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: free.name,
    url: `${SITE_URL}${path}`,
    description,
    isAccessibleForFree: true,
    encodingFormat:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main" className="mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        <p className="text-[12px] uppercase tracking-[0.09em] text-slate">
          Free spreadsheet
        </p>
        <h1 className="t-display mt-3 max-w-3xl text-balance">
          Homeschool attendance and hours log
        </h1>
        <p className="t-lede mt-5 max-w-2xl text-ink-soft">
          Log each school day and its hours, and see both against the targets
          you set, for up to two children. It opens in Excel or Google Sheets,
          has no macros, and you don&apos;t need to sign up for anything to get
          it.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <a
            href={freebieFile(free)}
            download
            className="inline-flex justify-center rounded-btn bg-ink px-6 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-ink/90"
          >
            Download the free log (.xlsx, {kb} KB)
          </a>
          <p className="text-[14px] text-slate">
            In Google Sheets: File → Import → Upload.
          </p>
        </div>

        {/* As duas abas do exemplo, calculadas pelo LibreOffice
            (`export_preview.py --free`): texto de verdade, legivel em qualquer
            largura. Ate 06/10/2026 eram recortes PNG, e o do Log saia com 7px
            de letra num celular de 320 px. Medido de 320 a 1440 px:
            - o Summary (894px) rola de lado abaixo de `lg`, e a borda chega a
              coincidir com o fim de uma coluna (360 e 430px), sem nada
              cortado que avise; dai o aviso, so abaixo de `lg`;
            - o Log, compacto, cabe inteiro a partir de 360px; em 320 rola 34px.
            No celular as duas ganham 8px de cada lado (`-mx-3`). */}
        <section className="mt-14">
          <h2 className="sr-only">What the file looks like</h2>
          <div className="-mx-3 sm:mx-0">
            <SheetPreview
              data={summary as PreviewData}
              className="max-w-4xl"
              caption={
                <>
                  The Summary tab, calculated from sample data. The file you
                  download starts empty.
                  <span className="lg:hidden"> Scroll the table sideways to see every column.</span>
                </>
              }
            />
          </div>
        </section>

        <section className="mt-14 grid gap-12 lg:grid-cols-[24rem_1fr] lg:gap-16">
          {/* `min-w-0`: item de grid cresce ate a largura da tabela, e em 320px
              a pagina inteira transbordava 26px em vez de a tabela rolar. */}
          <div className="-mx-3 min-w-0 sm:mx-0">
            <SheetPreview
              data={logRows as PreviewData}
              compact
              className="max-w-sm"
              caption="The first rows of the Log tab in the same example: one row per subject, per child, per day."
            />
          </div>
          <div>
            <h2 className="sr-only">The three tabs</h2>
            <ol className="space-y-9">
              {steps.map((s, i) => (
                <li key={s.tab}>
                  <p className="font-mono text-[13px] text-slate">
                    {i + 1}. {s.tab}
                  </p>
                  <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">
                    {s.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-20 grid gap-10 border-t border-rule pt-12 md:grid-cols-2">
          <div>
            <h2 className="t-section text-[1.6rem]">Before you rely on it</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
              The file contains no state&apos;s rules and does not state any.
              Every target is a number you type, and the target cells start
              empty.
            </p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
              Requirements vary by place and change. If a target is wrong, the
              count will still be right and the conclusion will still be wrong,
              so check what applies where you live.
            </p>
          </div>

          <div>
            <h2 className="t-section text-[1.6rem]">What you may do with it</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
              Use it for your own family, as long as you like. Share the link
              to this page with anyone.
            </p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
              Please don&apos;t resell or redistribute the file itself, blank or
              filled in. The numbers you put in are yours.
            </p>
          </div>
        </section>

        <section className="mt-16 rounded-card bg-ink px-6 py-10 text-paper sm:px-10 sm:py-12">
          <div className="max-w-2xl">
            <p className="text-[12px] uppercase tracking-[0.09em] text-paper/60">
              The full version
            </p>
            <h2 className="t-section mt-3 text-[1.75rem]">
              A smaller version of the {full.name}.
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-paper/80">
              The free log counts days and hours. The full workbook adds:
            </p>
            <ul className="mt-4 space-y-1.5 text-[15.5px] leading-relaxed text-paper/80">
              {fullAdds.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
            <Link
              href={productPath(full)}
              className="mt-7 inline-flex rounded-btn bg-paper px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-white"
            >
              See the {full.name} — ${full.price.toFixed(2)}
            </Link>
          </div>
        </section>

        <p className="mt-14 text-[14px] text-slate">
          <Link className="underline underline-offset-4 hover:text-ink" href="/#templates">
            ← All NumeraSheets templates
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
