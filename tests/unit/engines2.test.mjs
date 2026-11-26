// Wankel geometry, radiator cooling and diesel compression.
import { test } from "node:test";
import assert from "node:assert/strict";
import { housing, rotorCentre, apexes, displacement, chamberVolume, flank, strokeOf, compressionRatio, STROKES } from "../../lib/model/wankel.js";
import { uaAt, steadyTemp, boilRate, perHundredKm, createCooling, createIceTank, MELT } from "../../lib/model/cooling.js";
import { compressionTemp, injectingDiesel } from "../../lib/model/engine.js";
import { loadCars } from "./helpers.mjs";

const D = Math.PI / 180;
const m950 = { e: 0.015, R: 0.099, b: 0.075, flank: 0.0169 };   // Wikipedia's M 950 F figures; flank illustrative

test("wankel: apexes stay on the housing at radius R from the rotor centre", () => {
  for (let d = 0; d < 1080; d += 7) {
    const th = d * D, c = rotorCentre(th, m950);
    for (const p of apexes(th, m950)) assert.ok(Math.abs(Math.hypot(p[0] - c[0], p[1] - c[1]) - m950.R) < 1e-12);
  }
  assert.ok(Math.abs(housing(0, m950)[0] - (m950.R + m950.e)) < 1e-15);
});

test("wankel: swept volume matches 3√3·e·R·b; the flank fits inside the housing at every angle", () => {
  const cr = compressionRatio(m950);
  assert.ok(Math.abs((cr.vmax - cr.vmin) / displacement(m950) - 1) < 0.01);
  const H = Array.from({ length: 720 }, (_, i) => housing(i / 720 * 2 * Math.PI, m950));
  const inside = ([x, y]) => { let c = false; for (let i = 0, j = H.length - 1; i < H.length; j = i++) { const [xi, yi] = H[i], [xj, yj] = H[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  for (let d = 0; d < 360; d += 6) for (let k = 0; k < 3; k++) for (const p of flank(d * D, k, m950).slice(1, -1)) assert.ok(inside(p), `flank leaves the housing at ${d}°`);
});

test("wankel: each chamber runs intake → compression → power → exhaust, 270° of shaft each, volume peaking between", () => {
  const seen = [];
  for (let d = 91; d < 1171; d += 2) { const s = strokeOf(d * D, 0).stroke; if (seen.at(-1) !== s) seen.push(s); }
  assert.deepEqual(seen, STROKES);
  for (let k = 0; k < 3; k++) {
    const ths = [90, 360, 630, 900].map(d => d * D - k * 2 * Math.PI);   // chamber k runs 360° of shaft ahead of chamber k − 1
    assert.equal(strokeOf(ths[0] + 0.01, k).stroke, "Intake");
    assert.ok(chamberVolume(ths[1], k, m950) > chamberVolume(ths[0], k, m950), "largest at the end of intake");
  }
  assert.ok(Math.abs(compressionRatio(m950).ratio - 9.3) < 0.3);
});

test("every wankel config fits its compression ratio and the flank stays inside the housing", async () => {
  for (const c of await loadCars()) for (const comp of c.components.filter(k => k.subsystem === "wankel")) {
    const g = Object.fromEntries(Object.entries(comp.params.geometry).map(([k, v]) => [k, v / 1000]));
    assert.ok(Math.abs(compressionRatio(g).ratio - comp.params.compression) < 0.3, c.slug);
  }
});

const tubular = { water: 20, ua: 70, refSpeed: 30 / 3.6, still: 0.15, airT: 20 };
const honeycomb = { water: 20, ua: 445, refSpeed: 60 / 3.6, still: 0.3, airT: 20 };

test("cooling: the radiator sheds more with airflow; calibrated to the halved water use of 1898 → 1900", () => {
  assert.ok(uaAt(tubular, 0) === 0.15 * 70 && uaAt(tubular, 30 / 3.6) === 70);
  assert.ok(Math.abs(steadyTemp(tubular, 3500, 30 / 3.6) - 70) < 1e-9);
  assert.equal(boilRate(tubular, 3500, 30 / 3.6), 0);
  // Phoenix 8 hp (≈ 9 kW to the water) at 30 km/h: 18 l/100 km; Mercedes 35 PS (≈ 39 kW) at 60 km/h: 9 l/100 km.
  assert.ok(Math.abs(perHundredKm(boilRate(tubular, 9000, 30 / 3.6), 30) - 18) < 0.5);
  assert.ok(Math.abs(perHundredKm(boilRate(honeycomb, 39000, 60 / 3.6), 60) - 9) < 0.5);
  assert.equal(perHundredKm(0.001, 0), Infinity);
});

test("cooling: water warms towards the steady temperature, never passes 100 °C, and then boils away", () => {
  const s = createCooling(tubular);
  let T = s.T;
  for (let i = 0; i < 3000; i++) { s.step(9000, 30 / 3.6, 1); assert.ok(s.T >= T - 1e-9 && s.T <= 100); T = s.T; }
  assert.equal(s.T, 100); assert.ok(s.boiling && s.boiled > 0);
  s.reset(); assert.equal(s.T, 20); assert.equal(s.boiled, 0);
});

test("diesel: compression alone heats the air well past diesel's self-ignition; petrol ratios do not", () => {
  assert.ok(compressionTemp(20.5) > 400 && compressionTemp(6) < 250, "≈ 450 °C at 20.5:1, ≈ 230 °C at 6:1");
  assert.ok(Math.abs(compressionTemp(1) - 20) < 1e-9);
  assert.ok(injectingDiesel(4 * Math.PI - 0.1) && injectingDiesel(0.05) && !injectingDiesel(Math.PI));
});

test("ice cooling: the ice melts at 0 °C first, then the water warms, then it boils", () => {
  const tank = createIceTank({ ice: 30, water: 20 }), heat = 400e3, L = tank.lasts(heat);
  assert.ok(Math.abs(L.ice - 30 * MELT / heat) < 1e-9);
  tank.step(heat, L.ice * 0.5); assert.equal(tank.T, 0); assert.ok(Math.abs(tank.ice - 15) < 1e-9 && Math.abs(tank.water - 35) < 1e-9);
  tank.step(heat, L.ice * 0.5 + 5); assert.equal(tank.ice, 0); assert.ok(tank.T > 0 && tank.T < 100);
  tank.reset(); tank.step(heat, L.boil + 1); assert.equal(tank.T, 100); assert.ok(tank.boiled > 0);
});
