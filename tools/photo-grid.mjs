// Crop of a photo, enlarged, with a pixel grid (labels in the photo's own pixels) and optional overlays of vehicle-frame
// polylines projected through a fitted camera: for reading outline points for trace-profile.mjs and for checking a
// profile against a museum photo. Renders with Playwright's Chromium (the e2e dependency).
// Usage: node tools/photo-grid.mjs <photo.jpg> <out.png> [x0 y0 x1 y1] [scale] [step] [--overlay overlay.json]
// overlay.json: { cam, image, shapes: [{ y (mm plane), pts: [[x, z], …] (mm), color?, closed? }] }; shapes may instead take
// { from: "stops/<slug>/car.js", path: "body.ghost.0.pts" } to draw a profile straight from a car config.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { camera } from "./camera.mjs";

const args = process.argv.slice(2), oi = args.indexOf("--overlay"), overlay = oi >= 0 ? JSON.parse(readFileSync(args.splice(oi, 2)[1], "utf8")) : null;
const [photo, out, ...nums] = args, b64 = readFileSync(photo).toString("base64");
const browser = await chromium.launch(), page = await browser.newPage();
await page.setContent(`<img id="i" src="data:image/jpeg;base64,${b64}">`);
const [W, H] = await page.$eval("#i", i => [i.naturalWidth, i.naturalHeight]);
const [x0, y0, x1, y1] = nums.length >= 4 ? nums.slice(0, 4).map(Number) : [0, 0, W, H], k = +(nums[4] ?? 1), step = +(nums[5] ?? 50);

const lines = [];
for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) lines.push(`<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="${x % (2 * step) ? "#fa0" : "#f00"}"/><text x="${x + 1}" y="${y0 + 9 / k}" fill="#f33">${x}</text>`);
for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) lines.push(`<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${y % (2 * step) ? "#0dd" : "#08f"}"/><text x="${x0 + 1}" y="${y - 1 / k}" fill="#0af">${y}</text>`);
if (overlay) {
  const cam = camera(overlay.cam, overlay.image);
  for (const s of overlay.shapes) {
    let pts = s.pts;
    if (s.from) { pts = (await import(pathToFileURL(resolve(s.from)))).default; for (const key of s.path.split(".")) pts = pts[key]; }
    const xy = pts.map(([x, z]) => cam.project([x, s.y, z]).map(v => v.toFixed(1)).join(","));
    lines.push(`<poly${s.closed ? "gon" : "line"} points="${xy.join(" ")}" fill="none" stroke="${s.color ?? "#f0f"}" stroke-width="${2 / k}"/>`);
  }
}
await page.setViewportSize({ width: Math.round((x1 - x0) * k), height: Math.round((y1 - y0) * k) });
await page.setContent(`<body style="margin:0"><svg width="${(x1 - x0) * k}" height="${(y1 - y0) * k}" viewBox="${x0} ${y0} ${x1 - x0} ${y1 - y0}"
  font-size="${9 / k}" font-family="monospace" stroke-width="${1 / k}"><image href="data:image/jpeg;base64,${b64}" width="${W}" height="${H}"/>${lines.join("")}</svg></body>`);
await page.screenshot({ path: out });
await browser.close();
console.log(`${out}: ${W}×${H} photo, crop ${x0},${y0}–${x1},${y1} at ×${k}`);
