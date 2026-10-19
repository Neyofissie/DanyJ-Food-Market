# DanyJ social media ads

Ready-to-post images, built from the site's product photos and hero image. Prices match `js/data.js` at the time of design. Re-check them before posting, and re-render if they change.

| File | Size | Where to use it |
|---|---|---|
| `01-launch-square.png` | 1080×1080 | Instagram / Facebook feed: launch or brand post |
| `02-jollof-square.png` | 1080×1080 | Feed: "shop the recipe" (all 8 jollof ingredients, £24.82) |
| `03-deals-square.png` | 1080×1080 | Feed: this week's 4 sale items |
| `04-free-delivery-story.png` | 1080×1920 | Instagram / Facebook Stories, TikTok, WhatsApp Status |
| `05-stock-up-story.png` | 1080×1920 | Stories: wholesale box deals |
| `06-drivers-square.png` | 1080×1080 | Feed / Facebook groups: driver recruitment |
| `07-launch-landscape.png` | 1200×628 | Facebook link ads, X / LinkedIn link previews |

Story ads keep text and buttons out of the top ~200px and bottom ~250px, which the app's own controls cover.

## Captions

**01 Launch**
> A taste of home, delivered. 🧺 Rice, yam, egusi, palm oil, fresh peppers and more from African stores across Scotland, brought to your door. Free delivery over £60. Order now, link in bio.
> #AfricanFood #AfricanGroceries #NigerianFood #GhanaianFood #Glasgow #Edinburgh #Scotland #DanyJ

**02 Jollof**
> Jollof night, sorted. 🍛 Rice, tomato paste, plum tomatoes, tatashe, ata rodo, onions, Maggi and curry powder: all 8 ingredients for £24.82, in one basket and one delivery. Tap "Shop the recipe" on our site.
> #JollofRice #NigerianJollof #AfricanCooking #ScotlandFood

**03 Deals**
> Deals of the week 🔥 Soft smoked panla £15.99 (was £19.99) · Scotch bonnet £4.99 (was £7.99) · Puff puff mix £4.50 (was £5.50) · Cameroon pepper £9.99 (was £10.99). While stocks last.

**04 Free delivery (story)**
> Free delivery on orders over £60. Fill your basket, and we'll bring it home. 👉 Tap to shop

**05 Stock up (story)**
> Stock up once, eat well all month. Goat meat 5kg £59.99 · Indomie 4 boxes £33.99 · Scotch bonnet 5kg £28.99 · Catfish 5kg £24.99.

**06 Drivers**
> We're hiring drivers in Scotland 🚗 Choose your own hours, get paid per delivery every week, and serve your own community. You'll need your own car, a UK licence and courier (hire-and-reward) insurance. Apply via the link in bio or DM us.

**07 Launch (link ad)**
> Headline: A taste of home, delivered
> Text: African groceries from stores across Scotland, at shop prices. Free delivery over £60.
> Button: Shop now

## Before posting

- Add the website address or `@handle` once it's final. The ads currently say "link in bio" / "Order now".
- Ad 06 promises weekly per-delivery pay and free choice of hours, as set out in the business case. Only post it once that's how drivers will really be paid.
- "Free delivery over £60" matches Admin → Settings. If you change the threshold there, edit the ads too.

## Editing and re-rendering

The designs are plain HTML in `src/ads.html` (one `<section class="ad">` per image). Change the words, prices or photos there, then run:

```
node marketing/ads/src/render.mjs
```

This needs Playwright (`npm i -D playwright` locally, or set `PLAYWRIGHT_PATH` to an existing install). It rewrites the PNG files in this folder.
