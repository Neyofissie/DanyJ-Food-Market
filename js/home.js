/* Farm Link Food Market — home page */
(function () {
  "use strict";
  const { D, byId, catIcon, productCard, thumb, icon, money, esc, store, bindLiveSearch, refreshControls, toast, Cart, $, $$ } = window.FL;
  const S = D.store;
  const pick = (names) => names.map((n) => byId[D.slug(n)]).filter(Boolean);

  // Trust strip
  $("#trust").innerHTML = [
    ["truck", `Free UK delivery`, `On orders over ${money(S.freeDeliveryOver)}`],
    ["leaf", "Fresh produce", "In every week"],
    ["clock", `Order by ${S.dispatchCutoff}`, "For next-day dispatch"],
    ["box", "Wholesale deals", "Bulk boxes & cartons"],
  ].map(([i, b, s]) => `<div class="trust-item"><span class="ti-icon">${icon(i, 19)}</span><div><b>${b}</b><span>${s}</span></div></div>`).join("");

  // Category chips → shop
  $("#chips").innerHTML =
    `<a class="chip active" href="shop.html">${catIcon({ svg: window.FL_CAT_ICONS && window.FL_CAT_ICONS.all, emoji: "🧺" })}All products</a>` +
    D.categories.map((c) => `<a class="chip" href="shop.html?cat=${c.id}">${catIcon(c)}${esc(c.name)}</a>`).join("");

  // Category tiles
  $("#categories").innerHTML = D.categories.map((c) =>
    `<a class="cat-tile" href="shop.html?cat=${c.id}">${thumb(c)}<b>${esc(c.name)}</b><span>${D.products.filter((p) => p.category === c.id).length} products</span></a>`).join("");

  // Customer favourites carousel
  const arrow = `View all ${icon("arrow", 16)}`;
  ["#fav-all", "#snack-all", "#ws-all"].forEach((s) => ($(s).innerHTML = arrow));
  const favourites = pick(["Goat Meat With Bone", "Mackerel Fish", "Ijebu Gari", "Scotch Bonnet (Ata Rodo)", "Palm Oil", "Ground Egusi (Melon)",
    "Maggi Star Seasoning Cubes 400g", "Fresh Bell Pepper (Tatashe)", "Oxtail", "Yellow Croaker Fish"]);
  $("#favourites").innerHTML = favourites.map(productCard).join("");
  $$("[data-scroll]").forEach((btn) => {
    btn.innerHTML = icon(btn.dataset.scroll === "1" ? "right" : "left", 20);
    btn.addEventListener("click", () => {
      const track = $("#favourites");
      track.scrollBy({ left: track.clientWidth * 0.75 * Number(btn.dataset.scroll), behavior: "smooth" });
    });
  });

  // New in store
  $("#new-in").innerHTML = D.products.filter((p) => p.badge === "New").slice(0, 3).map((p) =>
    `<a class="season-tile" href="shop.html?q=${encodeURIComponent(p.name)}">${thumb(p)}<div><b>${esc(p.name)}</b><span>${money(p.price)}</span></div></a>`).join("");

  // Order again (from basket history), falling back to customer favourites
  const renderReorder = () => {
    let ids = store.get("history", []).filter((id) => byId[id]);
    if (!ids.length) ids = favourites.slice(0, 4).map((p) => p.id);
    $("#reorder").innerHTML = ids.slice(0, 4).map((id) => {
      const p = byId[id];
      return `<div class="reorder">
        <div class="reorder-top">${thumb(p)}<div><b>${esc(p.name)}</b><span>${esc(D.categories.find((c) => c.id === p.category).name)}</span></div></div>
        <div class="reorder-foot"><span class="price">${p.from ? "From " : ""}${money(p.price)}</span><button class="circle-add" data-add="${id}" aria-label="Add ${esc(p.name)}">${icon("plus", 18)}</button></div>
      </div>`;
    }).join("");
  };
  renderReorder();

  // Info bar
  $("#info-bar").innerHTML = `
    <div class="info-card"><span class="ic">${icon("clock", 22)}</span><div class="grow"><b>Next-day dispatch</b><span>Order by <strong>${esc(S.dispatchCutoff)}</strong> and we'll send it out the next day</span></div><a class="link-arrow" href="#delivery">Delivery</a></div>
    <div class="info-card"><span class="ic">${icon("pin", 22)}</span><div class="grow"><b>Based in Newcastle-under-Lyme</b><span>Serving the community — and delivering across the UK</span></div><a class="link-arrow" href="#story">${icon("right", 18)}</a></div>`;

  // Our story
  $("#story-collage").innerHTML = pick(["Palm Oil 20L Drum", "Ijebu Gari", "Oyebola Chin Chin 900g", "Scotch Bonnet (Ata Rodo)"])
    .map((p) => `<div>${thumb(p)}</div>`).join("");
  $("#story-points").innerHTML = [
    ["cart", "Wide range", "of quality products"],
    ["award", "Trusted", "brands"],
    ["tag", "Great prices", "everyday"],
    ["truck", "Fast & reliable", "delivery"],
  ].map(([i, b, s]) => `<div><span class="ic">${icon(i, 22)}</span><b>${b}</b><span>${s}</span></div>`).join("");

  // Recipes
  $("#recipe-grid").innerHTML = D.recipes.map((r) => `
    <article class="recipe" style="--tint:${r.tint}">
      <div class="recipe-art"><span>${r.emoji}</span></div>
      <div class="recipe-body">
        <h3>${esc(r.name)}</h3>
        <p>${esc(r.desc)}</p>
        <span class="recipe-count">${icon("chef", 15)} ${r.items.length} ingredients in store</span>
        <a class="btn btn-primary btn-sm" href="shop.html?recipe=${r.id}">Shop the ingredients ${icon("arrow", 16)}</a>
      </div>
    </article>`).join("");

  // Snacks
  $("#snacks").innerHTML = D.products.filter((p) => p.category === "snacks").slice(0, 8).map(productCard).join("");

  // Wholesale
  $("#promo-photos").innerHTML = pick(["Horse Mackerel (Kote) Fish Box", "Goat Meat Box (5kg)"]).map((p) => `<div>${thumb(p)}</div>`).join("");
  $("#wholesale-grid").innerHTML = pick(["Turkey Mid-Wings Box", "Frozen Hard Chicken Carton 10kg", "Scotch Bonnet (Ata Rodo) 5kg Box", "Palm Oil 20L Drum",
    "Mackerel Fish Box (5kg)", "Fresh Tomato Crate", "Indomie Wholesale (4 boxes)", "Gari — Wholesale Box"]).map(productCard).join("");

  // Steps
  $("#steps").innerHTML = [
    ["search", "Browse & pick", "Explore 190+ African and Caribbean groceries, from fresh peppers to stockfish."],
    ["bag", "Fill your basket", "Add what you need, or stock up with a wholesale box deal."],
    ["clock", `Order by ${S.dispatchCutoff}`, "Orders placed before the cut-off are dispatched the next day."],
    ["truck", "Delivered to you", `Carefully packed and delivered across the UK — free over ${money(S.freeDeliveryOver)}.`],
  ].map(([i, h, p], n) => `<div class="step"><span class="num">STEP 0${n + 1}</span><div class="si">${icon(i, 24)}</div><h3>${h}</h3><p>${p}</p></div>`).join("");

  // Delivery
  $("#delivery-points").innerHTML = [
    ["truck", "Free UK delivery", `On orders over ${money(S.freeDeliveryOver)}`],
    ["clock", "Next-day dispatch", `Order by ${S.dispatchCutoff}`],
    ["box", "Bulk & wholesale", "Box deals for businesses"],
  ].map(([i, b, s]) => `<div><span class="ic">${icon(i, 22)}</span><b>${b}</b><span>${s}</span></div>`).join("");

  $("#newsletter-form").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    toast("Thanks for subscribing!");
  });

  bindLiveSearch($("#hero-search"));
  Cart.onChange(renderReorder);
  refreshControls();
})();
