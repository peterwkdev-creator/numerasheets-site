/**
 * Endereco canonico do site. Estava escrito a mao em quatro arquivos
 * (layout, page, robots, sitemap) -- trocar de dominio exigia acertar os
 * quatro, e esquecer um deixa canonical, OpenGraph ou sitemap apontando para
 * o lugar errado sem quebrar build nenhum. Uma constante so.
 *
 * Apex, nao www: o www redireciona para ca com 308.
 */
export const SITE_URL = "https://numerasheets.com";

const ETSY_SHOP = "https://numerasheets.etsy.com";
const PAYHIP_SHOP = "https://payhip.com/numerasheets";

/**
 * Which shop the buy buttons point at. One switch, everything follows.
 *
 * "etsy"   — conversions feed Etsy's organic ranking, and the trackable
 *            subdomain returns 4% of the fee through Share & Save.
 * "payhip" — better margin, and the storefront is ours rather than rented.
 *
 * "etsy" since 31/08/2026. Payoneer cleared its identity check, so Etsy
 * Payments can finally take an order — and a conversion there earns organic
 * ranking, which is worth more than the margin Payhip saves. Payhip stays
 * live and is one line away if Etsy ever stops being able to receive.
 */
// O `as` nao e decoracao: com anotacao simples, o TypeScript estreita o const
// pelo inicializador e toda comparacao com o OUTRO valor vira erro
// ("no overlap"). Ou seja, o interruptor so compilava na direcao em que ja
// estava. A assercao mantem o tipo largo e deixa virar nos dois sentidos.
export const BUY_ON = "etsy" as "etsy" | "payhip";

export const SHOP_URL = BUY_ON === "payhip" ? PAYHIP_SHOP : ETSY_SHOP;

/** Named in the copy, so the page never claims the wrong shop. */
export const SHOP_NAME = BUY_ON === "payhip" ? "Payhip" : "Etsy";

export type Product = {
  /** Etsy listing id. */
  id: string;
  /** Payhip product slug, the bit after /b/. */
  payhip: string;
  /**
   * Route segment of this product's own page: /templates/<slug>.
   * Carries the measured search term, because the slug is the part of the
   * URL a search engine reads.
   */
  slug: string;
  /**
   * The exact term this product's page targets, measured in Etsy Marketplace
   * Insights (`Etsy/PRICING-AUDIT.md`) -- not a guess. Kept on the product so
   * the page copy and the listing can never drift onto different terms.
   */
  term: string;
  name: string;
  /** What the workbook works out on its own — the reason it costs money. */
  does: string;
  /** The single column or behaviour that makes it worth the price. */
  standout: string;
  price: number;
  accent: string;
  shot: string;
  tags: string[];
};

/**
 * A captura que aparece no hover do cartão: a mesma base com sufixo `-2`.
 * Gerada por `Products/_shared/export_card_shots.py` a partir da segunda
 * imagem de listagem de cada produto. Derivar em vez de escrever à mão
 * garante que nenhum produto fique com o par trocado.
 */
export const hoverShot = (p: Product) => p.shot.replace(/\.png$/, "-2.png");

/** The only place a product URL is built, so no link can miss the switch. */
export const listingUrl = (p: Product) =>
  BUY_ON === "payhip"
    ? `https://payhip.com/b/${p.payhip}`
    : `${ETSY_SHOP}/listing/${p.id}`;

/** The product's own page on this site. Built in one place, like listingUrl. */
export const productUrl = (p: Product) => `${SITE_URL}/templates/${p.slug}`;

export const products: Product[] = [
  {
    id: "4564974686",
    payhip: "J5gqs",
    slug: "invoice-tracker-spreadsheet",
    term: "invoice tracker",
    name: "Invoice Tracker & Generator",
    does: "Marks an invoice overdue the moment its due date passes, then builds the printable invoice out of the row you already logged.",
    standout: "Create Invoice tab",
    price: 6.5,
    accent: "#D99C2B",
    shot: "/shots/invoice.png",
    tags: ["Freelancers", "Invoicing"],
  },
  {
    id: "4564987897",
    payhip: "dkuM9",
    slug: "rental-property-spreadsheet",
    term: "rental property spreadsheet",
    name: "Rental Property Tracker",
    does: "Reads each month's rent against what was paid and calls it Paid, Partial, Due or Late without you deciding.",
    standout: "Per-property yield",
    price: 7.5,
    accent: "#2E6F5E",
    shot: "/shots/rental.png",
    tags: ["Landlords", "Property"],
  },
  {
    id: "4565000823",
    payhip: "mR8aG",
    slug: "etsy-seller-spreadsheet",
    term: "etsy seller spreadsheet",
    name: "Seller Bookkeeping Spreadsheet",
    does: "Takes marketplace fees, shipping and cost of goods off each order, so profit is the number you actually keep.",
    standout: "Fee-by-fee breakdown",
    price: 6.5,
    accent: "#2A5D7C",
    shot: "/shots/seller.png",
    tags: ["Etsy sellers", "E-commerce"],
  },
  {
    id: "4565059738",
    payhip: "MPD82",
    slug: "social-media-content-calendar",
    term: "social media content calendar",
    name: "Social Media Content Calendar",
    does: "Counts down to each post's date, flags what is overdue, and ranks your content pillars by engagement rate.",
    standout: "Four-state flag",
    price: 4.5,
    accent: "#8E3B62",
    shot: "/shots/content.png",
    tags: ["Creators", "Marketing"],
  },
  {
    id: "4565079805",
    payhip: "j6huB",
    slug: "debt-payoff-tracker",
    term: "debt payoff tracker",
    name: "Debt Payoff Tracker",
    does: "Projects snowball and avalanche side by side, month by month, to the date each debt finally clears.",
    standout: "120-month projection",
    price: 4.5,
    accent: "#A85427",
    shot: "/shots/debt.png",
    tags: ["Personal finance", "Budgeting"],
  },
  {
    id: "4565130836",
    payhip: "yAZjb",
    slug: "wedding-planner-spreadsheet",
    term: "wedding planner spreadsheet",
    name: "Wedding Planner Spreadsheet",
    does: "Dates every checklist task backwards from your wedding day — move the date and all 22 deadlines move with it.",
    standout: "Self-dating checklist",
    price: 8.5,
    accent: "#3B4A8C",
    shot: "/shots/wedding.png",
    tags: ["Weddings", "Guest list"],
  },
  {
    id: "4565142164",
    payhip: "aDNb7",
    slug: "small-business-bookkeeping-spreadsheet",
    term: "small business bookkeeping",
    name: "Small Business Bookkeeping",
    does: "Files every entry into the right quarter from its date, and applies your own deductible percentage per category.",
    standout: "Quarter from date",
    price: 6.5,
    accent: "#55642A",
    shot: "/shots/tax.png",
    tags: ["Small business", "Tax year"],
  },
  {
    id: "4565150287",
    payhip: "XwMps",
    slug: "homeschool-planner-spreadsheet",
    term: "homeschool planner",
    name: "Homeschool Planner & Records",
    does: "Counts a day with four subjects as one school day, and tracks days and hours against both of your targets.",
    standout: "Days and hours at once",
    price: 7.5,
    accent: "#1D6A73",
    shot: "/shots/homeschool.png",
    tags: ["Homeschool", "Records"],
  },
  {
    id: "4565972670",
    payhip: "8EN4G",
    slug: "assignment-tracker-spreadsheet",
    term: "assignment tracker",
    name: "Assignment Tracker",
    does: "Divides by the weight that has actually been graded, so a final you have not sat yet never counts as a zero.",
    standout: "What you need on the final",
    price: 3,
    accent: "#6B4FA0",
    shot: "/shots/assignment.png",
    tags: ["Students", "Grades"],
  },
  {
    id: "4566082074",
    payhip: "VbQw2",
    slug: "assignment-tracker-notion-template",
    term: "notion assignment tracker",
    name: "Assignment Tracker for Notion",
    does: "The same weighted-grade maths as the spreadsheet, built as three connected Notion databases you duplicate in one click.",
    standout: "Notion, not a file",
    price: 7.5,
    accent: "#4B3A7A",
    shot: "/shots/notion.png",
    tags: ["Students", "Notion"],
  },
];

/**
 * Tamanho do catalogo por extenso, derivado do array.
 *
 * Estava escrito a mao em quatro lugares e ficou dizendo "eight" com nove
 * produtos na lista o tempo todo em que o nono esteve no ar. Derivar mata a
 * classe inteira de erro: acrescentar um produto acerta a copy sozinho.
 */
const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six",
  "seven", "eight", "nine", "ten", "eleven", "twelve",
];

export const productCountWord =
  NUMBER_WORDS[products.length] ?? String(products.length);

/** A mesma palavra com inicial maiuscula, para inicio de frase e titulo. */
export const ProductCountWord =
  productCountWord.charAt(0).toUpperCase() + productCountWord.slice(1);

/** Quantos sao planilhas, para a copy nao prometer .xlsx pelo catalogo todo. */
const spreadsheets = products.filter((p) => !p.tags.includes("Notion"));

export const SpreadsheetCountWord = (() => {
  const w = NUMBER_WORDS[spreadsheets.length] ?? String(spreadsheets.length);
  return w.charAt(0).toUpperCase() + w.slice(1);
})();

export const faqs: { q: string; a: string }[] = [
  {
    q: "Do I need Microsoft Excel?",
    a: "No. Every spreadsheet here is a plain .xlsx that opens in Excel, and imports into Google Sheets through File → Import → Upload with the formulas, dropdowns and named ranges intact. Excel for Mac works too. Apple Numbers opens the files but is unreliable with named ranges, so use Excel or Sheets. The one exception is Assignment Tracker for Notion, which is not a file at all — it is a Notion template you duplicate, and a free Notion account is enough.",
  },
  {
    q: "How do I get the files?",
    a: "The shop releases them the moment the payment clears — there is nothing to wait for and nobody to message. For the spreadsheets you download a zip containing the empty workbook, a worked example, a Start Here PDF and the licence. For the Notion template you download a one-page PDF with your duplication link.",
  },
  {
    q: "Are there macros, add-ins or a subscription?",
    a: "None of the three. No macros, no add-ins, no sign-up, nothing that phones home. You pay once and the file is yours to use on as many of your own devices as you like.",
  },
  {
    q: "Do the screenshots show the real file?",
    a: "Yes, and that is deliberate. Every product image is a render of the real thing after it calculated — the actual workbook, or the actual published Notion page. Not a mockup, not an AI image. What you see in the pictures is what opens on your machine.",
  },
  {
    q: "What if I run out of rows?",
    a: "You are unlikely to. The entry sheets ship with thousands of pre-formatted rows and the dashboard totals reach well past them. If you do get there, copy the last formatted row and paste it down; the formulas adjust themselves. In Notion the question does not arise — you add rows for as long as you need them.",
  },
  {
    q: "Can I get a refund?",
    a: "Because the files are delivered instantly and cannot be returned, all sales are final. That is why every product page shows real screenshots of the working file, and why each download ships with a worked example — so you know what you are buying before you buy it.",
  },
];
