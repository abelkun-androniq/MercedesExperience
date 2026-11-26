// Engine cooling water and its radiator: the water warms in the engine, rises to the radiator, gives its heat to the air
// streaming through the core and comes back cooler. With too little radiator it reaches 100 °C and boils away: shown as
// litres lost per hour and per 100 km, the measure Daimler used. Time runs ×20 so a warm-up fits into a visit. Every type
// runs at once from the same start, so the trace compares their water temperatures on one clock; the stage shows the chosen
// one: air through the tubes of a tubular or honeycomb core (water around them), around the outside of a plain tank.
// Params (mm, ground at z = 0): label, heat (W into the water at full load), airT (°C), start? (°C, water at the start and
// on "Start again"; default airT), load? (% at the start; default 100), speed { min, max, value } (km/h),
// types [{ id, label, kind "tank" | "tubular" | "honeycomb", ua (W/K), still, refSpeed (km/h), water (kg), fan? }],
// engine { x, z, l, w, h } (block centre and size), radiator { x, z, w, h, d } (core centre and size).
import * as THREE from "three";
import { V, pipe, polyline, at, particles } from "../lib/scene/helpers.js";
import { createCooling, perHundredKm } from "../lib/model/cooling.js";

const TIME = 20, LATENT = 2.26e6;

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000;
  const group = new THREE.Group(); carRoot.add(group);
  const E = p.engine, Rd = p.radiator, ex = m(E.x), ez = m(E.z), rx = m(Rd.x), rz = m(Rd.z), rw = m(Rd.w), rh = m(Rd.h), rd = m(Rd.d);
  const glassM = () => new THREE.MeshStandardMaterial({ color: 0x8fa3b3, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide });
  const edgeM = new THREE.LineBasicMaterial({ color: 0x8fa3b3, transparent: true, opacity: 0.6 });
  const boxAt = (l, w, h, x, z, parent = group) => {
    const g = new THREE.BoxGeometry(l, w, h); g.translate(x, 0, z);
    parent.add(new THREE.Mesh(g, glassM()), new THREE.LineSegments(new THREE.EdgesGeometry(g), edgeM));
  };
  boxAt(m(E.l), m(E.w), m(E.h), ex, ez);

  // Radiator variants: a plain tank, Maybach's round-tube block, or the square-tube honeycomb (core face as a texture).
  const variants = new Map();
  for (const t of p.types) {
    const v = new THREE.Group(); group.add(v); variants.set(t.id, v);
    if (t.kind === "tank") { boxAt(rd * 1.6, rw, rh * 1.3, rx, rz + rh * 0.1, v); continue; }
    boxAt(rd, rw, rh, rx, rz, v); boxAt(rd * 1.3, rw * 1.05, 0.08, rx, rz + rh / 2 + 0.04, v); boxAt(rd * 1.3, rw * 1.05, 0.06, rx, rz - rh / 2 - 0.03, v);
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 256;
    const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace;
    stage.onTheme(() => {
      const g = canvas.getContext("2d"), n = t.kind === "honeycomb" ? 22 : 9, c = 256 / n;
      g.fillStyle = `#${stage.color("--metal").getHexString()}`; g.fillRect(0, 0, 256, 256);
      g.fillStyle = `#${stage.color("--stage").getHexString()}`;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        if (t.kind === "honeycomb") g.fillRect(i * c + 1.5, j * c + 1.5, c - 3, c - 3);
        else { g.beginPath(); g.arc((i + 0.5) * c, (j + 0.5) * c, c * 0.32, 0, 2 * Math.PI); g.fill(); }
      }
      tex.needsUpdate = true;
    });
    const face = new THREE.Mesh(new THREE.PlaneGeometry(rw, rh), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.85 }));
    face.rotation.set(Math.PI / 2, Math.PI / 2, 0); face.position.set(rx + rd / 2 + 0.002, 0, rz); v.add(face);
    if (t.fan) {
      const fan = new THREE.Group(); fan.position.set(rx - rd / 2 - 0.04, 0, rz); v.add(fan); v.userData.fan = fan;
      for (let k = 0; k < 4; k++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.05, rh * 0.38), stage.tokenMat("--metal")); b.rotation.x = k * Math.PI / 2; b.position.set(0, 0, 0); b.geometry.translate(0, 0, rh * 0.19); fan.add(b); }
    }
  }

  // Water loop: up through the engine, top hose, down through the core, bottom hose, back.
  const top = rz + rh / 2 + 0.04, bot = rz - rh / 2 - 0.03, eFront = ex + m(E.l) / 2;
  const hoseTop = [V(eFront - 0.05, 0, ez + m(E.h) / 2 - 0.03), V((eFront + rx) / 2, 0, top + 0.03), V(rx - rd / 2, 0, top)];
  const hoseBot = [V(rx - rd / 2, 0, bot), V((eFront + rx) / 2, 0, bot - 0.02), V(eFront - 0.05, 0, ez - m(E.h) / 2 + 0.05)];
  group.add(pipe(hoseTop, 0.018, stage.tokenMat("--l1")), pipe(hoseBot, 0.018, stage.tokenMat("--l4")));
  const loop = polyline([...hoseTop, V(rx, 0, top), V(rx, 0, bot), ...hoseBot, V(ex, 0, ez - m(E.h) / 2 + 0.05), V(ex, 0, ez + m(E.h) / 2 - 0.03), hoseTop[0]]);
  const coolFrom = (loop.segs.slice(0, 3).reduce((a, b) => a + b, 0)) / loop.tot, coolTo = (loop.segs.slice(0, 4).reduce((a, b) => a + b, 0)) / loop.tot;
  const NW = 90, NA = 160, NS = 40, water = particles(NW, 0.03), air = particles(NA, 0.022), steam = particles(NS, 0.04);
  group.add(water.pts, air.pts, steam.pts);
  // Air enters through the tube openings (the core face's 9 × 9 round holes); water drops through the core between them.
  const TUBES = 9, cellW = rw / TUBES, cellH = rh / TUBES, grid = (u, n) => (Math.floor(u * n) + 0.5) / n - 0.5;
  const seedA = Array.from({ length: NA }, () => [Math.random(), grid(Math.random(), TUBES) * rw, rz + grid(Math.random(), TUBES) * rh]);
  const seedW = Array.from({ length: NW }, () => [(Math.floor(Math.random() * (TUBES - 1)) + 1) / TUBES - 0.5, (Math.random() - 0.5) * 0.8]);
  // The tank (see the variants): air meeting its face divides and passes outside its walls.
  const tank = { x0: rx - rd * 0.8, x1: rx + rd * 0.8, hw: rw / 2, z0: rz + rh * 0.1 - rh * 0.65, z1: rz + rh * 0.1 + rh * 0.65 };
  const seedS = Array.from({ length: NS }, () => [Math.random(), (Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.06]);

  // ---------- state + panel ----------
  const START = p.start ?? p.airT, SERIES = "--accent --muted --l3".split(" ");
  let type = p.types[0], kmh = p.speed.value, load = (p.load ?? 100) / 100, phase = 0, rate = 0, clock = 0;
  const cools = new Map(p.types.map(k => [k.id, createCooling({ water: k.water, ua: k.ua, refSpeed: k.refSpeed / 3.6, still: k.still, airT: p.airT })]));
  const restart = () => { for (const c of cools.values()) { c.reset(); c.T = START; } };
  restart();
  const setType = t => { type = t; p.types.forEach(k => { ui.toggle(k.id).set(k === t); variants.get(k.id).visible = k === t; }); };
  const ui = ctx.panel([{ label: p.label, badge: { id: "boil", text: "" }, items: [
    { buttons: p.types.map((t, i) => ({ id: t.id, label: t.label, pressed: i === 0, onClick: () => setType(t) })) },
    { slider: { id: "speed", label: t("Road speed (km/h)"), min: p.speed.min, max: p.speed.max, value: kmh, onInput: v => (kmh = v) } },
    { slider: { id: "load", label: t("Engine load (%)"), min: 20, max: 100, step: 5, value: load * 100, onInput: v => (load = v / 100) } },
    { meter: { id: "temp" } },
    { readouts: [{ id: "T", label: t("Water"), unit: t("°C") }, { id: "in", label: t("Heat into water"), unit: t("kW") }, { id: "out", label: t("Radiator gives off"), unit: t("kW") },
      { id: "lh", label: t("Boiling away"), unit: t("litres per hour") }, { id: "l100", label: t("Water used"), unit: t("litres per 100 km") }] },
    { trace: { id: "cmp", series: p.types.map((k, i) => ({ token: SERIES[i], min: Math.min(START, 60) - 5, max: 102 })), span: 120, top: t("100 °C"), bottom: t("{0} °C", Math.min(START, 60) - 5), aria: t("Water temperature of each cooling system over time") } },
    { key: p.types.map((k, i) => [SERIES[i], k.label]) },
    { buttons: [{ id: "cold", label: START > p.airT ? t("Start again at {0} °C", START) : t("Cold start"), onClick: restart }] },
    { text: t("Time runs {0}× faster than real. Both systems run side by side; the trace shows two minutes of the visit.", TIME) },
    { key: [["--l1", t("hot water: around the tubes")], ["--l4", t("cooled water")], ["--muted", t("air: through the tubes, around a tank")], ["--metal", t("metal wall: the heat passes through it")], ["--fg", t("steam")]] },
  ] }]);
  setType(type);

  const cHot = new THREE.Color(), cCool = new THREE.Color(), cAir = new THREE.Color(), cWarm = new THREE.Color(), cSteam = new THREE.Color(), c = new THREE.Color(), q = V(0, 0, 0);
  return {
    layout({ active }) { group.visible = active; },
    update(dt) {
      const heat = p.heat * load, v = kmh / 3.6, cool = cools.get(type.id), T0 = cool.T;
      for (const c of cools.values()) c.step(heat, v, dt * TIME);
      clock += dt; const tr = ui.trace("cmp"); tr.push(clock, p.types.map(k => cools.get(k.id).T)); tr.draw(clock);
      rate = cool.boiling ? Math.max(0, heat - cool.q) / LATENT : 0;   // kg/s ≈ litres/s
      const f = (cool.T - p.airT) / (100 - p.airT), share = Math.min(1, cool.q / Math.max(heat, 1));
      ui.meter("temp").set(f, cool.boiling);
      ui.badge("boil").set(cool.boiling ? t("Boiling") : cool.T > T0 + 1e-6 ? t("Warming up") : cool.T < T0 - 1e-6 ? t("Cooling down") : t("Steady"), cool.boiling);
      ui.set("T", cool.T.toFixed(0)); ui.set("in", (heat / 1000).toFixed(1)); ui.set("out", (cool.q / 1000).toFixed(1));
      ui.set("lh", (rate * 3600).toFixed(1)); ui.set("l100", rate === 0 ? "0" : Number.isFinite(perHundredKm(rate, kmh)) ? perHundredKm(rate, kmh).toFixed(0) : t("standing"));

      // Particles.
      cHot.copy(stage.color("--l1")); cCool.copy(stage.color("--l4")); cAir.copy(stage.color("--muted")); cWarm.copy(stage.color("--l2")); cSteam.copy(stage.color("--fg"));
      phase = (phase + dt * 0.08) % 1;
      for (let i = 0; i < NW; i++) {
        const s = (i / NW + phase) % 1, through = s < coolFrom ? 0 : s > coolTo ? 1 : (s - coolFrom) / (coolTo - coolFrom);
        at(loop, s, q);
        if (through > 0 && through < 1 && type.kind !== "tank") q.set(rx + seedW[i][1] * rd, seedW[i][0] * rw, q.z);   // between the tubes
        water.set(i, q, c.copy(cCool).lerp(cHot, f * (1 - 0.8 * share * through)));
      }
      const airV = 0.15 + (v + (type.fan ? 4 : 0)) * 0.04;
      seedA.forEach((a, i) => {
        a[0] = (a[0] + dt * airV) % 1;
        const x = rx + 0.5 - a[0] * 1.1, behind = x < rx - rd / 2;
        let y = a[1];
        if (type.kind === "tank" && a[2] > tank.z0 && a[2] < tank.z1) {   // divides around the closed tank, then closes up behind it
          const d = x > tank.x1 ? x - tank.x1 : x < tank.x0 ? tank.x0 - x : 0, w = Math.max(0, 1 - d / 0.22), out = Math.sign(y || 1) * (tank.hw + 0.025 + Math.abs(y) * 0.25);
          y += (out - y) * w * w * (3 - 2 * w);
        }
        air.set(i, q.set(x, y, a[2]), c.copy(cAir).lerp(cWarm, behind ? f * share : 0));
      });
      seedS.forEach((s, i) => {
        s[0] = (s[0] + dt * 0.5) % 1;
        steam.set(i, cool.boiling ? q.set(rx + s[1], s[2], top + 0.08 + s[0] * 0.5) : q.set(rx, 0, -10), cSteam);
      });
      water.flush(); air.flush(); steam.flush();
      const fan = variants.get(type.id).userData.fan; if (fan) fan.rotation.x += dt * 9;
    },
  };
}
