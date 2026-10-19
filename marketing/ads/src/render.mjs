// Renders each <section class="ad"> in ads.html to marketing/ads/<id>.png
// Usage: node marketing/ads/src/render.mjs
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "..");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 1000 } });
await page.goto(pathToFileURL(path.join(here, "ads.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const fontsOk = await page.evaluate(() => document.fonts.check('800 40px "Outfit"') && document.fonts.check('600 20px "Inter"'));
console.log("web fonts loaded:", fontsOk);

for (const id of await page.$$eval("section.ad", (els) => els.map((e) => e.id))) {
  const file = path.join(out, id.replace(/^ad-/, "") + ".png");
  await page.locator("#" + id).screenshot({ path: file });
  console.log("wrote", path.relative(process.cwd(), file));
}
await browser.close();
