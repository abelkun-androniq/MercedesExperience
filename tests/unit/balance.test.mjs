// Engine balance, firing pulses and crankshaft twist (300 SL, 770, W 196 R).
import { test } from "node:test";
import assert from "node:assert/strict";
import { layout, shaking, crankTorque, pulsesPerTurn, pulsesPerSecond } from "../../lib/model/engine.js";
import { torsionResponse, resonanceRpm } from "../../lib/model/torsion.js";

const TAU = 2 * Math.PI, turn = f => Array.from({ length: 72 }, (_, k) => f(k / 72 * TAU));
const six = layout([1, 5, 3, 6, 2, 4]), four = layout([1, 3, 4, 2]), eight = layout([1, 6, 2, 5, 8, 3, 7, 4]);
const xs6 = [0, 1, 2, 3, 4, 5], xs4 = [0, 1, 2, 3], lambda = 44 / 145;

test("straight-six: first- and second-order forces and rocking moments cancel through a revolution", () => {
  for (const order of [1, 2]) turn(th => {
    const s = shaking(six, th, xs6, lambda, order);
    assert.ok(Math.abs(s.sum) < 1e-9 && Math.abs(s.moment) < 1e-9, `order ${order} at ${th}`);
  });
});

test("inline four: first order cancels, second-order forces add (4λ cos 2θ)", () => {
  turn(th => {
    assert.ok(Math.abs(shaking(four, th, xs4, lambda, 1).sum) < 1e-9);
    assert.ok(Math.abs(shaking(four, th, xs4, lambda, 2).sum - 4 * lambda * Math.cos(2 * th)) < 1e-9);
  });
});

test("firing pulses: equal mean torque; the eight's swing is smaller; pulse counts at 3,000 rpm", () => {
  const stats = lay => { const v = Array.from({ length: 1440 }, (_, k) => crankTorque(lay, k / 1440 * 2 * TAU)); return { mean: v.reduce((a, b) => a + b) / v.length, swing: Math.max(...v) - Math.min(...v) }; };
  const s6 = stats(six), s8 = stats(eight);
  assert.ok(Math.abs(s6.mean - 1) < 1e-3 && Math.abs(s8.mean - 1) < 1e-3);
  assert.ok(s8.swing < s6.swing);
  assert.equal(pulsesPerTurn(6), 3); assert.equal(pulsesPerTurn(8), 4);
  assert.equal(pulsesPerSecond(6, 3000), 150); assert.equal(pulsesPerSecond(8, 3000), 200);
});

test("crank twist: the end take-off resonates inside the rev range, the centre take-off does not; damping lowers the peak", () => {
  assert.equal(resonanceRpm("centre", 0.03, 1000, 9000), null);
  const r = resonanceRpm("end", 0.03, 1000, 9000);
  assert.ok(r > 5000 && r < 8000, String(r));
  assert.ok(torsionResponse("end", r, 0.03).twist > 10 * torsionResponse("centre", r, 0.03).twist);
  assert.ok(torsionResponse("end", r, 0.15).twist < torsionResponse("end", r, 0.03).twist / 3);
  // Below and above the resonance the twist is far smaller.
  assert.ok(torsionResponse("end", r * 0.6, 0.03).twist < torsionResponse("end", r, 0.03).twist / 3);
  assert.ok(torsionResponse("end", r * 1.3, 0.03).twist < torsionResponse("end", r, 0.03).twist / 3);
});
