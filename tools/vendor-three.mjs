// Vendor an exact three.js release into vendor/three/ so the site never depends on a CDN at runtime.
// Usage: node tools/vendor-three.mjs 0.186.1     (then run npm test && npm run e2e)
// Add addon paths (relative to examples/jsm/) to ADDONS when a page needs them, e.g. "loaders/GLTFLoader.js".
import { mkdir, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

const ver = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(ver ?? "")) { console.error("usage: node tools/vendor-three.mjs <exact version, e.g. 0.186.1>"); process.exit(1); }
const CDN = `https://cdn.jsdelivr.net/npm/three@${ver}`;
const OUT = new URL("../vendor/three/", import.meta.url).pathname;
const CORE = ["build/three.module.min.js", "build/three.core.min.js"];   // three.core.min.js exists from r172 on
const ADDONS = ["controls/OrbitControls.js"];

async function get(path, optional = false) {
  const res = await fetch(`${CDN}/${path}`);
  if (!res.ok) { if (optional) return null; throw new Error(`${res.status} ${CDN}/${path}`); }
  return Buffer.from(await res.arrayBuffer());
}
async function put(rel, buf) { const p = join(OUT, rel); await mkdir(dirname(p), { recursive: true }); await writeFile(p, buf); console.log(`${rel}  ${(buf.length / 1024).toFixed(0)} KB`); }

await rm(OUT, { recursive: true, force: true });
const core = await get(CORE[1], true);
let mod = (await get(CORE[0])).toString("utf8");
if (core) {
  // The minified module imports the unminified "./three.core.js"; point it at the minified core instead.
  if (!mod.includes('"./three.core.js"')) throw new Error("three.module.min.js no longer imports ./three.core.js — check the build layout");
  mod = mod.replaceAll('"./three.core.js"', '"./three.core.min.js"');
  await put("three.core.min.js", core);
}
await put("three.module.min.js", Buffer.from(mod));
for (const a of ADDONS) await put(`addons/${a}`, await get(`examples/jsm/${a}`));
await put("LICENSE", await get("LICENSE"));
await put("VERSION", Buffer.from(ver + "\n"));
