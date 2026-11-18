// Central comfort hydraulics (Mercedes-Benz 600): an engine-driven pump charges a gas accumulator; pipes run from it to
// a small cylinder at every window, seat, the sliding roof, the boot lid and the door closers (lib/model/hydraulics.js).
// Pressing a switch opens that consumer's valve: oil from the accumulator pushes its piston, and the pump cuts in again
// once the pressure has dropped.
// Params (mm in the car, ground at z = 0): label, quotedBar (the maker's working pressure), system (lib/model/hydraulics.js:
// acc { gas m³, precharge Pa }, pump { flow m³/s, pMax, pMin Pa }, valve m³/s), pump [x, y, z], acc [x, y, z],
// consumers [{ id, label, at [x, y, z] (cylinder base), dir [x, y, z] (stroke direction), bore, stroke (m), load (N),
// part [length, width, height] (mm: the thing it moves, centred on the rod end) }].
import * as THREE from "three";
import { V, mm, rod, place, ball } from "../lib/scene/helpers.js";
import { createSystem, force, oilAt } from "../lib/model/hydraulics.js";

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, S = p.system;
  const group = new THREE.Group(); carRoot.add(group);
  const pumpMat = stage.tokenMat("--l4", { metalness: 0.4 }), accMat = stage.tokenMat("--l1", { metalness: 0.3 });
  const cylMat = stage.tokenMat("--metal", { metalness: 0.5 }), rodMat = stage.tokenMat("--fg", { metalness: 0.6 });
  const partMat = stage.tokenMat("--l2", { transparent: true, opacity: 0.45 }), hotMat = stage.tokenMat("--accent", { transparent: true, opacity: 0.7 });
  const pipeMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.7 }); stage.bind(pipeMat.color, "--l1");

  const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 20), pumpMat); pump.position.copy(mm(p.pump)); group.add(pump);
  const acc = ball(accMat, 0.09, mm(p.acc)); group.add(acc);
  const pipes = [[p.pump, p.acc], ...p.consumers.map(c => [p.acc, c.at])].flatMap(([a, b]) => [mm(a), mm([a[0], b[1], a[2]]), mm([a[0], b[1], a[2]]), mm(b)]);
  group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pipes), pipeMat));

  // One cylinder per consumer: barrel along dir, rod out by the stroke share, the part riding on the rod end.
  const units = p.consumers.map(c => {
    const base = mm(c.at), dir = V(...c.dir).normalize(), barrel = c.stroke * 0.6 + 0.04;
    group.add(place(rod(cylMat, Math.max(0.012, c.bore / 2 + 0.004)), base, base.clone().addScaledVector(dir, barrel)));
    const r = rod(rodMat, 0.006); group.add(r);
    const part = new THREE.Mesh(new THREE.BoxGeometry(...c.part.map(v => v / 1000)), partMat); group.add(part);
    return { c, base, dir, barrel, r, part };
  });

  // ---------- state + panel ----------
  const sys = createSystem(S);
  let demo = !ctx.reducedMotion, k = 0, wait = 1.5;
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { buttons: p.consumers.map(c => ({ id: c.id, label: c.label, pressed: false, onClick: () => { stopDemo(); operate(c); } })) },
    { readouts: [{ id: "p", label: t("Accumulator pressure"), unit: t("bar") }, { id: "oil", label: t("Oil stored"), unit: t("cm³") },
      { id: "pump", label: t("Pump"), unit: "" }, { id: "force", label: t("Push at the moving piston"), unit: t("N") }, { id: "load", label: t("Load against it"), unit: t("N") }] },
    { meter: { id: "charge" } },
    { buttons: [{ id: "auto", toggle: [t("Demo on"), t("Demo off")], pressed: demo, onClick: v => { demo = v; wait = 0; } }] },
    { text: t("Cut-out pressure {0} bar as quoted; accumulator size, pipe layout and cylinder sizes are illustrative.", p.quotedBar) },
  ] }, { label: t("Parts"), items: [{ legend: [["--l4", t("Engine-driven pump")], ["--l1", t("Accumulator and pipes")], ["--metal", t("Working cylinders")], ["--l2", t("What they move (lit while moving)")]] }] }]);
  function stopDemo() { if (demo) { demo = false; ui.toggle("auto").set(false); } }
  function operate(c) {
    const out = (sys.pos.get(c.id) ?? 0) > 0.5;
    sys.use(c.id, c, out ? -1 : 1);
    p.consumers.forEach(q => ui.toggle(q.id).set(q === c));
  }
  const full = oilAt(S.acc, S.pump.pMax);

  return {
    layout({ active }) { group.visible = active; },
    update(dt) {
      if (demo && !sys.moving) { wait -= dt; if (wait <= 0) { operate(p.consumers[k]); k = (k + 1) % p.consumers.length; wait = 1.2; } }
      for (let n = 0, h = Math.min(dt, 0.1) / 10; n < 10; n++) sys.step(h);
      for (const u of units) {
        const x = sys.pos.get(u.c.id) ?? 0, tip = u.base.clone().addScaledVector(u.dir, u.barrel + x * u.c.stroke);
        place(u.r, u.base.clone().addScaledVector(u.dir, u.barrel - 0.02), tip);
        u.part.position.copy(tip); u.part.material = sys.moving?.id === u.c.id ? hotMat : partMat;
      }
      const pr = sys.pressure(), m = sys.moving?.c;
      ui.set("p", (pr / 1e5).toFixed(0)); ui.set("oil", (sys.oil * 1e6).toFixed(0));
      ui.set("pump", sys.pumping ? t("charging") : t("idle"));
      ui.set("force", m ? force(m, pr).toFixed(0) : "–"); ui.set("load", m ? m.load.toFixed(0) : "–");
      ui.meter("charge").set(sys.oil / full, sys.pumping);
      ui.badge("state").set(m ? t("Valve open: {0}", m.label) : t("All valves shut"), !!m);
    },
  };
}
