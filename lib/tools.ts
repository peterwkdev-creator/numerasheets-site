/**
 * As calculadoras gratuitas do site.
 *
 * Existe por causa da mesma lição do `productCountWord` e do sitemap de
 * produtos: **o que se escreve à mão diverge sozinho.** Até 08/09/2026 o
 * `sitemap.ts` trazia uma única URL de ferramenta, cravada — e a segunda
 * ferramenta teria nascido fora do sitemap sem quebrar build nenhum.
 *
 * Acrescentar uma ferramenta aqui a põe no sitemap. É o único lugar a tocar.
 */
export type Tool = {
  slug: string;
  /** Título curto, para uso interno e para links entre ferramentas. */
  name: string;
  /** O termo medido no Marketplace Insights que motivou a página. */
  term: string;
  /** O produto de que ela é vizinha — a página dele ganha o link. */
  productSlug: string;
  /** Rótulo curto do link, para o rodapé. */
  label: string;
  /** A frase que abre o bloco na página do produto. */
  pergunta: string;
  /** O texto do link dentro dessa frase. */
  chamada: string;
};

export const tools: Tool[] = [
  {
    slug: "debt-snowball-vs-avalanche",
    name: "Debt snowball vs avalanche calculator",
    term: "debt payoff tracker",
    productSlug: "debt-payoff-tracker",
    label: "Debt snowball vs avalanche calculator",
    pergunta:
      "Snowball or avalanche? Both orders clear the same debts and one of them costs less.",
    chamada: "Put your own numbers in and see the difference",
  },
  {
    // Publicada em 08/09/2026. O termo foi escolhido por medição, não por
    // palpite: `project management spreadsheet` tem 328 buscas/30 dias
    // CRESCENDO 114,6%, conversão Very high, e é onde a loja acabou de ganhar
    // produto. Ver `Etsy/INSIGHTS-15-TERMOS-2026-09-07.md`.
    slug: "project-finish-date",
    name: "Project finish date calculator",
    term: "project management spreadsheet",
    productSlug: "project-management-spreadsheet",
    label: "Project finish date calculator",
    pergunta:
      "When does the plan actually land? Say how long each task takes and what it waits for, and the date works itself out.",
    chamada: "Try it with your own tasks",
  },
];

export const toolUrl = (siteUrl: string, t: Tool) => `${siteUrl}/tools/${t.slug}`;

/** A ferramenta vizinha de um produto, se houver. */
export const toolForProduct = (productSlug: string) =>
  tools.find((t) => t.productSlug === productSlug) ?? null;
