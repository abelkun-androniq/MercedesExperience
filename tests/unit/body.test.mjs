// Body and chassis models: space-frame truss, frontal crash, air suspension, car-transporter deck hoist.
import { test } from "node:test";
import assert from "node:assert/strict";
import { solveTruss, tubeFrame, twistTest } from "../../lib/model/truss.js";
import { crushForce, simulateCrash } from "../../lib/model/crash.js";
import { airStatic, steelStatic, createCorner } from "../../lib/model/air-spring.js";
import * as hoist from "../../lib/model/hoist.js";
import { loadCars } from "./helpers.mjs";

test("truss: one bar stretches F·L/EA and carries F in tension", () => {
  const r = solveTruss({ nodes: [[0, 0, 0], [1000, 0, 0]], members: [{ ends: [0, 1], EA: 2e7 }],
    fixed: [{ node: 0, dof: "xyz" }, { node: 1, dof: "yz" }], loads: [{ node: 1, f: [5000, 0, 0] }] });
  assert.ok(Math.abs(r.u[1][0] - 5000 * 1000 / 2e7) < 1e-12);
  assert.ok(Math.abs(r.forces[0] - 5000) < 1e-9);
});

test("truss: a loaded triangle matches statics (apex load splits into the two legs)", () => {
  // 3-4-5 triangle in the x–z plane, y held everywhere.
  const r = solveTruss({ nodes: [[0, 0, 0], [800, 0, 0], [0, 0, 600]],
    members: [{ ends: [0, 1], EA: 1e8 }, { ends: [1, 2], EA: 1e8 }, { ends: [0, 2], EA: 1e8 }],
    fixed: [{ node: 0, dof: "xyz" }, { node: 1, dof: "yz" }, { node: 2, dof: "y" }], loads: [{ node: 2, f: [3000, 0, 0] }] });
  // Joint 2: horizontal 3000 N is carried by the hypotenuse (1→2, cos = 0.8): compression 3750 N; vertical leg 0→2 then
  // takes the hypotenuse's vertical part (0.6 · 3750 = 2250 N) in tension.
  assert.ok(Math.abs(r.forces[1] + 3750) < 1e-6);
  assert.ok(Math.abs(r.forces[2] - 2250) < 1e-6);
});

test("every space frame in the tour: cutting the side truss down for doors loses most of the twist stiffness", async () => {
  const frames = (await loadCars()).flatMap(c => c.components.filter(k => k.subsystem === "space-frame").map(k => k.params));
  assert.ok(frames.length > 0);
  for (const p of frames) {
    const [high, low] = ["high", "low"].map(door => {
      const f = tubeFrame(p.stations, p.bays.map(b => (b.door ? { ...b, door } : b)), p.EA);
      return twistTest(f, 0, p.stations.length - 1, 1000);
    });
    assert.ok(high.stiffness > 0 && Number.isFinite(high.stiffness));
    assert.ok(high.stiffness > 2 * low.stiffness, `${high.stiffness.toFixed(0)} vs ${low.stiffness.toFixed(0)} N·m/deg`);
  }
});

const mass = 1300, v0 = 50 / 3.6;
const crumple = { zone: { type: "crumple", force: 260e3, length: 0.55, ramp: 0.06 }, cellK: 8e6 };
const stiff = { zone: { type: "stiff", k: 2.6e6, length: 0.3 }, cellK: 2.5e6 };

test("crash: the crumple zone absorbs the energy at a nearly constant force", () => {
  const r = simulateCrash({ mass, v0, ...crumple });
  const ideal = 0.5 * mass * v0 ** 2 / 260e3 + 0.06 / 2;   // crush = energy / force, plus half the ramp
  assert.ok(Math.abs(r.crush - ideal) < 0.005, `${r.crush} vs ${ideal}`);
  assert.equal(r.intrusion, 0);
  assert.ok(r.peakG < 1.1 * r.meanG);
});

test("crash: a stiff front stops the car sooner, at a higher peak, and pushes into the cell", () => {
  const a = simulateCrash({ mass, v0, ...crumple }), b = simulateCrash({ mass, v0, ...stiff });
  assert.ok(b.duration < a.duration && b.peakG > 2 * a.peakG && b.intrusion > 0);
  assert.ok(Math.abs(crushForce(stiff.zone, stiff.cellK, 0.4) - (2.6e6 * 0.3 + 2.5e6 * 0.1)) < 1e-6);
});

test("every crash config: the safety body keeps the cell intact at its default speed", async () => {
  for (const c of await loadCars()) for (const comp of c.components.filter(k => k.subsystem === "crumple-zone")) {
    const p = comp.params, [safe, old] = p.cases.map(k => simulateCrash({ mass: p.mass, v0: p.speed.value / 3.6, zone: k.zone, cellK: k.cellK }));
    assert.equal(safe.intrusion, 0, c.slug);
    assert.ok(old.intrusion > 0 && old.peakG > safe.peakG, c.slug);
  }
});

const air = { area: 0.012, volume: 0.003, n: 1.3 };

test("air spring: pressure carries the load; its rate rises with load, so the ride frequency barely changes", () => {
  const e = airStatic(air, 420), f = airStatic(air, 560);
  assert.ok(Math.abs(e.pg * air.area - 420 * 9.81) < 1e-6);
  assert.ok(f.k > e.k);
  const steel = [steelStatic(e.k, 420, 420), steelStatic(e.k, 560, 420)];
  assert.ok(Math.abs(f.f / e.f - 1) < Math.abs(steel[1].f / steel[0].f - 1) / 3);
  assert.ok(Math.abs(steel[1].sag - 140 * 9.81 / e.k) < 1e-12);
});

test("air corner: loading sinks the body, the levelling valve fills it back to ride height; a steel spring stays down", () => {
  const a = createCorner({ kind: "air", air, emptyMass: 420, damping: 2500 });
  const s = createCorner({ kind: "steel", k: 28000, emptyMass: 420, damping: 2500 });
  let deepest = 0;
  for (let i = 0; i < 20 * 600; i++) { a.step(560, 1 / 600); s.step(560, 1 / 600); deepest = Math.max(deepest, a.z); }
  assert.ok(deepest > 0.004, "it sinks before the valve catches up");
  assert.ok(Math.abs(a.z) < 0.0025 && a.valve === "level", `air z ${a.z}`);
  assert.ok(Math.abs(s.z - 140 * 9.81 / 28000) < 0.001);
  assert.ok(a.pressure() > airStatic(air, 420).pg);
});

const block = { falls: 2, bore: 0.05, sheaveEta: 0.96, sheaves: 4, stroke: 0.8, flow: 6 };

test("hoist: the pulley block trades force for travel; work in equals work out plus sheave friction", () => {
  assert.equal(hoist.deckRise(block, 0.3), 0.6); assert.equal(hoist.strokeFor(block, 0.6), 0.3);
  const pull = 9000, F = hoist.cylinderForce(block, pull), eff = 0.96 ** 4;
  assert.ok(Math.abs(F * 0.3 * eff - pull * hoist.deckRise(block, 0.3)) < 1e-6);
  assert.ok(hoist.cylinderForce({ ...block, falls: 4 }, pull) === 2 * F, "twice the falls: twice the force, half the stroke");
  assert.ok(Math.abs(hoist.pressureBar(block, pull) - F / (Math.PI * 0.025 ** 2) / 1e5) < 1e-9);
  const pistonSpeed = 6 / 60000 / hoist.pistonArea(block);
  assert.ok(Math.abs(hoist.deckSpeed(block) - 2 * pistonSpeed) < 1e-12);
});

test("hoist: the end pulls balance the load; a car near one end loads that end's cable", () => {
  const deck = { x: 2000, mass: 300 }, car = m => ({ x: m, mass: 1500 });
  const mid = hoist.endPulls(0, 4000, [deck, car(2000)]);
  assert.ok(Math.abs(mid.front - mid.rear) < 1e-9 && Math.abs(mid.front + mid.rear - 1800 * 9.81) < 1e-9);
  const fwd = hoist.endPulls(0, 4000, [deck, car(3500)]);
  assert.ok(fwd.front > fwd.rear && Math.abs(fwd.front + fwd.rear - 1800 * 9.81) < 1e-9);
  assert.ok(Math.abs(hoist.endPulls(0, 4000, [car(4000)]).rear) < 1e-9, "a load right over the front end hangs on the front cable");
});

test("every hoist config: the stroke covers the deck's travel and loaded pressures stay hydraulic-normal", async () => {
  for (const c of await loadCars()) for (const comp of c.components.filter(k => k.subsystem === "hoist")) {
    const { hoist: h, deck, car, presets } = comp.params;
    const most = Math.max(...presets.flatMap(q => [q.front, q.rear])) / 1000;
    assert.ok(hoist.deckRise(h, h.stroke) >= most, `${c.slug}: stroke too short`);
    const pulls = hoist.endPulls(deck.rear[0], deck.front[0], [{ x: (deck.rear[0] + deck.front[0]) / 2, mass: deck.mass }, { x: car.x, mass: car.mass }]);
    for (const end of ["front", "rear"]) {
      const bar = hoist.pressureBar(h, pulls[end] / 2);   // two cables per end, one cylinder each
      assert.ok(bar > 20 && bar < 250, `${c.slug} ${end}: ${bar.toFixed(0)} bar`);
    }
  }
});
