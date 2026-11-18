// Shared test helpers: load the tour and every car config (pure data, no three.js).
import tour from "../../stops/tour.js";

export { tour };
export const loadCars = () => Promise.all(tour.map(async s => (await import(`../../stops/${s.slug}/car.js`)).default));

// The car.js fields a translation overlay (stops/<slug>/<lang>.js) must cover: page text and the labels subsystems show.
// Paths use "*" for any array index; legend entries are [token, text] pairs, so only their text is translated.
const TEXT = [
  "title", "name", "summary", "eyebrow", "lede", "note", "unverified.*", "photo.alt",
  "components.*.label", "components.*.talk.*",
  ...["label", "engineLabel", "legendTitle", "links.*.name", "shapes.*.label", "types.*.label", "presets.*.label",
    "cases.*.label", "modes.*", "drive.gears.*.name", "legend.*.1", "surfaces.*.label",
    "consumers.*.label", "compare"].map(p => `components.*.params.${p}`),
];
const RULES = TEXT.map(p => new RegExp(`^${p.replace(/\./g, "\\.").replace(/\*/g, "[^.]+")}$`));
export const isText = path => RULES.some(r => r.test(path));

// Every string leaf of v as [path, value], path joined with ".".
export function leaves(v, path = []) {
  if (typeof v === "string") return [[path.join("."), v]];
  if (Array.isArray(v)) return v.flatMap((x, i) => leaves(x, [...path, i]));
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => leaves(x, [...path, k]));
  return [];
}

// The overlay shape for a car with only its text leaves; other array items become null (merge keeps the original).
export function skeleton(v, path = []) {
  if (typeof v === "string") return isText(path.join(".")) ? v : undefined;
  if (Array.isArray(v)) {
    const items = v.map((x, i) => skeleton(x, [...path, i]));
    return items.some(x => x !== undefined) ? items.map(x => x ?? null) : undefined;
  }
  if (v && typeof v === "object") {
    const out = {};
    for (const [k, x] of Object.entries(v)) { const s = skeleton(x, [...path, k]); if (s !== undefined) out[k] = s; }
    return Object.keys(out).length ? out : undefined;
  }
  return undefined;
}
