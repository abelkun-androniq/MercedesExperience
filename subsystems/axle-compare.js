// Three rear axles compared from behind (lib/model/axles.js): a rigid axle (one beam through both wheels), a swing axle
// (each half-shaft hinged near the middle) and the car's own multi-link (lib/model/linkage.js), each in three situations:
// a bump under the left wheel (the body held level by the rest of the car), a steady bend to the right (quasi-static roll
// and jacking; the left wheel is the outer one) and a rough road (one quarter-car per wheel, lib/model/quarter-car.js,
// with the visitor's springs and dampers). Each wheel's plane is drawn against the upright, with its footprint on the road.
// The demo runs each situation with every axle in turn.
// Params (mm unless noted; frame z = 0 at wheel-centre height): label, halfTrack, wheelR, tyre [ring R, section r],
// wheelY (tyre centre outboard of the carrier origin), pivot (swing-axle hinge from the centre), beamSprings (rigid axle:
// springs this far from the centre), links [{ b, c }] and spring { link, at, topOffset } (multi-link, as in
// linkage-suspension), bend { m (kg on the axle), g (side acceleration, in g), hcg (centre of gravity above the ground),
// hrcRigid (the rigid axle's roll centre: its side-locating rod), bar (anti-roll bar, N·mm/rad), compliance (multi-link:
// toe-in of the outer wheel per kN of side force, deg) }, unsprung { rigid, swing, multilink } (kg per wheel),
// springs [min, max, value] (N/mm at the wheel), dampers [min, max, value] (N·s/m), kmh.
import * as THREE from "three";
import { V, mm, mat, rod, place, ball, helix, tyre } from "../lib/scene/helpers.js";
import { createLinkage, rotm } from "../lib/model/linkage.js";
import { createCorner } from "../lib/model/quarter-car.js";
import { swing, rigid, rollCentre, bend, roughRoad, ROUGH_PERIOD } from "../lib/model/axles.js";

const TYPES = ["rigid", "swing", "multilink"], CASES = ["bump", "bend", "road"];
const DUR = { bump: 4, bend: 6, road: 9 };   // s per axle in each situation (the demo); bump and bend repeat on this cycle
const SLOW = 0.25, LAG = 7, BUMP = 60;      // road shown 4× slower; the right wheel meets the road 7 m after the left; bump (mm)
const DEG = 180 / Math.PI;

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, T = p.halfTrack, Rw = p.wheelR, G = { halfTrack: T, wheelR: Rw, pivot: p.pivot };
  const lk = createLinkage({ W0: [0, T, 0], links: p.links, wheelR: Rw });
  const mlTrack = (() => { let q = [0, 0, 0, 0, 0, 0]; return s => { q = lk.solve(q, s); return lk.angles(q).track; }; })();
  const HRC = { rigid: p.bend.hrcRigid, swing: rollCentre(s => swing(G, s).track, T), multilink: rollCentre(mlTrack, T) };
  const qs = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];   // multi-link pose per side, warm-started frame to frame

  // ---------- materials ----------
  const metal = stage.tokenMat("--metal"), guide = stage.tokenMat("--l1"), springMat = stage.tokenMat("--l4"), damperMat = stage.tokenMat("--l2");
  const dark = mat(0x343b42), hubMat = mat(0x5b6670, { metalness: 0.4 }), tyreMat = mat(0x22272b, { roughness: 0.9, transparent: true });
  const footMat = stage.tokenMat("--l3"), groundMat = stage.tokenMat("--edge", { transparent: true, opacity: 0.5 }), forceMat = stage.tokenMat("--l5");
  const planeMat = stage.tokenMat("--accent"), uprightMat = stage.tokenMat("--fg", { transparent: true, opacity: 0.35 });
  const LINE = 1.2;   // m: the wheel's plane and the upright drawn this far up from the road, so a few degrees show

  // ---------- one axle type: two mirrored sides, each with a wheel carrier ----------
  const group = new THREE.Group(); carRoot.add(group);
  const yT = m(p.wheelY);
  function sideOf(parent, mirror) {
    const g = new THREE.Group(); if (mirror) g.scale.y = -1; parent.add(g);
    const carrier = new THREE.Group(); g.add(carrier);
    const w = tyre(tyreMat, m(p.tyre[0]), m(p.tyre[1])); w.position.y = yT; carrier.add(w);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.012, 32), hubMat); hub.position.y = yT - 0.03; carrier.add(hub);
    carrier.add(place(rod(planeMat, 0.006), V(0, yT, -m(Rw)), V(0, yT, LINE - m(Rw))));   // the wheel's plane, drawn on up
    const foot = new THREE.Object3D(); foot.position.set(0, yT, -m(Rw)); carrier.add(foot);
    const spring = new THREE.Mesh(new THREE.BufferGeometry(), springMat), outer = rod(damperMat, 0.022), inner = rod(damperMat, 0.009), pad = ball(dark, 0.03);
    g.add(spring, outer, inner, pad);
    return { g, carrier, foot, spring, outer, inner, pad, parts: {} };
  }
  // Spring with a damper inside: the damper body hangs from the top, its rod reaches down to the seat.
  function strut(s, seat, top) {
    s.spring.geometry.dispose(); s.spring.geometry = helix(seat, top, 6, 0.05);
    const d = new THREE.Vector3().subVectors(seat, top), len = d.length();
    place(s.outer, top, top.clone().addScaledVector(d, Math.min(0.6, 0.17 / len))); place(s.inner, seat, top); s.pad.position.copy(top);
  }
  const axles = Object.fromEntries(TYPES.map(type => { const a = new THREE.Group(); group.add(a); return [type, { group: a, sides: [sideOf(a, false), sideOf(a, true)] }]; }));

  // Rigid: a beam through both wheel centres with the differential on it; springs on the beam.
  const diffBox = () => new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.2), metal);
  const beamDiff = diffBox(); axles.rigid.group.add(beamDiff);
  for (const s of axles.rigid.sides) { s.parts.beam = rod(guide, 0.035); s.g.add(s.parts.beam); }
  // Swing: the differential on the body; each half-shaft (in its tube) hinged beside it.
  const swingDiff = diffBox(); axles.swing.group.add(swingDiff);
  for (const s of axles.swing.sides) { s.parts.tube = rod(guide, 0.03); s.g.add(s.parts.tube, ball(dark, 0.04, V(0, m(p.pivot), 0))); }
  // Multi-link: the differential on the body; five links from the body to the carrier.
  const mlDiff = diffBox(); axles.multilink.group.add(mlDiff);
  for (const s of axles.multilink.sides) s.parts.links = p.links.map(L => { const o = { rod: rod(guide, 0.012), b: ball(dark, 0.018, mm(L.b)), c: ball(guide, 0.02) }; s.g.add(o.rod, o.b, o.c); return o; });
  const S = p.spring, seatFrom = mm(p.links[S.link].b);
  const mlTop = seatFrom.clone().lerp(mm(p.links[S.link].c), S.at).add(mm(S.topOffset));
  const R4 = new THREE.Matrix4();

  // Side force in the bend: an arrow at the centre of gravity, pushing the body outwards (to the left).
  const arrow = new THREE.Group(), zcg = m(p.bend.hcg - Rw);
  const shaft = rod(forceMat, 0.015), head = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.1, 16), forceMat);
  arrow.add(shaft, head); group.add(arrow);

  // ---------- the road under each wheel, seen from behind ----------
  const world = new THREE.Group(); stage.scene.add(world);
  const ground = [0, 1].map(() => {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.42, 0.05), groundMat);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1, 0.008), footMat);
    const up = place(rod(uprightMat, 0.005), V(0, 0, 0), V(0, 0, LINE));
    world.add(plank, foot, up); return { plank, foot, up };
  });

  // ---------- state + panel ----------
  let type = "rigid", kase = "bump", auto = !ctx.reducedMotion, clock = 0, onPhoto = false, said = "";
  let k = p.springs[2], c = p.dampers[2], road = null;
  const name = { rigid: t("Rigid axle"), swing: t("Swing axle"), multilink: t("Five-link") };
  const ui = ctx.panel([{ label: p.label, badge: { id: "type", text: "" }, items: [
    { buttons: TYPES.map(id => ({ id, label: name[id], pressed: id === type, onClick: () => pick(id, kase) })) },
    { buttons: [{ id: "bump", label: t("Bump under the left wheel"), pressed: true, onClick: () => pick(type, "bump") },
      { id: "bend", label: t("Bend to the right"), pressed: false, onClick: () => pick(type, "bend") },
      { id: "road", label: t("Bumpy road"), pressed: false, onClick: () => pick(type, "road") }] },
    { text: { id: "how", value: "" } },
    { readouts: [{ id: "camL", label: t("Left wheel leans"), unit: t("deg to the road, − = top in") }, { id: "camR", label: t("Right wheel leans"), unit: t("deg to the road, − = top in") },
      { id: "toe", label: t("Left wheel toe"), unit: t("deg, + = in") }, { id: "scrub", label: t("Left footprint slides"), unit: t("mm sideways") },
      { id: "roll", label: t("Body roll"), unit: t("deg") }, { id: "lift", label: t("Body lifted"), unit: t("mm") },
      { id: "bounce", label: t("Body bounce"), unit: t("m/s², peak per lap") }, { id: "load", label: t("Lowest tyre load"), unit: t("% of static") }] },
    { slider: { id: "spring", label: t("Springs: soft → firm (N/mm at the wheel)"), min: p.springs[0], max: p.springs[1], step: 1, value: k, onInput: v => { k = v; } } },
    { slider: { id: "damper", label: t("Dampers: weak → strong (N·s/m)"), min: p.dampers[0], max: p.dampers[1], step: 100, value: c, onInput: v => { c = v; } } },
    { text: t("Soft springs ride calmly but let the body roll further in a bend; firm springs roll less but pass every bump on. Weak dampers let body and wheels go on bouncing; strong ones make each bump hit hard. Try them on the bumpy road and in the bend.") },
    { buttons: [{ id: "auto", toggle: [t("Auto demo on"), t("Auto demo off")], pressed: auto, onClick: v => (auto = v) }] },
    { key: [["--accent", t("each wheel's plane")], ["--muted", t("upright")], ["--l3", t("tyre footprint: narrower as the wheel leans (illustrative)")], ["--l5", t("side force in the bend")]] },
  ] }, { label: t("Parts"), items: [{ legend: [["--l1", t("What guides each wheel: the beam, the half-shaft tubes or the five links")], ["--l4", t("Springs")], ["--l2", t("Dampers")], ["--metal", t("Differential")]] }] }]);

  function pick(ty, ks) {   // the visitor's choice stops the demo
    if (auto) { auto = false; ui.toggle("auto").set(false); }
    show(ty, ks);
  }
  function show(ty, ks) {
    if (ty !== type || ks !== kase) { clock = 0; if (ks === "road") road = null; }
    type = ty; kase = ks;
    for (const id of TYPES) { ui.toggle(id).set(id === ty); axles[id].group.visible = id === ty; }
    for (const id of CASES) ui.toggle(id).set(id === ks);
    ui.badge("type").set(name[ty], ty === "multilink");
  }

  // Bumpy road: one quarter-car per wheel, the right one 7 m behind; peaks kept per lap of the road loop.
  function newRoad() {
    const rp = { ms: ctx.ride.ms, mu: p.unsprung[type], ks: k * 1000, cs: c, kt: ctx.ride.kt };
    return { rp, L: createCorner(rp), R: createCorner(rp), dist: 0, lap: 0, acc: 0, low: 100, shown: null };
  }
  function drive(dt) {
    road ??= newRoad();
    road.rp.ks = k * 1000; road.rp.cs = c;
    let h = dt * SLOW;
    const v = p.kmh / 3.6;
    while (h > 1e-9) {
      const d = Math.min(0.0005, h); h -= d; road.dist += v * d;
      const v0 = (road.L.vs + road.R.vs) / 2;
      road.L.step(roughRoad(road.dist), d); road.R.step(roughRoad(road.dist - LAG), d);
      road.acc = Math.max(road.acc, Math.abs((road.L.vs + road.R.vs) / 2 - v0) / d);
      road.low = Math.min(road.low, road.L.load / road.L.fStatic * 100, road.R.load / road.R.fStatic * 100);
      const lap = Math.floor(road.dist / ROUGH_PERIOD);
      if (lap !== road.lap) { road.shown = { acc: road.acc, low: road.low }; road.lap = lap; road.acc = 0; road.low = 100; }
    }
    const r = road.shown ?? { acc: road.acc, low: road.low };
    return { sL: (road.L.zu - road.L.zs) * 1000, sR: (road.R.zu - road.R.zs) * 1000, heave: (road.L.zs + road.R.zs) / 2,
      roll: (road.R.zs - road.L.zs) / m(2 * T), zr: [road.L.zr, road.R.zr], bounce: r.acc, low: Math.max(0, r.low) };
  }

  show(type, kase);

  // ---------- each frame ----------
  const smooth = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
  const tmp = new THREE.Vector3();
  function kin(ty, side, s, other) {
    if (ty === "rigid") return rigid(G, s, other);
    if (ty === "swing") return swing(G, s);
    qs[side] = lk.solve(qs[side], s); return lk.angles(qs[side]);
  }
  function poseSide(ty, side, s, other, a) {
    const sd = axles[ty].sides[side];
    if (ty === "multilink") {
      const q = qs[side], R = rotm(q.slice(3));
      R4.set(R[0], R[1], R[2], 0, R[3], R[4], R[5], 0, R[6], R[7], R[8], 0, 0, 0, 0, 1);
      sd.carrier.quaternion.setFromRotationMatrix(R4); sd.carrier.position.set(m(q[0]), m(T + q[1]), m(q[2]));
      sd.parts.links.forEach((o, i) => { const cp = mm(lk.carrierPoint(q, lk.links[i].cl, R)); place(o.rod, mm(p.links[i].b), cp); o.c.position.copy(cp); });
      strut(sd, seatFrom.clone().lerp(mm(lk.carrierPoint(q, lk.links[S.link].cl, R)), S.at), mlTop);
      return;
    }
    const th = -a.camber / DEG;   // the carrier's tilt about x (+ = top inboard)
    sd.carrier.rotation.set(th, 0, -a.toe / DEG);
    if (ty === "swing") {
      const arm = T - p.pivot, piv = V(0, m(p.pivot), 0), wc = V(0, m(p.pivot + arm * Math.cos(th)), m(s));
      sd.carrier.position.copy(wc); place(sd.parts.tube, piv, wc);
      const seat = piv.clone().lerp(wc, 0.75); strut(sd, seat, V(0, seat.y, 0.3));
    } else {
      const mid = V(0, 0, m((s + other) / 2)), wc = mid.clone().add(V(0, m(T) * Math.cos(th), m(T) * Math.sin(th)));
      sd.carrier.position.copy(wc); place(sd.parts.beam, mid, wc);
      const seat = mid.clone().lerp(wc, p.beamSprings / T); strut(sd, seat, V(0, m(p.beamSprings), 0.3));
      if (side === 0) { beamDiff.position.copy(mid); beamDiff.rotation.x = th; }
    }
  }

  return {
    layout({ active, onPhoto: photo }) {
      onPhoto = photo; group.visible = active; world.visible = active && !photo;
      tyreMat.opacity = photo ? 0 : 0.9;
    },
    update(dt) {
      if (onPhoto) { show(type, kase); for (const s of [0, 1]) poseSide(type, s, 0, 0, kin(type, s, 0, 0)); arrow.visible = false; return; }
      clock += dt;
      if (auto && clock > DUR[kase]) {   // the next axle, then the next situation
        const i = TYPES.indexOf(type);
        show(TYPES[(i + 1) % 3], i === 2 ? CASES[(CASES.indexOf(kase) + 1) % 3] : kase);
      }
      const u = clock % DUR[kase];
      // Body pose (roll towards the left wheel, rad; lift and heave, m), travel of each wheel (mm) and the road under it (m).
      let sL = 0, sR = 0, roll = 0, heave = 0, rcz = 0, zr = [0, 0], side = 0, extra = {};
      if (kase === "bump") {
        sL = u < 0.4 || u > 3.2 ? 0 : BUMP * Math.sin(Math.PI * (u - 0.4) / 2.8) ** 2; zr = [m(sL), 0];
      } else if (kase === "bend") {
        const g = p.bend.g * 9.81 * smooth(u / 1.5) * (1 - smooth((u - 4) / 1.5));
        const b = bend({ m: p.bend.m, ay: g, hcg: p.bend.hcg, hrc: HRC[type], k, bar: p.bend.bar, halfTrack: T,
          springHalf: type === "rigid" ? p.beamSprings : T, independent: type !== "rigid" });
        sL = b.outer; sR = b.inner; roll = b.roll; heave = m(b.lift); rcz = m(HRC[type] - Rw); side = g / 9.81;
        extra = { lift: b.lift };
      } else {
        const r = drive(dt); sL = r.sL; sR = r.sR; roll = r.roll; heave = r.heave; zr = r.zr; extra = { bounce: r.bounce, low: r.low };
      }
      // The body rolls about the roll centre and rises by the lift; the viewer reset carRoot this frame.
      carRoot.rotation.x = -roll; carRoot.position.set(0, -Math.sin(roll) * rcz, rcz * (1 - Math.cos(roll)) + heave);
      const aL = kin(type, 0, sL, sR), aR = kin(type, 1, sR, sL);
      // The multi-link's bushes give a little under side force: the outer wheel toes in, the inner one out.
      if (type === "multilink" && side) { const toe = p.bend.compliance * p.bend.m * side * 9.81 / 2 / 1000; aL.toe += toe; aR.toe -= toe; }
      poseSide(type, 0, sL, sR, aL); poseSide(type, 1, sR, sL, aR);
      arrow.visible = kase === "bend" && side > 0.02;
      if (arrow.visible) { const len = 0.5 * side / p.bend.g, a0 = V(0, -0.1, zcg), a1 = V(0, -0.1 + len, zcg); place(shaft, a0, a1); head.position.copy(a1).add(V(0, 0.05, 0)); }   // the cone points along +y

      // Leaning to the road: the body's roll tilts each wheel with it (the left one outwards when the body rolls left).
      const camL = aL.camber + roll * DEG, camR = aR.camber - roll * DEG;
      carRoot.updateMatrixWorld(true);
      [[0, camL], [1, camR]].forEach(([i, cam]) => {
        const f = axles[type].sides[i].foot.getWorldPosition(tmp), gz = -m(Rw) + zr[i], gr = ground[i];
        gr.plank.position.set(0, f.y, gz - 0.025);
        gr.foot.position.set(0, f.y, gz + 0.005); gr.foot.scale.y = 0.15 * Math.max(0.35, 1 - Math.abs(cam) / 7);
        gr.up.position.set(0, f.y, gz + LINE / 2);
      });

      explain();
      const dash = "–", fix = (v, n) => (Math.abs(v) < 0.5 * 10 ** -n ? 0 : v).toFixed(n);   // no "-0.0"
      ui.set("camL", fix(camL, 1)); ui.set("camR", fix(camR, 1)); ui.set("toe", fix(aL.toe, 2)); ui.set("scrub", kase === "bend" ? dash : fix(aL.track, 0));
      ui.set("roll", kase === "bump" ? dash : fix(roll * DEG, 1)); ui.set("lift", kase === "bend" ? extra.lift.toFixed(0) : dash);
      ui.set("bounce", kase === "road" ? extra.bounce.toFixed(1) : dash); ui.set("load", kase === "road" ? extra.low.toFixed(0) : dash);
    },
  };

  function explain() {
    const say = {
      "bump:rigid": t("Rigid axle over a bump: one beam joins both wheels, so when the left wheel rises the beam tilts and the right wheel leans too. A bump on one side unsettles both, and the heavy beam and differential move with every bump."),
      "bump:swing": t("Swing axle over a bump: each half-shaft swings about a hinge beside the differential, and the wheel stays square to it. The wheel leans in and its footprint slides sideways: on a bumpy road the tyre is dragged back and forth. The other wheel stays put."),
      "bump:multilink": t("Five-link over a bump: five rods guide the wheel carrier on a path chosen by the engineers. The wheel leans in only a little, its footprint hardly moves sideways and the other wheel is not disturbed."),
      "bend:rigid": t("Rigid axle in a bend: the beam lies flat on the road, so both tyres stay upright: good for grip. But its springs sit close together on the beam, so the body rolls further."),
      "bend:swing": t("Swing axle in a bend: the side force pushes through the high hinges and lifts the body. Both wheels drop and lean in at the bottom, the loaded outer one tucking under: grip falls away suddenly and the tail can slide out."),
      "bend:multilink": t("Five-link in a bend: the body rolls but hardly lifts, the loaded outer wheel leans out less than the swing axle's, and its bushes let it turn slightly in, which steadies the tail."),
      "road:rigid": t("Rigid axle on a bumpy road: the heavy beam bounces, so tyre load swings widely and grip comes and goes; each bump also tilts the other wheel."),
      "road:swing": t("Swing axle on a bumpy road: the lighter half-shafts follow the road better than a beam, but every bump tilts the wheel and slides its footprint sideways."),
      "road:multilink": t("Five-link on a bumpy road: light, each wheel moving on its own and almost upright. Now try the springs and dampers below."),
    }[`${kase}:${type}`];
    if (say !== said) { said = say; ui.set("how", say); }
  }
}
