/* FarmLink Food Market — home page */
(function () {
  "use strict";
  const { D, byId, producerById, productCard, thumb, icon, money, esc, initials, store, bindLiveSearch, refreshControls, toast, Cart, $, $$ } = window.FL;
  const S = D.store;

  // Trust strip
  $("#trust").innerHTML = [
    ["truck", "Free delivery", `On orders over ${money(S.freeDeliveryOver)}`],
    ["leaf", "Local produce", "From trusted farms"],
    ["shield", "Freshness guarantee", "Or your money back"],
  ].map(([i, b, s]) => `<div class="trust-item"><span class="ti-icon">${icon(i, 19)}</span><div><b>${b}</b><span>${s}</span></div></div>`).join("");

  // Category chips → shop
  $("#chips").innerHTML =
    `<a class="chip active" href="shop.html"><span class="chip-emoji">🧺</span>All products</a>` +
    D.categories.map((c) => `<a class="chip" href="shop.html?cat=${c.id}"><span class="chip-emoji">${c.emoji}</span>${esc(c.name)}</a>`).join("") +
    `<a class="chip" href="shop.html?filter=seasonal"><span class="chip-emoji">🍂</span>Seasonal</a>`;

  // Recommended carousel
  $("#rec-note").innerHTML = `${icon("sparkle", 14)} Based on what's fresh this week`;
  const recommended = D.products.filter((p) => p.badge === "Top pick").concat(D.products.filter((p) => p.badge && p.badge !== "Top pick"));
  $("#recommended").innerHTML = recommended.map(productCard).join("");
  $$("[data-scroll]").forEach((btn) => {
    btn.innerHTML = icon(btn.dataset.scroll === "1" ? "right" : "left", 20);
    btn.addEventListener("click", () => {
      const track = $("#recommended");
      track.scrollBy({ left: track.clientWidth * 0.75 * Number(btn.dataset.scroll), behavior: "smooth" });
    });
  });

  // In season
  $("#season").innerHTML = D.products.filter((p) => p.seasonal).slice(0, 3).map((p) =>
    `<a class="season-tile" href="shop.html?q=${encodeURIComponent(p.name)}">${thumb(p)}<div><b>${esc(p.name)}</b><span>${esc(p.desc)}</span></div></a>`).join("");

  // Order again (from basket history), falling back to popular staples
  const renderReorder = () => {
    let ids = store.get("history", []).filter((id) => byId[id]);
    const fallback = !ids.length;
    if (fallback) ids = ["p19", "p09", "p13", "p01"];
    $("#reorder").innerHTML = ids.slice(0, 4).map((id) => {
      const p = byId[id], prod = producerById[p.producer];
      return `<div class="reorder">
        <div class="reorder-top">${thumb(p)}<div><b>${esc(p.name)}</b><span>${prod ? esc(prod.name) : esc(p.desc)}</span><span>${esc(p.unit)}</span></div></div>
        <div class="reorder-foot"><span class="price">${money(p.price)}</span><button class="circle-add" data-add="${id}" aria-label="Add ${esc(p.name)}">${icon("plus", 18)}</button></div>
      </div>`;
    }).join("");
  };
  renderReorder();

  // Info bar
  $("#info-bar").innerHTML = `
    <div class="info-card"><span class="ic">${icon("truck", 22)}</span><div class="grow"><b>Delivering to <span data-area>${esc(store.get("area", S.defaultArea))}</span></b><span>Next delivery: <strong>${esc(S.nextDelivery)}</strong></span></div><a class="link-arrow" href="#delivery">Change</a></div>
    <div class="info-card"><span class="ic">${icon("sprout", 22)}</span><div class="grow"><b>Supporting local</b><span>${D.producers.length} local producers · ${D.products.length} fresh products</span></div><a class="link-arrow" href="#producers">${icon("right", 18)}</a></div>`;

  // Categories
  $("#cat-all").innerHTML = `View all ${icon("arrow", 16)}`;
  $("#categories").innerHTML = D.categories.map((c) =>
    `<a class="cat-tile" href="shop.html?cat=${c.id}">${thumb(c)}<b>${esc(c.name)}</b></a>`).join("");

  // Popular
  $("#pop-all").innerHTML = `View all ${icon("arrow", 16)}`;
  const popularIds = ["p02", "p11", "p03", "p04", "p14", "p17", "p23", "p21"];
  $("#popular").innerHTML = popularIds.map((id) => byId[id]).filter(Boolean).map(productCard).join("");

  // Bundles
  $("#bundle-grid").innerHTML = D.bundles.map((b) => productCard(byId[b.id])).join("");

  // Steps
  $("#steps").innerHTML = [
    ["search", "Browse & pick", "Explore fresh produce and staples from local producers."],
    ["bag", "Fill your basket", "Add items or choose a ready-made weekly bundle."],
    ["clock", "Choose a slot", "Pick a delivery time that works around your day."],
    ["truck", "Enjoy it fresh", "We deliver straight to your door, carefully packed."],
  ].map(([i, h, p], n) => `<div class="step"><span class="num">STEP 0${n + 1}</span><div class="si">${icon(i, 24)}</div><h3>${h}</h3><p>${p}</p></div>`).join("");

  // Producers
  $("#producer-grid").innerHTML = D.producers.map((p) =>
    `<a class="producer-card" href="shop.html?producer=${p.id}"><span class="avatar">${initials(p.name)}</span><b>${esc(p.name)}</b><span>${esc(p.county)}</span></a>`).join("");

  // Reviews
  $("#reviews").innerHTML = D.testimonials.map((t) => `
    <figure class="review" style="margin:0">
      <div class="stars" aria-label="${t.rating} out of 5 stars">${icon("star", 16).repeat(t.rating)}</div>
      <p>“${esc(t.text)}”</p>
      <figcaption class="review-who"><span class="avatar">${initials(t.name)}</span><b>${esc(t.name)}</b></figcaption>
    </figure>`).join("");

  // Delivery
  $("#delivery-points").innerHTML = [
    ["leaf", "Fresh produce", "Locally sourced"],
    ["heart", "Better choices", "For a healthier you"],
    ["sprout", "Sustainable", "Low-waste packaging"],
  ].map(([i, b, s]) => `<div><span class="ic">${icon(i, 22)}</span><b>${b}</b><span>${s}</span></div>`).join("");

  $("#postcode-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#postcode-input").value.trim().toUpperCase();
    const msg = $("#postcode-msg");
    // Basic UK postcode format check — replace with your real delivery-area lookup.
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/.test(v)) {
      msg.style.color = "var(--red)";
      msg.textContent = "Please enter a valid UK postcode, e.g. SW1A 1AA.";
      return;
    }
    msg.style.color = "";
    msg.textContent = `Great news — we deliver to ${v}. Next slot: ${S.nextDelivery}.`;
    store.set("area", v);
    $$("[data-area]").forEach((el) => (el.textContent = v));
  });

  $("#newsletter-form").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    toast("Thanks! Check your inbox for your discount code");
  });

  bindLiveSearch($("#hero-search"));
  Cart.onChange(renderReorder);
  refreshControls();
})();
