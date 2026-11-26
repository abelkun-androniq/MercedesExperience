// Road-test measuring (the 1960 Mercedes-Benz 300 measuring car behind a 220 S): a sensor at the test car's front wheel
// measures how far the suspension moves; the signal runs back along a cable to the recorder in the measuring car, which
// draws it as a trace. The test car drives over a bump and a pothole (lib/model/quarter-car.js); worn dampers let body and
// wheel go on bouncing. The signal really arrives in well under a microsecond; here it travels slowly enough to follow.
// Params (mm, ground at z = 0): label, wheel { x, y, R } (the test car's measured wheel), tail (x of the test car's rear),
// follower { x0, x1, w, h } (the measuring car, a ghost box), recorder [x, y, z], ride { ms, mu, ks, kt, cs, csWorn },
// speed { min, max, value } (km/h).
import * as THREE from "three";
import { V, ball, pipe, tyre } from "../lib/scene/helpers.js";
import { createCorner, roadProfile } from "../lib/model/quarter-car.js";

const SIGNAL = 2.5;   // m/s: the signal's shown speed along the cable

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx, m = v => v / 1000, W = p.wheel, wx = m(W.x), wy = m(W.y), R = m(W.R), F = p.follower;
  const group = new THREE.Group(); carRoot.add(group);
  const tyreMat = stage.tokenMat("--fg", { roughness: 0.9, transparent: true }), sensorMat = stage.tokenMat("--l2"), recMat = stage.tokenMat("--l4");
  const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 }); stage.bind(lineMat.color, "--l2");
  const roadMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.8 }); stage.bind(roadMat.color, "--muted");
  const glassM = stage.tokenMat("--metal", { transparent: true, opacity: 0.12, depthWrite: false }), edgeM = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.5 }); stage.bind(edgeM.color, "--muted");

  const wheel = new THREE.Group(); group.add(wheel);
  wheel.add(tyre(tyreMat, R - 0.07, 0.07));
  const sensor = ball(sensorMat, 0.04); group.add(sensor);
  // The measuring car behind, and its recorder.
  const g = new THREE.BoxGeometry(m(F.x1 - F.x0), m(F.w), m(F.h)); g.translate(m(F.x0 + F.x1) / 2, 0, m(F.h) / 2 + 0.25);
  group.add(new THREE.Mesh(g, glassM), new THREE.LineSegments(new THREE.EdgesGeometry(g), edgeM));
  const rec = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.3), recMat); rec.position.set(...p.recorder.map(m)); group.add(rec);
  // The cable: under the test car to its tail, across the gap, into the recorder. Drawn as a line that carries the signal.
  const route = [V(wx - 0.1, wy - 0.2, 0.5), V(m(p.tail), wy - 0.3, 0.35), V(m(F.x1), wy - 0.3, 0.45), rec.position.clone()];
  const curve = new THREE.CatmullRomCurve3(route, false, "catmullrom", 0.1), NC = 160, base = curve.getSpacedPoints(NC - 1), len = curve.getLength();
  group.add(pipe(route, 0.006, edgeM.clone()));
  const cable = new THREE.Line(new THREE.BufferGeometry().setFromPoints(base), lineMat); cable.frustumCulled = false; group.add(cable);
  const NR = 120, road = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: NR }, () => V(0, 0, 0))), roadMat); road.frustumCulled = false; group.add(road);

  // ---------- state + panel ----------
  let kmh = p.speed.value, worn = false, dist = 0, clock = 0;
  const corner = createCorner(p.ride), worn_ = createCorner({ ...p.ride, cs: p.ride.csWorn });
  const hist = [];   // [time, travel mm, body mm] at the sensor
  const ui = ctx.panel([{ label: p.label, badge: { id: "state", text: "" }, items: [
    { slider: { id: "speed", label: t("Test speed (km/h)"), min: p.speed.min, max: p.speed.max, value: kmh, onInput: v => (kmh = v) } },
    { buttons: [{ id: "good", label: t("Dampers in order"), pressed: true, onClick: () => setWorn(false) }, { id: "worn", label: t("Dampers worn"), pressed: false, onClick: () => setWorn(true) }] },
    { readouts: [{ id: "travel", label: t("Suspension travel at the sensor"), unit: t("mm (+ = compressed)") }, { id: "body", label: t("Body above its rest height"), unit: t("mm") }] },
    { trace: { id: "rec", series: [{ token: "--l2", min: -60, max: 60 }, { token: "--muted", min: -60, max: 60 }], span: 5, top: t("+60 mm"), bottom: t("−60 mm"), aria: t("The recorder's trace of suspension travel and body movement") } },
    { key: [["--l2", t("suspension travel, as recorded")], ["--muted", t("body movement")]] },
    { text: t("The sensor's signal reaches the recorder as it happens: shown here slowed down millions of times. Masses, springs, dampers and the road are illustrative.") },
  ] }, { label: t("Parts"), items: [{ legend: [["--l2", t("Sensor and its signal along the cable")], ["--l4", t("Recorder in the measuring car")], ["--muted", t("Road, with a bump and a pothole")]] }] }]);
  function setWorn(v) { worn = v; ui.toggle("good").set(!v); ui.toggle("worn").set(v); }
  const pos = cable.geometry.attributes.position, rp = road.geometry.attributes.position;
  const sample = (time, k = 1) => { for (let i = hist.length - 1; i >= 0; i--) if (hist[i][0] <= time) return hist[i][k]; return 0; };

  return {
    layout({ active, onPhoto }) { group.visible = active; tyreMat.opacity = onPhoto ? 0.15 : 1; road.visible = !onPhoto; },
    update(dt) {
      const v = kmh / 3.6, c = worn ? worn_ : corner;
      for (let n = 0, h = Math.min(dt, 0.05) / 50; n < 50; n++) { dist += v * h; const zr = roadProfile(wx + dist); corner.step(zr, h); worn_.step(zr, h); }
      clock += dt;
      const travel = (c.zu - c.zs) * 1000; hist.push([clock, travel, c.zs * 1000]); while (hist.length && hist[0][0] < clock - len / SIGNAL - 1) hist.shift();
      wheel.position.set(wx, wy, R + c.zu); sensor.position.set(wx - 0.1, wy - 0.2, R + 0.15 + (c.zu + c.zs) / 2);
      for (let i = 0; i < NC; i++) { const s = i / (NC - 1), b = base[i]; pos.setXYZ(i, b.x, b.y, b.z + sample(clock - s * len / SIGNAL) / 1000 * 5); }   // the wave along the cable (×5 tall)
      pos.needsUpdate = true;
      for (let i = 0; i < NR; i++) { const x = wx + 3 - i * 0.06; rp.setXYZ(i, x, wy, roadProfile(x + dist) + 0.005); }
      rp.needsUpdate = true;
      const late = clock - len / SIGNAL, tr = ui.trace("rec");
      tr.push(clock, [sample(late), sample(late, 2)]);   // what has reached the recorder
      tr.draw(clock);
      ui.set("travel", travel.toFixed(0)); ui.set("body", (c.zs * 1000).toFixed(0));
      ui.badge("state").set(Math.abs(travel) > 5 ? t("Suspension moving") : t("Smooth road"), Math.abs(travel) > 5);
    },
  };
}
