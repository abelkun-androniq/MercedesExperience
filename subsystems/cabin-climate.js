// Coach air conditioning (O 302 team coach): the heat balance of the passenger saloon on a sunny day (lib/model/climate.js),
// in time-lapse. Passengers, the sun through the glass and the warm outside air heat the cabin; the roof unit blows cooled
// air down the length of the coach and takes out up to its capacity. The saloon is tinted from cool to hot.
// Params (mm, ground at z = 0): label, cabin (lib/model/climate.js: capacity, ua, sun, person, cooling, set), saloon { x0,
// x1, y, z0, z1 } (the box the passengers sit in), unit [x0, x1] (roof unit's length), seats (rows of four, front to
// back), passengers { min, max, value }, outside { min, max, value } (°C), lapse (model seconds per real second).
import * as THREE from "three";
import { V, ball, particles } from "../lib/scene/helpers.js";
import { createCabin, steadyTemp } from "../lib/model/climate.js";

const AIR = 160;   // cooled-air particles

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, s = p.saloon;
  const group = new THREE.Group(); carRoot.add(group);
  const [x0, x1, y, z0, z1] = [s.x0, s.x1, s.y, s.z0, s.z1].map(m);
  const airMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.14, depthWrite: false });
  const box = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 2 * y, z1 - z0), airMat); box.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2); group.add(box);
  const unitMat = stage.tokenMat("--l1", { metalness: 0.3 });
  const [u0, u1] = p.unit.map(m);
  const unit = new THREE.Mesh(new THREE.BoxGeometry(u1 - u0, 1.2, 0.18), unitMat); unit.position.set((u0 + u1) / 2, 0, z1 + 0.12); group.add(unit);

  // Passengers: a head per seat, shown as the slider fills the coach from the front.
  const headMat = stage.tokenMat("--accent"), pitch = (x1 - x0 - 0.4) / p.seats;
  const heads = [];
  for (let r = 0; r < p.seats; r++) for (const yy of [0.75, 0.3, -0.3, -0.75]) { const b = ball(headMat, 0.09, V(x1 - 0.3 - r * pitch, yy * y, z0 + 1.15)); group.add(b); heads.push(b); }

  // Cooled air: falls from the unit's outlets along the coach and drifts down over the seats.
  const air = particles(AIR, 0.05); group.add(air.pts);
  const seeds = Array.from({ length: AIR }, () => ({ x: x0 + 0.2 + Math.random() * (x1 - x0 - 0.4), y: (Math.random() * 2 - 1) * y * 0.8, s: Math.random() }));

  // ---------- state + panel ----------
  const P = p.passengers, O = p.outside;
  let n = P.value, outside = O.value, ac = true, clock = 0;
  const cab = createCabin(p.cabin, outside);
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { buttons: [{ id: "ac", toggle: [t("Air conditioning on"), t("Air conditioning off")], pressed: true, onClick: v => (ac = v) }] },
    { slider: { id: "n", label: t("Passengers"), min: P.min, max: P.max, step: 1, value: n, onInput: v => (n = v) } },
    { slider: { id: "out", label: t("Outside air, °C"), min: O.min, max: O.max, step: 1, value: outside, onInput: v => (outside = v) } },
    { readouts: [{ id: "T", label: t("Cabin"), unit: t("°C") }, { id: "people", label: t("From the passengers"), unit: t("kW") },
      { id: "sun", label: t("Sun through the glass"), unit: t("kW") }, { id: "body", label: t("Through the body"), unit: t("kW") },
      { id: "cool", label: t("Taken out by the unit"), unit: t("kW") }, { id: "noac", label: t("Without it, settles at"), unit: t("°C") }] },
    { trace: { id: "trace", series: [{ token: "--accent", min: 15, max: 55 }, { token: "--l1", min: 15, max: 55 }], span: 8, top: t("{0} °C", 55), bottom: t("{0} °C", 15), aria: t("Cabin and outside temperature over time") } },
    { key: [["--accent", t("cabin")], ["--l1", t("outside")]] },
    { text: t("Time-lapse: one second here is {0} minutes. One lump of air and seats: an illustration of the heat balance, not a measurement.", p.lapse / 60) },
  ] }, { label: t("Parts"), items: [{ legend: [["--l1", t("Roof air-conditioning unit")], ["--accent", t("Passengers, about 100 W each")]] }] }]);

  const cool = new THREE.Color(), hot = new THREE.Color(), c = new THREE.Color(), q = V(0, 0, 0);
  return {
    layout({ active, onPhoto }) { group.visible = active; air.pts.visible = !onPhoto; },
    update(dt) {
      clock += dt;
      const h = Math.min(dt, 0.1) * p.lapse;
      for (let k = 0; k < 20; k++) cab.step(h / 20, { n, outside, ac });
      heads.forEach((b, i) => (b.visible = i < n));
      // Tint: blue-ish at 18 °C, the accent at 45 °C.
      const f = Math.max(0, Math.min(1, (cab.T - 18) / 27));
      airMat.color.copy(cool.copy(stage.color("--l1"))).lerp(hot.copy(stage.color("--accent")), f);
      const cAir = stage.color("--l1");
      seeds.forEach((sd, i) => {
        const u = ac ? (sd.s + clock * 0.35) % 1 : sd.s;
        q.set(sd.x, sd.y, z1 - u * (z1 - z0 - 0.3));
        air.set(i, q, c.copy(cAir).multiplyScalar(ac ? 1 - 0.6 * u : 0));
      });
      air.pts.material.opacity = ac ? 0.9 : 0;
      air.flush();
      const c0 = p.cabin;
      ui.set("T", cab.T.toFixed(1)); ui.set("people", (n * c0.person / 1000).toFixed(1)); ui.set("sun", (c0.sun / 1000).toFixed(1));
      ui.set("body", (c0.ua * (outside - cab.T) / 1000).toFixed(1)); ui.set("cool", (cab.cooling / 1000).toFixed(1));
      ui.set("noac", steadyTemp(c0, n, outside).toFixed(0));
      ui.trace("trace").push(clock, [cab.T, outside]); ui.trace("trace").draw(clock);
      const full = ac && cab.cooling >= c0.cooling - 1;
      ui.badge("state").set(!ac ? t("Unit off: the saloon heats up") : full ? t("Unit at full capacity") : t("Holding {0} °C", c0.set), ac && !full);
    },
  };
}
