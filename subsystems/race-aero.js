// One part's airflow, computed ahead of time (tools/cfd/part.mjs; files: lib/model/part-field.js): a flat grid through the
// part coloured by one quantity, the body's solid cells drawn opaque, mean-flow paths with arrowheads and air drifting
// along them, and the guides that carry the lesson (an arrow for the mean direction in a fixed box, a line across the
// wake or under an edge). Switching case keeps camera, scale, seeds and guides' places: only the air and the part change.
// Params: label, data (folder of field.json and <case>.bin, from the page), cases [{ id, label, say (what the visitor sees
// change) }], start (case id), follow (true: a "Follow the air" toggle that singles out the case's `follow` paths and
// only then shows `say`). With one case there are no case buttons. "Pause airflow" stops the drift; the picture stays.
import * as THREE from "three";
import { V, polyline, at, particles, place, rod } from "../lib/scene/helpers.js";
import { corners, SOLID } from "../lib/model/part-field.js";

const NS = "http://www.w3.org/2000/svg", DOTS = 6;

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, P = q => V(m(q[0]), m(q[1]), m(q[2]));
  const group = new THREE.Group(); group.visible = false; carRoot.add(group);
  let field = null, failed = false, current = p.start, paused = !!ctx.reducedMotion, following = false, active = false, onPhoto = false, clock = 0;
  const bins = new Map(), shown = new Map();   // case id → bytes; case id → its built paths and guides

  // ---------- field (one texture and one quad for every case) ----------
  const tex = new THREE.DataTexture(new Uint8Array(4), 1, 1);
  tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.colorSpace = THREE.SRGBColorSpace;
  const quad = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
  quad.renderOrder = 4; group.add(quad);
  let lut = null;
  const rgb = token => { const c = stage.color(token).getHex(); return [c >> 16, (c >> 8) & 255, c & 255]; };
  const mix = (a, b, f) => a.map((v, k) => Math.round(v + (b[k] - v) * f));
  function buildLut() {
    if (!field) return;
    const [lo, hi] = field.range, zero = Math.max(0, Math.min(254, Math.round(-lo / (hi - lo) * 254)));
    if (field.quantity === "speed-over-inlet") {
      const seq = "--cfd-1 --cfd-2 --cfd-3 --cfd-4 --cfd-5".split(" ").map(rgb), n = seq.length - 1;
      lut = Array.from({ length: 255 }, (_, v) => { const s = v / 254 * n, a = Math.min(n - 1, s | 0); return mix(seq[a], seq[a + 1], s - a); });
    } else {   // diverging about zero: down or suction blue, up or pressing red
      const neg = rgb("--cfd-2"), mid = rgb("--stage"), pos = rgb("--cfd-5");
      lut = Array.from({ length: 255 }, (_, v) => (v < zero ? mix(neg, mid, v / zero) : mix(mid, pos, (v - zero) / Math.max(1, 254 - zero))));
    }
    lut[SOLID] = rgb("--edge");
    paint(); scale();
  }
  function paint() {
    const b = bins.get(current); if (!b || !lut) return;
    const d = new Uint8Array(b.length * 4);
    for (let k = 0; k < b.length; k++) { const c = lut[b[k]]; d.set(c, 4 * k); d[4 * k + 3] = b[k] === SOLID ? 255 : 230; }
    tex.image = { data: d, width: field.width, height: field.height }; tex.needsUpdate = true;
  }
  stage.onTheme(buildLut);

  // ---------- paths and guides (built once per case, then only shown or hidden) ----------
  const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55, depthTest: false }); stage.bind(lineMat.color, "--fg");
  const dimMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.18, depthTest: false }); stage.bind(dimMat.color, "--fg");
  const headMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.7, depthTest: false }); stage.bind(headMat.color, "--fg");
  // Overlays are all in the transparent pass, after the field, so their renderOrder (not depth) puts them on top.
  const markMat = new THREE.MeshBasicMaterial({ transparent: true, depthTest: false }); stage.bind(markMat.color, "--l1");
  const followMat = new THREE.MeshBasicMaterial({ transparent: true, depthTest: false }); stage.bind(followMat.color, "--accent");
  const faintMat = new THREE.LineDashedMaterial({ transparent: true, opacity: 0.7, depthTest: false, dashSize: 0.02, gapSize: 0.014 }); stage.bind(faintMat.color, "--fg");
  const ink = stage.bind(new THREE.Color(), "--fg"), blue = stage.bind(new THREE.Color(), "--accent");
  const sized = () => m(field.cellMm * Math.max(field.width, field.height)) / 60;   // arrowhead and line size: a 60th of the view
  const cone = (mat, a, b, len) => {   // head at b, pointing from a to b
    const c = new THREE.Mesh(new THREE.ConeGeometry(len * 0.38, len, 12), mat), d = b.clone().sub(a).normalize();
    c.quaternion.setFromUnitVectors(V(0, 1, 0), d); c.position.copy(b).addScaledVector(d, -len / 2); c.renderOrder = 8; return c;
  };
  function build(id) {
    const c = field.cases[id], g = new THREE.Group(), s = sized(), follow = new Set(c.follow ?? []);
    const paths = c.lines.map(l => polyline(l.map(P)));
    const lines = paths.map(pl => { const o = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pl.points), lineMat); o.renderOrder = 6; g.add(o); return o; });
    // Arrowheads along each path, so the direction reads with the drift paused.
    paths.forEach(pl => [0.35, 0.7, 0.97].forEach(f => { const a = at(pl, f - 0.03, V()), b = at(pl, f, V()); if (a.distanceTo(b) > 1e-4) g.add(cone(headMat, a, b, s * 1.2)); }));
    // The followed path: a bold accent tube with its start marked.
    const bold = new THREE.Group(); g.add(bold);
    for (const k of follow) {
      const pl = paths[k], tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pl.points), Math.max(8, pl.points.length * 2), s * 0.18, 6), followMat);
      tube.renderOrder = 7; bold.add(tube);
      const start = new THREE.Mesh(new THREE.SphereGeometry(s * 0.55, 16, 12), followMat); start.position.copy(pl.points[0]); start.renderOrder = 8; bold.add(start);
      [0.3, 0.6, 0.97].forEach(f => { const a = at(pl, f - 0.03, V()), b = at(pl, f, V()); bold.add(cone(followMat, a, b, s * 1.8)); });
    }
    for (const gd of c.guides) {
      const pts = gd.points.map(P);
      if (gd.kind === "arrow") {   // shaft and head, bold
        const head = s * 2.4, a = pts[0], b = pts.at(-1), d = b.clone().sub(a).normalize(), neck = b.clone().addScaledVector(d, -head);
        const shaft = place(rod(markMat, s * 0.22), a, neck); shaft.renderOrder = 8; shaft.material.depthTest = false;
        g.add(shaft, cone(markMat, neck, b, head));
      } else if (gd.faint) {
        const o = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), faintMat); o.computeLineDistances(); o.renderOrder = 7; g.add(o);
      } else for (let k = 1; k < pts.length; k++) { const r = place(rod(markMat, s * 0.2), pts[k - 1], pts[k]); r.renderOrder = 8; g.add(r); }
    }
    const dots = particles(paths.length * DOTS, s * 0.9); g.add(dots.pts);
    group.add(g);
    return { g, paths, lines, bold, dots, follow };
  }
  function draw() {   // apply the chosen case as one state, once its data is in
    if (!field || !bins.has(current)) return;
    if (!shown.has(current)) shown.set(current, build(current));
    for (const [id, s] of shown) s.g.visible = id === current;
    const s = shown.get(current);
    s.bold.visible = following;
    s.lines.forEach((l, k) => { l.material = following && !s.follow.has(k) ? dimMat : lineMat; });
    paint(); drift(0);
    const c = p.cases.find(k => k.id === current);
    ui.set("say", p.follow && !following ? "" : c.say);
  }
  function drift(dt) {
    const s = shown.get(current); if (!s) return;
    if (!paused) clock += dt;
    const v = V(), speed = 0.25;   // m/s along each path, for the eye
    s.paths.forEach((pl, i) => {
      for (let k = 0; k < DOTS; k++) {
        const f = ((k / DOTS + i * 0.137 + clock * speed / Math.max(pl.tot, 0.1)) % 1 + 1) % 1;
        s.dots.set(i * DOTS + k, at(pl, f, v), following && s.follow.has(i) ? blue : ink);
      }
    });
    s.dots.flush();
  }

  // ---------- panel ----------
  const cases = p.cases.length > 1 ? [{ buttons: p.cases.map(c => ({ id: c.id, label: c.label, pressed: c.id === p.start, onClick: () => choose(c.id) })) }] : [];
  const ui = ctx.panel([{ label: p.label, items: [
    ...cases,
    { buttons: [
      ...(p.follow ? [{ id: "follow", label: t("Follow the air"), toggle: [t("Follow the air"), t("Follow the air")], pressed: false, onClick: on => { following = on; draw(); } }] : []),
      { id: "pause", label: t("Pause airflow"), toggle: [t("Pause airflow"), t("Pause airflow")], pressed: paused, onClick: on => { paused = on; } },
    ] },
    { text: { id: "say", value: "" } },
    { text: { id: "status", value: t("Loading the airflow…") } },
    { buttons: [{ id: "retry", label: t("Try again"), onClick: () => load() }] },
  ] }, { label: t("Wind tunnel"), detail: true, items: [
    { svg: { id: "scale", viewBox: "0 0 280 40", aria: t("Colour scale") } },
    { legend: [["--edge", t("Solid: the car, cut through")], ["--fg", t("Paths of the mean flow")], ["--l1", t("The measured air")]] },
  ] }]);
  const retry = ui.toggle("retry").el; retry.hidden = true;

  function choose(id) {
    current = id;
    if (cases.length) for (const c of p.cases) ui.toggle(c.id).set(c.id === id);
    draw();
  }

  const SCALES = {
    "vertical-speed-over-inlet": ["--cfd-2 --stage --cfd-5", () => t("air moving down"), () => t("air moving up")],
    "pressure-coefficient": ["--cfd-2 --stage --cfd-5", () => t("suction"), () => t("pressing")],
    "speed-over-inlet": ["--cfd-1 --cfd-2 --cfd-3 --cfd-4 --cfd-5", () => t("still air"), () => t("{0} × road speed", field.range[1])],
  };
  function scale() {
    const [stops, lo, hi] = SCALES[field.quantity], sv = ui.el("scale"), gid = `pcfd-${Math.random().toString(36).slice(2, 8)}`;
    const tag = (n, a, text) => { const e = document.createElementNS(NS, n); for (const [k, x] of Object.entries(a)) e.setAttribute(k, x); if (text) e.textContent = text; return e; };
    const grad = tag("linearGradient", { id: gid });
    stops.split(" ").forEach((tok, i, all) => grad.append(tag("stop", { offset: i / (all.length - 1), style: `stop-color:var(${tok})` })));
    sv.replaceChildren(tag("defs", {}), tag("rect", { x: 2, y: 4, width: 276, height: 14, rx: 3, fill: `url(#${gid})`, stroke: "var(--rule)" }),
      tag("text", { x: 2, y: 34, "font-size": 11, fill: "var(--muted)" }, lo()), tag("text", { x: 278, y: 34, "text-anchor": "end", "font-size": 11, fill: "var(--muted)" }, hi()));
    sv.firstChild.append(grad);
  }

  // The files load in the background; the buttons work from the start and the picture follows when the data is in.
  async function get(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
    return r;
  }
  async function load() {
    failed = false; retry.hidden = true; ui.set("status", t("Loading the airflow…"));
    try {
      const f = field ?? await (await get(`${p.data}field.json`)).json();
      await Promise.all(p.cases.filter(c => !bins.has(c.id)).map(async c => {
        const b = new Uint8Array(await (await get(`${p.data}${c.id}.bin`)).arrayBuffer());
        if (b.length !== f.width * f.height) throw new Error(`${c.id}.bin: ${b.length} bytes, want ${f.width * f.height}`);
        bins.set(c.id, b);
      }));
      if (!field) {
        field = f;
        const [a, b, c, d] = corners(f).map(P), g = quad.geometry;
        g.setAttribute("position", new THREE.Float32BufferAttribute([a, b, c, d].flatMap(v => [v.x, v.y, v.z]), 3));
        g.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 1, 1], 2));
        g.setIndex([0, 1, 3, 0, 3, 2]); g.computeBoundingSphere();
        buildLut();
      }
      ui.set("status", ""); draw();
    } catch (e) {
      failed = true; console.warn("race-aero: airflow not loaded", e);
      ui.set("status", t("The airflow could not load. Check your connection and try again.")); retry.hidden = false;
    }
  }
  load();

  return {
    layout({ active: a, onPhoto: photo }) { active = a; onPhoto = photo; group.visible = active && !onPhoto; },
    update(dt) { if (active && !onPhoto && !failed) drift(dt); },
  };
}
