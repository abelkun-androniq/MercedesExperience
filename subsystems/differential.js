// Driven axle with an open differential: crown wheel (or belt pulley) and carrier, two spider gears on a cross pin, two
// side gears on the half-shafts. mode "corner": the outer wheel has further to go and the spider gears start to turn; a
// line under the controls says what the gears are doing, and "Hold the left wheel" shows the other side running at twice
// the carrier's speed. mode "grip": one wheel on a slippery patch; open, it spins and the car stays put; a dog collar
// (lock) joins the left side gear to the carrier, or a pack of friction plates (limited-slip) resists the two sides
// turning apart. With a crown wheel, a propeller shaft and pinion bring the drive in from ahead; in mode "grip" arrows
// stream in along it and out along each half-shaft, sized by the torque each side carries, and "Step by step" follows the
// drive part by part (propeller shaft and pinion, crown wheel and carrier, spider gears, side gears out to the wheels),
// lighting the parts in play and saying what each drives in the chosen case.
// Params (mm, ground at z = 0): label, mode, halfTrack, wheelR, axleX, wheel "wire" | "tyre", tyreW?, ringR,
// drive "crown" | "belt", counter? { x, z, half } (differential on a countershaft, chains to the wheels: Benz 1886),
// drop? (portal axle: the carrier and half-shafts sit this far above the wheel centres; a hub drop gear joins them),
// corner? { kmh, minRadius (m) }, grip? { torque (N·m at the axle), normal (N per wheel), muLow, muHigh, resist (N),
// surface ("ice" | "mud": the slippery patch, named in the panel), locks (bool), bias? (torque bias ratio: offers a
// limited-slip differential to compare) }.
import * as THREE from "three";
import { V, mat, rod, place, tyre, wireWheel, line } from "../lib/scene/helpers.js";
import { cornerSpeeds, traction } from "../lib/model/differential.js";

const SLOW = 0.3, SIDE = 0.05, PIN = 0.045, Z_SIDE = 16, Z_SPIDER = 10;   // shown speed share; gear offsets (m); teeth

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000;
  const SURFACE = {   // whole phrases: case endings differ
    ice: { on: t("Left wheel, on ice"), under: t("ice under the left wheel"),
      open: t("4 · Out, open: the left wheel is on ice, so its side gear gives way. The spider gears turn on their pin and roll round the right side gear, which the dry wheel holds still: all the motion goes to the spinning left wheel, and the dry wheel gets only as little torque as the ice can take.") },
    mud: { on: t("Left wheel, in mud"), under: t("mud under the left wheel"),
      open: t("4 · Out, open: the left wheel is in mud, so its side gear gives way. The spider gears turn on their pin and roll round the right side gear, which the wheel on firm ground holds still: all the motion goes to the spinning left wheel, and the other wheel gets only as little torque as the mud can take.") } };
  const h = m(p.halfTrack), R = m(p.wheelR), ax = m(p.axleX);
  const group = new THREE.Group(); carRoot.add(group);
  const iron = mat(0x5a626b, { metalness: 0.5 }), tyreMat = mat(0x2a2d31, { roughness: 0.9 }), dark = mat(0x343b42);
  const rimMat = mat(0x5a626b, { metalness: 0.5 }), wheelMarkMat = stage.tokenMat("--metal"), wheelMats = [tyreMat, rimMat, wheelMarkMat];   // faded over the museum photo
  const sideMat = stage.tokenMat("--l1"), spiderMat = stage.tokenMat("--l2"), carrierMat = stage.tokenMat("--metal"), shaftMat = stage.tokenMat("--l4");
  const K = p.counter ? 0.22 / 0.07 : 1;   // half-shaft turns per wheel turn (chain sprockets on the countershaft)
  const cx = p.counter ? m(p.counter.x) : ax, cz = p.counter ? m(p.counter.z) : R + m(p.drop ?? 0), half = p.counter ? m(p.counter.half) : h - (p.drop ? 0.12 : 0);
  const C = V(cx, 0, cz);
  const marked = (geo, material, markSize) => {   // a part with a dark mark so its rotation is visible
    const g = new THREE.Group(); g.add(new THREE.Mesh(geo, material));
    const k = new THREE.Mesh(new THREE.BoxGeometry(markSize[0], markSize[1], markSize[2]), dark); k.position.z = markSize[3] ?? 0; g.add(k); return g;
  };
  const spinner = (pos, part) => { const g = new THREE.Group(); g.position.copy(pos); g.add(part); group.add(g); return g; };

  // Wheels (axis along y) on their own spinners.
  const wheels = [1, -1].map(s => {
    const g = new THREE.Group();
    if (p.wheel === "wire") { const spokes = line(0x9aa4ad, 0.85); spokes.userData.solid = rimMat; wheelMats.push(spokes); g.add(wireWheel(tyreMat, spokes, R - 0.02, 0.02, R - 0.05, 28)); }
    else { const tw = m(p.tyreW ?? 110); g.add(tyre(tyreMat, R - tw, tw)); g.add(new THREE.Mesh(new THREE.CylinderGeometry(R - 1.8 * tw, R - 1.8 * tw, 0.14, 32), rimMat)); }
    const mk = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, 0.45 * R), wheelMarkMat); mk.position.z = 0.4 * R; g.add(mk);
    return spinner(V(ax, s * h, R), g);
  });

  for (const w of wheelMats) { w.transparent = true; w.userData.opacity = w.opacity; }

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
    if (p.drop) group.add(place(rod(iron, 0.05), V(cx, s * half, cz + 0.05), V(cx, s * half, R - 0.05)));   // portal hub: drop gears down to the wheel
    if (!p.counter) continue;
    const yw = s * (h - 0.09), r1 = 0.07, r2 = 0.22;
    chainLinks.push(spinner(V(cx, s * half, cz), marked(new THREE.CylinderGeometry(r1, r1, 0.02, 24), iron, [0.02, 0.022, 0.02, r1 - 0.01])));
    chainLinks.push(spinner(V(ax, yw, R), marked(new THREE.CylinderGeometry(r2, r2, 0.02, 40), iron, [0.03, 0.022, 0.03, r2 - 0.02])));
    for (const t of [1, -1]) group.add(place(rod(dark, 0.006), V(cx, s * half, cz + t * r1), V(ax, yw, R + t * r2)));
  }
  // Lock: a dog collar splined to the left half-shaft slides onto a dog ring at the end of a sleeve on the carrier.
  // Limited-slip: friction plates between the left side gear and the carrier, alternately keyed to each.
  const lockMat = stage.tokenMat("--l5"), plateMat = stage.tokenMat("--l3"), DOG = SIDE + 0.075;
  const dogs = (y, dir) => {   // a ring with six teeth facing along y (dir = ±1)
    const g = new THREE.Group(), ring = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.014, 24), lockMat); ring.position.y = y; g.add(ring);
    for (let i = 0; i < 6; i++) { const d = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.012, 0.01), lockMat), a = i / 6 * Math.PI * 2; d.position.set(0.024 * Math.cos(a), y + dir * 0.012, 0.024 * Math.sin(a)); g.add(d); }
    return g;
  };
  const sleeve = new THREE.Group(); sleeve.add(place(rod(carrierMat, 0.02), V(0, SIDE + 0.016, 0), V(0, DOG, 0)), dogs(DOG, 1));
  sleeve.visible = !!p.grip?.locks; carrier.add(sleeve);
  const collarSpin = spinner(V(cx, DOG + 0.045, cz), dogs(0, -1)); collarSpin.visible = false;
  const plates = new THREE.Group();
  for (let i = 0; i < 5; i++) { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.003, 28), plateMat); d.position.y = i * 0.006; plates.add(d); }
  const plateSpin = spinner(V(cx, SIDE + 0.026, cz), plates); plateSpin.visible = false;
  // Drive in (crown wheel only): the propeller shaft comes from the gearbox ahead and turns a bevel pinion on the crown
  // wheel's inner face. Local y of `pinion` runs forward along the shaft.
  const powerMat = stage.tokenMat("--power"), PIN_X = 0.75 * m(p.ringR), PIN_R = 0.03, PROP = 1.1, yP = -SIDE - 0.01 + PIN_R;
  const pinion = new THREE.Group(), pinionSpin = new THREE.Group();
  if (p.drive === "crown") {
    pinion.position.set(cx + PIN_X, yP, cz); pinion.rotation.z = -Math.PI / 2; group.add(pinion); pinion.add(pinionSpin);
    const head = marked(new THREE.CylinderGeometry(PIN_R + 0.008, PIN_R - 0.012, 0.035, 16), powerMat, [0.012, 0.037, 0.012, 0]);
    head.children[1].position.set(PIN_R, 0, 0); pinionSpin.add(head);
    pinionSpin.add(place(rod(powerMat, 0.016), V(0, 0.017, 0), V(0, PROP, 0)));
    const flange = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.02, 0.02), dark); flange.position.set(0, PROP * 0.6, 0); pinionSpin.add(flange);   // shows the shaft turning
  }

  // Drive flowing through: arrows stream in along the propeller shaft and out along each half-shaft to its wheel, sized by
  // the torque each carries (grip mode).
  const flows = [], arrowMat = stage.tokenMat("--power");
  const flow = pts => {   // arrows travelling along a polyline
    const segs = pts.slice(1).map((b, i) => ({ a: pts[i], b, len: pts[i].distanceTo(b) })), len = segs.reduce((s, x) => s + x.len, 0);
    const arrows = Array.from({ length: Math.max(2, Math.round(len / 0.14)) }, () => { const c = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.09, 14), arrowMat); group.add(c); return c; });
    const f = { segs, len, arrows, size: 0, phase: 0 }; flows.push(f); return f;
  };
  const UP = V(0, 1, 0), dir = new THREE.Vector3();
  function drawFlow(f, dt) {
    f.phase = (f.phase + dt * 0.35 / f.len) % 1;
    f.arrows.forEach((c, i) => {
      let d = ((i / f.arrows.length + f.phase) % 1) * f.len, s = f.segs[0];
      for (s of f.segs) { if (d <= s.len) break; d -= s.len; }
      c.visible = f.size > 0; c.scale.setScalar(f.size);
      c.position.lerpVectors(s.a, s.b, Math.min(1, d / s.len)); c.quaternion.setFromUnitVectors(UP, dir.subVectors(s.b, s.a).normalize());
    });
  }
  const flowIn = p.mode === "grip" && p.drive === "crown" ? flow([V(cx + PIN_X + PROP, yP, cz), V(cx + PIN_X + 0.05, yP, cz)]) : null;
  const flowOut = p.mode === "grip" ? [1, -1].map(s => flow([V(cx, s * (SIDE + 0.06), cz), V(cx, s * half, cz), ...(p.drop ? [V(cx, s * half, R)] : []), V(ax, s * (h - 0.02), R)])) : [];

  const housing = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), new THREE.MeshStandardMaterial({ color: 0x8fa3b3, transparent: true, opacity: 0.12, depthWrite: false }));
  housing.position.copy(C); if (p.drive !== "belt") group.add(housing);

  // Ground: wheel paths in a corner, slippery patch for the grip demo.
  const pathOf = token => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 41 }, () => V(0, 0, 0))), new THREE.LineBasicMaterial()); stage.bind(l.material.color, token); l.frustumCulled = false; group.add(l); return l; };
  const paths = p.mode === "corner" ? [pathOf("--l1"), pathOf("--l2")] : [];
  const patch = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55, depthWrite: false }));
  stage.bind(patch.material.color, "--l4"); patch.position.set(ax, h, 0.004); patch.visible = p.mode === "grip"; group.add(patch);

  // ---------- state + panel ----------
  const D = 180 / Math.PI;
  const STEP = 3.5;   // s per step when following the drive
  let follow = p.mode === "grip", step = 0, stepT = 0, onPhoto = false;
  let auto = !ctx.reducedMotion, clock = 0, curve = 0.6, kind = "open", held = false, angL = 0, angR = 0, angC = 0, said = "";   // half-shaft and carrier angles
  const ui = p.mode === "corner" ? ctx.panel([{ label: p.label, items: [
    { slider: { id: "curve", label: t("Steering: right ← straight → left"), min: -1, max: 1, step: 0.05, value: curve, onInput: v => { auto = false; ui.toggle("auto").set(false); curve = v; } } },
    { readouts: [{ id: "radius", label: t("Turn radius"), unit: t("m, axle centre") }, { id: "left", label: t("Left wheel"), unit: t("rpm") }, { id: "right", label: t("Right wheel"), unit: t("rpm") },
      { id: "spider", label: t("Spider gears"), unit: t("rpm in the carrier") }, { id: "extra", label: t("Outer wheel goes"), unit: t("% further") }] },
    { text: { id: "how", value: "" } },
    { buttons: [{ id: "hold", toggle: [t("Let the left wheel go"), t("Hold the left wheel")], pressed: false, onClick: v => { held = v; if (v) { auto = false; ui.toggle("auto").set(false); } } },
      { id: "auto", toggle: [t("Auto demo on"), t("Auto demo off")], pressed: auto, onClick: v => { auto = v; if (v && held) { held = false; ui.toggle("hold").set(false); } } }] },
    { key: [["--l1", t("left wheel path")], ["--l2", t("right wheel path")]] },
  ] }, { label: t("Parts"), items: [{ legend: [["--l1", t("Side gears (one per half-shaft)")], ["--l2", t("Spider gears")], ["--metal", p.drive === "belt" ? t("Carrier inside the belt pulley") : t("Carrier and crown wheel")], ["--l4", t("Half-shafts")]] }] }])
    : ctx.panel([{ label: p.label, badge: { id: "moves", text: "" }, items: [
      { buttons: [{ id: "open", label: t("Open differential"), pressed: true, onClick: () => choose("open") },
        ...(p.grip.bias ? [{ id: "lsd", label: t("Limited-slip"), pressed: false, onClick: () => choose("lsd") }] : []),
        ...(p.grip.locks ? [{ id: "lock", label: t("Differential lock"), pressed: false, onClick: () => choose("lock") }] : [])] },
      { readouts: [{ id: "fL", label: SURFACE[p.grip.surface].on, unit: t("N of push") }, { id: "fR", label: t("Right wheel, dry"), unit: t("N of push") },
        { id: "total", label: t("Total drive"), unit: t("N, needs {0} to move", p.grip.resist) }, { id: "spin", label: t("Left wheel"), unit: t("rpm") }] },
      { text: { id: "how", value: "" } },
      { buttons: [{ id: "follow", toggle: [t("Step by step: on"), t("Step by step: off")], pressed: follow, onClick: v => { follow = v; step = 0; stepT = 0; } },
        { id: "auto", toggle: [t("Auto demo on"), t("Auto demo off")], pressed: auto, onClick: v => (auto = v) }] },
      { key: [["--power", t("drive from the engine; arrow size: torque")], ["--l4", SURFACE[p.grip.surface].under]] },
    ] }, { label: t("Parts"), items: [{ legend: [...(p.drive === "crown" ? [["--power", t("Propeller shaft and pinion: the engine's drive comes in here")]] : []), ["--l1", t("Side gears (one per half-shaft)")], ["--l2", t("Spider gears")], ["--metal", t("Carrier and crown wheel")], ["--l4", t("Half-shafts")],
      ...(p.grip.locks ? [["--l5", t("Dog collar of the lock")]] : []), ...(p.grip.bias ? [["--l3", t("Friction plates of the limited-slip differential")]] : [])] }] }]);
  const kinds = ["open", ...(p.grip?.bias ? ["lsd"] : []), ...(p.grip?.locks ? ["lock"] : [])];
  function setKind(k) { kind = k; for (const x of kinds) ui.toggle(x).set(x === k); }
  function choose(k) { if (auto) { auto = false; ui.toggle("auto").set(false); } setKind(k); step = 3; stepT = 0; }   // the visitor's choice stops the demo and shows its outcome
  // Following the drive: the parts each step lights (the rest fade), in order from the engine to the wheels.
  const tokenMats = [powerMat, carrierMat, spiderMat, sideMat, shaftMat, lockMat, plateMat];
  for (const mt of tokenMats) { mt.transparent = true; mt.userData.opacity = 1; }
  const LIT = [[powerMat], [powerMat, carrierMat], [carrierMat, spiderMat, sideMat], [spiderMat, sideMat, shaftMat, lockMat, plateMat, ...wheelMats]];

  const rpm = w => (w * 60 / (2 * Math.PI)).toFixed(0);
  function corner(dt) {
    if (auto) { clock += dt; curve = Math.sin(0.35 * clock); ui.slider("curve").set(curve.toFixed(2)); }
    const radius = Math.abs(curve) < 0.02 ? Infinity : p.corner.minRadius / curve, v = p.corner.kmh / 3.6;
    // Held: the carrier still turns at the driving speed; the left side gear stands, so the right one turns twice as fast.
    const s = held ? { left: 0, right: 2 * v / R, carrier: v / R, diff: v / R } : cornerSpeeds({ halfTrack: h, wheelR: R }, radius, v);
    angL += s.left * K * SLOW * dt; angR += s.right * K * SLOW * dt; angC += s.carrier * K * SLOW * dt;
    const straight = !Number.isFinite(radius);
    for (const l of paths) l.visible = !held;
    explain(held ? t("One wheel held still: the spider gears roll round the stopped side gear and drive the other at twice the carrier's speed. So a wheel on ice can spin while the car stands.")
      : straight ? t("Straight ahead: both wheels turn as fast as the carrier. The spider gears ride round with it but do not turn on their pin, so the differential turns like one solid axle.")
      : t("In the bend the outer side gear runs ahead of the carrier and the inner one falls behind by as much. The spider gears roll between them, turning on their pin: the carrier always turns at the average of the two wheels."));
    [h, -h].forEach((y, i) => {   // each wheel's path, 4 m ahead
      const pos = paths[i].geometry.attributes.position;
      for (let k = 0; k <= 40; k++) {
        const d = k / 40 * 4;
        if (straight) pos.setXYZ(k, ax + d, y, 0.01);
        else { const rr = radius - y, a = d / Math.abs(rr); pos.setXYZ(k, ax + rr * Math.sin(a) * Math.sign(rr), radius - rr * Math.cos(a), 0.01); }
      }
      pos.needsUpdate = true;
    });
    ui.set("radius", held ? "–" : straight ? t("straight") : Math.abs(radius).toFixed(1));
    ui.set("left", rpm(s.left)); ui.set("right", rpm(s.right));
    ui.set("spider", rpm(Math.abs(s.diff) * Z_SIDE / Z_SPIDER));
    ui.set("extra", held ? "–" : straight ? "0" : ((Math.max(s.left, s.right) / Math.min(s.left, s.right) - 1) * 100).toFixed(0));
  }
  function explain(text) { if (text !== said) { said = text; ui.set("how", text); } }
  function grip(dt) {
    if (follow) {   // one pass along the chain per case; the demo then moves to the next case
      stepT += dt;
      if (stepT > STEP) { stepT = 0; step = (step + 1) % 4; if (step === 0 && auto) setKind(kinds[(kinds.indexOf(kind) + 1) % kinds.length]); }
    } else if (auto) { clock += dt; const k = kinds[Math.floor(clock / 5) % kinds.length]; if (k !== kind) setKind(k); }
    const g = p.grip, locked = kind === "lock";
    const r = traction({ torque: g.torque, wheelR: R, normal: g.normal, muL: g.muLow, muR: g.muHigh, locked, bias: kind === "lsd" ? g.bias : 1, resist: g.resist });
    const wC = 1.2 / R;   // carrier speed from the engine: walking pace, as on a slippery start
    // Slipping without a lock: the sides share the carrier's speed (left + right = twice the carrier). Stuck, the right
    // wheel stands and the left turns twice as fast; moving off on plates, the slipping left wheel still runs ahead.
    const [wL, wR] = locked ? [wC, wC] : !r.spinL ? (r.moves ? [wC, wC] : [0, 0]) : r.moves ? [1.4 * wC, 0.6 * wC] : [2 * wC, 0];
    collarSpin.visible = !!g.locks; plateSpin.visible = kind === "lsd";
    collarSpin.position.y = DOG + (locked ? 0.024 : 0.05);   // slid onto the carrier's dogs, or clear of them
    if (follow) explain(step === 0 ? t("1 · In: the engine turns the propeller shaft, and the small pinion at its end turns the big crown wheel.")
      : step === 1 ? t("2 · The crown wheel is bolted to the carrier, so the whole carrier turns and carries the cross pin round with it.")
      : step === 2 ? t("3 · The cross pin pushes the two spider gears round, and each spider gear pushes on both side gears equally: by itself the differential gives both wheels the same torque.")
      : kind === "lock" ? t("4 · Out, locked: the dog collar ties the left half-shaft to the carrier. Both side gears must now turn with the carrier, the spider gears stand still on their pin, and each wheel pushes as hard as its own grip allows.")
      : kind === "lsd" ? (r.moves ? t("4 · Out, limited-slip: friction plates drag the left side gear along with the carrier, so the dry wheel can take {0} times the slipping wheel's torque: enough here, and the car moves off.", g.bias)
        : t("4 · Out, limited-slip: friction plates drag the left side gear along with the carrier, so the dry wheel can take {0} times the slipping wheel's torque: not enough here, and the left wheel still spins.", g.bias))
      : SURFACE[g.surface].open);
    else explain(kind === "lock" ? t("Locked: the dog collar on the left half-shaft has slid onto the carrier. That side gear must now turn with the carrier, so the spider gears cannot turn and both wheels turn together: each pushes as hard as its own grip allows.")
      : kind === "lsd" ? t("Limited-slip: friction plates between the left side gear and the carrier resist the two sides turning apart. The wheel with grip can take a few times the slipping wheel's torque, here {0} times, without the axle ever going solid.", g.bias)
      : t("Open: the spider gears share the torque equally between the side gears. The slipping wheel can take only a little, so its partner gets just as little, and the spider gears let the slipping wheel spin."));
    angL += wL * K * SLOW * dt; angR += wR * K * SLOW * dt; angC += (wL + wR) / 2 * K * SLOW * dt;
    const full = g.torque / R, size = f => f < 1 ? 0 : 0.45 + 0.55 * Math.min(1, f / full);   // arrow size by the torque carried
    const shownIn = !follow || step < 3, shownOut = !follow || step === 3;   // following: the drive goes in, then out
    if (flowIn) flowIn.size = shownIn ? size(r.total) : 0;
    flowOut[0].size = shownOut ? size(r.fL) : 0; flowOut[1].size = shownOut ? size(r.fR) : 0;
    ui.set("fL", r.fL.toFixed(0)); ui.set("fR", r.fR.toFixed(0)); ui.set("total", r.total.toFixed(0)); ui.set("spin", rpm(wL));
    ui.badge("moves").set(r.moves ? t("Car moves off") : t("Stuck: left wheel spins"), r.moves);
  }

  return {
    layout({ active, onPhoto: photo }) { group.visible = active; onPhoto = photo; },
    update(dt) {
      (p.mode === "corner" ? corner : grip)(dt);
      for (const mt of [...tokenMats, ...wheelMats]) {   // the real wheels show through on the photo; following, parts not in play fade
        const lit = !follow || LIT[step].includes(mt), base = onPhoto && wheelMats.includes(mt) ? 0.12 : mt.userData.opacity;
        mt.opacity = base * (lit ? 1 : 0.15); mt.depthWrite = lit;
      }
      wheels[0].rotation.y = angL / K; wheels[1].rotation.y = angR / K;
      sides[0].rotation.y = angL; sides[1].rotation.y = angR;
      carrier.rotation.y = angC;
      const rel = (angL - angC) * Z_SIDE / Z_SPIDER;
      spiders[0].rotation.z = rel; spiders[1].rotation.z = -rel;
      chainLinks.forEach((c, i) => (c.rotation.y = (i < 2 ? angL : angR) / (i % 2 ? K : 1)));   // [left small, left big, right small, right big]
      pinionSpin.rotation.y = -angC * PIN_X / PIN_R;
      for (const f of flows) drawFlow(f, dt);
      collarSpin.rotation.y = angL; plateSpin.rotation.y = (angL + angC) / 2;
    },
  };
}
