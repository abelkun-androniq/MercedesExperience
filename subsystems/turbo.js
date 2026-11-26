// Exhaust turbochargers on a V8 (Sauber-Mercedes C 9), one per bank (lib/model/turbo.js). Exhaust gas leaves each bank,
// spins a turbine and goes out of the tail; the turbine's shaft turns a compressor that squeezes fresh air, which an
// intercooler cools before it enters the engine. More boost: more air in each cylinder, more fuel can burn, more power,
// and a faster, harder-working turbo shaft. The race setting keeps boost down to save fuel; qualifying turns it up.
// Params (mm, ground at z = 0): label, engine { x, z, l, w, h } (block centre and size), turbo { x, y, z } (left unit;
// mirrored), cooler { x, y, z } (left; mirrored), tail [x, z] (exhaust exit), intake [x, y, z] (left air inlet; mirrored),
// model (lib/model/turbo.js p), presets [{ id, label, boost (bar) }], boostMax (bar).
import * as THREE from "three";
import { V, rod, place, pipe, polyline, at, particles } from "../lib/scene/helpers.js";
import { boosted } from "../lib/model/turbo.js";

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, E = p.engine;
  const group = new THREE.Group(); carRoot.add(group);
  const blockMat = stage.tokenMat("--metal", { transparent: true, opacity: 0.5 }), hotMat = stage.tokenMat("--l1", { metalness: 0.3 });
  const coldMat = stage.tokenMat("--l4", { metalness: 0.3 }), shaftMat = stage.tokenMat("--l2", { metalness: 0.5 }), coolMat = stage.tokenMat("--l3", { transparent: true, opacity: 0.6 });
  const block = new THREE.Mesh(new THREE.BoxGeometry(m(E.l), m(E.w), m(E.h)), blockMat); block.position.set(m(E.x), 0, m(E.z)); group.add(block);

  // Per side: exhaust from the bank to the turbine, turbine → tail; inlet → compressor → intercooler → plenum.
  const units = [1, -1].map(s => {
    const T = V(m(p.turbo.x), s * m(p.turbo.y), m(p.turbo.z)), Cc = T.clone().add(V(0, -s * 0.16, 0));   // turbine outboard, compressor inboard
    const turbine = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.035, 12, 24), hotMat); turbine.position.copy(T); turbine.rotation.x = Math.PI / 2; group.add(turbine);
    const comp = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.03, 12, 24), coldMat); comp.position.copy(Cc); comp.rotation.x = Math.PI / 2; group.add(comp);
    const shaft = new THREE.Group(); shaft.position.copy(T.clone().lerp(Cc, 0.5)); group.add(shaft);
    shaft.add(place(rod(shaftMat, 0.01), V(0, 0.1, 0), V(0, -0.1, 0)));
    for (const [y, r] of [[0.08 * s, 0.05], [-0.08 * s, 0.045]]) for (let k = 0; k < 6; k++) {   // turbine and compressor wheels' blades
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.02, r), shaftMat); b.geometry.translate(0, 0, r / 2); b.position.y = y; b.rotation.y = k / 6 * Math.PI * 2; shaft.add(b);
    }
    const bank = V(m(E.x), s * m(E.w) / 2, m(E.z) + m(E.h) * 0.2), C = V(m(p.cooler.x), s * m(p.cooler.y), m(p.cooler.z)), plenum = V(m(E.x), 0, m(E.z) + m(E.h) / 2 + 0.05);
    const cooler = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.22), coolMat); cooler.position.copy(C); group.add(cooler);
    const exhaust = [bank, V(m(E.x) - m(E.l) / 2, s * (m(E.w) / 2 + 0.05), m(E.z)), T.clone().add(V(0.05, 0, 0)), T, T.clone().add(V(-0.12, 0, -0.05)), V(m(p.tail[0]), s * 0.25, m(p.tail[1]))];
    const side = s * (m(E.w) / 2 + 0.25), behind = m(E.x) - m(E.l) / 2 - 0.1;   // ducts run outboard of the block
    const air = [V(m(p.intake[0]), s * m(p.intake[1]), m(p.intake[2])), V(behind, side, m(p.intake[2]) - 0.08), Cc.clone().add(V(0.08, 0, 0.06)), Cc,
      Cc.clone().add(V(0, 0, 0.16)), V(behind + 0.3, side, plenum.z), C, V(C.x, s * 0.3, plenum.z + 0.08), plenum];
    group.add(pipe(exhaust, 0.02, hotMat), pipe(air, 0.022, coldMat));
    return { shaft, ex: polyline(exhaust), air: polyline(air), s };
  });
  const NE = 40, NA = 40, gas = particles(NE * 2, 0.04), fresh = particles(NA * 2, 0.04); group.add(gas.pts, fresh.pts);

  // ---------- state + panel ----------
  let boost = p.presets[0].boost, shown = boost, spin = 0, clock = 0;
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { buttons: p.presets.map((st, i) => ({ id: st.id, label: st.label, pressed: i === 0, onClick: () => setBoost(st.boost) })) },
    { slider: { id: "boost", label: t("Boost (bar above the air outside)"), min: 0, max: p.boostMax, step: 0.1, value: boost, onInput: v => setBoost(v) } },
    { readouts: [{ id: "power", label: t("Engine power"), unit: t("kW") }, { id: "shaft", label: t("Turbine gives the compressor"), unit: t("kW per turbo") },
      { id: "rpm", label: t("Turbo shaft"), unit: t("thousand rpm") }, { id: "t2", label: t("Air after the compressor"), unit: t("°C") }, { id: "tc", label: t("After the intercooler"), unit: t("°C") }] },
    { text: { id: "how", value: "" } },
    { text: t("Race boost and power as published for 1989; the engine's efficiencies, the qualifying boost and the turbo's size are illustrative.") },
  ] }, { label: t("Parts"), items: [{ legend: [["--l1", t("Exhaust side: turbine")], ["--l4", t("Intake side: compressor")], ["--l2", t("Shared shaft")], ["--l3", t("Intercooler")]] }] }]);
  function setBoost(b) { boost = b; ui.slider("boost").set(b); p.presets.forEach(st => ui.toggle(st.id).set(Math.abs(st.boost - b) < 0.05)); }
  let said = "", on = false;
  const cHot = new THREE.Color(), cAir = new THREE.Color(), cWarm = new THREE.Color(), c = new THREE.Color(), q = V(0, 0, 0);

  return {
    layout({ active }) { if (active && !on) shown = 0; on = active; group.visible = active; },   // each visit starts off boost and spools up
    update(dt) {
      clock += dt; shown += (boost - shown) * Math.min(1, dt * 1.5);   // the turbo takes a moment to spool up or down
      const r = boosted(p.model, shown * 1e5);
      spin += dt * r.shaftRpm / 60 * 0.004 * Math.PI * 2;   // shown 250 times slower
      for (const u of units) u.shaft.rotation.y = spin * u.s;
      cHot.copy(stage.color("--l1")); cAir.copy(stage.color("--l4")); cWarm.copy(stage.color("--l2"));
      const speed = 0.15 + r.air * 0.25, f = Math.min(1, (r.t2 - p.model.t1) / 180);
      units.forEach((u, k) => {
        for (let i = 0; i < NE; i++) gas.set(k * NE + i, at(u.ex, (i / NE + clock * speed) % 1, q), cHot);
        for (let i = 0; i < NA; i++) { const s = (i / NA + clock * speed) % 1; fresh.set(k * NA + i, at(u.air, s, q), c.copy(cAir).lerp(cWarm, s > 0.35 && s < 0.6 ? f : s >= 0.6 ? f * (1 - p.model.cooler) : 0)); }
      });
      gas.flush(); fresh.flush();
      ui.set("power", (r.power / 1000).toFixed(0)); ui.set("shaft", (r.shaft / 2000).toFixed(0)); ui.set("rpm", (r.shaftRpm / 1000).toFixed(0));
      ui.set("t2", (r.t2 - 273.15).toFixed(0)); ui.set("tc", (r.tc - 273.15).toFixed(0));
      const s = shown < 0.05 ? t("No boost: the engine breathes only as much air as the outside pressure pushes in.")
        : t("The exhaust spins each turbine; the same shaft spins its compressor, which packs {0} times as much air into each cylinder as the engine would draw by itself, so it can burn that much more fuel.", (r.air / boosted(p.model, 0).air).toFixed(1));
      if (s !== said) { ui.set("how", s); said = s; }
      ui.badge("state").set(Math.abs(shown - boost) > 0.05 ? t("Turbo spooling") : t("{0} bar boost", shown.toFixed(1)), Math.abs(shown - boost) > 0.05);
    },
  };
}
