// Braking hard on one wheel (front left), with and without ABS (lib/model/abs.js), slowed down. Without it the wheel locks
// at once and the tyre slides: a longer stop, and no steering. With it the brake is let off and on again several times a
// second, keeping the tyre turning just short of locking. The road runs past under the wheel; a locked tyre leaves a streak.
// Params (mm, ground at z = 0): label, wheel (lib/model/abs.js corner: mass, inertia, wheelR (m), torque, rise), abs
// { release, apply } (slip), speed (km/h at the start), surfaces [{ id: "dry" | "wet" | "snow", label }], at [x, y]
// (wheel centre in the car), slow (× slower than real).
import * as THREE from "three";
import { V, mat, rod, place, tyre } from "../lib/scene/helpers.js";
import { createStop, simulateStop } from "../lib/model/abs.js";

const SUB = 1e-4, MARK = 0.6, CRUISE = 1.0, HOLD = 1.8;   // s: model step; m between road marks; s before braking, after stopping

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, R = p.wheel.wheelR, [wx, wy] = p.at.map(m);
  const group = new THREE.Group(); carRoot.add(group);
  const tyreMat = mat(0x2a2d31, { roughness: 0.9, transparent: true }), rimMat = mat(0x9aa4ad, { metalness: 0.5, transparent: true });
  const caliperMat = stage.tokenMat("--metal"), discMat = stage.tokenMat("--metal", { metalness: 0.6 });
  const roadMat = stage.tokenMat("--muted", { transparent: true, opacity: 0.35 }), skidMat = stage.tokenMat("--fg", { transparent: true, opacity: 0.6 });

  // Wheel: tyre, rim with spokes (so the turning shows), disc and the caliper that clamps it.
  const wheel = new THREE.Group(); wheel.position.set(wx, wy, R); group.add(wheel);
  const spin = new THREE.Group(); wheel.add(spin);
  spin.add(tyre(tyreMat, R - 0.07, 0.07));
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; spin.add(place(rod(rimMat, 0.018), V(0, 0.04, 0), V((R - 0.12) * Math.cos(a), 0.04, (R - 0.12) * Math.sin(a)))); }
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.55, R * 0.55, 0.02, 32), discMat); disc.position.y = -0.03; wheel.add(disc);
  const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 0.11), caliperMat); caliper.position.set(-R * 0.4, -0.03, R * 0.25); wheel.add(caliper);

  // Road under the wheel: marks that stream backwards at the car's speed, and the skid streak a locked tyre lays down.
  const road = new THREE.Group(); group.add(road);
  const marks = Array.from({ length: 14 }, () => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.35, 0.004), roadMat); b.position.set(0, wy, 0.002); road.add(b); return b; });
  const skid = new THREE.Mesh(new THREE.BoxGeometry(1, 0.17, 0.003), skidMat); skid.position.set(0, wy, 0.005); group.add(skid);

  // ---------- state + panel ----------
  let absOn = true, surface = p.surfaces[0].id, playing = !ctx.reducedMotion, clock = 0, shown = 0, run = null, rolled = 0, skidFrom = null, results = {};
  const ui = ctx.panel([{ label: p.label, badge: { id: "steer", text: "" }, items: [
    { buttons: [{ id: "on", label: t("With ABS"), pressed: true, onClick: () => setAbs(true) }, { id: "off", label: t("Without ABS"), pressed: false, onClick: () => setAbs(false) }] },
    { buttons: p.surfaces.map((s, i) => ({ id: s.id, label: s.label, pressed: i === 0, onClick: () => setSurface(s.id) })) },
    { readouts: [{ id: "speed", label: t("Car speed"), unit: t("km/h") }, { id: "wheel", label: t("Tyre speed"), unit: t("km/h at the tread") },
      { id: "slip", label: t("Slip"), unit: t("% (100 = locked)") }, { id: "dist", label: t("Braking distance"), unit: t("m so far") },
      { id: "withAbs", label: t("Stop with ABS"), unit: t("m from {0} km/h", p.speed) }, { id: "without", label: t("Stop without"), unit: t("m, wheel locked") }] },
    { trace: { id: "trace", series: [{ token: "--accent", min: 0, max: p.speed }, { token: "--l1", min: 0, max: p.speed }], span: 6, top: t("{0} km/h", p.speed), bottom: t("0 km/h"), aria: t("Car speed and tyre speed while braking") } },
    { key: [["--accent", t("car")], ["--l1", t("tyre tread")]] },
    { buttons: [{ id: "play", toggle: [t("Pause"), t("Play")], pressed: playing, onClick: v => (playing = v) }, { id: "again", label: t("Replay"), onClick: () => restart() }] },
    { text: t("Shown {0}× slower than real. One wheel and a textbook tyre curve: an illustration, not a vehicle simulation.", p.slow) },
  ] }, { label: t("Parts"), items: [{ legend: [["--metal", t("Brake disc and caliper (lit while braking)")], ["--fg", t("Skid streak of a locked tyre")]] }] }]);
  function setAbs(on) { absOn = on; ui.toggle("on").set(on); ui.toggle("off").set(!on); restart(); }
  function setSurface(id) { surface = id; p.surfaces.forEach(s => ui.toggle(s.id).set(s.id === id)); score(); restart(); }
  function score() {
    for (const on of [true, false]) results[on] = simulateStop({ ...p.wheel, abs: { on, ...p.abs } }, surface, p.speed / 3.6, 2e-4);
    ui.set("withAbs", results[true].dist.toFixed(1)); ui.set("without", results[false].dist.toFixed(1));
  }
  function restart() { clock = 0; run = null; skidFrom = null; skid.visible = false; }
  score();

  const hot = new THREE.Color(), cold = new THREE.Color();
  function draw(v, w, slip, pressure, dist, onPhoto = false) {
    spin.rotation.y = rolled;
    caliperMat.color.copy(cold.copy(stage.color("--metal")).lerp(hot.copy(stage.color("--l1")), pressure));
    const off = -((dist / MARK) % 1) * MARK;
    marks.forEach((b, i) => (b.position.x = wx + off + (i - 6) * MARK));
    // The streak starts where the tyre locked and runs back with the road.
    if (slip > 0.9 && skidFrom == null) skidFrom = dist;
    const len = skidFrom == null ? 0 : Math.min(dist - skidFrom, 4);
    skid.visible = !onPhoto && len > 0.02; skid.scale.x = Math.max(len, 0.01); skid.position.x = wx - len / 2;
    ui.set("speed", (v * 3.6).toFixed(0)); ui.set("wheel", (w * R * 3.6).toFixed(0)); ui.set("slip", (slip * 100).toFixed(0)); ui.set("dist", dist.toFixed(1));
    const steers = slip < 0.3;
    ui.badge("steer").set(steers ? t("Tyre turning: the car still steers") : t("Wheel locked: no steering"), steers);
  }
  draw(p.speed / 3.6, p.speed / 3.6 / R, 0, 0, 0);

  return {
    layout({ active, onPhoto }) { group.visible = active; road.visible = !onPhoto; tyreMat.opacity = rimMat.opacity = onPhoto ? 0.15 : 1; },
    update(dt, { onPhoto }) {
      if (!playing) return;
      const h = dt / p.slow;
      clock += h; shown += dt;
      let v = p.speed / 3.6, w = v / R, slip = 0, pressure = 0, dist = 0;
      if (clock > CRUISE) {
        run ??= createStop({ ...p.wheel, abs: { on: absOn, ...p.abs } }, surface, p.speed / 3.6);
        for (let k = 0; k < Math.round(h / SUB); k++) run.step(SUB);
        ({ v, w, slip, pressure, dist } = run);
        if (run.done && clock > CRUISE + run.t + HOLD) restart();
      }
      rolled -= w * h;
      draw(v, w, slip, pressure, dist, onPhoto);
      ui.trace("trace").push(shown, [v * 3.6, w * R * 3.6]); ui.trace("trace").draw(shown);
    },
  };
}
