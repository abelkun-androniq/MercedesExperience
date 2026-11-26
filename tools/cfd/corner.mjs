// Front-corner solids for the local 3-D tunnels (tools/cfd/part.mjs: w196-wheel, evo-arch), half car with the mirror at
// y = 0 as in the whole-car runs. Cells: x = x0 − (i + ½)h, y = (j + ½)h, z = (k + ½)h (mm, each stop's own frame: origin
// front axle centre on the ground); codes 0 air, 1 body, 2 tyre. Each domain ends behind the corner with the body running
// on through the outlet (only the corner is studied). Tyres stand still on the moving road, cut flat 48 mm above it (a whole
// number of cells on both grids, 24 and 16 mm), so the clearance is the same on each grid.
//
// W 196 R (assumed sizes, from its stop's ghost outline and photo fit): front tyre 340 mm radius, 150 mm wide, centred at
// y = 665. "enclosed": the 1955 streamliner's body, 820 mm half-width behind x = 500, a rounded nose to x = 1380, underside
// 150 mm up, top from the stop's centre-plane section with a fender bulge over the wheel, and a wheelhouse carved round the
// tyre (40 mm clear inside, 32 mm to the outer skin), open below the body. "exposed": the open-wheel car's body, a rounded
// nose to x = 950 widening to 330 mm half-width, 150–750 mm high: the tyre stands in free air. Suspension arms left out.
//
// Evo II: the game mesh's body (tools/cfd/geometry.mjs voxelize, column fill) clipped flat at 1000 mm, with a wheelhouse
// carved round its front tyre (333 mm radius, 135 mm half-width at y = 675): every body cell inside 378 mm of the hub and
// outboard of y = 495 is air. That opens the arch as on the car (the flare above the arch line stays) and keeps the inner
// wheelhouse wall.
import { voxelize } from "./geometry.mjs";

export const GAP = 48;
export const W196 = { tyre: { r: 340, half: 75, y: 665 }, hub: 340 };
export const EVO = { tyre: { r: 333, half: 135, y: 675 }, hub: 333 };

// Lattice for a part at cell size h: x from x0 back to x1, y from 0 to Y, z from 0 to Z (mm).
export const lattice = ({ x0, x1, Y, Z }, h) => ({ h, x0, nx: Math.round((x0 - x1) / h), ny: Math.round(Y / h), nz: Math.round(Z / h) });
export const DOMAIN = {
  "w196-wheel": { x0: 2400, x1: -2000, Y: 1800, Z: 1400 },
  "evo-arch": { x0: 1767, x1: -2000, Y: 1800, Z: 1600 },
};

const lerp = (pts, x) => {   // piecewise-linear z(x) through [[x, z], …] sorted by falling x
  if (x >= pts[0][0]) return pts[0][1];
  for (let n = 1; n < pts.length; n++) if (x >= pts[n][0]) { const [xa, za] = pts[n - 1], [xb, zb] = pts[n]; return zb + (za - zb) * (x - xb) / (xa - xb); }
  return pts.at(-1)[1];
};
const tyre = ({ r, half, y }, hub) => (x, yy, z) => z > GAP && Math.abs(yy - y) <= half && x * x + (z - hub) ** 2 < r * r;

// Streamliner: plan half-width, top and underside along x; rounded edges in cross-section.
const STREAM_TOP = [[1380, 420], [1300, 540], [1100, 640], [900, 700], [600, 740], [-300, 760], [-700, 770]];
function enclosed(x, y, z) {
  const t = Math.max(0, (x - 500) / 880); if (t >= 1) return false;
  const w = 820 * Math.sqrt(1 - t * t), bottom = x > 1250 ? 150 + 110 * (x - 1250) / 130 : 150;
  let top = lerp(STREAM_TOP, x);
  if (Math.abs(x) < 520 && y > 480) top = Math.max(top, 790 - 120 * (x / 520) ** 2);   // fender bulge over the wheel
  if (y > w || z < bottom || z > top) return false;
  const rt = 220, rb = 80;   // shoulder and lower edge radii
  if (y > w - rt && z > top - rt && (y - (w - rt)) ** 2 + (z - (top - rt)) ** 2 > rt * rt) return false;
  if (y > w - rb && z < bottom + rb && (y - (w - rb)) ** 2 + (z - (bottom + rb)) ** 2 > rb * rb) return false;
  // Wheelhouse round the front tyre, open below the body.
  if (x * x + (z - W196.hub) ** 2 < (W196.tyre.r + 40) ** 2 && y > W196.tyre.y - W196.tyre.half - 40 && y < W196.tyre.y + W196.tyre.half + 32) return false;
  return true;
}
// Open-wheel body: a rounded box section (exponent 2.5) centred 450 mm up, growing from the nose.
function exposed(x, y, z) {
  const t = Math.max(0, (x + 100) / 1050); if (t >= 1) return false;
  const s = Math.sqrt(1 - t * t), wy = 330 * s, hz = 300 * s;
  return (y / wy) ** 2.5 + (Math.abs(z - 450) / hz) ** 2.5 < 1;
}

function fill(L, f) {
  const { h, x0, nx, ny, nz } = L, solid = new Uint8Array(nx * ny * nz);
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const v = f(x0 - (i + 0.5) * h, (j + 0.5) * h, (k + 0.5) * h);
    if (v) solid[(k * ny + j) * nx + i] = v;
  }
  return solid;
}

export function w196(mode, h, domain = DOMAIN["w196-wheel"]) {
  const L = lattice(domain, h), wheel = tyre(W196.tyre, W196.hub), body = mode === "enclosed" ? enclosed : exposed;
  return { ...L, solid: fill(L, (x, y, z) => (wheel(x, y, z) ? 2 : body(x, y, z) ? 1 : 0)) };
}

export function evo(mesh, h, domain = DOMAIN["evo-arch"]) {
  const L = lattice(domain, h), { solid } = voxelize(mesh, L, "base"), { nx, ny, nz, x0 } = L, wheel = tyre(EVO.tyre, EVO.hub);
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const c = (k * ny + j) * nx + i, x = x0 - (i + 0.5) * h, y = (j + 0.5) * h, z = (k + 0.5) * h;
    if (solid[c] >= 2 || z > 1000) solid[c] = 0;   // the whole-car wheels go; the body is clipped flat
    if (solid[c] && y > EVO.tyre.y - EVO.tyre.half - 45 && x * x + (z - EVO.hub) ** 2 < (EVO.tyre.r + 45) ** 2) solid[c] = 0;
    if (wheel(x, y, z)) solid[c] = 2;
  }
  return { ...L, solid };
}

// A slice of a solid as text, for checking a mask before a long run: plane "z" (plan, rows = y from the top down), "y"
// (side, rows = z) or "x" (cross-section, rows = z, columns = y), through the cell nearest `at` mm; every `step`-th cell.
export function sketch({ solid, h, x0, nx, ny, nz }, plane, at, { step = 1, x = null } = {}) {
  const at3 = (i, j, k) => solid[(k * ny + j) * nx + i], ch = v => " #o"[v] ?? "?", rows = [];
  const i0 = x ? Math.max(0, Math.round((x0 - x[0]) / h)) : 0, i1 = x ? Math.min(nx, Math.round((x0 - x[1]) / h)) : nx;
  const n = Math.round(at / h - 0.5);
  if (plane === "z") for (let j = ny - 1; j >= 0; j -= step) { let s = ""; for (let i = i0; i < i1; i += step) s += ch(at3(i, j, n)); rows.push(s); }
  if (plane === "y") for (let k = nz - 1; k >= 0; k -= step) { let s = ""; for (let i = i0; i < i1; i += step) s += ch(at3(i, n, k)); rows.push(s); }
  if (plane === "x") { const i = Math.round((x0 - at) / h - 0.5); for (let k = nz - 1; k >= 0; k -= step) { let s = ""; for (let j = 0; j < ny; j += step) s += ch(at3(i, j, k)); rows.push(s); } }
  return rows.join("\n");
}
