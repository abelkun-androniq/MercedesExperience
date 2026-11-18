// Tubular space frame under a twisting load: one front wheel is lifted, the rear is held, as when a car crosses a kerb at
// an angle. Tubes are coloured by force (tension, compression) and the bending is drawn hugely exaggerated. Compare the
// 300 SL frame, whose side trusses run deep through the door area (so the doors had to open upwards), with the same frame
// cut down to a low sill for ordinary doors.
// Params (mm, ground at z = 0): label, stations, bays (lib/model/truss.js; door: "high" marks the door bays), EA (N),
// load (N at the front-left corner), exaggerate (× displacement), modes { high, low } (button labels), compare? (label
// of the stiffness-ratio readout: "high" is the reference).
import * as THREE from "three";
import { V, rod, place, ball } from "../lib/scene/helpers.js";
import { tubeFrame, twistTest } from "../lib/model/truss.js";

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx;
  const group = new THREE.Group(); carRoot.add(group);
  const tens = stage.tokenMat("--l1"), comp = stage.tokenMat("--l4"), idle = stage.tokenMat("--metal");
  const solve = door => {
    const f = tubeFrame(p.stations, p.bays.map(b => (b.door ? { ...b, door } : b)), p.EA), r = twistTest(f, 0, p.stations.length - 1, p.load);
    const maxF = Math.max(...r.forces.map(Math.abs)), base = f.nodes.map(n => V(n[0] / 1000, n[1] / 1000, n[2] / 1000));
    const tubes = f.members.map((mb, i) => {
      const F = r.forces[i], t = rod(Math.abs(F) < 0.06 * maxF ? idle : F > 0 ? tens : comp, mb.tag.startsWith("door") ? 0.009 : 0.007);
      group.add(t); return { t, ends: mb.ends };
    });
    return { ...r, f, maxF, base, tubes };
  };
  const modes = { high: solve("high"), low: solve("low") };

  // Load arrow at the lifted corner, small balls where the frame is held.
  const nodeOf = (s, side, lv) => s * 6 + side * 3 + lv, last = p.stations.length - 1;
  const lift = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 16), stage.tokenMat("--l2")); lift.rotation.x = Math.PI / 2; group.add(lift);
  const liftRod = rod(stage.tokenMat("--l2"), 0.015); group.add(liftRod);
  const supports = [nodeOf(last, 0, 0), nodeOf(last, 1, 0), nodeOf(0, 1, 0)].map(n => { const b = ball(stage.tokenMat("--muted"), 0.035); group.add(b); return { b, n }; });

  let mode = "high", clock = 0, playing = !ctx.reducedMotion, f = 0.5;
  const ui = ctx.panel([{ label: p.label, items: [
    { buttons: [{ id: "high", label: p.modes.high, pressed: true, onClick: () => setMode("high") }, { id: "low", label: p.modes.low, pressed: false, onClick: () => setMode("low") }] },
    { readouts: [{ id: "rel", label: p.compare ?? t("Compared with the 300 SL frame"), unit: "%" }] },
    { text: t("Bending drawn {0}× larger than it is. Tube sizes and frame shape are simplified.", p.exaggerate) },
    { buttons: [{ id: "play", toggle: [t("Pause"), t("Play")], pressed: playing, onClick: v => (playing = v) }] },
    { readouts: [{ id: "load", label: t("Lift at the front wheel"), unit: t("N") }, { id: "twist", label: t("Frame twist"), unit: t("deg") },
      { id: "stiff", label: t("Twist stiffness"), unit: t("N·m per degree") }, { id: "maxF", label: t("Hardest-working tube"), unit: t("N") }], detail: true },
    { key: [["--l1", t("tube in tension")], ["--l4", t("in compression")], ["--metal", t("hardly loaded")], ["--l2", t("lift")], ["--muted", t("held")]], detail: true },
  ] }]);
  function setMode(md) { mode = md; ui.toggle("high").set(md === "high"); ui.toggle("low").set(md === "low"); }

  const q = V(0, 0, 0), a = V(0, 0, 0), b = V(0, 0, 0);
  const posOf = (s, n, out) => out.copy(s.base[n]).addScaledVector(q.set(...s.u[n]).multiplyScalar(1 / 1000), p.exaggerate * f);
  return {
    layout({ active }) { group.visible = active; },
    update(dt) {
      if (playing) { clock += dt; f = 0.5 - 0.5 * Math.cos(clock * 1.4); }
      for (const [k, s] of Object.entries(modes)) for (const tb of s.tubes) {
        tb.t.visible = k === mode;
        if (k === mode) place(tb.t, posOf(s, tb.ends[0], a), posOf(s, tb.ends[1], b).clone());
      }
      const s = modes[mode], corner = posOf(s, nodeOf(0, 0, 0), a);
      lift.position.copy(corner).add(q.set(0, 0, -0.12)); place(liftRod, corner.clone().add(q.set(0, 0, -0.42)), corner.clone().add(q.set(0, 0, -0.14)));
      for (const sp of supports) posOf(s, sp.n, sp.b.position).add(q.set(0, 0, -0.04));
      ui.set("load", (p.load * f).toFixed(0)); ui.set("twist", (s.twist * f).toFixed(3));
      ui.set("stiff", s.stiffness.toFixed(0)); ui.set("rel", (s.stiffness / modes.high.stiffness * 100).toFixed(0));
      ui.set("maxF", (s.maxF * f).toFixed(0));
    },
  };
}
