import type { NextConfig } from "next";

/**
 * Configuração para hospedagem ESTÁTICA (Cloudflare Pages), a partir de
 * 04/09/2026.
 *
 * **Por que saímos da Vercel:** as Fair Use Guidelines dizem que
 * *"Hobby teams are restricted to non-commercial personal use only"*, e a
 * definição de uso comercial inclui literalmente *"advertising the sale of a
 * product or service"* — que é o que as 13 páginas de produto fazem. Vender na
 * Etsy em vez de aqui não muda nada: a regra proíbe anunciar, não só processar.
 * Ver `Etsy/VERCEL-USO-COMERCIAL-2026-09-04.md`.
 *
 * **O que sumiu daqui, e é ganho:** este arquivo tinha 50 linhas resolvendo o
 * host `.vercel.app` duplicado — um `redirects()` para o alias de produção e um
 * `X-Robots-Tag: noindex` para os hosts de preview. Fora da Vercel **o problema
 * deixa de existir**, então o remédio sai junto. O `canonical` continua onde
 * sempre esteve (`SITE_URL` absoluto no `app/layout.tsx`), e não dependia disto.
 *
 * **`output: "export"`** é possível porque as 22 rotas são todas estáticas ou
 * SSG — nenhuma função de servidor. Conferido no build antes de escrever isto.
 *
 * **`images.unoptimized`** é obrigatório no export: o otimizador de imagem do
 * `next/image` é um serviço de servidor, e não há servidor. As imagens são
 * PNGs já dimensionados que nós mesmos geramos, então não se perde nada.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
