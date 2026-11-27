// Dual-axis steering (Mercedes W11, 2020), from above (lib/model/steering.js dualAxis). Turning the steering wheel moves
// the rack sideways and both front wheels steer together. Pulling the wheel towards the driver along its column moves both
// track rods' inner ends outwards together: the toe changes, the same on both wheels, and the car does not steer. Toe-out
// (leading edges apart) helps the car turn in and warms the tyres; on a straight it scrubs both tyres sideways and costs
// drag. Toe angles are drawn several times larger than they are.
// Params (mm, deg; ground at z = 0): label, halfTrack, kingpinHalf, wheelR, tyreW, arm (steering arm), gain (inner-end
// travel per mm of pull), toe0 (deg, wheel pushed in), pullMax (mm), steerMax (deg), cornering (N/rad per front tyre),
// kmh, exaggerate.
import * as THREE from "three";
import { V, rod, place, ball, tyre } from "../lib/scene/helpers.js";
import { dualAxis, toeDrag } from "../lib/model/steering.js";

const D = Math.PI / 180;

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, k = m(p.kingpinHalf), off = m(p.halfTrack - p.kingpinHalf), R = m(p.wheelR), arm = m(p.arm);
  const group = new THREE.Group(); carRoot.add(group);
  const tyreMat = stage.tokenMat("--fg", { roughness: 0.9, transparent: true }), armMat = stage.tokenMat("--l2"), rackMat = stage.tokenMat("--l1", { metalness: 0.4 });
  const edgeMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 }); stage.bind(edgeMat.color, "--accent");
  const geo = { arm: p.arm, toe0: p.toe0 * D, gain: p.gain };   // dualAxis works in mm: gain · pull is the inner ends' travel
  // Each front wheel on its kingpin, with a line along its plane (to see the toe) and a steering arm pointing back.
  const wheels = [1, -1].map(s => {
    const g = new THREE.Group(); g.position.set(0, s * k, R); group.add(g);
    const w = tyre(tyreMat, R - m(p.tyreW) / 2, m(p.tyreW) / 2); w.position.y = s * off; g.add(w);
    const plane = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(-1.2, s * off, R + 0.02), V(1.2, s * off, R + 0.02)]), edgeMat); g.add(plane);
    g.add(place(rod(armMat, 0.012), V(0, 0, 0), V(-arm, -s * 0.02, 0)));
    const rodT = rod(armMat, 0.01); group.add(rodT);
    return { s, g, rodT };
  });
  const rack = rod(rackMat, 0.02); group.add(rack);
  const ends = [ball(rackMat, 0.025), ball(rackMat, 0.025)]; group.add(...ends);
  const column = rod(rackMat, 0.015); group.add(column);

  // ---------- state + panel ----------
  let steer = 0, pull = 0, steerT = 0, pullT = 0, demo = !ctx.reducedMotion, phase = 0;
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { slider: { id: "steer", label: t("Steering wheel turned (deg at the front wheels)"), min: -p.steerMax, max: p.steerMax, step: 0.5, value: 0, onInput: v => { stopDemo(); steerT = v; } } },
    { slider: { id: "pull", label: t("Steering wheel pulled towards the driver (mm)"), min: 0, max: p.pullMax, step: 1, value: 0, onInput: v => { stopDemo(); pullT = v; } } },
    { readouts: [{ id: "toe", label: t("Toe of each front wheel"), unit: t("deg (− = toe-out)") }, { id: "side", label: t("Each tyre pushed sideways"), unit: t("N") },
      { id: "drag", label: t("Drag from the toe"), unit: t("N") }, { id: "power", label: t("Power it costs"), unit: t("kW at {0} km/h", p.kmh) }] },
    { text: { id: "how", value: "" } },
    { buttons: [{ id: "auto", toggle: [t("Demo on"), t("Demo off")], pressed: demo, onClick: v => (demo = v) }] },
    { text: t("Toe drawn {0} times larger. Toe angles, linkage and tyre stiffness are illustrative: the team never published them.", p.exaggerate) },
  ] }, { label: t("Parts"), items: [{ legend: [["--l1", t("Rack, its inner ends and the steering column")], ["--l2", t("Steering arms and track rods")], ["--accent", t("Each wheel's plane, drawn out")]] }] }]);
  function stopDemo() { if (demo) { demo = false; ui.toggle("auto").set(false); } }
  let said = "";

  return {
    layout({ active, onPhoto }) { group.visible = active; tyreMat.opacity = onPhoto ? 0.15 : 1; },
    update(dt) {
      if (demo) {   // a lap in miniature: straight (pulled), brake and turn in (pushed, steered), straight again
        phase = (phase + dt / 8) % 1;
        pullT = phase < 0.4 || phase > 0.85 ? p.pullMax : 0; steerT = phase > 0.5 && phase < 0.8 ? p.steerMax * 0.6 * Math.sin((phase - 0.5) / 0.3 * Math.PI) : 0;
        ui.slider("pull").set(pullT); ui.slider("steer").set(Math.round(steerT * 2) / 2);
      }
      steer += (steerT - steer) * Math.min(1, dt * 6); pull += (pullT - pull) * Math.min(1, dt * 4);
      const r = dualAxis(geo, steer * D, pull), x = p.exaggerate;
      const shown = { 1: steer * D - r.toe * x, [-1]: steer * D + r.toe * x };
      wheels.forEach(w => {
        const a = shown[w.s]; w.g.rotation.z = a;
        const armEnd = V(-arm * Math.cos(a) - w.s * 0.02 * -Math.sin(a), w.s * k - arm * Math.sin(a) - w.s * 0.02 * Math.cos(a), R);
        const inner = V(-arm, w.s * (k * 0.35 + m(p.gain * pull) * x) - arm * Math.sin(steer * D), R);   // the rack: sideways to steer, its ends outwards with the pull
        place(w.rodT, armEnd, inner); ends[w.s > 0 ? 0 : 1].position.copy(inner);
      });
      place(rack, ends[1].position, ends[0].position);
      place(column, V(-arm, 0, R), V(-arm - 0.5 - m(pull) * 4, 0, R + 0.25));
      const d = toeDrag(p.cornering, r.toe, p.kmh / 3.6);
      ui.set("toe", (r.toe / D).toFixed(2)); ui.set("side", d.side.toFixed(0)); ui.set("drag", d.drag.toFixed(0)); ui.set("power", (d.power / 1000).toFixed(1));
      const s = pull > p.pullMax * 0.8 ? t("Wheel pulled back: the wheels run straight ahead, parallel. On the straight neither tyre is scrubbed sideways, so there is less drag and less heat.")
        : t("Wheel pushed forward: toe-out. The leading edges point apart, so each tyre is pushed slightly sideways: it turns in more eagerly and the tyres warm up, at the cost of some drag on the straight.");
      if (s !== said) { ui.set("how", s); said = s; }
      ui.badge("state").set(Math.abs(r.toe) < 0.0005 ? t("Toe zero: straight-line setting") : t("Toe-out: cornering setting"), Math.abs(r.toe) >= 0.0005);
    },
  };
}
