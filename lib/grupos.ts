import { type Product, templates } from "./products";

/**
 * Os grupos do catálogo na home, por quem compra (revisão de UX, 05/10/2026).
 *
 * Até então eram 14 cartões numa grade só, 4.494 px no celular, e as
 * etiquetas de cada cartão pareciam botões sem fazer nada. Os grupos dão a
 * cada visitante um atalho para os três ou cinco que são para ele.
 *
 * Por slug, e conferido no build: template sem grupo, em dois grupos ou slug
 * que não existe quebram aqui. Sem isso um produto novo sumiria da home em
 * silêncio, porque a grade passou a ser montada a partir dos grupos.
 */
type Grupo = { id: string; name: string; slugs: string[] };

const definicao: Grupo[] = [
  {
    id: "business",
    name: "Running a business",
    slugs: [
      "invoice-tracker-spreadsheet",
      "small-business-bookkeeping-spreadsheet",
      "cleaning-business-spreadsheet",
      "rental-property-spreadsheet",
      "project-management-spreadsheet",
    ],
  },
  {
    id: "selling",
    name: "Selling online",
    slugs: [
      "etsy-seller-spreadsheet",
      "poshmark-reseller-spreadsheet",
      "social-media-content-calendar",
    ],
  },
  {
    id: "school",
    name: "School and homeschool",
    slugs: [
      "homeschool-planner-spreadsheet",
      "assignment-tracker-spreadsheet",
      "assignment-tracker-notion-template",
    ],
  },
  {
    id: "home",
    name: "Home and life",
    slugs: [
      "debt-payoff-tracker",
      "wedding-planner-spreadsheet",
      "travel-itinerary-template",
    ],
  },
];

const porSlug = new Map(templates.map((p) => [p.slug, p]));
const vistos = new Set<string>();
for (const g of definicao)
  for (const s of g.slugs) {
    if (!porSlug.has(s)) throw new Error(`grupos: "${s}" não é um template`);
    if (vistos.has(s)) throw new Error(`grupos: "${s}" está em dois grupos`);
    vistos.add(s);
  }
for (const p of templates)
  if (!vistos.has(p.slug)) throw new Error(`grupos: "${p.slug}" está sem grupo`);

export const grupos: (Omit<Grupo, "slugs"> & { products: Product[] })[] =
  definicao.map(({ slugs, ...g }) => ({
    ...g,
    products: slugs.map((s) => porSlug.get(s)!),
  }));
