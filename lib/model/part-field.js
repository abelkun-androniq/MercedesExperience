// One component's precomputed airflow (tools/cfd/part.mjs → stops/<slug>/cfd/<part>/, shown by subsystems/race-aero.js):
// a flat grid of one scalar per cell on a plane through the part, the same for every case of the part, plus per case the
// mean-flow paths and the guides (arrows, lines) that carry its lesson. Pure: no DOM, no three.js, no file access.
//
// field.json: { plane: "xz" | "xy", originMm: [x, y, z] (centre of the first cell), cellMm, width, height, quantity,
//   range: [lo, hi], cases: { <id>: { lines: [[[x, y, z], …], …], guides: [{ kind: "arrow" | "line", points, faint? }],
//   follow?: [line index] } } }. Points in vehicle mm (x forward, y left, z up).
// <id>.bin: width · height bytes, row-major, rows from the bottom. Advancing a column always decreases x (the air's way);
// advancing a row increases z on an "xz" plane and y on an "xy" plane. 255 marks a solid cell; the field's range maps
// onto 0…254 with rounding and clamping.
export const SOLID = 255;
export const PLANES = ["xz", "xy"];
export const QUANTITIES = ["vertical-speed-over-inlet", "pressure-coefficient", "speed-over-inlet"];

// Centre of cell (a, b) in mm.
export function centre({ plane, originMm: [x, y, z], cellMm: h }, a, b) {
  return plane === "xz" ? [x - a * h, y, z + b * h] : [x - a * h, y + b * h, z];
}

// The grid's outer corners in mm, in texture order: (u, v) = (0, 0), (1, 0), (0, 1), (1, 1); u runs with the columns, v up
// the rows. Each cell is a square of side cellMm around its centre.
export function corners(f) {
  const lo = centre(f, -0.5, -0.5), u = centre(f, f.width - 0.5, -0.5), v = centre(f, -0.5, f.height - 0.5), uv = centre(f, f.width - 0.5, f.height - 0.5);
  return [lo, u, v, uv];
}

export const quantize = (v, [lo, hi]) => Math.max(0, Math.min(254, Math.round((v - lo) / (hi - lo) * 254)));
export const dequantize = (byte, [lo, hi]) => (byte === SOLID ? null : lo + byte / 254 * (hi - lo));

// The bytes of one case: sample(x, y, z) gives the field's value at a cell centre, or null for a solid cell.
export function encode(f, sample) {
  const out = new Uint8Array(f.width * f.height);
  for (let b = 0; b < f.height; b++) for (let a = 0; a < f.width; a++) {
    const v = sample(...centre(f, a, b));
    out[b * f.width + a] = v == null ? SOLID : quantize(v, f.range);
  }
  return out;
}

// One case's bytes read back: at(a, b) → value, or null for a solid cell. Throws on a wrong byte count.
export function decode(f, bytes) {
  if (bytes.length !== f.width * f.height) throw new Error(`field: ${bytes.length} bytes, want ${f.width * f.height}`);
  return { at: (a, b) => dequantize(bytes[b * f.width + a], f.range), solid: (a, b) => bytes[b * f.width + a] === SOLID };
}

// What is wrong with a manifest, given the case ids its stop expects (empty when it is fine).
export function problems(f, ids) {
  const bad = [];
  if (!PLANES.includes(f.plane)) bad.push(`plane ${f.plane}`);
  if (!QUANTITIES.includes(f.quantity)) bad.push(`quantity ${f.quantity}`);
  if (!(f.originMm?.length === 3 && f.originMm.every(Number.isFinite))) bad.push("originMm");
  if (!(f.cellMm > 0) || !Number.isInteger(f.width) || !Number.isInteger(f.height) || f.width < 1 || f.height < 1) bad.push("grid size");
  if (!(f.range?.length === 2 && f.range[0] < f.range[1])) bad.push("range");
  const got = Object.keys(f.cases ?? {});
  if (got.join() !== ids.join()) bad.push(`cases ${got.join()} ≠ ${ids.join()}`);
  const point = p => p?.length === 3 && p.every(Number.isFinite);
  for (const [id, c] of Object.entries(f.cases ?? {})) {
    if (!Array.isArray(c.lines) || !c.lines.every(l => Array.isArray(l) && l.every(point))) bad.push(`${id}: lines`);
    if (!Array.isArray(c.guides) || !c.guides.every(g => ["arrow", "line"].includes(g.kind) && g.points?.length >= 2 && g.points.every(point))) bad.push(`${id}: guides`);
    if (c.follow && !c.follow.every(i => Number.isInteger(i) && c.lines[i])) bad.push(`${id}: follow`);
  }
  return bad;
}
