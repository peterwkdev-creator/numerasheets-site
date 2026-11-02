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
  /**
   * Texto longo que responde à consulta do Google, com FAQ. Opcional: entrou
   * em 02/11/2026 só em Etsy seller e Rental (consultas na posição 36 a 56,
   * `Etsy/GOOGLE-CONSULTAS-2026-11-02.md`); o Notion fica de controle, sem
   * guia. Os números vêm do EXAMPLE entregue, como na descrição da listagem.
   */
  guide?: {
    heading: string;
    body: string[];
    faqs: { q: string; a: string }[];
  };
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
      "Landlords with a few units who want rent status and what each property keeps after costs, without a monthly subscription.",
    guide: {
      heading: "Tracking rent in a spreadsheet, property by property",
      body: [
        "A rent tracking spreadsheet has to answer three questions every month: who has paid, who still owes and how much, and what each property keeps once its costs are paid. Most stop at the first one, with a column of ticked boxes.",
        "This one keeps a rent ledger with one row per charge: period, due date, rent due, amount received and date received. From those it works out the outstanding balance and a status — Paid, Partial, Due or Late — with the days late counted against today's date every time you open the file. A tenant who pays half is not marked unpaid; the exact balance carries forward.",
        "Each expense is tagged to the property that incurred it, which is what lets the Dashboard rank properties by what they keep rather than by what they collect. In the example file, Harbour View 7 collects the most rent of four properties and comes third on what it keeps, because its costs were nearly three times those of Maple Street 12B. A rent roll would have ranked it first.",
        "Across the example: 34,080 charged, 31,830 collected, 2,250 still outstanding, 4,039.10 in costs and 27,790.90 actually kept. Cash flow by month is charted, expenses are split by category, and a phone tab stacks the headline numbers so you can check them without a laptop.",
        "It holds 60 properties, 2,000 rent charges and 2,000 expenses, so a growing portfolio does not mean rebuilding the file.",
      ],
      faqs: [
        {
          q: "Does it collect rent or send reminders?",
          a: "No. It records what was paid and tells you who is late and by how many days; collecting and reminding stay with you.",
        },
        {
          q: "Can I use it for a single property?",
          a: "Yes. Fill in one row on the Properties tab and the Dashboard reports on that one; there is room for up to 60.",
        },
        {
          q: "Does it work in Google Sheets?",
          a: "Yes. Import the .xlsx with File > Import > Upload and choose \"Replace spreadsheet\"; the formulas, dropdowns and colour rules carry over.",
        },
        {
          q: "Can I use my own currency?",
          a: "Dates and currency follow your own regional settings, and the START-HERE guide shows how to change the currency symbol.",
        },
        {
          q: "Is it ready for my tax return?",
          a: "It is a spreadsheet, not accounting or tax advice. The expense categories are ordinary bookkeeping labels, not any country's tax form, so check your figures before filing anything.",
        },
      ],
    },
  },
  "etsy-seller-spreadsheet": {
    sheets: ["Dashboard", "Products", "Settings", "Sales", "Expenses",
             "Charts", "On your phone"],
    notDoes:
      "It does not connect to Etsy or import your orders. You enter the sales, and it takes the fees off for you.",
    forWho:
      "Marketplace sellers who want to know the profit they actually keep after fees, shipping and cost of goods.",
    guide: {
      heading: "A spreadsheet to keep track of Etsy sales, fee by fee",
      body: [
        "The payout email tells you what landed in the bank. It does not tell you what each order made. Between the sale and the deposit come a listing fee, a transaction percentage, payment processing and, on some orders, an offsite ad commission. A spreadsheet that only records revenue minus cost of goods never sees that stack, so the profit it reports is higher than the one you keep.",
        "This workbook keeps one row per order. You type what you already know about the sale, and it works out each fee from a rate table on the Settings tab, then cost of goods, net profit and margin. An order that loses money turns red on its own.",
        "In the example file, two orders of the same tote bag — 32.50 each, same marketplace, same week — keep 17.46 and 12.59. The only difference is a Yes in the offsite-ad column. Across sixteen orders on two channels, fees take almost 12% of gross revenue: the number the payout email never separates out.",
        "The rates sit in one row per place you sell, so the same item sold on Etsy and on your own site shows two different profit figures, and when a rate changes you correct one cell instead of every formula. The marketplace row comes prefilled from the published fee policy; check it against your own account, because rates vary by country.",
        "The Dashboard adds revenue and profit month by month with a chart, profit by product — which item is worth making, not just which one sells most — and fees split by type. There is room for 60 products, 2,000 orders and 500 general business expenses.",
      ],
      faqs: [
        {
          q: "Does it import my Etsy orders?",
          a: "No. You enter each sale yourself; nothing connects to your shop, which is also why there is no login and no subscription.",
        },
        {
          q: "What happens when the fees change?",
          a: "Change the rate in the Settings table and every order in the file recalculates from it.",
        },
        {
          q: "Can I track sales from other channels too?",
          a: "Yes. A second row is set up for selling direct on card payments, and blank rows are left for your other channels, each with its own rates.",
        },
        {
          q: "Does it work in Google Sheets?",
          a: "Yes. Import the .xlsx with File > Import > Upload and choose \"Replace spreadsheet\"; the formulas, dropdowns and colour rules carry over.",
        },
        {
          q: "Is this enough for my taxes?",
          a: "It is a spreadsheet, not accounting or tax advice. It gives you clean totals by month, product and fee type to take to whoever prepares your return.",
        },
      ],
    },
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
  "personal-finance-spreadsheet": {
    sheets: ["Dashboard", "Transactions", "Budget", "Accounts", "Charts",
             "On your phone", "Settings", "Checks"],
    notDoes:
      "It does not connect to your bank, and it is not tax advice. You enter or paste each transaction, and the tax reserve is a set-aside you choose, not a tax calculation.",
    forWho:
      "Self-employed people and small business owners who run the house and the business from the same pocket and want one page that keeps the two apart.",
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
  "poshmark-reseller-spreadsheet": {
    sheets: ["Dashboard", "Settings", "Inventory", "Sales", "Pricing helper",
             "Charts", "On your phone"],
    notDoes:
      "It does not connect to Poshmark: it will not import your sales, read your closet or print a label -- you type the date, the SKU and the price, and it works out the rest. This shop is not affiliated with, endorsed by or connected to Poshmark; the name says which platform's fee structure the workbook is set up for.",
    forWho:
      "For resellers who list under fifteen dollars often enough that the flat fee matters. That is where a percentage-based spreadsheet lies to you: $2.95 on a $5.00 sale is 59%, and listing at $12.00 leaves you less than listing at $15.00.",
  },
  "project-management-spreadsheet": {
    sheets: ["Dashboard", "Settings", "Tasks", "Timeline", "Workload",
             "Charts", "On your phone"],
    notDoes:
      "It is not a Kanban board -- a spreadsheet does not drag cards -- and it does not resolve a whole network of dependencies or compute a critical path: one task waits for one task. Days are calendar days, so if your team works five days a week, plan the extra days in yourself.",
    forWho:
      "For anyone running a plan that other people are waiting on. The three bestsellers in this category all sell the same trio -- Gantt, Kanban, Eisenhower -- and every one of them draws the tasks you typed. This one moves the finish date when a task slips, and adds up the hours landing on each person.",
  },
  "spreadsheet-bundle": {
    // Aqui `sheets` nao sao abas: sao os arquivos do ZIP. A secao da pagina se
    // chama "What is inside", e para o conjunto o que esta dentro sao os
    // produtos -- a lista de abas seria de treze workbooks diferentes.
    //
    // A ORDEM e a das pastas do ZIP (01..13), e a lista tem de nomear todas.
    // Em 07/09/2026 o Poshmark e o Project Management entraram no bundle e as
    // descricoes da Etsy e da Payhip foram corrigidas; esta lista ficou nos
    // onze ate 10/09. O `sincronizar.py` agora confere as TRES superficies.
    sheets: ["Small Business Bookkeeping", "Seller Bookkeeping",
             "Poshmark Reseller Tracker", "Invoice & Expense Tracker",
             "Cleaning Business Tracker", "Rental Property Tracker",
             "Project Management Tracker", "Social Media Content Calendar",
             "Debt Payoff Tracker", "Wedding Planner", "Travel Planner",
             "Homeschool Planner & Records", "Assignment Tracker"],
    notDoes:
      "It does not include the Notion template, which is not a file, or the Personal and Business Finance Dashboard, which came out after it. Bought separately these thirteen cost USD 72.60; the bundle does not add anything that is not already in one of them.",
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
