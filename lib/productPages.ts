/**
 * O texto que só existe na página própria de cada produto.
 *
 * Mora separado de `products.ts` de propósito: aquele arquivo é o catálogo
 * (o que a home precisa saber), este é a cópia longa (o que só a página do
 * produto usa). Misturar os dois faria a home carregar prosa que ela nunca
 * mostra.
 *
 * `sheets` NÃO é escrito à mão -- é a lista real de abas do `.xlsx` entregue,
 * lida com openpyxl em 01/09/2026. Se uma aba for renomeada no gerador, esta
 * lista fica errada, e é por isso que o `stress_test` do produto e esta lista
 * devem ser conferidos na mesma passada.
 *
 * `notDoes` é obrigatório, não decorativo: a regra da linha
 * (`.claude/rules/products.md`, "O que o produto NÃO faz merece seção
 * própria") diz que o limite tem de aparecer em três lugares, e a página do
 * produto é um deles. É o que evita pedido de reembolso -- ou seja, contato
 * com comprador, que é exatamente o que este negócio existe para não ter.
 */
export type ProductPage = {
  /** Abas reais do arquivo, na ordem em que aparecem nele. */
  sheets: string[];
  /** O limite que o comprador pode não esperar. Uma frase, sem rodeio. */
  notDoes: string;
  /** Quem compra isto, em uma linha. Vira o primeiro parágrafo da página. */
  forWho: string;
};

export const productPages: Record<string, ProductPage> = {
  "invoice-tracker-spreadsheet": {
    sheets: ["Dashboard", "Create Invoice", "Invoices", "Line Items", "Clients",
             "Expenses", "Charts", "On your phone", "Settings"],
    notDoes:
      "It does not email invoices or take payments. You print or export the invoice from the Create Invoice tab and send it yourself.",
    forWho:
      "Freelancers who invoice a handful of clients a month and want to know who still owes them money without keeping it in their head.",
  },
  "rental-property-spreadsheet": {
    sheets: ["Dashboard", "Properties", "Settings", "Rent Ledger", "Expenses",
             "Charts", "On your phone"],
    notDoes:
      "It does not connect to a bank or a listing site. You enter what was paid, and the file works out the rest.",
    forWho:
      "Landlords with a few units who want rent status and per-property yield without a monthly subscription.",
  },
  "etsy-seller-spreadsheet": {
    sheets: ["Dashboard", "Products", "Settings", "Sales", "Expenses",
             "Charts", "On your phone"],
    notDoes:
      "It does not connect to Etsy or import your orders. You enter the sales, and it takes the fees off for you.",
    forWho:
      "Marketplace sellers who want to know the profit they actually keep after fees, shipping and cost of goods.",
  },
  "social-media-content-calendar": {
    sheets: ["Dashboard", "Calendar", "Settings", "Ideas", "Charts",
             "On your phone"],
    notDoes:
      "It does not connect to any social network, schedule posts, or pull metrics automatically. You type the numbers in; it does the arithmetic and the ranking.",
    forWho:
      "Creators and small marketing teams planning posts across several platforms who want to see which pillar actually earns engagement.",
  },
  "debt-payoff-tracker": {
    sheets: ["Dashboard", "Debts", "Settings", "Snowball", "Avalanche",
             "Charts", "On your phone"],
    notDoes:
      "It does not connect to your lenders. You enter balances, rates and minimums once, and it projects from there.",
    forWho:
      "Anyone paying down several debts who wants to see, in months and in dollars, which payoff order actually costs less.",
  },
  "wedding-planner-spreadsheet": {
    sheets: ["Dashboard", "Budget", "Settings", "Guests", "Checklist",
             "Charts", "On your phone"],
    notDoes:
      "It does not send invitations or collect RSVPs online. You record replies as they come in, and the head count and meal totals follow.",
    forWho:
      "Couples planning their own wedding who want the budget, the guest list and the timeline to agree with each other.",
  },
  "small-business-bookkeeping-spreadsheet": {
    sheets: ["Dashboard", "Income", "Settings", "Expenses", "Mileage",
             "Charts", "On your phone"],
    notDoes:
      "It does not file anything and it is not tax advice. It organises your year so the numbers are ready for whoever does file.",
    forWho:
      "Sole traders and small businesses who want income, deductible expenses and mileage sorted into the right quarter as they go.",
  },
  "homeschool-planner-spreadsheet": {
    sheets: ["Dashboard", "Log", "Settings", "Grades", "Charts",
             "On your phone"],
    notDoes:
      "It does not report to any state or district for you. It keeps the record; submitting it is still yours to do.",
    forWho:
      "Homeschooling parents who have to show days and hours against a legal requirement and want one file that counts both.",
  },
  "assignment-tracker-spreadsheet": {
    sheets: ["Dashboard", "Settings", "Courses", "Assignments", "Charts",
             "On your phone"],
    notDoes:
      "It does not connect to Canvas, Google Classroom or any school portal. You enter the grades you have been given.",
    forWho:
      "Students carrying several courses who want a grade that is honest about what has actually been marked so far.",
  },
  "assignment-tracker-notion-template": {
    sheets: ["Courses", "Assignments", "Dashboard"],
    notDoes:
      "This one is a Notion template, not a file you download. You need a free Notion account, and it does not open in Excel or Google Sheets.",
    forWho:
      "Students who already live in Notion and want the weighted-grade maths there instead of in a spreadsheet.",
  },
  "cleaning-business-spreadsheet": {
    sheets: ["Dashboard", "Settings", "Clients", "Jobs", "Expenses", "Charts",
             "On your phone"],
    notDoes:
      "It does not send invoices, take payments or book jobs, and it does not know your country's tax rules -- the mileage rate is a number you type in.",
    forWho:
      "One-person cleaning rounds priced per visit, who want to know which clients actually pay well for the hours they take.",
  },
  "spreadsheet-bundle": {
    // Aqui `sheets` nao sao abas: sao os onze arquivos. A secao da pagina se
    // chama "What is inside", e para o conjunto o que esta dentro sao os
    // produtos -- a lista de abas seria de onze workbooks diferentes.
    sheets: ["Small Business Bookkeeping", "Seller Bookkeeping",
             "Invoice & Expense Tracker", "Cleaning Business Tracker",
             "Rental Property Tracker", "Social Media Content Calendar",
             "Debt Payoff Tracker", "Wedding Planner", "Travel Planner",
             "Homeschool Planner & Records", "Assignment Tracker"],
    notDoes:
      "It does not include the Notion template, which is not a file. Bought separately these eleven cost USD 65; the bundle does not add anything that is not already in one of them.",
    forWho:
      "People who want the whole set at once rather than picking one now and paying full price for the next.",
  },
  "travel-itinerary-template": {
    sheets: ["Dashboard", "Trip", "Itinerary", "Budget", "Bookings", "Packing",
             "Charts", "On your phone"],
    notDoes:
      "It does not book, hold or price anything, does not check availability, and does not convert currency at today's rate. Confirm every booking with the airline or operator.",
    forWho:
      "People planning a trip themselves who want the itinerary, the money, the bookings and the packing list to agree with each other.",
  },
};
