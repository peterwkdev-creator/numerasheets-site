export const SHOP_URL = "https://numerasheets.etsy.com";

/** Every outbound link goes through the trackable shop subdomain. */
export const listingUrl = (id: string) => `${SHOP_URL}/listing/${id}`;

export type Product = {
  id: string;
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

export const products: Product[] = [
  {
    id: "4564974686",
    name: "Invoice & Expense Tracker",
    does: "Marks an invoice overdue the moment its due date passes, and nets expenses off the money that actually came in.",
    standout: "Status column",
    price: 8,
    accent: "#D99C2B",
    shot: "/shots/invoice.png",
    tags: ["Freelancers", "Invoicing"],
  },
  {
    id: "4564987897",
    name: "Rental Property Tracker",
    does: "Reads each month's rent against what was paid and calls it Paid, Partial, Due or Late without you deciding.",
    standout: "Per-property yield",
    price: 9,
    accent: "#2E6F5E",
    shot: "/shots/rental.png",
    tags: ["Landlords", "Property"],
  },
  {
    id: "4565000823",
    name: "Seller Bookkeeping Spreadsheet",
    does: "Takes marketplace fees, shipping and cost of goods off each order, so profit is the number you actually keep.",
    standout: "Fee-by-fee breakdown",
    price: 8,
    accent: "#2A5D7C",
    shot: "/shots/seller.png",
    tags: ["Etsy sellers", "E-commerce"],
  },
  {
    id: "4565059738",
    name: "Social Media Content Calendar",
    does: "Counts down to each post's date, flags what is overdue, and ranks your content pillars by engagement rate.",
    standout: "Four-state flag",
    price: 6,
    accent: "#8E3B62",
    shot: "/shots/content.png",
    tags: ["Creators", "Marketing"],
  },
  {
    id: "4565079805",
    name: "Debt Payoff Tracker",
    does: "Projects snowball and avalanche side by side, month by month, to the date each debt finally clears.",
    standout: "120-month projection",
    price: 6,
    accent: "#A85427",
    shot: "/shots/debt.png",
    tags: ["Personal finance", "Budgeting"],
  },
  {
    id: "4565130836",
    name: "Wedding Planner Spreadsheet",
    does: "Dates every checklist task backwards from your wedding day — move the date and all 22 deadlines move with it.",
    standout: "Self-dating checklist",
    price: 9,
    accent: "#3B4A8C",
    shot: "/shots/wedding.png",
    tags: ["Weddings", "Guest list"],
  },
  {
    id: "4565142164",
    name: "Small Business Bookkeeping",
    does: "Files every entry into the right quarter from its date, and applies your own deductible percentage per category.",
    standout: "Quarter from date",
    price: 8,
    accent: "#55642A",
    shot: "/shots/tax.png",
    tags: ["Small business", "Tax year"],
  },
  {
    id: "4565150287",
    name: "Homeschool Planner & Records",
    does: "Counts a day with four subjects as one school day, and tracks days and hours against both of your targets.",
    standout: "Days and hours at once",
    price: 9,
    accent: "#1D6A73",
    shot: "/shots/homeschool.png",
    tags: ["Homeschool", "Records"],
  },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Do I need Microsoft Excel?",
    a: "No. Every workbook is a plain .xlsx that opens in Excel, and imports into Google Sheets through File → Import → Upload with the formulas, dropdowns and named ranges intact. Excel for Mac works too. Apple Numbers opens the files but is unreliable with named ranges, so use Excel or Sheets.",
  },
  {
    q: "How do I get the files?",
    a: "Etsy delivers them the moment the payment clears — there is nothing to wait for and nobody to message. You download a zip containing the empty workbook, a worked example, a Start Here PDF and the licence.",
  },
  {
    q: "Are there macros, add-ins or a subscription?",
    a: "None of the three. No macros, no add-ins, no sign-up, nothing that phones home. You pay once and the file is yours to use on as many of your own devices as you like.",
  },
  {
    q: "Do the screenshots show the real file?",
    a: "Yes, and that is deliberate. Every listing image is a render of the actual workbook after it recalculated — not a mockup, not an AI image. What you see in the pictures is what opens on your machine.",
  },
  {
    q: "What if I run out of rows?",
    a: "You are unlikely to. The entry sheets ship with thousands of pre-formatted rows and the dashboard totals reach well past them. If you do get there, copy the last formatted row and paste it down; the formulas adjust themselves.",
  },
  {
    q: "Can I get a refund?",
    a: "Because the files are delivered instantly and cannot be returned, all sales are final. That is why every listing shows real screenshots of the working file, and why each download ships with a worked example — so you know what you are buying before you buy it.",
  },
];
