import type { MetadataRoute } from "next";

import { SITE_URL, products, productUrl } from "@/lib/products";
import { toolUrl, tools } from "@/lib/tools";

/**
 * Obrigatório com `output: "export"` (Cloudflare Pages): sem isto o Next trata
 * a rota como dinâmica e o build falha.
 *
 * Sem `lastModified` de propósito (02/10/2026). Era `new Date()`, ou seja a data
 * do build em TODAS as URLs: qualquer push, até um que só mexe numa página,
 * declarava todas como alteradas. O Google só usa `lastmod` quando ele é
 * "consistentemente e verificavelmente correto"; um valor que muda junto em
 * tudo ensina o contrário. Sem data honesta por página, nenhuma data.
 */
export const dynamic = "force-static";

/**
 * Ate 01/09/2026 este arquivo listava DUAS URLs para um catalogo de dez
 * produtos, porque so existiam duas paginas. As paginas de produto sao
 * derivadas de `products`, nao escritas a mao: acrescentar um produto ao
 * catalogo passa a entrar no sitemap sozinho, que e a mesma licao do
 * `productCountWord` (o que se escreve a mao diverge sozinho).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    // Derivado de `lib/tools.ts` pelo mesmo motivo dos produtos: ate 08/09/2026
    // esta URL era cravada, e a segunda ferramenta teria nascido fora do
    // sitemap sem quebrar build nenhum.
    ...tools.map((t) => ({
      url: toolUrl(SITE_URL, t),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: productUrl(p),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
