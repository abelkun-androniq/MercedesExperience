// Folding steel hardtop (SLK, R 170 "Vario-roof"), from the side (lib/model/roof.js): unlatch from the windscreen frame,
// the boot lid swings up about its rear hinge, the rear-window section turns back about its pivot behind the seats,
// carrying the roof, which folds down onto it, and the pack drops into the boot before the lid closes over it.
// Params (mm, ground at z = 0): label, roof (lib/model/roof.js), boot { x0, x1, z0, z1 } (the space it stows in),
// width (roof panel width), quoted (s, the maker's figure).
import * as THREE from "three";
import { V, ball } from "../lib/scene/helpers.js";
import { roofAt, duration } from "../lib/model/roof.js";

const PHASES = ["latch", "lid-open", "fold", "lid-close"];

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, w = m(p.width), T = duration(p.roof);
  const group = new THREE.Group(); carRoot.add(group);
  const roofMat = stage.tokenMat("--l1", { metalness: 0.3, transparent: true, opacity: 0.85 }), glassMat = stage.tokenMat("--l2", { transparent: true, opacity: 0.5 });
  const lidMat = stage.tokenMat("--l4", { transparent: true, opacity: 0.6 }), pinMat = stage.tokenMat("--fg");
  const bootMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.6 }); stage.bind(bootMat.color, "--muted");
  const panel = mat => { const b = new THREE.Mesh(new THREE.BoxGeometry(1, w, 0.02), mat); group.add(b); return b; };
  const roof = panel(roofMat), rearWin = panel(glassMat), lid = panel(lidMat);
  // A flat panel between two side-view points [x, z] (mm).
  const span = (b, a, c) => {
    const [ax, az] = a.map(m), [cx, cz] = c.map(m);
    b.position.set((ax + cx) / 2, 0, (az + cz) / 2); b.scale.x = Math.hypot(cx - ax, cz - az); b.rotation.y = -Math.atan2(cz - az, cx - ax);
  };
  const pivot = ball(pinMat, 0.03, V(m(p.roof.P[0]), w / 2 + 0.03, m(p.roof.P[1]))), joint = ball(pinMat, 0.025, V(0, 0, 0)), hinge = ball(pinMat, 0.03, V(m(p.roof.lid.hinge[0]), w / 2 + 0.03, m(p.roof.lid.hinge[1])));
  group.add(pivot, joint, hinge);
  const B = p.boot, bx = [B.x0, B.x1].map(m), bz = [B.z0, B.z1].map(m);
  group.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([V(bx[0], w / 2, bz[0]), V(bx[1], w / 2, bz[0]), V(bx[1], w / 2, bz[1]), V(bx[0], w / 2, bz[1])]), bootMat));

  // ---------- state + panel ----------
  let time = 0, dir = 0, demo = !ctx.reducedMotion, wait = 1.5;
  const names = { latch: t("Unlatch"), "lid-open": t("Boot lid up"), fold: t("Roof folds back"), "lid-close": t("Boot lid down") };
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { buttons: [{ id: "open", label: t("Open the roof"), pressed: false, onClick: () => { stopDemo(); go(1); } }, { id: "close", label: t("Close the roof"), pressed: false, onClick: () => { stopDemo(); go(-1); } }] },
    { cells: { id: "phase", labels: PHASES.map(k => names[k]) } },
    { meter: { id: "progress" } },
    { readouts: [{ id: "time", label: t("Elapsed"), unit: t("s of {0}", T) }, { id: "rear", label: t("Rear section turned"), unit: t("deg") }, { id: "fold", label: t("Roof folded on it"), unit: t("deg") }, { id: "lid", label: t("Boot lid open"), unit: t("deg") }] },
    { buttons: [{ id: "auto", toggle: [t("Demo on"), t("Demo off")], pressed: demo, onClick: v => (demo = v) }] },
    { text: t("The maker quotes about {0} s; pivot positions and the order of the movements are simplified.", p.quoted) },
  ] }, { label: t("Parts"), items: [{ legend: [["--l1", t("Roof panel")], ["--l2", t("Rear-window section")], ["--l4", t("Boot lid")], ["--fg", t("Pivots")], ["--muted", t("Boot space it stows in")]] }] }]);
  function stopDemo() { if (demo) { demo = false; ui.toggle("auto").set(false); } }
  function go(d) { dir = d; ui.toggle("open").set(d > 0); ui.toggle("close").set(d < 0); }

  return {
    layout({ active }) { group.visible = active; },
    update(dt) {
      if (demo && (dir === 0 || (dir > 0 && time >= T) || (dir < 0 && time <= 0))) { wait -= dt; if (wait <= 0) { go(time >= T ? -1 : 1); wait = 2; } }
      time = Math.max(0, Math.min(T, time + dir * dt));
      const s = roofAt(p.roof, time);
      span(roof, s.A, s.J); span(rearWin, s.J, s.D); span(lid, s.lidFront, p.roof.lid.hinge);
      joint.position.set(m(s.J[0]), w / 2 + 0.03, m(s.J[1]));
      PHASES.forEach((k, i) => ui.cells("phase").set(i, s.phase === k ? "▶" : "", s.phase === k));
      ui.meter("progress").set(time / T, dir !== 0 && time > 0 && time < T);
      const D = 180 / Math.PI;
      ui.set("time", time.toFixed(1)); ui.set("rear", (s.phi * D).toFixed(0)); ui.set("fold", (Math.abs(s.psi) * D).toFixed(0)); ui.set("lid", (s.lid * D).toFixed(0));
      const st = s.phase === "up" ? t("Closed: a coupé") : s.phase === "down" ? t("Open: a roadster, the roof in the boot") : dir > 0 ? t("Opening") : t("Closing");
      ui.badge("state").set(st, s.phase !== "up" && s.phase !== "down");
    },
  };
}
