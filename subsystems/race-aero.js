// Racing aerodynamics from a 3-D wind tunnel computed ahead of time (tools/cfd/: a simplified whole car, moving road,
// lattice Boltzmann). One button per case: the baseline and one changed part each. The stage keeps camera, speed and colour
// scale fixed and shows the mean flow on two slices (the centre plane, and across the car just behind the front wheel),
// streamlines with air drifting along them, a marker on the changed part, and arrows for what the change does: extra
// drag (rearward, behind the car) and extra load pressing each axle down (or lifting it).
// Params: label, data (folder of cfd.json and <case>.bin, from the page; tools/cfd/export.mjs), speed (km/h of the
// readouts), cases [{ id, label, part: [x, y, z] (mm, marker), say (what the visitor sees change) }], start (case id).
// Readouts and arrows show the mean change over both grids (cfd.json `est`); changes the tunnel could not separate from its
// own noise (`settled`) read "–".
import * as THREE from "three";
import { V, polyline, at, particles } from "../lib/scene/helpers.js";

const NS = "http://www.w3.org/2000/svg", SEQ = "--cfd-1 --cfd-2 --cfd-3 --cfd-4 --cfd-5".split(" ");
const KG = 50 / 0.6;   // arrow scale: kg of load per metre of arrow (60 cm for 50 kg)

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000;
  const group = new THREE.Group(); carRoot.add(group);
  const q = 0.5 * 1.2 * (p.speed / 3.6) ** 2;   // dynamic pressure at the readout speed (Pa)

  // ---------- arrows ----------
  const arrow = token => {
    const g = new THREE.Group(), mt = stage.tokenMat(token);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1, 12), mt); shaft.position.y = 0.5;
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 16), mt);
    const body = new THREE.Group(); body.add(shaft); g.add(body, head); g.userData = { body, head }; group.add(g); return g;
  };
  // Grows along its local +y from its base; len < 0 points the other way.
  const setArrow = (a, len) => {
    a.visible = Math.abs(len) > 0.02; a.scale.y = Math.sign(len) || 1;
    a.userData.body.scale.y = Math.abs(len); a.userData.head.position.y = Math.abs(len) + 0.07;
  };
  const front = arrow("--l1"), rear = arrow("--l1"), drag = arrow("--l3");
  front.position.set(0, 0, 1.9); front.rotation.x = -Math.PI / 2;     // pointing down onto the front axle
  rear.position.set(-2.678, 0, 1.9); rear.rotation.x = -Math.PI / 2;
  drag.position.set(-4.1, 0, 0.7); drag.rotation.z = Math.PI / 2;  // pointing rearward behind the car
  const marker = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.018, 8, 40), stage.tokenMat("--accent"));
  marker.rotation.x = Math.PI / 2; marker.renderOrder = 7; marker.material.depthTest = false; group.add(marker);

  // ---------- slices ----------
  const slice = () => {
    const tex = new THREE.DataTexture(new Uint8Array(4), 1, 1); tex.magFilter = tex.minFilter = THREE.LinearFilter; tex.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
    mesh.renderOrder = 4; group.add(mesh); return mesh;
  };
  const side = slice(), cross = slice();
  let meta = null, mode = "pressure", lut = null, current = null;
  const fields = new Map();   // case id → Uint8Array (side speed, side pressure, cross speed, cross pressure)
  const rgb = token => { const c = stage.color(token).getHex(); return [c >> 16, (c >> 8) & 255, c & 255]; };
  function buildLut() {
    const seq = SEQ.map(rgb), n = seq.length - 1, neg = rgb("--cfd-2"), mid = rgb("--stage"), pos = rgb("--cfd-5"), zero = 152;   // Cp 0 → 152
    const mix = (a, b, f) => a.map((v, c) => v + (b[c] - v) * f);
    lut = {
      speed: Array.from({ length: 255 }, (_, v) => { const s = v / 254 * n, a = Math.min(n - 1, s | 0); return mix(seq[a], seq[a + 1], s - a); }),
      pressure: Array.from({ length: 255 }, (_, v) => (v < zero ? mix(neg, mid, v / zero) : mix(mid, pos, (v - zero) / (254 - zero)))),
    };
    paint();
  }
  function paint() {
    const f = fields.get(current); if (!f || !lut) return;
    const { side: S, cross: X } = meta.dims, ns = S.w * S.h, nc = X.w * X.h;
    const fill = (mesh, w, h, sp, val, flip) => {
      const d = new Uint8Array(w * h * 4);
      for (let b = 0; b < h; b++) for (let a = 0; a < w; a++) {
        const o = b * w + a, k = 4 * (b * w + (flip ? w - 1 - a : a));
        if (sp[o] === 255) continue;   // inside the car: clear
        const c = lut[mode][val[o]]; d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 215;
      }
      const tex = mesh.material.map; tex.image = { data: d, width: w, height: h }; tex.needsUpdate = true;
    };
    const P = mode === "pressure";
    fill(side, S.w, S.h, f.subarray(0, ns), f.subarray(P ? ns : 0, P ? 2 * ns : ns), true);   // texture runs rear → front
    fill(cross, X.w, X.h, f.subarray(2 * ns, 2 * ns + nc), f.subarray(2 * ns + (P ? nc : 0), 2 * ns + (P ? 2 * nc : nc)), false);
  }
  stage.onTheme(buildLut);

  // ---------- streamlines ----------
  const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55 }); stage.bind(lineMat.color, "--fg");
  const lines = new THREE.Group(); group.add(lines);
  let paths = [], dots = null, clock = 0;
  const ink = new THREE.Color(); stage.bind(ink, "--fg");
  function showLines(c) {
    lines.clear(); if (dots) group.remove(dots.pts);
    paths = meta.cases[c].lines.filter(l => l.length > 3).map(l => polyline(l.map(([x, y, z]) => V(m(x), m(y), m(z)))));
    for (const pl of paths) lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pl.points), lineMat));
    dots = particles(paths.length * 5, 0.05); group.add(dots.pts);
  }

  // ---------- panel ----------
  const ui = ctx.panel([{ label: p.label, items: [
    { buttons: p.cases.map(c => ({ id: c.id, label: c.label, pressed: c.id === p.start, onClick: () => choose(c.id) })) },
    { readouts: [{ id: "front", label: t("Front axle"), unit: t("kg") }, { id: "rear", label: t("Rear axle"), unit: t("kg") }, { id: "power", label: t("Power into drag"), unit: t("kW") }] },
    { text: { id: "say", value: "" } },
  ] }, { label: t("Wind tunnel"), detail: true, items: [
    { buttons: ["pressure", "speed"].map((id, i) => ({ id, label: [t("Pressure"), t("Speed")][i], pressed: i === 0, onClick: () => setMode(id) })) },
    { svg: { id: "scale", viewBox: "0 0 280 40", aria: t("Colour scale") }, only: "model" },
    { legend: [["--l1", t("Extra load on the axle")], ["--l3", t("Extra drag")], ["--accent", t("The changed part")], ["--fg", t("Streamlines of the mean flow")]] },
  ] }]);

  function choose(id) {
    current = id; p.cases.forEach(c => ui.toggle(c.id).set(c.id === id));
    const c = p.cases.find(k => k.id === id); marker.visible = !!c.part; if (c.part) marker.position.set(m(c.part[0]), m(c.part[1]), m(c.part[2]));
    ui.set("say", c.say);
    if (!meta) return;
    const r = meta.cases[id], kg = k => r.est[k] * q * meta.area / 9.81, show = (k, v) => (id === "base" ? "0" : r.settled[k] ? (v > 0 ? "+" : "") + v.toFixed(0) : "–");
    ui.set("front", show("front", kg("front"))); ui.set("rear", show("rear", kg("rear")));
    ui.set("power", show("cd", r.est.cd * q * meta.area * p.speed / 3.6 / 1000));
    setArrow(front, r.settled.front ? kg("front") / KG : 0); setArrow(rear, r.settled.rear ? kg("rear") / KG : 0);
    setArrow(drag, r.settled.cd ? r.est.cd * 4 : 0);
    showLines(id); paint();
  }

  const SCALES = { speed: ["--cfd-1 --cfd-2 --cfd-3 --cfd-4 --cfd-5", t("still air"), t("1.6 × road speed")], pressure: ["--cfd-2 --stage --cfd-5", t("suction"), t("pressing")] };
  function setMode(id) {
    mode = id; ["pressure", "speed"].forEach(k => ui.toggle(k).set(k === id)); paint();
    const sv = ui.el("scale"), gid = `rcfd-${Math.random().toString(36).slice(2, 8)}`, [stops, lo, hi] = SCALES[id];
    const tag = (n, a, text) => { const e = document.createElementNS(NS, n); for (const [k, x] of Object.entries(a)) e.setAttribute(k, x); if (text) e.textContent = text; return e; };
    const grad = tag("linearGradient", { id: gid });
    stops.split(" ").forEach((tok, i, all) => grad.append(tag("stop", { offset: i / (all.length - 1), style: `stop-color:var(${tok})` })));
    sv.replaceChildren(tag("defs", {}), tag("rect", { x: 2, y: 4, width: 276, height: 14, rx: 3, fill: `url(#${gid})`, stroke: "var(--rule)" }),
      tag("text", { x: 2, y: 34, "font-size": 11, fill: "var(--muted)" }, lo), tag("text", { x: 278, y: 34, "text-anchor": "end", "font-size": 11, fill: "var(--muted)" }, hi));
    sv.firstChild.append(grad);
  }
  setMode("pressure"); choose(p.start);

  // The results load in the background; the buttons work from the start and fill in when they arrive.
  (async () => {
    meta = await (await fetch(`${p.data}cfd.json`)).json();
    const { side: S, cross: X } = meta.dims, h = meta.h;
    side.geometry = new THREE.PlaneGeometry(m(S.w * h), m(S.h * h)).rotateX(Math.PI / 2);
    side.position.set(m(meta.side.x[0] - S.w * h / 2), 0, m(meta.side.z[0] + S.h * h / 2));
    cross.geometry = new THREE.PlaneGeometry(m(X.w * h), m(X.h * h)).rotateX(Math.PI / 2).rotateZ(Math.PI / 2);
    cross.position.set(m(meta.cross.x), m(meta.cross.y[0] + X.w * h / 2), m(meta.cross.z[0] + X.h * h / 2));
    await Promise.all(p.cases.map(async c => fields.set(c.id, new Uint8Array(await (await fetch(`${p.data}${c.id}.bin`)).arrayBuffer()))));
    buildLut(); choose(current);
  })().catch(e => console.warn("race-aero: results not loaded", e));

  let onPhoto = false;
  return {
    layout({ active, onPhoto: photo }) { onPhoto = photo; group.visible = active; side.visible = cross.visible = lines.visible = !photo; if (dots) dots.pts.visible = !photo; },
    update(dt) {
      clock += dt; if (!ctx.reducedMotion) marker.scale.setScalar(1 + 0.12 * Math.sin(clock * 4));
      if (!dots || onPhoto) return;
      const v = new THREE.Vector3(), drift = ctx.reducedMotion ? 0 : clock * 0.12;
      paths.forEach((pl, i) => { for (let k = 0; k < 5; k++) dots.set(i * 5 + k, at(pl, (k / 5 + drift + i * 0.037) % 1, v), ink); });
      dots.flush();
    },
  };
}
