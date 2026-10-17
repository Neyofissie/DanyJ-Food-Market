# Farm Link Food Market — website redesign

A modern online storefront for Farm Link Food Market (a trading name of 88 African Foods & Grocery Ltd, Newcastle-under-Lyme): African and Caribbean groceries with free UK delivery over £60. It has a cream and green palette, a hand-drawn farm hero, rounded product cards and a slide-out basket.

It's a plain static site with no build step. Open `index.html` in a browser, or upload the folder to any static host (Netlify, Vercel, GitHub Pages, cPanel and so on).

## Pages & features

- **`index.html` (Home)**:
  - Hero with live product search and the store's delivery promises
  - Shop by category (all 8 collections)
  - Customer favourites carousel
  - "New in store" and "Order again" (remembers what this visitor added before)
  - Our story, recipes with "Shop the ingredients", and Nigerian snacks
  - Wholesale banner and box deals
  - How it works, delivery info, email sign-up and footer
- **`shop.html` (Shop)**: the full catalogue.
  - Filters for category, on sale, new in store and favourites, plus search and sorting.
  - Filters are kept in the URL, e.g. `shop.html?cat=wholesale`, `shop.html?filter=new` or `shop.html?recipe=jollof`.
  - On mobile, the filters open as a sheet that slides up from the bottom.
- **Basket drawer** (on every page):
  - Quantity steppers
  - Free-delivery progress bar
  - Subtotal and total (delivery free over £60)
  - The basket is saved in the visitor's browser.
- **Micro-interactions** (`js/motion.js`):
  - Products fly into the basket in an arc; the basket catches them, and the count pops with a "+1".
  - Quantities roll up and down, and the + button stretches into a quantity stepper.
  - Buttons press down, hearts burst, and cards tilt towards the cursor with a light sheen.
  - Carousels can be dragged and thrown with a mouse.
  - Basket items slide in when the basket opens, and removed items swipe away.
  - Confetti fires when the basket reaches free delivery.
  - The shop grid animates when filters change, sections rise into view on scroll, and the search hint types itself.
  - Phones give a light vibration when you add an item.
  - Everything is toned down for visitors who have reduced motion turned on.
- **Fully responsive**: desktop, tablet and phone.

## Editing content

**All products, prices, categories, recipes and store details are in `js/data.js`.** That is the only file you need to edit.

The catalogue was transcribed from screenshots of the current farmlinkfoodmarket.co.uk shop. It has **191 products in 8 collections**: Grains & Legumes, Swallow, Fish Meat & Poultry, Fresh Veg & Fruits, Oils & Seasoning, Drinks & Beverages, Nigerian Snacks and Wholesale Box Deals. Prices, sale prices, "New in store" and "Customer favourites" all match the screenshots.

A few products were left out because their price wasn't visible in the screenshots. Add them to `js/data.js` when you have the prices:

- Carnation Evaporated Milk 410g (photo ready: `carnation-evaporated-milk-410g`)
- Rajah All Purpose Seasoning 400g (photo ready: `rajah-all-purpose-seasoning-400g`)
- Tropical Sun Pink Skin Peanuts 500g (photo ready: `tropical-sun-pink-skin-peanuts-500g`)
- Ola-Ola Pounded Iyan (photo ready: `ola-ola-pounded-iyan`)
- Titus Sardines (photo ready: `titus-sardines`)
- Ripe plantain (photo ready: `ripe-plantain`)
- Two unnamed items in Fish, Meat & Poultry

### Product photos

187 of 191 products have photos, saved as optimised WebP files in `assets/img/products/` (600×600, about 20 KB each). Most come from the original product images uploaded to `screenshots/`; a few were cropped from screenshots of the old shop. Still showing an emoji: Easy Cook Rice, Golden Morn 300g, Ground Egusi (Melon) and Agoyin Pepper Mix.

Photos are also ready for six products that aren't in the catalogue yet because their prices are unknown: Carnation Evaporated Milk 410g, Ola-Ola Pounded Iyan, Rajah All Purpose Seasoning 400g, Titus Sardines, ripe plantain and Tropical Sun Pink Skin Peanuts 500g. Add each one to `js/data.js` with its price and `img:` set to its file name.

Every other product shows an emoji tile until a photo is added. To add one:

1. Save the photo in `assets/img/products/` as a `.webp` file.
2. In `js/data.js`, add `img: "file-name"` to that product (leave off the `.webp`).

Higher-resolution originals exported from Shopify (Products → Export, or each product's image) will look sharper than screenshot crops.

### Recipes

The four recipes (Jollof Rice, Egusi Soup, Ewa Agoyin, Peppered Goat Meat) each list their ingredients in `js/data.js`. "Shop the ingredients" opens the shop filtered to just those products.

## Still to connect before going live

- **Checkout / payments**: the Checkout button is a placeholder. Hook it up to Stripe, Shopify Buy Button, Square, etc.
- **Delivery fee**: the basket shows "Calculated at checkout" under £60 and "Free" above it. Set the real fee when checkout is connected.
- **Contact details**: add your email and phone number to `store` in `js/data.js` and they'll appear in the footer.
- **Newsletter**: connect the form to Mailchimp, Klaviyo or similar.
- **Account, FAQs, policies and social links**: these are currently `#` links.

## Structure

```
index.html        Home page
shop.html         Shop / catalogue page
css/styles.css    All styling (design tokens at the top)
js/data.js        Catalogue, recipes + store details  ← edit this
js/app.js         Shared header, footer, basket, product cards
js/home.js        Home page sections
js/shop.js        Shop filters, search and sorting
js/motion.js      Micro-interactions and animations
js/category-icons.js  Illustrated icons for the 8 categories
assets/img/products/  Product photos (WebP)
```
