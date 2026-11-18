// Frontal crash into a rigid wall, slowed right down. The front structure folds from the bumper back and soaks up the
// energy over a long distance at a moderate force; the passenger cell stays whole. Compare a stiff front: the car stops
// in a shorter distance, so the force (and the deceleration on the occupants) is far higher, and the cell is pushed in.
// Params (mm, ground at z = 0): label, mass (kg), speed { min, max, value } (km/h), slow (× slower than real),
// cases [{ id, label, zone, cellK }] (lib/model/crash.js; first = safety body), folds (number of fold rings),
// body { bumper, firewall, cellRear, tail, w (half width), sill, belt, roof }, wheels { front, rear, R }, engine? { front,
// back, z0, z1, w (half width), ramp (deg) }: an engine block the folding front reaches and pushes back; in a case with
// `slide: true` (A-Class sandwich floor) it slides down the ramp under the cell floor instead of against the firewall.
import * as THREE from "three";
import { V, rod, place, ball, tyre, mat } from "../lib/scene/helpers.js";
import { simulateCrash } from "../lib/model/crash.js";

const TF = 0.014, NS = "http://www.w3.org/2000/svg";   // m: thickness of one folded ring
const EDGES = [[0, 1], [2, 3], [0, 2], [1, 3]];   // a ring's four tubes between the corners below

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, B = p.body;
  const group = new THREE.Group(), car = new THREE.Group(); carRoot.add(group); group.add(car);
  const xb = m(B.bumper), xf = m(B.firewall), xc = m(B.cellRear), xt = m(B.tail), w = m(B.w), zs = m(B.sill), zb = m(B.belt), zr = m(B.roof);
  const L = xb - xf, N = p.folds, ell = L / N;
  const railMat = stage.tokenMat("--l2"), ringMat = stage.tokenMat("--metal"), tyreMat = mat(0x2a2d31, { roughness: 0.9 });
  const glassOf = () => new THREE.MeshStandardMaterial({ color: 0x8fa3b3, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide });

  // Wall (fixed), wheels and rear section (move with the car).
  const wallGeo = new THREE.BoxGeometry(0.3, 2.6, 1.6); wallGeo.translate(xb + 0.15, 0, 0.8);
  const wall = new THREE.Mesh(wallGeo, stage.tokenMat("--muted", { transparent: true, opacity: 0.55 })); group.add(wall);
  tyreMat.transparent = true;
  for (const x of [p.wheels.front, p.wheels.rear]) for (const s of [1, -1]) { const t = tyre(tyreMat, m(p.wheels.R) - 0.06, 0.06); t.position.set(m(x), s * (w - 0.06), m(p.wheels.R)); car.add(t); }
  const rearGeo = new THREE.BoxGeometry(xc - xt, 2 * w, zb - zs); rearGeo.translate((xc + xt) / 2, 0, (zs + zb) / 2);
  car.add(new THREE.Mesh(rearGeo, glassOf()), new THREE.LineSegments(new THREE.EdgesGeometry(rearGeo), new THREE.LineBasicMaterial({ color: 0x8fa3b3, transparent: true, opacity: 0.5 })));
  // Cell: unit box scaled between the (possibly pushed-in) firewall and the cell's rear.
  const cellGeo = new THREE.BoxGeometry(1, 2 * w, zr - zs); cellGeo.translate(-0.5, 0, (zs + zr) / 2);
  const cellEdge = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 });
  const cell = new THREE.Group(); cell.add(new THREE.Mesh(cellGeo, glassOf()), new THREE.LineSegments(new THREE.EdgesGeometry(cellGeo), cellEdge)); car.add(cell);
  // Occupant: torso and head, leaning with the deceleration.
  const occ = new THREE.Group(); occ.position.set(xf - 0.4 * (xf - xc), 0.35 * w, zs + 0.15); car.add(occ);
  const dummyMat = stage.tokenMat("--accent");
  occ.add(place(rod(dummyMat, 0.09), V(0, 0, 0), V(0, 0, 0.5)), ball(dummyMat, 0.1, V(0, 0, 0.62)));

  // Engine block, pushed back once the folding front reaches it.
  const E = p.engine, eng = E ? new THREE.Mesh(new THREE.BoxGeometry(m(E.front - E.back), 2 * m(E.w), m(E.z1 - E.z0)), stage.tokenMat("--l4", { metalness: 0.3 })) : null;
  if (eng) car.add(eng);
  // Front structure: fold rings and four longitudinal rails that buckle outwards between them.
  const corners = [[w * 0.7, zs], [-w * 0.7, zs], [w * 0.7, zb], [-w * 0.7, zb]];
  const rings = Array.from({ length: N + 1 }, () => corners.map(() => { const r = rod(ringMat, 0.008); car.add(r); return r; }));
  const rails = Array.from({ length: N }, () => corners.map(() => [rod(railMat, 0.012), rod(railMat, 0.012)]));
  rails.flat(2).forEach(r => car.add(r));

  // ---------- state + panel ----------
  let kase = 0, kmh = p.speed.value, sims = [], clock = 0, playing = !ctx.reducedMotion, onPhoto = false;
  const ui = ctx.panel([{ label: p.label, badge: { id: "cell", text: "" }, items: [
    { buttons: p.cases.map((c, i) => ({ id: c.id, label: c.label, pressed: i === 0, onClick: () => { kase = i; p.cases.forEach((k, j) => ui.toggle(k.id).set(j === i)); clock = 0; draw(); } })) },
    { slider: { id: "speed", label: t("Impact speed (km/h)"), min: p.speed.min, max: p.speed.max, step: 5, value: kmh, onInput: v => { kmh = v; run(); clock = 0; } } },
    { readouts: [{ id: "now", label: t("Deceleration now"), unit: t("g") }, { id: "peak", label: t("Peak"), unit: t("g") }, { id: "mean", label: t("Average"), unit: t("g") },
      { id: "crush", label: t("Front crushed"), unit: t("mm") }, { id: "intr", label: t("Cell pushed in"), unit: t("mm") }, { id: "dur", label: t("Crash lasts"), unit: t("ms") }] },
    { svg: { id: "trace", viewBox: "0 0 280 120", aria: t("Deceleration over time for both bodies") } },
    { key: [["--accent", t("this body")], ["--muted", t("the other one")], ["--l2", t("now")]] },
    { buttons: [{ id: "play", toggle: [t("Pause"), t("Play")], pressed: playing, onClick: v => (playing = v) }, { id: "again", label: t("Replay"), onClick: () => (clock = 0) }] },
    { text: t("Shown {0}× slower than real. One mass and two force laws: an illustration, not a crash simulation.", p.slow) },
  ] }, { label: t("Parts"), items: [{ legend: [["--l2", t("Longitudinal members (fold up)")], ["--metal", t("Fold rings")], ["--l3", t("Passenger cell, intact")], ["--l1", t("Cell pushed in")], ["--accent", t("Occupant")], ...(E ? [["--l4", t("Engine")]] : [])] }] }]);

  const svg = ui.el("trace"), el = (tag, a) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(a)) e.setAttribute(k, v); svg.append(e); return e; };
  el("line", { x1: 10, y1: 110, x2: 275, y2: 110, stroke: "var(--rule)" });
  const lines = p.cases.map(() => el("polyline", { fill: "none" })), cursor = el("line", { y1: 8, y2: 110, stroke: "var(--l2)", "stroke-width": 1.4 });
  const scaleTxt = el("text", { x: 14, y: 16, "font-size": 10, fill: "var(--muted)" });
  let tMax = 0.1, gMax = 50;
  function run() {
    sims = p.cases.map(c => simulateCrash({ mass: p.mass, v0: kmh / 3.6, zone: c.zone, cellK: c.cellK }));
    tMax = Math.max(...sims.map(s => s.duration)) * 1.05; gMax = Math.max(...sims.map(s => s.peakG)) * 1.1;
    draw();
  }
  function draw() {
    sims.forEach((s, i) => {
      lines[i].setAttribute("points", s.t.map((tt, k) => `${(10 + tt / tMax * 265).toFixed(1)},${(110 - s.a[k] / gMax * 100).toFixed(1)}`).join(" "));
      lines[i].setAttribute("stroke", i === kase ? "var(--accent)" : "var(--muted)"); lines[i].setAttribute("stroke-width", i === kase ? 2 : 1.2);
    });
    scaleTxt.textContent = t("0 – {0} g over {1} ms", gMax.toFixed(0), (tMax * 1000).toFixed(0));
    const s = sims[kase];
    ui.set("peak", s.peakG.toFixed(0)); ui.set("mean", s.meanG.toFixed(0)); ui.set("crush", (s.crush * 1000).toFixed(0));
    ui.set("intr", (s.intrusion * 1000).toFixed(0)); ui.set("dur", (s.duration * 1000).toFixed(0));
    ui.badge("cell").set(s.intrusion > 0.002 ? t("Cell pushed in") : t("Cell intact"), s.intrusion <= 0.002);
  }
  run();

  // Timeline (s): approach, crash in slow motion, hold, repeat.
  const APPROACH = 1.6, HOLD = 2.2, cEdge = new THREE.Color();
  const sample = (s, tau, key) => { const k = Math.min(s.t.length - 1, Math.floor(tau * 1000)); return s[key][k]; };
  function pose() {
    const s = sims[kase], zone = p.cases[kase].zone, v0 = kmh / 3.6, gap = v0 / p.slow * APPROACH;
    const tau = Math.max(0, (clock - APPROACH) / p.slow), done = tau >= s.duration;
    const d = clock < APPROACH ? 0 : done ? s.crush : sample(s, tau, "x"), g = clock < APPROACH || done ? 0 : sample(s, tau, "a");
    // Over the museum photo the car stays where it stands and the front folds back towards the cell instead.
    car.position.x = onPhoto ? 0 : clock < APPROACH ? -gap + v0 / p.slow * clock : d;
    // The front folds ring by ring from the bumper (which sits on the wall at car-frame x = xb − d); whatever crush is
    // left over once the zone is used up pushes the firewall into the cell.
    const front = Math.min(d, zone.length), intr = d - front;
    const xRing = i => xb - d - Math.max(i * ell - front, i * TF);
    rings.forEach((r, i) => EDGES.forEach(([e0, e1], k) => place(r[k], V(xRing(i), ...corners[e0]), V(xRing(i), ...corners[e1]))));
    rails.forEach((pair, i) => corners.forEach(([y, z], k) => {
      const a = V(xRing(i), y, z), b = V(xRing(i + 1), y, z), bulge = Math.sqrt(Math.max(0, (ell / 2) ** 2 - ((a.x - b.x) / 2) ** 2));
      const mid = V((a.x + b.x) / 2, y + Math.sign(y) * bulge * 0.7, z + (i % 2 ? 1 : -1) * bulge * 0.5);
      place(pair[k][0], a, mid); place(pair[k][1], mid, b);
    }));
    cell.position.x = xf - intr; cell.scale.x = xf - intr - xc;
    if (eng) {
      const push = Math.max(0, d - (xb - m(E.front))), ramp = (E.ramp * Math.PI) / 180, home = [(m(E.front) + m(E.back)) / 2, (m(E.z0) + m(E.z1)) / 2];
      if (p.cases[kase].slide) eng.position.set(home[0] - push * Math.cos(ramp), 0, Math.max(home[1] - push * Math.sin(ramp), m(E.z1 - E.z0) / 2 + 0.03));
      else eng.position.set(home[0] - Math.min(push, m(E.back) - xf + intr), 0, home[1]);
    }
    cellEdge.color.copy(cEdge.copy(stage.color(intr > 0.002 ? "--l1" : "--l3")));
    occ.rotation.y = Math.min(0.6, g / 60);
    ui.set("now", g.toFixed(0));
    const tc = clock < APPROACH ? 0 : Math.min(tau, s.duration);
    cursor.setAttribute("x1", (10 + tc / tMax * 265).toFixed(1)); cursor.setAttribute("x2", (10 + tc / tMax * 265).toFixed(1));
  }
  pose();

  return {
    layout({ active, onPhoto: photo }) { group.visible = active; onPhoto = photo; wall.visible = !photo; tyreMat.opacity = photo ? 0.12 : 1; pose(); },
    update(dt) {
      if (playing) { clock += dt; if (clock > APPROACH + sims[kase].duration * p.slow + HOLD) clock = 0; }
      pose();
    },
  };
}
