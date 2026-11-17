// One-cylinder close-up: a desmodromic valve (opened by one cam, pulled shut by a conjugate cam through a rocker) next to a
// conventional spring-closed valve on an identical cam. Physics runs at the real engine speed (lib/model/valvetrain.js);
// the picture turns in slow motion. Params: cam { lift, open, duration, mass, preload, floatRpm, base } (m, cam rad, kg),
// rpm { min, max, value } (crank rpm), label, origin? [x, y, z] (m).
import * as THREE from "three";
import { V, mat, rod, place, ball, helix, glass, line } from "../lib/scene/helpers.js";
import { camLift, desmoCams, simulateSpringValve } from "../lib/model/valvetrain.js";

const TAU = 2 * Math.PI, SHOWN_REV_S = 0.3, CAM_Z = 0.12, STEM = 0.1;

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, cam = p.cam;
  const group = new THREE.Group(); group.position.set(...(p.origin ?? [0, 0, 0])); carRoot.add(group);
  const steel = mat(0x9aa4ad, { metalness: 0.5 }), dark = mat(0x343b42);
  const desmoMat = stage.tokenMat("--accent"), springValveMat = stage.tokenMat("--l1"), rockerMat = stage.tokenMat("--l2"), springMat = stage.tokenMat("--l4");
  const Yd = 0.05, Ys = -0.05, Yc = 0.1;   // desmo valve, spring valve, closing cam

  // Cam disc whose radius facing down (−z) after turning by φ is base + L(φ) (opening) or base + lift − L(φ) (closing).
  function camMesh(closing, y) {
    const s = new THREE.Shape();
    for (let i = 0; i <= 180; i++) {
      const psi = i / 180 * TAU, L = camLift(psi + Math.PI / 2, cam).L, r = cam.base + (closing ? cam.lift - L : L);
      i ? s.lineTo(r * Math.cos(psi), r * Math.sin(psi)) : s.moveTo(r * Math.cos(psi), r * Math.sin(psi));
    }
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.014, bevelEnabled: false }); g.rotateX(Math.PI / 2); g.translate(0, y + 0.007, 0);
    const m = new THREE.Mesh(g, closing ? rockerMat : steel); m.position.z = CAM_Z; group.add(m); return m;
  }
  const cams = [camMesh(false, Yd), camMesh(true, Yc), camMesh(false, Ys)];
  group.add(place(rod(steel, 0.008), V(0, Ys - 0.03, CAM_Z), V(0, Yc + 0.03, CAM_Z)));
  // Cylinder head and the two ports, see-through.
  const headGeo = new THREE.BoxGeometry(0.09, 0.24, 0.16); headGeo.translate(0, 0.025, CAM_Z - 0.1);
  group.add(new THREE.Mesh(headGeo, glass(0x8fa3b3, 0.08)), new THREE.LineSegments(new THREE.EdgesGeometry(headGeo), line(0x8fa3b3, 0.45)));

  function valve(m, y) {
    const v = { stem: rod(m, 0.004), head: new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.004, 28), m), y };
    v.head.rotation.x = Math.PI / 2; group.add(v.stem, v.head);   // cylinder axis y → z, wide face down into the chamber
    v.set = lift => { const top = CAM_Z - cam.base - lift; place(v.stem, V(0, y, top - STEM), V(0, y, top)); v.head.position.set(0, y, top - STEM); };
    return v;
  }
  const dv = valve(desmoMat, Yd), sv = valve(springValveMat, Ys);
  // Desmo closing rocker: a lever pivoted halfway between the closing-cam follower and a fork under the valve collar.
  const closer = rod(rockerMat, 0.004), pivot = ball(dark, 0.006); group.add(closer, pivot);
  // Spring valve: bucket under the cam, coil spring from the head to the collar.
  const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.012, 24), steel); bucket.rotation.x = Math.PI / 2; group.add(bucket);
  // Coil built once at its closed length and squashed along z as the valve opens.
  const seatZ = CAM_Z - cam.base - STEM + 0.03, coilTop = x => CAM_Z - cam.base - x - 0.014, coil0 = coilTop(0) - seatZ;
  const coil = new THREE.Mesh(helix(V(0, 0, 0), V(0, 0, coil0), 5, 0.012, 0.0022), springMat); coil.position.set(0, Ys, seatZ); group.add(coil);

  // ---------- simulation (precomputed per rpm: one settled cam revolution) ----------
  let rpm = p.rpm.value, sim = simulateSpringValve(cam, rpm), phi = 0, playing = !ctx.reducedMotion;
  const springLift = a => sim.valve[Math.floor(((a % TAU) + TAU) % TAU / TAU * sim.valve.length) % sim.valve.length];

  function pose() {
    for (const c of cams) c.rotation.y = phi;
    const L = desmoCams(phi, cam).valve, x = springLift(phi);
    dv.set(L); sv.set(x);
    // Equal-arm closing rocker: as the closing cam's radius shrinks by L the follower end rises by L and the fork end,
    // hooked under the valve collar, drops by L, so the pivot between them stays fixed.
    const zB = CAM_Z - cam.base - cam.lift - L, zA = CAM_Z - (cam.base + cam.lift - L);
    place(closer, V(0, Yd, zB), V(0, Yc, zA)); pivot.position.set(0, (Yd + Yc) / 2, (zA + zB) / 2);
    bucket.position.set(0, Ys, CAM_Z - cam.base - x - 0.006);
    coil.scale.z = (coilTop(x) - seatZ) / coil0;
    return { L, x };
  }

  // ---------- panel ----------
  const ui = ctx.panel([
    { label: p.label, badge: { id: "state", text: t("Following") }, items: [
      { slider: { id: "rpm", label: t("Engine speed (real physics, shown in slow motion)"), min: p.rpm.min, max: p.rpm.max, step: 100, value: rpm, onInput: v => { rpm = v; sim = simulateSpringValve(cam, rpm); drawLift(); } } },
      { readouts: [{ id: "rpm", label: t("Engine speed"), unit: t("rpm") }, { id: "float", label: t("Spring valve float"), unit: t("mm off the cam") },
        { id: "desmo", label: t("Desmo valve lift"), unit: t("mm, always = cam") }, { id: "spring", label: t("Spring valve lift"), unit: t("mm") }] },
      { svg: { id: "lift", viewBox: "0 0 280 120", aria: t("Valve lift over one cam revolution: cam profile, spring valve and desmodromic valve") } },
      { key: [["--muted", t("cam profile")], ["--accent", t("desmo valve")], ["--l1", t("spring valve")]] },
      { buttons: [{ id: "play", toggle: [t("Pause"), t("Play")], pressed: playing, onClick: v => (playing = v) }] },
    ] },
    { label: t("Parts"), items: [{ legend: [["--accent", t("Desmodromic valve")], ["--l2", t("Closing cam and closing rocker")], ["--l1", t("Spring-closed valve (for comparison)")], ["--l4", t("Valve spring")], ["--metal", t("Opening cams and camshaft")]] }] },
  ]);
  const svg = ui.el("lift"), maxL = cam.lift * 1.6;
  const X = a => (a / TAU * 280).toFixed(1), Yp = L => (112 - L / maxL * 100).toFixed(1);
  svg.innerHTML = `<line x1="0" y1="112" x2="280" y2="112" stroke="var(--rule)"/><polyline fill="none" stroke="var(--muted)" stroke-dasharray="3 3" stroke-width="1.4"/>
    <polyline fill="none" stroke="var(--accent)" stroke-width="3" opacity=".55"/><polyline fill="none" stroke="var(--l1)" stroke-width="1.6"/>
    <line y1="4" y2="112" stroke="var(--fg)" stroke-width="1"/><text x="278" y="12" text-anchor="end">one cam revolution →</text>`;
  const [camLine, desmoLine, springLine] = svg.querySelectorAll("polyline");
  const cursor = svg.querySelectorAll("line")[1];
  function drawLift() {
    const pts = (arr) => sim.phi.map((a, i) => `${X(a)},${Yp(arr[i])}`).join(" ");
    camLine.setAttribute("points", pts(sim.cam)); desmoLine.setAttribute("points", pts(sim.cam)); springLine.setAttribute("points", pts(sim.valve));
    const floating = sim.maxSep > 2e-4;
    ui.badge("state").set(floating ? t("Spring valve floating") : t("Both valves on the cam"), floating);
    ui.set("rpm", rpm.toFixed(0)); ui.set("float", (sim.maxSep * 1000).toFixed(1));
  }
  drawLift(); pose();

  return {
    layout({ active }) { group.visible = active; },
    update(dt) {
      if (playing) phi = (phi + dt * SHOWN_REV_S * TAU) % TAU;
      const { L, x } = pose();
      cursor.setAttribute("x1", X(phi)); cursor.setAttribute("x2", X(phi));
      ui.set("desmo", (L * 1000).toFixed(1)); ui.set("spring", (x * 1000).toFixed(1));
    },
  };
}
