// Double-pivot trapezoid steering and the centre-pivot comparison.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createDoublePivot, centrePivot, dualAxis, toeDrag } from "../../lib/model/steering.js";

const G = { kingpinHalf: 600, arm: 160, wheelbase: 1650 };
const st = createDoublePivot(G);
const deg = r => r * 180 / Math.PI, rad = d => d * Math.PI / 180;

test("straight ahead: both wheels straight, tie rod closes", () => {
  const s = st.solve(0);
  assert.ok(Math.abs(s.dR) < 1e-9);
  assert.ok(Math.abs(Math.hypot(s.PL[0] - s.PR[0], s.PL[1] - s.PR[1]) - st.tie) < 1e-9);
});

for (const d of [5, 15, 25, 35]) {
  test(`left turn ${d}°: tie rod length preserved, inner wheel turns more, close to Ackermann`, () => {
    const s = st.solve(rad(d));
    assert.ok(Math.abs(Math.hypot(s.PL[0] - s.PR[0], s.PL[1] - s.PR[1]) - st.tie) < 1e-6);
    assert.ok(s.dR > 0 && s.dR < s.dL);
    // A trapezoid only approximates Ackermann; the error grows towards full lock.
    assert.ok(Math.abs(deg(s.dR - s.idealOuter)) < (d <= 25 ? 2 : 3), `outer ${deg(s.dR).toFixed(2)}° vs ideal ${deg(s.idealOuter).toFixed(2)}°`);
  });
}

test("right turn mirrors the left turn", () => {
  const L = st.solve(rad(20)), R = st.solve(rad(-20));
  assert.ok(R.dR < 0 && Math.abs(R.dR) > Math.abs(R.dL));
  assert.ok(Math.abs(Math.abs(R.dR) - Math.abs(L.dL) + Math.abs(L.dR) - Math.abs(R.dL)) < 0.05);
});

test("centre pivot: support narrows with steer and the inner wheel swings back", () => {
  const c = centrePivot(G, rad(30));
  assert.ok(Math.abs(c.halfTrack - 600 * Math.cos(rad(30))) < 1e-9);
  assert.ok(Math.abs(c.swingBack - 300) < 1e-9);
  assert.ok(c.L[0] < 0 && c.R[0] > 0);
  assert.equal(centrePivot(G, 0).radius, Infinity);
});

test("dual-axis steering: the column changes toe on both wheels without steering the car", () => {
  const g = { arm: 100, gain: 0.05, toe0: -0.01 };
  const a = dualAxis(g, 0, 0), b = dualAxis(g, 0, 20);
  assert.ok(Math.abs(a.left + a.right) < 1e-12 && Math.abs(b.left + b.right) < 1e-12);   // no net steer
  assert.ok(a.toe < 0 && Math.abs(b.toe) < 0.002);                                         // toe-out, then about straight
  const s = dualAxis(g, 0.1, 0); assert.ok(Math.abs((s.left + s.right) / 2 - 0.1) < 1e-12);
  const d0 = toeDrag(90e3, a.toe, 80), d1 = toeDrag(90e3, b.toe, 80);
  assert.ok(d0.drag > d1.drag && d0.side > 0 && d0.power === d0.drag * 80);
});
