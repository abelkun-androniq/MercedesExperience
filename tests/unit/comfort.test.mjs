// Comfort models: central hydraulics, coach air conditioning, the folding hardtop and torsion-bar levelling.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createSystem, pressureAt, oilAt, force } from "../../lib/model/hydraulics.js";
import { createCabin, steadyTemp } from "../../lib/model/climate.js";
import { roofAt, duration } from "../../lib/model/roof.js";
import { createCorner } from "../../lib/model/air-spring.js";
import { loadCars } from "./helpers.mjs";

const cars = await loadCars();
const params = sub => cars.flatMap(c => c.components.filter(k => k.subsystem === sub).map(k => [c.slug, k.params]));

test("hydraulics: the accumulator's pressure rises with the oil it holds (Boyle) and oilAt inverts it", () => {
  const acc = { gas: 0.002, precharge: 60e5 };
  assert.equal(pressureAt(acc, 0), 60e5);
  assert.ok(Math.abs(pressureAt(acc, oilAt(acc, 150e5)) - 150e5) < 1);
  assert.ok(pressureAt(acc, 0.0012) > pressureAt(acc, 0.0008));
});

for (const [slug, p] of params("comfort-hydraulics")) {
  test(`${slug}: every consumer works from a full accumulator, and the pump refills it`, () => {
    const pmax = p.system.pump.pMax;
    assert.ok(Math.abs(pmax / 1e5 - p.quotedBar) < 1, "cut-out pressure as quoted");
    for (const c of p.consumers) {
      const s = createSystem(p.system);
      assert.ok(force(c, s.pressure()) > c.load * 1.5, `${c.id}: force to spare`);
      s.use(c.id, c, 1);
      let t = 0;
      while (s.moving && t < 30) { s.step(0.002); t += 0.002; }
      assert.ok(s.pos.get(c.id) > 0.999, `${c.id} reaches the end`);
      assert.ok(t > 0.5 && t < 15, `${c.id}: ${t.toFixed(1)} s`);
      assert.ok(s.pressure() < pmax, "the stroke took oil from the accumulator");
      for (let i = 0; i < 60000; i++) s.step(0.002);
      assert.ok(s.pressure() >= p.system.pump.pMin, "pump keeps it charged");
    }
  });
}

for (const [slug, p] of params("cabin-climate")) {
  test(`${slug}: full and in the sun the coach heats far above the outside air; the unit holds it near its setting`, () => {
    const n = p.passengers.max, out = p.outside.value;
    assert.ok(steadyTemp(p.cabin, n, out) > out + 5);
    const s = createCabin(p.cabin, out);
    for (let i = 0; i < 7200; i++) s.step(1, { n: p.passengers.value, outside: out, ac: true });
    assert.ok(Math.abs(s.T - p.cabin.set) < 2, `${s.T.toFixed(1)} °C`);
    assert.ok(s.cooling <= p.cabin.cooling);
  });
}

for (const [slug, p] of params("vario-roof")) {
  test(`${slug}: the roof takes its quoted time and stows inside the boot, under the closed lid`, () => {
    const T = duration(p.roof);
    assert.ok(Math.abs(T - p.quoted) <= 1, `${T} s`);
    const up = roofAt(p.roof, 0), down = roofAt(p.roof, T), b = p.boot;
    assert.equal(up.phase, "up"); assert.equal(down.phase, "down");
    assert.deepEqual(up.A.map(Math.round), p.roof.A);
    for (const [x, z] of [down.A, down.J, down.D]) assert.ok(x > b.x0 && x < b.x1 && z > b.z0 && z < b.z1, `${x.toFixed(0)}, ${z.toFixed(0)}`);
    assert.equal(down.lid, 0);
    const mid = roofAt(p.roof, p.roof.phases[0][1] + p.roof.phases[1][1] + p.roof.phases[2][1] / 2);
    assert.ok(mid.lid > 1, "the lid is open while the roof swings");
  });
}

test("levelling: the torsion bar's motor brings the loaded rear back to ride height; the spring rate, and so the ride, stays soft", () => {
  const corner = kind => createCorner({ kind, k: 30000, emptyMass: 400, damping: 2500, motorRate: 1500 });
  const steel = corner("steel"), bar = corner("torsion");
  for (let i = 0; i < 400000; i++) { steel.step(550, 1e-4); bar.step(550, 1e-4); }
  assert.ok(steel.z > 0.04, `steel sags ${(steel.z * 1000).toFixed(0)} mm`);
  assert.ok(Math.abs(bar.z) < 0.003, `bar levels to ${(bar.z * 1000).toFixed(1)} mm`);
  assert.ok(Math.abs(bar.preload - 150 * 9.81) < 60, "the preload carries the added load");
});
