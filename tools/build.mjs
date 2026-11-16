// Build the deployable site into _site/: copy the site files, then stamp the service worker with a content-hash VERSION
// and the full precache list, so one visit stores every stop. Node built-ins only. Usage: node tools/build.mjs
import { cp, rm, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url)), out = join(root, "_site");
const ENTRIES = ["index.html", "stop.html", "sw.js", "manifest.webmanifest", "icons", "lib", "stops", "subsystems", "vendor"];
const SKIP = /(^|\/)\.|\.svg$/;   // dotfiles (.DS_Store) and the icon source

await rm(out, { recursive: true, force: true });
await mkdir(out);
for (const e of ENTRIES) await cp(join(root, e), join(out, e), { recursive: true, filter: src => !SKIP.test(src.slice(root.length)) });

async function walk(dir, base = "") {
  const files = [];
  for (const d of await readdir(join(dir, base), { withFileTypes: true })) {
    const rel = base ? `${base}/${d.name}` : d.name;
    if (d.isDirectory()) files.push(...await walk(dir, rel)); else files.push(rel);
  }
  return files;
}

const files = (await walk(out)).filter(f => f !== "sw.js").sort();
const hash = createHash("sha256");
let bytes = 0;
for (const f of files) { const b = await readFile(join(out, f)); bytes += b.length; hash.update(f).update(b); }
const version = hash.digest("hex").slice(0, 12);

const swPath = join(out, "sw.js"), sw = await readFile(swPath, "utf8");
const list = ["./", ...files.map(f => `./${f}`)];
const stamped = sw.replace('const VERSION = "dev";', `const VERSION = "${version}";`).replace("const FILES = [];", `const FILES = ${JSON.stringify(list)};`);
if (stamped === sw || !stamped.includes(version) || stamped.includes("const FILES = [];")) throw new Error("sw.js: VERSION/FILES placeholders not found");
await writeFile(swPath, stamped);
console.log(`_site: ${files.length} files, ${(bytes / 1024).toFixed(0)} KB, version ${version}`);
