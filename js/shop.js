/* Farm Link Food Market — shop page */
(function () {
  "use strict";
  const { D, categoryById, productCard, icon, esc, store, refreshControls, openPanel, $ } = window.FL;

  const params = new URLSearchParams(location.search);
  const state = {
    cat: params.get("cat") || "all",
    recipe: params.get("recipe") || "",
    q: params.get("q") || "",
    offers: params.get("filter") === "sale",
    fresh: params.get("filter") === "new",
    favs: false,
    sort: "featured",
  };

  const all = D.products;
  const recipeOf = () => D.recipes.find((r) => r.id === state.recipe);

  const syncUrl = () => {
    const p = new URLSearchParams();
    if (state.cat !== "all") p.set("cat", state.cat);
    if (state.recipe) p.set("recipe", state.recipe);
    if (state.q) p.set("q", state.q);
    if (state.offers) p.set("filter", "sale");
    else if (state.fresh) p.set("filter", "new");
    try { history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : "")); } catch (e) { /* not allowed in some embedded previews */ }
  };

  const renderFilters = () => {
    const cats = [{ id: "all", name: "All products", emoji: "🧺" }, ...D.categories];
    $("#filter-cats").innerHTML = cats.map((c) => {
      const n = c.id === "all" ? all.length : all.filter((p) => p.category === c.id).length;
      return `<button class="filter-opt ${state.cat === c.id ? "active" : ""}" data-cat="${c.id}"><span>${c.emoji} ${esc(c.name)}</span><small>${n}</small></button>`;
    }).join("");
    $("#shop-chips").innerHTML = cats.map((c) =>
      `<button class="chip ${state.cat === c.id && !state.recipe ? "active" : ""}" data-cat="${c.id}"><span class="chip-emoji">${c.emoji}</span>${esc(c.name)}</button>`).join("");
    $("#f-offers").checked = state.offers;
    $("#f-new").checked = state.fresh;
    $("#f-favs").checked = state.favs;
    $("#q").value = state.q;
  };

  const render = () => {
    const q = state.q.trim().toLowerCase();
    const favs = store.get("favs", []);
    const recipe = recipeOf();
    let list = all.filter((p) =>
      (state.cat === "all" || p.category === state.cat) &&
      (!recipe || recipe.items.includes(p.id)) &&
      (!state.offers || p.wasPrice) &&
      (!state.fresh || p.badge === "New") &&
      (!state.favs || favs.includes(p.id)) &&
      (!q || [p.name, categoryById[p.category]?.name].some((s) => s && s.toLowerCase().includes(q))));

    if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    const cat = categoryById[state.cat];
    const title = recipe ? `${recipe.name} ingredients` : cat ? cat.name : state.fresh ? "New in store" : state.offers ? "On sale" : state.q ? `Results for “${state.q}”` : "All products";
    const sub = recipe ? recipe.desc + " Everything you need is below." : cat ? cat.desc : "African and Caribbean groceries, delivered across the UK.";
    $("#shop-title").textContent = title;
    $("#shop-sub").textContent = sub;
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
    if (c) { state.cat = c.dataset.cat; state.recipe = ""; update(); }
  });
  $("#f-offers").addEventListener("change", (e) => { state.offers = e.target.checked; render(); });
  $("#f-new").addEventListener("change", (e) => { state.fresh = e.target.checked; render(); });
  $("#f-favs").addEventListener("change", (e) => { state.favs = e.target.checked; render(); });
  $("#q").addEventListener("input", (e) => { state.q = e.target.value; render(); });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  $("#clear-filters").addEventListener("click", () => {
    Object.assign(state, { cat: "all", recipe: "", q: "", offers: false, fresh: false, favs: false });
    update();
  });
  $("#search-icon").innerHTML = icon("search", 17);
  $("#filter-toggle").innerHTML = `${icon("filter", 16)} Filters`;
  $("#filter-toggle").addEventListener("click", () => openPanel("filters"));

  if (location.hash === "#search") setTimeout(() => $("#q").focus(), 50);
  update();
})();
