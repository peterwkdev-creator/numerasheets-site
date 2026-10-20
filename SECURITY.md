# Security

## How to report

Do not open a public issue for a security problem: use GitHub's private
report, at [Security → Report a vulnerability](https://github.com/peterwkdev-creator/numerasheets-site/security/advisories/new).
Include the page, the steps to reproduce and the impact.

## What to expect

- First reply within 14 days.
- The fix ships with the next deploy of numerasheets.com; there are no older
  versions to patch.

## Scope

The site is a static export served by Cloudflare Pages: no accounts, no
login, no forms and no server code. The free tools run in the browser, and
what you type in them is not sent anywhere; the only outside script is
Cloudflare Web Analytics, which sets no cookies. Purchases happen on Etsy and Payhip, not here, so
payment issues belong to those platforms.
