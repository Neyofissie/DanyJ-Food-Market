/* FarmLink Food Market — shop page */
(function () {
  "use strict";
  const { D, byId, producerById, categoryById, productCard, icon, esc, store, refreshControls, openPanel, $, $$ } = window.FL;

  const params = new URLSearchParams(location.search);
  const state = {
    cat: params.get("cat") || "all",
    producer: params.get("producer") || "all",
    q: params.get("q") || "",
    seasonal: params.get("filter") === "seasonal",
    offers: params.get("filter") === "offers",
    favs: false,
    sort: "featured",
  };

  const all = [...D.products, ...D.bundles.map((b) => byId[b.id])];
  const countIn = (fn) => all.filter(fn).length;

  const syncUrl = () => {
    const p = new URLSearchParams();
    if (state.cat !== "all") p.set("cat", state.cat);
    if (state.producer !== "all") p.set("producer", state.producer);
    if (state.q) p.set("q", state.q);
    if (state.seasonal) p.set("filter", "seasonal");
    else if (state.offers) p.set("filter", "offers");
    history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : ""));
  };

  const renderFilters = () => {
    const cats = [{ id: "all", name: "All products", emoji: "🧺" }, ...D.categories, { id: "bundle", name: "Bundles", emoji: "📦" }];
    $("#filter-cats").innerHTML = cats.map((c) => {
      const n = c.id === "all" ? all.length : countIn((p) => p.category === c.id);
      return `<button class="filter-opt ${state.cat === c.id ? "active" : ""}" data-cat="${c.id}"><span>${c.emoji} ${esc(c.name)}</span><small>${n}</small></button>`;
    }).join("");
    $("#shop-chips").innerHTML = cats.map((c) =>
      `<button class="chip ${state.cat === c.id ? "active" : ""}" data-cat="${c.id}"><span class="chip-emoji">${c.emoji}</span>${esc(c.name)}</button>`).join("");
    $("#filter-producers").innerHTML = [{ id: "all", name: "All producers" }, ...D.producers].map((p) =>
      `<button class="filter-opt ${state.producer === p.id ? "active" : ""}" data-producer="${p.id}"><span>${esc(p.name)}</span>${p.county ? `<small>${esc(p.county)}</small>` : ""}</button>`).join("");
    $("#f-seasonal").checked = state.seasonal;
    $("#f-offers").checked = state.offers;
    $("#f-favs").checked = state.favs;
    $("#q").value = state.q;
  };

  const render = () => {
    const q = state.q.trim().toLowerCase();
    const favs = store.get("favs", []);
    let list = all.filter((p) =>
      (state.cat === "all" || p.category === state.cat) &&
      (state.producer === "all" || p.producer === state.producer) &&
      (!state.seasonal || p.seasonal) &&
      (!state.offers || p.wasPrice) &&
      (!state.favs || favs.includes(p.id)) &&
      (!q || [p.name, p.desc, producerById[p.producer]?.name, categoryById[p.category]?.name].some((s) => s && s.toLowerCase().includes(q))));

    if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    const cat = categoryById[state.cat];
    const title = state.cat === "bundle" ? "Weekly bundles" : cat ? cat.name : state.seasonal ? "In season now" : state.q ? `Results for “${state.q}”` : "Our products";
    $("#shop-title").textContent = title;
    $("#crumb").textContent = title;
    document.title = `${title} — ${D.store.fullName}`;
    $("#count").innerHTML = `Showing <b>${list.length}</b> ${list.length === 1 ? "product" : "products"}`;
    $("#grid").innerHTML = list.length
      ? list.map(productCard).join("")
      : `<div class="no-results"><div style="font-size:48px">🔍</div><b>No products found</b><p>Try a different search or clear your filters.</p></div>`;
    refreshControls();
    syncUrl();
  };

  const update = () => { renderFilters(); render(); };

  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-cat]");
    const p = e.target.closest("[data-producer]");
    if (c) { state.cat = c.dataset.cat; update(); }
    if (p) { state.producer = p.dataset.producer; update(); }
  });
  $("#f-seasonal").addEventListener("change", (e) => { state.seasonal = e.target.checked; render(); });
  $("#f-offers").addEventListener("change", (e) => { state.offers = e.target.checked; render(); });
  $("#f-favs").addEventListener("change", (e) => { state.favs = e.target.checked; render(); });
  $("#q").addEventListener("input", (e) => { state.q = e.target.value; render(); });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  $("#clear-filters").addEventListener("click", () => {
    Object.assign(state, { cat: "all", producer: "all", q: "", seasonal: false, offers: false, favs: false });
    update();
  });
  $("#search-icon").innerHTML = icon("search", 17);
  $("#filter-toggle").innerHTML = `${icon("filter", 16)} Filters`;
  $("#filter-toggle").addEventListener("click", () => openPanel("filters"));

  if (location.hash === "#search") setTimeout(() => $("#q").focus(), 50);
  update();
})();
