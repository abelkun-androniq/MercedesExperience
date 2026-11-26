// Ice cooling for a record run (W 125 record car, 1938; lib/model/cooling.js createIceTank). The nose stays almost closed:
// no air through a radiator, so less drag. The engine's cooling water runs through a tank of ice instead; while ice is left
// the water comes back near 0 °C, once it has melted the water warms, and at 100 °C it boils away. Choose how long the run
// is and drive it.
// Params (mm, ground at z = 0): label, heat (W into the water at full power), kmh (run speed), ice, water (kg), time (how
// many times faster than real the run plays), run { min, max, value } (km), engine { x, z, l, w, h }, tank { x, z, l, w, h }.
import * as THREE from "three";
import { V, pipe, polyline, at, particles } from "../lib/scene/helpers.js";
import { createIceTank } from "../lib/model/cooling.js";

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, E = p.engine, K = p.tank;
  const group = new THREE.Group(); carRoot.add(group);
  const glassM = stage.tokenMat("--metal", { transparent: true, opacity: 0.25, depthWrite: false }), edgeM = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.6 });
  stage.bind(edgeM.color, "--muted");
  const box = b => { const g = new THREE.BoxGeometry(m(b.l), m(b.w), m(b.h)); g.translate(m(b.x), 0, m(b.z)); group.add(new THREE.Mesh(g, glassM), new THREE.LineSegments(new THREE.EdgesGeometry(g), edgeM)); };
  box(E); box(K);
  // Ice: cubes stacked in the tank, shown as many as there is ice left.
  const iceMat = stage.tokenMat("--accent", { transparent: true, opacity: 0.85 }), cubes = [], n = 24, c3 = 0.07;
  for (let i = 0; i < n; i++) {
    const cube = new THREE.Mesh(new THREE.BoxGeometry(c3, c3, c3), iceMat);
    cube.position.set(m(K.x) + ((i % 4) - 1.5) * c3 * 1.2, (((i >> 2) % 3) - 1) * c3 * 1.2, m(K.z - K.h / 2) + c3 * 0.6 + Math.floor(i / 12) * c3 * 1.1);
    cube.rotation.z = i * 0.7; group.add(cube); cubes.push(cube);
  }
  const top = m(E.z + E.h / 2) - 0.03, bot = m(E.z - E.h / 2) + 0.05, ef = m(E.x + E.l / 2), tb = m(K.x - K.l / 2);
  const hot = [V(ef - 0.05, 0, top), V((ef + tb) / 2, 0, top + 0.04), V(tb, 0, m(K.z + K.h / 2) - 0.05), V(m(K.x), 0, m(K.z))];
  const back = [V(m(K.x), 0, m(K.z)), V(tb, 0, m(K.z - K.h / 2) + 0.05), V((ef + tb) / 2, 0, bot - 0.03), V(ef - 0.05, 0, bot)];
  group.add(pipe(hot, 0.018, stage.tokenMat("--l1")), pipe(back, 0.018, stage.tokenMat("--l4")));
  const loop = polyline([...hot, ...back.slice(1), V(m(E.x), 0, bot), V(m(E.x), 0, top), hot[0]]);
  const NW = 70, water = particles(NW, 0.03), steam = particles(30, 0.04); group.add(water.pts, steam.pts);

  // ---------- state + panel ----------
  const tank = createIceTank({ ice: p.ice, water: p.water }), v = p.kmh / 3.6, L = tank.lasts(p.heat);
  let runKm = p.run.value, km = 0, clock = 0, driving = !ctx.reducedMotion, phase = 0;
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { slider: { id: "run", label: t("Length of the full-power run (km)"), min: p.run.min, max: p.run.max, value: runKm, onInput: v => { runKm = v; restart(); } } },
    { buttons: [{ id: "go", label: t("Drive the run"), onClick: restart }] },
    { meter: { id: "ice" } },
    { readouts: [{ id: "km", label: t("Distance"), unit: t("km") }, { id: "iceKg", label: t("Ice left"), unit: t("kg") }, { id: "T", label: t("Water"), unit: t("°C") }, { id: "boiled", label: t("Boiled away"), unit: t("kg") }] },
    { trace: { id: "tr", series: [{ token: "--accent", min: 0, max: p.ice }, { token: "--l1", min: 0, max: 100 }], span: Math.ceil(p.run.max * 1000 / v / p.time), top: t("100 °C / all the ice"), bottom: t("0 °C / no ice"), aria: t("Ice left and water temperature during the run") } },
    { key: [["--accent", t("ice left")], ["--l1", t("water temperature")]] },
    { text: { id: "how", value: "" } },
    { text: t("At {0} km/h the ice lasts about {1} km; the water boils after about {2} km. The run plays {3} times faster than real.", p.kmh, (L.ice * v / 1000).toFixed(1), (L.boil * v / 1000).toFixed(1), p.time) },
  ] }, { label: t("Parts"), items: [{ legend: [["--accent", t("Ice in the tank")], ["--l1", t("Hot water from the engine")], ["--l4", t("Water back to the engine")]] }] }]);
  function restart() { tank.reset(); km = 0; clock = 0; driving = true; }
  let said = "";
  const cHot = new THREE.Color(), cCold = new THREE.Color(), cSteam = new THREE.Color(), c = new THREE.Color(), q = V(0, 0, 0);

  return {
    layout({ active }) { group.visible = active; },
    update(dt) {
      if (driving) {
        const h = dt * p.time, left = (runKm - km) * 1000 / v, step = Math.min(h, Math.max(0, left));
        tank.step(p.heat, step); km += step * v / 1000; clock += dt;
        if (step < h) driving = false;
        const tr = ui.trace("tr"); tr.push(clock, [tank.ice, tank.T]); tr.draw(clock);
      }
      const f = tank.ice / p.ice;
      cubes.forEach((cube, i) => (cube.visible = i < Math.ceil(f * n)));
      ui.meter("ice").set(f, f === 0);
      ui.set("km", km.toFixed(1)); ui.set("iceKg", tank.ice.toFixed(1)); ui.set("T", tank.T.toFixed(0)); ui.set("boiled", tank.boiled.toFixed(1));
      cHot.copy(stage.color("--l1")); cCold.copy(stage.color("--l4")); cSteam.copy(stage.color("--fg"));
      phase = (phase + dt * (driving ? 0.3 : 0.05)) % 1;
      for (let i = 0; i < NW; i++) { const s = (i / NW + phase) % 1; water.set(i, at(loop, s, q), c.copy(cCold).lerp(cHot, s < 0.5 ? 1 : tank.T / 100)); }
      for (let i = 0; i < 30; i++) steam.set(i, tank.boiled > 0 && driving ? q.set(m(K.x) + (i % 5 - 2) * 0.03, 0, m(K.z + K.h / 2) + ((i / 30 + phase * 3) % 1) * 0.4) : q.set(0, 0, -5), cSteam);
      water.flush(); steam.flush();
      const s = tank.boiled > 0 ? t("The ice is gone and the water boils away: on a run this long the engine would overheat. A record car only needs a few kilometres at full power.")
        : tank.ice === 0 ? t("All the ice has melted. The water now warms up by itself, with nothing to carry the heat away.")
        : t("The engine's heat melts the ice: melting a kilogram of ice takes up nearly as much heat as warming a kilogram of water from freezing to boiling, and the water stays near 0 °C meanwhile.");
      if (s !== said) { ui.set("how", s); said = s; }
      ui.badge("state").set(tank.boiled > 0 ? t("Boiling") : tank.ice > 0 ? t("Ice melting") : t("Ice gone: water warming"), tank.ice === 0);
    },
  };
}
