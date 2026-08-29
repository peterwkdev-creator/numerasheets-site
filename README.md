# NumeraSheets — shop window

Marketing site for the [NumeraSheets](https://numerasheets.etsy.com) Etsy shop:
a single responsive page listing the eight spreadsheet templates, with every
outbound link pointing at the trackable `numerasheets.etsy.com` subdomain so
purchases are credited to Etsy's Share & Save programme.

Selling and delivery happen entirely on Etsy — this site never takes a payment.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript.
Type is Archivo + IBM Plex Mono; the palette is the shop's own ink navy and gold.

## Running it

```bash
npm install
npm run dev
```

## Notes

- Product data lives in `lib/products.ts`; `listingUrl()` is the only place a
  listing URL is built, which keeps every link trackable.
- Listing images in `public/shots/` are renders of the real workbooks, resized
  from the artwork used on the Etsy listings themselves.
- `app/opengraph-image.png` must be captured from the deployed production URL,
  never from `next dev` — the dev server injects a floating indicator.
