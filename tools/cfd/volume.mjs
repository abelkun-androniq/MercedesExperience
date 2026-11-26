// Raw 3-D tunnel results (tools/cfd/out/, from run.mjs or part.mjs): reading and sampling, no side effects.
// A run is <name>.json (lattice: x0, h, nx, ny, nz, U, …), <name>.bin (four Float32 blocks of N = nx·ny·nz cells: mean
// density, rearward, lateral and upward velocity) and <name>.solid (N bytes, 0 = air). Cell (i, j, k) is at offset
// (k·ny + j)·nx + i and has its centre at x = x0 − (i + ½)h, y = y0 + (j + ½)h, z = (k + ½)h mm (y0 = 0 unless the run
// says otherwise: the plane y = 0 is the mirror).
import { readFileSync } from "node:fs";

export const OUT = new URL("./out/", import.meta.url);

export function load(name, dir = OUT) {
  const m = JSON.parse(readFileSync(new URL(`${name}.json`, dir))), N = m.nx * m.ny * m.nz;
  const b = readFileSync(new URL(`${name}.bin`, dir)), solid = readFileSync(new URL(`${name}.solid`, dir));
  if (b.byteLength !== 16 * N) throw new Error(`${name}.bin: ${b.byteLength} bytes, want ${16 * N}`);
  if (solid.byteLength !== N) throw new Error(`${name}.solid: ${solid.byteLength} bytes, want ${N}`);
  const f = new Float32Array(b.buffer, b.byteOffset, 4 * N);
  return volume({ ...m, rho: f.subarray(0, N), ui: f.subarray(N, 2 * N), uj: f.subarray(2 * N, 3 * N), uk: f.subarray(3 * N), solid });
}

// Adds the cell maths to a run's fields: at(i, j, k), centre(i, j, k) → [x, y, z] mm, cell(x, y, z) → [i, j, k] (nearest,
// clamped), and vel(x, y, z): the trilinear mean velocity in the vehicle frame (x forward, so the rearward lattice
// velocity is negated), in units of the inlet speed; null inside or next to a solid or outside the lattice. Mirrored
// runs (y0 = 0) read y < 0 through the mirror.
export function volume(r) {
  const { nx, ny, nz, h, x0, U } = r, y0 = r.y0 ?? 0, mirror = y0 === 0;
  const at = (i, j, k) => (k * ny + j) * nx + i;
  const centre = (i, j, k) => [x0 - (i + 0.5) * h, y0 + (j + 0.5) * h, (k + 0.5) * h];
  const clamp = (v, n) => Math.max(0, Math.min(n - 1, v));
  const cell = (x, y, z) => [clamp(Math.round((x0 - x) / h - 0.5), nx), ny === 1 ? 0 : clamp(Math.round(((mirror ? Math.abs(y) : y) - y0) / h - 0.5), ny), clamp(Math.round(z / h - 0.5), nz)];
  const vel = (x, y, z) => {
    const yy = mirror ? Math.abs(y) : y, fi = (x0 - x) / h - 0.5, fj = (yy - y0) / h - 0.5, fk = z / h - 0.5;
    if (fi < 0 || fi >= nx - 1 || fk < 0 || fk >= nz - 1) return null;
    if (ny > 1 && (fj >= ny - 1 || (!mirror && fj < 0))) return null;   // a single row (a 2-D run) is the same at every y
    const i0 = fi | 0, k0 = fk | 0, a = fi - i0, c = fk - k0, j0 = ny > 1 ? Math.max(0, Math.min(ny - 2, Math.floor(fj))) : 0, b = ny > 1 ? Math.max(0, Math.min(1, fj - j0)) : 0;
    let u = 0, v = 0, w = 0;
    for (let n = 0; n < 8; n++) {
      const di = n & 1, dj = (n >> 1) & 1, dk = n >> 2;
      if (dj && ny === 1) continue;
      const q = at(i0 + di, j0 + dj, k0 + dk);
      if (r.solid[q]) return null;
      const wt = (di ? a : 1 - a) * (dj ? b : 1 - b) * (dk ? c : 1 - c);
      u += wt * r.ui[q]; v += wt * r.uj[q]; w += wt * r.uk[q];
    }
    return [-u / U, (mirror && y < 0 ? -1 : 1) * v / U, w / U];
  };
  return { ...r, y0, N: nx * ny * nz, at, centre, cell, vel };
}

// Mean of the rearward and upward velocity over the fluid cells whose centres lie in a box (mm: [lo, hi] per axis), and
// its direction in the side view: atan2(up, rearward) in degrees (+ = air rising as it leaves rearward).
export function probe(r, box) {
  let n = 0, ui = 0, uk = 0, uj = 0;
  for (let k = 0; k < r.nz; k++) for (let j = 0; j < r.ny; j++) for (let i = 0; i < r.nx; i++) {
    const [x, y, z] = r.centre(i, j, k);
    if (x < box.x[0] || x > box.x[1] || y < box.y[0] || y > box.y[1] || z < box.z[0] || z > box.z[1]) continue;
    const c = r.at(i, j, k); if (r.solid[c]) continue;
    n++; ui += r.ui[c]; uj += r.uj[c]; uk += r.uk[c];
  }
  ui /= n; uj /= n; uk /= n;
  return { n, rearward: ui / r.U, lateral: uj / r.U, up: uk / r.U, angle: Math.atan2(uk, ui) * 180 / Math.PI };
}

// A path through the mean flow from a seed (mm), RK2 with step dt (mm per unit inlet speed), every `every`-th point kept,
// until it meets a solid, leaves the lattice or the box `stop` ({ x, y, z } ranges, any omitted). `plane` keeps one
// coordinate fixed ("y" for a side view, "z" for a plan view): the path then follows the velocity projected into it.
export function trace(r, seed, { dt = 10, n = 2000, every = 4, plane = null, stop = {} } = {}) {
  let [x, y, z] = seed;
  const pts = [[x, y, z]], fix = v => { if (plane === "y") v[1] = 0; if (plane === "z") v[2] = 0; return v; };
  const out = (x, y, z) => ["x", "y", "z"].some((ax, d) => stop[ax] && ([x, y, z][d] < stop[ax][0] || [x, y, z][d] > stop[ax][1]));
  for (let s = 0; s < n; s++) {
    const a = r.vel(x, y, z); if (!a) break; fix(a);
    const b = r.vel(x + a[0] * dt, y + a[1] * dt, z + a[2] * dt); if (!b) break; fix(b);
    x += (a[0] + b[0]) / 2 * dt; y += (a[1] + b[1]) / 2 * dt; z += (a[2] + b[2]) / 2 * dt;
    if (out(x, y, z)) break;
    if (s % every === every - 1) pts.push([x, y, z]);
  }
  return pts.map(p => p.map(v => Math.round(v)));
}
