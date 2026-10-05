/**
 * As planilhas gratuitas do site: download direto, sem cadastro.
 *
 * Mesmo motivo do `lib/tools.ts`: o que se escreve à mão diverge sozinho.
 * Acrescentar um item aqui o põe no sitemap e no rodapé.
 *
 * O `.xlsx` em `public/free/` é CÓPIA do que o build gera em
 * `Products/<produto>/free/` (repositório pai). Cópia envelhece sozinha (a
 * lição das cópias do bundle, `products.md`): o `sincronizar.py` do
 * repositório pai compara as duas byte a byte.
 */
export type Freebie = {
  slug: string;
  name: string;
  /** Nome do arquivo em `public/free/`. */
  file: string;
  /** O produto pago de que ela é a versão menor. */
  productSlug: string;
  /** Rótulo curto do link, para o rodapé. */
  label: string;
  /** A frase do cartão no bloco "Free tools" da home. */
  blurb: string;
};

export const freebies: Freebie[] = [
  {
    // Criada em 05/10/2026 para a divulgação em sites de freebies de
    // homeschool (`Etsy/DIVULGACAO-CANAIS-2026-10-05.md`), que pedem link
    // para a página do material, não para a loja.
    slug: "homeschool-attendance-log",
    name: "Homeschool Attendance & Hours Log",
    file: "Homeschool-Attendance-and-Hours-Log-FREE.xlsx",
    productSlug: "homeschool-planner-spreadsheet",
    label: "Free homeschool attendance log",
    blurb:
      "Log each school day and its hours, and see both against the targets you set. A spreadsheet to download, no sign-up.",
  },
];

export const freebiePath = (f: Freebie) => `/free/${f.slug}`;
export const freebieFile = (f: Freebie) => `/free/${f.file}`;

export const freebieBySlug = (slug: string) => {
  const achado = freebies.find((f) => f.slug === slug);
  if (!achado) {
    throw new Error(
      `lib/freebies: nao achei \`${slug}\`. Se o slug mudou, atualizar a pagina ` +
        "que o chama.",
    );
  }
  return achado;
};
