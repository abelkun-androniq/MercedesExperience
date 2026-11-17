// Self-levelling air suspension against steel springs. Load the car: on steel springs the body sinks, mostly at the
// rear, and stays down. On air springs it sinks too, then the levelling valves let more air into the bellows until the
// body is back at ride height; the higher pressure also stiffens the spring, so the ride frequency hardly changes.
// Params (mm, ground at z = 0): label, front (x of the front axle), wheelbase, halfTrack, wheelR,
// corners { front: { mass, extra }, rear: { mass, extra } } (kg sprung per corner; kg added per corner when loaded),
// air { area (m²), volume (m³), n }, steel { front, rear } (N/m), damping (N·s/m), bellows { r, h, z0 } (mm),
// load { heads: [[x, y, z]], boot: [x, z] } (mm, what is drawn when loaded).
import * as THREE from "three";
import { V, mat, ball, tyre, helix } from "../lib/scene/helpers.js";
import { createCorner } from "../lib/model/air-spring.js";

const PATM = 101325, SUB = 10;

export function create(ctx, p) {
  const { stage, carRoot } = ctx, m = v => v / 1000;
  const world = new THREE.Group(); stage.scene.add(world);   // wheels and axles do not move with the body
  const xF = m(p.front), wb = m(p.wheelbase), yT = m(p.halfTrack), R = m(p.wheelR), bz0 = m(p.bellows.z0), bh = m(p.bellows.h), br = m(p.bellows.r);
  const tyreMat = mat(0x2a2d31, { roughness: 0.9 }), rimMat = mat(0x9aa4ad, { metalness: 0.5 }), airMat = stage.tokenMat("--l4"), coilMat = stage.tokenMat("--metal");
  tyreMat.transparent = rimMat.transparent = true;   // faded over the museum photo
  const axles = [["front", xF], ["rear", xF - wb]];
  const corners = axles.flatMap(([axle, x]) => [1, -1].map(s => {
    const wheel = tyre(tyreMat, R - 0.07, 0.07); wheel.position.set(x, s * yT, R); world.add(wheel);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.12, R - 0.12, 0.16, 28), rimMat); rim.position.set(x, s * yT, R); world.add(rim);
    const y = s * (yT - 0.2);
    const bellows = new THREE.Group(); bellows.position.set(x, y, bz0); world.add(bellows);   // three rolls, spread over the height each frame
    const rolls = [0, 1, 2].map(() => { const t = new THREE.Mesh(new THREE.TorusGeometry(br * 0.78, br * 0.22, 10, 28), airMat); bellows.add(t); return t; });
    const coil = new THREE.Mesh(helix(V(0, 0, 0), V(0, 0, 1), 6, br * 0.85, 0.012), coilMat); coil.position.set(x, y, bz0); world.add(coil);
    return { axle, bellows, rolls, coil };
  }));
  const loadGroup = new THREE.Group(); carRoot.add(loadGroup);
  const loadMat = stage.tokenMat("--accent");
  for (const hd of p.load.heads) loadGroup.add(ball(loadMat, 0.1, V(m(hd[0]), m(hd[1]), m(hd[2]))));
  const boot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.3), stage.tokenMat("--l2")); boot.position.set(m(p.load.boot[0]), 0, m(p.load.boot[1])); loadGroup.add(boot);

  // Four corner models: front/rear × air/steel; both systems run all the time so switching shows each one's state.
  const make = (kind, axle) => createCorner({ kind, air: p.air, k: p.steel[axle], emptyMass: p.corners[axle].mass, damping: p.damping });
  const sims = { air: { front: make("air", "front"), rear: make("air", "rear") }, steel: { front: make("steel", "front"), rear: make("steel", "rear") } };
  let mode = "air", loaded = false, auto = !ctx.reducedMotion, t = 0;
  const ui = ctx.panel([{ label: p.label, badge: { id: "valve", text: "" }, items: [
    { buttons: [{ id: "air", label: "Air suspension, self-levelling", pressed: true, onClick: () => setMode("air") }, { id: "steel", label: "Steel springs", pressed: false, onClick: () => setMode("steel") }] },
    { buttons: [{ id: "load", toggle: ["Loaded: 4 people + luggage", "Driver only"], pressed: false, onClick: v => { auto = false; ui.toggle("auto").set(false); loaded = v; } }] },
    { readouts: [{ id: "front", label: "Front sits lower by", unit: "mm" }, { id: "rear", label: "Rear sits lower by", unit: "mm" },
      { id: "bar", label: "Rear bellows pressure", unit: "bar" }, { id: "hz", label: "Rear ride frequency", unit: "Hz (bounce rate)" }, { id: "pitch", label: "Nose up", unit: "deg" }] },
    { buttons: [{ id: "auto", toggle: ["Auto demo on", "Auto demo off"], pressed: auto, onClick: v => (auto = v) }] },
    { key: [["--l4", "air bellows"], ["--metal", "steel coil spring"], ["--accent", "passengers"], ["--l2", "luggage"]] },
  ] }]);
  function setMode(md) { mode = md; ui.toggle("air").set(md === "air"); ui.toggle("steel").set(md === "steel"); }

  const massOf = axle => p.corners[axle].mass + (loaded ? p.corners[axle].extra : 0);
  function rideHz(axle) {
    const c = sims[mode][axle], mass = massOf(axle);
    const k = mode === "air" ? p.air.n * (c.pressure() + PATM) * p.air.area ** 2 / (p.air.volume - p.air.area * c.z) : p.steel[axle];
    return Math.sqrt(k / mass) / (2 * Math.PI);
  }
  return {
    layout({ active, onPhoto }) { world.visible = active; loadGroup.visible = active && loaded; tyreMat.opacity = rimMat.opacity = onPhoto ? 0.12 : 1; },
    update(dt, { onPhoto }) {
      if (auto) { t += dt; const l = Math.floor(t / 7) % 2 === 1; if (l !== loaded) { loaded = l; ui.toggle("load").set(l); } }
      loadGroup.visible = loaded;
      const h = Math.min(dt, 0.05) / SUB;
      for (let i = 0; i < SUB; i++) for (const md of ["air", "steel"]) for (const axle of ["front", "rear"]) sims[md][axle].step(massOf(axle), h);
      const zF = sims[mode].front.z, zR = sims[mode].rear.z, sin = (zF - zR) / wb;
      if (!onPhoto) { carRoot.rotation.y = Math.asin(sin); carRoot.position.z = -zF + xF * sin; }   // the photo's car stays put
      for (const c of corners) {
        const sag = sims[mode][c.axle].z, k = Math.max(0.2, (bh - sag) / bh);
        c.bellows.visible = mode === "air"; c.coil.visible = mode === "steel";
        c.rolls.forEach((r, i) => (r.position.z = bh * k * (i + 0.5) / 3)); c.coil.scale.set(1, 1, bh * k);
      }
      const valve = sims.air.rear.valve === "level" ? sims.air.front.valve : sims.air.rear.valve;
      ui.badge("valve").set(mode === "steel" ? "No levelling" : valve === "filling" ? "Valves: letting air in" : valve === "venting" ? "Valves: letting air out" : "At ride height", mode === "air" && valve === "level");
      ui.set("front", (zF * 1000).toFixed(0)); ui.set("rear", (zR * 1000).toFixed(0));
      ui.set("bar", mode === "air" ? (sims.air.rear.pressure() / 1e5).toFixed(2) : "–");
      ui.set("hz", rideHz("rear").toFixed(2)); ui.set("pitch", (-Math.asin(sin) * 180 / Math.PI).toFixed(2));
    },
  };
}
