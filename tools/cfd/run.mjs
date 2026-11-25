// Runs one case of the Evo II tunnel and saves its forces and mean fields: node tools/cfd/run.mjs <case> <cell mm> <steps>
// (case: tools/cfd/geometry.mjs CASES). Output: tools/cfd/out/<case>-<cell>.json (coefficients, force history) and
// .bin (mean ρ, u as Float32, the lattice of the .json). Coefficients use the full car's frontal area, from the solid cells.
import { mkdirSync, writeFileSync } from "node:fs";
import { loadEvo2 } from "./mesh.mjs";
import { voxelize, WHEEL } from "./geometry.mjs";
import { createTunnel3d } from "./lbm3d.mjs";

const [mode = "base", hs = "28", ss = "12000"] = process.argv.slice(2), h = +hs, steps = +ss;
// Tunnel: 1.2 m ahead of the nose to 3.5 m behind the tail, 2 m to the side of the centre plane, 2.6 m high.
const X0 = 767 + 1200, X1 = -3775 - 3500, nx = Math.round((X0 - X1) / h), ny = Math.round(2000 / h), nz = Math.round(2600 / h);
const U = 0.08, Re = 3.4e4, L = 4542 / h, nu = U * L / Re;   // same Reynolds number on every grid (the real car: ~10⁷)
const { solid } = voxelize(loadEvo2(), { h, x0: X0, nx, ny, nz }, mode);
const at = (i, j, k) => (k * ny + j) * nx + i;
let area = 0;   // frontal area of the half car in cells: (j, k) pairs with any solid along i
for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) { for (let i = 0; i < nx; i++) if (solid[at(i, j, k)]) { area++; break; } }
const tunnel = createTunnel3d({ nx, ny, nz, solid }, { U, nu });   // wheels held still (tools/cfd/geometry.mjs)
const q = 0.5 * U * U * area, iF = (X0 - WHEEL.x[0]) / h - 0.5, iR = (X0 - WHEEL.x[1]) / h - 0.5, Lw = iF - iR;
// Half-car forces → full-car coefficients (× 2 for the force, × 2 for the area: the ratio stands). Lift + up. The axle loads
// are the extra load pressing each axle's tyres down, as coefficients: the pitching moment of the air's force about the
// front contact line (vehicle frame τ = z·Fx − x·Fz, with x = −(i − iF), z = k + ½, Fx = −Fi, Fz = Fk) is held by the rear
// tyres alone: rear = −τ / wheelbase; the front takes the rest of the vertical force.
const coeffs = F => {
  const lift = F.Fk, tau = -(F.kFi + 0.5 * F.Fi) + F.iFk - iF * F.Fk;
  const rear = -tau / Lw, front = -lift - rear;
  return { cd: F.Fi / q, cl: lift / q, front: front / q, rear: rear / q };
};
const t0 = Date.now(), hist = [];
console.log(`${mode} h=${h} ${nx}×${ny}×${nz} = ${(nx * ny * nz / 1e6).toFixed(2)}M cells, nu=${nu.toFixed(5)}, half frontal area ${area} cells`);
const chunk = 500, avgFrom = Math.round(steps * 0.4);
let mean = null, s = 0;
while (s < steps) {
  const avg = s >= avgFrom, F = await tunnel.run(chunk, avg); s += chunk;
  const c = coeffs(F); hist.push({ s, ...c });
  if (avg) { mean ??= { cd: 0, cl: 0, front: 0, rear: 0, n: 0 }; for (const k of ["cd", "cl", "front", "rear"]) mean[k] += c[k]; mean.n++; }
  console.log(s, Object.values(c).map(v => v.toFixed(3)).join(" "), `${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
for (const k of ["cd", "cl", "front", "rear"]) mean[k] /= mean.n;
// Spread of the 500-step means over the averaging window: how settled the result is.
const window = hist.filter(r => r.s > avgFrom), sd = k => Math.sqrt(window.reduce((a, r) => a + (r[k] - mean[k]) ** 2, 0) / window.length);
mkdirSync(new URL("./out/", import.meta.url), { recursive: true });
const name = new URL(`./out/${mode}-${h}`, import.meta.url).pathname, fl = tunnel.fields();
writeFileSync(`${name}.json`, JSON.stringify({ mode, h, x0: X0, nx, ny, nz, U, nu, area, steps, mean, sd: { cd: sd("cd"), cl: sd("cl"), front: sd("front"), rear: sd("rear") }, hist }, null, 1));
writeFileSync(`${name}.bin`, Buffer.concat([fl.rho, fl.ui, fl.uj, fl.uk].map(a => Buffer.from(a.buffer, a.byteOffset, a.byteLength))));
writeFileSync(`${name}.solid`, solid);
console.log("mean", JSON.stringify(mean), "sd", JSON.stringify({ cd: sd("cd"), cl: sd("cl") }));
await tunnel.close();
