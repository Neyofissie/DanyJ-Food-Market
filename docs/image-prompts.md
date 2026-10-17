# Image prompts — Farm Link Food Market

> **Update:** real photos have since been uploaded for 187 of the 191 products. The product sections below are only needed for: Easy Cook Rice, Golden Morn 300g, Ground Egusi (Melon) and Agoyin Pepper Mix. The hero is done. The section images (story, wholesale, recipes) are still open.

Prompts for the hero, the site sections and the 129 products that don't have a photo yet. They work in Midjourney, ChatGPT / DALL·E, Ideogram, Flux, Firefly and similar tools.

When you have images, put them in the folders named below (or send them to Claude) and they'll be wired into the site.

---

## Read this first: which images to generate

**Generate:** fresh and loose items such as raw meat, fish, leaves, peppers, beans, grains, pepper mixes and homemade-style drinks. AI tools do these well, and there's no packaging to get wrong.

**Don't generate branded packaged goods** (Milo, Maggi, Tilda, Malta Guinness, Tropical Sun and so on). AI tools can't draw real labels. You'd get misspelt, fake-looking packs, and showing a made-up version of a brand's packaging can cause trademark problems. For these, use the real packshot (see [Branded products](#branded-products--use-real-photos) at the bottom).

---

## 1. House style (paste at the end of every product prompt)

This keeps all product photos consistent with the photos already on the site: square, centred, on white.

```
studio product photograph, centred on a pure white seamless background, soft diffused daylight from the upper left, gentle natural shadow underneath, crisp focus, true-to-life colours, appetising and fresh, no text, no labels, no logos, no hands, no props, square 1:1 aspect ratio, high resolution
```

Negative prompt (if your tool supports one):

```
text, watermark, logo, label, brand name, packaging text, hands, people, cluttered background, dark background, oversaturated, plastic look, illustration, cartoon
```

Export as **1200×1200 px**. Save as `.jpg` or `.webp`, using the file name given for each product.

---

## 2. Hero images

The hero has a cream (#F8F5EE) to sage-green background and the headline "A taste of home in every basket" on the **left**. Each image needs empty space on its left side for that text.

### 2a. Hero, desktop (wide)

Save as `assets/img/hero.webp`, **2400×1100 px** (about 21:10).

```
Wide editorial food photograph for an African and Caribbean grocery website hero. On the right two-thirds of the frame, a woven raffia market basket overflowing with fresh produce: glossy red and yellow scotch bonnet peppers, red bell peppers, a whole brown yam tuber, a bunch of green plantains, vivid green ugu (fluted pumpkin) leaves, red onions and ripe tomatoes, with a small glass bottle of deep red palm oil beside it. The basket sits on a pale natural wooden table. Soft warm morning daylight from the left, gentle shadows, shallow depth of field. The left third of the frame is calm, softly blurred cream and pale sage-green background with plenty of empty space for headline text. Colour palette: warm cream, sage green, deep forest green accents, natural produce colours. Fresh, welcoming, premium but homely. No text, no logos, no people. Photorealistic, high resolution.
```

### 2b. Hero, mobile (tall)

Save as `assets/img/hero-mobile.webp`, **1080×1350 px** (4:5).

```
Vertical editorial food photograph for a mobile website hero. In the bottom half of the frame, a woven market basket filled with scotch bonnet peppers, green plantains, a yam tuber, ugu leaves, tomatoes and red onions, with a small bottle of red palm oil, on a pale wooden table. The top half is soft, out-of-focus cream and pale sage-green background with lots of empty space for a headline. Warm morning daylight, shallow depth of field. No text, no logos, no people. Photorealistic.
```

### 2c. Hero, illustrated alternative (matches the current drawing)

Use this if you'd rather keep the hand-drawn look than switch to a photo.

```
Soft watercolour and gouache illustration of rolling green farmland at sunrise, gentle sage and olive hills, a small farmhouse with a terracotta roof, a winding cream path, a pale yellow sun. In the foreground on the right, loosely painted fresh produce: scotch bonnet peppers, yam, plantain, tomatoes and leafy greens. Muted warm palette of cream, sage green, forest green and terracotta. The left 40% of the image fades into plain cream paper with no detail, leaving space for text. Wide 21:10 format, no text, calm and inviting.
```

---

## 3. Site section images

### Our story

Save as `assets/img/story.webp`, 1200×1200 px.

```
Warm documentary-style photograph inside a small, tidy African and Caribbean grocery shop in England. Wooden shelves neatly stocked with sacks of rice and garri, bottles of palm oil, tins and colourful spice jars; a crate of scotch bonnet peppers and green plantains in the foreground. Soft natural window light, welcoming community feel, shallow depth of field. No readable text or brand logos on products, no people's faces. Photorealistic, square.
```

Alternative with a person, matching the farmer photo on the old site's logo:

```
Photograph of a Black woman in a colourful head wrap harvesting fresh leafy greens and tomatoes into a woven basket on a lush green farm at golden hour, smiling, natural and dignified, warm light, shallow depth of field. Photorealistic, square.
```

### Wholesale banner

Save as `assets/img/wholesale.webp`, 1600×1000 px.

```
Clean, bright photograph of a professional food wholesale cold room: neatly stacked plain cardboard cartons and blue-lined boxes of frozen fish and meat, a crate of red scotch bonnet peppers, sacks of onions and a large 20-litre drum of red palm oil on pallets. Organised and hygienic, cool daylight. Plain unbranded boxes, no text, no logos, no people. Photorealistic.
```

### Category tiles that still need a photo

Use the house style. Save in `assets/img/products/`.

| File | Prompt (then add the house style) |
|---|---|
| `cat-grains.webp` | Three small wooden bowls side by side: long-grain parboiled rice, brown honey beans and red kidney beans, a few grains scattered in front |
| `cat-drinks.webp` | A group of unbranded drinks: a glass bottle of deep red zobo (hibiscus) drink with ice, a bottle of creamy kunu, an opened green coconut and a glass of mango juice. Plain bottles with no labels |

### Recipes

Save in `assets/img/recipes/`. Use **1200×800 px** (3:2) in natural light, styled as overhead or 45° food photography. Do **not** use the white-background house style for these.

| File | Prompt |
|---|---|
| `jollof.webp` | Overhead photograph of a large serving bowl of smoky Nigerian party jollof rice, deep orange-red grains, with fried golden plantain (dodo) and grilled beef suya skewers on the side, on a green ceramic platter, rustic wooden table, warm natural light, appetising, photorealistic |
| `egusi.webp` | Photograph of a bowl of Nigerian egusi soup: thick ground-melon-seed soup with bitterleaf greens, pieces of assorted meat and stockfish, glossy red palm oil, served with a smooth ball of pounded yam, white ceramic bowl, warm light, photorealistic |
| `agoyin.webp` | Photograph of Nigerian ewa agoyin: soft mashed brown honey beans topped with dark, almost black agoyin pepper sauce glistening with oil, fried plantain on the side, enamel plate, warm natural light, photorealistic |
| `peppered-goat.webp` | Close-up photograph of Nigerian peppered goat meat: tender chunks of goat tossed in a fiery red pepper and onion sauce with sliced red onions and scotch bonnet, on a white plate, glossy, steam rising, warm light, photorealistic |

---

## 4. Product prompts (generate these)

Add the **house style** to the end of each prompt. Save each image in `assets/img/products/` using the file name shown. Each row is one product.

### Grains & Legumes

| File | Subject |
|---|---|
| `golden-sella-basmati-rice.webp` | A heap of long golden sella (parboiled) basmati rice grains in a small white bowl, a few grains scattered |
| `easy-cook-rice.webp` | A neat mound of easy-cook long-grain parboiled white rice in a shallow bowl |
| `long-grain-rice.webp` | Long-grain white rice in a wooden scoop, grains spilling slightly |
| `honey-beans-oloyin.webp` | A mound of small light-brown Nigerian honey beans (oloyin) in a bowl |
| `red-kidney-beans.webp` | Dried dark red kidney beans heaped in a small bowl |
| `peeled-beans.webp` | Creamy white peeled (dehulled) black-eyed beans, split halves, in a bowl |
| `bean-flour-moin-moin.webp` | Fine pale cream bean flour for moin moin in a bowl with a wooden spoon |
| `cornmeal-corn-flour.webp` | Fine yellow cornmeal in a bowl, with a dried corn cob beside it |
| `ground-egusi-melon.webp` | Pale cream ground egusi (melon seed) in a bowl, a few whole shelled seeds in front |

### Swallow

| File | Subject |
|---|---|
| `yellow-garri.webp` | Coarse yellow garri (cassava granules) in a bowl, a few granules scattered |
| `elubo-yam-flour.webp` | Light brown-grey elubo (yam flour) in a bowl |
| `cooked-fufu-akpu.webp` | Three smooth off-white wrapped portions of cooked cassava fufu (akpu) on a small plate |
| `plantain-flour.webp` | Fine pale plantain flour in a bowl beside one green plantain |
| `cassava-flour-lafun.webp` | Fine white cassava flour (lafun) in a bowl |

### Fish, Meat & Poultry

| File | Subject |
|---|---|
| `mixed-pack-frozen-snail.webp` | Large cleaned African giant land snails (meat out of shell), raw, on a white tray |
| `soft-smoked-panla.webp` | Soft smoked whiting (panla) fish curled into rings, golden-brown smoked skin |
| `smoked-dried-catfish-fillet-500g.webp` | Pieces of dark smoked dried catfish fillet in a clear vacuum bag (no label) |
| `frozen-red-snapper.webp` | One whole raw red snapper fish, bright red-pink skin, clear eyes |
| `frozen-red-bream-steaks.webp` | Raw red bream fish steaks cut across the bone, pink flesh |
| `saltfish-boneless-cod-200g.webp` | Pieces of dry salted boneless cod (saltfish), pale and flaky |
| `dried-panla-stockfish-500g.webp` | Dried stockfish (panla) pieces, hard, pale grey-brown |
| `stockfish-cutlet.webp` | Chopped dried stockfish cutlets, golden-tan, irregular pieces |
| `dry-eja-abo-sole-fish-7pcs.webp` | Seven dried sole fish (eja abo), flat, golden-brown, arranged in a fan |
| `dried-king-prawn.webp` | A heap of dried red king prawns, shells on |
| `prawns-450g.webp` | Raw peeled pink-white prawns heaped on crushed ice |
| `wet-periwinkle-250g.webp` | Fresh periwinkles (small dark spiral sea snails) heaped in a bowl, glistening |
| `soaked-ijebu-ponmo.webp` | Thick rolled pieces of soaked golden-brown cow skin (ijebu ponmo) |
| `shaki-tripe.webp` | Raw honeycomb beef tripe (shaki) cut into pieces |
| `cow-meat-with-bone.webp` | Raw beef chunks cut with bone in, deep red meat |
| `boneless-cow-foot.webp` | Raw boneless cow foot pieces, pale and gelatinous |
| `cow-leg-bone-in.webp` | Raw cow leg cut into pieces across the bone, pale skin |
| `ram-meat.webp` | Raw ram (mutton) meat chunks with bone and skin on |
| `turkey-mid-wings.webp` | Raw turkey mid-wings, pale pink skin |
| `jolly-hard-chicken-orobo.webp` | One whole raw hard (old layer) chicken, lean, pale yellow skin, trussed |

### Fresh Veg & Fruits

| File | Subject |
|---|---|
| `fresh-tomatoes.webp` | Five ripe red vine tomatoes, one halved showing juicy seeds |
| `garden-egg-500g.webp` | A pile of small round white-and-green African garden eggs (eggplants) |
| `yam-tuber-approx-3-5kg.webp` | One large whole brown puna yam tuber with rough bark-like skin, one end cut showing white flesh |
| `unripe-plantain-x1.webp` | One single large green unripe plantain |
| `cocoyam-per-kg.webp` | A few hairy brown cocoyam (taro) corms, one cut showing white flesh |
| `tiger-nuts-300g.webp` | A heap of small wrinkled brown tiger nuts in a bowl |
| `kola-nut-bitter-kola-pack.webp` | Red and pink kola nut lobes beside brown bitter kola nuts |
| `fresh-ugu-bunch.webp` | A fresh bunch of ugu (fluted pumpkin) leaves, broad dark green leaves, tied stems |
| `fresh-ewedu-bunch.webp` | A fresh bunch of ewedu (jute mallow) leaves, small bright green serrated leaves |
| `fresh-uziza-leaf-bunch.webp` | A bunch of glossy heart-shaped uziza leaves |
| `scent-leaf-efirin-pack.webp` | A bunch of fresh scent leaf (efirin / African basil) |
| `bitterleaf-fresh-dried-pack.webp` | Fresh bitterleaf (ewuro) leaves, washed, dark green |
| `ewe-moimoi-leaf-bunch.webp` | A stack of large broad green moimoi leaves (thaumatococcus), folded |
| `shoko-5-bunches-box.webp` | Five fresh bunches of shoko (lagos spinach / soko) greens in an open cardboard box |
| `mixed-leaf-pack-10-bunches.webp` | Ten bunches of mixed African leafy greens (ugu, ewedu, shoko, scent leaf) arranged together |

### Oils & Seasoning

| File | Subject |
|---|---|
| `palm-oil.webp` | Three plain clear plastic jerrycans of deep red palm oil, no labels |
| `ayamase-oil.webp` | A plain clear bottle of bleached ayamase palm oil, dark amber-brown, no label |
| `ofada-pepper-mix.webp` | A heap of coarse dark red-brown dried ofada pepper mix, a metal scoop |
| `agoyin-pepper-mix.webp` | A heap of very dark ground agoyin pepper mix in a small bowl |
| `cameroon-pepper-400g.webp` | Fine dark red-brown ground cameroon pepper in a small bowl, a few dried peppers beside |
| `dried-chilli-pepper-100g.webp` | A heap of whole dried long red chilli peppers |
| `ground-crayfish-100g.webp` | Fine orange-brown ground dried crayfish in a bowl, a few whole dried crayfish |
| `iru-locust-beans-dawadawa.webp` | Dark fermented locust beans (iru / dawadawa) in a small bowl |
| `grounded-iru-seasoning.webp` | Fine brown ground iru seasoning powder in a small bowl |
| `ogiri-70g.webp` | Small plain round clear pots of ogiri (fermented seed paste), stacked, no labels |

### Drinks

| File | Subject |
|---|---|
| `kunu-drink.webp` | Three plain clear plastic bottles of creamy beige kunu drink with red caps, no labels |
| `sorrel-drink-zobo.webp` | Plain bottles of deep ruby-red zobo (hibiscus) drink with dried hibiscus petals and a lemon slice, no labels |

---

## Branded products — use real photos

Don't generate these (see the note at the top). There are three ways to get real packshots, quickest first:

1. **Your old Shopify store.** Every one of these already has a photo there. Download each image from the product's admin page, or export them all, then send them over.
2. **Your supplier or wholesaler.** Tropical Sun, Nestlé, etc. provide official product images to retailers on request.
3. **Photograph them in the shop.** Put each product on white card by a window, phone held level, fill the frame, no flash. Then remove the background (remove.bg or Photoshop) and save as square images.

Use the file names below so they drop straight in. Save them in `assets/img/products/`.

**Grains & Swallow:** `tilda-golden-sella-basmati-rice`, `aani-golden-sella-basmati-rice`, `tolly-boy-rice`, `africa-s-finest-black-eye-beans`, `golden-morn-300g`, `ayoola-poundo-yam-flour`, `olu-olu-poundo-yam`, `africa-s-finest-fufu-flakes`, `honeywell-semolina`, `golden-penny-semovita`

**Meat & Fish (tins):** `corned-beef-340g`, `geisha-mackerel-in-tomato-sauce-425g`

**Oils & Seasoning:** `okomu-banga-palm-fruit-concentrate-2l`, `maggi-star-seasoning-cubes-400g`, `maggi-chicken-seasoning-powder-400g`, `maggi-liquid-seasoning-200ml`, `naija-knorr-chicken-cubes`, `onga-stew-seasoning`, `onga-chicken-seasoning`, `lion-curry-powder-25g`, `rajah-curry-powder-100g`, `tropical-sun-whole-black-pepper-90g`, `tropical-sun-brown-mustard-seeds`, `tropical-sun-vegetable-seasoning`, `tropical-sun-naga-chilli-pickle`, `tropical-sun-smokehouse-chicken-rub`, `tropical-sun-smokehouse-rib-n-steak-rub`, `tropical-sun-smokehouse-chicken-salt`, `tropical-sun-smokehouse-sweet-chilli-bbq-rub`, `tropical-sun-citrus-ginger-jerk-seasoning`, `tropical-sun-jamaican-honey-jerk-seasoning`, `tinned-plum-tomatoes-400g`, `gino-tomato-paste-400g`, `gino-tomato-mix-sachet-55g`, `de-rica-tomato-puree-70g`, `de-rica-tomato-puree-210g`, `de-rica-tomato-puree-400g`

**Drinks:** `milo-refill`, `peak-milk-refill`, `nestl-nido-milk-powder-900g`, `nestl-nido-milk-powder-400g`, `carnation-condensed-milk-379g`, `cadbury-bournvita-500g`, `ovaltine-300g`, `nescaf-classic-100g`, `lipton-yellow-label-tea-200g`, `tropical-sun-herbal-tea-moringa`, `tiger-nut-drink-300g`, `nurishment-original`, `malta-guinness-330ml`, `maltina-330ml`, `supermalt-330ml`, `amstel-malta-330ml`, `guinness-foreign-extra-stout-330ml`, `nigeria-fanta-50cl`, `fayrouz-pineapple-33cl`, `bigga-pineapple-500ml`, `chubby-soft-drink-250ml`, `ribena-288ml`, `tropical-sun-hibiscus-sorrel-juice-330ml`, `tropical-sun-soursop-juice-330ml`, `tropical-sun-tamarind-juice-310ml`, `tropical-vibes-mango-carrot-300ml`, `tropical-vibes-fruit-punch-300ml`, `tropical-rhythms-fruit-punch-475ml`, `tropical-rhythms-sorrel-ginger-475ml`, `aloe-vera-drink-500ml`, `coconut-water-330ml`

---

**Totals:** 63 images to generate (61 products + 2 category tiles), 68 branded products to source as real photos (61 + 68 = all 129 products without a photo), plus 2 hero images and 6 section images (story, wholesale, 4 recipes).
