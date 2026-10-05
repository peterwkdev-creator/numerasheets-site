import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { freebiePath, freebies } from "@/lib/freebies";
import { toolPath, tools } from "@/lib/tools";

/*
  Ate 05/10/2026 o 404 era o padrao do Next: sem marca e sem caminho de volta.
  Pin antigo e link velho caem aqui, e quem chega precisa de uma saida.
  No export estatico vira `out/404.html`, que a Cloudflare Pages serve sozinha.
*/
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        <p className="font-mono text-[13px] text-slate">404</p>
        <h1 className="t-display mt-3 max-w-3xl text-balance">
          This page isn&apos;t here.
        </h1>
        <p className="t-lede mt-5 max-w-2xl text-ink-soft">
          The link may be old, or the page may have moved. Everything that is
          on the site is one click away from here.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/#templates"
            className="inline-flex justify-center rounded-btn bg-ink px-6 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-ink/90"
          >
            See all the templates
          </Link>
        </div>

        <h2 className="mt-16 text-[15px] font-semibold">Free tools</h2>
        <ul className="mt-3 space-y-1 text-[15px] text-ink-soft">
          {tools.map((t) => (
            <li key={t.slug}>
              <Link
                className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-ink"
                href={toolPath(t)}
              >
                {t.name}
              </Link>
            </li>
          ))}
          {freebies.map((f) => (
            <li key={f.slug}>
              <Link
                className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-ink"
                href={freebiePath(f)}
              >
                {f.label}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
