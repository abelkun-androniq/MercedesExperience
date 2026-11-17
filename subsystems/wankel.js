// Wankel rotary engine: triangular rotors turning inside two-lobed housings on one eccentric shaft. Each rotor turns at a
// third of shaft speed while its centre circles on the eccentric, so its three tips stay on the housing; the three
// chambers between rotor and housing each run intake, compression, power and exhaust. The end view colours the
// chambers of rotor 1 by stroke.
// Params (mm): label, geometry { e, R, b, flank } (lib/model/wankel.js), compression (quoted ratio), rotors (count),
// spacing (along x), phases (deg of shaft per rotor), origin [x, y, z] (shaft centre of rotor 1), speed { min, max, value }
// (shown rpm, slow motion), realRpm.
import * as THREE from "three";
import { V, rod, place, ball } from "../lib/scene/helpers.js";
import { housing, rotorCentre, apexAngle, flank, chamberOutline, chamberVolume, strokeOf, compressionRatio } from "../lib/model/wankel.js";

const TOKEN = { Power: "--l1", Exhaust: "--metal", Intake: "--l4", Compression: "--l2" }, TAU = 2 * Math.PI, NS = "http://www.w3.org/2000/svg";

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000;
  const STROKE_NAME = { Power: t("Power"), Exhaust: t("Exhaust"), Intake: t("Intake"), Compression: t("Compression") };
  const g = Object.fromEntries(Object.entries(p.geometry).map(([k, v]) => [k, m(v)]));
  const group = new THREE.Group(); carRoot.add(group);
  const [ox, oy, oz] = p.origin.map(m), sp = m(p.spacing), phases = p.phases.map(d => d * Math.PI / 180);
  const shape = pts => new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const housingPts = Array.from({ length: 120 }, (_, i) => housing(i / 120 * TAU, g));
  const outer = new THREE.Shape(Array.from({ length: 48 }, (_, i) => { const a = i / 48 * TAU; return new THREE.Vector2((g.R + g.e + 0.03) * Math.cos(a), (g.R + 0.02) * Math.sin(a)); }));
  outer.holes.push(new THREE.Path(housingPts.map(([x, y]) => new THREE.Vector2(x, y))));
  const housingGeo = new THREE.ExtrudeGeometry(outer, { depth: g.b, bevelEnabled: false }); housingGeo.translate(0, 0, -g.b / 2);
  // Rotor at θ = 0, relative to its own centre (it then only moves and turns rigidly).
  const c0 = rotorCentre(0, g), rotorPts = [0, 1, 2].flatMap(k => flank(0, k, g).slice(0, -1).reverse()).map(([x, y]) => [x - c0[0], y - c0[1]]);
  const rotorGeo = new THREE.ExtrudeGeometry(shape(rotorPts), { depth: g.b * 0.94, bevelEnabled: false }); rotorGeo.translate(0, 0, -g.b * 0.47);
  const housingMat = new THREE.MeshStandardMaterial({ color: 0x8fa3b3, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x8fa3b3, transparent: true, opacity: 0.55 });
  const rotorMat = stage.tokenMat("--metal", { metalness: 0.45 }), eccMat = stage.tokenMat("--l4"), plugMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  stage.onTheme(() => plugMat.color.copy(stage.color("--l1")));

  // Each unit is drawn in its own plane: local x = model x (up the major axis, scene z), local y = model y (scene y),
  // local z = along the shaft (scene −x).
  const units = Array.from({ length: p.rotors }, (_, i) => {
    const plane = new THREE.Group(); plane.position.set(ox - i * sp, oy, oz); plane.rotation.y = -Math.PI / 2; group.add(plane);
    plane.add(new THREE.Mesh(housingGeo, housingMat), new THREE.LineSegments(new THREE.EdgesGeometry(housingGeo, 30), edgeMat));
    const rotor = new THREE.Mesh(rotorGeo, rotorMat), ecc = new THREE.Mesh(new THREE.CylinderGeometry(0.4 * g.R, 0.4 * g.R, g.b * 0.98, 32), eccMat);
    ecc.rotation.x = Math.PI / 2; plane.add(rotor, ecc);
    const plug = place(rod(rotorMat, 0.006), V(0, -(g.R - g.e) - 0.005, 0), V(0, -(g.R - g.e) - 0.05, 0)), spark = ball(plugMat, 0.012, V(0, -(g.R - g.e) + 0.004, 0));
    plane.add(plug, spark);
    return { rotor, ecc, spark, phase: phases[i] ?? 0 };
  });
  group.add(place(rod(stage.tokenMat("--l4"), 0.012), V(ox + 0.12, oy, oz), V(ox - (p.rotors - 1) * sp - 0.12, oy, oz)));

  // ---------- panel ----------
  let theta = 0, playing = !ctx.reducedMotion, rpm = p.speed.value;
  const ui = ctx.panel([{ label: p.label, items: [
    { cells: { id: "rotors", labels: units.map((_, i) => t("Rotor {0}, chamber A", i + 1)) } },
    { key: [["--l1", t("power")], ["--metal", t("exhaust")], ["--l4", t("intake")], ["--l2", t("compression")]] },
    { readouts: [{ id: "shaft", label: t("Eccentric shaft"), unit: t("deg") }, { id: "rot", label: t("Rotor 1"), unit: t("deg, a third as fast") },
      { id: "vol", label: t("Chamber A of rotor 1"), unit: t("cm³") }, { id: "cr", label: t("Compression"), unit: t(": 1 (model)") }, { id: "real", label: t("Real engine"), unit: t("rpm at full power"), value: String(p.realRpm) }] },
    { slider: { id: "rpm", label: t("Speed (slow motion)"), min: p.speed.min, max: p.speed.max, value: rpm, onInput: v => (rpm = v) } },
    { buttons: [{ id: "play", toggle: [t("Pause"), t("Play")], pressed: playing, onClick: v => (playing = v) }] },
  ] }, { label: t("End view of rotor 1"), items: [
    { svg: { id: "end", viewBox: "-140 -120 280 240", aria: t("Rotor 1 seen end-on with its three chambers coloured by stroke") } },
    { text: t("Intake and exhaust ports on the left, spark plugs at the right waist. Three power strokes per rotor turn, one per shaft turn.") },
  ] }]);
  ui.set("cr", compressionRatio(g).ratio.toFixed(1));

  // End view: model x up the page, model y to the left (as seen from the front of the engine).
  const svg = ui.el("end"), S = 1000, pt = ([x, y]) => `${(-y * S).toFixed(1)},${(-x * S).toFixed(1)}`;
  const el = (tag, a, text) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(a)) e.setAttribute(k, v); if (text) e.textContent = text; svg.append(e); return e; };
  const chambers = [0, 1, 2].map(() => el("polygon", { "fill-opacity": 0.55, stroke: "none" }));
  el("polygon", { points: housingPts.map(pt).join(" "), fill: "none", stroke: "var(--fg)", "stroke-width": 2 });
  const rotorEl = el("polygon", { fill: "var(--metal)", "fill-opacity": 0.35, stroke: "var(--metal)", "stroke-width": 1.5 });
  const eccEl = el("circle", { r: 0.4 * g.R * S, fill: "none", stroke: "var(--l4)", "stroke-width": 1.5 });
  el("circle", { cx: 0, cy: 0, r: 4, fill: "var(--fg)" });
  el("text", { x: (g.R - g.e) * S + 8, y: 4, "font-size": 11, fill: "var(--l1)" }, t("plugs"));
  el("text", { x: -(g.R - g.e) * S - 8, y: 36, "text-anchor": "end", "font-size": 11, fill: "var(--l4)" }, t("in"));
  el("text", { x: -(g.R - g.e) * S - 8, y: -30, "text-anchor": "end", "font-size": 11, fill: "var(--muted)" }, t("out"));
  const labels = [0, 1, 2].map(k => el("text", { "font-size": 12, "text-anchor": "middle", fill: "var(--fg)" }, "ABC"[k]));

  function pose() {
    for (const u of units) {
      const th = theta + u.phase, c = rotorCentre(th, g);
      u.rotor.position.set(c[0], c[1], 0); u.rotor.rotation.z = th / 3;
      u.ecc.position.set(c[0], c[1], 0);
      const strokes = [0, 1, 2].map(k => strokeOf(th, k)), a = strokes[0];
      u.spark.visible = strokes.some(s => s.stroke === "Power" && s.f < 0.12);
      ui.cells("rotors").set(units.indexOf(u), STROKE_NAME[a.stroke], a.stroke === "Power");
    }
    const th = theta + units[0].phase, c = rotorCentre(th, g);
    [0, 1, 2].forEach(k => {
      const s = strokeOf(th, k).stroke;
      chambers[k].setAttribute("points", chamberOutline(th, k, g, 24).map(pt).join(" ")); chambers[k].setAttribute("fill", `var(${TOKEN[s]})`);
      const h = housing(apexAngle(th, k) + Math.PI / 3, g), f = flank(th, k, g, 16)[8], mid = [(h[0] + f[0]) / 2, (h[1] + f[1]) / 2];   // between housing and flank
      labels[k].setAttribute("x", (-mid[1] * S).toFixed(1)); labels[k].setAttribute("y", (-mid[0] * S + 4).toFixed(1));
    });
    rotorEl.setAttribute("points", [0, 1, 2].flatMap(k => flank(th, k, g, 10).slice(0, -1).reverse()).map(pt).join(" "));
    eccEl.setAttribute("cx", (-c[1] * S).toFixed(1)); eccEl.setAttribute("cy", (-c[0] * S).toFixed(1));
    ui.set("shaft", ((theta * 180 / Math.PI) % 360).toFixed(0)); ui.set("rot", ((theta * 60 / Math.PI) % 360).toFixed(0));
    ui.set("vol", (chamberVolume(th, 0, g) * 1e6).toFixed(0));
  }
  pose();
  return {
    layout({ active }) { group.visible = active; },
    update(dt) { if (playing) theta += dt * rpm / 60 * TAU; pose(); },
  };
}
