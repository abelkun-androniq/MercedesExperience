// Torque vectoring and the energy path of a four-motor electric car.
import { test } from "node:test";
import assert from "node:assert/strict";
import { bend, energy } from "../../lib/model/ev.js";

const CAR = { m: 2110, a: 1.42, b: 1.26, cf: 100e3, cr: 150e3, track: 1.68 };

test("no shift: an understeering car needs more than the Ackermann angle", () => {
  const r = bend(CAR, 50, 15);
  assert.ok(Math.abs(r.fyf + r.fyr - CAR.m * r.ay) < 1e-6);
  assert.ok(r.steer > r.ackermann);
});

test("shifting drive to the outer wheels turns the car with less steering, and the moments balance", () => {
  const r0 = bend(CAR, 50, 15), r1 = bend(CAR, 50, 15, 1000);
  assert.ok(r1.steer < r0.steer);
  assert.ok(Math.abs(CAR.a * r1.fyf - CAR.b * r1.fyr + r1.Mz) < 1e-6);
  assert.ok(Math.abs(r1.Mz - 3360) < 1e-9);
  assert.ok(bend(CAR, 50, 15, -1000).steer > r0.steer);   // the other way, it fights the bend
});

const EV = { m: 2110, cda: 0.75, crr: 0.012, drive: 0.85, regen: 0.8, regenMax: 120e3 };
test("driving draws more from the battery than reaches the wheels", () => {
  const e = energy(EV, 30, 1);
  assert.ok(e.wheel > 0 && e.battery > e.wheel && e.friction === 0);
});
test("braking charges the battery up to its limit; the brakes take the rest", () => {
  const soft = energy(EV, 20, -1), hard = energy(EV, 30, -8);
  assert.ok(soft.battery < 0 && soft.friction === 0);
  assert.ok(Math.abs(-soft.battery - -soft.wheel * EV.regen) < 1e-6);
  assert.equal(hard.battery, -EV.regenMax); assert.ok(hard.friction > 0);
  assert.ok(Math.abs(hard.friction + EV.regenMax / EV.regen + hard.wheel) < 1e-6);
});
