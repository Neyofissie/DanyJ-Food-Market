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

## Motion versions (MP4)

Animated versions of six of the ads are in `motion/`. They're 30 fps H.264 MP4 videos, which upload straight to Instagram Reels and Stories, TikTok, Facebook and WhatsApp Status.

| File | Length | What moves |
|---|---|---|
| `motion/01-launch-square.mp4` | 8s | Slow zoom on the basket photo, the headline rises line by line, and the button pops and pulses |
| `motion/02-jollof-square.mp4` | 9s | The 8 ingredients pop in, each gets ticked into the basket (the counter goes 0 → 8), then the total counts up to £24.82 |
| `motion/03-deals-square.mp4` | 8s | A highlight sweeps across "Deals", cards rise, the old prices get struck through, and the new prices and "Save" badges pop in |
| `motion/04-free-delivery-story.mp4` | 9s | "Free / delivery / over £60" slams in, the products drop into place and float |
| `motion/05-stock-up-story.mp4` | 9s | The headline rises, the box deals slide in, and the prices count up |
| `motion/06-drivers-square.mp4` | 8s | The photo circle springs in, and the ticks draw themselves next to each benefit |

The videos have no sound. Add a trending track inside Instagram or TikTok when you post, as the apps' licensed music is safest.

They're built from `src/motion.html`, which uses the same layout as the still ads plus CSS animations. Open it in a browser to watch them loop live. To re-render after a change:

```
node marketing/ads/src/render-motion.mjs            # all six
node marketing/ads/src/render-motion.mjs jollof     # just one
```

This steps the animations frame by frame and needs `ffmpeg` on your PATH as well as Playwright.

## Editing and re-rendering

The designs are plain HTML in `src/ads.html`, with the styles in `src/ads.css` (one `<section class="ad">` per image). Change the words, prices or photos there, then run:

```
node marketing/ads/src/render.mjs
```

This needs Playwright (`npm i -D playwright` locally, or set `PLAYWRIGHT_PATH` to an existing install). It rewrites the PNG files in this folder.
