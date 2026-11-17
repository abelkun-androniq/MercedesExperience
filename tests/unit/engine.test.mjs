// Engine kinematics, valve timing, blower and valve-train models.
import { test } from "node:test";
import assert from "node:assert/strict";
import { layout, firingOrder, pistonPos, phaseOf, strokeOf, valveLifts, pinAngle, TIMING } from "../../lib/model/engine.js";
import { createBlower, autoPedal } from "../../lib/model/blower.js";
import { camLift, simulateSpringValve, desmoCams, springRateFor } from "../../lib/model/valvetrain.js";
import { loadCars } from "./helpers.mjs";

const TAU = 2 * Math.PI;

test("I4 1-3-4-2: throws 1 & 4 together, 2 & 3 opposite (as the PoC)", () => {
  const lay = layout([1, 3, 4, 2]);
  assert.deepEqual(lay.throwA.map(a => +(a / Math.PI).toFixed(6)), [0, 1, 1, 0]);
});

test("I6 1-5-3-6-2-4: throw pairs 1&6, 2&5, 3&4", () => {
  const t = layout([1, 5, 3, 6, 2, 4]).throwA.map(a => Math.round(a * 180 / Math.PI) % 360);
  assert.equal(t[0], t[5]); assert.equal(t[1], t[4]); assert.equal(t[2], t[3]);
  assert.equal(new Set(t).size, 3);
});

for (const order of [[1], [1, 3, 4, 2], [1, 5, 3, 6, 2, 4], [1, 6, 2, 5, 8, 3, 7, 4]]) {
  test(`firing order ${order.join("-")}: round trip, TDC at each cylinder's firing, power stroke follows`, () => {
    const lay = layout(order);
    assert.deepEqual(firingOrder(lay), order);
    lay.offset.forEach((off, i) => {
      const alpha = off + lay.throwA[i];
      assert.ok(Math.abs(Math.cos(alpha) - 1) < 1e-9, `cyl ${i + 1} at TDC`);
      assert.equal(pistonPos(alpha, 40, 136), 176);
      assert.equal(strokeOf(phaseOf(off + 0.1, off)), "Power");
    });
  });
}

test("V8 1-5-4-8-6-3-7-2, banks ±45°: each right-bank cylinder shares its crankpin with one on the left (cross-plane)", () => {
  const lay = layout([1, 5, 4, 8, 6, 3, 7, 2]), lean = i => (i < 4 ? 1 : -1) * Math.PI / 4;
  const pin = i => pinAngle(lay, i, lean(i)), same = (a, b) => Math.abs(Math.cos(a - b) - 1) < 1e-9;
  for (let i = 0; i < 4; i++) assert.ok(same(pin(i), pin(i + 4)), `cylinders ${i + 1} and ${i + 5} share a pin`);
  const pins = [0, 1, 2, 3].map(pin).sort((a, b) => a - b);
  pins.forEach((a, k) => assert.ok(Math.abs(a - k * Math.PI / 2 - Math.PI / 4) < 1e-9), "four pins 90° apart: a cross-plane crank");
  assert.ok(same(pinAngle(lay, 0), 0) && same(pinAngle(lay, 3), Math.PI), "an upright cylinder's pin points up at its firing");
});

test("every engine in the tour has a valid firing order", async () => {
  for (const car of await loadCars()) for (const c of car.components) {
    const order = c.params.order;
    if (!order) continue;
    assert.deepEqual([...order].sort((a, b) => a - b), order.map((_, i) => i + 1), `${car.slug}/${c.id}`);
  }
});

test("valve lift is zero outside its window; atmospheric intake only opens during the intake stroke", () => {
  for (let ph = 0; ph < 4 * Math.PI; ph += 0.01) {
    const v = valveLifts(ph, "ohc", 9), a = valveLifts(ph, "atmospheric", 9);
    if (ph < TIMING.intake[0] || ph > TIMING.intake[1]) assert.equal(v.intake, 0);
    if (ph < TIMING.exhaust[0] || ph > TIMING.exhaust[1]) assert.equal(v.exhaust, 0);
    if (a.intake > 0) assert.equal(strokeOf(ph), "Intake");
  }
});

test("blower: spin stays in [0, 1]; the clutch engages only at ≥ engageAt", () => {
  const b = createBlower();
  for (let t = 0; t < 30; t += 0.01) {
    const pedal = autoPedal(t);
    b.step(pedal, 0.01);
    assert.ok(b.spin >= 0 && b.spin <= 1);
    assert.equal(b.engaged, pedal >= b.p.engageAt);
  }
});

const VT = { lift: 0.01, open: 0.6, duration: 2.27, mass: 0.1, preload: 0.008, floatRpm: 7000, base: 0.018 };

test("cam lift is continuous and zero on the base circle", () => {
  let prev = camLift(0, VT).L;
  for (let phi = 0.001; phi < TAU; phi += 0.001) {
    const L = camLift(phi, VT).L;
    assert.ok(Math.abs(L - prev) < 2e-5); assert.ok(L >= 0); prev = L;
  }
  assert.equal(camLift(VT.open + VT.duration + 0.1, VT).L, 0);
});

test("desmo: opening + closing cam radii are conjugate, so the closing rocker never leaves its cam", () => {
  for (let phi = 0; phi < TAU; phi += 0.01) {
    const d = desmoCams(phi, VT);
    assert.ok(Math.abs(d.open + d.close - (2 * VT.base + VT.lift)) < 1e-12);
    assert.equal(d.valve, camLift(phi, VT).L);
  }
});

test("spring valve follows the cam below the float speed and floats above it", () => {
  assert.ok(springRateFor(VT) > 0);
  assert.ok(simulateSpringValve(VT, 0.7 * VT.floatRpm).maxSep < 1e-4);
  assert.ok(simulateSpringValve(VT, 1.3 * VT.floatRpm).maxSep > 5e-4);
});
