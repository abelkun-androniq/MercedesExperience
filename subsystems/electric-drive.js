// Four electric motors, one per wheel (SLS AMG Electric Drive), with the battery in the centre tunnel (lib/model/ev.js).
// mode "bend": the car circles at constant speed, seen from above. Shift drive force from the inner to the outer wheels
// (the total stays the same) and the yaw moment turns the car into the bend: the front wheels need less steering.
// Arrows: each wheel's forward (+) or braking (−) force. mode "energy": drive, cruise or brake, and watch power flow from
// the battery through the motors to the wheels, or back from the wheels into the battery until regeneration reaches its
// limit; beyond that the friction brakes take the rest (the discs light up).
// Params (mm, ground at z = 0): label, mode, wheelbase, halfTrack, wheelR, battery { x0, x1, w, h, z } (tunnel pack),
// car { m (kg), a, b (m: CG behind front / ahead of rear axle), cf, cr (N/rad), track (m), cda (m²), crr, drive, regen,
// regenMax (W) }, radius (m, bend), speed { min, max, value } (km/h), shiftMax (N per wheel).
import * as THREE from "three";
import { V, rod, place, tyre, pipe, polyline, at, particles } from "../lib/scene/helpers.js";
import { bend, energy } from "../lib/model/ev.js";

const D = 180 / Math.PI, SCALE = 0.0005;   // m of arrow per N

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, C = p.car, R = m(p.wheelR), wb = m(p.wheelbase), ht = m(p.halfTrack);
  const group = new THREE.Group(); carRoot.add(group);
  const tyreMat = stage.tokenMat("--fg", { roughness: 0.9, transparent: true }), motorMat = stage.tokenMat("--l4", { metalness: 0.4 });
  const battMat = stage.tokenMat("--l1", { transparent: true, opacity: 0.8 }), discMat = stage.tokenMat("--metal", { metalness: 0.5 }), hotMat = stage.tokenMat("--warn");
  const pushMat = stage.tokenMat("--l2"), brakeMat = stage.tokenMat("--l3"), pathMat = new THREE.LineDashedMaterial({ dashSize: 0.3, gapSize: 0.2, transparent: true, opacity: 0.8 });
  stage.bind(pathMat.color, "--muted");

  // Wheels (front pair steerable), a motor inboard of each, a brake disc, and per wheel a force arrow (shaft + head).
  const corners = [[0, 1], [0, -1], [-wb, 1], [-wb, -1]].map(([x, s]) => {
    const g = new THREE.Group(); g.position.set(x, s * ht, R); group.add(g);
    g.add(tyre(tyreMat, R - 0.09, 0.09));
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.6, R * 0.6, 0.03, 32), discMat); disc.position.y = -s * 0.1; g.add(disc);
    const motor = place(rod(motorMat, 0.1), V(x, s * (ht - 0.25), R), V(x, s * (ht - 0.55), R)); group.add(motor);
    const shaft = rod(pushMat, 0.025), head = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 16), pushMat); group.add(shaft, head);
    return { x, s, g, disc, shaft, head, motorAt: V(x, s * (ht - 0.4), R) };
  });
  const B = p.battery, batt = new THREE.Mesh(new THREE.BoxGeometry(m(B.x1 - B.x0), m(B.w), m(B.h)), battMat);
  batt.position.set(m(B.x0 + B.x1) / 2, 0, m(B.z)); group.add(batt);
  // Cables: battery ends to each motor.
  const routes = corners.map(c => {
    const from = V(c.x < -wb / 2 ? m(B.x0) : m(B.x1), 0, m(B.z));
    const pts = [from, V(c.x, 0, m(B.z)), c.motorAt.clone()];
    group.add(pipe(pts, 0.012, battMat)); return polyline(pts);
  });
  const N = 30, flow = particles(N * 4, 0.05); group.add(flow.pts);
  // The bend: an arc of the path of the car's centre of gravity, turning left about (−a, radius).
  const arcPts = Array.from({ length: 61 }, (_, i) => { const q = (i / 60 - 0.5) * 0.5; return V(-C.a + p.radius * Math.sin(q), p.radius * (1 - Math.cos(q)), 0.02); });
  const arc = new THREE.Line(new THREE.BufferGeometry().setFromPoints(arcPts), pathMat); arc.computeLineDistances(); group.add(arc);

  // ---------- state + panel ----------
  const bendMode = p.mode === "bend";
  let kmh = p.speed.value, shift = 0, acc = 0, steer = 0, phase = 0, demo = !ctx.reducedMotion, clock = 0;
  const DRIVES = [["go", t("Accelerate"), 3], ["cruise", t("Cruise"), 0], ["brake", t("Brake gently"), -3], ["stop", t("Brake hard"), -9]];
  const items = bendMode ? [
    { slider: { id: "shift", label: t("Drive moved from inner to outer wheels (N per wheel)"), min: -p.shiftMax / 2, max: p.shiftMax, step: 50, value: 0, onInput: v => { stopDemo(); shift = v; } } },
    { slider: { id: "speed", label: t("Speed round the bend (km/h)"), min: p.speed.min, max: p.speed.max, value: kmh, onInput: v => (kmh = v) } },
    { readouts: [{ id: "steer", label: t("Steering needed"), unit: t("deg at the front wheels") }, { id: "yaw", label: t("Turning moment from the motors"), unit: t("kN·m") },
      { id: "out", label: t("Each outer wheel"), unit: t("N forward") }, { id: "in", label: t("Each inner wheel"), unit: t("N forward") }] },
    { text: { id: "how", value: "" } },
  ] : [
    { buttons: DRIVES.map(([id, label, a], i) => ({ id, label, pressed: i === 0, onClick: () => { stopDemo(); setDrive(i); } })) },
    { slider: { id: "speed", label: t("Road speed (km/h)"), min: p.speed.min, max: p.speed.max, value: kmh, onInput: v => (kmh = v) } },
    { readouts: [{ id: "wheel", label: t("At the wheels"), unit: t("kW") }, { id: "batt", label: t("Battery"), unit: t("kW") }, { id: "fric", label: t("Friction brakes"), unit: t("kW of heat") }] },
    { text: { id: "how", value: "" } },
  ];
  items.push({ buttons: [{ id: "auto", toggle: [t("Demo on"), t("Demo off")], pressed: demo, onClick: v => (demo = v) }] });
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items }, { label: t("Parts"), items: [{ legend: [
    ["--l1", t("Battery in the centre tunnel, and its cables")], ["--l4", t("One motor per wheel")], ["--l2", t("Driving force at the tyre")], ["--l3", t("Braking force (the motor charging the battery)")], ["--warn", t("Friction brake disc, hot")]] }] }]);
  function stopDemo() { if (demo) { demo = false; ui.toggle("auto").set(false); } }
  let drive = 0; const setDrive = i => { drive = i; acc = DRIVES[i][2]; DRIVES.forEach(([id], k) => ui.toggle(id).set(k === i)); };
  if (!bendMode) setDrive(0);
  let said = "";
  const say = s => { if (s !== said) { ui.set("how", s); said = s; } };
  const arrow = (c, f) => {
    const len = Math.max(0.02, Math.abs(f) * SCALE), dir = Math.sign(f) || 1, base = V(c.x, c.s * (ht + 0.16), 0.08), tip = base.clone().add(V(dir * len, 0, 0));
    place(c.shaft, base, tip); c.head.position.copy(tip); c.head.rotation.set(0, 0, -dir * Math.PI / 2);
    c.shaft.material = c.head.material = f >= 0 ? pushMat : brakeMat;
  };
  const q = V(0, 0, 0), col = new THREE.Color();

  return {
    layout({ active, onPhoto }) { group.visible = active; tyreMat.opacity = onPhoto ? 0.15 : 1; arc.visible = bendMode && !onPhoto; flow.pts.visible = !bendMode; },
    update(dt) {
      clock += dt;
      const v = kmh / 3.6;
      if (bendMode) {
        if (demo) { phase += dt * 0.35; shift = Math.round(Math.max(0, Math.sin(phase)) * p.shiftMax / 50) * 50; ui.slider("shift").set(shift); }
        const r = bend(C, p.radius, v, shift), base = energy(C, v, 0).wheel / v / 4;   // each wheel's share of the force that holds the speed
        steer += (r.steer - steer) * Math.min(1, dt * 5);
        for (const c of corners) { c.g.rotation.z = c.x === 0 ? steer : 0; arrow(c, base + (c.s > 0 ? -1 : 1) * shift); c.disc.material = discMat; }
        ui.set("steer", (r.steer * D).toFixed(1)); ui.set("yaw", (r.Mz / 1000).toFixed(1));
        ui.set("out", (base + shift).toFixed(0)); ui.set("in", (base - shift).toFixed(0));
        say(shift > 0 ? t("The outer wheels push harder than the inner ones: that turns the car into the bend, so the front tyres need less steering and less grip to hold the line.")
          : shift < 0 ? t("More drive on the inner wheels turns the car out of the bend: it needs more steering.")
          : t("All four wheels drive equally. The front tyres alone turn the car, and this heavy, nose-light car needs a little more steering than the geometry of the bend."));
        ui.badge("state").set(t("Bend of {0} m, {1} g", p.radius, (r.ay / 9.81).toFixed(2)), shift > 0);
      } else {
        if (demo) { phase += dt; if (phase > 4) { phase = 0; setDrive((drive + 1) % DRIVES.length); } }
        const e = energy(C, v, acc), dir = e.battery >= 0 ? 1 : -1, hot = e.friction > 0;
        for (const c of corners) { arrow(c, e.wheel / v / 4 || 0); c.disc.material = hot ? hotMat : discMat; c.g.rotation.z = 0; }
        col.copy(stage.color(dir > 0 ? "--l2" : "--l3"));
        routes.forEach((pl, k) => { for (let i = 0; i < N; i++) { const s = ((i / N + dir * clock * Math.min(1, Math.abs(e.battery) / 1e5) * 0.6) % 1 + 1) % 1; flow.set(k * N + i, Math.abs(e.battery) < 500 ? q.set(0, 0, -5) : at(pl, s, q), col); } });
        flow.flush();
        ui.set("wheel", (e.wheel / 1000).toFixed(0)); ui.set("batt", (Math.abs(e.battery) / 1000).toFixed(0)); ui.set("fric", (e.friction / 1000).toFixed(0));
        say(e.battery > 0 ? t("Power flows from the battery through the four motors to the wheels; about one part in seven is lost on the way as heat.")
          : hot ? t("Braking hard: the motors charge the battery as fast as it can take, and the friction brakes turn the rest of the car's motion into heat.")
          : t("Braking: the wheels drive the motors, which work as generators and charge the battery. The friction brakes stay cold."));
        ui.badge("state").set(e.battery > 0 ? t("Battery discharging") : t("Battery charging"), e.battery < 0);
      }
    },
  };
}
