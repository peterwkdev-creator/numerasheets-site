import Link from "next/link";
import CardShot from "@/components/CardShot";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import SheetPreview, { type PreviewData } from "@/components/SheetPreview";
import heroSheet from "@/lib/previews/debt-hero.json";
import { freebiePath, freebies } from "@/lib/freebies";
import { grupos } from "@/lib/grupos";
import { toolPath, tools } from "@/lib/tools";
import {
  acentoTexto,
  faqs,
  cardShot,
  hoverShot,
  maxPrice,
  minPrice,
  ProductCountWord,
  productCountWord,
  productPath,
  bundle,
  separately,
  SHOP_NAME,
  SHOP_URL,
  SITE_URL,
  SpreadsheetCountWord,
  spreadsheetCountWord,
} from "@/lib/products";

const differences = [
  {
    n: "01",
    h: "The arithmetic is already written",
    p: "Statuses, countdowns, totals and percentages are formulas, not columns you fill in. Blank rows stay blank instead of filling a thousand lines with zeroes and false “Overdue” flags.",
  },
  {
    n: "02",
    h: "Real screenshots, never mockups",
    p: "Every picture on every product page is a render of the real thing after it calculated — the actual workbook, or the actual published Notion page. Nothing is drawn, staged or generated.",
  },
  {
    n: "03",
    h: "A guide, not a mystery",
    p: "Every download carries a Start Here PDF. The spreadsheets add the empty workbook and a worked example filled with made-up data; the Notion template arrives already filled with one — so you see it working before you type anything.",
  },
];

const steps = [
  { n: "1", h: `Buy on ${SHOP_NAME}`, p: `Checkout is handled by ${SHOP_NAME}. No account to create with me.` },
  { n: "2", h: "Download instantly", p: "The files are released the moment payment clears, with nobody to message." },
  { n: "3", h: "Open and start", p: "Excel, Excel for Mac, or import into Google Sheets — or, for the Notion template, press Duplicate. Set a couple of cells and it runs." },
];


/**
 * Organization + WebSite, and deliberately NOT Product/Offer.
 *
 * Google splits product markup in two: "merchant listings" for pages where the
 * customer can buy from you, and "product snippets" for pages where they
 * can't. Nobody buys here — every card leaves for the shop — so an Offer with a
 * price and InStock availability on this page would assert something untrue.
 *
 * ItemList was no better: a host carousel has to link to detail pages on the
 * same site (ours are on the shop's domain), and Product isn't one of the types
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
          "Excel and Google Sheets templates that calculate, flag and total on their own. Sold as instant downloads.",
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

      <Header skip={{ href: "#templates", label: "Skip to the templates" }} priority />

      <main id="main">
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

          {/* Duas colunas a partir de lg. O produto tem de estar na PRIMEIRA
              dobra: o apelo visual de uma pagina e julgado em ~50 ms (Lindgaard
              et al., 2006), e ate 31/08/2026 o hero era so texto -- quem batia
              o olho nao via planilha nenhuma. Ver Etsy/DESIGN-PESQUISA.
              31rem porque a previa mede 484px + borda: com 30rem a coluna F
              passava da moldura (05/10/2026). */}
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] lg:gap-14 lg:py-28">
           <div className="min-w-0">
            <p className="t-label text-gold">Digital spreadsheet templates</p>

            <h1 className="t-display mt-5 max-w-4xl text-balance">
              Spreadsheet templates that do the math for you.
            </h1>

            <p className="t-lede mt-6 max-w-2xl text-paper/72">
              {SpreadsheetCountWord} Excel and Google Sheets workbooks that
              calculate, flag and total on their own, plus one Notion template
              that does the same. You type what happened; it works out what it
              means.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {/* O catalogo primeiro, a Etsy depois (revisao de UX, 05/10/2026):
                  o botao principal levava para fora do site antes de o
                  visitante ver produto nenhum, e o cabecalho ja tem a loja. */}
              <a
                href="#templates"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn bg-gold px-7 py-3.5 text-[15px] font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                See all {productCountWord} templates
                <span aria-hidden>↓</span>
              </a>
              <a
                href={SHOP_URL}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-btn border border-white/22 px-7 py-3.5 text-[15px] font-medium text-paper transition-colors hover:bg-white/8"
              >
                Browse the shop on Etsy
              </a>
            </div>

            {/* O preco na primeira dobra (revisao de 30/09/2026): ate aqui so
                aparecia nos cartoes, depois de rolar o hero inteiro. Os tres
                numeros saem da lista, nao da mao -- ver maxPrice. */}
            <p className="mt-5 font-mono text-[13px] text-paper/62">
              ${minPrice.toFixed(2)}–${maxPrice.toFixed(2)} each
              {bundle &&
                `, or all ${spreadsheetCountWord} spreadsheets for $${bundle.price.toFixed(2)}`}
            </p>
           </div>

           {/* A planilha, calculada de verdade. Nao e mockup nem captura: os
               valores saem do .xlsx depois de o LibreOffice recalcular, via
               Products/_shared/export_preview.py. */}
           <div className="relative min-w-0">
             <div
               aria-hidden
               className="pointer-events-none absolute -inset-10 -z-0 opacity-70"
               style={{
                 background:
                   "radial-gradient(58% 52% at 50% 44%, rgba(217,156,43,0.20), rgba(217,156,43,0) 70%)",
               }}
             />
             {/* No celular saem "Months" e "Total paid", que repetem a data e
                 a soma: com as cinco colunas a tabela rolava e cortava. */}
             <SheetPreview
               data={heroSheet as PreviewData}
               compact
               narrowHide={["C", "F"]}
               caption={null}
               className="relative z-[1]"
             />
             <p className="relative z-[1] mt-3 text-[13px] text-paper/55">
               A real dashboard from one of the workbooks, as it calculates.
               Nothing here was typed for this page.
             </p>
           </div>
          </div>

          {/* Trust strip */}
          <div className="relative border-t border-white/12">
            <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-y-4 px-5 py-5 text-[13px] text-paper/62 sm:px-8 lg:grid-cols-4">
              {[
                "Instant download",
                "Excel, Sheets + Notion",
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

        {/*
          ── RITMO VERTICAL ─────────────────────────────────────────
          As seções abaixo NÃO têm o mesmo `py` de propósito. Até
          08/09/2026 todas usavam `py-20 sm:py-24`, e espaçamento
          idêntico em tudo é um dos seis marcadores de página gerada
          por IA levantados em `Etsy/DESIGN-SITE-AI-2026-09-08.md`
          ("identical padding across all elements").

          A regra que os artigos dão é: mais largo para o que importa,
          mais apertado para o que é continuação. Daí a escada:

            14/16  argumentos  — pertencem ao hero, ficam colados nele
            24/32  catálogo    — o evento da página
            16/20  como funciona — continuação do catálogo
            14/16  FAQ         — consulta, não argumento
            20/28  fecho       — precisa de ar para aterrissar

          Uniformizar isto de novo desfaz a correção.
        */}
        {/* ── What makes them different ────────────────────────── */}
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
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
        <section id="templates" className="scroll-mt-16 bg-cool py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div>
                <p className="t-label text-slate">The catalogue</p>
                <h2 className="t-section mt-3">{ProductCountWord} templates</h2>
              </div>
              <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
                None of them costs more than ${maxPrice.toFixed(2)}, and every
                product page shows screenshots of the real file.
              </p>
            </div>

            {/* Atalhos para os grupos (lib/grupos.ts). Links de verdade: as
                etiquetas antigas dos cartoes tinham cara de botao e nao
                faziam nada (revisao de UX, 05/10/2026). */}
            <nav aria-label="Template groups" className="mt-9 flex flex-wrap gap-2">
              {grupos.map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-chip border border-rule bg-white px-4 text-[14px] font-medium text-ink transition-colors hover:border-ink/40"
                >
                  {g.name}
                  <span className="font-mono text-[12px] text-slate">
                    {g.products.length}
                  </span>
                </a>
              ))}
            </nav>

            {grupos.map((g) => (
              <div key={g.id} id={g.id} className="mt-14 scroll-mt-20">
                <h3 className="text-[19px] font-semibold tracking-[-0.015em]">
                  {g.name}
                </h3>
                <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {g.products.map((p, i) => (
                    <Reveal as="li" key={p.id} delay={(i % 3) * 90}>
                      {/*
                        O cartao aponta para a NOSSA pagina do produto, nao direto
                        para a loja. O rotulo ja dizia "View product", e a pagina
                        de produto e literalmente isso -- ate 01/09/2026 ela nao
                        existia e o link tinha de pular para a loja.
                        Custa um clique a mais antes da loja e paga em dois: as
                        paginas deixam de ser orfas (sitemap sozinho nao basta), e
                        quem chega a loja chega decidido -- e conversao e fator
                        documentado de ranqueamento na Etsy.
                      */}
                      <Link
                        href={productPath(p)}
                        className="group flex h-full flex-col overflow-hidden rounded-card border border-rule bg-white transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_44px_-18px_rgba(27,35,51,0.34)]"
                      >
                        <span
                          aria-hidden
                          className="h-1 w-full shrink-0"
                          style={{ backgroundColor: p.accent }}
                        />

                        {/* No celular, grade: miniatura ao lado do titulo e da
                           descricao, e o chip + "View product" embaixo, na largura
                           do card. Ao lado da miniatura sobravam 158 px e 9 dos 14
                           chips quebravam em duas linhas (12 com o chip a 12 px,
                           30/09/2026). O texto vira `contents` para os filhos
                           entrarem na grade. Da sm para cima, a imagem por cima,
                           como sempre foi (ver CardShot). */}
                        <div className="grid flex-1 grid-cols-[8rem_minmax(0,1fr)] grid-rows-[auto_1fr] gap-x-4 p-4 sm:flex sm:flex-col sm:gap-0 sm:p-0">
                        <CardShot
                          src={cardShot(p)}
                          hoverSrc={hoverShot(p)}
                          alt={`${p.name} — screenshot of the real thing`}
                        />

                        <div className="contents sm:flex sm:min-w-0 sm:flex-1 sm:flex-col sm:p-5">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-[17px] font-semibold leading-snug tracking-[-0.015em]">
                              {p.name}
                            </h4>
                            <span className="shrink-0 font-mono text-[15px] font-medium">
                              ${p.price.toFixed(2)}
                            </span>
                          </div>

                          <p className="mt-1.5 line-clamp-3 self-start text-[14px] leading-relaxed text-ink-soft sm:mt-2.5 sm:line-clamp-none sm:self-auto sm:text-[14.5px]">
                            {p.does}
                          </p>

                          <div className="col-span-2 mt-3 flex flex-wrap items-center gap-1.5 sm:mt-4">
                            <span
                              className="rounded-chip px-2.5 py-1 font-mono text-[12px] uppercase tracking-[0.08em]"
                              style={{
                                color: acentoTexto(p),
                                backgroundColor: `${p.accent}15`,
                              }}
                            >
                              {p.standout}
                            </span>
                          </div>

                          <span
                            className="col-span-2 mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium sm:mt-5"
                            style={{ color: acentoTexto(p) }}
                          >
                            View product
                            <span
                              aria-hidden
                              className="transition-transform duration-200 group-hover:translate-x-1"
                            >
                              →
                            </span>
                          </span>
                        </div>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}

            {/*
              O conjunto NAO entra na grade acima. Duas razoes, e as duas
              importam: a grade se chama "N templates" e o bundle nao e um
              template a mais (contaria os onze duas vezes), e uma oferta de
              conjunto se vende dizendo a economia, o que um cartao igual aos
              outros nao faz. `bundle` e opcional de proposito -- se ele sair
              do catalogo, este bloco desaparece sozinho.
            */}
            {bundle && (
              <Reveal>
                <Link
                  href={productPath(bundle)}
                  className="group mt-6 flex flex-col gap-6 overflow-hidden rounded-card border border-rule bg-ink p-6 text-paper transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_-18px_rgba(27,35,51,0.44)] sm:flex-row sm:items-center sm:p-8"
                >
                  <div className="flex-1">
                    <p className="t-label text-gold">Or take the set</p>
                    <h3 className="mt-2.5 text-[22px] font-semibold leading-snug tracking-[-0.02em] sm:text-[26px]">
                      {bundle.name}
                    </h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-paper/72">
                      {bundle.does}
                    </p>
                  </div>

                  <div className="shrink-0 sm:text-right">
                    {/*
                      Sem riscado, de proposito. A regra da casa e nao usar
                      preco riscado (ver a memoria do projeto): riscado sugere
                      um preco que vigorou e caiu, e este nunca vigorou -- e a
                      soma das planilhas avulsas (`separately`, calculada do
                      catalogo), que continuam a esse preco. Dito
                      por extenso, a comparacao fica mais forte e e verdade.
                    */}
                    <p className="font-mono text-[13px] text-paper/60">
                      USD {separately.toFixed(2)} bought separately
                    </p>
                    <p className="mt-1 font-mono text-[32px] font-medium leading-none text-gold">
                      ${bundle.price.toFixed(2)}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-paper">
                      View the bundle
                      <span
                        aria-hidden
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            )}
          </div>
        </section>

        {/* ── Free tools ──────────────────────────────────────── */}
        {/* O motivo de voltar sem comprar. Ate 05/10/2026 as calculadoras e a
            planilha gratis so apareciam no rodape. Derivado de `tools` e
            `freebies`, como o rodape: item novo entra aqui sozinho. */}
        <section id="free" className="scroll-mt-16 border-b border-rule py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="t-label text-slate">Free tools</p>
            <h2 className="t-section mt-3 max-w-2xl text-balance">
              Free, with nothing to sign up for.
            </h2>

            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                ...tools.map((t) => ({
                  key: t.slug,
                  kind: "Calculator",
                  name: t.name,
                  text: t.pergunta,
                  href: toolPath(t),
                  cta: "Open the calculator",
                })),
                ...freebies.map((f) => ({
                  key: f.slug,
                  kind: "Spreadsheet",
                  name: f.name,
                  text: f.blurb,
                  href: freebiePath(f),
                  cta: "Get the free file",
                })),
              ].map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col rounded-card border border-rule bg-white p-6 transition-colors hover:border-ink/40"
                  >
                    <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-slate">
                      {item.kind}
                    </span>
                    <span className="mt-2 text-[17px] font-semibold tracking-[-0.015em]">
                      {item.name}
                    </span>
                    <span className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink-soft">
                      {item.text}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium">
                      {item.cta}
                      <span
                        aria-hidden
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────── */}
        <section id="how" className="scroll-mt-16 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="t-label text-slate">How it works</p>
            <h2 className="t-section mt-3 max-w-2xl text-balance">
              Three steps from the shop to a working file.
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
        <section id="faq" className="scroll-mt-16 bg-cool py-14 sm:py-16">
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
                <details key={f.q} className="group py-2">
                  <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-6 text-[16px] font-medium leading-snug">
                    {f.q}
                    <span
                      aria-hidden
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-rule text-[15px] leading-none text-slate transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-1 pb-2 max-w-2xl pr-10 text-[14.5px] leading-relaxed text-ink-soft">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing CTA ─────────────────────────────────────── */}
        <section className="bg-ink py-20 text-paper sm:py-28">
          <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
            <h2 className="t-section mx-auto max-w-2xl text-balance">
              Find the one that does your math.
            </h2>
            <p className="t-lede mx-auto mt-5 max-w-xl text-paper/70">
              Buyer protection, and no account to create with me.
            </p>
            <a
              href={SHOP_URL}
              className="mt-9 inline-flex items-center gap-2 rounded-btn bg-gold px-8 py-3.5 text-[15px] font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              Open the NumeraSheets shop
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
