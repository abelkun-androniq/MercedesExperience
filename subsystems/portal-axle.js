// Portal axle (Unimog), seen from the front: the half-shafts run above the wheel centres and turn each hub through a pair
// of spur gears, so the axle tube and the differential ride higher by the gears' drop (lib/model/portal.js). Switch to a
// conventional axle, with the shafts on the wheel centres, and the differential hangs low enough to hit the rock. The demo
// switches between the two.
// Params (mm, ground at z = 0): label, x (axle position), halfTrack, axle (lib/model/portal.js in m: wheelR, tubeR, diffR,
// drop, ratio), tyreWidth, rock { min, max, value } (mm), wheelTorque (N·m per wheel, illustrative), quoted (mm, the
// ground clearance the sizes are chosen for).
import * as THREE from "three";
import { V, mat, rod, place, ball, gear, tyre } from "../lib/scene/helpers.js";
import { clearance, clearsRock, shaftTorque } from "../lib/model/portal.js";

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, A = p.axle, x = m(p.x), ht = m(p.halfTrack), R = A.wheelR;
  const group = new THREE.Group(); carRoot.add(group);
  const tyreMat = mat(0x2a2d31, { roughness: 0.9, transparent: true }), tubeMat = stage.tokenMat("--l2", { metalness: 0.3 });
  const gearMat = stage.tokenMat("--l1", { metalness: 0.4 }), shaftMat = stage.tokenMat("--metal", { metalness: 0.6 });
  const rockMat = stage.tokenMat("--muted"), hitMat = stage.tokenMat("--accent");

  // Wheels with their hub gear (on the wheel centre); the upper gear sits on the half-shaft, the drop above it.
  const wheels = [1, -1].map(s => {
    const g = new THREE.Group(); g.position.set(x, s * ht, R); group.add(g);
    const w = new THREE.Group(); g.add(w);
    w.add(tyre(tyreMat, R - m(p.tyreWidth) / 2, m(p.tyreWidth) / 2));
    const zt = A.drop / (1 + A.ratio), low = gear(zt * A.ratio, 30, 0.04, gearMat), up = gear(zt, 13, 0.04, gearMat);
    const lowG = new THREE.Group(); lowG.rotation.z = Math.PI / 2; lowG.add(low); lowG.position.y = -s * 0.16; g.add(lowG);
    const upG = new THREE.Group(); upG.rotation.z = Math.PI / 2; upG.add(up); g.add(upG);
    return { s, g, w, low, up, upG };
  });
  // Axle tube, differential and half-shafts (shafts redrawn as the drop changes).
  const tube = rod(tubeMat, A.tubeR); group.add(tube);
  const diff = ball(tubeMat, 1, V(0, 0, 0)); group.add(diff);
  const shafts = [rod(shaftMat, 0.02), rod(shaftMat, 0.02)]; group.add(...shafts);
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 0), rockMat); group.add(rock);

  // ---------- state + panel ----------
  let portal = true, drop = A.drop, rockH = m(p.rock.value), turn = 0, demo = !ctx.reducedMotion, wait = 4;
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { buttons: [{ id: "portal", label: t("Portal axle"), pressed: true, onClick: () => { stopDemo(); set(true); } }, { id: "conv", label: t("Conventional axle"), pressed: false, onClick: () => { stopDemo(); set(false); } }] },
    { slider: { id: "rock", label: t("Rock under the axle, mm"), min: p.rock.min, max: p.rock.max, step: 10, value: p.rock.value, onInput: v => { stopDemo(); rockH = m(v); } } },
    { readouts: [{ id: "clear", label: t("Ground clearance"), unit: t("mm under the differential") }, { id: "drop", label: t("Shafts above the wheel centres"), unit: t("mm") },
      { id: "ratio", label: t("Hub gears"), unit: t("shaft turns per wheel turn") }, { id: "shaft", label: t("Torque in each half-shaft"), unit: t("N·m for {0} at the wheel", p.wheelTorque) }] },
    { buttons: [{ id: "auto", toggle: [t("Demo on"), t("Demo off")], pressed: demo, onClick: v => (demo = v) }] },
    { text: t("Sizes are illustrative, chosen for a ground clearance of about {0} mm.", p.quoted) },
  ] }, { label: t("Parts"), items: [{ legend: [["--l1", t("Portal gears in each hub")], ["--metal", t("Half-shafts")], ["--l2", t("Axle tube and differential")]] }] }]);
  function set(on) { portal = on; ui.toggle("portal").set(on); ui.toggle("conv").set(!on); }
  function stopDemo() { if (demo) { demo = false; ui.toggle("auto").set(false); } }

  return {
    layout({ active, onPhoto }) { group.visible = active; rock.visible = !onPhoto; tyreMat.opacity = onPhoto ? 0.15 : 1; },
    update(dt) {
      if (demo && (wait -= dt) <= 0) { set(!portal); wait = 4; }
      // Ease between the two layouts so the axle visibly rises or drops.
      const target = portal ? A.drop : 0;
      drop += (target - drop) * Math.min(1, dt * 4);
      const a = { ...A, drop, ratio: portal ? A.ratio : 1 }, zAxle = R + drop;
      place(tube, V(x, ht - 0.12, zAxle), V(x, -ht + 0.12, zAxle));
      diff.position.set(x, 0, zAxle); diff.scale.set(0.2, 0.17, A.diffR);
      shafts.forEach((sh, i) => place(sh, V(x, 0, zAxle), V(x, (i ? -1 : 1) * (ht - 0.1), zAxle)));
      const gearsOn = drop > 0.01;
      turn += dt * 1.2;
      for (const w of wheels) {
        w.upG.position.set(0, -w.s * 0.16, drop); w.upG.visible = gearsOn; w.low.parent.visible = gearsOn;
        w.w.rotation.y = turn; w.low.rotation.x = turn; w.up.rotation.x = -turn * (portal ? A.ratio : 1);
      }
      rock.scale.set(0.35, 0.3, rockH / 1.6); rock.position.set(x, 0, rockH * 0.38);
      const ok = clearsRock(a, rockH);
      rock.material = ok ? rockMat : hitMat;
      ui.set("clear", (clearance(a) * 1000).toFixed(0)); ui.set("drop", (drop * 1000).toFixed(0));
      ui.set("ratio", (portal ? A.ratio : 1).toFixed(2)); ui.set("shaft", shaftTorque({ ratio: portal ? A.ratio : 1 }, p.wheelTorque).toFixed(0));
      ui.badge("state").set(ok ? t("Clears the rock") : t("The differential hits the rock"), !ok);
    },
  };
}
