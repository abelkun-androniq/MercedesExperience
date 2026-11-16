// Sliding-gear gearbox without synchromesh, seen from the side: primary shaft (from the clutch) on top, secondary shaft
// below. Selecting a gear slides that pair into mesh, but the teeth only go in once both wheels run at about the same
// speed; until then they grind. Upshift: clutch down and wait for the primary shaft to slow. Downshift: double-declutch
// (clutch up in neutral, blip the throttle until the speeds match). A demo drive shifts 1 → 4 and coasts to a stop.
// Params (mm): label, box (lib/model/gearbox.js), module (gear radius per tooth ×2), pos [x, z] of the first pair,
// pitch (pair spacing, rearwards), width (gear face), rpm { idle, max }, gate [[name, col, row]],
// drive { accel (km/h per s at full throttle in a 1 : 1 gear), roll (km/h per s), drag (km/h per s per (km/h)²) }.
import * as THREE from "three";
import { V, rod, place, gear } from "../lib/scene/helpers.js";
import { ratio, primaryRpmFor, mismatch } from "../lib/model/gearbox.js";

const SLOW = 0.05, TOL = 0.1, TAU = 2 * Math.PI;   // shown shaft speed share; mesh tolerance (share of speed)

export function create(ctx, p) {
  const { stage, carRoot } = ctx, m = v => v / 1000, box = p.box, gears = box.gears;
  const group = new THREE.Group(); carRoot.add(group);
  const md = m(p.module), w = m(p.width), x0 = m(p.pos[0]), zS = m(p.pos[1]);
  const fwd = gears.filter(g => !g.idler), cd = md * (fwd[0].drive + fwd[0].driven) / 2, zP = zS + cd;
  const shaftMat = stage.tokenMat("--l4"), caseMat = new THREE.MeshStandardMaterial({ color: 0x8fa3b3, transparent: true, opacity: 0.08, depthWrite: false, side: THREE.DoubleSide });
  const xEnd = x0 - (gears.length - 1) * m(p.pitch);
  group.add(place(rod(shaftMat, 0.012), V(x0 + 0.12, 0, zP), V(xEnd - 0.06, 0, zP)), place(rod(shaftMat, 0.012), V(x0 + 0.06, 0, zS), V(xEnd - 0.14, 0, zS)));
  const caseGeo = new THREE.BoxGeometry(x0 - xEnd + 0.16, 0.24, cd + 0.24); caseGeo.translate((x0 + xEnd) / 2, 0, (zP + zS) / 2);
  group.add(new THREE.Mesh(caseGeo, caseMat), new THREE.LineSegments(new THREE.EdgesGeometry(caseGeo), new THREE.LineBasicMaterial({ color: 0x8fa3b3, transparent: true, opacity: 0.5 })));

  // One pair per gear. The primary wheel (or the reverse idler) slides forward out of mesh.
  const pairs = gears.map((g, i) => {
    const x = x0 - i * m(p.pitch), k = g.idler ? 0.8 : 1, mtl = new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.4 });
    const prim = gear(k * md * g.drive / 2, g.drive, w, mtl), sec = gear(k * md * g.driven / 2, g.driven, w, mtl);
    prim.position.set(x, 0, zP); sec.position.set(x, 0, zS); group.add(prim, sec);
    let idler = null;
    if (g.idler) { idler = gear(0.032, 10, w, mtl); idler.position.set(x, 0.075, zS + 0.62 * cd); group.add(idler); }
    return { g, x, prim, sec, idler, mtl, off: w * 1.3, slide: idler ?? prim };
  });

  // ---------- state ----------
  const { idle, max } = p.rpm;
  let kmh = 0, eng = idle, prim = 0, sel = null, want = null, clutchIn = false, braking = false, throttle = 0, angP = 0, angS = 0;
  let demo = !ctx.reducedMotion, step = 0, age = 0, knob = [1, 0];
  const nameOf = i => (i === null ? "N" : gears[i].name);
  const order = fwd.map(g => gears.indexOf(g)).sort((a, b) => ratio(box, b) - ratio(box, a));   // 1st … top

  const ui = ctx.panel([{ label: p.label, badge: { id: "mesh", text: "Neutral" }, items: [
    { svg: { id: "gate", viewBox: "0 0 200 100", aria: "Gear lever and its gate" } },
    { buttons: [...gears.map((g, i) => ({ id: `g${i}`, label: g.name, pressed: false, onClick: () => { stopDemo(); select(i); } })),
      { id: "gn", label: "N", pressed: true, onClick: () => { stopDemo(); select(null); } }] },
    { buttons: [{ id: "clutch", toggle: ["Clutch down", "Clutch up"], pressed: false, onClick: v => { stopDemo(); clutchIn = v; } },
      { id: "brake", toggle: ["Braking", "Brake off"], pressed: false, onClick: v => { stopDemo(); braking = v; } }] },
    { slider: { id: "thr", label: "Throttle", min: 0, max: 100, value: 0, onInput: v => { stopDemo(); throttle = v / 100; } } },
    { readouts: [{ id: "kmh", label: "Road speed", unit: "km/h" }, { id: "eng", label: "Engine", unit: "rpm" },
      { id: "prim", label: "Primary shaft", unit: "rpm" }, { id: "need", label: "Chosen gear needs", unit: "rpm on the primary shaft" }] },
    { buttons: [{ id: "auto", toggle: ["Demo drive on", "Demo drive off"], pressed: demo, onClick: v => { demo = v; step = 0; age = 0; } }] },
    { key: [["--l1", "pair in mesh"], ["--l2", "pair grinding"], ["--metal", "pairs apart"], ["--l4", "shafts"]] },
  ] }]);
  function stopDemo() { if (demo) { demo = false; ui.toggle("auto").set(false); } }
  function select(i) {
    want = i; sel = null;
    gears.forEach((_, k) => ui.toggle(`g${k}`).set(k === i)); ui.toggle("gn").set(i === null);
  }
  const setClutch = v => { clutchIn = v; ui.toggle("clutch").set(v); };
  const setThrottle = v => { throttle = v; ui.slider("thr").set(Math.round(v * 100)); };
  const setBrake = v => { braking = v; ui.toggle("brake").set(v); };

  // Gate diagram: slots, neutral plane, knob.
  const svg = ui.el("gate"), NS = "http://www.w3.org/2000/svg";
  const el = (tag, a) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(a)) e.setAttribute(k, v); svg.append(e); return e; };
  const gx = col => 40 + col * 60, gy = row => 50 + row * 34, cols = p.gate.map(g => g[1]);
  el("line", { x1: gx(Math.min(...cols)), y1: gy(0), x2: gx(Math.max(...cols)), y2: gy(0), stroke: "var(--muted)", "stroke-width": 8, "stroke-linecap": "round" });
  for (const [name, col, row] of p.gate) {
    el("line", { x1: gx(col), y1: gy(0), x2: gx(col), y2: gy(row), stroke: "var(--muted)", "stroke-width": 8, "stroke-linecap": "round" });
    el("text", { x: gx(col) + 14, y: gy(row) + 4, fill: "var(--fg)", "font-size": 13 }).textContent = name;
  }
  const knobEl = el("circle", { r: 9, fill: "var(--accent)" });
  const slot = i => p.gate.find(g => g[0] === nameOf(i));

  // Demo drive: each step sets the controls, then waits for its condition.
  const script = [{ go: () => { select(null); setBrake(false); setClutch(true); setThrottle(0.1); }, done: () => age > 1 }];
  order.forEach((g, k) => script.push(
    { go: () => { setClutch(true); setThrottle(0.1); select(null); }, done: () => age > 0.3 },
    { go: () => select(g), done: () => sel === g },
    { go: () => { setClutch(false); setThrottle(0.85); }, done: () => (k === order.length - 1 ? age > 6 : eng > 0.88 * max) }));
  script.push({ go: () => { setClutch(true); setThrottle(0); select(null); setBrake(true); }, done: () => kmh < 0.5 && age > 1 });

  function physics(dt) {
    const free = idle + throttle * (max - idle), r = ratio(box, sel);
    const resist = Math.sign(kmh) * (p.drive.roll + p.drive.drag * kmh * kmh + (braking ? 8 : 0));
    if (sel !== null && !clutchIn) {
      const need = primaryRpmFor(box, sel, kmh), slipAt = idle * 1.3;   // below this the clutch slips (moving off)
      eng = Math.max(Math.abs(need), slipAt);
      const torque = eng >= max ? 0 : throttle * Math.max(0, 1.15 - eng / max) - 0.06;
      kmh += (p.drive.accel * Math.abs(r) * torque * Math.sign(r) - resist) * dt;
      prim = need;
    } else {
      eng += (free - eng) * Math.min(1, dt / 0.35);
      const k = kmh - resist * dt; kmh = Math.sign(k) === Math.sign(kmh) ? k : 0;
      prim = sel !== null ? primaryRpmFor(box, sel, kmh) : clutchIn ? prim * Math.exp(-dt / 1.1) : eng;
    }
    if (sel === null && want !== null && mismatch(box, want, prim, kmh) < TOL) sel = want;
  }

  function show(dt) {
    const grinding = sel === null && want !== null;
    pairs.forEach((q, i) => {
      const on = sel === i, tgt = on ? 0 : grinding && want === i ? 0.55 * q.off : q.off;
      const s = q.slide; s.position.x += (q.x + tgt - s.position.x) * 0.25;
      q.mtl.color.copy(stage.color(on ? "--l1" : grinding && want === i ? "--l2" : "--metal"));
    });
    const secRpm = kmh / 0.06 / (TAU * box.wheelR) * box.final;   // the secondary shaft is tied to the road
    angP += prim / 60 * TAU * SLOW * dt; angS += secRpm / 60 * TAU * SLOW * dt;
    for (const q of pairs) {
      q.prim.rotation.x = angP; q.sec.rotation.x = -angS;   // meshing wheels turn opposite ways
      if (q.idler) q.idler.rotation.x = -angP * q.g.drive / 10;
    }
    const s = slot(sel ?? want), tx = s ? s[1] : knob[0], ty = s ? (sel !== null ? s[2] : grinding ? s[2] * 0.45 : 0) : 0;
    knob = [knob[0] + (tx - knob[0]) * 0.3, knob[1] + (ty - knob[1]) * 0.3];
    knobEl.setAttribute("cx", gx(knob[0]).toFixed(1)); knobEl.setAttribute("cy", gy(knob[1]).toFixed(1));
    ui.set("kmh", Math.abs(kmh).toFixed(1) + (kmh < -0.05 ? " back" : "")); ui.set("eng", eng.toFixed(0)); ui.set("prim", prim.toFixed(0));
    ui.set("need", want === null ? "–" : Math.abs(primaryRpmFor(box, want, kmh)).toFixed(0));
    ui.badge("mesh").set(sel !== null ? `In gear ${nameOf(sel)}` : grinding ? `Grinding: ${(mismatch(box, want, prim, kmh) * 100).toFixed(0)} % apart` : "Neutral", sel !== null);
  }

  return {
    layout({ active }) { group.visible = active; },
    update(dt) {
      if (demo) { age += dt; if (age === dt) script[step].go(); if (script[step].done()) { step = (step + 1) % script.length; age = 0; script[step].go(); } }
      for (let i = 0; i < 4; i++) physics(dt / 4);
      show(dt);
    },
  };
}
