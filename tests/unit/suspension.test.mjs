// Linkage closure, sign conventions, PoC regression values and ride-model bounds, for every car that uses a suspension.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createLinkage } from "../../lib/model/linkage.js";
import { createRide } from "../../lib/model/quarter-car.js";
import { loadCars } from "./helpers.mjs";

const cars = await loadCars();
const suspensions = cars.flatMap(car => car.components.filter(c => c.subsystem === "linkage-suspension").map(c => ({ car, c })));
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a.toFixed(3)} vs ${b} ± ${tol}`);

test("at least the two PoC suspensions are covered", () => assert.ok(suspensions.length >= 2));

for (const { car, c } of suspensions) {
  const lk = createLinkage({ W0: c.params.W0, links: c.params.links, wheelR: car.frame.wheelR });
  const at = s => lk.angles(lk.solve([0, 0, 0, 0, 0, 0], s));

  test(`${car.slug}/${c.id}: closes below 1e-10 over ±80 mm`, () => {
    let q = [0, 0, 0, 0, 0, 0];
    for (let s = -80; s <= 80; s += 5) {
      q = lk.solve(q, s);
      assert.ok(Math.max(...lk.residual(q, s).map(Math.abs)) < 1e-10, `residual at ${s} mm`);
    }
  });

  test(`${car.slug}/${c.id}: +80 mm bump gives negative camber`, () => assert.ok(at(80).camber < 0));
}

const byCar = slug => suspensions.find(s => s.car.slug === slug);

test("190 E regression (TOUR-POC §4.1)", () => {
  const { car, c } = byCar("190e");
  const lk = createLinkage({ W0: c.params.W0, links: c.params.links, wheelR: car.frame.wheelR });
  const bump = lk.angles(lk.solve([0, 0, 0, 0, 0, 0], 80)), reb = lk.angles(lk.solve([0, 0, 0, 0, 0, 0], -80));
  near(bump.camber, -1.36, 0.02, "camber +80"); near(bump.toe, 0.53, 0.02, "toe +80");
  near(reb.camber, 0.53, 0.02, "camber −80"); near(reb.toe, 0.90, 0.02, "toe −80");
});

test("540 K regression (TOUR-POC §4.2)", () => {
  const { car, c } = byCar("540k");
  const lk = createLinkage({ W0: c.params.W0, links: c.params.links, wheelR: car.frame.wheelR });
  near(lk.angles(lk.solve([0, 0, 0, 0, 0, 0], 80)).camber, -0.9, 0.05, "camber +80");
  near(lk.angles(lk.solve([0, 0, 0, 0, 0, 0], -80)).track, -15, 1, "track −80");
});

function rideLoop(car, axle) {
  const wb = car.frame.wheelbase / 1000;
  const ride = createRide({ ride: car.ride, xFront: car.frame.origin === "rear" ? wb : 0, xRear: car.frame.origin === "rear" ? 0 : -wb });
  const r = { tmin: Infinity, tmax: -Infinity, lmin: Infinity, lmax: -Infinity };
  for (let i = 0; i < 6912; i++) {   // one 24 m loop at 25 km/h in 0.5 ms steps
    ride.step(0.0005);
    const t = ride.travelMm(axle), l = ride.loadPct(axle);
    r.tmin = Math.min(r.tmin, t); r.tmax = Math.max(r.tmax, t); r.lmin = Math.min(r.lmin, l); r.lmax = Math.max(r.lmax, l);
  }
  return r;
}

for (const { car, c } of suspensions) {
  test(`${car.slug}/${c.id}: tyre load never negative over the road loop`, () => assert.ok(rideLoop(car, c.params.axle).lmin >= 0));
}

test("190 E ride: rear load peaks near 240 % and the wheel leaves the road in the pothole", () => {
  const r = rideLoop(byCar("190e").car, "rear");
  near(r.lmax, 240, 5, "peak load"); assert.equal(r.lmin, 0);
});

test("540 K ride: front travel −28…+36 mm, load 0…210 %", () => {
  const r = rideLoop(byCar("540k").car, "front");
  near(r.tmin, -28, 1.5, "travel min"); near(r.tmax, 36, 1.5, "travel max"); near(r.lmax, 210, 5, "load max"); assert.equal(r.lmin, 0);
});
