// The fuel-cell stack.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cellVolts, atCurrent, peak, forMotor, F } from "../../lib/model/fuelcell.js";

const P = { cells: 480, area: 230, e0: 1.03, tafel: 0.05, j0: 0.005, r: 0.25, mt: 3e-5, n: 8, motor: 0.9, auxBase: 1500, auxShare: 0.3 };

test("cell voltage falls as the current rises", () => {
  let last = Infinity;
  for (let j = 0; j < 1.2; j += 0.05) { const v = cellVolts(P, j); assert.ok(v < last); last = v; }
  assert.ok(Math.abs(cellVolts(P, 0) - P.e0) < 1e-3 && cellVolts(P, 0.5) > 0.6 && cellVolts(P, 0.5) < 0.75);
});

test("hydrogen in and water out follow the current (2 electrons per H₂)", () => {
  const s = atCurrent(P, 0.6), mol = s.I * P.cells / (2 * F);
  assert.ok(Math.abs(s.h2 - mol * 2.016e-3) < 1e-12 && Math.abs(s.water / s.h2 - 18.015 / 2.016) < 1e-9);
});

test("the stack peaks near 50 kW; a motor demand is met at the lowest current that gives it", () => {
  const top = peak(P);
  assert.ok(top.stack > 45e3 && top.stack < 60e3, `${top.stack}`);
  const w = forMotor(P, 25e3);
  assert.ok(Math.abs(w.motor - 25e3) < 10 && w.j < top.j);
  assert.ok(w.efficiency > 0.3 && w.efficiency < 0.6);
  assert.equal(forMotor(P, 1e6), null);
});
