/* DanyJ Food Market — admin dashboard
 * Overview, products (add / edit / prices / photos / hide), inventory, discounts,
 * orders and store settings, plus CSV import/export and backups.
 * Data is saved in this browser (see the "Admin overrides" section of data.js)
 * until a real database is connected.
 */
(function () {
  "use strict";
  const D = window.DANYJ;
  const S = D.store;
  const root = document.getElementById("adm");

  /* ---------- Helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(n) || 0);
  const r2 = (n) => Math.round(Number(n) * 100) / 100;
  const LS = (k, fb) => { try { const v = localStorage.getItem("danyj:" + k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } };
  const SET = (k, v) => { try { localStorage.setItem("danyj:" + k, JSON.stringify(v)); return true; } catch (e) { toast("Couldn't save: this browser's storage is full."); return false; } };
  const catById = Object.fromEntries(D.categories.map((c) => [c.id, c]));
  const fmtDate = (t) => new Date(t).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const STATUSES = ["Placed", "Being packed", "Dispatched", "Delivered"];
  const ICON = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/>',
    box: '<path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    stack: '<path d="m12 2 10 5-10 5L2 7Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4Z"/><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>', close: '<path d="M18 6 6 18M6 6l12 12"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', edit: '<path d="M12 20h9"/><path d="M16.4 3.6a2 2 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    up: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>', down: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    alert: '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"/><path d="M12 9v4M12 17h.01"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    dl: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  };
  const icon = (n, s = 18) => `<svg class="icon" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n] || ""}</svg>`;
  let toastT;
  const toast = (m) => {
    let t = $(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = icon("check", 17) + `<span>${esc(m)}</span>`; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2400);
  };
  const thumb = (p, cls = "") => `<span class="a-thumb ${cls}" style="background:${p.tint}">${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy">` : `<span>${p.emoji || "🧺"}</span>`}</span>`;

  /* ---------- State ---------- */
  let products = D.allProducts.map((p) => ({ ...p }));
  let discounts = (D.discounts || []).map((d) => ({ ...d }));
  const orders = () => LS("orders", []);
  const saveProducts = () => { products = products.map(D.normalize); D.saveCatalog(products); };
  const saveOrders = (list) => SET("orders", list);
  const low = () => Number(S.lowStockAt) || 5;
  const stockState = (p) => (p.stock == null ? "untracked" : p.stock === 0 ? "out" : p.stock <= low() ? "low" : "ok");
  const stageOf = (o) => (o.cancelled ? -1 : o.status != null ? o.status : 0);
  const uniqueId = (name) => { let id = D.slug(name) || "product", n = 2; const base = id; while (products.some((p) => p.id === id)) id = `${base}-${n++}`; return id; };

  /* ---------- Sign in (preview passcode) ---------- */
  const signedIn = () => { try { return sessionStorage.getItem("danyj:admin") === "1"; } catch (e) { return false; } };
  const renderGate = () => {
    const has = !!LS("adminPass", null);
    root.innerHTML = `
      <main class="gate">
        <form class="gate-card" id="gate" autocomplete="off">
          <span class="gate-logo">${icon("leaf", 24)}</span>
          <h1>DanyJ Admin</h1>
          <p>${has ? "Enter your admin passcode to manage the shop." : "Create a passcode to protect the dashboard on this computer."}</p>
          <label class="field"><span>${has ? "Passcode" : "New passcode"}</span><input id="g-pass" type="password" minlength="4" required autocomplete="${has ? "current-password" : "new-password"}"></label>
          ${has ? "" : `<label class="field"><span>Repeat passcode</span><input id="g-pass2" type="password" minlength="4" required autocomplete="new-password"></label>`}
          <p class="form-error" id="g-err" role="alert"></p>
          <button class="btn btn-primary btn-block" type="submit">${icon("lock", 17)} ${has ? "Open dashboard" : "Create passcode"}</button>
          <p class="form-hint">Preview lock only. Before launch, admin access needs a real login on a server.</p>
          <a class="gate-back" href="index.html">← Back to the shop</a>
        </form>
      </main>`;
    $("#gate").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = $("#g-pass").value, err = $("#g-err");
      if (v.length < 4) return (err.textContent = "Use at least 4 characters.");
      if (!has) { if (v !== $("#g-pass2").value) return (err.textContent = "The passcodes don't match."); SET("adminPass", v); }
      else if (v !== LS("adminPass", "")) return (err.textContent = "That passcode isn't right.");
      try { sessionStorage.setItem("danyj:admin", "1"); } catch (er) { /* session storage blocked */ }
      route();
    });
  };

  /* ---------- Layout ---------- */
  const NAV = [["overview", "Overview", "home"], ["products", "Products", "box"], ["inventory", "Inventory", "stack"], ["discounts", "Discounts", "tag"], ["orders", "Orders", "receipt"], ["settings", "Settings", "gear"]];
  const shell = (active, body) => {
    const outN = products.filter((p) => !p.hidden && p.stock === 0).length;
    const openOrders = orders().filter((o) => { const s = stageOf(o); return s >= 0 && s < 3; }).length;
    const badge = { inventory: outN, orders: openOrders };
    return `
      <div class="adm">
        <aside class="adm-side" id="adm-side">
          <a class="adm-brand" href="#overview"><span>${icon("leaf", 20)}</span><b>DanyJ</b><small>Admin</small></a>
          <nav>${NAV.map(([id, l, ic]) => `<a href="#${id}" class="${active === id ? "active" : ""}">${icon(ic)}<span>${l}</span>${badge[id] ? `<em>${badge[id]}</em>` : ""}</a>`).join("")}</nav>
          <div class="adm-side-foot">
            <a href="index.html" target="_blank" rel="noopener">${icon("ext", 16)} View shop</a>
            <button data-lock>${icon("lock", 16)} Lock</button>
          </div>
        </aside>
        <div class="adm-main">
          <header class="adm-top"><button class="adm-menu" data-menu aria-label="Menu">${icon("menu", 22)}</button><h1>${NAV.find((n) => n[0] === active)[1]}</h1><div class="adm-top-r">${topAction(active)}</div></header>
          <div class="adm-note">${icon("alert", 15)} Preview mode: changes are saved in this browser and show in the shop in this browser only. Connect a database to publish them for everyone.</div>
          <section class="adm-body-in" id="adm-view">${body}</section>
        </div>
      </div>
      <div class="adm-drawer" id="drawer" aria-hidden="true"></div>
      <div class="adm-scrim" data-close-drawer></div>`;
  };
  const topAction = (v) => ({
    products: `<button class="btn btn-primary btn-sm" data-new-product>${icon("plus", 16)} Add product</button>`,
    discounts: `<button class="btn btn-primary btn-sm" data-new-code>${icon("plus", 16)} New code</button>`,
  }[v] || "");

  /* ---------- Overview ---------- */
  const viewOverview = () => {
    const os = orders(); const live = os.filter((o) => !o.cancelled);
    const revenue = live.reduce((s, o) => s + (o.total || 0), 0);
    const visible = products.filter((p) => !p.hidden);
    const out = visible.filter((p) => p.stock === 0), lowL = visible.filter((p) => stockState(p) === "low");
    const onSale = visible.filter((p) => p.wasPrice).length;
    const activeCodes = discounts.filter((d) => d.active).length;
    // last 7 days revenue
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - 6 + i); return d; });
    const perDay = days.map((d) => live.filter((o) => { const t = new Date(o.placed); t.setHours(0, 0, 0, 0); return +t === +d; }).reduce((s, o) => s + o.total, 0));
    const max = Math.max(...perDay, 1);
    const units = {};
    live.forEach((o) => Object.entries(o.items).forEach(([id, q]) => (units[id] = (units[id] || 0) + q)));
    const top = Object.entries(units).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, q]) => [products.find((p) => p.id === id), q]).filter((x) => x[0]);
    return `
      <div class="kpis">
        ${kpi("Revenue", money(revenue), `${live.length} ${live.length === 1 ? "order" : "orders"}`)}
        ${kpi("Average order", money(live.length ? revenue / live.length : 0), "per order")}
        ${kpi("Products live", visible.length, `${products.length - visible.length} hidden · ${onSale} on sale`)}
        ${kpi("Stock alerts", out.length + lowL.length, `${out.length} out · ${lowL.length} low`, out.length ? "warn" : "")}
      </div>
      <div class="adm-grid">
        <article class="a-card span-2">
          <div class="a-card-h"><h2>Sales, last 7 days</h2><span class="muted">${money(perDay.reduce((a, b) => a + b, 0))}</span></div>
          <div class="bars">${days.map((d, i) => `<div class="bar-col"><span class="bar-v">${perDay[i] ? money(perDay[i]) : ""}</span><div class="bar" style="height:${Math.max(3, (perDay[i] / max) * 100)}%"></div><span class="bar-l">${d.toLocaleDateString("en-GB", { weekday: "short" })}</span></div>`).join("")}</div>
          ${live.length ? "" : `<p class="muted small">No orders yet. Sales appear here as customers check out.</p>`}
        </article>
        <article class="a-card">
          <div class="a-card-h"><h2>Needs attention</h2></div>
          <ul class="att">
            <li><a href="#inventory?f=out"><span class="dot red"></span>${out.length} out of stock</a></li>
            <li><a href="#inventory?f=low"><span class="dot amber"></span>${lowL.length} running low (≤ ${low()})</a></li>
            <li><a href="#orders"><span class="dot blue"></span>${os.filter((o) => { const s = stageOf(o); return s >= 0 && s < 3; }).length} to fulfil</a></li>
            <li><a href="#inventory?f=untracked"><span class="dot grey"></span>${visible.filter((p) => p.stock == null).length} products without stock tracking</a></li>
            <li><a href="#discounts"><span class="dot green"></span>${activeCodes} active discount codes</a></li>
          </ul>
        </article>
        <article class="a-card span-2">
          <div class="a-card-h"><h2>Recent orders</h2><a class="link-arrow" href="#orders">All orders</a></div>
          ${os.length ? orderTable(os.slice(0, 5), true) : `<p class="muted">No orders yet.</p>`}
        </article>
        <article class="a-card">
          <div class="a-card-h"><h2>Top sellers</h2></div>
          ${top.length ? `<ol class="toplist">${top.map(([p, q]) => `<li>${thumb(p)}<span>${esc(p.name)}</span><b>${q}</b></li>`).join("")}</ol>` : `<p class="muted">Best sellers appear once orders come in.</p>`}
        </article>
      </div>`;
  };
  const kpi = (l, v, sub, cls = "") => `<div class="kpi ${cls}"><span>${l}</span><b>${v}</b><small>${sub}</small></div>`;

  /* ---------- Products ---------- */
  let pf = { q: "", cat: "all", status: "all" };
  let selected = new Set();
  const filteredProducts = () => products.filter((p) => {
    const q = pf.q.toLowerCase();
    if (q && !(p.name.toLowerCase().includes(q) || p.id.includes(q))) return false;
    if (pf.cat !== "all" && p.category !== pf.cat) return false;
    const st = { live: !p.hidden, hidden: !!p.hidden, sale: !!p.wasPrice, out: p.stock === 0, low: stockState(p) === "low", nophoto: !p.image }[pf.status];
    return pf.status === "all" || st;
  });
  const viewProducts = () => {
    const list = filteredProducts();
    return `
      <div class="toolbar-a">
        <label class="a-search">${icon("search", 17)}<input id="p-q" placeholder="Search ${products.length} products" value="${esc(pf.q)}"></label>
        <select id="p-cat" class="select"><option value="all">All categories</option>${D.categories.map((c) => `<option value="${c.id}" ${pf.cat === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select>
        <select id="p-status" class="select">${[["all", "All products"], ["live", "Live"], ["hidden", "Hidden"], ["sale", "On sale"], ["out", "Out of stock"], ["low", "Low stock"], ["nophoto", "No photo"]].map(([v, l]) => `<option value="${v}" ${pf.status === v ? "selected" : ""}>${l}</option>`).join("")}</select>
        <span class="grow"></span>
        <label class="btn btn-ghost btn-sm file-btn">${icon("upload", 16)} Import CSV<input type="file" accept=".csv,text/csv" id="csv-in" hidden></label>
        <button class="btn btn-ghost btn-sm" data-export-csv>${icon("dl", 16)} Export CSV</button>
      </div>
      <div class="bulk ${selected.size ? "show" : ""}" id="bulk">
        <b>${selected.size} selected</b>
        <span class="bulk-g"><input id="bulk-pct" type="number" min="1" max="90" placeholder="%" aria-label="Percent off"><button class="btn btn-sm btn-primary" data-bulk="sale">Apply % off</button></span>
        <button class="btn btn-sm btn-ghost" data-bulk="endsale">End sale</button>
        <span class="bulk-g"><input id="bulk-stock" type="number" min="0" placeholder="Qty" aria-label="Stock quantity"><button class="btn btn-sm btn-ghost" data-bulk="stock">Set stock</button></span>
        <button class="btn btn-sm btn-ghost" data-bulk="hide">Hide</button>
        <button class="btn btn-sm btn-ghost" data-bulk="show">Show</button>
        <button class="btn btn-sm btn-ghost" data-bulk="clear">Clear</button>
      </div>
      <div class="a-card table-card">
        <div class="table-wrap">
          <table class="ptable">
            <thead><tr><th><input type="checkbox" id="sel-all" aria-label="Select all shown" ${list.length && list.every((p) => selected.has(p.id)) ? "checked" : ""}></th><th>Product</th><th>Price</th><th>Was <span class="muted">(sale)</span></th><th>Stock</th><th>Live</th><th></th></tr></thead>
            <tbody>${list.map(productRow).join("") || `<tr><td colspan="7" class="empty-row">No products match these filters.</td></tr>`}</tbody>
          </table>
        </div>
        <p class="table-foot muted">Showing ${list.length} of ${products.length}. Edit price, sale price and stock right in the table; changes save as you go. Leave stock blank to not track it.</p>
      </div>`;
  };
  const productRow = (p) => `
    <tr data-id="${p.id}" class="${p.hidden ? "is-hidden" : ""}">
      <td><input type="checkbox" data-sel="${p.id}" ${selected.has(p.id) ? "checked" : ""} aria-label="Select ${esc(p.name)}"></td>
      <td><button class="p-cell" data-edit="${p.id}">${thumb(p)}<span><b>${esc(p.name)}</b><small>${esc(catById[p.category].name)}${p.tag ? ` · ${esc(p.tag)}` : ""}${p.wasPrice ? ` · <em class="sale">−${Math.round((1 - p.price / p.wasPrice) * 100)}%</em>` : ""}</small></span></button></td>
      <td><label class="money-in"><span>£</span><input type="number" step="0.01" min="0" value="${p.price.toFixed(2)}" data-f="price" aria-label="Price"></label></td>
      <td><label class="money-in"><span>£</span><input type="number" step="0.01" min="0" value="${p.wasPrice ? p.wasPrice.toFixed(2) : ""}" placeholder="—" data-f="wasPrice" aria-label="Was price"></label></td>
      <td><input class="qty-in st-${stockState(p)}" type="number" min="0" value="${p.stock == null ? "" : p.stock}" placeholder="∞" data-f="stock" aria-label="Stock"></td>
      <td><label class="switch"><input type="checkbox" data-f="live" ${p.hidden ? "" : "checked"}><span class="slider"></span><span class="sr-only">Live in shop</span></label></td>
      <td><button class="icon-b" data-edit="${p.id}" aria-label="Edit ${esc(p.name)}">${icon("edit", 16)}</button></td>
    </tr>`;

  /* ---------- Product editor ---------- */
  let editImage = null;
  const openEditor = (id) => {
    const p = id ? products.find((x) => x.id === id) : { id: "", name: "", category: pf.cat !== "all" ? pf.cat : D.categories[0].id, price: "", wasPrice: "", stock: null, tag: "", from: false, hidden: false, image: null, emoji: "" };
    editImage = p.image;
    const dr = $("#drawer");
    dr.innerHTML = `
      <form class="drawer-in" id="p-form" novalidate>
        <header><h2>${id ? "Edit product" : "Add product"}</h2><button type="button" class="icon-b" data-close-drawer aria-label="Close">${icon("close")}</button></header>
        <div class="drawer-body">
          <div class="img-up">
            <div class="img-prev" id="img-prev" style="background:${(catById[p.category] || D.categories[0]).tint}">${p.image ? `<img src="${esc(p.image)}" alt="">` : `<span>${p.emoji || (catById[p.category] || {}).e || "🧺"}</span>`}</div>
            <div><label class="btn btn-ghost btn-sm file-btn">${icon("upload", 16)} ${p.image ? "Replace photo" : "Upload photo"}<input type="file" accept="image/*" id="img-in" hidden></label>
            ${p.image ? `<button type="button" class="btn btn-ghost btn-sm danger" data-img-remove>Remove</button>` : ""}
            <p class="form-hint">Square photo on a plain background works best. It's resized automatically.</p></div>
          </div>
          <label class="field"><span>Product name</span><input name="name" value="${esc(p.name)}" required></label>
          <div class="form-row two">
            <label class="field"><span>Category</span><select name="category" class="select">${D.categories.map((c) => `<option value="${c.id}" ${p.category === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select></label>
            <label class="field"><span>Label</span><select name="tag" class="select">${[["", "None"], ["New", "New"], ["Favourite", "Customer favourite"]].map(([v, l]) => `<option value="${v}" ${p.tag === v ? "selected" : ""}>${l}</option>`).join("")}</select></label>
          </div>
          <div class="form-row two">
            <label class="field"><span>Price (£)</span><input name="price" type="number" step="0.01" min="0" value="${p.price === "" ? "" : Number(p.price).toFixed(2)}" required></label>
            <label class="field"><span>Was price (£) <em>for a sale</em></span><input name="wasPrice" type="number" step="0.01" min="0" value="${p.wasPrice ? Number(p.wasPrice).toFixed(2) : ""}" placeholder="Leave blank if not on sale"></label>
          </div>
          <label class="check"><input type="checkbox" name="from" ${p.from ? "checked" : ""}> Show as "From £x" (more than one size)</label>
          <div class="form-row two">
            <label class="field"><span>Stock quantity</span><input name="stock" type="number" min="0" value="${p.stock == null ? "" : p.stock}" placeholder="Blank = don't track"></label>
            <label class="field"><span>Emoji if no photo</span><input name="emoji" maxlength="4" value="${esc(p.emoji || "")}"></label>
          </div>
          <label class="switch"><input type="checkbox" name="live" ${p.hidden ? "" : "checked"}><span class="slider"></span><span>Live in the shop</span></label>
          <p class="form-error" id="p-err" role="alert"></p>
        </div>
        <footer>
          ${id ? `<button type="button" class="btn btn-ghost btn-sm danger" data-del-product="${id}">${icon("trash", 15)} Delete</button>` : ""}
          <span class="grow"></span>
          <button type="button" class="btn btn-ghost btn-sm" data-close-drawer>Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">${id ? "Save changes" : "Add product"}</button>
        </footer>
        <input type="hidden" name="pid" value="${esc(p.id)}">
      </form>`;
    dr.classList.add("open"); dr.setAttribute("aria-hidden", "false"); document.body.classList.add("drawer-open");
    setTimeout(() => dr.querySelector('[name="name"]').focus(), 60);
  };
  const closeDrawer = () => { const dr = $("#drawer"); if (!dr) return; dr.classList.remove("open"); dr.setAttribute("aria-hidden", "true"); document.body.classList.remove("drawer-open"); };

  const resizeImage = (file) => new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => { const img = new Image(); img.onload = () => {
      const S2 = 480, c = document.createElement("canvas"); c.width = c.height = S2; const x = c.getContext("2d");
      const k = Math.min(S2 / img.width, S2 / img.height) * 0.94, w = img.width * k, h = img.height * k;
      x.drawImage(img, (S2 - w) / 2, (S2 - h) / 2, w, h);
      let url = c.toDataURL("image/webp", 0.82); if (!url.startsWith("data:image/webp")) url = c.toDataURL("image/jpeg", 0.85);
      res(url); }; img.onerror = rej; img.src = fr.result; };
    fr.onerror = rej; fr.readAsDataURL(file);
  });

  /* ---------- Inventory ---------- */
  let invF = "attention";
  const viewInventory = () => {
    const vis = products.filter((p) => !p.hidden);
    const counts = { out: vis.filter((p) => p.stock === 0).length, low: vis.filter((p) => stockState(p) === "low").length, ok: vis.filter((p) => stockState(p) === "ok").length, untracked: vis.filter((p) => p.stock == null).length };
    const list = vis.filter((p) => invF === "attention" ? ["out", "low"].includes(stockState(p)) : invF === "tracked" ? p.stock != null : stockState(p) === invF)
      .sort((a, b) => (a.stock == null ? 1e9 : a.stock) - (b.stock == null ? 1e9 : b.stock));
    return `
      <div class="kpis four">
        ${["out", "low", "ok", "untracked"].map((k) => `<button class="kpi ${k === "out" && counts.out ? "warn" : ""} ${invF === k ? "sel" : ""}" data-inv="${k}"><span>${{ out: "Out of stock", low: `Low (≤ ${low()})`, ok: "In stock", untracked: "Not tracked" }[k]}</span><b>${counts[k]}</b><small>products</small></button>`).join("")}
      </div>
      <div class="seg inv-seg">${[["attention", "Needs attention"], ["tracked", "All tracked"], ["untracked", "Not tracked"]].map(([v, l]) => `<button class="${invF === v ? "active" : ""}" data-inv="${v}">${l}</button>`).join("")}</div>
      <div class="a-card table-card">
        <div class="table-wrap"><table class="ptable inv">
          <thead><tr><th>Product</th><th>Status</th><th>In stock</th><th>Adjust</th><th>Restock to</th></tr></thead>
          <tbody>${list.map((p) => `
            <tr data-id="${p.id}">
              <td><button class="p-cell" data-edit="${p.id}">${thumb(p)}<span><b>${esc(p.name)}</b><small>${esc(catById[p.category].name)}</small></span></button></td>
              <td><span class="st st-${stockState(p)}">${{ out: "Out of stock", low: "Low", ok: "In stock", untracked: "Not tracked" }[stockState(p)]}</span></td>
              <td class="num"><b>${p.stock == null ? "—" : p.stock}</b></td>
              <td><div class="adj"><button class="icon-b" data-adj="-1" aria-label="Remove one">${icon("minus", 15)}</button><button class="icon-b" data-adj="1" aria-label="Add one">${icon("plus", 15)}</button><button class="icon-b txt" data-adj="10">+10</button></div></td>
              <td><form class="restock" data-restock="${p.id}"><input type="number" min="0" placeholder="${p.stock == null ? "Start at" : "Qty"}" aria-label="Restock quantity"><button class="btn btn-sm btn-ghost">${p.stock == null ? "Track" : "Set"}</button></form></td>
            </tr>`).join("") || `<tr><td colspan="5" class="empty-row">${invF === "attention" ? "Nothing is out of stock or running low. 🎉" : "No products here."}</td></tr>`}</tbody>
        </table></div>
        <p class="table-foot muted">Stock goes down automatically when a customer places an order. "Not tracked" products are always shown as in stock.</p>
      </div>`;
  };

  /* ---------- Discounts ---------- */
  const viewDiscounts = () => `
    <div class="adm-grid">
      <article class="a-card span-2">
        <div class="a-card-h"><h2>Discount codes</h2><span class="muted">Customers enter these at checkout</span></div>
        ${discounts.length ? `<div class="table-wrap"><table class="ptable codes"><thead><tr><th>Code</th><th>Discount</th><th>Min spend</th><th>Ends</th><th>Used</th><th>Active</th><th></th></tr></thead><tbody>
          ${discounts.map((d, i) => { const expired = d.expires && new Date(d.expires + "T23:59:59") < new Date(); return `<tr>
            <td><b class="code">${esc(d.code)}</b></td>
            <td>${d.type === "percent" ? `${d.value}% off` : d.type === "fixed" ? `${money(d.value)} off` : "Free delivery"}</td>
            <td>${d.minSpend ? money(d.minSpend) : "—"}</td>
            <td>${d.expires ? `${new Date(d.expires).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}${expired ? ` <span class="st st-out">Ended</span>` : ""}` : "No end date"}</td>
            <td class="num">${d.uses || 0}</td>
            <td><label class="switch"><input type="checkbox" data-code-active="${i}" ${d.active ? "checked" : ""}><span class="slider"></span><span class="sr-only">Active</span></label></td>
            <td><button class="icon-b" data-code-edit="${i}" aria-label="Edit">${icon("edit", 16)}</button><button class="icon-b danger" data-code-del="${i}" aria-label="Delete">${icon("trash", 16)}</button></td></tr>`; }).join("")}
        </tbody></table></div>` : `<div class="empty-a"><b>No discount codes yet</b><p class="muted">Create a code like WELCOME10 for 10% off a first order, or FREEDEL for free delivery.</p><button class="btn btn-primary btn-sm" data-new-code>${icon("plus", 16)} New code</button></div>`}
      </article>
      <article class="a-card">
        <div class="a-card-h"><h2>Category sale</h2></div>
        <form class="form" id="cat-sale">
          <label class="field"><span>Category</span><select name="cat" class="select">${D.categories.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></label>
          <label class="field"><span>Percent off</span><input name="pct" type="number" min="1" max="90" value="10" required></label>
          <button class="btn btn-primary btn-sm">Put category on sale</button>
          <p class="form-hint">Sets the current price as the "was" price and lowers the price. Products already on sale keep their original "was" price.</p>
        </form>
      </article>
      <article class="a-card">
        <div class="a-card-h"><h2>Current sales</h2></div>
        <p><b>${products.filter((p) => p.wasPrice).length}</b> products on sale.</p>
        <div class="form-actions"><a class="btn btn-ghost btn-sm" href="#products?status=sale">View sale products</a><button class="btn btn-ghost btn-sm danger" data-end-all>End all sales</button></div>
      </article>
    </div>`;
  const openCodeEditor = (i) => {
    const d = i == null ? { code: "", type: "percent", value: 10, minSpend: "", expires: "", active: true } : discounts[i];
    const dr = $("#drawer");
    dr.innerHTML = `
      <form class="drawer-in" id="code-form" data-i="${i == null ? "" : i}" novalidate>
        <header><h2>${i == null ? "New discount code" : "Edit discount code"}</h2><button type="button" class="icon-b" data-close-drawer aria-label="Close">${icon("close")}</button></header>
        <div class="drawer-body">
          <label class="field"><span>Code</span><input name="code" value="${esc(d.code)}" placeholder="e.g. WELCOME10" style="text-transform:uppercase" required></label>
          <label class="field"><span>Type</span><select name="type" class="select" id="code-type">${[["percent", "Percentage off"], ["fixed", "Fixed amount off (£)"], ["freeship", "Free delivery"]].map(([v, l]) => `<option value="${v}" ${d.type === v ? "selected" : ""}>${l}</option>`).join("")}</select></label>
          <label class="field" id="code-val" ${d.type === "freeship" ? "hidden" : ""}><span>Amount</span><input name="value" type="number" step="0.01" min="0" value="${esc(d.value)}"></label>
          <div class="form-row two">
            <label class="field"><span>Minimum spend (£) <em>optional</em></span><input name="minSpend" type="number" step="0.01" min="0" value="${esc(d.minSpend)}"></label>
            <label class="field"><span>End date <em>optional</em></span><input name="expires" type="date" value="${esc(d.expires)}"></label>
          </div>
          <label class="switch"><input type="checkbox" name="active" ${d.active ? "checked" : ""}><span class="slider"></span><span>Active</span></label>
          <p class="form-error" id="c-err" role="alert"></p>
        </div>
        <footer><span class="grow"></span><button type="button" class="btn btn-ghost btn-sm" data-close-drawer>Cancel</button><button class="btn btn-primary btn-sm" type="submit">Save code</button></footer>
      </form>`;
    dr.classList.add("open"); dr.setAttribute("aria-hidden", "false"); document.body.classList.add("drawer-open");
  };

  /* ---------- Orders ---------- */
  let of = "open";
  const orderTable = (list, compact) => `
    <div class="table-wrap"><table class="ptable orders-t"><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>
      ${list.map((o) => { const st = stageOf(o); const n = Object.values(o.items).reduce((a, b) => a + b, 0); return `
        <tr>
          <td><button class="link-b" data-order="${o.id}">#${esc(o.id)}</button></td>
          <td>${fmtDate(o.placed)}</td>
          <td>${esc(o.customer || "Customer")}${o.email ? `<small class="muted d-block">${esc(o.email)}</small>` : ""}</td>
          <td class="num">${n}</td>
          <td class="num"><b>${money(o.total)}</b></td>
          <td>${compact ? `<span class="st st-o${st}">${st < 0 ? "Cancelled" : STATUSES[st]}</span>` : `<select class="select st-sel st-o${st}" data-status="${o.id}">${STATUSES.map((s, i) => `<option value="${i}" ${st === i ? "selected" : ""}>${s}</option>`).join("")}<option value="-1" ${st < 0 ? "selected" : ""}>Cancelled</option></select>`}</td>
        </tr>
        ${compact ? "" : `<tr class="o-detail" id="od-${o.id}" hidden><td colspan="6">${orderDetail(o)}</td></tr>`}`; }).join("")}
    </tbody></table></div>`;
  const orderDetail = (o) => `
    <div class="od">
      <div><h3>Items</h3><table class="rcpt"><tbody>${Object.entries(o.items).map(([id, q]) => { const p = products.find((x) => x.id === id); return `<tr><td>${q} ×</td><td>${esc(p ? p.name : id)}</td><td>${p ? money(p.price * q) : ""}</td></tr>`; }).join("")}</tbody>
        <tfoot><tr><td></td><td>Subtotal</td><td>${money(o.subtotal)}</td></tr>${o.discount ? `<tr><td></td><td>Discount (${esc(o.code)})</td><td>−${money(o.discount)}</td></tr>` : ""}<tr><td></td><td>Delivery</td><td>${o.fee ? money(o.fee) : "Free"}</td></tr><tr class="t"><td></td><td>Total</td><td>${money(o.total)}</td></tr></tfoot></table></div>
      <div><h3>Delivery</h3><p>${esc(o.addressLine || "")}</p><p>${new Date(o.slotDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}, ${esc(o.slotTime || "")}</p>
        ${o.phone ? `<p>Phone: ${esc(o.phone)}</p>` : ""}${o.safePlace ? `<p>If out: ${esc(o.safePlace)}</p>` : ""}${o.notes ? `<p>Notes: ${esc(o.notes)}</p>` : ""}</div>
    </div>`;
  const viewOrders = () => {
    const os = orders();
    const list = os.filter((o) => { const s = stageOf(o); return of === "all" || (of === "open" && s >= 0 && s < 3) || (of === "done" && s === 3) || (of === "cancelled" && s < 0); });
    return `
      <div class="seg">${[["open", "To fulfil"], ["done", "Delivered"], ["cancelled", "Cancelled"], ["all", "All"]].map(([v, l]) => `<button class="${of === v ? "active" : ""}" data-of="${v}">${l} <small>${os.filter((o) => { const s = stageOf(o); return v === "all" || (v === "open" && s >= 0 && s < 3) || (v === "done" && s === 3) || (v === "cancelled" && s < 0); }).length}</small></button>`).join("")}</div>
      <div class="a-card table-card">${list.length ? orderTable(list, false) : `<div class="empty-a"><b>No orders here</b><p class="muted">Orders placed through the shop's checkout appear here. Change the status to keep customers updated; they see it in their account.</p></div>`}</div>`;
  };

  /* ---------- Settings ---------- */
  const viewSettings = () => `
    <div class="adm-grid">
      <article class="a-card span-2">
        <h2 class="mb">Delivery & store</h2>
        <form class="form" id="store-form">
          <div class="form-row two">
            <label class="field"><span>Free delivery over (£)</span><input name="freeDeliveryOver" type="number" step="0.01" min="0" value="${S.freeDeliveryOver}"></label>
            <label class="field"><span>Delivery fee under that (£)</span><input name="deliveryFee" type="number" step="0.01" min="0" value="${S.deliveryFee}"></label>
          </div>
          <div class="form-row two">
            <label class="field"><span>Order cut-off for next-day dispatch</span><input name="dispatchCutoff" value="${esc(S.dispatchCutoff)}" placeholder="11am"></label>
            <label class="field"><span>Low-stock warning at</span><input name="lowStockAt" type="number" min="1" value="${low()}"></label>
          </div>
          <div class="form-row two">
            <label class="field"><span>Contact email</span><input name="email" type="email" value="${esc(S.email)}" placeholder="hello@…"></label>
            <label class="field"><span>Contact phone</span><input name="phone" type="tel" value="${esc(S.phone)}"></label>
          </div>
          <div class="form-actions"><button class="btn btn-primary btn-sm">Save settings</button></div>
        </form>
      </article>
      <article class="a-card">
        <h2 class="mb">Backup</h2>
        <p class="muted small">Download everything (products, prices, stock, discount codes, settings, orders) or restore a backup.</p>
        <div class="form-actions"><button class="btn btn-ghost btn-sm" data-backup>${icon("dl", 16)} Download backup</button><label class="btn btn-ghost btn-sm file-btn">${icon("upload", 16)} Restore<input type="file" accept=".json,application/json" id="restore-in" hidden></label></div>
        <h2 class="mb mt">Reset</h2>
        <p class="muted small">Put every product back to the original catalogue. Discount codes, settings and orders are kept.</p>
        <button class="btn btn-ghost btn-sm danger" data-reset>Reset catalogue</button>
        <h2 class="mb mt">Passcode</h2>
        <button class="btn btn-ghost btn-sm" data-new-pass>Change passcode</button>
      </article>
    </div>`;

  /* ---------- CSV ---------- */
  const parseCSV = (text) => {
    const rows = []; let row = [], cur = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
      else if (c === '"') q = true; else if (c === ",") { row.push(cur); cur = ""; } else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; } else cur += c;
    }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    const head = (rows.shift() || []).map((h) => h.trim().toLowerCase());
    return rows.filter((r) => r.some((x) => x.trim())).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
  };
  const csvCell = (v) => { const s = String(v == null ? "" : v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const download = (name, text, type) => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); };
  let pendingImport = null;
  const importCSV = (rows) => {
    // Accepts this dashboard's export or a Shopify product export (Title / Variant Price / Variant Compare At Price / Variant Inventory Qty).
    const pick = (r, ...keys) => { for (const k of keys) if (r[k] != null && r[k] !== "") return r[k]; return ""; };
    const changes = [];
    const seen = new Set();
    rows.forEach((r) => {
      const name = pick(r, "name", "title"); const idv = pick(r, "id", "handle");
      if (!name && !idv) return;
      const p = products.find((x) => x.id === idv) || products.find((x) => x.id === D.slug(name)) || products.find((x) => x.name.toLowerCase() === name.toLowerCase());
      const price = parseFloat(pick(r, "price", "variant price"));
      const was = parseFloat(pick(r, "was_price", "variant compare at price"));
      const stock = pick(r, "stock", "variant inventory qty");
      const key = p ? p.id : D.slug(name); if (seen.has(key)) return; seen.add(key);
      if (p) {
        const diff = {};
        if (!isNaN(price) && r2(price) !== r2(p.price)) diff.price = [p.price, r2(price)];
        if (!isNaN(was) && r2(was) !== r2(p.wasPrice || 0)) diff.wasPrice = [p.wasPrice || 0, r2(was)];
        if (stock !== "" && parseInt(stock, 10) !== p.stock) diff.stock = [p.stock, parseInt(stock, 10) || 0];
        if (Object.keys(diff).length) changes.push({ id: p.id, name: p.name, diff });
      } else if (name && !isNaN(price)) changes.push({ id: null, name, isNew: true, price: r2(price), wasPrice: isNaN(was) ? undefined : r2(was), stock: stock === "" ? null : parseInt(stock, 10) || 0, category: D.categories.find((c) => c.name.toLowerCase() === pick(r, "category", "type", "product category").toLowerCase())?.id || D.categories[0].id });
    });
    pendingImport = changes;
    const dr = $("#drawer");
    const fmt = (k, v) => (k === "stock" ? (v == null ? "—" : v) : v ? money(v) : "—");
    dr.innerHTML = `
      <div class="drawer-in wide">
        <header><h2>Review import</h2><button type="button" class="icon-b" data-close-drawer aria-label="Close">${icon("close")}</button></header>
        <div class="drawer-body">
          ${changes.length ? `<p>${changes.filter((c) => !c.isNew).length} products will change and ${changes.filter((c) => c.isNew).length} will be added. Untick anything you don't want.</p>
          <table class="ptable imp"><thead><tr><th></th><th>Product</th><th>Change</th></tr></thead><tbody>
            ${changes.map((c, i) => `<tr><td><input type="checkbox" data-imp="${i}" checked aria-label="Include"></td><td><b>${esc(c.name)}</b>${c.isNew ? ` <span class="st st-new">New</span>` : ""}</td>
              <td>${c.isNew ? `${money(c.price)}${c.stock != null ? ` · stock ${c.stock}` : ""}` : Object.entries(c.diff).map(([k, [a, b]]) => `<div><span class="muted">${{ price: "Price", wasPrice: "Was", stock: "Stock" }[k]}:</span> ${fmt(k, a)} → <b>${fmt(k, b)}</b></div>`).join("")}</td></tr>`).join("")}
          </tbody></table>` : `<p>Every price and stock level in this file already matches the shop. Nothing to change.</p>`}
        </div>
        <footer><span class="grow"></span><button type="button" class="btn btn-ghost btn-sm" data-close-drawer>Cancel</button>${changes.length ? `<button class="btn btn-primary btn-sm" data-apply-import>Apply changes</button>` : ""}</footer>
      </div>`;
    dr.classList.add("open"); document.body.classList.add("drawer-open");
  };

  /* ---------- Router ---------- */
  const VIEWS = { overview: viewOverview, products: viewProducts, inventory: viewInventory, discounts: viewDiscounts, orders: viewOrders, settings: viewSettings };
  const parseHash = () => { const [v, qs] = (location.hash.slice(1) || "overview").split("?"); return { v: VIEWS[v] ? v : "overview", params: new URLSearchParams(qs || "") }; };
  const route = () => {
    if (!signedIn()) return renderGate();
    const { v, params } = parseHash();
    if (v === "products" && params.get("status")) pf.status = params.get("status");
    if (v === "inventory" && params.get("f")) invF = params.get("f");
    const y = window.scrollY;
    root.innerHTML = shell(v, VIEWS[v]());
    document.title = `${NAV.find((n) => n[0] === v)[1]} — DanyJ Admin`;
    return y;
  };
  const rerender = () => { const y = window.scrollY; const focusId = document.activeElement && document.activeElement.id; route(); window.scrollTo(0, y); if (focusId && document.getElementById(focusId)) { const el = document.getElementById(focusId); el.focus(); if (["text", "search"].includes(el.type)) el.setSelectionRange(el.value.length, el.value.length); } };
  window.addEventListener("hashchange", () => { selected.clear(); route(); window.scrollTo(0, 0); });
  window.addEventListener("storage", (e) => { if (e.key && e.key.startsWith("danyj:orders")) rerender(); });

  /* ---------- Events ---------- */
  document.addEventListener("input", (e) => {
    if (e.target.id === "p-q") { pf.q = e.target.value; rerender(); }
  });
  document.addEventListener("change", async (e) => {
    const t = e.target;
    if (t.id === "p-cat") { pf.cat = t.value; rerender(); return; }
    if (t.id === "p-status") { pf.status = t.value; rerender(); return; }
    if (t.dataset.sel) { t.checked ? selected.add(t.dataset.sel) : selected.delete(t.dataset.sel); rerender(); return; }
    if (t.id === "sel-all") { filteredProducts().forEach((p) => (t.checked ? selected.add(p.id) : selected.delete(p.id))); rerender(); return; }
    if (t.dataset.f) {
      const row = t.closest("tr"); const p = products.find((x) => x.id === row.dataset.id); const f = t.dataset.f;
      if (f === "price") { const v = parseFloat(t.value); if (isNaN(v) || v < 0) { toast("Enter a valid price"); t.value = p.price.toFixed(2); return; } p.price = r2(v); }
      if (f === "wasPrice") { const v = parseFloat(t.value); p.wasPrice = isNaN(v) || v <= p.price ? undefined : r2(v); if (!isNaN(v) && v > 0 && v <= p.price) toast("The was price must be higher than the price"); }
      if (f === "stock") p.stock = t.value === "" ? null : Math.max(0, parseInt(t.value, 10) || 0);
      if (f === "live") p.hidden = !t.checked;
      saveProducts(); toast(`${p.name} updated`); rerender(); return;
    }
    if (t.dataset.codeActive != null) { discounts[t.dataset.codeActive].active = t.checked; D.saveDiscounts(discounts); toast(t.checked ? "Code activated" : "Code paused"); return; }
    if (t.dataset.status) { const list = orders().map((o) => (o.id === t.dataset.status ? { ...o, status: t.value === "-1" ? null : Number(t.value), cancelled: t.value === "-1" } : o)); saveOrders(list); toast(`Order #${t.dataset.status}: ${t.value === "-1" ? "cancelled" : STATUSES[t.value]}`); rerender(); return; }
    if (t.id === "code-type") { $("#code-val").hidden = t.value === "freeship"; return; }
    if (t.id === "img-in" && t.files[0]) {
      try { editImage = await resizeImage(t.files[0]); $("#img-prev").innerHTML = `<img src="${editImage}" alt="">`; } catch (er) { toast("That file couldn't be read as an image"); }
      return;
    }
    if (t.id === "csv-in" && t.files[0]) { const text = await t.files[0].text(); importCSV(parseCSV(text)); t.value = ""; return; }
    if (t.id === "restore-in" && t.files[0]) {
      try {
        const b = JSON.parse(await t.files[0].text());
        if (!Array.isArray(b.catalog)) throw new Error("bad");
        SET("catalog", b.catalog); if (b.discounts) SET("discounts", b.discounts); if (b.storeSettings) SET("storeSettings", b.storeSettings); if (b.orders) SET("orders", b.orders);
        toast("Backup restored"); setTimeout(() => location.reload(), 600);
      } catch (er) { toast("That isn't a DanyJ backup file"); }
    }
  });

  document.addEventListener("submit", (e) => {
    const f = e.target;
    if (f.id === "p-form") {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(f).entries()); const err = $("#p-err");
      const price = parseFloat(v.price), was = parseFloat(v.wasPrice);
      if (!v.name.trim()) return (err.textContent = "Give the product a name.");
      if (isNaN(price) || price < 0) return (err.textContent = "Enter a price, like 4.99.");
      if (!isNaN(was) && was > 0 && was <= price) return (err.textContent = "The was price must be higher than the price, or leave it blank.");
      const rec = { name: v.name.trim(), category: v.category, tag: v.tag, price: r2(price), wasPrice: isNaN(was) || was <= 0 ? undefined : r2(was), from: !!v.from,
        stock: v.stock === "" ? null : Math.max(0, parseInt(v.stock, 10) || 0), emoji: v.emoji.trim(), hidden: !v.live, image: editImage };
      if (v.pid) { const i = products.findIndex((p) => p.id === v.pid); products[i] = { ...products[i], ...rec }; }
      else products.unshift({ id: uniqueId(rec.name), ...rec });
      saveProducts(); closeDrawer(); toast(v.pid ? "Product saved" : "Product added"); rerender();
    } else if (f.id === "code-form") {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(f).entries()); const err = $("#c-err");
      const code = v.code.trim().toUpperCase().replace(/\s+/g, "");
      if (!/^[A-Z0-9_-]{3,20}$/.test(code)) return (err.textContent = "Use 3–20 letters or numbers, no spaces.");
      const idx = f.dataset.i === "" ? -1 : Number(f.dataset.i);
      if (discounts.some((d, i) => d.code === code && i !== idx)) return (err.textContent = "That code already exists.");
      const val = parseFloat(v.value);
      if (v.type !== "freeship" && (isNaN(val) || val <= 0 || (v.type === "percent" && val > 90))) return (err.textContent = v.type === "percent" ? "Enter a percentage between 1 and 90." : "Enter an amount, like 5.");
      const rec = { code, type: v.type, value: v.type === "freeship" ? 0 : r2(val), minSpend: v.minSpend ? r2(v.minSpend) : "", expires: v.expires, active: !!v.active, uses: idx >= 0 ? discounts[idx].uses || 0 : 0 };
      idx >= 0 ? (discounts[idx] = rec) : discounts.unshift(rec);
      D.saveDiscounts(discounts); closeDrawer(); toast("Discount code saved"); rerender();
    } else if (f.id === "cat-sale") {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(f).entries()); const pct = Number(v.pct);
      if (!(pct > 0 && pct <= 90)) return toast("Enter a percentage between 1 and 90");
      let n = 0;
      products.forEach((p) => { if (p.category === v.cat) { const base = p.wasPrice || p.price; p.wasPrice = base; p.price = r2(base * (1 - pct / 100)); n++; } });
      saveProducts(); toast(`${n} products in ${catById[v.cat].name} are now ${pct}% off`); rerender();
    } else if (f.dataset.restock) {
      e.preventDefault();
      const val = f.querySelector("input").value; if (val === "") return;
      const p = products.find((x) => x.id === f.dataset.restock); p.stock = Math.max(0, parseInt(val, 10) || 0);
      saveProducts(); toast(`${p.name}: stock set to ${p.stock}`); rerender();
    } else if (f.id === "store-form") {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(f).entries());
      const patch = { freeDeliveryOver: r2(v.freeDeliveryOver || 0), deliveryFee: r2(v.deliveryFee || 0), dispatchCutoff: v.dispatchCutoff.trim() || "11am", lowStockAt: Math.max(1, parseInt(v.lowStockAt, 10) || 5), email: v.email.trim(), phone: v.phone.trim() };
      Object.assign(S, patch); D.saveStore(patch); toast("Settings saved");
    }
  });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a, [data-close-drawer]");
    if (!t) return;
    const d = t.dataset;
    if ("closeDrawer" in d) { closeDrawer(); return; }
    if ("menu" in d) { $("#adm-side").classList.toggle("open"); return; }
    if (t.closest("#adm-side") && t.matches("nav a")) $("#adm-side").classList.remove("open");
    if ("lock" in d) { try { sessionStorage.removeItem("danyj:admin"); } catch (er) { /* blocked */ } route(); return; }
    if ("newProduct" in d) openEditor(null);
    else if (d.edit) openEditor(d.edit);
    else if ("imgRemove" in d) { editImage = null; $("#img-prev").innerHTML = `<span>🧺</span>`; t.remove(); }
    else if (d.delProduct) {
      if (!t.dataset.armed) { t.dataset.armed = "1"; t.textContent = "Tap again to delete"; return; }
      products = products.filter((p) => p.id !== d.delProduct); saveProducts(); closeDrawer(); toast("Product deleted"); rerender();
    }
    else if (d.bulk) {
      const ids = [...selected]; const sel = products.filter((p) => ids.includes(p.id));
      if (d.bulk === "sale") { const pct = Number($("#bulk-pct").value); if (!(pct > 0 && pct <= 90)) return toast("Enter a percentage between 1 and 90"); sel.forEach((p) => { const base = p.wasPrice || p.price; p.wasPrice = base; p.price = r2(base * (1 - pct / 100)); }); toast(`${sel.length} products now ${pct}% off`); }
      if (d.bulk === "endsale") { sel.forEach((p) => { if (p.wasPrice) { p.price = p.wasPrice; p.wasPrice = undefined; } }); toast("Sale ended for selected products"); }
      if (d.bulk === "stock") { const v = $("#bulk-stock").value; if (v === "") return toast("Enter a stock quantity"); sel.forEach((p) => (p.stock = Math.max(0, parseInt(v, 10) || 0))); toast(`Stock set to ${v} for ${sel.length} products`); }
      if (d.bulk === "hide" || d.bulk === "show") { sel.forEach((p) => (p.hidden = d.bulk === "hide")); toast(`${sel.length} products ${d.bulk === "hide" ? "hidden" : "shown"}`); }
      if (d.bulk === "clear") selected.clear(); else saveProducts();
      rerender();
    }
    else if ("exportCsv" in d) {
      const head = ["id", "name", "category", "price", "was_price", "stock", "hidden", "label"];
      const lines = [head.join(","), ...products.map((p) => [p.id, p.name, catById[p.category].name, p.price.toFixed(2), p.wasPrice ? p.wasPrice.toFixed(2) : "", p.stock == null ? "" : p.stock, p.hidden ? "yes" : "", p.tag || ""].map(csvCell).join(","))];
      download(`danyj-products-${new Date().toISOString().slice(0, 10)}.csv`, lines.join("\n"), "text/csv"); toast("Product list downloaded");
    }
    else if ("applyImport" in d) {
      const keep = $$("[data-imp]").filter((c) => c.checked).map((c) => pendingImport[Number(c.dataset.imp)]);
      keep.forEach((c) => {
        if (c.isNew) products.unshift({ id: uniqueId(c.name), name: c.name, category: c.category, price: c.price, wasPrice: c.wasPrice, stock: c.stock, tag: "", image: null });
        else { const p = products.find((x) => x.id === c.id); Object.entries(c.diff).forEach(([k, [, b]]) => (p[k] = k === "wasPrice" && !b ? undefined : b)); }
      });
      saveProducts(); closeDrawer(); toast(`${keep.length} changes applied`); rerender();
    }
    else if (d.inv) { invF = d.inv; rerender(); }
    else if (d.adj) { const id = t.closest("tr").dataset.id; const p = products.find((x) => x.id === id); p.stock = Math.max(0, (p.stock || 0) + Number(d.adj)); saveProducts(); rerender(); }
    else if ("newCode" in d) openCodeEditor(null);
    else if (d.codeEdit != null) openCodeEditor(Number(d.codeEdit));
    else if (d.codeDel != null) { if (!t.dataset.armed) { t.dataset.armed = "1"; t.classList.add("armed"); t.title = "Tap again to delete"; toast("Tap the bin again to delete this code"); return; } discounts.splice(Number(d.codeDel), 1); D.saveDiscounts(discounts); toast("Code deleted"); rerender(); }
    else if ("endAll" in d) { if (!t.dataset.armed) { t.dataset.armed = "1"; t.textContent = "Tap again to end all sales"; return; } products.forEach((p) => { if (p.wasPrice) { p.price = p.wasPrice; p.wasPrice = undefined; } }); saveProducts(); toast("All sales ended"); rerender(); }
    else if (d.of) { of = d.of; rerender(); }
    else if (d.order) { const row = $("#od-" + d.order); if (row) row.hidden = !row.hidden; else location.hash = "orders"; }
    else if ("backup" in d) { download(`danyj-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ exported: new Date().toISOString(), catalog: LS("catalog", D.defaults), discounts, storeSettings: LS("storeSettings", {}), orders: orders() }, null, 2), "application/json"); toast("Backup downloaded"); }
    else if ("reset" in d) { if (!t.dataset.armed) { t.dataset.armed = "1"; t.textContent = "Tap again to reset every product"; return; } try { localStorage.removeItem("danyj:catalog"); } catch (er) { /* blocked */ } toast("Catalogue reset"); setTimeout(() => location.reload(), 500); }
    else if ("newPass" in d) { try { localStorage.removeItem("danyj:adminPass"); sessionStorage.removeItem("danyj:admin"); } catch (er) { /* blocked */ } route(); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  route();
})();
