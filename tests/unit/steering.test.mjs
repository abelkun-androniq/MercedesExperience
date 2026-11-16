// Double-pivot trapezoid steering and the centre-pivot comparison.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createDoublePivot, centrePivot } from "../../lib/model/steering.js";

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
