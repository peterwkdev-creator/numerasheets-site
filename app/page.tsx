import Image from "next/image";
import { faqs, listingUrl, products, SHOP_URL } from "@/lib/products";

const differences = [
  {
    n: "01",
    h: "The arithmetic is already written",
    p: "Statuses, countdowns, totals and percentages are formulas, not columns you fill in. Blank rows stay blank instead of filling a thousand lines with zeroes and false “Overdue” flags.",
  },
  {
    n: "02",
    h: "Real screenshots, never mockups",
    p: "Every picture on every listing is a render of the actual workbook after it recalculated. Nothing is drawn, staged or generated. What is in the images is what opens on your machine.",
  },
  {
    n: "03",
    h: "A guide, not a mystery",
    p: "Each download carries a Start Here PDF, the empty workbook, and a worked example filled with made-up data — so you can see the file working before you type anything into it.",
  },
];

const steps = [
  { n: "1", h: "Buy on Etsy", p: "Checkout happens on Etsy, with their buyer protection. No account to create here." },
  { n: "2", h: "Download instantly", p: "The files are released the moment payment clears. Nothing to wait for, nobody to message." },
  { n: "3", h: "Open and start", p: "Excel, Excel for Mac, or import into Google Sheets. Set a couple of cells and it runs." },
];

const SITE_URL = "https://numerasheets.vercel.app";

/**
 * Organization + WebSite, and deliberately NOT Product/Offer.
 *
 * Google splits product markup in two: "merchant listings" for pages where the
 * customer can buy from you, and "product snippets" for pages where they
 * can't. Nobody buys here — every card leaves for Etsy — so an Offer with a
 * price and InStock availability on this page would assert something untrue.
 *
 * ItemList was no better: a host carousel has to link to detail pages on the
 * same site (ours are on etsy.com), and Product isn't one of the types
 * carousels support (Course list, Movie, Recipe, Restaurant). It produced no
 * rich result at all.
 *
 * What is left is what is actually true and actually useful: who this brand is
 * and where else it lives, which is what entity understanding and AI answers
 * feed on.
 */
export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "NumeraSheets",
        url: SITE_URL,
        logo: `${SITE_URL}/mark.png`,
        description:
          "Excel and Google Sheets templates that calculate, flag and total on their own. Sold as instant downloads on Etsy.",
        sameAs: [SHOP_URL, "https://www.pinterest.com/numerasheets/"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "NumeraSheets",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <a
        href="#templates"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-white"
      >
        Skip to the templates
      </a>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-rule/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <Image
              src="/mark.png"
              alt=""
              aria-hidden
              width={128}
              height={128}
              priority
              className="h-8 w-8 rounded-[7px]"
            />
            <span className="text-[17px] font-semibold tracking-[-0.02em]">
              NumeraSheets
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-[14.5px] text-ink-soft md:flex">
            <a className="transition-colors hover:text-ink" href="#templates">
              Templates
            </a>
            <a className="transition-colors hover:text-ink" href="#how">
              How it works
            </a>
            <a className="transition-colors hover:text-ink" href="#faq">
              FAQ
            </a>
          </nav>

          <a
            href={SHOP_URL}
            className="rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-ink-deep sm:px-5"
          >
            Visit the shop
          </a>
        </div>
      </header>

      <main id="top">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-ink text-paper">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "76px 44px",
              maskImage:
                "radial-gradient(120% 90% at 78% 12%, #000 15%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(120% 90% at 78% 12%, #000 15%, transparent 72%)",
            }}
          />

          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
            <p className="t-label text-gold">Digital spreadsheet templates</p>

            <h1 className="t-display mt-5 max-w-4xl text-balance">
              Spreadsheet templates that do the math for you.
            </h1>

            <p className="t-lede mt-6 max-w-2xl text-paper/72">
              Eight Excel and Google Sheets workbooks that calculate, flag and
              total on their own. You type what happened; the file works out
              what it means.
            </p>

            {/* Formula bar: what these templates actually contain. */}
            <div className="mt-9 max-w-xl overflow-hidden rounded-xl border border-white/14 bg-white/[0.055]">
              <div className="flex items-stretch">
                <span
                  aria-hidden
                  className="grid w-12 shrink-0 place-items-center border-r border-white/14 font-mono text-[13px] italic text-paper/45"
                >
                  fx
                </span>
                <code className="overflow-x-auto whitespace-nowrap px-4 py-3 font-mono text-[12.5px] leading-6 text-gold sm:text-[13.5px]">
                  =IF(TODAY()&gt;$D2,&quot;Overdue&quot;,&quot;On track&quot;)
                </code>
              </div>
            </div>
            <p className="mt-3 text-[13.5px] text-paper/50">
              Already written, in every file. You never see it unless you look.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={SHOP_URL}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-[15px] font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                Browse the shop on Etsy
                <span aria-hidden>→</span>
              </a>
              <a
                href="#templates"
                className="inline-flex items-center justify-center rounded-full border border-white/22 px-7 py-3.5 text-[15px] font-medium text-paper transition-colors hover:bg-white/8"
              >
                See all eight
              </a>
            </div>
          </div>

          {/* Trust strip */}
          <div className="relative border-t border-white/12">
            <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-y-4 px-5 py-5 text-[13px] text-paper/62 sm:px-8 lg:grid-cols-4">
              {[
                "Instant download",
                "Excel + Google Sheets",
                "No macros, no sign-up",
                "Buy once, keep forever",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── What makes them different ────────────────────────── */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <h2 className="t-section max-w-2xl text-balance">
            A template is only worth paying for if it does something you would
            otherwise do by hand.
          </h2>

          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {differences.map((d) => (
              <div key={d.n} className="border-t-2 border-ink pt-5">
                <span className="t-label text-slate">{d.n}</span>
                <h3 className="mt-3 text-[19px] font-semibold leading-snug tracking-[-0.015em]">
                  {d.h}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
                  {d.p}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── The catalogue ───────────────────────────────────── */}
        <section id="templates" className="scroll-mt-16 bg-cool py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div>
                <p className="t-label text-slate">The catalogue</p>
                <h2 className="t-section mt-3">Eight workbooks</h2>
              </div>
              <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
                Every one of them is sold on Etsy, delivered instantly, and
                priced between six and nine dollars.
              </p>
            </div>

            <ul className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <li key={p.id}>
                  <a
                    href={listingUrl(p.id)}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-white transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_44px_-18px_rgba(27,35,51,0.34)]"
                  >
                    <span
                      aria-hidden
                      className="h-1 w-full shrink-0"
                      style={{ backgroundColor: p.accent }}
                    />

                    <div className="relative aspect-square overflow-hidden bg-cool">
                      <Image
                        src={p.shot}
                        alt={`${p.name} — screenshot of the actual workbook`}
                        width={900}
                        height={900}
                        sizes="(min-width: 1024px) 22rem, (min-width: 640px) 44vw, 90vw"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.028]"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.015em]">
                          {p.name}
                        </h3>
                        <span className="shrink-0 font-mono text-[15px] font-medium">
                          ${p.price}
                        </span>
                      </div>

                      <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">
                        {p.does}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        <span
                          className="rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.09em]"
                          style={{
                            color: p.accent,
                            backgroundColor: `${p.accent}15`,
                          }}
                        >
                          {p.standout}
                        </span>
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-cool px-2.5 py-1 text-[11.5px] text-slate"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <span
                        className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium"
                        style={{ color: p.accent }}
                      >
                        View on Etsy
                        <span
                          aria-hidden
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────── */}
        <section id="how" className="scroll-mt-16 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="t-label text-slate">How it works</p>
            <h2 className="t-section mt-3 max-w-2xl text-balance">
              Three steps, and none of them involve waiting for me.
            </h2>

            <ol className="mt-12 grid gap-8 sm:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span
                    aria-hidden
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-mono text-[14px] text-gold"
                  >
                    {s.n}
                  </span>
                  <div>
                    <h3 className="text-[17px] font-semibold tracking-[-0.015em]">
                      {s.h}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                      {s.p}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <section id="faq" className="scroll-mt-16 bg-cool py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="t-label text-slate">Questions</p>
              <h2 className="t-section mt-3">Before you buy</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                If something here is not answered, the Start Here PDF inside
                every download goes considerably deeper.
              </p>
            </div>

            <div className="faq divide-y divide-rule border-y border-rule">
              {faqs.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 text-[16px] font-medium leading-snug">
                    {f.q}
                    <span
                      aria-hidden
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-rule text-[15px] leading-none text-slate transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl pr-10 text-[14.5px] leading-relaxed text-ink-soft">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing CTA ─────────────────────────────────────── */}
        <section className="bg-ink py-20 text-paper sm:py-24">
          <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
            <h2 className="t-section mx-auto max-w-2xl text-balance">
              Everything is on Etsy, and everything downloads immediately.
            </h2>
            <p className="t-lede mx-auto mt-5 max-w-xl text-paper/70">
              Buyer protection, instant delivery, and no account to create with
              me.
            </p>
            <a
              href={SHOP_URL}
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-[15px] font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              Open the NumeraSheets shop
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-rule py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 text-[13.5px] text-slate sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} NumeraSheets. Templates are sold and
            delivered through Etsy.
          </p>
          <a className="transition-colors hover:text-ink" href={SHOP_URL}>
            numerasheets.etsy.com
          </a>
        </div>
      </footer>
    </>
  );
}
