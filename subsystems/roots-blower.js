// Clutch-engaged Roots supercharger blowing through the carburettor into an inline engine (540 K, SSK).
// Params: blower (lib/model/blower.js params), order (firing order; its length = cylinder count), engineLabel,
// offset? [x, y, z] (m, group position in the car frame), spacing? (m, bore spacing).
import * as THREE from "three";
import { V, mat, rod, place, arc, gear, pipe, polyline, at, particles, glass, line } from "../lib/scene/helpers.js";
import { createBlower, autoPedal, rotorRadius } from "../lib/model/blower.js";
import { layout } from "../lib/model/engine.js";

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx;
  const bl = createBlower(p.blower), B = bl.p, n = p.order.length, throws = layout(p.order).throwA;
  const sp = p.spacing ?? 0.112;
  // Layout (m): blower upright ahead of the block, rotor axes fore-aft, air in at the bottom and out at the top,
  // then forward-to-back through the carburettor into the inlet manifold on the left of the block.
  const BL = { x0: -0.02, x1: -0.2, zc: 0.24, d: 0.1, rc: 0.08, crankZ: 0, blockX0: -0.3 };
  BL.blockX1 = BL.blockX0 - (0.136 + (n - 1) * sp);
  const xb = (BL.x0 + BL.x1) / 2, cylX = i => BL.blockX0 - 0.06 - i * sp;

  const group = new THREE.Group(); group.position.set(...(p.offset ?? [0, 0, 0.12])); carRoot.add(group);
  const caseMat = glass(0x8fa3b3, 0.12), caseEdge = line(0x8fa3b3, 0.6), pipeMat = glass(0x8fa3b3, 0.2);
  pipeMat.side = THREE.FrontSide;
  const rotorMat = mat(0xb8c0c8, { metalness: 0.55, roughness: 0.35 }), gearMat = mat(0x9aa4ad, { metalness: 0.5 }), dark = mat(0x343b42);
  const UVW = new THREE.Matrix4().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1);   // extruded (u, v, w) → car (y, z, x)

  // ---------- rotors and casing ----------
  function rotorGeo() {
    const s = new THREE.Shape();
    for (let i = 0; i <= 160; i++) {
      const ph = i / 160 * Math.PI * 2, rr = rotorRadius(ph, BL.d / 2);
      i ? s.lineTo(rr * Math.cos(ph), rr * Math.sin(ph)) : s.moveTo(rr * Math.cos(ph), rr * Math.sin(ph));
    }
    const g = new THREE.ExtrudeGeometry(s, { depth: BL.x0 - BL.x1 - 0.02, bevelEnabled: false }); g.applyMatrix4(UVW); return g;
  }
  const rotors = [-1, 1].map(side => { const m = new THREE.Mesh(rotorGeo(), rotorMat); m.position.set(BL.x1 + 0.01, side * BL.d / 2, BL.zc); group.add(m); return m; });
  {
    const R = BL.rc, h = BL.d / 2;   // figure-of-eight casing
    const outline = [[-0.035, -0.12], ...arc(-h, 0, R, -90, -270, 40), [-0.035, 0.12], [0.035, 0.12], ...arc(h, 0, R, 90, -90, 40), [0.035, -0.12]];
    const sh = new THREE.Shape(); sh.moveTo(...outline[0]); for (const q of outline.slice(1)) sh.lineTo(...q);
    const g = new THREE.ExtrudeGeometry(sh, { depth: BL.x0 - BL.x1, bevelEnabled: false }); g.applyMatrix4(UVW); g.translate(BL.x1, 0, BL.zc);
    group.add(new THREE.Mesh(g, caseMat), new THREE.LineSegments(new THREE.EdgesGeometry(g, 20), caseEdge));
  }

  // ---------- crank nose, multi-plate clutch, drive gears, block ----------
  const crank = new THREE.Group(); crank.position.set(0, 0, BL.crankZ); group.add(crank);
  crank.add(place(rod(gearMat, 0.03), V(-0.24, 0, 0), V(BL.blockX1 - 0.05, 0, 0)));
  for (let i = 0; i < n; i++) {
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.11), gearMat);
    t.position.set(cylX(i), 0.03 * Math.sin(throws[i]), 0.03 * Math.cos(throws[i])); t.rotation.x = -throws[i]; crank.add(t);
  }
  const bigGear = gear(0.17, 44, 0.025, gearMat); bigGear.position.set(-0.215, 0, BL.crankZ); group.add(bigGear);
  const pinion = gear(0.068, 18, 0.025, gearMat); pinion.position.set(-0.215, 0, BL.zc); group.add(pinion);
  group.add(place(rod(gearMat, 0.014), V(-0.23, -BL.d / 2, BL.zc), V(BL.x1, -BL.d / 2, BL.zc)));
  const plateMat = stage.tokenMat("--l1"), plateMat2 = mat(0x9aa4ad, { metalness: 0.5 });
  const plates = [0, 1, 2, 3].map(i => { const q = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.006, 32), i % 2 ? plateMat : plateMat2); q.rotation.z = Math.PI / 2; group.add(q); return q; });
  {
    const blk = new THREE.BoxGeometry(BL.blockX0 - BL.blockX1, 0.26, 0.52); blk.translate((BL.blockX0 + BL.blockX1) / 2, 0, 0.17);
    group.add(new THREE.Mesh(blk, caseMat), new THREE.LineSegments(new THREE.EdgesGeometry(blk), caseEdge));
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x8fa3b3 });
    for (let i = 0; i < n; i++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.044, 0.003, 6, 28), ringMat); ring.position.set(cylX(i), 0, 0.432); group.add(ring); }
  }

  // ---------- air paths ----------
  const CARB = V(-0.5, 0.2, 0.47), PLENUM = V(-0.55, 0.19, 0.34), MANI_Z = 0.36;
  const RUNNER = i => V(cylX(i), 0.13, 0.36);
  const inletPath = [V(xb, 0, -0.16), V(xb, 0, BL.zc - 0.13)];
  const aroundRotor = side => arc(side * BL.d / 2, 0, 0.066, -90, side < 0 ? -270 : 90, 18).map(([u, v]) => V(xb, u, BL.zc + v));
  const outletPath = [V(xb, 0, BL.zc + 0.13), V(xb, 0, 0.52), V(-0.2, 0.08, 0.6), V(-0.42, 0.18, 0.6), CARB];
  const bypassPath = [V(-0.5, 0.42, 0.66), V(-0.5, 0.32, 0.6), CARB];
  const tail = i => [CARB, PLENUM, V(RUNNER(i).x, 0.19, MANI_Z), RUNNER(i)];
  group.add(pipe(inletPath, 0.03, pipeMat), pipe(outletPath, 0.03, pipeMat), pipe(bypassPath, 0.025, pipeMat));
  group.add(pipe([V(BL.blockX0 + 0.02, 0.19, MANI_Z), V(BL.blockX1 + 0.04, 0.19, MANI_Z)], 0.028, pipeMat));
  for (let i = 0; i < n; i++) group.add(pipe([V(RUNNER(i).x, 0.19, MANI_Z), RUNNER(i)], 0.016, pipeMat));
  const carbBody = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.09, 0.14), mat(0x8a96a1, { metalness: 0.4 })); carbBody.position.copy(CARB).add(V(0, 0, -0.06)); group.add(carbBody);
  const filter = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.07, 24), dark); filter.position.set(xb, 0, -0.18); group.add(filter);
  // Atmospheric inlet flap on the carburettor: open when the blower is out, shut when it is in.
  const flapHinge = new THREE.Group(); flapHinge.position.set(-0.5, 0.42, 0.66); group.add(flapHinge);
  flapHinge.add(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.004, 0.05), mat(0x4a90d9)));

  const ROUTES = { blower: [-1, 1].map(side => [...inletPath, ...aroundRotor(side), ...outletPath]), bypass: [bypassPath] };
  const routeCache = new Map();
  const routeFor = (kind, branch, cyl) => {
    const key = `${kind}${branch}_${cyl}`;
    if (!routeCache.has(key)) routeCache.set(key, polyline([...ROUTES[kind][branch].slice(0, -1), ...tail(cyl)]));
    return routeCache.get(key);
  };
  const NP = 220, cloud = particles(NP); group.add(cloud.pts);
  const parts = Array.from({ length: NP }, (_, i) => ({ s: Math.random(), kind: "bypass", branch: 0, cyl: i % n }));
  const colBypass = stage.bind(new THREE.Color(), "--l4"), colBoost = stage.bind(new THREE.Color(), "--l1"), tmp = new THREE.Vector3();

  let crankA = 0, rotorA = 0, clutchGap = 1, pedal = 0.3, auto = !ctx.reducedMotion, autoT = 0;
  function poseBlower(dt) {
    bl.step(pedal, dt);
    const crankRate = 0.5 + 1.6 * pedal;   // rev/s, slow motion
    crankA += crankRate * 2 * Math.PI * dt;
    rotorA += crankRate * B.ratio * bl.spin * 2 * Math.PI * dt;
    crank.rotation.x = crankA; bigGear.rotation.x = -rotorA / B.ratio; pinion.rotation.x = rotorA;
    rotors[0].rotation.x = -rotorA; rotors[1].rotation.x = Math.PI / 2 + rotorA;
    clutchGap += ((bl.engaged ? 0 : 1) - clutchGap) * Math.min(1, dt * 12);
    plates.forEach((q, i) => { q.position.set(-0.25 + i * (0.008 + 0.006 * clutchGap), 0, BL.crankZ); q.rotation.x = i % 2 ? crankA : -rotorA / B.ratio; });
    flapHinge.rotation.x = -(1 - bl.spin) * 1.2;
    const flow = 0.12 + 0.25 * pedal + 0.35 * bl.spin;   // forced and faster with the blower in
    parts.forEach((q, i) => {
      q.s += flow * dt / routeFor(q.kind, q.branch, q.cyl).tot * 0.35;
      if (q.s >= 1) {
        q.s -= 1; q.cyl = (Math.random() * n) | 0;
        q.kind = bl.spin > 0.5 ? "blower" : "bypass"; q.branch = q.kind === "blower" ? (Math.random() < 0.5 ? 0 : 1) : 0;
      }
      cloud.set(i, at(routeFor(q.kind, q.branch, q.cyl), q.s, tmp), q.kind === "blower" ? colBoost : colBypass);
    });
    cloud.flush();
  }

  // ---------- panel ----------
  const setAuto = on => { auto = on; ui.toggle("auto").set(on); };
  const ui = ctx.panel([
    { label: t("Accelerator"), badge: { id: "clutch", text: t("Clutch open") }, items: [
      { buttons: [{ id: "auto", toggle: [t("Auto demo on"), t("Auto demo off")], pressed: auto, onClick: v => { auto = v; autoT = 0; } },
        { id: "floor", label: t("Floor it"), onClick: () => { setAuto(false); pedal = 1; ui.slider("throttle").set(100); } }] },
      { readouts: [{ id: "power", label: t("Full-load power"), unit: t("PS") }] },
      { key: [["--l4", t("air, blower bypassed")], ["--l1", t("air, pressurised by blower")]] },
      { slider: { id: "throttle", label: t("Pedal position"), min: 0, max: 100, value: 30, onInput: v => { setAuto(false); pedal = v / 100; } }, detail: true },
      { readouts: [{ id: "pedal", label: t("Pedal"), unit: "%" }, { id: "rotor", label: t("Rotor speed"), unit: t("× crank") },
        { id: "boost", label: t("Boost"), unit: t("bar, illustrative") }], detail: true },
      { meter: { id: "boostMeter" }, detail: true },
    ] },
    { label: t("End view of the rotors"), detail: true, items: [{ svg: { id: "rotors", viewBox: "-140 -95 280 190", aria: t("End view of the two-lobe Roots rotors turning in opposite directions, carrying pockets of air from the inlet at the bottom to the outlet at the top") } }] },
  ]);

  // ---------- rotor end view (same profile and phasing as the 3-D rotors; y → right, z → up; 1 unit = 1 mm) ----------
  const svg = ui.el("rotors"), SV = 1000;
  {
    const R = BL.rc * SV, h = BL.d / 2 * SV, nz = Math.sqrt(R * R - (h - 35) ** 2).toFixed(1);
    svg.innerHTML = `<path fill="none" stroke="var(--muted)" stroke-width="2" d="M -35 92 L -35 ${nz} A ${R} ${R} 0 1 1 -35 -${nz} L -35 -92 M 35 -92 L 35 -${nz} A ${R} ${R} 0 1 1 35 ${nz} L 35 92"/>
      <path fill="var(--metal)" stroke="var(--fg)" stroke-width="1"/><path fill="var(--metal)" stroke="var(--fg)" stroke-width="1"/>
      <g>${"<circle r=\"9\"/>".repeat(4)}</g><text x="0" y="90" text-anchor="middle" font-size="10">in</text><text x="0" y="-80" text-anchor="middle" font-size="10">out</text>`;
  }
  const [, rotL, rotR] = svg.querySelectorAll("path"), pockets = svg.querySelector("g").children;
  function rotorPath(cy, ang) {
    let d = "";
    for (let i = 0; i <= 72; i++) {
      const ph = i / 72 * Math.PI * 2, rr = rotorRadius(ph, BL.d / 2) * SV;
      d += (i ? "L" : "M") + (cy + rr * Math.cos(ph + ang)).toFixed(1) + " " + (-rr * Math.sin(ph + ang)).toFixed(1);
    }
    return d + "Z";
  }
  function drawSvg() {
    const aL = -rotorA, aR = Math.PI / 2 + rotorA, h = BL.d / 2 * SV;
    rotL.setAttribute("d", rotorPath(-h, aL)); rotR.setAttribute("d", rotorPath(h, aR));
    // Air pockets sit between lobe tips (local ±90°) and turn with the rotor; shown only on the casing side.
    const col = bl.spin > 0.5 ? "var(--l1)" : "var(--l4)";
    [[-h, aL, Math.PI / 2], [-h, aL, -Math.PI / 2], [h, aR, Math.PI / 2], [h, aR, -Math.PI / 2]].forEach(([cy, a, off], i) => {
      const t = a + off, yy = cy + 0.064 * SV * Math.cos(t), zz = 0.064 * SV * Math.sin(t), c = pockets[i];
      c.setAttribute("cx", yy.toFixed(1)); c.setAttribute("cy", (-zz).toFixed(1)); c.setAttribute("fill", col);
      c.setAttribute("opacity", Math.sign(yy) === Math.sign(cy) && Math.abs(yy) > Math.abs(cy) * 0.6 ? 0.85 : 0);
    });
  }
  poseBlower(0); drawSvg();

  let frameN = 0;
  return {
    layout({ active }) { group.visible = active; },
    update(dt) {
      if (auto) { autoT += dt; pedal = autoPedal(autoT); ui.slider("throttle").set(Math.round(pedal * 100)); }
      poseBlower(dt);
      if (++frameN % 2 === 0) drawSvg();
      ui.set("pedal", Math.round(pedal * 100)); ui.set("rotor", (B.ratio * bl.spin).toFixed(1));
      ui.set("boost", bl.boost.toFixed(2)); ui.set("power", Math.round(bl.power));
      ui.badge("clutch").set(bl.engaged ? t("Clutch engaged") : t("Clutch open"), bl.engaged);
      ui.meter("boostMeter").set(bl.boost / B.boostMax, bl.spin > 0.5);
    },
  };
}
