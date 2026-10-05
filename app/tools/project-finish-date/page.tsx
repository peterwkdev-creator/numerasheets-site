import type { Metadata } from "next";
import Link from "next/link";
import Planner from "./Planner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SheetPreview, { type PreviewData } from "@/components/SheetPreview";
import preview from "@/lib/previews/project-management.json";
import { SITE_URL, listingUrl, requireProduct } from "@/lib/products";
import { toolBySlug, toolPath } from "@/lib/tools";

const title = "Project finish date calculator";
const description =
  "Type your tasks, say what waits for what, and see the day the plan actually lands — and how many days of slack are left against the date you promised. Free, nothing to install.";
const path = toolPath(toolBySlug("project-finish-date"));

const pm = requireProduct("project-management-spreadsheet", "tools/project-finish-date");

// A imagem do produto vizinho: sem `images` o card compartilhado saia
// sem figura nenhuma (o `openGraph` da pagina substitui o do layout).
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
    images: [{ url: pm.shot }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — NumeraSheets`,
    description,
    images: [pm.shot],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    url: `${SITE_URL}${path}`,
    applicationCategory: "BusinessApplication",
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

      <Header />

      <main id="main" className="mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        <p className="text-[12px] uppercase tracking-[0.09em] text-slate">
          Free calculator
        </p>
        <h1 className="t-display mt-3 max-w-3xl text-balance">
          When does the plan actually land?
        </h1>
        <p className="t-lede mt-5 max-w-2xl text-ink-soft">
          Most project templates draw the tasks you typed. This one works out the
          date. Say how long each task takes and what it waits for, and the
          finish date comes back — with the number of days you have left against
          the date you promised. It runs in your browser and nothing is sent
          anywhere.
        </p>

        <div className="mt-12">
          <Planner />
        </div>

        <section className="mt-20 grid gap-10 border-t border-rule pt-12 md:grid-cols-2">
          <div>
            <h2 className="t-section text-[1.6rem]">How the date is worked out</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
              Every task starts on the{" "}
              <strong className="font-semibold text-ink">later</strong> of two
              days: the day the project starts, and the day after the task it
              waits for finishes. Its finish is that start plus its duration.
            </p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
              That single rule is why a delay travels. Add five days to a task
              early in the chain and everything behind it slides — the project
              finish date moves with it, in the same second, without anyone
              editing a second cell.
            </p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
              The finish date of the project is the latest finish of any task.
              One task sets it; shortening any other changes nothing. The panel
              names which one.
            </p>
          </div>

          <div>
            <h2 className="t-section text-[1.6rem]">What this does not do</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
              A task may only wait for a task above it in the list. That is a
              real constraint, not an oversight: it is what lets the whole
              schedule compute in one pass, with no solver and no macro. Most
              plans are written that way anyway.
            </p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
              It does not resolve a network of dependencies or compute a
              critical path, and it does not know your calendar. Days are
              calendar days — weekends and holidays included. If your team works
              five days a week, plan the extra days in.
            </p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
              And it is arithmetic, not a promise. It assumes the durations you
              typed are the durations you get.
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
            The dashboard below is the example workbook after it calculated — an
            eighteen-task website relaunch, with the finish date, the slack
            against the target, and the count of people-weeks over capacity, all
            worked out by the file itself. Scroll it, select the numbers, check
            the arithmetic.
          </p>
          <SheetPreview data={preview as PreviewData} className="mt-8" />
        </section>

        <section className="mt-16 rounded-card bg-ink px-6 py-10 text-paper sm:px-10 sm:py-12">
          <div className="max-w-2xl">
            <p className="text-[12px] uppercase tracking-[0.09em] text-paper/60">
              The spreadsheet this came from
            </p>
            <h2 className="t-section mt-3 text-[1.75rem]">
              Keep the plan, not just the date.
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-paper/80">
              This page runs the same date arithmetic as the {pm.name}, and then
              forgets it. The workbook keeps it — and adds what a page cannot:
              a Gantt timeline drawn week by week from the dates it computed,
              hours by person by week with anything over capacity in red, and a
              task list that writes its own notes (“Late by 5 days”, “Waiting on
              #5”). In a file that is yours, works offline, and opens in Excel
              or Google Sheets.
            </p>
            <a
              href={listingUrl(pm)}
              className="mt-7 inline-flex rounded-btn bg-paper px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-white"
            >
              See the {pm.name} — ${pm.price.toFixed(2)}
            </a>
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
