// A full-power run against the air: engine power against aerodynamic drag (½ρ·cd·A·v²: the power for it grows with v³)
// and rolling resistance. The chart plots power needed over speed for each body; where it meets the engine's power is the
// top speed. Wind streaks and two arrows (drag at the nose, drive at the wheels) show the forces during the run.
// Params (mm, ground at z = 0): label, shapes [{ id, label, cd, area (m²), mass (kg), crr, eta, ps, quoted? (km/h) }],
// power { min, max } (PS), vmax (km/h, chart), nose [x, z], wheel [x, z], wind { x0, x1, y, z0, z1 }, time (× real),
// ground? (z of the road, default 0, for cars whose origin is at axle height).
import * as THREE from "three";
import { V, particles } from "../lib/scene/helpers.js";
import { drag, rolling, powerNeeded, topSpeed, accelerate } from "../lib/model/aero.js";

const PS = 735.5, NS = "http://www.w3.org/2000/svg";

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000;
  const group = new THREE.Group(); carRoot.add(group);
  const W = p.wind, wx0 = m(W.x0), wx1 = m(W.x1);

  const arrow = token => {
    const g = new THREE.Group(), mt = stage.tokenMat(token);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 12), mt); shaft.rotation.z = Math.PI / 2; shaft.position.x = 0.5;
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 16), mt); head.rotation.z = -Math.PI / 2; head.position.x = 1.07;
    const body = new THREE.Group(); body.add(shaft); g.add(body, head); g.userData = { body, head }; group.add(g); return g;
  };
  const setArrow = (a, len) => { a.userData.body.scale.x = Math.max(len, 0.001); a.userData.head.position.x = len + 0.07; a.visible = len > 0.02; };
  const dragA = arrow("--l1"), driveA = arrow("--l3");
  dragA.position.set(m(p.nose[0]) + 0.05, 0, m(p.nose[1])); dragA.rotation.z = Math.PI;   // points backwards from the nose
  driveA.position.set(m(p.wheel[0]), 0, m(p.wheel[1]));

  const NA = 220, wind = particles(NA, 0.022); group.add(wind.pts);
  const seeds = Array.from({ length: NA }, () => [Math.random(), (Math.random() - 0.5) * 2 * m(W.y), m(W.z0) + Math.random() * (m(W.z1) - m(W.z0))]);
  const dashes = Array.from({ length: 10 }, (_, i) => {
    const d = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.004), stage.tokenMat("--muted")); d.position.set(0, -m(W.y) - 0.1, m(p.ground ?? 0) + 0.002); d.userData.s = i / 10; group.add(d); return d;
  });

  // ---------- state + panel ----------
  let shape = p.shapes[0], ps = shape.ps, v = 0, hold = 0, phase = 0;
  const q = V(0, 0, 0);
  const pmax = p.power.max * PS / 1000, X = kmh => 34 + kmh / p.vmax * 236, Yk = kw => 128 - kw / pmax * 116;
  const ui = ctx.panel([{ label: p.label, items: [
    ...(p.shapes.length > 1 ? [{ buttons: p.shapes.map((s, i) => ({ id: s.id, label: s.label, pressed: i === 0, onClick: () => setShape(s) })) }] : []),
    { slider: { id: "ps", label: t("Engine power (PS)"), min: p.power.min, max: p.power.max, step: 5, value: ps, onInput: x => { ps = x; drawChart(); } } },
    { readouts: [{ id: "v", label: t("Speed"), unit: t("km/h") }, { id: "drag", label: t("Air drag"), unit: t("N") }, { id: "dkw", label: t("Power into drag"), unit: t("kW") },
      { id: "rkw", label: t("Into rolling"), unit: t("kW") }, { id: "top", label: t("Model top speed"), unit: t("km/h") }, { id: "quoted", label: t("Quoted"), unit: t("km/h") }] },
    { svg: { id: "chart", viewBox: "0 0 280 150", aria: t("Power needed against speed, and the engine's power") } },
    { key: [["--accent", p.shapes.length > 1 ? t("power needed, this body") : t("power needed")], ...(p.shapes.length > 1 ? [["--muted", t("other body")]] : []), ["--l1", t("engine power")], ["--l2", t("now")]] },
    { buttons: [{ id: "again", label: t("Run again"), onClick: () => { v = 0; hold = 0; } }] },
  ] }, { label: t("Forces"), items: [{ legend: [["--l1", t("Air drag at the nose")], ["--l3", t("Drive force at the wheels")], ["--muted", t("Air streaming past")]] }] }]);
  function setShape(s) { shape = s; p.shapes.forEach(k => ui.toggle(k.id).set(k === s)); v = Math.min(v, topSpeed(s, ps * PS)); drawChart(); }

  const svg = ui.el("chart"), el = (tag, a, text) => { const e = document.createElementNS(NS, tag); for (const [k, x] of Object.entries(a)) e.setAttribute(k, x); if (text) e.textContent = text; svg.append(e); return e; };
  el("line", { x1: 34, y1: 128, x2: 272, y2: 128, stroke: "var(--rule)" }); el("line", { x1: 34, y1: 8, x2: 34, y2: 128, stroke: "var(--rule)" });
  for (let k = 0; k <= p.vmax; k += 50) el("text", { x: X(k), y: 142, "text-anchor": "middle", "font-size": 10, fill: "var(--muted)" }, String(k));
  el("text", { x: 272, y: 122, "text-anchor": "end", "font-size": 10, fill: "var(--muted)" }, t("km/h"));
  el("text", { x: 38, y: 16, "font-size": 10, fill: "var(--muted)" }, t("kW (max {0})", pmax.toFixed(0)));
  const curves = p.shapes.map(() => el("polyline", { fill: "none" }));
  const engine = el("line", { x1: 34, x2: 272, stroke: "var(--l1)", "stroke-width": 1.6 });
  const topDot = el("circle", { r: 4, fill: "var(--l1)" }), now = el("line", { y1: 8, y2: 128, stroke: "var(--l2)", "stroke-width": 1.4 });
  function drawChart() {
    p.shapes.forEach((s, i) => {
      const pts = []; for (let k = 0; k <= p.vmax; k += 5) { const kw = powerNeeded(s, k / 3.6) / 1000; if (kw > pmax * 1.05) break; pts.push(`${X(k).toFixed(1)},${Yk(kw).toFixed(1)}`); }
      const on = s === shape;
      curves[i].setAttribute("points", pts.join(" ")); curves[i].setAttribute("stroke", on ? "var(--accent)" : "var(--muted)");
      curves[i].setAttribute("stroke-width", on ? 2.2 : 1.2); curves[i].setAttribute("stroke-dasharray", on ? "" : "4 3");
    });
    const kw = ps * PS / 1000, top = topSpeed(shape, ps * PS) * 3.6;
    engine.setAttribute("y1", Yk(kw).toFixed(1)); engine.setAttribute("y2", Yk(kw).toFixed(1));
    topDot.setAttribute("cx", X(top).toFixed(1)); topDot.setAttribute("cy", Yk(kw).toFixed(1));
    ui.set("top", top.toFixed(0)); ui.set("quoted", shape.quoted ? String(shape.quoted) : "–");
  }
  drawChart();

  return {
    layout({ active, onPhoto }) { group.visible = active; for (const d of dashes) d.visible = !onPhoto; },   // no road in the museum
    update(dt) {
      const P = ps * PS, vt = topSpeed(shape, P);
      if (v >= 0.995 * vt) { hold += dt; if (hold > 3) { v = 0; hold = 0; } }
      else v = accelerate(shape, P, v, dt * p.time);
      const fd = drag(shape, v), fr = rolling(shape), maxF = drag(shape, vt) + fr;
      setArrow(dragA, 1.2 * fd / maxF); setArrow(driveA, 1.2 * Math.min(P * (shape.eta ?? 0.88) / Math.max(v, 0.5), 3 * maxF) / maxF);
      phase += dt * (0.3 + v * 0.06);
      const span = wx0 - wx1, col = stage.color("--muted");
      seeds.forEach((s, i) => wind.set(i, q.set(wx0 - ((s[0] * span + phase) % span), s[1], s[2]), col));
      wind.flush();
      for (const d of dashes) d.position.x = wx0 - ((d.userData.s * span + phase) % span);
      ui.set("v", (v * 3.6).toFixed(0)); ui.set("drag", fd.toFixed(0));
      ui.set("dkw", (fd * v / 1000).toFixed(0)); ui.set("rkw", (fr * v / 1000).toFixed(0));
      now.setAttribute("x1", X(v * 3.6).toFixed(1)); now.setAttribute("x2", X(v * 3.6).toFixed(1));
    },
  };
}
