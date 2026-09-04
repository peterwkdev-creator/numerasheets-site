import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/products";

/**
 * Obrigatório com `output: "export"` (Cloudflare Pages): sem isto o Next trata
 * a rota como dinâmica e o build falha. O efeito é que `lastModified` passa a
 * ser a data do BUILD, não a da requisição — que é mais honesto de qualquer
 * jeito, porque é quando o conteúdo mudou de fato.
 */
export const dynamic = "force-static";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
