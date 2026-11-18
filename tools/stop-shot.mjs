// Screenshot of a stop's 3D stage after it has run a while, with the frame rate and any page errors: for checking a
// mechanism by eye. Needs the dev server (npm run serve). Uses Playwright's Chromium.
// Usage: node tools/stop-shot.mjs <slug> <component id> <out.png> [ms to run, default 15000] [button text …] [--photo]
// Scrolls the story to the component's step (--photo: to the closing step, museum photo with the car outline). Buttons are
// clicked inside the component's cards, e.g. "Pressure"; the full-page shot goes to <out>-page.png.
import { chromium } from "@playwright/test";

const args = process.argv.slice(2), photo = args.includes("--photo"), [slug, comp, out, ms = "15000", ...buttons] = args.filter(a => a !== "--photo");
const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 1280, height: 900 } }), errors = [];
page.on("pageerror", e => errors.push(e.message)); page.on("console", m => m.type() === "error" && errors.push(m.text()));
await page.goto(`http://localhost:8765/stop.html?s=${slug}&debug`);
await page.waitForFunction(() => window.__tour?.ready);
const step = photo ? page.locator(".step").last() : page.locator(".step", { has: page.locator(`[data-comp="${comp}"]`) }).first();
await step.evaluate(s => s.scrollIntoView({ block: "center" }));
for (const b of buttons) await page.click(`[data-comp="${comp}"] button:text-is("${b}")`);
const frames = () => page.evaluate(() => window.__tour.stories[0].frames());
const f0 = await frames(), t0 = Date.now();
await page.waitForTimeout(+ms);
const fps = ((await frames()) - f0) / (Date.now() - t0) * 1000;
await (await page.$(".stage")).screenshot({ path: out });
await page.screenshot({ path: out.replace(/\.png$/, "-page.png") });
await browser.close();
console.log(`${out}: ${fps.toFixed(0)} fps, errors ${JSON.stringify(errors)}`);
