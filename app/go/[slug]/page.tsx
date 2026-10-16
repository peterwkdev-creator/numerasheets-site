import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  SHOP_GO_SLUG,
  SHOP_NAME,
  SHOP_URL,
  listingUrl,
  products,
} from "@/lib/products";

/**
 * A ponte entre o botao de compra e a loja.
 *
 * O Cloudflare Web Analytics conta pagina vista, nao evento: ate 15/10/2026 o
 * clique que saia do site para a Etsy nao deixava rastro, e a Etsy junta o que
 * chega dele com o acesso direto (`Etsy/TRAFEGO-DE-FORA-2026-10-15.md`). Cada
 * botao de compra aponta para `/go/<slug>`, que e uma pagina propria: o painel
 * conta a visita e a pagina segue para a loja. Fica fora do indice e do
 * sitemap; o JSON-LD do produto segue com o `listingUrl` direto.
 */

// Segundos ate seguir: o tempo de o beacon do Cloudflare mandar a visita. A
// prova so vem depois do deploy (um clique nosso, a contagem no dia seguinte).
const ESPERA = 1;

type Params = { params: Promise<{ slug: string }> };

const destino = (slug: string) => {
  if (slug === SHOP_GO_SLUG) return { url: SHOP_URL, nome: "the NumeraSheets shop" };
  const p = products.find((x) => x.slug === slug);
  return p ? { url: listingUrl(p), nome: `the ${p.name}` } : undefined;
};

export function generateStaticParams() {
  return [{ slug: SHOP_GO_SLUG }, ...products.map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!destino(slug)) return {};
  return {
    title: `Opening ${SHOP_NAME}…`,
    robots: { index: false, follow: false },
    // O layout poe a home como canonica em toda pagina; aqui nao ha o que
    // indexar, e uma canonica apontando para a home so confundiria.
    alternates: { canonical: null },
  };
}

export default async function Go({ params }: Params) {
  const { slug } = await params;
  const d = destino(slug);
  if (!d) notFound();

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <meta httpEquiv="refresh" content={`${ESPERA};url=${d.url}`} />
      <p className="text-center text-[16px] leading-relaxed text-slate">
        Opening {d.nome} on {SHOP_NAME}…{" "}
        <a className="font-medium text-ink underline" href={d.url}>
          Go now
        </a>
      </p>
    </main>
  );
}
