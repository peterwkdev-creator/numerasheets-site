import type { MetadataRoute } from "next";

import { SITE_URL, products, productUrl } from "@/lib/products";

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
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/tools/debt-snowball-vs-avalanche`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...products.map((p) => ({
      url: productUrl(p),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
