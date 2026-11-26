// Hydrogen fuel cells driving an electric motor (NECAR 1, 1994), with the van body faded (lib/model/fuelcell.js).
// Hydrogen from the pressure tank and air from a compressor flow into the stacks; in each cell they combine into water,
// which runs out under the van, and drive a current to the motor. Raise the motor's demand and every flow grows with the
// current; the cells' voltage sags as they work harder, and the compressor takes its own share.
// Params (mm, ground at z = 0): label, stacks { x0, x1, y, z0, z1, n: [rows, columns] } (the cargo-area block), tank { x,
// z, r, l } (across the van), motor [x, z], intake [x, y, z], cell (lib/model/fuelcell.js p), demand { max, value } (kW).
import * as THREE from "three";
import { V, rod, place, pipe, polyline, at, particles } from "../lib/scene/helpers.js";
import { forMotor, peak } from "../lib/model/fuelcell.js";

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, S = p.stacks;
  const group = new THREE.Group(); carRoot.add(group);
  const stackMat = stage.tokenMat("--l3", { transparent: true, opacity: 0.75 }), tankMat = stage.tokenMat("--l1", { metalness: 0.4 });
  const motorMat = stage.tokenMat("--metal", { metalness: 0.5 }), wireMat = stage.tokenMat("--l2"), airMat = stage.tokenMat("--muted", { transparent: true, opacity: 0.6 });

  // The stacks: a grid of blocks filling the cargo area.
  const [rows, cols] = S.n, sx = m(S.x1 - S.x0) / cols, sz = m(S.z1 - S.z0) / rows, stacks = [];
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(sx * 0.85, m(S.y) * 2 * 0.9, sz * 0.8), stackMat);
    b.position.set(m(S.x0) + (j + 0.5) * sx, 0, m(S.z0) + (i + 0.5) * sz); group.add(b); stacks.push(b);
  }
  const tank = place(rod(tankMat, m(p.tank.r)), V(m(p.tank.x), -m(p.tank.l) / 2, m(p.tank.z)), V(m(p.tank.x), m(p.tank.l) / 2, m(p.tank.z))); group.add(tank);
  const motor = place(rod(motorMat, 0.13), V(m(p.motor[0]), -0.18, m(p.motor[1])), V(m(p.motor[0]), 0.18, m(p.motor[1]))); group.add(motor);
  const comp = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.18, 20), airMat); comp.position.set(m(S.x1) + 0.15, -m(S.y) * 0.6, m(S.z0) + 0.1); group.add(comp);

  const mid = V(m(S.x0 + S.x1) / 2, 0, m(S.z0 + S.z1) / 2), front = m(S.x1), back = m(S.x0), low = m(S.z0);
  const paths = {
    h2: [V(m(p.tank.x), 0, m(p.tank.z)), V(back, 0, m(p.tank.z)), V(back, 0, mid.z), mid.clone()],
    air: [V(m(p.intake[0]), m(p.intake[1]), m(p.intake[2])), comp.position.clone(), V(front, -m(S.y) * 0.6, mid.z), mid.clone()],
    water: [mid.clone(), V(mid.x, 0, low), V(mid.x - 0.3, 0, 0.25), V(mid.x - 0.4, 0, 0.02)],
    current: [V(front, m(S.y) * 0.5, m(S.z1)), V(front + 0.2, m(S.y) * 0.5, m(S.z1)), V(m(p.motor[0]) - 0.3, 0.3, m(p.motor[1]) + 0.3), V(m(p.motor[0]), 0.18, m(p.motor[1]))],
  };
  group.add(pipe(paths.h2, 0.015, tankMat), pipe(paths.air, 0.03, airMat), pipe(paths.current, 0.012, wireMat));
  const flows = Object.fromEntries(Object.entries(paths).map(([k, pts]) => { const pc = particles(40, k === "water" ? 0.035 : 0.045); group.add(pc.pts); return [k, { pl: polyline(pts), pc, s: 0 }]; }));
  const TOK = { h2: "--l1", air: "--muted", water: "--l4", current: "--l2" };

  // ---------- state + panel ----------
  const top = peak(p.cell), maxKw = Math.min(p.demand.max, Math.floor(top.motor / 1000));
  let kw = p.demand.value, demo = !ctx.reducedMotion, phase = 0, spin = 0;
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { slider: { id: "kw", label: t("Motor demand (kW)"), min: 0, max: maxKw, value: kw, onInput: v => { stopDemo(); kw = v; } } },
    { meter: { id: "load" } },
    { readouts: [{ id: "I", label: t("Current"), unit: t("A") }, { id: "V", label: t("Stack voltage"), unit: t("V") }, { id: "cell", label: t("Each cell"), unit: t("V") },
      { id: "stack", label: t("Stacks give"), unit: t("kW") }, { id: "aux", label: t("Compressor and pumps take"), unit: t("kW") },
      { id: "h2", label: t("Hydrogen used"), unit: t("g per minute") }, { id: "water", label: t("Water out"), unit: t("g per minute") }, { id: "eff", label: t("Hydrogen's energy reaching the wheels' motor shaft"), unit: "%" }] },
    { text: { id: "how", value: "" } },
    { buttons: [{ id: "auto", toggle: [t("Demo on"), t("Demo off")], pressed: demo, onClick: v => (demo = v) }] },
    { text: t("Twelve stacks, about 50 kW, as published; cell count, cell area and the voltage curve are illustrative.") },
  ] }, { label: t("Parts"), items: [{ legend: [["--l1", t("Hydrogen: tank and line")], ["--muted", t("Air: compressor and duct")], ["--l3", t("Fuel-cell stacks")], ["--l4", t("Water they give off")], ["--l2", t("Electric current to the motor")], ["--metal", t("Electric motor")]] }] }]);
  function stopDemo() { if (demo) { demo = false; ui.toggle("auto").set(false); } }
  let said = "";
  const c = new THREE.Color(), q = V(0, 0, 0);

  return {
    layout({ active }) { group.visible = active; },
    update(dt) {
      if (demo) { phase += dt * 0.3; kw = Math.round((0.5 - 0.5 * Math.cos(phase)) * maxKw); ui.slider("kw").set(kw); }
      const w = kw > 0 ? forMotor(p.cell, kw * 1000) : null;
      const rate = w ? w.j / top.j : 0;
      for (const [k, f] of Object.entries(flows)) {
        f.s += dt * (0.05 + 0.6 * rate); c.copy(stage.color(TOK[k]));
        for (let i = 0; i < 40; i++) f.pc.set(i, rate > 0 ? at(f.pl, (i / 40 + f.s) % 1, q) : q.set(0, 0, -5), c);
        f.pc.flush();
      }
      spin += dt * rate * 20; motor.rotation.y = spin;
      ui.meter("load").set(rate, rate > 0.85);
      ui.set("I", w ? w.I.toFixed(0) : "0"); ui.set("V", (w ? w.V : p.cell.e0 * p.cell.cells).toFixed(0)); ui.set("cell", (w ? w.V / p.cell.cells : p.cell.e0).toFixed(2));
      ui.set("stack", w ? (w.stack / 1000).toFixed(1) : "0"); ui.set("aux", w ? (w.aux / 1000).toFixed(1) : "0");
      ui.set("h2", w ? (w.h2 * 60e3).toFixed(0) : "0"); ui.set("water", w ? (w.water * 60e3).toFixed(0) : "0"); ui.set("eff", w ? (w.efficiency * 100).toFixed(0) : "–");
      const s = !w ? t("No demand: no current flows, so no hydrogen is used, and each cell holds about 1 volt.")
        : rate > 0.8 ? t("Near the stacks' limit: the cells' voltage has sagged so far that more current gives hardly more power, and the compressor takes a large share for itself.")
        : t("Every electron the motor uses was freed from hydrogen in a cell: more power needs more hydrogen, and more water comes out.");
      if (s !== said) { ui.set("how", s); said = s; }
      ui.badge("state").set(w ? t("Stacks working: {0} kW to the motor", kw) : t("Standing"), !!w);
    },
  };
}
