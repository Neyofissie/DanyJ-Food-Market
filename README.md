# FarmLink Food Market — website redesign

A modern online grocery storefront for FarmLink Food Market. It uses a fresh, warm design: a cream and sage palette, a hand-drawn farm landscape, rounded product cards with producer details, and seasonal discovery sections.

It's a plain static site with no build step. Open `index.html` in a browser, or upload the folder to any static host (Netlify, Vercel, GitHub Pages, cPanel and so on).

## Pages & features

- **`index.html` (Discover)**: the hero section with live product search, trust badges and category chips. Below that:
  - Recommended carousel
  - "In season now" and "Order again" sections (Order again remembers what this visitor has added to their basket before)
  - Delivery and local-producer info cards
  - Categories, popular picks and a promo banner
  - Weekly bundles, "How it works", producers and reviews
  - A postcode delivery checker, newsletter sign-up and footer
- **`shop.html` (Shop)**: the full catalogue.
  - Filters for category, producer, seasonal, on offer and favourites, plus search and sorting.
  - Filters are kept in the URL, e.g. `shop.html?cat=dairy` or `shop.html?filter=seasonal`.
  - On mobile, the filters open as a sheet that slides up from the bottom.
- **Basket drawer** (on every page):
  - Quantity steppers
  - Free-delivery progress bar
  - Subtotal, delivery fee and total
  - The basket is saved in the visitor's browser.
- **Fully responsive**: desktop, tablet and phone.

## Editing content

**All products, prices, categories, producers, bundles, reviews and store details are in `js/data.js`.** That is the only file you need to edit.

> ⚠️ The catalogue currently holds **placeholder** products, prices, reviews and contact details. The old site (farmlinkfoodmarket.co.uk) could not be reached when this was built, so none of its content has been imported yet. Replace the placeholders with your real data before launch.

### Adding real product photos

1. Put the image in `assets/img/products/` (a square or 4:3 JPG/WebP, around 800px, works best).
2. In `js/data.js`, add `image: "assets/img/products/your-photo.jpg"` to that product.

Products without an `image` show an illustrated emoji tile on a soft coloured background (`emoji` + `tint`). This keeps the layout looking finished while photos are being collected.

## Still to connect before going live

- **Checkout / payments**: the Checkout button is a placeholder. Hook it up to Stripe, Shopify Buy Button, Square, etc.
- **Delivery areas**: the postcode checker only checks the UK postcode format. Swap in your real delivery-area list.
- **Newsletter**: connect the form to Mailchimp, Klaviyo or similar.
- **Account, FAQs, policies and social links**: these are currently `#` links.

## Structure

```
index.html        Discover / home page
shop.html         Shop / catalogue page
css/styles.css    All styling (design tokens at the top)
js/data.js        Catalogue + store details  ← edit this
js/app.js         Shared header, footer, basket, product cards
js/home.js        Home page sections
js/shop.js        Shop filters, search and sorting
assets/img/       Images
```
