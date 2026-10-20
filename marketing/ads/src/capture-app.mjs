// Captures phone-sized screenshots of the real site for the app ad (app-ad.html):
// still screens, real scroll sequences (one frame per video frame) and the positions
// of the buttons the ad "taps", saved to src/screens/meta.js.
// A demo shopper, basket and order are seeded in localStorage so every screen has content.
// Usage: node marketing/ads/src/capture-app.mjs   (src/screens/ is git-ignored)
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, "../../..");
const out = path.join(here, "screens");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const url = (p) => { const [file, rest = ""] = p.split(/(?=[?#])/); return pathToFileURL(path.join(site, file)).href + rest; };

// The phone screen is 440×956 CSS px; the top 54px is the iOS status bar drawn by the ad,
// so the page itself gets 440×902. 1.5x is plenty for a phone shown ~550px wide in a 1080 video.
const VIEW = { width: 440, height: 902 };
const FPS = 30;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: VIEW, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
const page = await ctx.newPage();

const placed = Date.now() - 6 * 36e5; // 6 hours ago, so the order shows as "Dispatched"
await ctx.addInitScript((placed) => {
  if (sessionStorage.getItem("seeded")) return;
  sessionStorage.setItem("seeded", "1");
  const set = (k, v) => localStorage.setItem("danyj:" + k, JSON.stringify(v));
  set("user", { first: "Ada", last: "Okafor", email: "ada@example.com", phone: "07700 900123", since: placed - 120 * 864e5 });
  set("signedIn", true);
  set("addresses", [{ id: "home", label: "Home", line1: "24 Victoria Road", line2: "", city: "Glasgow", postcode: "G42 7AA", phone: "07700 900123", isDefault: true }]);
  set("cart", { "tilda-golden-sella-basmati-rice": 2, "palm-oil": 1, "ground-egusi-melon": 1, "goat-meat-with-bone": 1, "scotch-bonnet-ata-rodo": 1 });
  set("orders", [{ id: "418273", placed, items: { "yellow-garri": 2, "maggi-star-seasoning-cubes-400g": 1, "unripe-plantain-x1": 6, "gino-tomato-paste-400g": 2 }, subtotal: 25.95, discount: 0, code: "", fee: 4.99, total: 30.94,
    customer: "Ada Okafor", email: "ada@example.com", phone: "07700 900123", safePlace: "Front door", notes: "", slotDate: placed + 864e5, slotTime: "5pm – 9pm", addressLine: "24 Victoria Road, G42 7AA" }]);
}, placed);

const meta = { fps: FPS, view: VIEW, seq: {} };
const settle = () => page.waitForTimeout(500);
const shot = async (name) => { await page.screenshot({ path: path.join(out, name + ".png") }); console.log("wrote screens/" + name + ".png"); };
const box = async (locator) => { const b = await locator.boundingBox(); return { x: Math.round(b.x + b.width / 2), y: Math.round(b.y + b.height / 2), w: Math.round(b.width), h: Math.round(b.height) }; };
const go = async (p) => { await page.goto(url(p), { waitUntil: "networkidle" }); await page.evaluate(() => document.fonts.ready); await settle(); };
const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

// Records a real scroll from the current position to `to` (page y), one frame per video frame.
const scrollSeq = async (name, to, seconds) => {
  mkdirSync(path.join(out, name), { recursive: true });
  const from = await page.evaluate(() => scrollY), n = Math.round(seconds * FPS);
  for (let i = 0; i < n; i++) {
    const y = from + (to - from) * easeInOut(i / (n - 1));
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(30);
    await page.screenshot({ path: path.join(out, name, String(i).padStart(3, "0") + ".png") });
  }
  meta.seq[name] = n;
  console.log(`wrote screens/${name}/ (${n} frames)`);
};

// 1. Home + a real scroll down the page
await go("index.html");
await shot("home");
await scrollSeq("home-scroll", 1500, 2);

// 2. Shop list, then the product sheet
await go("shop.html?cat=grains");
await shot("shop");
meta.tilda = await box(page.locator('[data-open-product="tilda-golden-sella-basmati-rice"]').first());
meta.basketTab = await page.evaluate(() => {
  const els = [...document.querySelectorAll("[data-open-cart]")].filter((e) => e.offsetParent);
  const r = els.map((e) => e.getBoundingClientRect()).sort((a, b) => b.bottom - a.bottom)[0];
  return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
});
await page.locator('[data-open-product="tilda-golden-sella-basmati-rice"]').first().click();
await settle();
await shot("product");
meta.add = await box(page.locator("button:visible", { hasText: "Add to basket" }).first());

// 3. Basket drawer
await go("index.html");
await page.locator("[data-open-cart]:visible").first().click();
await settle();
await shot("basket");
meta.checkout = await box(page.locator("#cart-foot :is(a,button):visible", { hasText: "Checkout" }).first());

// 4. Checkout: top, scroll to the delivery slots, then pick a day and time
await go("account.html#basket");
await shot("checkout");
const slotY = await page.evaluate(() => document.querySelector(".slot-days").getBoundingClientRect().top + scrollY - 190);
await scrollSeq("checkout-scroll", slotY, 1.2);
meta.slotDay = await box(page.locator(".slot-day").nth(2));
meta.slotTime = await box(page.locator(".slot-time").nth(2));
// Clicked in-page: the account area re-renders after each pick, which can briefly detach the buttons.
await page.evaluate(() => document.querySelectorAll(".slot-day")[2].click());
await page.waitForTimeout(300);
await page.evaluate((y) => window.scrollTo(0, y), slotY);
await settle();
await shot("checkout-day");
await page.evaluate(() => document.querySelectorAll(".slot-time")[2].click());
await page.waitForTimeout(300);
await page.evaluate((y) => window.scrollTo(0, y), slotY);
await settle();
await shot("checkout-picked");

// 5. Order tracking
await go("account.html#orders");
await page.getByRole("button", { name: "Track" }).first().click();
await settle();
await shot("tracking");
meta.dispatched = await box(page.locator(".now .dot").first());

writeFileSync(path.join(out, "meta.js"), "window.SCREEN_META = " + JSON.stringify(meta, null, 1) + ";\n");
console.log("wrote screens/meta.js", JSON.stringify(meta));
await browser.close();
