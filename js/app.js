/* FarmLink Food Market — shared app logic (header, footer, cart, product cards) */
(function () {
  "use strict";

  const D = window.FARMLINK;
  const S = D.store;

  /* ---------- Icons (Lucide-style, inline) ---------- */
  const ICONS = {
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
    sparkle: '<path d="M12 2c.4 4.6 2.4 7.6 8 8-5.6.4-7.6 3.4-8 8-.4-4.6-2.4-7.6-8-8 5.6-.4 7.6-3.4 8-8Z" fill="currentColor" stroke="none"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4A1 1 0 0 0 17.5 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1Z"/><path d="m9 12 2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8Z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2Z"/>',
    star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z" fill="currentColor" stroke="none"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5Z"/>',
    box: '<path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z"/>',
    tiktok: '<path d="M9 12a4 4 0 1 0 4 4V2a5 5 0 0 0 5 5"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
  };
  const icon = (name, size = 20, extra = "") =>
    `<svg class="icon ${extra}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const money = (n) => new Intl.NumberFormat("en-GB", { style: "currency", currency: S.currency }).format(n);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const store = {
    get(key, fallback) { try { const v = localStorage.getItem("farmlink:" + key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
    set(key, value) { try { localStorage.setItem("farmlink:" + key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ } },
  };

  const byId = {};
  D.products.forEach((p) => (byId[p.id] = p));
  D.bundles.forEach((b) => (byId[b.id] = { ...b, category: "bundle", isBundle: true }));
  const producerById = Object.fromEntries(D.producers.map((p) => [p.id, p]));
  const categoryById = Object.fromEntries(D.categories.map((c) => [c.id, c]));

  const thumb = (item, cls = "", inner = "") => {
    const bg = item.tint || "var(--mint)";
    const content = item.image
      ? `<img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy">`
      : `<span class="emoji" role="img" aria-label="${esc(item.name)}">${item.emoji || "🧺"}</span>`;
    return `<div class="thumb ${cls}" style="background:${bg}">${inner}${content}</div>`;
  };

  /* ---------- Cart ---------- */
  let cart = store.get("cart", {}); // { id: qty }
  const listeners = [];

  const Cart = {
    qty: (id) => cart[id] || 0,
    count: () => Object.values(cart).reduce((a, b) => a + b, 0),
    subtotal: () => Object.entries(cart).reduce((sum, [id, q]) => sum + (byId[id] ? byId[id].price * q : 0), 0),
    set(id, q) {
      if (q <= 0) delete cart[id]; else cart[id] = Math.min(q, 99);
      store.set("cart", cart);
      if (q > 0) {
        const hist = store.get("history", []).filter((h) => h !== id);
        hist.unshift(id);
        store.set("history", hist.slice(0, 12));
      }
      listeners.forEach((fn) => fn());
    },
    add(id, n = 1) { Cart.set(id, Cart.qty(id) + n); },
    onChange(fn) { listeners.push(fn); },
  };

  let favs = store.get("favs", []);
  const toggleFav = (id) => {
    favs = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    store.set("favs", favs);
    return favs.includes(id);
  };

  /* ---------- Product card ---------- */
  const BADGES = {
    "Top pick": ["top", icon("sparkle", 12) + " Top pick"],
    Seasonal: ["seasonal", icon("leaf", 12) + " Seasonal"],
    Offer: ["offer", "Offer"],
    New: ["new", "New"],
  };

  const cartControl = (id) => {
    const q = Cart.qty(id);
    if (!q) return `<button class="add-btn" data-add="${id}" aria-label="Add to basket">${icon("plus", 20)}</button>`;
    return `<div class="stepper" role="group" aria-label="Quantity">
      <button data-dec="${id}" aria-label="Decrease">${icon("minus", 16)}</button>
      <span>${q}</span>
      <button data-inc="${id}" aria-label="Increase">${icon("plus", 16)}</button>
    </div>`;
  };

  const productCard = (p) => {
    const prod = producerById[p.producer];
    const badge = p.badge && BADGES[p.badge];
    const fav = favs.includes(p.id);
    const items = p.items ? `<div class="bundle-items" aria-label="Includes">${p.items.map((i) => byId[i] ? `<span title="${esc(byId[i].name)}">${byId[i].emoji}</span>` : "").join("")}</div>` : "";
    return `<article class="card ${p.isBundle ? "bundle" : ""}" data-id="${p.id}">
      ${thumb(p, "media",
        (badge ? `<span class="card-badge ${badge[0]}">${badge[1]}</span>` : "") +
        `<button class="fav-btn ${fav ? "on" : ""}" data-fav="${p.id}" aria-label="Save to favourites" aria-pressed="${fav}">${icon("heart", 17)}</button>`)}
      <div class="card-body">
        ${prod ? `<div class="producer"><span class="avatar">${initials(prod.name)}</span><div><b>${esc(prod.name)}</b><span>${esc(prod.county)}</span></div></div>` : ""}
        <h3>${esc(p.name)}</h3>
        <p class="desc">${esc(p.desc)}</p>
        ${items}
        <div class="price-row">
          <span class="price">${money(p.price)}</span>
          <span class="price-unit">/ ${esc(p.unit)}</span>
          ${p.wasPrice ? `<span class="was">${money(p.wasPrice)}</span>` : ""}
        </div>
      </div>
      <div class="card-foot">
        <span class="stock ${p.seasonal ? "seasonal" : ""}">${p.isBundle ? "Weekly box" : p.seasonal ? "Seasonal" : "In stock"}</span>
        <span data-control="${p.id}">${cartControl(p.id)}</span>
      </div>
    </article>`;
  };

  const refreshControls = () => {
    $$("[data-control]").forEach((el) => (el.innerHTML = cartControl(el.dataset.control)));
    $$("[data-cart-count]").forEach((el) => { const c = Cart.count(); el.textContent = c; el.dataset.count = c; });
  };

  /* ---------- Toast ---------- */
  let toastTimer;
  const toast = (msg) => {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = icon("check", 18) + `<span>${esc(msg)}</span>`;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  };

  /* ---------- Shell: header, footer, drawer ---------- */
  const NAV = [
    ["index.html", "Discover"],
    ["shop.html", "Shop"],
    ["index.html#producers", "Producers"],
    ["shop.html?filter=seasonal", "Seasonal"],
    ["index.html#bundles", "Bundles"],
    ["index.html#how", "How it works"],
  ];

  const renderShell = () => {
    const page = document.body.dataset.page;
    const isActive = (href, label) => (page === "home" && label === "Discover") || (page === "shop" && label === "Shop");
    const navLinks = NAV.map(([href, label]) => `<a href="${href}" class="${isActive(href, label) ? "active" : ""}">${label}</a>`).join("");
    const logo = `<a href="index.html" class="logo" aria-label="${esc(S.fullName)} home">
        <span class="logo-mark">${icon("leaf", 20)}</span>
        <span>${esc(S.name)}<small>Food Market</small></span>
      </a>`;

    $("#site-header").outerHTML = `
      <div class="announce">${icon("truck", 14)} <strong>Free delivery</strong> on orders over ${money(S.freeDeliveryOver)} · Fresh from local farms</div>
      <header class="header" id="header">
        <div class="container header-inner">
          <button class="icon-btn menu-btn" data-open-menu aria-label="Open menu">${icon("menu", 22)}</button>
          ${logo}
          <button class="location" data-postcode-jump>${icon("pin", 17)} <span data-area>${esc(store.get("area", S.defaultArea))}</span> ${icon("chevron", 15)}</button>
          <nav class="nav" aria-label="Main">${navLinks}</nav>
          <div class="header-actions">
            <a class="icon-btn" href="shop.html#search" aria-label="Search">${icon("search", 21)}</a>
            <button class="icon-btn" data-open-cart aria-label="Open basket">${icon("bag", 21)}<span class="badge-count" data-cart-count data-count="0">0</span></button>
            <a class="icon-btn" href="#" aria-label="Account">${icon("user", 21)}</a>
          </div>
        </div>
      </header>
      <aside class="mobile-nav" id="mobile-nav" aria-label="Mobile menu">
        <div style="display:flex;justify-content:space-between;align-items:center">${logo}<button class="icon-btn" data-close aria-label="Close menu">${icon("close")}</button></div>
        <nav>${navLinks}</nav>
      </aside>`;

    const year = new Date().getFullYear();
    $("#site-footer").outerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              ${logo}
              <p>${esc(S.tagline)}. Seasonal produce and pantry staples from trusted local producers, delivered to your door.</p>
              <div class="socials">
                <a href="#" aria-label="Instagram">${icon("instagram", 18)}</a>
                <a href="#" aria-label="Facebook">${icon("facebook", 18)}</a>
                <a href="#" aria-label="TikTok">${icon("tiktok", 18)}</a>
              </div>
            </div>
            <div><h4>Shop</h4><ul>
              ${D.categories.slice(0, 5).map((c) => `<li><a href="shop.html?cat=${c.id}">${esc(c.name)}</a></li>`).join("")}
              <li><a href="index.html#bundles">Weekly bundles</a></li>
            </ul></div>
            <div><h4>Help</h4><ul>
              <li><a href="index.html#how">How it works</a></li>
              <li><a href="index.html#delivery">Delivery areas</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Returns & refunds</a></li>
              <li><a href="#">Become a producer</a></li>
            </ul></div>
            <div><h4>Contact</h4><ul>
              <li style="display:flex;gap:8px;align-items:center">${icon("mail", 16)}<a href="mailto:${esc(S.email)}">${esc(S.email)}</a></li>
              <li style="display:flex;gap:8px;align-items:center">${icon("phone", 16)}<span>${esc(S.phone)}</span></li>
              <li style="display:flex;gap:8px;align-items:center">${icon("pin", 16)}<span>${esc(S.address)}</span></li>
            </ul></div>
          </div>
          <div class="footer-bottom">
            <span>© ${year} ${esc(S.fullName)}. All rights reserved.</span>
            <span><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Cookies</a></span>
          </div>
        </div>
      </footer>
      <div class="overlay" id="overlay"></div>
      <aside class="drawer" id="cart" aria-label="Your basket" aria-hidden="true">
        <div class="drawer-head"><h3>Your basket</h3><button class="icon-btn" data-close aria-label="Close basket">${icon("close")}</button></div>
        <div class="drawer-body" id="cart-body"></div>
        <div class="drawer-foot" id="cart-foot"></div>
      </aside>`;
  };

  const renderCart = () => {
    const body = $("#cart-body"), foot = $("#cart-foot");
    if (!body) return;
    const lines = Object.entries(cart).filter(([id]) => byId[id]);
    const sub = Cart.subtotal();
    const remaining = Math.max(0, S.freeDeliveryOver - sub);
    const pct = Math.min(100, (sub / S.freeDeliveryOver) * 100);
    if (!lines.length) {
      body.innerHTML = `<div class="cart-empty"><div class="big">🧺</div><b>Your basket is empty</b><p style="margin:6px 0 20px">Fill it with something fresh.</p><a class="btn btn-primary" href="shop.html">Start shopping</a></div>`;
      foot.style.display = "none";
      return;
    }
    foot.style.display = "";
    body.innerHTML = `
      <div class="ship-meter">${remaining > 0 ? `You're <b>${money(remaining)}</b> away from free delivery` : `🎉 You've unlocked <b>free delivery</b>`}<div class="bar"><i style="width:${pct}%"></i></div></div>
      ${lines.map(([id, q]) => { const p = byId[id]; return `
        <div class="cart-line">
          ${thumb(p)}
          <div class="grow"><b>${esc(p.name)}</b><span class="unit">${money(p.price)} / ${esc(p.unit)}</span></div>
          <div class="line-right">
            <span class="line-price">${money(p.price * q)}</span>
            <div class="stepper light"><button data-dec="${id}" aria-label="Decrease">${icon(q === 1 ? "trash" : "minus", 15)}</button><span>${q}</span><button data-inc="${id}" aria-label="Increase">${icon("plus", 15)}</button></div>
          </div>
        </div>`; }).join("")}`;
    const fee = remaining > 0 ? S.deliveryFee : 0;
    foot.innerHTML = `
      <div class="sum-row"><span>Subtotal</span><span>${money(sub)}</span></div>
      <div class="sum-row"><span>Delivery</span><span>${fee ? money(fee) : "Free"}</span></div>
      <div class="sum-row total"><span>Total</span><span>${money(sub + fee)}</span></div>
      <button class="btn btn-primary btn-block" data-checkout>Checkout ${icon("arrow", 18)}</button>
      <p style="font-size:12.5px;color:var(--ink-3);text-align:center;margin-top:10px">${icon("clock", 13)} Next delivery: ${esc(S.nextDelivery)}</p>`;
  };

  /* ---------- Panels ---------- */
  const openPanel = (id) => {
    $("#" + id).classList.add("open");
    $("#" + id).setAttribute("aria-hidden", "false");
    $("#overlay").classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const closePanels = () => {
    $$(".drawer.open, .mobile-nav.open, .filters.open").forEach((el) => { el.classList.remove("open"); el.setAttribute("aria-hidden", "true"); });
    const ov = $("#overlay"); if (ov) ov.classList.remove("open");
    document.body.style.overflow = "";
  };

  /* ---------- Global events ---------- */
  const bindGlobal = () => {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-fav],[data-open-cart],[data-open-menu],[data-close],[data-checkout],#overlay,[data-postcode-jump]");
      if (!t) return;
      if (t.dataset.add) { Cart.add(t.dataset.add); toast(`${byId[t.dataset.add].name} added to basket`); }
      else if (t.dataset.inc) Cart.add(t.dataset.inc);
      else if (t.dataset.dec) Cart.add(t.dataset.dec, -1);
      else if (t.dataset.fav) { e.preventDefault(); const on = toggleFav(t.dataset.fav); t.classList.toggle("on", on); t.setAttribute("aria-pressed", on); toast(on ? "Saved to favourites" : "Removed from favourites"); }
      else if (t.hasAttribute("data-open-cart")) openPanel("cart");
      else if (t.hasAttribute("data-open-menu")) openPanel("mobile-nav");
      else if (t.hasAttribute("data-close") || t.id === "overlay") closePanels();
      else if (t.hasAttribute("data-checkout")) toast("Checkout coming soon — connect your payment provider");
      else if (t.hasAttribute("data-postcode-jump")) {
        const target = $("#delivery");
        if (target) { target.scrollIntoView({ behavior: "smooth" }); setTimeout(() => $("#postcode-input")?.focus(), 500); }
        else location.href = "index.html#delivery";
      }
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanels(); });
    const header = $("#header");
    const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  /* ---------- Live search ---------- */
  const search = (q) => {
    q = q.trim().toLowerCase();
    if (!q) return [];
    return Object.values(byId).filter((p) => {
      const prod = producerById[p.producer];
      const cat = categoryById[p.category];
      return [p.name, p.desc, prod && prod.name, cat && cat.name].some((s) => s && s.toLowerCase().includes(q));
    });
  };

  const bindLiveSearch = (form) => {
    const input = $("input", form), box = $(".search-results", form);
    let focus = -1;
    const render = () => {
      const res = search(input.value).slice(0, 6);
      focus = -1;
      if (!input.value.trim()) { box.classList.remove("open"); return; }
      box.innerHTML = res.length
        ? res.map((p) => `<a class="search-result" href="shop.html?q=${encodeURIComponent(p.name)}">${thumb(p)}<div class="meta"><b>${esc(p.name)}</b><span>${esc(p.unit)}${producerById[p.producer] ? " · " + esc(producerById[p.producer].name) : ""}</span></div><span class="price">${money(p.price)}</span></a>`).join("")
        : `<div class="search-empty">No matches for “${esc(input.value)}”. Try “eggs” or “honey”.</div>`;
      box.classList.add("open");
    };
    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    input.addEventListener("keydown", (e) => {
      const items = $$(".search-result", box);
      if (!items.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        focus = (focus + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items.forEach((el, i) => el.classList.toggle("focus", i === focus));
      } else if (e.key === "Enter" && focus >= 0) { e.preventDefault(); items[focus].click(); }
    });
    document.addEventListener("click", (e) => { if (!form.contains(e.target)) box.classList.remove("open"); });
    form.addEventListener("submit", (e) => { e.preventDefault(); location.href = "shop.html?q=" + encodeURIComponent(input.value.trim()); });
  };

  /* ---------- Init ---------- */
  renderShell();
  bindGlobal();
  Cart.onChange(() => { refreshControls(); renderCart(); });
  document.addEventListener("DOMContentLoaded", () => { refreshControls(); renderCart(); });

  window.FL = { D, Cart, byId, producerById, categoryById, productCard, thumb, icon, money, esc, initials, store, search, bindLiveSearch, refreshControls, toast, openPanel, closePanels, $, $$ };
})();
