// Packs the whole-car tunnel results (tools/cfd/out/, from run.mjs): node tools/cfd/export.mjs. The stop now shows one
// part at a time (tools/cfd/part.mjs); this whole-car summary stays for reference in tools/cfd/out/whole-car/ (ignored).
// <case>.bin: three slices of the mean flow, each two Uint8 fields (speed |u|/U over 0…1.6, pressure
// coefficient over −1.5…1; 255 in the speed field marks the car): "side" the centre plane (x, z) and "cross" the plane just
// behind the front wheel (y, z, both sides mirrored); per slice speed then pressure, rows from the bottom.
// cfd.json: the slices' extents (mm), streamlines (mm) and, per case, the force coefficients and their
// change from the baseline on the display grid (28 mm, `delta`), the check grid (40 mm, `check`) and their mean (`est`, what
// the stop shows), with `settled`: the change has the same sign on both grids and its two-grid mean stands clear of the
// pooled spread. A case whose solid is the baseline's on the display grid (its change is finer than a cell) is left out,
// with a note. Forces come from the mean pressure on the car's faces
// (friction left out): drag, lift, and the extra load on each axle (+ = pressed down) from lift and pitching moment. They
// match the solver's momentum-exchange forces in the changes between cases; the solver's totals and its axle split did
// not survive that check, so its force history serves only as the noise estimate (sd).
import { writeFileSync, mkdirSync } from "node:fs";
import { CASES } from "./geometry.mjs";
import { load as loadRun } from "./volume.mjs";

const DIR = new URL("./out/", import.meta.url), OUT = new URL("./out/whole-car/", import.meta.url);
const H = +(process.argv[2] ?? 28), CHECK = +(process.argv[3] ?? 40), SIDE = { x: [2000, -6200], z: [0, 2100] }, CROSS = { x: -450, y: [-1400, 1400], z: [0, 1300] };
mkdirSync(OUT, { recursive: true });
const load = (c, h) => loadRun(`${c}-${h}`, DIR);
// Pressure forces on the half car as full-car coefficients (the ratio of half force to half area stands).
function forces(r) {
  const { nx, ny, nz, h, U, area } = r, at = (i, j, k) => (k * ny + j) * nx + i, iF = r.x0 / h - 0.5, L = 2678 / h;
  let ref = 0, n = 0; for (let k = Math.round(1800 / h); k < nz; k++) for (let j = 0; j < ny; j++) { ref += r.rho[at(3, j, k)]; n++; } ref /= n;
  const P = c => (r.rho[c] - ref) / 3;
  let Fx = 0, Fz = 0, tau = 0;   // vehicle frame, cells: x = iF − i forward, z = k + ½ up; τ = Σ z·Fx − x·Fz about the front contact
  for (let k = 1; k < nz - 1; k++) for (let j = 0; j < ny; j++) for (let i = 1; i < nx - 1; i++) {
    if (!r.solid[at(i, j, k)]) continue;
    const x = iF - i, z = k + 0.5;
    if (!r.solid[at(i - 1, j, k)]) { const f = -P(at(i - 1, j, k)); Fx += f; tau += z * f; }   // front face: pushed rearward
    if (!r.solid[at(i + 1, j, k)]) { const f = P(at(i + 1, j, k)); Fx += f; tau += z * f; }
    if (!r.solid[at(i, j, k - 1)]) { const f = P(at(i, j, k - 1)); Fz += f; tau -= (x) * f; }  // bottom face: pushed up
    if (!r.solid[at(i, j, k + 1)]) { const f = -P(at(i, j, k + 1)); Fz += f; tau -= (x) * f; }
  }
  const q = 0.5 * U * U * area, rear = -tau / L;
  return { cd: -Fx / q, cl: Fz / q, front: (-Fz - rear) / q, rear: rear / q };
}
const q8 = (v, lo, hi) => Math.max(0, Math.min(254, Math.round((v - lo) / (hi - lo) * 254)));

function pack(r) {
  const { nx, ny, nz, x0, h, U } = r, at = (i, j, k) => (k * ny + j) * nx + i;
  // Reference density: the oncoming air a little behind the inlet, above the car's height.
  let s = 0, n = 0; for (let k = Math.round(1800 / h); k < nz; k++) for (let j = 0; j < ny; j++) { s += r.rho[at(3, j, k)]; n++; }
  const ref = s / n, I = x => Math.max(0, Math.min(nx - 1, Math.round((x0 - x) / h - 0.5))), J = y => Math.min(ny - 1, Math.round(Math.abs(y) / h - 0.5)), K = z => Math.min(nz - 1, Math.max(0, Math.round(z / h - 0.5)));
  const cell = (i, j, k, sp, cp, o) => {
    const c = at(i, j, k);
    sp[o] = r.solid[c] ? 255 : q8(Math.hypot(r.ui[c], r.uj[c], r.uk[c]) / U, 0, 1.6);
    cp[o] = q8((r.rho[c] - ref) / 3 / (0.5 * U * U), -1.5, 1);
  };
  const grid = (w, hgt, f) => { const sp = new Uint8Array(w * hgt), cp = new Uint8Array(w * hgt); for (let b = 0; b < hgt; b++) for (let a = 0; a < w; a++) f(a, b, sp, cp, b * w + a); return [sp, cp]; };
  const side = { w: Math.round((SIDE.x[0] - SIDE.x[1]) / h), h: Math.round((SIDE.z[1] - SIDE.z[0]) / h) };
  const cross = { w: Math.round((CROSS.y[1] - CROSS.y[0]) / h), h: Math.round((CROSS.z[1] - CROSS.z[0]) / h) };
  // Rows run from the bottom (z, y) up; columns from the front (side, plan) or from the right (cross: y from −1400).
  const fields = [
    ...grid(side.w, side.h, (a, b, sp, cp, o) => cell(I(SIDE.x[0] - (a + 0.5) * h), 0, K(SIDE.z[0] + (b + 0.5) * h), sp, cp, o)),
    ...grid(cross.w, cross.h, (a, b, sp, cp, o) => cell(I(CROSS.x), J(CROSS.y[0] + (a + 0.5) * h), K(CROSS.z[0] + (b + 0.5) * h), sp, cp, o)),
  ];
  // Streamlines through the mean flow (RK2, trilinear, mirror at y = 0), seeded ahead of the car: a column on the centre
  // plane and a few by the front wheel. Points in mm, every 8th step (about 110 mm apart).
  const vel = (x, y, z) => {
    const fi = (x0 - x) / h - 0.5, fj = Math.abs(y) / h - 0.5, fk = z / h - 0.5;
    if (fi < 0 || fi >= nx - 1 || fk < 0 || fk >= nz - 1) return null;
    const i0 = fi | 0, k0 = fk | 0, a = fi - i0, c = fk - k0, j0 = Math.max(0, Math.min(ny - 2, Math.floor(fj))), b = Math.max(0, Math.min(1, fj - j0));
    let u = 0, v = 0, w = 0;
    for (const [di, dj, dk, wt] of [[0, 0, 0, (1 - a) * (1 - b) * (1 - c)], [1, 0, 0, a * (1 - b) * (1 - c)], [0, 1, 0, (1 - a) * b * (1 - c)], [1, 1, 0, a * b * (1 - c)],
      [0, 0, 1, (1 - a) * (1 - b) * c], [1, 0, 1, a * (1 - b) * c], [0, 1, 1, (1 - a) * b * c], [1, 1, 1, a * b * c]]) {
      const q = at(i0 + di, j0 + dj, k0 + dk); if (r.solid[q]) return null;
      u += wt * r.ui[q]; v += wt * r.uj[q]; w += wt * r.uk[q];
    }
    return [-u * h / U, Math.sign(y || 1) * v * h / U, w * h / U];   // mm per unit time, vehicle frame (x forward)
  };
  const trace = (x, y, z) => {
    const pts = [[x, y, z]];
    for (let n = 0; n < 1600; n++) {
      const a = vel(x, y, z); if (!a) break;
      const dt = 0.5, b = vel(x + a[0] * dt, y + a[1] * dt, z + a[2] * dt); if (!b) break;
      x += (a[0] + b[0]) / 2 * dt; y += (a[1] + b[1]) / 2 * dt; z += (a[2] + b[2]) / 2 * dt;
      if (n % 8 === 7) pts.push([x, y, z]);
      if (x < SIDE.x[1]) break;
    }
    return pts.map(p => p.map(Math.round));
  };
  const lines = [...Array.from({ length: 14 }, (_, n) => trace(1900, 15, 120 + n * 105)), ...[250, 400, 550].flatMap(z => [760, 840].map(y => trace(1300, y, z)))];
  return { fields, dims: { side, cross }, lines };
}

const meta = { h: H, side: SIDE, cross: CROSS, cases: {} };
const runs = Object.fromEntries(Object.keys(CASES).map(c => [c, Object.fromEntries([H, CHECK].map(h => { const r = load(c, h); return [h, { ...r, windows: r.mean.n, mean: forces(r) }]; }))]));
const K = ["cd", "cl", "front", "rear"];
for (const c of Object.keys(CASES)) {
  if (c !== "base" && runs[c][H].solid.equals(runs.base[H].solid)) { console.log(c, `left out: its solid is the baseline's on the ${H} mm grid`); continue; }
  const p = pack(runs[c][H]);
  writeFileSync(new URL(`${c}.bin`, OUT), Buffer.concat(p.fields.map(f => Buffer.from(f))));
  const d = h => Object.fromEntries(K.map(k => [k, runs[c][h].mean[k] - runs.base[h].mean[k]]));
  const dh = d(H), dc = d(CHECK), est = Object.fromEntries(K.map(k => [k, (dh[k] + dc[k]) / 2]));
  const spread = (k, h) => {   // two standard errors of the difference of two means over the averaging windows (lift's sd for the axles)
    const s = k === "cd" ? "cd" : "cl", a = runs[c][h], b = runs.base[h];
    return 2 * Math.hypot(a.sd[s] / Math.sqrt(a.windows), b.sd[s] / Math.sqrt(b.windows));
  };
  meta.dims = p.dims;
  meta.cases[c] = {
    mean: Object.fromEntries(K.map(k => [k, +runs[c][H].mean[k].toFixed(4)])), delta: Object.fromEntries(K.map(k => [k, +dh[k].toFixed(4)])),
    check: Object.fromEntries(K.map(k => [k, +dc[k].toFixed(4)])), est: Object.fromEntries(K.map(k => [k, +est[k].toFixed(4)])),
    settled: Object.fromEntries(K.map(k => [k, c !== "base" && Math.sign(dh[k]) === Math.sign(dc[k]) && Math.abs(est[k]) > Math.hypot(spread(k, H), spread(k, CHECK)) / 2])),
    lines: p.lines,
  };
  console.log(c, "mean", JSON.stringify(meta.cases[c].mean), "Δ28", JSON.stringify(meta.cases[c].delta), "Δ40", JSON.stringify(meta.cases[c].check), "settled", JSON.stringify(meta.cases[c].settled));
}
meta.area = runs.base[H].area * 2 * (H / 1000) ** 2;   // full car's frontal area in the model (m²)
writeFileSync(new URL("cfd.json", OUT), JSON.stringify(meta));
