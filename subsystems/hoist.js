// Car-transporter deck hoist (Mercedes-Benz 1624): one central hydraulic pump, and at each deck end a cylinder per side
// with a pulley block whose cable runs over a pulley at the top of the post down to the deck. Raise both ends to lift
// the deck, one end to tilt it. The block gives `falls` times the piston's travel for `falls` times the force.
// Params (mm, ground at z = 0): label, hoist (lib/model/hoist.js; stroke m, bore m, flow = the pump's, l/min), deck { rear [x, z],
// front [x, z] (ends at their lowest), y (cable half-spacing), mass (kg) }, car { mass (kg), x (centre of mass),
// size [length, width, height] }, posts { base (z of the cylinder bases), top (z of the top pulleys) },
// presets [{ id, label, front, rear }] (rise of each end, mm).
import * as THREE from "three";
import { V, rod, place } from "../lib/scene/helpers.js";
import { deckRise, strokeFor, deckSpeed, pressureBar, endPulls } from "../lib/model/hoist.js";

const SHEAVE = 0.045;   // sheave radius (m)

export function create(ctx, p) {
  const { stage, carRoot } = ctx, m = v => v / 1000, h = p.hoist, D = p.deck;
  const group = new THREE.Group(); carRoot.add(group);
  const deckMat = stage.tokenMat("--l2", { transparent: true, opacity: 0.55 }), cylMat = stage.tokenMat("--l4", { metalness: 0.4 });
  const rodMat = stage.tokenMat("--metal", { metalness: 0.6 }), postMat = stage.tokenMat("--muted");
  const cableMat = new THREE.LineBasicMaterial(); stage.bind(cableMat.color, "--l1");
  const zBase = m(p.posts.base), zTop = m(p.posts.top), barrel = h.stroke + 0.12;
  const ends = { rear: { x: m(D.rear[0]), z0: m(D.rear[1]) }, front: { x: m(D.front[0]), z0: m(D.front[1]) } };

  // Deck and the car on it: boxes posed from the two end points each frame.
  const L0 = Math.hypot(ends.front.x - ends.rear.x, ends.front.z0 - ends.rear.z0);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(1, 2 * m(D.y), 0.05), deckMat); group.add(deck);
  const [cl, cw, ch] = p.car.size.map(m);
  const carBox = new THREE.Group(), carGeo = new THREE.BoxGeometry(cl, cw, ch);
  const carFill = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.12, depthWrite: false }), carEdge = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.8 });
  stage.bind(carFill.color, "--fg"); stage.bind(carEdge.color, "--fg");
  carBox.add(new THREE.Mesh(carGeo, carFill), new THREE.LineSegments(new THREE.EdgesGeometry(carGeo), carEdge)); group.add(carBox);

  // Per end and side: post, cylinder (barrel, rod), two sheave blocks, the falls between them, the cable to the deck.
  const sheave = () => new THREE.Mesh(new THREE.CylinderGeometry(SHEAVE, SHEAVE, 0.02, 24), rodMat);
  const lines = n => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 6), 3)); const l = new THREE.LineSegments(g, cableMat); l.frustumCulled = false; group.add(l); return g.attributes.position; };
  const units = [];
  for (const [name, e] of Object.entries(ends)) for (const s of [1, -1]) {
    const y = s * (m(D.y) + 0.07), cx = e.x;   // the cylinder stands beside its post
    group.add(place(rod(postMat, 0.03), V(e.x, y, zBase - 0.05), V(e.x, y, zTop + 0.06)));
    const top = sheave(); top.position.set(e.x, y, zTop); group.add(top);   // sheaves turn about y: the cable runs in x-z
    const cyl = { name, s, x: cx + 0.09, y, barrel: place(rod(cylMat, 0.035), V(cx + 0.09, y, zBase), V(cx + 0.09, y, zBase + barrel)), rod: rod(rodMat, 0.016) };
    cyl.fixed = sheave(); cyl.moving = sheave(); cyl.falls = lines(h.falls + 2);
    group.add(cyl.fixed, cyl.moving);
    group.add(cyl.barrel, cyl.rod); units.push(cyl);
  }

  // ---------- state + panel ----------
  const first = p.presets[0], rise = { rear: m(first.rear), front: m(first.front) }, target = { ...rise };
  let loaded = true, demo = !ctx.reducedMotion, step = 0, wait = 0;
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { buttons: p.presets.map((q, i) => ({ id: q.id, label: q.label, pressed: i === 0, onClick: () => { stopDemo(); go(q); } })) },
    { buttons: [{ id: "car", toggle: ["Car on the deck", "Deck empty"], pressed: loaded, onClick: v => (loaded = v) }] },
    { readouts: [{ id: "front", label: "Front end raised", unit: "mm" }, { id: "rear", label: "Rear end raised", unit: "mm" },
      { id: "tilt", label: "Deck tilt", unit: "deg" }, { id: "stroke", label: "Front pistons out", unit: "mm" },
      { id: "pull", label: "Front cable pull", unit: "kN per side" }, { id: "pF", label: "Front cylinders", unit: "bar to lift" }, { id: "pR", label: "Rear cylinders", unit: "bar to lift" }] },
    { buttons: [{ id: "auto", toggle: ["Demo on", "Demo off"], pressed: demo, onClick: v => { demo = v; wait = 0; } }] },
    { key: [["--l2", "deck"], ["--l1", "cables"], ["--l4", "cylinders"], ["--metal", "rods and sheaves"]] },
  ] }]);
  function stopDemo() { if (demo) { demo = false; ui.toggle("auto").set(false); } }
  function go(q) { target.front = m(q.front); target.rear = m(q.rear); p.presets.forEach(k => ui.toggle(k.id).set(k === q)); }

  function pose() {
    const R = V(ends.rear.x, 0, ends.rear.z0 + rise.rear), F = V(ends.front.x, 0, ends.front.z0 + rise.front);
    const dir = F.clone().sub(R), len = dir.length(), a = Math.atan2(dir.z, dir.x);
    deck.position.copy(R).add(F).multiplyScalar(0.5); deck.rotation.set(0, -a, 0); deck.scale.x = len + 0.3;
    const t = (m(p.car.x) - ends.rear.x) / (ends.front.x - ends.rear.x), up = V(-Math.sin(a), 0, Math.cos(a));
    carBox.visible = loaded; carBox.position.copy(R).addScaledVector(dir, t).addScaledVector(up, 0.025 + ch / 2); carBox.rotation.set(0, -a, 0);
    for (const c of units) {
      const e = ends[c.name], zDeck = e.z0 + rise[c.name], out = strokeFor(h, rise[c.name]);
      const zFixed = zBase - SHEAVE - 0.01, zMoving = zBase + barrel + out + 0.03;
      place(c.rod, V(c.x, c.y, zBase + barrel - 0.05), V(c.x, c.y, zMoving));
      c.fixed.position.set(c.x, c.y, zFixed); c.moving.position.set(c.x, c.y, zMoving);
      // Falls between the blocks (spread across the sheave), then the cable up the post, over the top, down to the deck.
      for (let k = 0; k < h.falls; k++) {
        const dx = -SHEAVE + (2 * SHEAVE * (k + 0.5)) / h.falls;
        c.falls.setXYZ(2 * k, c.x + dx, c.y, zFixed); c.falls.setXYZ(2 * k + 1, c.x + dx, c.y, zMoving);
      }
      const n = 2 * h.falls;
      c.falls.setXYZ(n, c.x - SHEAVE, c.y, zFixed); c.falls.setXYZ(n + 1, e.x - SHEAVE, c.y, zTop);
      c.falls.setXYZ(n + 2, e.x + SHEAVE * 0.2, c.y, zTop + SHEAVE); c.falls.setXYZ(n + 3, e.x + SHEAVE * 0.2, c.y - c.s * 0.07, zDeck);
      c.falls.needsUpdate = true;
    }
    return a;
  }

  return {
    layout({ active }) { group.visible = active; },
    update(dt) {
      if (demo) { wait += dt; if (wait > 3 && rise.front === target.front && rise.rear === target.rear) { step = (step + 1) % p.presets.length; go(p.presets[step]); wait = 0; } }
      // One central pump: the flow is shared by every cylinder that is moving (two per end).
      const moving = ["front", "rear"].filter(k => rise[k] !== target[k]), v = deckSpeed({ ...h, flow: h.flow / (2 * Math.max(1, moving.length)) });
      for (const k of moving) { const dz = target[k] - rise[k]; rise[k] += Math.sign(dz) * Math.min(Math.abs(dz), v * dt); }
      const a = pose();
      const pulls = endPulls(m(D.rear[0]), m(D.front[0]), [{ x: (m(D.rear[0]) + m(D.front[0])) / 2, mass: D.mass }, ...(loaded ? [{ x: m(p.car.x), mass: p.car.mass }] : [])]);
      ui.set("front", (rise.front * 1000).toFixed(0)); ui.set("rear", (rise.rear * 1000).toFixed(0));
      ui.set("tilt", ((a * 180) / Math.PI).toFixed(1)); ui.set("stroke", (strokeFor(h, rise.front) * 1000).toFixed(0));
      ui.set("pull", (pulls.front / 2000).toFixed(1));
      ui.set("pF", pressureBar(h, pulls.front / 2).toFixed(0)); ui.set("pR", pressureBar(h, pulls.rear / 2).toFixed(0));
      ui.badge("state").set(moving.length ? (moving.length === 2 ? "Both ends moving: the flow is shared" : `Moving the ${moving[0]} end`) : `Holding · ${(deckRise(h, h.stroke) * 1000).toFixed(0)} mm of travel`, moving.length > 0);
    },
  };
}
