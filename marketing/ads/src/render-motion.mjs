// Renders each <section class="ad"> in motion.html to marketing/ads/motion/<name>.mp4
// by stepping the animations frame by frame and piping the frames into ffmpeg.
// Usage: node marketing/ads/src/render-motion.mjs [id-filter]
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");

const FPS = 30;
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "../motion");
mkdirSync(out, { recursive: true });
const only = process.argv[2] || "";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 1000 } });
await page.goto(pathToFileURL(path.join(here, "motion.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const ads = await page.$$eval("section.ad", (els) => els.map((e) => ({ id: e.id, duration: +e.dataset.duration })));
for (const { id, duration } of ads.filter((a) => a.id.includes(only))) {
  const file = path.join(out, id.replace(/^motion-/, "") + ".mp4");
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", file],
    { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg exited " + c)))));
  const el = page.locator("#" + id);
  const frames = Math.round(duration * FPS);
  for (let f = 0; f < frames; f++) {
    await page.evaluate(([id, t]) => window.seek(id, t), [id, f / FPS]);
    const buf = await el.screenshot({ type: "png", animations: "allow" });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await done;
  console.log("wrote", path.relative(process.cwd(), file), `(${duration}s, ${frames} frames)`);
}
await browser.close();
