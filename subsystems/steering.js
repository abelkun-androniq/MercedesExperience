// Front steering seen from above: Benz's double-pivot (stub-axle) trapezoid against the older centre-pivot turntable axle,
// with each front wheel's axis drawn out to the rear-axle line (where they meet = the turning centre).
// Params (mm, deg): label, kingpinHalf, arm, wheelbase, frontR, rearR, halfTrackRear, stub (kingpin → wheel centre),
// maxSteer, start? ("dp" | "cp": the layout shown first, default double pivot). Vehicle frame: rear axle at x = 0, front axle at x = wheelbase.
import * as THREE from "three";
import { V, mat, rod, place, ball, spokedWheel } from "../lib/scene/helpers.js";
import { createDoublePivot, centrePivot } from "../lib/model/steering.js";

const D = Math.PI / 180, FAR = 40;   // m: axis lines longer than this are not drawn (nearly straight ahead)

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx;
  const sys = createDoublePivot({ kingpinHalf: p.kingpinHalf, arm: p.arm, wheelbase: p.wheelbase });
  const m = v => v / 1000, wb = m(p.wheelbase), k = m(p.kingpinHalf), zF = m(p.frontR), zR = m(p.rearR), stub = m(p.stub ?? 60);
  const group = new THREE.Group(); carRoot.add(group);
  const wood = mat(0x8a6a4a, { roughness: 0.8 }), iron = mat(0x4a5058, { metalness: 0.4 }), tyreMat = mat(0x2a2d31, { roughness: 0.9 });
  for (const w of [wood, tyreMat]) w.transparent = true;   // wheels fade over the museum photo
  const armMat = stage.tokenMat("--l1"), tieMat = stage.tokenMat("--l2"), beamMat = stage.tokenMat("--metal");

  // Rear axle and wheels, fixed.
  group.add(place(rod(iron, 0.02), V(0, -m(p.halfTrackRear), zR), V(0, m(p.halfTrackRear), zR)));
  for (const s of [1, -1]) { const w = spokedWheel(tyreMat, wood, zR, 14); w.position.set(0, s * m(p.halfTrackRear), zR); group.add(w); }

  // Front beam: fixed in double-pivot mode, swings about its centre in centre-pivot mode. Each wheel turns on its own
  // kingpin at the beam end (double pivot) or is fixed to the beam (centre pivot).
  const beam = new THREE.Group(); beam.position.set(wb, 0, zF); group.add(beam);
  beam.add(place(rod(beamMat, 0.022), V(0, -k, 0), V(0, k, 0)));
  const turntable = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.012, 8, 40), iron); turntable.position.set(wb, 0, zF + 0.03); group.add(turntable);
  const corners = [1, -1].map(side => {
    const pivot = new THREE.Group(); pivot.position.set(0, side * k, 0); beam.add(pivot);
    pivot.add(place(rod(iron, 0.012), V(0, 0, -0.06), V(0, 0, 0.06)));   // kingpin
    pivot.add(place(rod(iron, 0.014), V(0, 0, 0), V(0, side * stub, 0)));   // stub axle
    const w = spokedWheel(tyreMat, wood, zF, 12); w.position.set(0, side * stub, 0); pivot.add(w);
    const [ax, ay] = sys.armVec(side, 0);
    const arm = place(rod(armMat, 0.012), V(0, 0, 0), V(m(ax), m(ay), 0)); pivot.add(arm);
    return { pivot, arm };
  });
  const tie = rod(tieMat, 0.01); group.add(tie);

  // Axis lines on the ground to the rear-axle line, and the turning centre(s) where they land.
  const lineOf = token => {
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0, 0, 0), V(0, 0, 0)]), new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 }));
    stage.bind(l.material.color, token); l.frustumCulled = false; group.add(l); return l;
  };
  const axisL = lineOf("--l1"), axisR = lineOf("--l2"), rearLine = lineOf("--muted");
  const icrL = ball(stage.tokenMat("--l1"), 0.05), icrR = ball(stage.tokenMat("--l2"), 0.05); group.add(icrL, icrR);
  const setLine = (l, a, b) => { const pos = l.geometry.attributes.position; pos.setXYZ(0, a.x, a.y, a.z); pos.setXYZ(1, b.x, b.y, b.z); pos.needsUpdate = true; };
  const G = 0.01;   // line height above the ground

  let mode = p.start ?? "dp", steer = 0, auto = !ctx.reducedMotion, clock = 0;
  const maxS = p.maxSteer ?? 30;
  const setMode = md => { mode = md; ui.toggle("dp").set(md === "dp"); ui.toggle("cp").set(md === "cp"); };

  const ui = ctx.panel([
    { label: p.label, items: [
      { buttons: [{ id: "dp", label: t("Double-pivot (Benz, 1893)"), pressed: mode === "dp", onClick: () => setMode("dp") },
        { id: "cp", label: t("Centre-pivot axle"), pressed: mode === "cp", onClick: () => setMode("cp") }] },
      { slider: { id: "steer", label: t("Steering angle (+ = left)"), min: -maxS, max: maxS, value: 0, onInput: v => { auto = false; ui.toggle("auto").set(false); steer = v * D; } } },
      { readouts: [{ id: "inner", label: t("Inner wheel"), unit: t("deg") }, { id: "outer", label: t("Outer wheel"), unit: t("deg") },
        { id: "ideal", label: t("Ideal outer"), unit: t("deg, all axes meet") }, { id: "miss", label: t("Axes miss by"), unit: t("m at the rear axle") },
        { id: "radius", label: t("Turning circle"), unit: t("m radius, outer front") }, { id: "support", label: t("Front support width"), unit: t("% of straight ahead") }] },
      { buttons: [{ id: "auto", toggle: [t("Auto demo on"), t("Auto demo off")], pressed: auto, onClick: v => (auto = v) }] },
      { key: [["--l1", t("left wheel axis")], ["--l2", t("right wheel axis")], ["--muted", t("rear axle line")]] },
    ] },
    { label: t("Parts"), items: [{ legend: [["--l1", t("Steering arms")], ["--l2", t("Tie rod")], ["--metal", t("Front axle beam")]] }] },
  ]);

  function pose() {
    const front = K => V(wb + m(K[0]), m(K[1]), G);
    const toRear = (from, d) => V(0, from.y + from.x / Math.tan(d), G);   // along the wheel axis to x = 0
    let r;
    if (mode === "dp") {
      const s = sys.solve(steer);
      beam.rotation.z = 0; corners[0].pivot.rotation.z = s.dL; corners[1].pivot.rotation.z = s.dR;
      place(tie, V(wb + m(s.PL[0]), m(s.PL[1]), zF), V(wb + m(s.PR[0]), m(s.PR[1]), zF));
      const inner = Math.max(Math.abs(s.dL), Math.abs(s.dR)), outer = Math.min(Math.abs(s.dL), Math.abs(s.dR));
      r = { inner, outer, ideal: Math.abs(s.idealOuter), miss: Math.abs(s.icrL - s.icrR), radius: s.radius, support: 1, dL: s.dL, dR: s.dR, KL: front(s.KL), KR: front(s.KR) };
    } else {
      const c = centrePivot({ kingpinHalf: p.kingpinHalf, wheelbase: p.wheelbase }, steer);
      beam.rotation.z = steer; corners[0].pivot.rotation.z = 0; corners[1].pivot.rotation.z = 0;
      r = { inner: Math.abs(steer), outer: Math.abs(steer), ideal: Math.abs(steer), miss: 0, radius: c.radius, support: c.halfTrack / p.kingpinHalf, dL: steer, dR: steer, KL: front(c.L), KR: front(c.R) };
    }
    for (const c of corners) c.arm.visible = mode === "dp";
    tie.visible = mode === "dp"; turntable.visible = mode === "cp";
    const straight = Math.abs(steer) < 0.5 * D;
    const eL = straight ? null : toRear(r.KL, r.dL), eR = straight ? null : toRear(r.KR, r.dR);
    const show = !straight && Math.abs(eL.y) < FAR && Math.abs(eR.y) < FAR;
    for (const o of [axisL, axisR, rearLine, icrL, icrR]) o.visible = show;
    if (show) {
      setLine(axisL, r.KL, eL); setLine(axisR, r.KR, eR);
      const ys = [eL.y, eR.y, -m(p.halfTrackRear), m(p.halfTrackRear)];
      setLine(rearLine, V(0, Math.min(...ys), G), V(0, Math.max(...ys), G));
      icrL.position.copy(eL); icrR.position.copy(eR);
    }
    return r;
  }
  pose();

  return {
    layout({ active, onPhoto }) { group.visible = active; wood.opacity = tyreMat.opacity = onPhoto ? 0.25 : 1; },
    update(dt) {
      if (auto) { clock += dt; steer = maxS * D * Math.sin(clock * 0.6); ui.slider("steer").set((steer / D).toFixed(1)); }
      const r = pose(), straight = Math.abs(steer) < 0.5 * D;
      ui.set("inner", (r.inner / D).toFixed(1)); ui.set("outer", (r.outer / D).toFixed(1));
      ui.set("ideal", straight ? "0.0" : (r.ideal / D).toFixed(1));
      ui.set("miss", straight ? "–" : (r.miss / 1000).toFixed(2));
      ui.set("radius", straight ? t("straight") : (r.radius / 1000).toFixed(1));
      ui.set("support", Math.round(r.support * 100));
    },
  };
}
