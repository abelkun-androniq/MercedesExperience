// Rolling over sideways, and the safety device a tilt sensor fires on the way (lib/model/rollover.js), slowed down.
// The car's cross-section rolls on its own outline: first about the outer tyres, past the tip angle onto its side, then
// onto the roof, or the raised roll bar. device "bar" (R 129 SL): a spring-loaded hoop behind the seats swings up once the
// sensor lets it go and holds the car off the occupants' heads. device "bolts" (SLS gullwing): the doors open upwards,
// which is against the road once the car is on its roof, so a charge in each door hinge fires and the doors can be
// pushed out from inside.
// Params (mm, ground at z = 0): label, device, car { halfTrack, cgHeight, gyration } (m), kick (× the rate that just tips
// it), trigger (deg: the sensor fires), slow (× slower than real), section [[y, z]] (outline of the cross-section, left
// side: mirrored), heads [y, z] (occupants' head tops, left seat: mirrored), bar? { x (pivot), z, y (half-width), length,
// torque, rate, inertia, travel (rad), quoted (s, the maker's figure) }, doors? { x0, x1, hinge [y, z], sill [y, z] }.
import * as THREE from "three";
import { V, rod, place, ball } from "../lib/scene/helpers.js";
import { createRoll, tipAngle, tipRate, barAngle, barTime } from "../lib/model/rollover.js";

const DT = 1e-3, WAIT = 0.8, REST = 2.6, D = Math.PI / 180;   // model step, s still before the kerb, s resting after

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000;
  const group = new THREE.Group(); carRoot.add(group);
  const world = new THREE.Group(); stage.scene.add(world);   // ground and contact marker stay put while the car rolls
  const deviceMat = stage.tokenMat("--l1", { metalness: 0.4 }), headMat = stage.tokenMat("--accent"), boltMat = stage.tokenMat("--l4");
  const groundMat = stage.tokenMat("--muted", { transparent: true, opacity: 0.25 });
  const ground = new THREE.Mesh(new THREE.BoxGeometry(6, 8, 0.01), groundMat); ground.position.z = -0.005; world.add(ground);
  const pivot = ball(stage.tokenMat("--fg"), 0.03, V(0, 0, 0)); world.add(pivot);

  // Outline points (both sides), the heads and the device's top, all in the car's y-z section.
  const mirror = pts => [...pts, ...pts.map(([y, z]) => [-y, z])];
  const hull = mirror(p.section).map(([y, z]) => [m(y), m(z)]), heads = mirror([p.heads]).map(([y, z]) => [m(y), m(z)]);
  heads.forEach(([y, z]) => group.add(ball(headMat, 0.06, V(m(p.bar?.x ?? (p.doors.x0 + p.doors.x1) / 2), y, z))));

  // Roll bar: two posts and a top tube, pivoted at its base, lying back when stowed.
  let barGroup = null, barLen = 0;
  if (p.device === "bar") {
    const b = p.bar; barLen = m(b.length);
    barGroup = new THREE.Group(); barGroup.position.set(m(b.x), 0, m(b.z)); group.add(barGroup);
    const w = m(b.y);
    for (const s of [1, -1]) barGroup.add(place(rod(deviceMat, 0.016), V(0, s * w, 0), V(0, s * w, barLen)));
    barGroup.add(place(rod(deviceMat, 0.016), V(0, w, barLen), V(0, -w, barLen)));
  }
  // Gullwing doors: a panel each from the roof hinge to the sill, with the hinge bolts.
  const doors = [];
  if (p.device === "bolts") {
    const d = p.doors, len = m(d.x1 - d.x0);
    for (const s of [1, -1]) {
      const [hy, hz] = d.hinge.map(m), [sy, sz] = d.sill.map(m), span = Math.hypot(sy - hy, sz - hz);
      const hinge = new THREE.Group(); hinge.position.set(m((d.x0 + d.x1) / 2), s * hy, hz); group.add(hinge);
      const panel = new THREE.Mesh(new THREE.BoxGeometry(len, 0.02, span), stage.tokenMat("--l2", { transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
      panel.position.set(0, s * (sy - hy) / 2, (sz - hz) / 2); panel.rotation.x = Math.atan2(-s * (sy - hy), sz - hz);   // local z along hinge → sill
      const door = new THREE.Group(); door.add(panel); hinge.add(door);
      for (const k of [-0.35, 0.35]) hinge.add(ball(boltMat, 0.025, V(k * len, 0, 0)));
      doors.push({ door, s });
    }
  }

  // ---------- state + panel ----------
  let fitted = true, playing = !ctx.reducedMotion, clock = 0, roll = null, fired = null, contact = null, yShift = 0, restAt = null;
  const a0 = tipAngle(p.car);
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { buttons: [{ id: "fitted", toggle: [p.device === "bar" ? t("Roll bar fitted") : t("Hinge bolts fitted"), t("Without it")], pressed: true, onClick: v => { fitted = v; restart(); } },
      { id: "again", label: t("Replay"), onClick: () => restart() }, { id: "play", toggle: [t("Pause"), t("Play")], pressed: playing, onClick: v => (playing = v) }] },
    { readouts: [{ id: "angle", label: t("Roll angle"), unit: t("deg") }, { id: "rate", label: t("Roll rate"), unit: t("deg/s") },
      { id: "tip", label: t("Tips over past"), unit: t("deg"), value: (a0 / D).toFixed(0) }, { id: "sensor", label: t("Sensor fires at"), unit: t("deg"), value: String(p.trigger) },
      ...(p.device === "bar" ? [{ id: "bar", label: t("Bar fully up after"), unit: t("s (maker: {0} s)", p.quoted), value: barTime(p.bar).toFixed(2) }] : []),
      { id: "gap", label: t("Space above the heads"), unit: t("mm, on the roof") }] },
    { text: t("Shown {0}× slower than real. A rigid outline rolling on flat ground after a kerb trip: an illustration, not a crash simulation.", p.slow) },
  ] }, { label: t("Parts"), items: [{ legend: [["--l1", p.device === "bar" ? t("Roll bar") : t("Gullwing doors")], ["--l4", p.device === "bar" ? t("Pivot and spring") : t("Hinge bolts")], ["--accent", t("Occupants' heads")], ["--fg", t("Point the car rolls on")]] }] }]);
  function restart() { clock = 0; roll = null; fired = null; contact = null; yShift = 0; restAt = null; }

  // Device pose: bar angle (0 = stowed) and how far the doors have come off their hinges.
  function device(since) {
    if (p.device === "bar") {
      const a = fitted && since != null ? barAngle(p.bar, since) : 0;
      barGroup.rotation.y = -(Math.PI / 2 - a);   // stowed: lying back along −x; up: vertical
      return [[m(p.bar.y), m(p.bar.z) + barLen * Math.sin(a)], [-m(p.bar.y), m(p.bar.z) + barLen * Math.sin(a)]];
    }
    const off = fitted && restAt != null ? Math.min(1, (clock - restAt) / 0.8) : 0;
    for (const d of doors) { d.door.position.y = d.s * 0.25 * off; d.door.rotation.x = d.s * 0.5 * off; }
    return [];
  }

  // Pose the car: roll θ about x, then lift so the lowest outline point touches the ground and slide sideways so the
  // point it rolls on does not skid.
  function pose(theta, extra) {
    const c = Math.cos(theta), s = Math.sin(theta), pts = [...hull, ...extra];
    const rot = ([y, z]) => [y * c - z * s, y * s + z * c];
    let low = 0;
    pts.forEach((q, i) => { if (rot(q)[1] < rot(pts[low])[1]) low = i; });
    const [ly, lz] = rot(pts[low]);
    if (contact && contact.i === low) yShift = contact.y - ly; else contact = { i: low, y: ly + yShift };
    carRoot.rotation.x = theta;
    carRoot.position.set(0, yShift, -lz);
    pivot.position.set(0, ly + yShift, 0);
    // Gap above the heads once the car rests on its roof: the lowest head above the ground.
    const headZ = Math.min(...heads.map(q => rot(q)[1])) - lz;
    return headZ;
  }

  return {
    layout({ active, onPhoto }) { group.visible = active; world.visible = active && !onPhoto; },
    update(dt, { onPhoto }) {
      if (onPhoto) { device(fitted ? 10 : null); return; }
      if (playing) clock += dt / p.slow;
      let theta = 0, rate = 0;
      if (clock > WAIT) {
        if (!roll) { roll = createRoll(p.car, tipRate(p.car) * p.kick); roll.clock = WAIT; }
        while (roll.clock < clock) { roll.step(DT); roll.clock += DT; if (fired == null && roll.theta > p.trigger * D) fired = roll.t; }
        theta = roll.theta; rate = roll.rate;
        if (theta >= Math.PI && restAt == null) restAt = clock;
        if (restAt != null && clock > restAt + REST) restart();
      }
      const extra = device(fired == null ? null : roll.t - fired);
      const gap = pose(theta, extra);
      ui.set("angle", (theta / D).toFixed(0)); ui.set("rate", (rate / D).toFixed(0));
      ui.set("gap", theta >= Math.PI ? (gap * 1000).toFixed(0) : "–");
      const st = fired == null ? (theta > 0 ? t("Rolling: sensor watching") : t("Driving")) : restAt == null ? (fitted ? t("Sensor fired") : t("Sensor fired: nothing fitted")) :
        p.device === "bar" ? (gap > 0.03 ? t("On the roof: the bar keeps a space") : t("On the roof: no space above the heads")) :
        (fitted ? t("On the roof: hinges released, doors push out") : t("On the roof: doors jammed shut"));
      ui.badge("state").set(st, fired != null && (fitted || restAt == null));
    },
  };
}
