// A Formula 1 wheel change at one corner (lib/model/pitstop.js), slowed down: the car stops on its marks, the jacks lift
// it, the gun spins the centre nut off (the nut is held in the wheel and leaves with it), the old wheel slides off the hub's
// drive pegs, the new wheel with its own nut slides on, the gun tightens it, the jacks drop. "Gun at an angle" replays
// Monaco 2021: the gun cut away the nut's lugs and the wheel would not come off.
// Params (mm, ground at z = 0): label, wheel { x, y, R, w } (the corner shown: hub centre, tyre radius and width),
// lift (mm the jacks raise the car), roll (mm the car rolls in on its marks), speed (km/h, for the track lost while standing).
import * as THREE from "three";
import { V, rod, place, tyre } from "../lib/scene/helpers.js";
import { PHASES, total, at, lostTrack } from "../lib/model/pitstop.js";

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, W = p.wheel, x = m(W.x), y = m(W.y), R = m(W.R), w = m(W.w), z = R;
  const group = new THREE.Group(); carRoot.add(group);
  const SAY = {
    stop: t("The car stops on its marks: the crew stand where each wheel will be."),
    lift: t("Front and rear jacks lift the car until the tyres hang free."),
    undo: t("One pull of the trigger: the gun spins the centre nut off in about a quarter of a second. The nut is held in the wheel and comes away with it."),
    off: t("The old wheel slides off the hub. Pegs on the hub, not the nut, carry the drive and braking torque; the nut only holds the wheel on."),
    on: t("The new wheel, its own nut already in it, slides onto the same pegs."),
    tighten: t("The gun reverses by itself and spins the new nut home. A light on the gun tells the jack man this corner is done."),
    drop: t("Jacks down, light green: go."),
  };
  const NAME = { stop: t("On the marks"), lift: t("Jacks up"), undo: t("Nut off"), off: t("Old wheel off"), on: t("New wheel on"), tighten: t("Nut on"), drop: t("Jacks down") };
  const tyreMat = stage.tokenMat("--fg", { roughness: 0.9, transparent: true }), rimMat = stage.tokenMat("--metal", { metalness: 0.5, transparent: true });
  const newTyre = stage.tokenMat("--fg", { roughness: 0.9, transparent: true }), newRim = stage.tokenMat("--l1", { metalness: 0.3, transparent: true });
  const nutMat = stage.tokenMat("--l2", { metalness: 0.5 }), gunMat = stage.tokenMat("--l4", { metalness: 0.3 }), hubMat = stage.tokenMat("--l3", { metalness: 0.5 });

  // Hub: an axle stub with drive pegs, at the wheel's centre, pointing out (+y on the left side).
  const out = Math.sign(y) || 1, hub = new THREE.Group(); hub.position.set(x, y, z); group.add(hub);
  hub.add(place(rod(hubMat, 0.05), V(0, -out * 0.05, 0), V(0, out * 0.05, 0)));
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; hub.add(place(rod(hubMat, 0.008), V(0.07 * Math.cos(a), out * 0.03, 0.07 * Math.sin(a)), V(0.07 * Math.cos(a), out * 0.07, 0.07 * Math.sin(a)))); }
  // A wheel: tyre, rim disc and its captive nut (a hexagonal prism).
  const wheel = (tm, rm) => {
    const g = new THREE.Group(); g.add(tyre(tm, R - w / 2, w / 2));
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(R - w * 0.75, R - w * 0.75, w * 0.9, 32), rm); g.add(rim);
    const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.05, 6), nutMat); nut.position.y = out * (w / 2 + 0.03); g.add(nut);
    g.userData.nut = nut; group.add(g); return g;
  };
  const oldW = wheel(tyreMat, rimMat), newW = wheel(newTyre, newRim);
  // The gun: a body and a socket, held square to the nut (or tilted for Monaco).
  const gun = new THREE.Group(); group.add(gun);
  const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.08, 6, 1, true), gunMat); socket.position.y = out * 0.04; gun.add(socket);
  gun.add(place(rod(gunMat, 0.05), V(0, out * 0.08, 0), V(0, out * 0.32, 0)));
  gun.add(place(rod(gunMat, 0.022), V(0, out * 0.24, 0), V(0, out * 0.24, -0.2)));

  // ---------- state + panel ----------
  let clock = -0.6, slow = 6, stuck = false, hold = null, demo = true;
  const T = total(), steps = [0, ...PHASES.map((_, i) => PHASES.slice(0, i + 1).reduce((s, q) => s + q.dur, 0))];
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { buttons: [{ id: "play", label: t("Play the stop"), onClick: () => { clock = -0.6; hold = null; demo = true; } },
      { id: "step", label: t("Next step"), onClick: next }] },
    { slider: { id: "slow", label: t("Slow motion (times slower)"), min: 1, max: 12, value: slow, onInput: v => (slow = v) } },
    { readouts: [{ id: "clock", label: t("Time since the car stopped"), unit: t("s") }, { id: "phase", label: t("Now"), unit: "" },
      { id: "lost", label: t("Track other cars cover meanwhile"), unit: t("m at {0} km/h", p.speed) }] },
    { text: { id: "how", value: "" } },
    { buttons: [{ id: "angle", toggle: [t("Gun at an angle: on"), t("Gun at an angle: off")], pressed: false, onClick: v => { stuck = v; clock = -0.6; hold = null; demo = true; } }] },
    { text: t("Phase times are typical of a two-second stop, not this car's records.") },
  ] }, { label: t("Parts"), items: [{ legend: [["--l3", t("Hub and its drive pegs")], ["--l2", t("Centre nut, held in the wheel")], ["--l4", t("Wheel gun")], ["--metal", t("Old wheel")], ["--l1", t("New wheel")]] }] }]);
  function next() {   // pause at the start of the next phase
    demo = false; const now = Math.max(0, hold ?? clock), k = steps.findIndex(s => s > now + 1e-6);
    hold = clock = k < 0 ? 0 : Math.min(steps[k], stuck ? steps[3] : T);
  }
  let said = "", spinA = 0;
  const smooth = u => u * u * (3 - 2 * u);

  return {
    layout({ active, onPhoto }) { group.visible = active; for (const mt of [tyreMat, rimMat, newTyre, newRim]) mt.opacity = onPhoto ? 0.15 : 1; },
    update(dt, { onPhoto }) {
      if (hold == null) { clock += dt / slow; if (demo && clock > (stuck ? 4 : T + 1.2)) clock = -0.6; }
      const s = at(Math.max(0, clock), { stuck }), rolling = clock < 0 ? smooth(-clock / 0.6) : 0;
      if (!onPhoto) { carRoot.position.x += m(p.roll) * rolling; carRoot.position.z += m(p.lift) * s.lift; }
      // Old wheel: out along the axle, then set aside; new wheel: brought from ahead and out, onto the hub.
      oldW.position.set(x, y + out * (0.5 * s.oldOff + (s.oldOff >= 1 ? 0.4 : 0)), z);
      newW.position.set(x + 0.75 * s.newOff, y + out * 0.5 * s.newOff, z); newW.visible = clock > steps[2];
      for (const wh of [oldW, newW]) wh.userData.nut.position.y = out * (w / 2 + 0.03 + s.nut * 0.03);
      const onOld = ["stop", "lift", "undo", "off"].includes(s.id), target = onOld ? oldW : newW;
      const spin = (s.id === "undo" || s.id === "tighten") && s.u < 1 && !(stuck && s.nut >= 0.149);
      gun.visible = clock > 0;
      gun.position.copy(target.position); gun.position.y += target.userData.nut.position.y + out * (0.025 + (s.id === "drop" ? 0.3 * s.u : s.id === "stop" ? 0.3 * (1 - s.u) : 0));
      spinA += spin ? dt / slow * 40 : 0; gun.rotation.set(stuck ? 0.35 : 0, spinA, 0);
      if (spin) target.userData.nut.rotation.y = spinA * (s.id === "undo" ? -1 : 1);
      ui.set("clock", Math.max(0, clock).toFixed(2)); ui.set("phase", NAME[s.id]);
      ui.set("lost", lostTrack(Math.max(0, Math.min(clock, stuck ? 99 : T)), p.speed / 3.6).toFixed(0));
      const say = stuck && s.id === "undo" && clock > steps[2] + 0.1 ? t("Monaco 2021: the gun met the nut at an angle and cut away the lugs it grips. The nut could not be turned, and the wheel came off only at the factory, about 43 hours later.") : SAY[s.id];
      if (say !== said) { ui.set("how", say); said = say; }
      ui.badge("state").set(stuck && s.id === "undo" ? t("Nut stuck") : s.over ? t("Stop over: {0} s", T.toFixed(1)) : clock < 0 ? t("Arriving") : t("Car standing"), stuck || (clock >= 0 && !s.over));
    },
  };
}
