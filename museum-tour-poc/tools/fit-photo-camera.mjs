// Fit a pinhole camera to a museum photo from 3D↔2D point correspondences (Levenberg–Marquardt).
// Usage: node tools/fit-photo-camera.mjs tools/photo-fits/540k.json
// Output: the PHOTO_CAM constant to paste into the car's page, plus per-point residuals in px.
// Camera parameters p = [cx, cy, cz (mm), yaw, pitch, roll (rad), f (px)]; no lens distortion; principal point = image centre.
import { readFileSync } from "node:fs";

const cfg = JSON.parse(readFileSync(process.argv[2], "utf8"));
const CX = cfg.image.width / 2, CY = cfg.image.height / 2;
const P = cfg.points.map(q => [q.X, q.px, q.w ?? 1]);

function basis([, , , yaw, pitch, roll]) {
  const f = [Math.cos(pitch) * Math.cos(yaw), Math.cos(pitch) * Math.sin(yaw), Math.sin(pitch)];
  let r = [f[1], -f[0], 0]; const n = Math.hypot(...r); r = r.map(v => v / n);   // r = f × z
  const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  const c = Math.cos(roll), s = Math.sin(roll);
  return { f, r: r.map((v, i) => c * v + s * u[i]), u: u.map((v, i) => c * v - s * r[i]) };
}
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
function project(p, X) {
  const { f, r, u } = basis(p), d = [X[0] - p[0], X[1] - p[1], X[2] - p[2]], z = dot(d, f);
  return [CX + p[6] * dot(d, r) / z, CY - p[6] * dot(d, u) / z];
}
function residuals(p) {
  const out = [];
  for (const [X, x, w] of P) { const q = project(p, X); out.push(w * (q[0] - x[0]), w * (q[1] - x[1])); }
  if (cfg.rollPenalty) out.push(p[5] * cfg.rollPenalty);   // keeps the horizon level when points are few
  return out;
}
const sq = r => r.reduce((a, v) => a + v * v, 0);
function solveLinear(A, b) {
  const n = b.length, M = A.map((row, i) => [...row, b[i]]);
  for (let k = 0; k < n; k++) {
    let piv = k; for (let i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[piv][k])) piv = i;
    [M[k], M[piv]] = [M[piv], M[k]];
    for (let i = k + 1; i < n; i++) { const m = M[i][k] / M[k][k]; for (let j = k; j <= n; j++) M[i][j] -= m * M[k][j]; }
  }
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { let s = M[i][n]; for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j]; x[i] = s / M[i][i]; }
  return x;
}
function levenbergMarquardt(p) {
  let lam = 1e-3;
  for (let it = 0; it < 500; it++) {
    const r = residuals(p), e = sq(r), J = r.map(() => []);
    for (let j = 0; j < 7; j++) {
      const h = j < 3 ? 1 : j < 6 ? 1e-5 : 0.1, q = p.slice(); q[j] += h; const rq = residuals(q);
      for (let i = 0; i < r.length; i++) J[i][j] = (rq[i] - r[i]) / h;
    }
    const A = [...Array(7)].map((_, a) => [...Array(7)].map((_, b) => J.reduce((s, row) => s + row[a] * row[b], 0)));
    const g = [...Array(7)].map((_, a) => -J.reduce((s, row, i) => s + row[a] * r[i], 0));
    for (let a = 0; a < 7; a++) A[a][a] *= 1 + lam;
    const np = p.map((v, i) => v + solveLinear(A, g)[i]);
    if (sq(residuals(np)) < e) { p = np; lam *= 0.3; } else lam *= 10;
  }
  return p;
}

let best = null;
for (const C of cfg.seeds) for (const f of cfg.focalSeeds) {
  const d = cfg.aimAt.map((v, i) => v - C[i]);
  const p = levenbergMarquardt([...C, Math.atan2(d[1], d[0]), Math.atan2(d[2], Math.hypot(d[0], d[1])), 0, f]);
  const e = sq(residuals(p));
  if (!best || e < best.e) best = { e, p };
}
const p = best.p, r = v => +v.toFixed(4);
console.log(`const PHOTO_CAM = { c: [${p.slice(0, 3).map(v => +v.toFixed(1)).join(", ")}], yaw: ${r(p[3])}, pitch: ${r(p[4])}, roll: ${r(p[5])}, f: ${+p[6].toFixed(1)} };`);
console.log(`vertical FOV ${(2 * Math.atan(CY / p[6]) * 180 / Math.PI).toFixed(1)}°, camera height above ground ≈ ${(p[2] - (cfg.groundZ ?? -380)).toFixed(0)} mm (groundZ ${cfg.groundZ ?? -380})`);
let rms = 0;
cfg.points.forEach(q => { const [u, v] = project(p, q.X); const du = u - q.px[0], dv = v - q.px[1]; rms += du * du + dv * dv;
  console.log(`  ${q.name.padEnd(26)} du ${du.toFixed(1).padStart(6)}  dv ${dv.toFixed(1).padStart(6)} px`); });
console.log(`unweighted RMS ${Math.sqrt(rms / cfg.points.length).toFixed(1)} px`);
