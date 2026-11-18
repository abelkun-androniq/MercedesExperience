// Two steered front axles (LP 333), from above: both are double-pivot trapezoids, and a drag link between them turns the
// second axle less, so every wheel's axis still meets one turning centre on the rear-axle line (lib/model/steering.js
// createTwinSteer). Fix the second axle straight and its tyres are scrubbed sideways through every turn instead.
// Params (mm, deg; ground at z = 0): label, rear (rear axle x), wheelbase (rear → first axle), second (rear → second
// axle), kingpinHalf, arm, halfTrack (wheel centres), wheelR, rearHalfTrack, maxSteer.
import * as THREE from "three";
import { V, mat, rod, place, ball, tyre } from "../lib/scene/helpers.js";
import { createTwinSteer } from "../lib/model/steering.js";

const D = Math.PI / 180, FAR = 60;   // m: axis lines longer than this are not drawn (nearly straight ahead)

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000;
  const sys = createTwinSteer({ kingpinHalf: p.kingpinHalf, arm: p.arm, wheelbase: p.wheelbase, second: p.second });
  const R = m(p.wheelR), x0 = m(p.rear), k = m(p.kingpinHalf), off = m(p.halfTrack - p.kingpinHalf);
  const group = new THREE.Group(); carRoot.add(group);
  const tyreMat = mat(0x2a2d31, { roughness: 0.9, transparent: true }), beamMat = stage.tokenMat("--metal", { metalness: 0.4 });
  const linkMat = stage.tokenMat("--l1"), scrubMat = mat(0x2a2d31, { roughness: 0.9, transparent: true }); stage.bind(scrubMat.color, "--accent");
  const axisMat = new THREE.LineDashedMaterial({ dashSize: 0.15, gapSize: 0.1, transparent: true, opacity: 0.8 }); stage.bind(axisMat.color, "--l2");
  const wheel = () => { const g = new THREE.Group(), w = tyre(tyreMat, R - 0.1, 0.1); g.add(w); g.userData.t = w; group.add(g); return g; };

  // Rear axle (fixed), and per front axle a beam, two wheels on their kingpins, and two axis lines to the rear-axle line.
  group.add(place(rod(beamMat, 0.03), V(x0, -m(p.rearHalfTrack), R), V(x0, m(p.rearHalfTrack), R)));
  for (const s of [1, -1]) wheel().position.set(x0, s * m(p.rearHalfTrack), R);
  const axles = [p.wheelbase, p.second].map(wb => {
    const x = x0 + m(wb);
    group.add(place(rod(beamMat, 0.035), V(x, -k, R), V(x, k, R)));
    const wheels = [1, -1].map(() => wheel());
    const lines = [0, 1].map(() => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0, 0, 0), V(1, 0, 0)]), axisMat); l.frustumCulled = false; group.add(l); return l; });
    return { x, wheels, lines };
  });
  const link = rod(linkMat, 0.018); group.add(link);
  const centre = ball(stage.tokenMat("--accent"), 0.09, V(x0, 0, 0.05)); group.add(centre);

  // ---------- state + panel ----------
  let steer = 0, target = 20 * D, steered = true, demo = !ctx.reducedMotion, phase = 0;
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { buttons: [{ id: "linked", label: t("Second axle steered"), pressed: true, onClick: () => setLinked(true) }, { id: "fixed", label: t("Second axle fixed"), pressed: false, onClick: () => setLinked(false) }] },
    { slider: { id: "steer", label: t("Steering, first axle inner wheel (deg)"), min: -p.maxSteer, max: p.maxSteer, step: 1, value: 20, onInput: v => { stopDemo(); target = v * D; } } },
    { readouts: [{ id: "a1", label: t("First axle"), unit: t("deg inner / outer") }, { id: "a2", label: t("Second axle"), unit: t("deg inner / outer") },
      { id: "radius", label: t("Turning radius"), unit: t("m at the rear axle") }, { id: "scrub", label: t("Second-axle tyres dragged sideways"), unit: t("deg slip") }] },
    { buttons: [{ id: "auto", toggle: [t("Demo on"), t("Demo off")], pressed: demo, onClick: v => (demo = v) }] },
  ] }, { label: t("Parts"), items: [{ legend: [["--metal", t("Axle beams")], ["--l1", t("Drag link between the axles")], ["--l2", t("Wheel axes, drawn out to the rear-axle line")], ["--accent", t("Turning centre / scrubbing tyres")]] }] }]);
  function stopDemo() { if (demo) { demo = false; ui.toggle("auto").set(false); } }
  function setLinked(on) { steered = on; ui.toggle("linked").set(on); ui.toggle("fixed").set(!on); }

  const tmp = V(0, 0, 0);
  return {
    layout({ active, onPhoto }) { group.visible = active; tyreMat.opacity = scrubMat.opacity = onPhoto ? 0.15 : 1; for (const a of axles) a.lines.forEach(l => (l.visible = !onPhoto)); centre.visible = !onPhoto; },
    update(dt) {
      if (demo) { phase += dt * 0.5; target = Math.sin(phase) * p.maxSteer * 0.8 * D; }
      steer += (target - steer) * Math.min(1, dt * 6);
      const r = sys.solve(steer, steered), sols = [r.s1, r.s2];
      axles.forEach((a, i) => {
        const s = sols[i];
        [s.dL, s.dR].forEach((d, j) => {
          const side = j ? -1 : 1, w = a.wheels[j];
          w.position.set(a.x - off * Math.sin(d) * side, side * (k + off * Math.cos(d)), R); w.rotation.z = d;
          w.userData.t.children[0].material = i === 1 && !steered && Math.abs(steer) > 2 * D ? scrubMat : tyreMat;
          // The wheel's axis, from its kingpin out to the rear-axle line (y where it crosses: ±k + wb / tan δ).
          const y = Math.abs(d) > 1e-4 ? side * k + (a.x - x0) / Math.tan(d) : Infinity, line = a.lines[j];
          line.visible = Number.isFinite(y) && Math.abs(y) < FAR;
          if (line.visible) { const g = line.geometry.attributes.position; g.setXYZ(0, a.x, side * k, 0.05); g.setXYZ(1, x0, y, 0.05); g.needsUpdate = true; line.computeLineDistances(); }
        });
      });
      // Drag link: from the first axle's left arm end to the second's.
      const end = (a, s) => tmp.set(a.x + m(s.PL[0]), m(s.PL[1]), R + 0.05).clone();
      place(link, end(axles[0], r.s1), end(axles[1], r.s2));
      const c = r.centre;
      centre.visible = Number.isFinite(c) && Math.abs(m(c)) < FAR; if (centre.visible) centre.position.set(x0, m(c), 0.05);
      const io = s => { const a = [Math.abs(s.dL), Math.abs(s.dR)].sort((u, v) => v - u); return `${(a[0] / D).toFixed(0)} / ${(a[1] / D).toFixed(0)}`; };   // whole degrees: num() only localises a lone number
      ui.set("a1", io(r.s1)); ui.set("a2", io(r.s2));
      ui.set("radius", Number.isFinite(c) ? (Math.abs(c) / 1000).toFixed(1) : "–"); ui.set("scrub", (r.scrub / D).toFixed(1));
      ui.badge("state").set(steered ? t("All wheel axes meet at one point") : t("Fixed second axle: its tyres scrub"), steered);
    },
  };
}
