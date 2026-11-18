// Safety models: braking with and without ABS, and tipping over with the roll bar or hinge bolts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mu, peak, simulateStop, createStop } from "../../lib/model/abs.js";
import { tipAngle, tipRate, createRoll, barTime, barAngle } from "../../lib/model/rollover.js";
import { loadCars } from "./helpers.mjs";

const cars = await loadCars();
const params = sub => cars.flatMap(c => c.components.filter(k => k.subsystem === sub).map(k => [c.slug, k.params]));
const wheel = { mass: 400, inertia: 1.2, wheelR: 0.31, torque: 2600, rise: 6 };

test("abs: grip peaks at moderate slip and falls off towards a locked wheel", () => {
  for (const s of ["dry", "wet", "snow"]) {
    assert.ok(peak(s) > mu(s, 1) * 1.2, `${s}: sliding grip well below the peak`);
    assert.ok(mu(s, 0) === 0 && mu(s, 0.1) > mu(s, 0.01));
  }
  assert.ok(peak("dry") > peak("wet") && peak("wet") > peak("snow"));
});

test("abs: without it the wheel locks and slides; with it the stop is shorter and the wheel keeps turning", () => {
  for (const surface of ["dry", "wet"]) {
    const locked = simulateStop({ ...wheel, abs: { on: false } }, surface, 100 / 3.6);
    const abs = simulateStop({ ...wheel, abs: { on: true, release: 0.2, apply: 0.08 } }, surface, 100 / 3.6);
    assert.ok(locked.locked > locked.time * 0.8, `${surface}: locked for most of the stop`);
    assert.equal(abs.locked, 0);
    assert.ok(abs.dist < locked.dist * 0.9, `${surface}: ${abs.dist.toFixed(1)} m vs ${locked.dist.toFixed(1)} m`);
    // Physics floor: no stop can beat the tyre's peak grip.
    assert.ok(abs.dist > (100 / 3.6) ** 2 / (2 * 9.81 * peak(surface)));
  }
  const s = createStop({ ...wheel, abs: { on: false } }, "dry", 20);
  for (let i = 0; i < 60000 && !s.done; i++) s.step(1e-4);
  assert.ok(s.done && s.v === 0);
});

for (const [slug, p] of params("abs")) test(`${slug}: braking stop shortens with ABS on every surface shown`, () => {
  for (const surface of p.surfaces.map(s => s.id)) {
    const off = simulateStop({ ...p.wheel, abs: { on: false } }, surface, p.speed / 3.6), on = simulateStop({ ...p.wheel, abs: { on: true, ...p.abs } }, surface, p.speed / 3.6);
    assert.ok(on.dist < off.dist && on.locked === 0, `${surface}: ${on.dist.toFixed(1)} vs ${off.dist.toFixed(1)}`);
  }
});

test("rollover: the tip angle grows with track and falls with height; below the tip rate the car falls back", () => {
  const car = { halfTrack: 0.76, cgHeight: 0.52, gyration: 0.6 };
  assert.ok(tipAngle(car) > tipAngle({ ...car, cgHeight: 0.8 }));
  const back = createRoll(car, tipRate(car) * 0.95), over = createRoll(car, tipRate(car) * 1.05);
  for (let i = 0; i < 5000; i++) { back.step(1e-3); over.step(1e-3); }
  assert.equal(back.theta, 0); assert.equal(over.theta, Math.PI);
});

test("rollover: the spring bar reaches full travel, faster with a stronger spring", () => {
  const b = { torque: 60, rate: 20, inertia: 0.5, travel: 1.6 };
  const t = barTime(b);
  assert.ok(t > 0 && t < 1);
  assert.ok(barTime({ ...b, torque: 120 }) < t);
  assert.ok(Math.abs(barAngle(b, 5) - b.travel) < 1e-9 && barAngle(b, t / 2) < b.travel);
});

for (const [slug, p] of params("rollover")) test(`${slug}: sensor fires before the tip angle; the device is ready before the car is on its side`, () => {
  assert.ok(p.trigger * Math.PI / 180 < tipAngle(p.car));
  if (p.device === "bar") assert.ok(Math.abs(barTime(p.bar) - p.quoted) < 0.05, `deploys in ${barTime(p.bar).toFixed(3)} s (quoted ${p.quoted} s)`);
  const r = createRoll(p.car, tipRate(p.car) * p.kick);
  let fired = null;
  while (r.theta < Math.PI / 2 && r.t < 5) { r.step(1e-3); if (fired == null && r.theta > p.trigger * Math.PI / 180) fired = r.t; }
  assert.ok(r.theta >= Math.PI / 2, "the demo roll goes over");
  if (p.device === "bar") assert.ok(fired + barTime(p.bar) < r.t, "bar up before the car lies on its side");
});
