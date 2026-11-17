// Lattice-Boltzmann wind tunnel (lib/model/flow.js) and the flow configs that use it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { rasterize, createTunnel } from "../../lib/model/flow.js";
import { loadCars } from "./helpers.mjs";

test("flow: an empty tunnel keeps the uniform stream (the road moves with the air)", () => {
  const t = createTunnel({ nx: 40, nz: 20, solid: new Uint8Array(800), U: 0.1 });
  for (let s = 0; s < 200; s++) t.step();
  for (let c = 0; c < 800; c++) {
    assert.ok(Math.abs(t.ux[c] - 0.1) < 1e-4 && Math.abs(t.uz[c]) < 1e-4, `cell ${c}: ${t.ux[c]}, ${t.uz[c]}`);
    assert.ok(Math.abs(t.rho[c] - 1) < 1e-4);
  }
});

test("flow: a block on stilts stops the air at its nose, speeds it over the top and leaves a slow wake", () => {
  // 200 × 100 mm cells; block 1.2 m long, 0.4–1.2 m high, front at x = 0. Tunnel from x = 2 m to −8 m, 3 m tall.
  const block = [[0, 400], [0, 1200], [-1200, 1200], [-1200, 400]];
  const { nx, nz, solid } = rasterize(block, { x0: 2000, x1: -8000, top: 3000, cell: 100 });
  assert.equal(nx, 100); assert.equal(nz, 30);
  assert.equal(solid.reduce((a, b) => a + b, 0), 12 * 8, "12 × 8 cells");
  const t = createTunnel({ nx, nz, solid, U: 0.1, nu: 0.004 });   // viscous enough to settle to a steady picture
  for (let s = 0; s < 4000; s++) t.step();
  const at = (x, z) => Math.round((2000 - x) / 100 - 0.5) + nx * Math.round(z / 100 - 0.5);
  for (let c = 0; c < nx * nz; c++) assert.ok(Number.isFinite(t.ux[c]) && Number.isFinite(t.rho[c]), "stays finite");
  assert.ok(t.cp(at(50, 800)) > 0.6, `stagnation at the nose: Cp ${t.cp(at(50, 800)).toFixed(2)}`);
  assert.ok(t.cp(at(50, 800)) < 1.2, "no more than the stream's dynamic pressure (allowing for blockage)");
  assert.ok(t.ux[at(-600, 1650)] > 0.11, "faster than the stream over the top (outside the separation bubble)");
  let wake = 0; for (let z = 450; z < 1200; z += 100) wake += t.ux[at(-1450, z)] / 8;
  assert.ok(wake < 0.05, `slow (or reversed) air right behind the block: ${wake.toFixed(3)}`);
  assert.ok(t.cp(at(-1250, 800)) < 0, "suction on the back face");
  const d = { total: 0, push: 0, suction: 0 };
  for (let s = 0; s < 500; s++) { t.step(); for (const k in d) d[k] += t.drag[k] / 500; }
  assert.ok(d.push > 0 && d.suction > 0, "the nose is pushed and the back sucked, both backwards");
  assert.ok(d.push + d.suction > 0.8 * d.total, `a bluff block's drag is mostly pressure: ${JSON.stringify(d)}`);
  const cd = d.total / (0.5 * 0.1 * 0.1 * 8);   // per unit span over the 8-cell frontal height
  assert.ok(cd > 1 && cd < 5, `2-D block (blockage raises it above ~2) drag coefficient ${cd.toFixed(2)}`);
});

test("every flow config has a closed tunnel around its profile and runs stably", async () => {
  for (const c of await loadCars()) for (const comp of c.components.filter(k => k.params.flow)) {
    const F = comp.params.flow, grid = rasterize(F.profile, F), { nx, nz, solid } = grid;
    for (let i = 0; i < nx; i++) assert.equal(solid[(nz - 1) * nx + i], 0, `${c.slug}: body reaches the tunnel top`);
    for (let j = 0; j < nz; j++) assert.equal(solid[j * nx] + solid[j * nx + nx - 1], 0, `${c.slug}: body reaches the inlet or outlet`);
    assert.ok(solid.reduce((a, b) => a + b, 0) > 50, `${c.slug}: body has cells`);
    const t = createTunnel(grid);
    for (let s = 0; s < 1500; s++) t.step();
    for (let k = 0; k < nx * nz; k++) assert.ok(Number.isFinite(t.ux[k]) && Math.abs(t.rho[k] - 1) < 0.2, `${c.slug}: unstable at cell ${k}`);
  }
});
