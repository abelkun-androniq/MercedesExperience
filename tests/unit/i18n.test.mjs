// Translations: the UI catalog holds exactly the keys the code uses, with matching {n} placeholders; subsystem text goes
// through t(); every stop's stops/<slug>/hu.js covers exactly the text fields of its car.js.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { tour, loadCars, leaves, isText } from "./helpers.mjs";
import { merge } from "../../lib/app/i18n.js";
import hu from "../../lib/app/i18n/hu.js";

const root = new URL("../../", import.meta.url);
const read = p => readFileSync(new URL(p, root), "utf8");
const js = dir => readdirSync(new URL(dir, root)).filter(f => f.endsWith(".js")).map(f => [`${dir}${f}`, read(`${dir}${f}`)]);
const code = s => s.replace(/^\s*\/\/.*$/gm, "").replace(/\s\/\/ .*$/gm, "");   // comments may quote t("…")
const sources = [...js("lib/app/"), ...js("subsystems/")].filter(([f]) => f !== "lib/app/i18n.js").map(([f, s]) => [f, code(s)]);

const used = new Set();
for (const [, s] of sources) for (const m of s.matchAll(/\bt\(\s*"((?:[^"\\]|\\.)*)"/g)) used.add(JSON.parse(`"${m[1]}"`));
for (const f of readdirSync(root).filter(f => f.endsWith(".html"))) for (const m of read(f).matchAll(/data-i18n[^>]*>([^<]*)</g)) used.add(m[1].trim().replace(/\s+/g, " "));
for (const s of tour) used.add(s.room);   // shown with t(stop.room)

test("every text the code shows has a Hungarian translation", () => {
  assert.deepEqual([...used].filter(k => !(k in hu)), []);
  assert.deepEqual([...used].filter(k => k.includes("&")), [], "data-i18n text is read as textContent: write characters, not entities");
});

test("the Hungarian catalog has no unused keys", () => {
  assert.deepEqual(Object.keys(hu).filter(k => !used.has(k)), []);
});

test("translations keep their {n} placeholders", () => {
  const marks = s => [...s.matchAll(/\{\d\}/g)].map(m => m[0]).sort().join();
  assert.deepEqual(Object.entries(hu).filter(([k, v]) => marks(k) !== marks(v)).map(([k]) => k), []);
});

test("t() is called with a literal, so the tests can find every key", () => {
  const bad = [];
  for (const [f, s] of sources) for (const m of s.matchAll(/\bt\(\s*([^\s"])/g)) {
    const call = s.slice(m.index, m.index + 20);
    if (!/^t\((stop\.room|room\.name)\)/.test(call)) bad.push(`${f}: ${call}`);   // rooms: keys taken from stops/tour.js
  }
  assert.deepEqual(bad, []);
});

test("subsystem labels, units and legends go through t()", () => {
  const bad = [];
  for (const [f, s] of sources.filter(([f]) => f.startsWith("subsystems/"))) {
    for (const m of s.matchAll(/\b(?:label|unit|text|aria|top|bottom): "[^"]*[A-Za-z][^"]*"|toggle: \["|\["--[a-z0-9-]+", "[^"]*[A-Za-z]/g)) bad.push(`${f}: ${m[0]}`);
  }
  assert.deepEqual(bad, []);
});

const cars = await loadCars();
for (const [i, s] of tour.entries()) {
  test(`${s.slug}: hu.js translates every text field of car.js and nothing else`, async () => {
    const car = cars[i], over = (await import(`../../stops/${s.slug}/hu.js`)).default;
    const text = new Map(leaves(car).filter(([p]) => isText(p))), got = new Map(leaves(over));
    assert.deepEqual([...text.keys()].filter(p => !got.get(p)?.trim()), [], "untranslated");
    assert.deepEqual([...got.keys()].filter(p => !text.has(p)), [], "not a text field of car.js");
    assert.deepEqual(leaves(merge(car, over)).filter(([p]) => !isText(p)), leaves(car).filter(([p]) => !isText(p)));
    // Hungarian writes a decimal comma; model names such as "300 SEL 6.3" or "190 E 2.5-16" keep their point.
    assert.deepEqual([...got.values()].filter(v => /\d\.\d/.test(v.replace(/SEL 6\.3|SLC 5\.0|\b2\.[35]-16/g, ""))), [], "decimal point");
  });
}
