// Off-road and heavy-vehicle models: four-wheel drive with three locks or brake traction control, portal axles, and
// twin-steer front axles.
import { test } from "node:test";
import assert from "node:assert/strict";
import { traction4 } from "../../lib/model/differential.js";
import { clearance, clearsRock, shaftTorque, axleHeight } from "../../lib/model/portal.js";
import { createTwinSteer } from "../../lib/model/steering.js";
import { loadCars } from "./helpers.mjs";

const cars = await loadCars();
const params = sub => cars.flatMap(c => c.components.filter(k => k.subsystem === sub).map(k => [c.slug, k.params]));
const D = Math.PI / 180;
const lo = 0.1, hi = 0.8, base = { force: 5000, normal: 5000, resist: 3000 };
const ice = { one: [hi, hi, lo, hi], diagonal: [lo, hi, hi, lo], three: [lo, hi, lo, lo] };
const go = (mu, o) => traction4({ ...base, mu, ...o }).moves;

test("4×4: each extra lock frees one more case: one wheel on ice, two diagonally, three", () => {
  assert.ok(!go(ice.one, {}) && go(ice.one, { centre: true }));
  assert.ok(!go(ice.diagonal, { centre: true }) && go(ice.diagonal, { centre: true, rear: true }));
  assert.ok(!go(ice.three, { centre: true, rear: true }) && go(ice.three, { centre: true, rear: true, front: true }));
  const dry = traction4({ ...base, mu: [hi, hi, hi, hi] });
  assert.ok(dry.moves && dry.spin.every(s => !s) && Math.abs(dry.drive - base.force) < 1e-6);
});

test("4×4: open, the wheels on ice spin; brake traction control holds them and the car moves off", () => {
  const open = traction4({ ...base, mu: ice.diagonal });
  assert.deepEqual(open.spin, [true, false, false, true]);
  const ets = traction4({ ...base, mu: ice.diagonal, brake: 2500 });
  assert.ok(ets.moves && ets.spin.every(s => !s));
  assert.ok(ets.braked[0] > 0 && ets.braked[3] > 0 && !ets.braked[1] && !ets.braked[2]);
  assert.ok(ets.drive < base.force, "the brakes cost some of the drive");
});

test("4×4: part-time drive in two-wheel mode puts nothing through the front, so one rear wheel on ice stops it", () => {
  const r = traction4({ ...base, mu: ice.one, rearOnly: true });
  assert.ok(!r.moves && !r.spin[0] && !r.spin[1] && r.spin[2] && r.inputs[0] === 0);
  assert.ok(traction4({ ...base, mu: [hi, hi, hi, hi], rearOnly: true }).moves);
});

for (const [slug, p] of params("four-wheel-drive")) test(`${slug}: the last mode gets out of every surface shown, the first of none but dry`, () => {
  const run = (s, m) => traction4({ force: p.force, normal: p.normal, resist: p.resist, mu: s.mu, ...m });
  for (const s of p.surfaces) {
    assert.ok(run(s, p.cases.at(-1)).moves, `${s.id}: ${p.cases.at(-1).id}`);
    if (s.mu.some(m => m < 0.3)) assert.ok(!run(s, p.cases[0]).moves, `${s.id}: ${p.cases[0].id}`);
  }
});

test("portal axle: the drop raises the axle and the differential; the hub gears cut the shaft torque", () => {
  const a = { wheelR: 0.5, tubeR: 0.08, diffR: 0.2, drop: 0, ratio: 1 }, u = { ...a, drop: 0.2, ratio: 2.4 };
  assert.ok(Math.abs(clearance(u) - clearance(a) - 0.2) < 1e-12);
  assert.ok(!clearsRock(a, 0.35) && clearsRock(u, 0.35));
  assert.equal(axleHeight(u), 0.7);
  assert.ok(Math.abs(shaftTorque(u, 2400) - 1000) < 1e-9);
});

for (const [slug, p] of params("portal-axle")) test(`${slug}: the portal clears the rock the conventional axle hits`, () => {
  const conv = { ...p.axle, drop: 0, ratio: 1 };
  assert.ok(clearsRock(p.axle, p.rock.value / 1000) && !clearsRock(conv, p.rock.value / 1000));
  assert.ok(Math.abs(clearance(p.axle) * 1000 - p.quoted) < 25, `${(clearance(p.axle) * 1000).toFixed(0)} mm vs ${p.quoted}`);
});

test("twin steer: the second axle steers less, and all wheel axes meet at one point; left straight, its tyres scrub", () => {
  const ts = createTwinSteer({ kingpinHalf: 900, arm: 250, wheelbase: 5200, second: 3900 });
  for (const d of [10, 20, 30]) {
    const r = ts.solve(d * D);
    assert.ok(Math.abs(r.s2.dL) < Math.abs(r.s1.dL));
    assert.ok(r.miss < 40, `${d}°: axles meet within ${r.miss.toFixed(0)} mm`);
    const fixed = ts.solve(d * D, false);
    assert.equal(fixed.s2.dL, 0); assert.ok(fixed.scrub > 2 * D);
  }
});
