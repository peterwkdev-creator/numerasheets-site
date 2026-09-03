import type { NextConfig } from "next";

import { SITE_URL } from "./lib/products";

/**
 * O host `.vercel.app` continua no ar depois de apontar o domínio próprio, e
 * serve o site inteiro com 200 — medido em 03/09/2026, doze cartões e tudo.
 * Isso é conteúdo duplicado: duas URLs diferentes com a mesma página.
 *
 * A Vercel recomenda TRÊS medidas juntas, e elas não são redundantes — cada
 * uma cobre um host que as outras não alcançam:
 *
 *   1. `canonical` apontando para o domínio próprio.
 *      **Já existia** e não é preciso mexer: `SITE_URL` é absoluto, então
 *      `alternates.canonical` no `app/layout.tsx` e nas páginas de produto
 *      emite `https://numerasheets.com/...` mesmo quando a página é servida
 *      pelo `.vercel.app`. Conferido na tela antes de escrever isto.
 *
 *   2. `X-Robots-Tag: noindex` em TODO host `.vercel.app`.
 *      A rede é larga de propósito: ela cobre os **deploys de preview**
 *      (`<projeto>-<hash>-<slug>.vercel.app`), que o redirecionamento abaixo
 *      deliberadamente NÃO pega.
 *
 *   3. Redirecionamento permanente, e **só do alias de produção**
 *      (`numerasheets.vercel.app`). Redirecionar `*.vercel.app` inteiro
 *      mandaria todo preview para produção e tornaria impossível revisar uma
 *      branch antes de publicar — o remédio seria pior que a doença.
 *
 * Correção de 03/09/2026: este comentário dizia que no host de produção o
 * `X-Robots-Tag` "nunca chega a ser lido" porque o redirecionamento acontece
 * antes. **Medido, e é falso** — o header vem junto na própria resposta 308.
 * A conclusão prática continua valendo (a rede larga existe pelos previews),
 * mas pelo motivo certo: no alias de produção o header é redundante, não
 * inalcançável.
 *
 * Efeito colateral aceito: a propriedade `numerasheets.vercel.app` no Search
 * Console é verificada por meta tag, e com o 308 o Google deixa de conseguir
 * lê-la — a propriedade perde a verificação numa reconferência. É obsoleta de
 * qualquer jeito; quem quiser um retrato de quantas URLs estavam indexadas ali
 * precisa tirar ANTES de publicar isto.
 */
const HOST_VERCEL_PRODUCAO = "numerasheets.vercel.app";
// Qualquer subdomínio de vercel.app, incluindo os hosts de preview.
const QUALQUER_HOST_VERCEL = "(?<hostVercel>.*\\.vercel\\.app)";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:caminho*",
        has: [{ type: "host", value: HOST_VERCEL_PRODUCAO }],
        destination: `${SITE_URL}/:caminho*`,
        // 308. Temporário (307) diria ao Google para manter a URL antiga
        // indexada, que é exatamente o oposto do que se quer aqui.
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:caminho*",
        has: [{ type: "host", value: QUALQUER_HOST_VERCEL }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;
