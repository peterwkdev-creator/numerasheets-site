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
const agora = new Date();
const p2 = (n: number) => String(n).padStart(2, "0");

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // O dia do build, para as calculadoras hidratarem sem divergir (`lib/hoje.ts`).
  // `DIA_DO_BUILD=2026-08-15 npm run build` simula um build antigo: é como se
  // prova que a página aberta noutro dia não dá o erro #418.
  env: {
    NEXT_PUBLIC_DIA_DO_BUILD:
      process.env.DIA_DO_BUILD ??
      `${agora.getFullYear()}-${p2(agora.getMonth() + 1)}-${p2(agora.getDate())}`,
  },
};

export default nextConfig;
