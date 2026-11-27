// Rear axles compared: rigid, swing, multi-link.
import { test } from "node:test";
import assert from "node:assert/strict";
import { swing, rigid, rollCentre, bend, roughRoad, ROUGH_PERIOD } from "../../lib/model/axles.js";

const G = { halfTrack: 720, wheelR: 292, pivot: 130 };

test("swing axle: the wheel leans in over a bump and its contact point slides outward", () => {
  const a = swing(G, 0), b = swing(G, 60), c = swing(G, -60);
  assert.ok(Math.abs(a.camber) < 1e-12 && Math.abs(a.track) < 1e-12);
  assert.ok(b.camber < -5 && c.camber > 5);                       // about 5.8° each way
  assert.ok(b.track > 25 && c.track < -25);                       // the tyre is dragged sideways
});

test("swing axle: roll centre lies well above the ground (R·T/(T − pivot))", () => {
  const h = rollCentre(s => swing(G, s).track, G.halfTrack);
  assert.ok(Math.abs(h - 292 * 720 / 590) < 1);
});

test("rigid axle: one wheel's bump tilts both wheels the same way; equal travel tilts neither", () => {
  const l = rigid(G, 60, 0), r = rigid(G, 0, 60);
  assert.ok(l.camber < 0 && Math.abs(l.camber + r.camber) < 1e-12);
  assert.ok(Math.abs(rigid(G, 40, 40).camber) < 1e-12);
  assert.ok(Math.abs(l.camber) < Math.abs(swing(G, 60).camber));  // longer lever: half the swing axle's lean, roughly
});

test("bend: roll grows with the side force and falls with a stiffer spring or a higher roll centre", () => {
  const base = { m: 600, ay: 6, hcg: 520, hrc: 80, k: 24, bar: 2.4e7, halfTrack: 720, independent: true };
  const b = bend(base);
  assert.ok(b.roll > 0 && b.outer > 0 && b.inner < 0);
  assert.ok(bend({ ...base, k: 40 }).roll < b.roll);
  assert.ok(bend({ ...base, hrc: 350 }).roll < b.roll);
  assert.ok(Math.abs(b.outer + b.inner + 2 * b.lift) < 1e-9);
});

test("bend: a high roll centre jacks the body up; a rigid beam does not", () => {
  const base = { m: 600, ay: 6, hcg: 520, k: 24, bar: 2.4e7, halfTrack: 720 };
  const high = bend({ ...base, hrc: 356, independent: true }), low = bend({ ...base, hrc: 80, independent: true });
  assert.ok(high.lift > 30 && high.lift > 4 * low.lift);
  assert.ok(high.outer < 0 && high.inner < 0);                    // both wheels drop: the tuck-under
  assert.equal(bend({ ...base, hrc: 292, springHalf: 500, independent: false }).lift, 0);
});

test("rough road: repeats every lap and reaches its highest bump and deepest dip", () => {
  const xs = Array.from({ length: 1801 }, (_, i) => i / 100);
  const hs = xs.map(roughRoad);
  assert.ok(Math.abs(Math.max(...hs) - 0.035) < 1e-4 && Math.abs(Math.min(...hs) + 0.025) < 1e-4);
  for (const x of [0.3, 4.2, 9.25]) assert.ok(Math.abs(roughRoad(x) - roughRoad(x + ROUGH_PERIOD)) < 1e-12);
});
