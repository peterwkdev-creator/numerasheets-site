import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  SHOP_NAME,
  SITE_URL,
  acentoTexto,
  hoverShot,
  listingUrl,
  productUrl,
  products,
  sobreAcento,
  type Product,
} from "@/lib/products";
import { productPages } from "@/lib/productPages";

/**
 * A pagina propria de cada produto.
 *
 * Existe porque em 01/09/2026 medimos a descoberta dos tres canais e o site
 * oferecia DUAS paginas para DEZ produtos: a home e uma calculadora. Nenhum
 * termo de produto tinha porta de entrada propria, e o sitemap tinha duas URLs.
 *
 * O `slug` de cada rota carrega o termo medido no Etsy Marketplace Insights
 * (`Etsy/PRICING-AUDIT.md`), nao um nome bonito -- a URL e a parte que o
 * buscador le.
 */

type Params = { params: Promise<{ slug: string }> };

const bySlug = (slug: string) => products.find((p) => p.slug === slug);

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};

  const page = productPages[p.slug];
  // A description comeca pelo que o arquivo FAZ, nao por adjetivo: e a
  // primeira frase que aparece no resultado de busca.
  const description = `${p.does} ${page.forWho}`;

  return {
    title: p.name,
    description,
    alternates: { canonical: productUrl(p) },
    openGraph: {
      title: `${p.name} — NumeraSheets`,
      description,
      url: productUrl(p),
      siteName: "NumeraSheets",
      // `type` sai daqui de proposito. O Next nao tipa `og:type="product"`, e
      // a tag de produto e injetada no corpo da pagina (o React eleva para o
      // <head>). Deixar `type: "website"` aqui emitiria DUAS `og:type`.
      images: [{ url: p.shot }],
    },
    // Sem isto o card do Twitter/X herda o `twitter` do layout, e as dez
    // paginas de produto compartilham o mesmo texto generico do site --
    // enquanto o `og:` ja vinha certo por pagina. Divergencia silenciosa:
    // so aparece quando alguem compartilha o link.
    twitter: {
      card: "summary_large_image",
      title: `${p.name} — NumeraSheets`,
      description,
      images: [p.shot],
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();

  const page = productPages[p.slug];
  const isNotion = p.tags.includes("Notion");
  const isBundle = p.kind === "bundle";

  // Aqui o Product/Offer e honesto, ao contrario da home e da calculadora:
  // esta pagina e sobre UM produto, com um preco, e o `url` da oferta aponta
  // para onde a compra acontece de verdade.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.does,
    image: `${SITE_URL}${p.shot}`,
    brand: { "@type": "Brand", name: "NumeraSheets" },
    offers: {
      "@type": "Offer",
      price: p.price.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: listingUrl(p),
      // Apontado pelo Search Console em 02/09/2026 ("Listagens do
      // comerciante"). E o UNICO dos quatro campos que ele pediu e que da
      // para preencher com verdade:
      //
      //   `aggregateRating` e `review` -- a loja tem zero venda e zero
      //     avaliacao. Preencher seria inventar avaliacao, que a politica de
      //     spam de dados estruturados do Google proibe. Resolve-se sozinho
      //     quando houver avaliacao real. **Nao preencher.**
      //   `shippingDetails` -- download digital, nao existe frete.
      //   `hasMerchantReturnPolicy` -- existe de verdade, e e esta: arquivo
      //     digital nao volta. A frase equivalente esta VISIVEL logo abaixo
      //     do botao, porque a marcacao nao pode afirmar o que o leitor nao
      //     consegue ler.
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: ["US", "CA", "GB", "AU", "NZ"],
        returnPolicyCategory:
          "https://schema.org/MerchantReturnNotPermitted",
      },
    },
  };

  // Os TRES SEGUINTES no catalogo, dando a volta -- nao os tres primeiros.
  // Com `.filter(...).slice(0, 3)` as doze paginas apontavam para os MESMOS
  // tres produtos, e os outros nove nao recebiam link interno de irmao nenhum:
  // a mesma orfandade que estas paginas existem para resolver. Rodando o
  // indice, cada produto e apontado por exatamente tres, e nenhuma pagina
  // repete a vizinhanca da outra.
  const i = products.indexOf(p);
  const others = [1, 2, 3].map((d) => products[(i + d) % products.length]);

  return (
    <>
      {/* Product Rich Pin. Medido em 03/09/2026: o Pinterest mostra preco e
          disponibilidade DENTRO do pin quando a pagina de destino traz estas
          tags, e nao ha mais processo de aprovacao -- ele sincroniza sozinho
          em ate 24 h. Ate hoje as nossas paginas emitiam `og:type=website` e
          nenhuma tag de preco, entao os 54 pins nao recebiam nada.

          Por que Open Graph e nao o JSON-LD que ja existe logo abaixo: a
          documentacao do Pinterest descreve a rota Schema.org mas **nao
          menciona suporte a JSON-LD**. O JSON-LD fica para o Google, que o le;
          estas quatro tags ficam para o Pinterest, que a doc garante ler.

          Elas vao no corpo e nao no `metadata` porque o Next nao tipa
          `og:type="product"` nem os campos `product:*`. */}
      <meta property="og:type" content="product" />
      <meta property="product:price:amount" content={p.price.toFixed(2)} />
      <meta property="product:price:currency" content="USD" />
      <meta property="og:availability" content="instock" />
      <meta property="og:brand" content="NumeraSheets" />

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

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
        <nav aria-label="Breadcrumb" className="text-[13px] text-slate">
          <a className="transition-colors hover:text-ink" href="/#templates">
            All templates
          </a>
          <span aria-hidden className="px-1.5">
            /
          </span>
          <span className="text-ink-soft">{p.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <span
              className="inline-block rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.09em]"
              style={{ color: acentoTexto(p), backgroundColor: `${p.accent}15` }}
            >
              {p.standout}
            </span>

            <h1 className="mt-4 text-[34px] font-semibold leading-[1.12] tracking-[-0.025em] sm:text-[42px]">
              {p.name}
            </h1>

            <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
              {p.does}
            </p>

            <p className="mt-3.5 text-[15.5px] leading-relaxed text-slate">
              {page.forWho}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={listingUrl(p)}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[15px] font-medium transition-transform duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: p.accent, color: sobreAcento(p) }}
              >
                Get it on {SHOP_NAME} — ${p.price.toFixed(2)}
              </a>
              <span className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-slate">
                One payment · instant download
              </span>
            </div>

            {/* Esta frase existe por dois motivos, nesta ordem: o comprador
                merece saber antes de clicar, e o dado estruturado da pagina
                (`hasMerchantReturnPolicy`) so pode afirmar o que a pagina
                mostra -- a politica do Google exige que a marcacao represente
                conteudo visivel ao leitor. Adicionada em 02/09/2026, depois de
                o Search Console apontar o campo como faltando. */}
            <p className="mt-3 text-[13.5px] leading-relaxed text-slate">
              Digital download — the files are yours as soon as you pay, so
              there are no returns. What the file does is shown above and in
              the listing photos, before you buy.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-rule bg-white">
            <span
              aria-hidden
              className="block h-1 w-full"
              style={{ backgroundColor: p.accent }}
            />
            <Image
              src={p.shot}
              alt={`${p.name} — a screenshot of the real file, not a mockup`}
              width={1200}
              height={900}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>

        <section className="mt-16 grid gap-10 sm:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-[13px] uppercase tracking-[0.09em] text-slate">
              What is inside
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {page.sheets.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-cool px-3 py-1.5 font-mono text-[12.5px] text-ink-soft"
                >
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[15px] leading-relaxed text-slate">
              {isBundle
                ? "One ZIP. Each of the eleven sits in its own folder with the workbook, a copy already filled in, the one-page guide and its own licence."
                : isNotion
                  ? "Three connected Notion databases, duplicated into your own workspace in one click."
                  : "Every tab is in one workbook. Thousands of rows are already formatted, so there is no question of what happens when you run out."}
            </p>
          </div>

          <div>
            <h2 className="text-[13px] uppercase tracking-[0.09em] text-slate">
              What it does not do
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
              {page.notDoes}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-slate">
              {isBundle
                ? "Every file opens in Excel and in Google Sheets, and each folder carries the licence that applies to it — the Debt Payoff one says the projection is an estimate, the Wedding one that deposit deadlines come from your supplier contracts."
                : isNotion
                  ? "Said here rather than after you have paid: it is a template, not a download."
                  : "It opens in Excel and in Google Sheets. No macros, nothing to install, no subscription — which is also why nothing in it can reach the internet on your behalf."}
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[13px] uppercase tracking-[0.09em] text-slate">
            A second look
          </h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-rule bg-white">
            <Image
              src={hoverShot(p)}
              alt={`${p.name} — a second screenshot of the real file`}
              width={1200}
              height={900}
              className="h-auto w-full"
            />
          </div>
        </section>

        {/* A calculadora era ORFA ate 03/09/2026: estava no sitemap e nenhuma
            pagina do site apontava para ela, entao nao recebia link interno
            nenhum e so era alcancavel por quem ja soubesse a URL. Este link e
            o mais natural que existe -- mesma duvida, mesmo comprador. */}
        {p.slug === "debt-payoff-tracker" && (
          <section className="mt-16">
            <h2 className="text-[13px] uppercase tracking-[0.09em] text-slate">
              Before you start
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
              Snowball or avalanche? Both orders clear the same debts and one of
              them costs less.{" "}
              <a
                className="underline underline-offset-4 hover:text-ink"
                href="/tools/debt-snowball-vs-avalanche"
              >
                Put your own numbers in and see the difference
              </a>{" "}
              — free, in the browser, nothing to install.
            </p>
          </section>
        )}

        <section className="mt-16">
          <h2 className="text-[13px] uppercase tracking-[0.09em] text-slate">
            Other templates
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {others.map((o: Product) => (
              <li key={o.slug}>
                <a
                  href={productUrl(o)}
                  className="flex h-full flex-col rounded-xl border border-rule bg-white p-4 transition-colors hover:border-ink/25"
                >
                  <span className="text-[15px] font-semibold leading-snug tracking-[-0.015em]">
                    {o.name}
                  </span>
                  <span className="mt-1.5 text-[13.5px] leading-relaxed text-slate">
                    {o.standout}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
