// Driven axle with an open differential: crown wheel (or belt pulley) and carrier, two spider gears on a cross pin, two
// side gears on the half-shafts. mode "corner": the outer wheel has further to go and the spider gears start to turn.
// mode "grip": one wheel on a slippery patch; open, it spins and the car stays put; locked, both wheels pull.
// Params (mm, ground at z = 0): label, mode, halfTrack, wheelR, axleX, wheel "wire" | "tyre", tyreW?, ringR,
// drive "crown" | "belt", counter? { x, z, half } (differential on a countershaft, chains to the wheels: Benz 1886),
// corner? { kmh, minRadius (m) }, grip? { torque (N·m at the axle), normal (N per wheel), muLow, muHigh, resist (N),
// surface (label), locks (bool) }.
import * as THREE from "three";
import { V, mat, rod, place, tyre, wireWheel, line } from "../lib/scene/helpers.js";
import { cornerSpeeds, traction } from "../lib/model/differential.js";

const SLOW = 0.3, SIDE = 0.05, PIN = 0.045, Z_SIDE = 16, Z_SPIDER = 10;   // shown speed share; gear offsets (m); teeth

export function create(ctx, p) {
  const { stage, carRoot } = ctx, m = v => v / 1000;
  const h = m(p.halfTrack), R = m(p.wheelR), ax = m(p.axleX);
  const group = new THREE.Group(); carRoot.add(group);
  const iron = mat(0x5a626b, { metalness: 0.5 }), tyreMat = mat(0x2a2d31, { roughness: 0.9 }), dark = mat(0x343b42);
  const sideMat = stage.tokenMat("--l1"), spiderMat = stage.tokenMat("--l2"), carrierMat = stage.tokenMat("--metal"), shaftMat = stage.tokenMat("--l4");
  const K = p.counter ? 0.22 / 0.07 : 1;   // half-shaft turns per wheel turn (chain sprockets on the countershaft)
  const cx = p.counter ? m(p.counter.x) : ax, cz = p.counter ? m(p.counter.z) : R, half = p.counter ? m(p.counter.half) : h;
  const C = V(cx, 0, cz);
  const marked = (geo, material, markSize) => {   // a part with a dark mark so its rotation is visible
    const g = new THREE.Group(); g.add(new THREE.Mesh(geo, material));
    const k = new THREE.Mesh(new THREE.BoxGeometry(markSize[0], markSize[1], markSize[2]), dark); k.position.z = markSize[3] ?? 0; g.add(k); return g;
  };
  const spinner = (pos, part) => { const g = new THREE.Group(); g.position.copy(pos); g.add(part); group.add(g); return g; };

  // Wheels (axis along y) on their own spinners.
  const wheels = [1, -1].map(s => {
    const g = new THREE.Group();
    if (p.wheel === "wire") { const spokes = line(0x9aa4ad, 0.85); spokes.userData.solid = iron; g.add(wireWheel(tyreMat, spokes, R - 0.02, 0.02, R - 0.05, 28)); }
    else { const tw = m(p.tyreW ?? 110); g.add(tyre(tyreMat, R - tw, tw)); g.add(new THREE.Mesh(new THREE.CylinderGeometry(R - 1.8 * tw, R - 1.8 * tw, 0.14, 32), iron)); }
    const mk = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, 0.45 * R), carrierMat); mk.position.z = 0.4 * R; g.add(mk);
    return spinner(V(ax, s * h, R), g);
  });

  // Carrier: crown wheel or belt pulley, cross pin, two spider gears. Side gears turn with their half-shafts.
  const carrier = spinner(C, new THREE.Group());
  const ringR = m(p.ringR);
  if (p.drive === "belt") carrier.add(marked(new THREE.CylinderGeometry(ringR, ringR, 0.1, 40, 1, true), new THREE.MeshStandardMaterial({ color: 0x8a6a4a, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }), [0.03, 0.1, 0.03, ringR]));
  else { const crown = marked(new THREE.CylinderGeometry(ringR, ringR, 0.02, 40), carrierMat, [0.03, 0.022, 0.03, ringR - 0.02]); crown.position.y = -SIDE - 0.02; carrier.add(crown); }
  carrier.add(place(rod(carrierMat, 0.008), V(0, 0, -PIN - 0.02), V(0, 0, PIN + 0.02)));
  const spiders = [1, -1].map(s => {
    const holder = new THREE.Group(); holder.position.z = s * PIN; carrier.add(holder);
    const gear = marked(new THREE.CylinderGeometry(0.018, 0.03, 0.025, 20), spiderMat, [0.012, 0.03, 0.012, 0]);
    gear.children[1].position.set(0.022, 0, 0);
    gear.rotation.x = s > 0 ? -Math.PI / 2 : Math.PI / 2; holder.add(gear); return holder;
  });
  const sides = [1, -1].map(s => {
    const gear = marked(new THREE.CylinderGeometry(s > 0 ? 0.042 : 0.028, s > 0 ? 0.028 : 0.042, 0.03, 24), sideMat, [0.012, 0.032, 0.012, 0.03]);
    return spinner(V(cx, s * SIDE, cz), gear);
  });

  // Half-shafts; with a countershaft, sprockets and a chain to each wheel.
  const chainLinks = [];
  for (const s of [1, -1]) {
    group.add(place(rod(shaftMat, 0.014), V(cx, s * SIDE, cz), V(cx, s * half, cz)));
    if (!p.counter) continue;
    const yw = s * (h - 0.09), r1 = 0.07, r2 = 0.22;
    chainLinks.push(spinner(V(cx, s * half, cz), marked(new THREE.CylinderGeometry(r1, r1, 0.02, 24), iron, [0.02, 0.022, 0.02, r1 - 0.01])));
    chainLinks.push(spinner(V(ax, yw, R), marked(new THREE.CylinderGeometry(r2, r2, 0.02, 40), iron, [0.03, 0.022, 0.03, r2 - 0.02])));
    for (const t of [1, -1]) group.add(place(rod(dark, 0.006), V(cx, s * half, cz + t * r1), V(ax, yw, R + t * r2)));
  }
  const housing = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), new THREE.MeshStandardMaterial({ color: 0x8fa3b3, transparent: true, opacity: 0.12, depthWrite: false }));
  housing.position.copy(C); if (p.drive !== "belt") group.add(housing);

  // Ground: wheel paths in a corner, slippery patch for the grip demo.
  const pathOf = token => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 41 }, () => V(0, 0, 0))), new THREE.LineBasicMaterial()); stage.bind(l.material.color, token); l.frustumCulled = false; group.add(l); return l; };
  const paths = p.mode === "corner" ? [pathOf("--l1"), pathOf("--l2")] : [];
  const patch = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55, depthWrite: false }));
  stage.bind(patch.material.color, "--l4"); patch.position.set(ax, h, 0.004); patch.visible = p.mode === "grip"; group.add(patch);

  // ---------- state + panel ----------
  const D = 180 / Math.PI;
  let auto = !ctx.reducedMotion, t = 0, curve = 0.6, locked = false, angL = 0, angR = 0, angC = 0;   // half-shaft and carrier angles
  const ui = p.mode === "corner" ? ctx.panel([{ label: p.label, items: [
    { slider: { id: "curve", label: "Steering: right ← straight → left", min: -1, max: 1, step: 0.05, value: curve, onInput: v => { auto = false; ui.toggle("auto").set(false); curve = v; } } },
    { readouts: [{ id: "radius", label: "Turn radius", unit: "m, axle centre" }, { id: "left", label: "Left wheel", unit: "rpm" }, { id: "right", label: "Right wheel", unit: "rpm" },
      { id: "spider", label: "Spider gears", unit: "rpm in the carrier" }, { id: "extra", label: "Outer wheel goes", unit: "% further" }] },
    { buttons: [{ id: "auto", toggle: ["Auto demo on", "Auto demo off"], pressed: auto, onClick: v => (auto = v) }] },
    { key: [["--l1", "left wheel path"], ["--l2", "right wheel path"]] },
  ] }, { label: "Parts", items: [{ legend: [["--l1", "Side gears (one per half-shaft)"], ["--l2", "Spider gears"], ["--metal", p.drive === "belt" ? "Carrier inside the belt pulley" : "Carrier and crown wheel"], ["--l4", "Half-shafts"]] }] }])
    : ctx.panel([{ label: p.label, badge: { id: "moves", text: "" }, items: [
      { buttons: [{ id: "open", label: "Open differential", pressed: true, onClick: () => setLock(false) },
        ...(p.grip.locks ? [{ id: "lock", label: "Differential lock", pressed: false, onClick: () => setLock(true) }] : [])] },
      { readouts: [{ id: "fL", label: `Left wheel, on ${p.grip.surface}`, unit: "N of push" }, { id: "fR", label: "Right wheel, dry", unit: "N of push" },
        { id: "total", label: "Total drive", unit: `N, needs ${p.grip.resist} to move` }, { id: "spin", label: "Left wheel", unit: "rpm" }] },
      { buttons: [{ id: "auto", toggle: ["Auto demo on", "Auto demo off"], pressed: auto, onClick: v => (auto = v) }] },
      { key: [["--l4", `${p.grip.surface} under the left wheel`]] },
    ] }, { label: "Parts", items: [{ legend: [["--l1", "Side gears (one per half-shaft)"], ["--l2", "Spider gears"], ["--metal", "Carrier and crown wheel"], ["--l4", "Half-shafts"]] }] }]);
  function setLock(v) { locked = v; ui.toggle("open").set(!v); if (p.grip.locks) ui.toggle("lock").set(v); }

  const rpm = w => (w * 60 / (2 * Math.PI)).toFixed(0);
  function corner(dt) {
    if (auto) { t += dt; curve = Math.sin(0.35 * t); ui.slider("curve").set(curve.toFixed(2)); }
    const radius = Math.abs(curve) < 0.02 ? Infinity : p.corner.minRadius / curve, v = p.corner.kmh / 3.6;
    const s = cornerSpeeds({ halfTrack: h, wheelR: R }, radius, v);
    angL += s.left * K * SLOW * dt; angR += s.right * K * SLOW * dt; angC += s.carrier * K * SLOW * dt;
    const straight = !Number.isFinite(radius);
    [h, -h].forEach((y, i) => {   // each wheel's path, 4 m ahead
      const pos = paths[i].geometry.attributes.position;
      for (let k = 0; k <= 40; k++) {
        const d = k / 40 * 4;
        if (straight) pos.setXYZ(k, ax + d, y, 0.01);
        else { const rr = radius - y, a = d / Math.abs(rr); pos.setXYZ(k, ax + rr * Math.sin(a) * Math.sign(rr), radius - rr * Math.cos(a), 0.01); }
      }
      pos.needsUpdate = true;
    });
    ui.set("radius", straight ? "straight" : Math.abs(radius).toFixed(1));
    ui.set("left", rpm(s.left)); ui.set("right", rpm(s.right));
    ui.set("spider", rpm(Math.abs(s.diff) * Z_SIDE / Z_SPIDER));
    ui.set("extra", straight ? "0" : ((Math.max(s.left, s.right) / Math.min(s.left, s.right) - 1) * 100).toFixed(0));
  }
  function grip(dt) {
    if (auto) { t += dt; const lk = p.grip.locks && Math.floor(t / 5) % 2 === 1; if (lk !== locked) setLock(lk); }
    const g = p.grip, r = traction({ torque: g.torque, wheelR: R, normal: g.normal, muL: g.muLow, muR: g.muHigh, locked, resist: g.resist });
    const wC = 1.2 / R;   // carrier speed from the engine: walking pace, as on a slippery start
    // Open with the left wheel slipping: the right wheel stands and the left one turns twice as fast as the carrier.
    const [wL, wR] = locked ? [wC, wC] : r.spinL ? [2 * wC, 0] : r.moves ? [wC, wC] : [0, 0];
    angL += wL * K * SLOW * dt; angR += wR * K * SLOW * dt; angC += (wL + wR) / 2 * K * SLOW * dt;
    ui.set("fL", r.fL.toFixed(0)); ui.set("fR", r.fR.toFixed(0)); ui.set("total", r.total.toFixed(0)); ui.set("spin", rpm(wL));
    ui.badge("moves").set(r.moves ? "Car moves off" : "Stuck: left wheel spins", r.moves);
  }

  return {
    layout({ active }) { group.visible = active; },
    update(dt) {
      (p.mode === "corner" ? corner : grip)(dt);
      wheels[0].rotation.y = angL / K; wheels[1].rotation.y = angR / K;
      sides[0].rotation.y = angL; sides[1].rotation.y = angR;
      carrier.rotation.y = angC;
      const rel = (angL - angC) * Z_SIDE / Z_SPIDER;
      spiders[0].rotation.z = rel; spiders[1].rotation.z = -rel;
      chainLinks.forEach((c, i) => (c.rotation.y = (i < 2 ? angL : angR) / (i % 2 ? K : 1)));   // [left small, left big, right small, right big]
    },
  };
}
