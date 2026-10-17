/* Farm Link Food Market — micro-interactions
 * Fly-to-basket, rolling quantities, heart bursts, card tilt, drag-to-scroll
 * carousels, basket drawer motion, free-delivery confetti, scroll reveals and
 * a typing search hint. Everything is skipped or simplified for people who
 * prefer reduced motion.
 */
(function () {
  "use strict";
  const { D, Cart, byId, $, $$ } = window.FL;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const canAnimate = !reduced && typeof Element.prototype.animate === "function";

  // A fixed layer for anything that travels across the page.
  const layer = document.createElement("div");
  layer.className = "fx-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const center = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  const buzz = (ms = 12) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* not supported */ } };
  const bagButton = () => $(".header [data-open-cart]");

  /* ---------- Basket badge: held back while an item is in the air ---------- */
  let shown = Cart.count();
  let inFlight = 0;
  const setBadges = (n, bump) => {
    $$("[data-cart-count]").forEach((el) => {
      el.textContent = n;
      el.dataset.count = n;
      if (bump && canAnimate) {
        el.animate([{ transform: "scale(1)" }, { transform: "scale(1.55)" }, { transform: "scale(.9)" }, { transform: "scale(1)" }],
          { duration: 420, easing: "cubic-bezier(.3,1.6,.5,1)" });
      }
    });
  };
  Cart.onChange(() => {
    if (inFlight > 0) setBadges(shown, false);
    else {
      const n = Cart.count();
      setBadges(n, n !== shown && canAnimate);
      shown = n;
    }
  });

  const catchInBag = (added) => {
    const bag = bagButton();
    shown = Cart.count();
    setBadges(shown, true);
    if (!bag || !canAnimate) return;
    bag.animate([
      { transform: "scale(1) rotate(0)" },
      { transform: "scale(1.22) rotate(-10deg)", offset: 0.3 },
      { transform: "scale(.92) rotate(6deg)", offset: 0.6 },
      { transform: "scale(1.04) rotate(-2deg)", offset: 0.8 },
      { transform: "scale(1) rotate(0)" },
    ], { duration: 520, easing: "ease-out" });
    const plus = document.createElement("span");
    plus.className = "fx-plus";
    plus.textContent = `+${added}`;
    const c = center(bag.getBoundingClientRect());
    plus.style.left = c.x + "px";
    plus.style.top = c.y + "px";
    layer.appendChild(plus);
    plus.animate([
      { transform: "translate(-50%, 0) scale(.6)", opacity: 0 },
      { transform: "translate(-50%, -22px) scale(1)", opacity: 1, offset: 0.25 },
      { transform: "translate(-50%, -46px) scale(1)", opacity: 0 },
    ], { duration: 900, easing: "ease-out" }).onfinish = () => plus.remove();
  };

  /* ---------- Fly to basket ---------- */
  const sourceVisual = (btn) => {
    const holder = btn.closest(".card, .reorder, .season-tile, .search-result");
    const thumb = holder && holder.querySelector(".thumb");
    return thumb || btn;
  };

  const flyToBasket = (btn) => {
    const bag = bagButton();
    const src = sourceVisual(btn);
    if (!bag || !src) return false;
    const from = src.getBoundingClientRect();
    const to = bag.getBoundingClientRect();
    if (!from.width || to.bottom < 0) return false;

    const size = Math.min(Math.max(from.width, 56), 150);
    const fly = document.createElement("div");
    fly.className = "fx-fly";
    fly.style.width = fly.style.height = size + "px";
    const img = src.querySelector && src.querySelector("img");
    const emoji = src.querySelector && src.querySelector(".emoji");
    if (img) {
      fly.style.background = "#fff";
      fly.appendChild(img.cloneNode());
    } else if (emoji) {
      fly.style.background = src.style.background || "var(--mint)";
      const e = document.createElement("span");
      e.textContent = emoji.textContent;
      e.style.fontSize = size * 0.55 + "px";
      fly.appendChild(e);
    } else {
      fly.classList.add("dot");
    }
    layer.appendChild(fly);

    const a = center(from), b = center(to);
    const lift = Math.min(a.y, b.y) - Math.max(90, Math.abs(a.x - b.x) * 0.25);
    const steps = 28, frames = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, u = 1 - t;
      const x = a.x + (b.x - a.x) * t;
      const y = u * u * a.y + 2 * u * t * lift + t * t * b.y; // gentle throwing arc
      const s = 1 - 0.82 * t * t;
      frames.push({
        transform: `translate(${x - size / 2}px, ${y - size / 2}px) scale(${s}) rotate(${-28 * t}deg)`,
        opacity: t > 0.92 ? 0.6 : 1,
        borderRadius: `${16 + 34 * t}%`,
      });
    }
    inFlight++;
    const anim = fly.animate(frames, { duration: 780, easing: "cubic-bezier(.45,.05,.55,.95)" });
    anim.onfinish = () => {
      fly.remove();
      inFlight = Math.max(0, inFlight - 1);
      catchInBag(1);
    };
    return true;
  };

  /* ---------- Rolling numbers & stepper morph ---------- */
  const rollNumber = (id, dir) => {
    const spans = [
      ...$$(`[data-control="${CSS.escape(id)}"] .stepper span`),
      ...$$(`#cart-body .cart-line [data-inc="${CSS.escape(id)}"]`).map((b) => b.parentElement.querySelector("span")),
    ];
    spans.forEach((s) => s && s.animate([
      { transform: `translateY(${dir * 70}%)`, opacity: 0 },
      { transform: "translateY(0)", opacity: 1 },
    ], { duration: 240, easing: "cubic-bezier(.2,.9,.3,1.3)" }));
  };

  const morphControl = (id, from, to) => {
    $$(`[data-control="${CSS.escape(id)}"]`).forEach((holder) => {
      const el = holder.firstElementChild;
      if (!el) return;
      if (from === 0 && to > 0) {
        const w = el.offsetWidth;
        el.animate([
          { width: "42px", borderRadius: "50%" },
          { width: w + 8 + "px", offset: 0.7 },
          { width: w + "px", borderRadius: "999px" },
        ], { duration: 340, easing: "cubic-bezier(.3,1.2,.5,1)" });
        el.querySelectorAll("button, span").forEach((c, i) =>
          c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 120 + i * 30, fill: "backwards" }));
      } else if (to === 0) {
        el.animate([
          { transform: "scale(.5) rotate(-90deg)", opacity: 0 },
          { transform: "scale(1.1) rotate(8deg)", opacity: 1, offset: 0.7 },
          { transform: "scale(1) rotate(0)" },
        ], { duration: 320, easing: "ease-out" });
      }
    });
  };

  /* ---------- Heart burst ---------- */
  const heartBurst = (btn) => {
    btn.animate([
      { transform: "scale(1)" }, { transform: "scale(.7)" }, { transform: "scale(1.35)" }, { transform: "scale(1)" },
    ], { duration: 450, easing: "ease-out" });
    const c = center(btn.getBoundingClientRect());
    const colors = ["#e0574a", "#e0a23a", "#2f6b3d", "#f28b7d"];
    for (let i = 0; i < 10; i++) {
      const p = document.createElement("span");
      p.className = "fx-spark";
      p.style.left = c.x + "px";
      p.style.top = c.y + "px";
      p.style.background = colors[i % colors.length];
      layer.appendChild(p);
      const ang = (Math.PI * 2 * i) / 10 + Math.random() * 0.3;
      const dist = 22 + Math.random() * 14;
      p.animate([
        { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist}px)) scale(.2)`, opacity: 0 },
      ], { duration: 520, easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => p.remove();
    }
  };

  /* ---------- Confetti for free delivery ---------- */
  const confetti = (origin) => {
    const c = origin ? center(origin.getBoundingClientRect()) : { x: innerWidth / 2, y: 80 };
    const colors = ["#2f6b3d", "#e0a23a", "#c8693e", "#8fae6f", "#f2cf72"];
    for (let i = 0; i < 34; i++) {
      const p = document.createElement("span");
      p.className = "fx-confetti";
      p.style.left = c.x + "px";
      p.style.top = c.y + "px";
      p.style.background = colors[i % colors.length];
      if (i % 3 === 0) p.style.borderRadius = "50%";
      layer.appendChild(p);
      const dx = (Math.random() - 0.5) * 380;
      const up = 80 + Math.random() * 140;
      const fall = 160 + Math.random() * 240;
      const spin = (Math.random() - 0.5) * 900;
      p.animate([
        { transform: "translate(0,0) rotate(0)", opacity: 1 },
        { transform: `translate(${dx * 0.6}px, ${-up}px) rotate(${spin * 0.4}deg)`, opacity: 1, offset: 0.35 },
        { transform: `translate(${dx}px, ${fall}px) rotate(${spin}deg)`, opacity: 0 },
      ], { duration: 1300 + Math.random() * 600, easing: "cubic-bezier(.2,.6,.4,1)" }).onfinish = () => p.remove();
    }
  };

  let prevSubtotal = Cart.subtotal();
  Cart.onChange(() => {
    const sub = Cart.subtotal();
    const limit = D.store.freeDeliveryOver;
    if (prevSubtotal < limit && sub >= limit) {
      setTimeout(() => {
        if (canAnimate) confetti($("#cart.open .ship-meter") || bagButton());
        window.FL.toast("You've unlocked free UK delivery!");
      }, inFlight ? 800 : 50);
    }
    prevSubtotal = sub;
  });

  /* ---------- Click handling (capture phase, before the app re-renders) ---------- */
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add], [data-inc]");
    const dec = e.target.closest("[data-dec]");
    const fav = e.target.closest("[data-fav]");

    if (add) {
      const id = add.dataset.add || add.dataset.inc;
      const before = Cart.qty(id);
      const inDrawer = !!add.closest("#cart");
      buzz();
      if (canAnimate && !inDrawer) flyToBasket(add);
      setTimeout(() => {
        if (!canAnimate) return;
        if (before === 0) morphControl(id, 0, Cart.qty(id));
        else rollNumber(id, 1);
      }, 0);
    }

    if (dec) {
      const id = dec.dataset.dec;
      const before = Cart.qty(id);
      const line = dec.closest(".cart-line");
      buzz(8);
      if (canAnimate && line && before === 1) {
        // Swipe the line out of the basket before removing it.
        e.stopPropagation();
        const h = line.offsetHeight;
        line.style.overflow = "hidden";
        line.animate([
          { transform: "translateX(0)", opacity: 1, height: h + "px" },
          { transform: "translateX(60px)", opacity: 0, height: h + "px", offset: 0.55 },
          { transform: "translateX(60px)", opacity: 0, height: "0px", paddingTop: "0px", paddingBottom: "0px" },
        ], { duration: 380, easing: "ease-in-out" }).onfinish = () => Cart.add(id, -1);
        return;
      }
      setTimeout(() => {
        if (!canAnimate) return;
        if (before === 1) morphControl(id, 1, 0);
        else rollNumber(id, -1);
      }, 0);
    }

    if (fav && canAnimate) {
      setTimeout(() => { if (fav.classList.contains("on")) heartBurst(fav); }, 0);
    }
  }, true);

  // Basket drawer: lines slide in one after another when it opens.
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-open-cart]") || !canAnimate) return;
    setTimeout(() => {
      $$("#cart-body .ship-meter, #cart-body .cart-line, #cart-body .cart-empty").forEach((el, i) =>
        el.animate([{ transform: "translateX(28px)", opacity: 0 }, { transform: "none", opacity: 1 }],
          { duration: 360, delay: 80 + i * 45, easing: "cubic-bezier(.2,.8,.3,1)", fill: "backwards" }));
    }, 0);
  });

  /* ---------- Card tilt with a soft light sheen ---------- */
  if (canAnimate && finePointer) {
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".card, .cat-tile, .recipe");
      $$(".is-tilting").forEach((c) => { if (c !== card) resetTilt(c); });
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.classList.add("is-tilting");
      card.style.setProperty("--rx", ((0.5 - py) * 6).toFixed(2) + "deg");
      card.style.setProperty("--ry", ((px - 0.5) * 8).toFixed(2) + "deg");
      card.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
    }, { passive: true });
    const resetTilt = (c) => { c.classList.remove("is-tilting"); c.style.removeProperty("--rx"); c.style.removeProperty("--ry"); };
    document.documentElement.addEventListener("mouseleave", () => $$(".is-tilting").forEach(resetTilt));
  }

  /* ---------- Drag-to-scroll carousels with momentum ---------- */
  const enableDrag = (track) => {
    if (track.dataset.drag) return;
    track.dataset.drag = "1";
    let down = false, startX = 0, startScroll = 0, lastX = 0, lastT = 0, v = 0, moved = 0, raf;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = 0; startX = lastX = e.clientX; startScroll = track.scrollLeft; lastT = performance.now(); v = 0;
      cancelAnimationFrame(raf);
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved < 6) return; // still a click, not a drag
      track.classList.add("is-dragging");
      track.scrollLeft = startScroll - dx;
      const now = performance.now();
      v = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX; lastT = now;
    });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      if (moved < 6) { track.classList.remove("is-dragging"); return; }
      let vel = -v * 16;
      const glide = () => {
        if (Math.abs(vel) < 0.4) { track.classList.remove("is-dragging"); return; }
        track.scrollLeft += vel;
        vel *= 0.94;
        raf = requestAnimationFrame(glide);
      };
      canAnimate ? glide() : track.classList.remove("is-dragging");
    });
    // A drag shouldn't count as a click on the card underneath.
    track.addEventListener("click", (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
  };
  if (finePointer) $$(".row-scroll .track, .chips").forEach(enableDrag);

  /* ---------- Sections rise into view as you scroll ---------- */
  if (canAnimate && "IntersectionObserver" in window) {
    const targets = $$(".section .section-head, .cat-tile, main .card, .recipe, .step, .story, .promo, .delivery, .newsletter, .panel, .info-card, .bundles-wrap");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add("is-revealed");
        io.unobserve(el);
        // Hand the element back to its normal hover transitions once it has landed.
        setTimeout(() => el.classList.remove("will-reveal", "is-revealed"), 1100);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight) return; // already on screen: leave it as is
      const sibs = el.parentElement ? [...el.parentElement.children] : [];
      el.style.setProperty("--d", (sibs.indexOf(el) % 8) * 55 + "ms");
      el.classList.add("will-reveal");
      io.observe(el);
    });
  }

  /* ---------- Shop grid restocks when filters change ---------- */
  document.addEventListener("fl:grid", () => {
    if (!canAnimate) return;
    $$("#grid .card").slice(0, 24).forEach((el, i) =>
      el.animate([{ transform: "translateY(14px) scale(.98)", opacity: 0 }, { transform: "none", opacity: 1 }],
        { duration: 380, delay: i * 30, easing: "cubic-bezier(.2,.8,.3,1)", fill: "backwards" }));
  });

  /* ---------- Search hint types itself ---------- */
  const typeHint = (input, words) => {
    if (!input || !canAnimate) return;
    const base = input.placeholder;
    let w = 0, i = 0, del = false, timer;
    const tick = () => {
      if (document.activeElement === input || input.value) { input.placeholder = base; timer = setTimeout(tick, 1200); return; }
      const word = words[w];
      i += del ? -1 : 1;
      input.placeholder = `Search ${word.slice(0, i)}`;
      let wait = del ? 35 : 75;
      if (!del && i === word.length) { del = true; wait = 1400; }
      else if (del && i === 0) { del = false; w = (w + 1) % words.length; wait = 300; }
      timer = setTimeout(tick, wait);
    };
    timer = setTimeout(tick, 1500);
    input.addEventListener("focus", () => { input.placeholder = base; });
  };
  const hints = ["ijebu gari…", "palm oil…", "goat meat…", "scotch bonnet…", "chin chin…", "egusi…"];
  typeHint($("#hero-q"), hints);
  typeHint($("#q"), hints);

  window.FL.motion = { flyToBasket, confetti };
})();
