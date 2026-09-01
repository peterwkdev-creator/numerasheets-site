import type { Metadata } from "next";
import Image from "next/image";
import Calculator from "./Calculator";
import SheetPreview, { type PreviewData } from "@/components/SheetPreview";
import preview from "@/lib/previews/debt-payoff.json";
import { SITE_URL, listingUrl, products } from "@/lib/products";

const title = "Debt snowball vs avalanche calculator";
const description =
  "Put your debts in and see which payoff order actually costs less, in money and in months. Free, nothing to install, nothing to sign up for.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/tools/debt-snowball-vs-avalanche` },
  openGraph: {
    title: `${title} — NumeraSheets`,
    description,
    url: `${SITE_URL}/tools/debt-snowball-vs-avalanche`,
    siteName: "NumeraSheets",
    type: "website",
  },
};

const debt = products.find((p) => p.id === "4565130836");

export default function Page() {
  // WebApplication e o tipo certo para uma ferramenta que roda na pagina.
  // Nao usamos Product/Offer aqui pelo mesmo motivo da home: nada se compra
  // nesta pagina, e afirmar um preco seria falso.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    url: `${SITE_URL}/tools/debt-snowball-vs-avalanche`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-rule/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-2.5 px-5 sm:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <Image
              src="/mark.png"
              alt=""
              aria-hidden
              width={128}
              height={128}
              className="h-8 w-8 rounded-[7px]"
            />
            <span className="text-[17px] font-semibold tracking-[-0.02em]">
              NumeraSheets
            </span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        <p className="text-[12px] uppercase tracking-[0.09em] text-slate">
          Free calculator
        </p>
        <h1 className="t-display mt-3 max-w-3xl text-balance">
          Snowball or avalanche?
        </h1>
        <p className="t-lede mt-5 max-w-2xl text-ink-soft">
          Both orders clear the same debts. One of them costs less. Put your
          numbers in and the difference shows up in money, not in advice — it
          runs in your browser and nothing is sent anywhere.
        </p>

        <div className="mt-12">
          <Calculator />
        </div>

        <section className="mt-20 grid gap-10 border-t border-rule pt-12 md:grid-cols-2">
          <div>
            <h2 className="t-section text-[1.6rem]">How the two differ</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
              <strong className="font-semibold text-ink">Snowball</strong> clears
              the smallest balance first. You see a debt disappear sooner, which
              is why people stay with it — and it usually costs a little more.
            </p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
              <strong className="font-semibold text-ink">Avalanche</strong>{" "}
              clears the highest interest rate first. It is the cheaper of the
              two whenever the rates differ, but the first win can take longer
              to arrive.
            </p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
              The maths is the same either way: interest is charged monthly on
              the balance, minimums are paid on everything, and whatever is left
              over goes to whichever debt the strategy puts first. When a debt
              clears, its minimum joins the pot — that is the snowball.
            </p>
          </div>

          <div>
            <h2 className="t-section text-[1.6rem]">What this does not do</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
              This is arithmetic, not financial advice. It assumes your rates
              and minimums stay as you typed them, that interest is charged
              monthly on the balance, and that every payment lands on time.
            </p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
              Real lenders differ: some compound daily, some recalculate the
              minimum as the balance falls, some charge fees, and promotional
              rates expire. Check the figures against your own statements before
              acting on them.
            </p>
          </div>
        </section>

        <section className="mt-20 border-t border-rule pt-12">
          <p className="text-[12px] uppercase tracking-[0.09em] text-slate">
            The spreadsheet, live
          </p>
          <h2 className="t-section mt-3 max-w-2xl text-balance text-[1.75rem]">
            This is the file, not a picture of it.
          </h2>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink-soft">
            The dashboard below is the example workbook after it calculated —
            the same five debts you can edit above, worked out by the file
            itself. Scroll it, select the numbers, check the arithmetic.
          </p>
          <SheetPreview data={preview as PreviewData} className="mt-8" />
        </section>

        {debt ? (
          <section className="mt-16 rounded-2xl bg-ink px-6 py-10 text-paper sm:px-10 sm:py-12">
            <div className="max-w-2xl">
              <p className="text-[12px] uppercase tracking-[0.09em] text-paper/60">
                The spreadsheet this came from
              </p>
              <h2 className="t-section mt-3 text-[1.75rem]">
                Keep the plan, not just the answer.
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-paper/80">
                This page runs the same month-by-month projection as the{" "}
                {debt.name}, and then forgets it. The workbook keeps it: your
                debts, both payoff orders side by side, the month each one
                clears, and a chart of the two balances falling — in a file that
                is yours, works offline, and opens in Excel or Google Sheets.
              </p>
              <a
                href={listingUrl(debt)}
                className="mt-7 inline-flex rounded-full bg-paper px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-white"
              >
                See the {debt.name} — ${debt.price.toFixed(2)}
              </a>
            </div>
          </section>
        ) : null}

        <p className="mt-14 text-[14px] text-slate">
          <a className="underline underline-offset-4 hover:text-ink" href="/">
            ← All NumeraSheets templates
          </a>
        </p>
      </main>
    </>
  );
}
