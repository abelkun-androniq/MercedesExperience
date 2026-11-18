// Permanent four-wheel drive through three differentials, from above (lib/model/differential.js traction4). Open, each
// differential sends equal torque both ways, so a single wheel on ice caps the drive of everything behind it. The G-Class
// locks them one by one, centre, rear, front; the ML 320 leaves them open and brakes a spinning wheel instead (4ETS), so
// its differential passes the torque across to the wheel that grips.
// Params (mm, ground at z = 0): label, front, rear (axle x), halfTrack, wheelR, force (N, drive at the tyres, all four),
// normal (N per wheel), resist (N to climb the slope shown), surfaces [{ id, label, mu: [fl, fr, rl, rr] }],
// cases [{ id, label, front?, centre?, rear?, brake?, rearOnly? }] (the modes, from least to most help; rearOnly = front
// axle disengaged).
import * as THREE from "three";
import { V, mat, rod, place, ball, tyre } from "../lib/scene/helpers.js";
import { traction4 } from "../lib/model/differential.js";

const NAMES = ["fl", "fr", "rl", "rr"];

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, R = m(p.wheelR), ht = m(p.halfTrack), xs = [m(p.front), m(p.rear)];
  const group = new THREE.Group(); carRoot.add(group);
  const tyreMat = mat(0x2a2d31, { roughness: 0.9, transparent: true }), shaftMat = stage.tokenMat("--metal", { metalness: 0.6 });
  const openMat = stage.tokenMat("--l2"), lockMat = stage.tokenMat("--l1"), brakeMat = stage.tokenMat("--accent");
  const iceMat = stage.tokenMat("--l1", { transparent: true, opacity: 0.35 }), gripMat = stage.tokenMat("--muted", { transparent: true, opacity: 0.25 });
  const markMat = stage.tokenMat("--muted", { transparent: true, opacity: 0.4 });

  const wheels = NAMES.map((n, i) => {
    const x = xs[i >> 1], y = i % 2 ? -ht : ht;
    const g = new THREE.Group(); g.position.set(x, y, R); group.add(g);
    const spin = new THREE.Group(); g.add(spin); spin.add(tyre(tyreMat, R - 0.09, 0.09));
    spin.add(place(rod(shaftMat, 0.02), V(-R + 0.12, 0, 0), V(R - 0.12, 0, 0)));   // a spoke, so the turning shows
    const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.12), openMat); caliper.position.set(-R * 0.35, -Math.sign(y) * 0.12, R * 0.3); g.add(caliper);
    const patch = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.006), gripMat); patch.position.set(x, y, 0.003); group.add(patch);
    group.add(place(rod(shaftMat, 0.02), V(x, 0, R), V(x, y * 0.85, R)));
    return { g, spin, caliper, patch, a: 0 };
  });
  const diffs = [ball(openMat, 0.11, V(xs[0], 0, R)), ball(openMat, 0.13, V((xs[0] + xs[1]) / 2, 0, R)), ball(openMat, 0.11, V(xs[1], 0, R))];
  group.add(...diffs, place(rod(shaftMat, 0.025), V(xs[0], 0, R), V(xs[1], 0, R)));
  const marks = Array.from({ length: 12 }, (_, i) => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2 * ht + 1, 0.004), markMat); b.position.z = 0.002; group.add(b); return b; });

  // ---------- state + panel ----------
  let surface = p.surfaces[1] ?? p.surfaces[0], mode = p.cases[0], road = 0, demo = !ctx.reducedMotion, wait = 0, k = 0;
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { buttons: p.surfaces.map(s => ({ id: s.id, label: s.label, pressed: s === surface, onClick: () => { stopDemo(); setSurface(s); } })) },
    { buttons: p.cases.map(c => ({ id: c.id, label: c.label, pressed: c === mode, onClick: () => { stopDemo(); setMode(c); } })) },
    { cells: { id: "wheels", labels: [t("Front left"), t("Front right"), t("Rear left"), t("Rear right")] } },
    { readouts: [{ id: "drive", label: t("Drive at the tyres"), unit: t("kN") }, { id: "need", label: t("Needed to climb"), unit: t("kN") }, { id: "lost", label: t("Engine force not used"), unit: t("kN") }] },
    { buttons: [{ id: "auto", toggle: [t("Demo on"), t("Demo off")], pressed: demo, onClick: v => { demo = v; wait = 0; } }] },
    { text: t("Grip figures are textbook values for ice and dry ground; forces are illustrative.") },
  ] }, { label: t("Parts"), items: [{ legend: [["--l2", t("Open differential")], ["--l1", t("Locked differential / ice")], ["--accent", t("Brake holding a wheel")], ["--metal", t("Shafts")]] }] }]);
  function stopDemo() { if (demo) { demo = false; ui.toggle("auto").set(false); } }
  function setSurface(s) { surface = s; p.surfaces.forEach(q => ui.toggle(q.id).set(q === s)); }
  function setMode(c) { mode = c; p.cases.forEach(q => ui.toggle(q.id).set(q === c)); }

  return {
    layout({ active, onPhoto }) { group.visible = active; tyreMat.opacity = onPhoto ? 0.15 : 1; marks.forEach(b => (b.visible = !onPhoto)); wheels.forEach(w => (w.patch.visible = !onPhoto)); },
    update(dt, { onPhoto }) {
      if (demo) { wait += dt; if (wait > 2.5) { wait = 0; k = (k + 1) % p.cases.length; setMode(p.cases[k]); if (k === 0) setSurface(p.surfaces[(p.surfaces.indexOf(surface) + 1) % p.surfaces.length]); } }
      const r = traction4({ force: p.force, normal: p.normal, resist: p.resist, mu: surface.mu, front: !!mode.front, centre: !!mode.centre, rear: !!mode.rear, brake: mode.brake ?? 0, rearOnly: !!mode.rearOnly });
      const v = r.moves ? 1.2 : 0;   // m/s shown: crawling up the slope, or stuck
      road += v * dt;
      marks.forEach((b, i) => (b.position.x = xs[1] - 1 + ((i * 0.7 - road) % 8.4 + 8.4) % 8.4 - 1));
      wheels.forEach((w, i) => {
        w.a += (r.spin[i] ? 14 : r.braked[i] ? 0 : v / R) * dt;
        w.spin.rotation.y = w.a;
        w.caliper.material = r.braked[i] ? brakeMat : openMat;
        w.patch.material = surface.mu[i] < 0.3 ? iceMat : gripMat;
        ui.cells("wheels").set(i, r.spin[i] ? t("spins") : r.braked[i] ? t("braked") : t("grips"), !r.spin[i] && !r.braked[i] && r.drive > 0);
      });
      [mode.front, mode.centre, mode.rear].forEach((on, i) => (diffs[i].material = on ? lockMat : openMat));
      ui.set("drive", (r.drive / 1000).toFixed(1)); ui.set("need", (p.resist / 1000).toFixed(1)); ui.set("lost", ((p.force - r.drive) / 1000).toFixed(1));
      ui.badge("state").set(r.moves ? t("Climbing") : t("Stuck: not enough drive"), r.moves);
      if (onPhoto) road = 0;
    },
  };
}
