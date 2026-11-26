// The exhaust turbocharger.
import { test } from "node:test";
import assert from "node:assert/strict";
import { boosted, boostFor } from "../../lib/model/turbo.js";

const P = { disp: 4.973e-3, rpm: 7000, ve: 0.9, eta: 0.33, afr: 12.5, lhv: 43e6, etaC: 0.72, cooler: 0.7, t1: 293, p1: 1.013e5, wheel: 0.065, psi: 0.65 };

test("no boost: the compressor does no work and the engine breathes ambient air", () => {
  const r = boosted(P, 0);
  assert.equal(r.pr, 1); assert.ok(Math.abs(r.t2 - P.t1) < 1e-9); assert.equal(r.shaft, 0);
});

test("more boost: denser, warmer air, more power, and a faster shaft", () => {
  const a = boosted(P, 1.0e5), b = boosted(P, 1.6e5), c = boosted(P, 2.4e5);
  assert.ok(a.power < b.power && b.power < c.power);
  assert.ok(a.t2 < b.t2 && b.tc < b.t2 && b.tc > P.t1);
  assert.ok(a.shaftRpm < b.shaftRpm && b.shaftRpm > 5e4 && b.shaftRpm < 3e5);
  assert.ok(b.shaft > 0 && b.shaft < b.power);
});

test("boostFor inverts the power curve", () => {
  const target = boosted(P, 1.6e5).power;
  assert.ok(Math.abs(boostFor(P, target) - 1.6e5) < 1);
});
