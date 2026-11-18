// A full-power run against the air: engine power against aerodynamic drag (½ρ·cd·A·v²: the power for it grows with v³)
// and rolling resistance. The chart plots power needed over speed for each body; where it meets the engine's power is the
// top speed. Two arrows (drag at the nose, drive at the wheels) show the forces during the run, and a 2-D lattice-Boltzmann
// wind tunnel on the centre plane shows the air itself (lib/scene/wind-tunnel.js).
// Params (mm, ground at z = 0): label, shapes [{ id, label, cd, area (m²), mass (kg), crr, eta, ps, quoted? (km/h), profile?
// (this body's centre-plane section for the flow; default flow.profile) }],
// power { min, max } (PS), vmax (km/h, chart; also the flow's reference speed), nose [x, z], wheel [x, z], time (× real),
// flow (see wind-tunnel.js), ground? (z of the road, default 0, for cars whose origin is at
// axle height).
import * as THREE from "three";
import { drag, rolling, powerNeeded, topSpeed, accelerate } from "../lib/model/aero.js";
import { createWindTunnel } from "../lib/scene/wind-tunnel.js";

const PS = 735.5, NS = "http://www.w3.org/2000/svg";

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000;
  const group = new THREE.Group(); carRoot.add(group);
  const F = p.flow, wx0 = m(F.x0), wx1 = m(F.show[0]);

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

  // One tunnel per distinct section; only the one for the chosen body is shown and runs.
  const tunnels = new Map();
  for (const s of p.shapes) { const pr = s.profile ?? F.profile; if (!tunnels.has(pr)) { const g = new THREE.Group(); group.add(g); tunnels.set(pr, { g, tun: createWindTunnel(stage, g, { ...F, profile: pr }, p.ground ?? 0) }); } }
  let tunnel = null;
  const showTunnel = s => { tunnel = tunnels.get(s.profile ?? F.profile).tun; for (const k of tunnels.values()) k.g.visible = k.tun === tunnel; };
  const dashes = Array.from({ length: 10 }, (_, i) => {
    const d = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.004), stage.tokenMat("--muted")); d.position.set(0, -1.1, m(p.ground ?? 0) + 0.002); d.userData.s = i / 10; group.add(d); return d;
  });

  // ---------- state + panel ----------
  let shape = p.shapes[0], ps = shape.ps, v = 0, hold = 0, phase = 0;
  showTunnel(shape);
  const pmax = p.power.max * PS / 1000, X = kmh => 34 + kmh / p.vmax * 236, Yk = kw => 128 - kw / pmax * 116;
  const ui = ctx.panel([{ label: p.label, items: [
    ...(p.shapes.length > 1 ? [{ buttons: p.shapes.map((s, i) => ({ id: s.id, label: s.label, pressed: i === 0, onClick: () => setShape(s) })) }] : []),
    { readouts: [{ id: "top", label: t("Model top speed"), unit: t("km/h") }, { id: "quoted", label: t("Quoted"), unit: t("km/h") }] },
    { buttons: [{ id: "again", label: t("Run again"), onClick: () => { v = 0; hold = 0; } }] },
    { slider: { id: "ps", label: t("Engine power (PS)"), min: p.power.min, max: p.power.max, step: 5, value: ps, onInput: x => { ps = x; drawChart(); } }, detail: true },
    { readouts: [{ id: "v", label: t("Speed"), unit: t("km/h") }, { id: "drag", label: t("Air drag"), unit: t("N") }, { id: "dkw", label: t("Power into drag"), unit: t("kW") },
      { id: "rkw", label: t("Into rolling"), unit: t("kW") }], detail: true },
    { svg: { id: "chart", viewBox: "0 0 280 150", aria: t("Power needed against speed, and the engine's power") }, detail: true },
    { key: [["--accent", p.shapes.length > 1 ? t("power needed, this body") : t("power needed")], ...(p.shapes.length > 1 ? [["--muted", t("other body")]] : []), ["--l1", t("engine power")], ["--l2", t("now")]], detail: true },
  ] }, { label: t("Wind tunnel"), detail: true, items: [
    { buttons: ["speed", "pressure", "swirl"].map((id, i) => ({ id, label: [t("Speed"), t("Pressure"), t("Swirl")][i], pressed: i === 0, onClick: () => setMode(id) })) },
    { svg: { id: "scale", viewBox: "0 0 280 40", aria: t("Colour scale") }, only: "model" },
    { readouts: [{ id: "push", label: t("Push on the front"), unit: "%" }, { id: "suction", label: t("Suction at the back"), unit: "%" }, { id: "friction", label: t("Skin friction"), unit: "%" }] },
    { text: t("A 2-D slice along the car's centre line, computed live (lattice Boltzmann) in slow motion and at a much lower Reynolds number than the real car. The wheels stand outside the slice.") },
  ] },
  { label: t("Forces"), detail: true, items: [{ legend: [["--l1", t("Air drag at the nose")], ["--l3", t("Drive force at the wheels")], ["--fg", t("Smoke lines: air streaming past")]] }] }]);
  function setShape(s) { shape = s; showTunnel(s); p.shapes.forEach(k => ui.toggle(k.id).set(k === s)); v = Math.min(v, topSpeed(s, ps * PS)); drawChart(); }

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

  // Colour scale for the wind-tunnel field: the ramp and what its ends mean, per mode.
  const SCALES = {
    speed: ["--cfd-1 --cfd-2 --cfd-3 --cfd-4 --cfd-5", t("still air"), t("{0} km/h past the car", (1.4 * p.vmax).toFixed(0))],
    pressure: ["--cfd-2 --stage --cfd-5", t("suction"), t("pressing")],
    swirl: ["--cfd-2 --stage --cfd-5", t("spinning one way"), t("the other way")],
  };
  function setMode(id) {
    for (const k of tunnels.values()) k.tun.setMode(id); ["speed", "pressure", "swirl"].forEach(k => ui.toggle(k).set(k === id));
    const sv = ui.el("scale"), gid = `cfd-${Math.random().toString(36).slice(2, 8)}`, [stops, lo, hi] = SCALES[id];
    const tag = (n, a, text) => { const e = document.createElementNS(NS, n); for (const [k, x] of Object.entries(a)) e.setAttribute(k, x); if (text) e.textContent = text; return e; };
    const grad = tag("linearGradient", { id: gid });
    stops.split(" ").forEach((tok, i, all) => grad.append(tag("stop", { offset: i / (all.length - 1), style: `stop-color:var(${tok})` })));
    sv.replaceChildren(tag("defs", {}), tag("rect", { x: 2, y: 4, width: 276, height: 14, rx: 3, fill: `url(#${gid})`, stroke: "var(--rule)" }),
      tag("text", { x: 2, y: 34, "font-size": 11, fill: "var(--muted)" }, lo), tag("text", { x: 278, y: 34, "text-anchor": "end", "font-size": 11, fill: "var(--muted)" }, hi));
    sv.firstChild.append(grad);
  }
  setMode("speed");

  return {
    layout({ active, onPhoto }) { group.visible = active; for (const d of dashes) d.visible = !onPhoto; for (const k of tunnels.values()) k.tun.layout(onPhoto); },   // no road in the museum
    update(dt) {
      const P = ps * PS, vt = topSpeed(shape, P);
      if (v >= 0.995 * vt) { hold += dt; if (hold > 10) { v = 0; hold = 0; } }
      else v = accelerate(shape, P, v, dt * p.time);
      const fd = drag(shape, v), fr = rolling(shape), maxF = drag(shape, vt) + fr;
      setArrow(dragA, 1.2 * fd / maxF); setArrow(driveA, 1.2 * Math.min(P * (shape.eta ?? 0.88) / Math.max(v, 0.5), 3 * maxF) / maxF);
      phase += tunnel.update(v / (p.vmax / 3.6));   // the road streams past with the air
      const span = wx0 - wx1;
      for (const d of dashes) d.position.x = wx0 - ((d.userData.s * span + phase) % span);
      const sh = tunnel.share(); if (sh) for (const k in sh) ui.set(k, (100 * sh[k]).toFixed(0));
      ui.set("v", (v * 3.6).toFixed(0)); ui.set("drag", fd.toFixed(0));
      ui.set("dkw", (fd * v / 1000).toFixed(0)); ui.set("rkw", (fr * v / 1000).toFixed(0));
      now.setAttribute("x1", X(v * 3.6).toFixed(1)); now.setAttribute("x2", X(v * 3.6).toFixed(1));
    },
  };
}
