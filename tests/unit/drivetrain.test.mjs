// Differential, gearbox, belt-drive and road-load (aero) models.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cornerSpeeds, traction } from "../../lib/model/differential.js";
import { ratio, roadSpeed, primaryRpmFor, mismatch } from "../../lib/model/gearbox.js";
import { drag, powerNeeded, topSpeed, accelerate } from "../../lib/model/aero.js";
import * as belt from "../../lib/model/belt.js";
import { loadCars } from "./helpers.mjs";

const axle = { halfTrack: 0.7, wheelR: 0.36 };

test("differential: equal wheel speeds straight ahead; the outer wheel turns faster in a corner", () => {
  const s = cornerSpeeds(axle, Infinity, 10);
  assert.equal(s.left, s.right); assert.equal(s.diff, 0);
  const l = cornerSpeeds(axle, 7, 10);   // left turn, 7 m radius
  assert.ok(l.right > l.left);
  assert.ok(Math.abs(l.carrier - 10 / axle.wheelR) < 1e-12, "carrier turns at the mean");
  assert.ok(Math.abs(l.right / l.left - (7 + 0.7) / (7 - 0.7)) < 1e-12);
  const r = cornerSpeeds(axle, -7, 10);
  assert.ok(Math.abs(r.left - l.right) < 1e-12, "mirror image for a right turn");
});

test("differential: open splits torque equally, so one wheel on ice stops the car; a lock gets it moving", () => {
  const p = { torque: 3000, wheelR: 0.36, normal: 5000, muL: 0.08, muR: 0.7, resist: 1500 };
  const open = traction({ ...p, locked: false }), locked = traction({ ...p, locked: true });
  assert.ok(Math.abs(open.fL - 0.08 * 5000) < 1e-9 && open.fL === open.fR);
  assert.ok(open.spinL && !open.spinR && !open.moves);
  assert.ok(Math.abs(locked.total - Math.min(3000 / 0.36, 0.78 * 5000)) < 1e-9);
  assert.ok(locked.moves && locked.fR > locked.fL);
  const dry = traction({ ...p, torque: 2000, muL: 0.7, locked: false });
  assert.ok(dry.moves && !dry.spinL && !dry.spinR && Math.abs(dry.total - 2000 / 0.36) < 1e-9);
  const both = traction({ ...p, muL: 0.7, locked: false });
  assert.ok(both.spinL && both.spinR, "equal grip, too much torque: both spin");
});

const box = { gears: [{ name: "R", drive: 15, driven: 45, idler: true }, { name: "1", drive: 15, driven: 45 }, { name: "2", drive: 20, driven: 40 }, { name: "4", drive: 30, driven: 30 }], final: 2, wheelR: 0.45 };

test("gearbox: ratios, reverse runs backwards, primary speed and road speed are inverse", () => {
  assert.equal(ratio(box, 1), 3); assert.equal(ratio(box, 3), 1); assert.equal(ratio(box, 0), -3);
  assert.equal(ratio(box, null), Infinity); assert.equal(roadSpeed(box, null, 1000), 0);
  assert.ok(roadSpeed(box, 0, 1000) < 0);
  assert.ok(roadSpeed(box, 1, 1000) < roadSpeed(box, 2, 1000) && roadSpeed(box, 2, 1000) < roadSpeed(box, 3, 1000));
  for (const g of [0, 1, 2, 3]) assert.ok(Math.abs(primaryRpmFor(box, g, roadSpeed(box, g, 900)) - 900) < 1e-9);
});

test("gearbox: a pair only meshes cleanly when its speeds match", () => {
  const kmh = roadSpeed(box, 1, 1000);
  assert.ok(mismatch(box, 1, 1000, kmh) < 1e-12);
  assert.ok(mismatch(box, 2, 1000, kmh) > 0.3, "upshift without letting the primary shaft slow down");
  assert.ok(mismatch(box, 2, primaryRpmFor(box, 2, kmh), kmh) < 1e-12);
  assert.equal(mismatch(box, 1, 0, 0), 0, "standing still with the clutch out");
});

const car = { cd: 0.36, area: 2.3, mass: 2500, crr: 0.02, eta: 0.7 };

test("aero: top speed is where power needed meets power available; drag grows with v²", () => {
  const v = topSpeed(car, 132e3);
  assert.ok(Math.abs(powerNeeded(car, v) - 132e3) < 1);
  assert.ok(Math.abs(drag(car, 2 * v) / drag(car, v) - 4) < 1e-12);
  assert.ok(topSpeed({ ...car, cd: 0.48 }, 132e3) < v, "more drag, lower top speed");
  const v2 = topSpeed(car, 2 * 132e3);
  // Drag power grows with v³, so doubling the power buys only about ∛2 ≈ 1.26× the speed (a little more, because
  // rolling resistance grows only with v).
  assert.ok(v2 / v > Math.cbrt(2) && v2 / v < 1.35);
});

test("aero: a full-power run approaches the top speed and never passes it", () => {
  const P = 132e3, vt = topSpeed(car, P);
  let v = 0;
  for (let t = 0; t < 400; t += 0.02) { v = accelerate(car, P, v, 0.02); assert.ok(v <= vt + 1e-6); }
  assert.ok(v > 0.99 * vt);
});

test("every aero config's model top speed is within 5 % of the quoted one", async () => {
  for (const c of await loadCars()) for (const comp of c.components.filter(k => k.subsystem === "aero"))
    for (const s of comp.params.shapes) if (s.quoted) {
      const kmh = topSpeed(s, s.ps * 735.5) * 3.6;
      assert.ok(Math.abs(kmh / s.quoted - 1) < 0.05, `${c.slug} ${s.id}: model ${kmh.toFixed(0)} vs ${s.quoted} km/h`);
    }
});

const reit = { gears: [{ name: "Low", drive: 100, driven: 230 }, { name: "High", drive: 150, driven: 180 }], pinion: 90, ring: 420, wheelR: 0.3 };
const rider = { mass: 165, crr: 0.03, eta: 0.8, ps: 0.5, rpm: 600 };

test("belt: the small engine pulley is the low gear; speed and push trade against each other", () => {
  assert.ok(Math.abs(belt.ratio(reit, 1) - (180 / 150) * (420 / 90)) < 1e-12);
  assert.ok(belt.roadSpeed(reit, 0, 600) < belt.roadSpeed(reit, 1, 600));
  assert.ok(belt.wheelForce(reit, 0, rider) > belt.wheelForce(reit, 1, rider));
  // Power at the wheel is the same in both gears: push × speed = engine power × efficiency.
  for (const g of [0, 1]) {
    const P = belt.wheelForce(reit, g, rider) * belt.roadSpeed(reit, g, 600) / 3.6;
    assert.ok(Math.abs(P - 0.5 * 735.5 * 0.8) < 1e-9);
  }
});

test("belt: the steepest grade is where the push equals climbing plus rolling resistance", () => {
  const F = belt.wheelForce(reit, 0, rider), g = belt.maxGrade(rider, F);
  assert.ok(g > 0 && Math.abs(belt.resistance(rider, g) - F) < 1e-9);
  assert.ok(belt.maxGrade(rider, 0.5 * belt.resistance(rider, 0)) < 0, "cannot even roll on the level");
  assert.equal(belt.maxGrade(rider, 1e6), Infinity);
});

test("belt: a run settles at the governed speed, stalls on a hill that is too steep, and the brake holds it", () => {
  let v = 0;
  for (let t = 0; t < 60; t += 0.05) v = belt.step(reit, 1, rider, v, {}, 0.05);
  assert.ok(Math.abs(v - belt.roadSpeed(reit, 1, 600)) < 1e-9, "holds top speed on the level");
  const steep = belt.maxGrade(rider, belt.wheelForce(reit, 1, rider)) + 0.01;
  for (let t = 0; t < 60; t += 0.05) v = belt.step(reit, 1, rider, v, { grade: steep }, 0.05);
  assert.equal(v, 0);
  for (let t = 0; t < 60; t += 0.05) v = belt.step(reit, 0, rider, v, { grade: steep }, 0.05);
  assert.ok(Math.abs(v - belt.roadSpeed(reit, 0, 600)) < 1e-9, "low gear takes the same hill");
  const fast = belt.roadSpeed(reit, 1, 600), slowed = belt.step(reit, 0, rider, fast, {}, 0.05);
  assert.ok(slowed < fast && slowed > belt.roadSpeed(reit, 0, 600), "a downshift at speed slows it gradually");
  assert.equal(belt.step(reit, 0, rider, 0, { brake: true }, 0.05), 0);
  assert.ok(belt.step(reit, 0, rider, 5, { engaged: false }, 0.05) < 5, "belt off: it coasts down");
});

test("belt: the loop is as long as the open-belt formula and wraps each pulley at its radius", () => {
  const a = [530, 200], b = [147, 375], c = Math.hypot(b[0] - a[0], b[1] - a[1]);
  for (const [r1, r2] of [[50, 115], [75, 90], [90, 75]]) {
    const pts = belt.beltLoop(a, r1, b, r2, 400);
    const len = pts.reduce((s, p, i) => s + Math.hypot(...p.map((x, k) => x - pts[(i + 1) % pts.length][k])), 0);
    assert.ok(Math.abs(len / belt.beltLength(c, r1, r2) - 1) < 1e-3, `${r1}/${r2}: ${len.toFixed(1)}`);
    const on = p => Math.min(Math.abs(Math.hypot(p[0] - a[0], p[1] - a[1]) - r1), Math.abs(Math.hypot(p[0] - b[0], p[1] - b[1]) - r2));
    for (const p of pts) assert.ok(on(p) < 1e-9);
  }
});

test("every belt-drive config: top gear matches the quoted speed; one belt moved between steps fits both", async () => {
  for (const c of await loadCars()) for (const comp of c.components.filter(k => k.subsystem === "belt-drive")) {
    const { drive, vehicle, at, shift } = comp.params, top = drive.gears.length - 1;
    const kmh = belt.roadSpeed(drive, top, vehicle.rpm);
    assert.ok(Math.abs(kmh / vehicle.quoted - 1) < 0.05, `${c.slug}: ${kmh.toFixed(1)} vs ${vehicle.quoted} km/h`);
    assert.ok(belt.maxGrade(vehicle, belt.wheelForce(drive, 0, vehicle)) > belt.maxGrade(vehicle, belt.wheelForce(drive, top, vehicle)));
    if (comp.params.final === "ring") {   // the pinion runs inside the ring gear: centres (ring − pinion) / 2 apart
      const dist = Math.hypot(at.counter[0] - at.wheel[0], at.counter[1] - at.wheel[1]);
      assert.ok(Math.abs(dist - (drive.ring - drive.pinion) / 2) < 5, `${c.slug}: pinion ${dist.toFixed(0)} mm from the hub`);
    }
    if (shift !== "stopped") continue;
    const C = Math.hypot(at.counter[0] - at.engine[0], at.counter[1] - at.engine[1]);
    const lens = drive.gears.map(g => belt.beltLength(C, g.drive / 2, g.driven / 2));
    assert.ok(Math.max(...lens) / Math.min(...lens) - 1 < 0.01, `${c.slug}: ${lens.map(l => l.toFixed(0)).join(" vs ")} mm`);
  }
});
