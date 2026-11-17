// Two-speed flat-belt drive (Daimler riding car 1885, Benz Velo 1894): a belt from the engine pulley to a countershaft,
// then a pinion inside a ring gear on the wheel ("ring") or a chain to each wheel ("chain"). The engine is governed to one
// speed, so the gear sets the road speed; on a hill that is too steep for the gear the vehicle slows and stops.
// shift "stopped": one belt on stepped pulleys, moved across by hand only while standing (Daimler: no clutch).
// shift "loose": one belt per gear, each with a loose pulley beside its fixed one; on the loose pulley it is neutral (Benz).
// Params (mm, ground at z = 0): label, drive and vehicle (lib/model/belt.js; vehicle.quoted = km/h in top gear), shift,
// final "ring" | "chain", at { engine [x, z], counter [x, z], wheel [x, z], belt (y of the first gear's belt), pitch (y step
// between gears), finals [y] (final drives), wheels [y] (driven wheels) }, wheel "wood" | "wire", grade { max, value } (%).
import * as THREE from "three";
import { V, mat, rod, place, gear, spokedWheel, wireWheel, line, polyline, at as along } from "../lib/scene/helpers.js";
import * as belt from "../lib/model/belt.js";

const SLOW = 0.1, W = 0.03, GAP = 0.004, TAU = 2 * Math.PI;   // shown speed share; pulley face width, gap (m)

export function create(ctx, p) {
  const { stage, carRoot } = ctx, m = v => v / 1000, d = p.drive, gears = d.gears, veh = p.vehicle, A = p.at;
  const loose = p.shift === "loose", lo = 0, hi = gears.length - 1, R = d.wheelR;
  const group = new THREE.Group(); carRoot.add(group);
  const usedMat = stage.tokenMat("--l2", { metalness: 0.3 }), idleMat = stage.tokenMat("--metal", { metalness: 0.3 });
  const finalMat = stage.tokenMat("--l4", { metalness: 0.3 }), shaftMat = stage.tokenMat("--metal"), dark = mat(0x343b42);
  const planeOf = k => m(A.belt) + k * m(A.pitch), looseOf = k => planeOf(k) + W + GAP;
  const spinner = ([x, z]) => { const s = new THREE.Group(); s.position.set(m(x), 0, m(z)); group.add(s); return s; };
  const disc = (parent, r, y, material, w = W) => {
    const g = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 40), material); g.position.y = y; parent.add(g);
    const mk = new THREE.Mesh(new THREE.BoxGeometry(0.5 * r, w + 0.002, 0.01), dark); mk.position.set(0.5 * r, y, 0); parent.add(mk);
    return g;
  };

  // ---------- pulleys and shafts ----------
  const engine = spinner(A.engine), counter = spinner(A.counter);
  const enginePulleys = gears.map((g, k) => loose ? disc(engine, m(g.drive) / 2, (planeOf(k) + looseOf(k)) / 2, idleMat, 2 * W + GAP) : disc(engine, m(g.drive) / 2, planeOf(k), idleMat));
  const fixedPulleys = gears.map((g, k) => disc(counter, m(g.driven) / 2, planeOf(k), idleMat));
  const loosePulleys = loose ? gears.map((g, k) => { const s = spinner(A.counter); disc(s, m(g.driven) / 2 - 0.002, looseOf(k), idleMat); return s; }) : [];
  const ys = [...gears.map((_, k) => planeOf(k)), ...(loose ? gears.map((_, k) => looseOf(k)) : []), ...A.finals.map(m)];
  group.add(place(rod(shaftMat, 0.009), V(m(A.counter[0]), Math.min(...ys) - 0.03, m(A.counter[1])), V(m(A.counter[0]), Math.max(...ys) + 0.03, m(A.counter[1]))));
  group.add(place(rod(shaftMat, 0.011), V(m(A.engine[0]), planeOf(0) - 0.04, m(A.engine[1])), V(m(A.engine[0]), (loose ? looseOf(hi) : planeOf(hi)) + 0.04, m(A.engine[1]))));

  // ---------- belts and chains: a closed band with dark marks that travel along it ----------
  function loop(token, marks, thick) {
    const holder = new THREE.Group(), band = new THREE.Mesh(new THREE.BufferGeometry(), stage.tokenMat(token, { roughness: 0.8 }));
    holder.add(band); group.add(holder);
    const dots = Array.from({ length: marks }, () => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.026, 0.012), dark); holder.add(b); return b; });
    let pl = null, s = 0;
    return {
      holder,
      set(pts) {   // [x, z] in mm
        const v = pts.map(([x, z]) => V(m(x), 0, m(z)));
        band.geometry.dispose();
        band.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v, true, "centripetal"), 160, thick, 6, true);
        pl = polyline([...v, v[0]]); this.advance(0);
      },
      advance(ds) { s = (((s + ds / pl.tot) % 1) + 1) % 1; dots.forEach((b, i) => along(pl, (s + i / marks) % 1, b.position)); },
    };
  }
  const loopFor = (k, r1 = gears[k].drive / 2, r2 = gears[k].driven / 2) => belt.beltLoop(A.engine, r1, A.counter, r2);
  const belts = (loose ? gears : [gears[0]]).map((_, k) => { const b = loop("--l1", 8, 0.006); b.set(loopFor(k)); b.holder.position.y = planeOf(k); return b; });

  // ---------- final drive and driven wheels (all on one hub, axis y) ----------
  const hub = spinner(A.wheel), pR = m(d.pinion) / 2, rR = m(d.ring) / 2, chains = [];
  for (const yf of A.finals.map(m)) {
    if (p.final === "ring") {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(rR, 0.007, 8, 64), finalMat); ring.rotation.x = Math.PI / 2; ring.position.y = yf; hub.add(ring);
      const teeth = Math.round(d.ring / 6);
      for (let i = 0; i < teeth; i++) { const a = (i / teeth) * TAU, t = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.016, 0.006), finalMat); t.position.set((rR - 0.009) * Math.cos(a), yf, (rR - 0.009) * Math.sin(a)); t.rotation.y = -a; hub.add(t); }
      const pin = gear(pR, Math.round(d.pinion / 6), 0.016, finalMat); pin.rotation.z = Math.PI / 2; pin.position.y = yf; counter.add(pin);
    } else {
      disc(counter, pR, yf, finalMat, 0.012); disc(hub, rR, yf, finalMat, 0.012);
      const c = loop("--muted", 14, 0.004); c.set(belt.beltLoop(A.counter, d.pinion / 2, A.wheel, d.ring / 2)); c.holder.position.y = yf; chains.push(c);
    }
  }
  const tyreMat = mat(p.wheel === "wood" ? 0x4a4f55 : 0x2a2d31, { roughness: 0.9 }), spokeMat = mat(p.wheel === "wood" ? 0x6b4a32 : 0x5a626b, { metalness: p.wheel === "wood" ? 0.1 : 0.5 });
  const wheelMats = [tyreMat, spokeMat];
  for (const y of A.wheels.map(m)) {
    let w;
    if (p.wheel === "wood") w = spokedWheel(tyreMat, spokeMat, R - 0.012, 12);
    else { const spokes = line(0x9aa4ad, 0.85); spokes.userData.solid = spokeMat; wheelMats.push(spokes); w = wireWheel(tyreMat, spokes, R - 0.02, 0.02, R - 0.04, 36); }
    w.position.y = y; hub.add(w);
  }
  for (const w of wheelMats) { w.transparent = true; w.userData.opacity = w.opacity; }

  // A ramp under the vehicle shows the hill (model view only; the whole vehicle tilts about the rear tyre's contact).
  const ramp = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide }));
  stage.bind(ramp.material.color, "--l4"); ramp.position.set(m(A.wheel[0]) + 1, 0, 0.002); group.add(ramp);

  // ---------- state + panel ----------
  let g = lo, engaged = true, braking = false, grade = p.grade.value / 100, kmh = 0, refuse = 0, from = lo, shift = 1;
  let angE = 0, angC = 0, angW = 0, demo = !ctx.reducedMotion, step = 0, age = 0;
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { buttons: [...gears.map((x, k) => ({ id: `g${k}`, label: x.name, pressed: k === g, onClick: () => { stopDemo(); select(k); } })),
      ...(loose ? [{ id: "gn", label: "Neutral", pressed: false, onClick: () => { stopDemo(); select(null); } }] : [])] },
    { buttons: [{ id: "brake", toggle: ["Braking", "Brake off"], pressed: false, onClick: v => { stopDemo(); braking = v; } }] },
    { slider: { id: "grade", label: "Hill (%)", min: 0, max: p.grade.max, step: 0.5, value: p.grade.value, onInput: v => { stopDemo(); grade = v / 100; } } },
    { readouts: [{ id: "kmh", label: "Road speed", unit: "km/h" }, { id: "push", label: "Push at the wheel", unit: "N, full power" },
      { id: "need", label: "Hill and rolling resistance", unit: "N" }, { id: "steep", label: "Steepest hill in this gear", unit: "%" },
      { id: "ratio", label: "Engine turns per wheel turn", unit: "" }, { id: "rpm", label: "Engine (governed)", unit: "rpm", value: String(veh.rpm) }] },
    { buttons: [{ id: "auto", toggle: ["Demo drive on", "Demo drive off"], pressed: demo, onClick: v => { demo = v; step = 0; age = 0; } }] },
    { text: "Shown at a tenth of real speed." },
    { key: [["--l1", "belt"], ["--l2", "pulleys in use"], ["--metal", "idle pulleys"], ["--l4", p.final === "ring" ? "pinion and ring gear" : "chain sprockets"]] },
  ] }]);
  function stopDemo() { if (demo) { demo = false; ui.toggle("auto").set(false); } }
  function select(k) {
    if (!loose && k !== g && kmh > 0.05) { refuse = 2.5; return; }   // the belt is moved across by hand, standing still
    if (k !== null && k !== g) { from = g; g = k; shift = loose ? 1 : 0; }
    engaged = k !== null;
    gears.forEach((_, i) => ui.toggle(`g${i}`).set(engaged && i === g)); if (loose) ui.toggle("gn").set(!engaged);
    gears.forEach((_, i) => { const on = engaged && i === g; enginePulleys[i].material = fixedPulleys[i].material = on ? usedMat : idleMat; });
  }
  select(lo);
  const setBrake = v => { braking = v; ui.toggle("brake").set(v); };
  const setGrade = pct => { grade = pct / 100; ui.slider("grade").set(pct); };
  const steepest = k => belt.maxGrade(veh, belt.wheelForce(d, k, veh)) * 100;
  const hill = Math.round(((steepest(hi) + steepest(lo)) / 2) * 2) / 2;   // too steep for top gear, fine in the lowest

  // Demo drive: off in low gear, shift up, meet a hill top gear cannot take, shift down and climb it.
  const shiftTo = k => (loose ? [{ go: () => select(k), done: () => age > 0.5 }]
    : [{ go: () => setBrake(true), done: () => kmh === 0 && age > 0.6 }, { go: () => { select(k); setBrake(false); }, done: () => age > 0.8 }]);
  const script = [
    { go: () => { setGrade(0); setBrake(false); select(lo); }, done: () => age > 4 },
    ...shiftTo(hi), { go: () => {}, done: () => age > 4 },
    { go: () => setGrade(hill), done: () => (kmh === 0 && age > 1.5) || age > 12 },
    ...shiftTo(lo), { go: () => {}, done: () => age > 5 },
  ];

  function badge() {
    const top = belt.roadSpeed(d, g, veh.rpm), push = belt.wheelForce(d, g, veh), need = belt.resistance(veh, grade);
    if (refuse > 0) return ["Stop first: the belt is moved across by hand", false];
    if (!engaged) return ["Belt on the loose pulley: engine runs free", false];
    if (braking && kmh === 0) return ["Held by the brake; the belt slips", false];
    if (push < need) return [kmh > 0 ? "Too steep for this gear: slowing" : g > lo ? "Too steep: shift down" : "Too steep even in low: get off and push", false];
    if (kmh > top - 0.05) return [`Holding ${top.toFixed(1)} km/h`, true];
    return ["Picking up speed", true];
  }

  return {
    layout({ active, onPhoto }) {
      group.visible = active; ramp.visible = !onPhoto;
      for (const w of wheelMats) w.opacity = onPhoto ? 0.12 : w.userData.opacity;   // the real wheels show through
    },
    update(dt, { onPhoto }) {
      if (demo) { age += dt; if (age === dt) script[step].go(); if (script[step].done()) { step = (step + 1) % script.length; age = 0; script[step].go(); } }
      refuse = Math.max(0, refuse - dt);
      kmh = belt.step(d, g, veh, kmh, { grade, engaged, brake: braking }, dt);

      const wE = (veh.rpm / 60) * TAU, wW = kmh / 3.6 / R, wC = wW * (d.ring / d.pinion);
      angE += wE * SLOW * dt; angC += wC * SLOW * dt; angW += wW * SLOW * dt;
      engine.rotation.y = angE; counter.rotation.y = angC; hub.rotation.y = angW;
      // Belts run at the engine pulley's rim speed (slipping on the countershaft pulley while the vehicle is slower).
      belts.forEach((b, k) => b.advance(wE * (loose ? gears[k].drive : gears[g].drive) / 2 * SLOW * dt));
      loosePulleys.forEach((s, k) => (s.rotation.y += (wE * gears[k].drive) / gears[k].driven * SLOW * dt));
      chains.forEach(c => c.advance(wC * (d.pinion / 2) * SLOW * dt));
      if (loose) belts.forEach((b, k) => { const y = engaged && k === g ? planeOf(k) : looseOf(k); b.holder.position.y += (y - b.holder.position.y) * Math.min(1, dt * 8); });
      else if (shift < 1) {   // the one belt slides across to the other step
        shift = Math.min(1, shift + dt / 0.6);
        const a = gears[from], b = gears[g], t = shift;
        belts[0].set(loopFor(0, (a.drive + (b.drive - a.drive) * t) / 2, (a.driven + (b.driven - a.driven) * t) / 2));
        belts[0].holder.position.y = planeOf(from) + (planeOf(g) - planeOf(from)) * t;
      }

      if (!onPhoto) {   // tilt up the hill about the rear tyre's contact point
        const a = -Math.atan(grade), x = m(A.wheel[0]);
        carRoot.rotation.y = a; carRoot.position.set(x - x * Math.cos(a), 0, x * Math.sin(a));
      }

      const [text, on] = badge();
      ui.badge("state").set(text, on);
      ui.set("kmh", kmh.toFixed(1)); ui.set("push", engaged ? belt.wheelForce(d, g, veh).toFixed(0) : "0");
      ui.set("need", belt.resistance(veh, grade).toFixed(0)); ui.set("steep", engaged ? Math.max(0, steepest(g)).toFixed(1) : "–");
      ui.set("ratio", belt.ratio(d, g).toFixed(1));
    },
  };
}
