/* DanyJ Food Market — account area
 * Sign in / create account, overview, basket & checkout, orders with tracking and
 * buy again, favourites, address book, payment methods and settings.
 * Everything is stored in this browser only until a real backend is connected.
 */
(function () {
  "use strict";
  const { D, Cart, byId, categoryById, productCard, thumb, icon, money, esc, store, toast, refreshControls, $, $$ } = window.FL;
  const S = D.store;
  const root = $("#acc");

  const SECTIONS = [
    ["overview", "Overview", "home"],
    ["basket", "Basket & checkout", "bag"],
    ["orders", "My orders", "receipt"],
    ["favourites", "Favourites", "heart"],
    ["addresses", "Addresses", "pin"],
    ["payment", "Payment methods", "card"],
    ["settings", "Settings", "gear"],
  ];
  const STEPS = ["Order placed", "Being packed", "Dispatched", "Delivered"];

  /* ---------- Data ---------- */
  const getUser = () => store.get("user", null);
  const getOrders = () => store.get("orders", []);
  const getAddresses = () => store.get("addresses", []);
  const getPrefs = () => store.get("prefs", { offers: true, sms: true, safePlace: "Front door", notes: "" });
  const save = (k, v) => store.set(k, v);
  const uid = () => Math.random().toString(36).slice(2, 8).toUpperCase();
  const fmtDate = (t, opts = { day: "numeric", month: "short", year: "numeric" }) => new Date(t).toLocaleDateString("en-GB", opts);
  const firstName = (u) => (u && u.first) || "there";

  // Order progress is estimated from the time since it was placed, until a
  // real order system reports the status.
  const stageOf = (o) => {
    if (o.cancelled) return -1;
    if (o.status != null) return o.status; // set by the shop in Admin → Orders
    const hrs = (Date.now() - o.placed) / 36e5;
    return hrs < 0.5 ? 0 : hrs < 4 ? 1 : hrs < 24 ? 2 : 3;
  };
  const orderTotal = (o) => Object.entries(o.items).reduce((s, [id, q]) => s + (byId[id] ? byId[id].price * q : 0), 0);
  const orderCount = (o) => Object.values(o.items).reduce((a, b) => a + b, 0);
  const deliveryFee = (sub, freeShip) => (freeShip || sub >= S.freeDeliveryOver ? 0 : S.deliveryFee);
  // Discount codes created in Admin → Discounts
  const findCode = (code) => (D.discounts || []).find((d) => d.active && d.code.toUpperCase() === String(code || "").trim().toUpperCase() && (!d.expires || new Date(d.expires + "T23:59:59") >= new Date()));
  const discountFor = (code, sub) => {
    const d = findCode(code);
    if (!d || sub < (Number(d.minSpend) || 0)) return { d: null, amount: 0, freeShip: false };
    if (d.type === "freeship") return { d, amount: 0, freeShip: true };
    const amount = d.type === "percent" ? Math.round(sub * Number(d.value)) / 100 : Math.min(sub, Number(d.value));
    return { d, amount, freeShip: false };
  };

  // Delivery slots: the next 5 days, morning / afternoon / evening, starting tomorrow
  // (or the day after if it's past the dispatch cut-off).
  const slotDays = () => {
    const cutoffHour = parseInt(S.dispatchCutoff, 10) || 11;
    const start = new Date(); start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + (new Date().getHours() >= cutoffHour ? 2 : 1));
    return Array.from({ length: 5 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
  };
  const SLOT_TIMES = [["am", "8am – 12pm"], ["pm", "12pm – 5pm"], ["eve", "5pm – 9pm"]];

  /* ---------- Sign in / create account ---------- */
  const renderSignIn = (mode = "create") => {
    const wantsCheckout = location.hash === "#basket";
    root.innerHTML = `
      <section class="auth">
        <div class="auth-art" aria-hidden="true">
          <div class="auth-art-inner">
            <span class="pill">${icon("sparkle", 14)} Your DanyJ account</span>
            <h2>A taste of home, one tap away</h2>
            <ul class="auth-perks">
              <li>${icon("repeat", 18)} Buy your regulars again in one tap</li>
              <li>${icon("truck", 18)} Track every order to your door</li>
              <li>${icon("pin", 18)} Save addresses for a faster checkout</li>
              <li>${icon("heart", 18)} Keep a list of your favourites</li>
            </ul>
          </div>
        </div>
        <div class="auth-card">
          ${wantsCheckout ? `<p class="auth-note">${icon("bag", 16)} Sign in or create an account to check out your basket (${Cart.count()} ${Cart.count() === 1 ? "item" : "items"}, ${money(Cart.subtotal())}).</p>` : ""}
          <div class="seg auth-tabs" role="tablist">
            <button role="tab" class="${mode === "create" ? "active" : ""}" data-auth-mode="create">Create account</button>
            <button role="tab" class="${mode === "signin" ? "active" : ""}" data-auth-mode="signin">Sign in</button>
          </div>
          <form id="auth-form" class="form" novalidate>
            ${mode === "create" ? `
            <div class="form-row two">
              <label class="field"><span>First name</span><input id="f-first" autocomplete="given-name" required></label>
              <label class="field"><span>Last name</span><input id="f-last" autocomplete="family-name" required></label>
            </div>` : ""}
            <label class="field"><span>Email address</span><input id="f-email" type="email" autocomplete="email" required></label>
            ${mode === "create" ? `<label class="field"><span>Mobile number <em>(for delivery updates)</em></span><input id="f-phone" type="tel" autocomplete="tel"></label>` : ""}
            <label class="field"><span>Password</span><input id="f-pass" type="password" autocomplete="${mode === "create" ? "new-password" : "current-password"}" minlength="6" required></label>
            <p class="form-error" id="auth-error" role="alert"></p>
            <button class="btn btn-primary btn-block" type="submit">${mode === "create" ? "Create account" : "Sign in"} ${icon("arrow", 18)}</button>
            <p class="form-hint">${icon("shield", 14)} Preview only: your details stay in this browser until secure sign-in is connected.</p>
          </form>
        </div>
      </section>`;
    root.querySelectorAll("[data-auth-mode]").forEach((b) => b.addEventListener("click", () => renderSignIn(b.dataset.authMode)));
    $("#auth-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const err = $("#auth-error");
      const email = $("#f-email").value.trim();
      const pass = $("#f-pass").value;
      if (mode === "create" && !$("#f-first").value.trim()) return (err.textContent = "Enter your first name.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return (err.textContent = "Enter a valid email address, like name@example.com.");
      if (pass.length < 6) return (err.textContent = "Your password needs at least 6 characters.");
      const existing = getUser();
      if (mode === "signin") {
        if (!existing || existing.email.toLowerCase() !== email.toLowerCase()) return (err.textContent = "We couldn't find an account with that email in this browser. Create an account instead.");
        save("signedIn", true);
      } else {
        save("user", { first: $("#f-first").value.trim(), last: $("#f-last").value.trim(), email, phone: $("#f-phone").value.trim(), since: (existing && existing.since) || Date.now() });
        save("signedIn", true);
      }
      toast(mode === "create" ? "Welcome to DanyJ!" : "Signed in");
      route();
    });
  };

  /* ---------- Shell (sidebar + content) ---------- */
  const shell = (active, content) => {
    const u = getUser();
    const counts = { basket: Cart.count(), orders: getOrders().length, favourites: store.get("favs", []).length, addresses: getAddresses().length };
    const initials = ((u.first || "")[0] || "") + ((u.last || "")[0] || "");
    return `
      <div class="acc-layout">
        <aside class="acc-side">
          <div class="acc-profile">
            <span class="acc-avatar">${esc(initials.toUpperCase() || "D")}</span>
            <div><b>${esc(u.first)} ${esc(u.last || "")}</b><span>Member since ${fmtDate(u.since, { month: "short", year: "numeric" })}</span></div>
          </div>
          <nav class="acc-nav" aria-label="Account sections">
            ${SECTIONS.map(([id, label, ic]) => `<a href="#${id}" class="${active === id ? "active" : ""}" ${active === id ? 'aria-current="page"' : ""}>${icon(ic, 18)}<span>${label}</span>${counts[id] ? `<small>${counts[id]}</small>` : ""}</a>`).join("")}
            <button class="acc-signout" data-signout>${icon("logout", 18)}<span>Sign out</span></button>
          </nav>
        </aside>
        <section class="acc-main" id="acc-main">${content}</section>
      </div>`;
  };

  const head = (title, sub, action = "") => `<div class="acc-head"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div>${action}</div>`;

  /* ---------- Tracker ---------- */
  const tracker = (o) => {
    const st = stageOf(o);
    return `<ol class="track" aria-label="Order progress">
      ${STEPS.map((s, i) => `<li class="${i < st ? "done" : i === st ? "now" : ""}"><span class="dot">${i <= st ? icon("check", 13) : ""}</span><b>${s}</b>${i === st ? `<em>${i === 3 ? fmtDate(o.slotDate, { weekday: "short", day: "numeric", month: "short" }) : "In progress"}</em>` : ""}</li>`).join("")}
    </ol>`;
  };

  const statusPill = (o) => {
    const st = stageOf(o);
    if (st < 0) return `<span class="status cancelled">Cancelled</span>`;
    return `<span class="status s${st}">${STEPS[st]}</span>`;
  };

  /* ---------- Overview ---------- */
  const viewOverview = () => {
    const u = getUser();
    const orders = getOrders();
    const live = orders.find((o) => stageOf(o) >= 0 && stageOf(o) < 3);
    const addr = getAddresses().find((a) => a.isDefault) || getAddresses()[0];
    const again = buyAgainList().slice(0, 8);
    const hr = new Date().getHours();
    const basketIds = Object.keys(store.get("cart", {})).filter((id) => byId[id]);
    return `
      <div class="acc-hello">
        <div>
          <span class="acc-greet">${hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening"}, ${esc(firstName(u))} 👋</span>
          <h1>Let's plan your shop</h1>
          <p>Free UK delivery over ${money(S.freeDeliveryOver)} · Order by ${esc(S.dispatchCutoff)} for next-day dispatch</p>
        </div>
        <a class="btn btn-primary" href="shop.html">${icon("search", 18)} Start shopping</a>
      </div>
      <div class="acc-stats">
        <a href="#orders"><b>${orders.length}</b><span>Orders</span></a>
        <a href="#basket"><b>${Cart.count()}</b><span>In basket</span></a>
        <a href="#favourites"><b>${store.get("favs", []).length}</b><span>Favourites</span></a>
        <a href="#orders"><b>${money(orders.reduce((s, o) => s + o.total, 0))}</b><span>Spent with us</span></a>
      </div>
      <div class="acc-grid">
        <article class="acc-card span-2">
          <div class="acc-card-head"><h2>${live ? "Your latest order" : "Track an order"}</h2>${live ? `<a class="link-arrow" href="#orders">All orders ${icon("arrow", 15)}</a>` : ""}</div>
          ${live ? `
            <div class="order-mini"><div><b>Order #${live.id}</b><span>${orderCount(live)} items · ${money(live.total)} · Delivery ${fmtDate(live.slotDate, { weekday: "long", day: "numeric", month: "short" })}, ${esc(live.slotTime)}</span></div>${statusPill(live)}</div>
            ${tracker(live)}` : `<div class="empty-note">${icon("truck", 18)} No orders on the way. When you place an order, you can follow it here from packing to your door.</div>`}
        </article>
        <article class="acc-card">
          <div class="acc-card-head"><h2>Basket</h2><a class="link-arrow" href="#basket">Open ${icon("arrow", 15)}</a></div>
          ${basketIds.length ? `
            <div class="thumb-stack">${basketIds.slice(0, 5).map((id) => thumb(byId[id])).join("")}${basketIds.length > 5 ? `<span class="more">+${basketIds.length - 5}</span>` : ""}</div>
            <p class="acc-sum"><b>${money(Cart.subtotal())}</b> · ${Cart.count()} ${Cart.count() === 1 ? "item" : "items"}</p>
            <a class="btn btn-primary btn-block btn-sm" href="#basket">Checkout ${icon("arrow", 16)}</a>` : `<div class="empty-note">Your basket is empty. <a href="shop.html">Browse the shop</a></div>`}
        </article>
        <article class="acc-card">
          <div class="acc-card-head"><h2>Delivering to</h2><a class="link-arrow" href="#addresses">${addr ? "Change" : "Add"} ${icon("arrow", 15)}</a></div>
          ${addr ? addressBlock(addr) : `<div class="empty-note">${icon("pin", 18)} Add a delivery address to speed up checkout. <a href="#addresses">Add address</a></div>`}
        </article>
        <article class="acc-card span-2">
          <div class="acc-card-head"><h2>Buy again</h2><a class="link-arrow" href="#orders">From your orders ${icon("arrow", 15)}</a></div>
          ${again.length ? `<div class="again">${again.map(againItem).join("")}</div>` : `<div class="empty-note">Products you order will appear here so you can restock in one tap.</div>`}
        </article>
      </div>`;
  };

  const buyAgainList = () => {
    const seen = new Set(); const out = [];
    getOrders().forEach((o) => Object.keys(o.items).forEach((id) => { if (byId[id] && !seen.has(id)) { seen.add(id); out.push(byId[id]); } }));
    store.get("history", []).forEach((id) => { if (byId[id] && !seen.has(id)) { seen.add(id); out.push(byId[id]); } });
    return out;
  };
  const againItem = (p) => `
    <div class="again-item">
      <button class="again-media" data-open-product="${p.id}" aria-label="View ${esc(p.name)}">${thumb(p)}</button>
      <b>${esc(p.name)}</b>
      <div class="again-foot"><span>${money(p.price)}</span><span data-control="${p.id}"></span></div>
    </div>`;

  const addressBlock = (a) => `
    <div class="addr">
      <b>${esc(a.label)}${a.isDefault ? ` <span class="tag">Default</span>` : ""}</b>
      <span>${esc(a.name)}</span>
      <span>${esc(a.line1)}${a.line2 ? ", " + esc(a.line2) : ""}</span>
      <span>${esc(a.city)} ${esc(a.postcode)}</span>
      ${a.phone ? `<span>${esc(a.phone)}</span>` : ""}
    </div>`;

  /* ---------- Basket & checkout ---------- */
  let chosen = { addr: null, day: null, time: null, code: "" };
  const viewBasket = () => {
    const cart = store.get("cart", {});
    const lines = Object.entries(cart).filter(([id]) => byId[id]);
    if (!lines.length) {
      return head("Basket & checkout") + `<div class="acc-card empty-big"><div class="big">🧺</div><h2>Your basket is empty</h2><p>Add your groceries and come back here to check out.</p><a class="btn btn-primary" href="shop.html">Start shopping</a>${buyAgainList().length ? `<h3>Buy again</h3><div class="again">${buyAgainList().slice(0, 6).map(againItem).join("")}</div>` : ""}</div>`;
    }
    const addrs = getAddresses();
    if (!chosen.addr || !addrs.find((a) => a.id === chosen.addr)) chosen.addr = (addrs.find((a) => a.isDefault) || addrs[0] || {}).id || null;
    const days = slotDays();
    if (!chosen.day) chosen.day = days[0].toISOString();
    if (!chosen.time) chosen.time = SLOT_TIMES[0][1];
    const sub = Cart.subtotal();
    const disc = discountFor(chosen.code, sub);
    const fee = deliveryFee(sub, disc.freeShip);
    const total = Math.max(0, sub - disc.amount) + fee;
    const codeMsg = !chosen.code ? "" : disc.d ? `${icon("check", 14)} ${esc(disc.d.code)} applied${disc.freeShip ? ": free delivery" : ""}`
      : findCode(chosen.code) ? `Spend ${money(findCode(chosen.code).minSpend)} or more to use ${esc(chosen.code.toUpperCase())}.` : `${esc(chosen.code.toUpperCase())} isn't a valid code.`;
    return head("Basket & checkout", `${Cart.count()} ${Cart.count() === 1 ? "item" : "items"} · order by ${esc(S.dispatchCutoff)} for next-day dispatch`) + `
      <div class="checkout">
        <div class="checkout-main">
          <article class="acc-card">
            <div class="acc-card-head"><h2><span class="stepn">1</span> Your items</h2></div>
            <ul class="bl">${lines.map(([id, q]) => { const p = byId[id]; return `
              <li class="bl-row">
                <button class="bl-media" data-open-product="${id}" aria-label="View ${esc(p.name)}">${thumb(p)}</button>
                <div class="bl-info"><b>${esc(p.name)}</b><span>${money(p.price)} each${p.wasPrice ? ` · <s>${money(p.wasPrice)}</s>` : ""}</span></div>
                <div class="stepper light"><button data-dec="${id}" aria-label="Decrease">${icon(q === 1 ? "trash" : "minus", 15)}</button><span>${q}</span><button data-inc="${id}" aria-label="Increase">${icon("plus", 15)}</button></div>
                <b class="bl-price">${money(p.price * q)}</b>
              </li>`; }).join("")}</ul>
          </article>
          <article class="acc-card">
            <div class="acc-card-head"><h2><span class="stepn">2</span> Delivery address</h2><a class="link-arrow" href="#addresses">Manage ${icon("arrow", 15)}</a></div>
            ${addrs.length ? `<div class="choice-grid">${addrs.map((a) => `
              <label class="choice"><input type="radio" name="addr" value="${a.id}" ${a.id === chosen.addr ? "checked" : ""}>${addressBlock(a)}</label>`).join("")}</div>`
              : `<div class="empty-note">${icon("pin", 18)} You haven't saved an address yet.</div>${addressForm(null, "checkout")}`}
          </article>
          <article class="acc-card">
            <div class="acc-card-head"><h2><span class="stepn">3</span> Delivery slot</h2></div>
            <div class="slot-days">${days.map((d) => `<button class="slot-day ${d.toISOString() === chosen.day ? "active" : ""}" data-day="${d.toISOString()}"><span>${d.toLocaleDateString("en-GB", { weekday: "short" })}</span><b>${d.getDate()}</b><span>${d.toLocaleDateString("en-GB", { month: "short" })}</span></button>`).join("")}</div>
            <div class="slot-times">${SLOT_TIMES.map(([k, t]) => `<button class="slot-time ${t === chosen.time ? "active" : ""}" data-time="${t}">${icon("clock", 16)} ${t}</button>`).join("")}</div>
          </article>
        </div>
        <aside class="acc-card checkout-sum">
          <h2>Order summary</h2>
          <div class="ship-meter">${sub < S.freeDeliveryOver ? `Add <b>${money(S.freeDeliveryOver - sub)}</b> for free delivery` : `🎉 You've unlocked <b>free delivery</b>`}<div class="bar"><i style="width:${Math.min(100, (sub / S.freeDeliveryOver) * 100)}%"></i></div></div>
          <div class="sum-row"><span>Subtotal</span><span>${money(sub)}</span></div>
          ${disc.amount ? `<div class="sum-row disc"><span>Discount (${esc(disc.d.code)})</span><span>−${money(disc.amount)}</span></div>` : ""}
          <div class="sum-row"><span>Delivery</span><span>${fee ? money(fee) : "Free"}</span></div>
          <form class="code-form" data-code-form><label class="sr-only" for="promo">Discount code</label><input id="promo" placeholder="Discount code" value="${esc(chosen.code)}" autocomplete="off"><button class="btn btn-ghost btn-sm" type="submit">${chosen.code && disc.d ? "Change" : "Apply"}</button></form>
          ${codeMsg ? `<p class="code-msg ${disc.d ? "ok" : ""}">${codeMsg}</p>` : ""}
          <div class="sum-row total"><span>Total</span><span>${money(total)}</span></div>
          <p class="sum-slot">${icon("truck", 16)} ${fmtDate(chosen.day, { weekday: "long", day: "numeric", month: "long" })}, ${esc(chosen.time)}</p>
          <button class="btn btn-primary btn-block" data-place ${addrs.length ? "" : "disabled"}>Place order · ${money(total)}</button>
          <p class="form-hint">${icon("shield", 14)} Preview: no payment is taken. Card payment is added when checkout is connected.</p>
        </aside>
      </div>`;
  };

  /* ---------- Orders ---------- */
  const viewOrders = () => {
    const orders = getOrders();
    if (!orders.length) return head("My orders") + `<div class="acc-card empty-big"><div class="big">📦</div><h2>No orders yet</h2><p>Your orders, delivery tracking and receipts will appear here.</p><a class="btn btn-primary" href="shop.html">Start shopping</a></div>`;
    return head("My orders", `${orders.length} ${orders.length === 1 ? "order" : "orders"}`) + `<div class="orders">${orders.map((o) => {
      const ids = Object.keys(o.items).filter((id) => byId[id]);
      const st = stageOf(o);
      return `
      <article class="acc-card order">
        <header class="order-head">
          <div><b>Order #${o.id}</b><span>Placed ${fmtDate(o.placed)} · ${orderCount(o)} items</span></div>
          ${statusPill(o)}
        </header>
        <div class="order-body">
          <div class="thumb-stack">${ids.slice(0, 6).map((id) => thumb(byId[id])).join("")}${ids.length > 6 ? `<span class="more">+${ids.length - 6}</span>` : ""}</div>
          <div class="order-meta"><span>${icon("truck", 15)} ${st === 3 ? "Delivered" : "Arriving"} ${fmtDate(o.slotDate, { weekday: "short", day: "numeric", month: "short" })}, ${esc(o.slotTime)}</span><span>${icon("pin", 15)} ${esc(o.addressLine)}</span></div>
          <b class="order-total">${money(o.total)}</b>
        </div>
        <div class="order-actions">
          <button class="btn btn-primary btn-sm" data-again="${o.id}">${icon("repeat", 16)} Buy again</button>
          <button class="btn btn-ghost btn-sm" data-toggle="track-${o.id}">${icon("truck", 16)} Track</button>
          <button class="btn btn-ghost btn-sm" data-toggle="rcpt-${o.id}">${icon("receipt", 16)} Receipt</button>
          ${st === 0 ? `<button class="btn btn-ghost btn-sm danger" data-cancel="${o.id}">Cancel</button>` : ""}
        </div>
        <div class="order-more" id="track-${o.id}" hidden>${st < 0 ? `<p class="empty-note">This order was cancelled.</p>` : tracker(o)}</div>
        <div class="order-more" id="rcpt-${o.id}" hidden>
          <table class="rcpt"><tbody>${Object.entries(o.items).filter(([id]) => byId[id]).map(([id, q]) => `<tr><td>${q} ×</td><td>${esc(byId[id].name)}</td><td>${money(byId[id].price * q)}</td></tr>`).join("")}</tbody>
          <tfoot><tr><td></td><td>Subtotal</td><td>${money(o.subtotal)}</td></tr>${o.discount ? `<tr><td></td><td>Discount (${esc(o.code)})</td><td>−${money(o.discount)}</td></tr>` : ""}<tr><td></td><td>Delivery</td><td>${o.fee ? money(o.fee) : "Free"}</td></tr><tr class="t"><td></td><td>Total</td><td>${money(o.total)}</td></tr></tfoot></table>
        </div>
      </article>`; }).join("")}</div>`;
  };

  /* ---------- Favourites ---------- */
  const viewFavourites = () => {
    const favs = store.get("favs", []).map((id) => byId[id]).filter(Boolean);
    return head("Favourites", favs.length ? `${favs.length} saved` : "Tap the heart on any product to save it here") +
      (favs.length ? `<div class="product-grid cols-3">${favs.map(productCard).join("")}</div>` : `<div class="acc-card empty-big"><div class="big">💚</div><h2>No favourites yet</h2><p>Tap the ♡ on a product to keep it here for next time.</p><a class="btn btn-primary" href="shop.html">Browse products</a></div>`);
  };

  /* ---------- Addresses ---------- */
  let editing = null;
  const addressForm = (a, ctx = "book") => `
    <form class="form addr-form" data-addr-form="${a ? a.id : "new"}" data-ctx="${ctx}" novalidate>
      <div class="form-row two">
        <label class="field"><span>Label</span><input name="label" placeholder="Home, Work, Mum's…" value="${a ? esc(a.label) : "Home"}"></label>
        <label class="field"><span>Full name</span><input name="name" autocomplete="name" value="${a ? esc(a.name) : esc(((getUser() || {}).first || "") + " " + ((getUser() || {}).last || "")).trim()}" required></label>
      </div>
      <label class="field"><span>Address line 1</span><input name="line1" autocomplete="address-line1" value="${a ? esc(a.line1) : ""}" required></label>
      <label class="field"><span>Address line 2 <em>(optional)</em></span><input name="line2" autocomplete="address-line2" value="${a ? esc(a.line2 || "") : ""}"></label>
      <div class="form-row two">
        <label class="field"><span>Town or city</span><input name="city" autocomplete="address-level2" value="${a ? esc(a.city) : ""}" required></label>
        <label class="field"><span>Postcode</span><input name="postcode" autocomplete="postal-code" value="${a ? esc(a.postcode) : ""}" required style="text-transform:uppercase"></label>
      </div>
      <label class="field"><span>Phone for the driver <em>(optional)</em></span><input name="phone" type="tel" autocomplete="tel" value="${a ? esc(a.phone || "") : esc((getUser() || {}).phone || "")}"></label>
      <label class="check"><input type="checkbox" name="isDefault" ${!a || a.isDefault || !getAddresses().length ? "checked" : ""}> Use as my default address</label>
      <p class="form-error" role="alert"></p>
      <div class="form-actions"><button class="btn btn-primary btn-sm" type="submit">Save address</button>${ctx === "book" ? `<button class="btn btn-ghost btn-sm" type="button" data-addr-cancel>Cancel</button>` : ""}</div>
    </form>`;

  const viewAddresses = () => {
    const addrs = getAddresses();
    return head("Addresses", "Saved addresses make checkout quicker", editing ? "" : `<button class="btn btn-primary btn-sm" data-addr-new>${icon("plus", 16)} Add address</button>`) + `
      ${editing === "new" ? `<article class="acc-card"><h2 class="mb">New address</h2>${addressForm(null)}</article>` : ""}
      ${addrs.length ? `<div class="addr-grid">${addrs.map((a) => editing === a.id
        ? `<article class="acc-card span-full"><h2 class="mb">Edit address</h2>${addressForm(a)}</article>`
        : `<article class="acc-card addr-card">${addressBlock(a)}<div class="addr-actions"><button class="btn btn-ghost btn-sm" data-addr-edit="${a.id}">${icon("edit", 15)} Edit</button>${a.isDefault ? "" : `<button class="btn btn-ghost btn-sm" data-addr-default="${a.id}">Set as default</button>`}<button class="btn btn-ghost btn-sm danger" data-addr-del="${a.id}">${icon("trash", 15)} Remove</button></div></article>`).join("")}</div>`
        : editing ? "" : `<div class="acc-card empty-big"><div class="big">📍</div><h2>No saved addresses</h2><p>Add your home or work address so checkout takes seconds.</p><button class="btn btn-primary" data-addr-new>${icon("plus", 16)} Add address</button></div>`}`;
  };

  /* ---------- Payment ---------- */
  const viewPayment = () => head("Payment methods") + `
    <article class="acc-card pay">
      <div class="pay-card" aria-hidden="true"><span class="chip"></span><b>•••• •••• •••• ••••</b><span>Your saved card will show here</span></div>
      <div>
        <h2>Pay securely at checkout</h2>
        <p>Saved cards appear here once card payments are connected. Card details are handled by the payment provider and never stored on this site.</p>
        <div class="pay-methods"><span>Visa</span><span>Mastercard</span><span>Amex</span><span>Apple Pay</span><span>Google Pay</span></div>
      </div>
    </article>
    <article class="acc-card"><h2 class="mb">Wholesale & business accounts</h2><p class="muted">Ordering for a shop, restaurant or event? Browse our <a href="shop.html?cat=wholesale">wholesale box deals</a>, or contact us about invoice payment for regular trade orders.</p></article>`;

  /* ---------- Settings ---------- */
  const viewSettings = () => {
    const u = getUser(); const p = getPrefs();
    return head("Settings") + `
      <article class="acc-card">
        <h2 class="mb">Your details</h2>
        <form class="form" id="profile-form" novalidate>
          <div class="form-row two">
            <label class="field"><span>First name</span><input name="first" autocomplete="given-name" value="${esc(u.first)}" required></label>
            <label class="field"><span>Last name</span><input name="last" autocomplete="family-name" value="${esc(u.last || "")}"></label>
          </div>
          <div class="form-row two">
            <label class="field"><span>Email address</span><input name="email" type="email" autocomplete="email" value="${esc(u.email)}" required></label>
            <label class="field"><span>Mobile number</span><input name="phone" type="tel" autocomplete="tel" value="${esc(u.phone || "")}"></label>
          </div>
          <p class="form-error" role="alert"></p>
          <div class="form-actions"><button class="btn btn-primary btn-sm" type="submit">Save details</button></div>
        </form>
      </article>
      <article class="acc-card">
        <h2 class="mb">Delivery preferences</h2>
        <form class="form" id="prefs-form">
          <label class="field"><span>If you're not in, leave it at</span>
            <select name="safePlace" class="select">${["Front door", "Back door", "With a neighbour", "Porch", "Don't leave it — call me"].map((o) => `<option ${o === p.safePlace ? "selected" : ""}>${o}</option>`).join("")}</select></label>
          <label class="field"><span>Notes for the driver <em>(optional)</em></span><input name="notes" value="${esc(p.notes || "")}" placeholder="e.g. Ring the bell twice, flat 3 on the left"></label>
          <h3 class="sub">Notifications</h3>
          <label class="switch"><input type="checkbox" name="sms" ${p.sms ? "checked" : ""}><span class="slider"></span><span>Text me delivery updates</span></label>
          <label class="switch"><input type="checkbox" name="offers" ${p.offers ? "checked" : ""}><span class="slider"></span><span>Email me deals and new products</span></label>
          <div class="form-actions"><button class="btn btn-primary btn-sm" type="submit">Save preferences</button></div>
        </form>
      </article>
      <article class="acc-card danger-zone">
        <h2 class="mb">Account</h2>
        <div class="form-actions">
          <button class="btn btn-ghost btn-sm" data-signout>${icon("logout", 16)} Sign out</button>
          <button class="btn btn-ghost btn-sm danger" data-wipe>Delete account data from this browser</button>
        </div>
        <p class="form-error" id="wipe-confirm" role="status"></p>
      </article>`;
  };

  /* ---------- Router ---------- */
  const VIEWS = { overview: viewOverview, basket: viewBasket, orders: viewOrders, favourites: viewFavourites, addresses: viewAddresses, payment: viewPayment, settings: viewSettings };
  const route = () => {
    const signedIn = getUser() && store.get("signedIn", false);
    if (!signedIn) { renderSignIn(getUser() ? "signin" : "create"); document.title = "Sign in — " + S.fullName; return; }
    const id = (location.hash || "#overview").slice(1);
    const active = VIEWS[id] ? id : "overview";
    root.innerHTML = shell(active, VIEWS[active]());
    document.body.classList.toggle("on-checkout", active === "basket");
    document.title = `${SECTIONS.find((s) => s[0] === active)[1]} — ${S.fullName}`;
    refreshControls();
    const navActive = root.querySelector(".acc-nav a.active");
    if (navActive && window.matchMedia("(max-width: 860px)").matches) navActive.scrollIntoView({ inline: "center", block: "nearest" });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      $$("#acc-main > *").forEach((el, i) => el.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 320, delay: i * 40, easing: "cubic-bezier(.2,.8,.3,1)", fill: "backwards" }));
    }
  };
  window.addEventListener("hashchange", () => { editing = null; route(); window.scrollTo({ top: 0 }); });

  // Re-render the open section when the basket or favourites change.
  Cart.onChange(() => {
    const id = (location.hash || "#overview").slice(1);
    if (getUser() && store.get("signedIn", false) && (id === "basket" || id === "overview")) setTimeout(route, inFlightDelay());
    else if (root.querySelector(".acc-nav")) { const s = root.querySelector('.acc-nav a[href="#basket"] small'); if (s) s.textContent = Cart.count(); }
  });
  const inFlightDelay = () => (document.querySelector(".fx-fly") ? 820 : 0);

  /* ---------- Actions ---------- */
  const saveAddressFrom = (form) => {
    const f = Object.fromEntries(new FormData(form).entries());
    const err = form.querySelector(".form-error");
    f.postcode = (f.postcode || "").toUpperCase().trim();
    if (!f.name.trim() || !f.line1.trim() || !f.city.trim()) return (err.textContent = "Fill in your name, address line 1 and town or city.");
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/.test(f.postcode)) return (err.textContent = "Enter a valid UK postcode, like ST5 1AA.");
    let addrs = getAddresses();
    const id = form.dataset.addrForm === "new" ? uid() : form.dataset.addrForm;
    const rec = { id, label: f.label.trim() || "Home", name: f.name.trim(), line1: f.line1.trim(), line2: (f.line2 || "").trim(), city: f.city.trim(), postcode: f.postcode, phone: (f.phone || "").trim(), isDefault: !!f.isDefault || !addrs.length };
    if (rec.isDefault) addrs = addrs.map((a) => ({ ...a, isDefault: false }));
    addrs = addrs.some((a) => a.id === id) ? addrs.map((a) => (a.id === id ? rec : a)) : [...addrs, rec];
    if (!addrs.some((a) => a.isDefault)) addrs[0].isDefault = true;
    save("addresses", addrs);
    chosen.addr = id; editing = null;
    toast("Address saved");
    route();
  };

  root.addEventListener("submit", (e) => {
    const form = e.target;
    if (form.matches("[data-addr-form]")) { e.preventDefault(); saveAddressFrom(form); }
    else if (form.matches("[data-code-form]")) { e.preventDefault(); chosen.code = form.querySelector("input").value.trim(); route(); }
    else if (form.id === "profile-form") {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(form).entries()); const err = form.querySelector(".form-error");
      if (!f.first.trim()) return (err.textContent = "Enter your first name.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return (err.textContent = "Enter a valid email address.");
      save("user", { ...getUser(), first: f.first.trim(), last: f.last.trim(), email: f.email.trim(), phone: f.phone.trim() });
      toast("Details saved"); route();
    } else if (form.id === "prefs-form") {
      e.preventDefault();
      const f = new FormData(form);
      save("prefs", { safePlace: f.get("safePlace"), notes: f.get("notes"), sms: f.get("sms") === "on", offers: f.get("offers") === "on" });
      toast("Preferences saved");
    }
  });

  root.addEventListener("change", (e) => {
    if (e.target.name === "addr") { chosen.addr = e.target.value; }
  });

  root.addEventListener("click", (e) => {
    const t = e.target.closest("[data-signout],[data-wipe],[data-day],[data-time],[data-place],[data-again],[data-toggle],[data-cancel],[data-addr-new],[data-addr-edit],[data-addr-del],[data-addr-default],[data-addr-cancel]");
    if (!t) return;
    const d = t.dataset;
    if ("signout" in d) { save("signedIn", false); toast("Signed out"); location.hash = ""; route(); }
    else if ("wipe" in d) {
      const c = $("#wipe-confirm");
      if (t.dataset.armed) { ["user", "signedIn", "orders", "addresses", "prefs"].forEach((k) => { try { localStorage.removeItem("danyj:" + k); } catch (er) { /* storage blocked */ } }); toast("Account data deleted"); location.hash = ""; route(); }
      else { t.dataset.armed = "1"; t.textContent = "Tap again to confirm"; c.textContent = "This removes your account, orders and addresses from this browser. Your basket stays."; }
    }
    else if (d.day) { chosen.day = d.day; route(); }
    else if (d.time) { chosen.time = d.time; route(); }
    else if ("place" in d) placeOrder(t);
    else if (d.again) {
      const o = getOrders().find((x) => x.id === d.again); if (!o) return;
      let n = 0;
      Object.entries(o.items).forEach(([id, q]) => { if (byId[id]) { Cart.add(id, q); n += q; } });
      if (window.FL.motion) window.FL.motion.flyToBasket(t, n);
      toast(`${n} items from order #${o.id} added to your basket`);
    }
    else if (d.toggle) { const el = $("#" + d.toggle); el.hidden = !el.hidden; t.classList.toggle("on", !el.hidden); }
    else if (d.cancel) {
      if (!t.dataset.armed) { t.dataset.armed = "1"; t.textContent = "Tap again to cancel order"; return; }
      save("orders", getOrders().map((o) => (o.id === d.cancel ? { ...o, cancelled: true } : o))); toast("Order cancelled"); route();
    }
    else if ("addrNew" in d) { editing = "new"; route(); }
    else if (d.addrEdit) { editing = d.addrEdit; route(); }
    else if ("addrCancel" in d) { editing = null; route(); }
    else if (d.addrDefault) { save("addresses", getAddresses().map((a) => ({ ...a, isDefault: a.id === d.addrDefault }))); route(); }
    else if (d.addrDel) {
      if (!t.dataset.armed) { t.dataset.armed = "1"; t.innerHTML = "Tap again to remove"; return; }
      let addrs = getAddresses().filter((a) => a.id !== d.addrDel);
      if (addrs.length && !addrs.some((a) => a.isDefault)) addrs[0].isDefault = true;
      save("addresses", addrs); toast("Address removed"); route();
    }
  });

  const placeOrder = (btn) => {
    const addr = getAddresses().find((a) => a.id === chosen.addr);
    if (!addr) { toast("Add a delivery address first"); return; }
    const items = { ...store.get("cart", {}) };
    Object.keys(items).forEach((id) => { if (!byId[id]) delete items[id]; });
    if (!Object.keys(items).length) return;
    const sub = Object.entries(items).reduce((s, [id, q]) => s + byId[id].price * q, 0);
    const disc = discountFor(chosen.code, sub);
    const fee = deliveryFee(sub, disc.freeShip);
    const u = getUser() || {};
    const order = { id: String(Date.now()).slice(-6), placed: Date.now(), items, subtotal: sub, discount: disc.amount, code: disc.d ? disc.d.code : "", fee, total: Math.max(0, sub - disc.amount) + fee,
      customer: `${u.first || ""} ${u.last || ""}`.trim(), email: u.email || "", phone: addr.phone || u.phone || "", safePlace: getPrefs().safePlace, notes: getPrefs().notes, slotDate: chosen.day, slotTime: chosen.time, addressLine: `${addr.line1}, ${addr.postcode}` };
    save("orders", [order, ...getOrders()]);
    Object.entries(items).forEach(([id, q]) => D.adjustStock(id, -q));
    if (disc.d) D.saveDiscounts((D.discounts || []).map((d) => (d.code === disc.d.code ? { ...d, uses: (d.uses || 0) + 1 } : d)));
    chosen.code = "";
    btn.disabled = true;
    Object.keys(items).forEach((id) => Cart.set(id, 0));
    if (window.FL.motion) window.FL.motion.confetti(btn);
    toast(`Order #${order.id} placed — see you ${fmtDate(chosen.day, { weekday: "long" })}!`);
    setTimeout(() => { location.hash = "orders"; }, 900);
  };

  route();
})();
