// Inline piston engine turning over: crank, conrods, pistons, valves lifting in time, chambers coloured by stroke.
// Params (mm, deg): label, order (firing order), bore, stroke, rod, xs (cylinder x positions, cyl 1 first), crankZ, lean
// (+ = leans right), valvetrain "ohc" | "dohc" | "ohv" (pushrods) | "atmospheric", ignition "spark" | "hot-tube" |
// "compression" (diesel), fuel "carb" | "direct" | "prechamber" (diesel), compression? { value, min, max } (adds the
// compression-heat card),
// crankcase "open" | "flywheels", speed { min, max, value } (shown rpm, slow motion), realRpm? (readout note),
// valvetrain "none" (valve gear not drawn), flywheelR? (mm; with "flywheels" it also sizes the round case), rot? [x, y, z] (deg, turns the whole engine about the crank
// centre: [0, 90, 0] lays it flat with the cylinder pointing forward and the crank vertical).
import * as THREE from "three";
import { V, Y, mat, rod, place, ball, glass, line } from "../lib/scene/helpers.js";
import { layout, phaseOf, strokeOf, valveLifts, flashOf, injecting, injectingDiesel, compressionTemp } from "../lib/model/engine.js";

const STROKE_TOKEN = { Power: "--l1", Exhaust: "--metal", Intake: "--l4", Compression: "--l2" };

export function create(ctx, p) {
  const { stage, carRoot } = ctx;
  const lay = layout(p.order), n = lay.n;
  const r = p.stroke / 2000, l = p.rod / 1000, bR = p.bore / 2000, lean = (p.lean ?? 0) * Math.PI / 180;
  const crankZ = (p.crankZ ?? 0) / 1000, xs = p.xs.map(x => x / 1000);
  const xMin = Math.min(...xs), xMax = Math.max(...xs), xc = (xMin + xMax) / 2;
  const dAx = V(0, -Math.sin(lean), Math.cos(lean)), nAx = V(0, Math.cos(lean), Math.sin(lean));   // cylinder axis, crank-plane normal
  const deck = r + l + 0.4 * bR + 0.016, liftMax = 0.2 * bR, blockH = deck + 3.8 * bR;
  const axisQ = new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), dAx);
  const at = (x, along, side = 0) => V(x, 0, crankZ).addScaledVector(dAx, along).addScaledVector(nAx, side);

  // root sits at the crank centre so `rot` turns the engine about it; group keeps vehicle-frame coordinates.
  const root = new THREE.Group(), group = new THREE.Group();
  root.position.set(xc, 0, crankZ); root.rotation.set(...(p.rot ?? [0, 0, 0]).map(d => d * Math.PI / 180));
  group.position.set(-xc, 0, -crankZ); root.add(group); carRoot.add(root);
  const crankMat = mat(0x9aa4ad, { metalness: 0.5 }), rodMat = mat(0x6c7a86, { metalness: 0.4 }), pistonMat = mat(0xc9ced3, { metalness: 0.4 });
  const dark = mat(0x343b42), linerMat = glass(0x8fa3b3, 0.18), blockMat = glass(0x8fa3b3, 0.08), blockEdge = line(0x8fa3b3, 0.5);
  const intakeMat = stage.tokenMat("--l4"), exhaustMat = stage.tokenMat("--l1");
  const box = (w, d, hgt, pos, q) => {
    const g = new THREE.BoxGeometry(w, d, hgt);
    for (const o of [new THREE.Mesh(g, blockMat), new THREE.LineSegments(new THREE.EdgesGeometry(g), blockEdge)]) { o.position.copy(pos); if (q) o.quaternion.copy(q); group.add(o); }
  };

  // ---------- static parts ----------
  const len = xMax - xMin + 3.8 * bR;
  const fwR = p.flywheelR ? p.flywheelR / 1000 : r + 0.06;                          // enclosed flywheels (Daimler 1884)
  const b0 = p.crankcase === "flywheels" ? fwR : -0.05, b1 = blockH - 0.05;   // block span along the cylinder axis
  box(len, 4.5 * bR, b1 - b0, at(xc, (b0 + b1) / 2), axisQ);
  box(len, 3.8 * bR, 2.5 * bR, at(xc, deck + 3.8 * bR), axisQ);
  const flywheels = [];
  if (p.crankcase === "flywheels") {
    // Daimler 1884: two flywheels inside a closed round crankcase, either side of the single throw.
    const caseGeo = new THREE.CylinderGeometry(fwR + 0.015, fwR + 0.015, 0.2, 40); caseGeo.rotateZ(Math.PI / 2); caseGeo.translate(xc, 0, crankZ);
    group.add(new THREE.Mesh(caseGeo, blockMat), new THREE.LineSegments(new THREE.EdgesGeometry(caseGeo, 30), blockEdge));
    const fwMat = glass(0x9aa4ad, 0.3);
    for (const s of [-1, 1]) {
      const fw = new THREE.Group(); fw.position.set(xc + s * 0.05, 0, crankZ); group.add(fw); flywheels.push(fw);
      const discGeo = new THREE.CylinderGeometry(fwR, fwR, 0.03, 48).rotateZ(Math.PI / 2);   // see-through: the crank sits between
      fw.add(new THREE.Mesh(discGeo, fwMat), new THREE.LineSegments(new THREE.EdgesGeometry(discGeo, 30), blockEdge));
      const mark = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.02, fwR - 0.02), dark); mark.position.z = -(fwR - 0.02) / 2 - 0.02; fw.add(mark);
    }
  } else {
    const fR = (p.flywheelR ?? 140) / 1000, fw = new THREE.Group(); fw.position.set(xMin - 0.09, 0, crankZ); group.add(fw); flywheels.push(fw);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(fR, fR, 0.03, 48), dark); disc.rotation.z = Math.PI / 2; fw.add(disc);
    const mark = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.03, 0.6 * fR), crankMat); mark.position.z = 0.6 * fR; fw.add(mark);
    group.add(place(rod(crankMat, 0.026), V(xMin - 0.08, 0, crankZ), V(xMax + 0.08, 0, crankZ)));
  }
  const camSides = p.valvetrain === "dohc" ? [-1, 1] : p.valvetrain === "ohc" ? [0] : [];
  const camC = side => at(0, deck + 2.92 * bR, side * 0.45 * bR);
  // Pushrod engine: one camshaft low in the block; each valve has a pushrod up to a rocker on the head.
  const ohv = p.valvetrain === "ohv", camLow = x => at(x, r + 0.09, -1.9 * bR), pushDx = v => Math.sign(v.side || 1) * 0.3 * bR;
  if (ohv) group.add(place(rod(crankMat, 0.014), camLow(xMin - 0.06), camLow(xMax + 0.06)), place(rod(dark, 0.006), V(xMax + 0.09, 0, crankZ), camLow(xMax + 0.09)));
  for (const s of camSides) {
    group.add(place(rod(crankMat, 0.014), camC(s).setX(xMin - 0.06), camC(s).setX(xMax + 0.06)));
    group.add(place(rod(dark, 0.006), V(xMax + 0.09, 0, crankZ), camC(s).setX(xMax + 0.09)));   // timing drive
  }

  // ---------- per cylinder ----------
  const cyl = xs.map((x, i) => {
    const liner = new THREE.Mesh(new THREE.CylinderGeometry(bR, bR, deck - 0.09, 28, 1, true), linerMat);
    liner.position.copy(at(x, 0.09 + (deck - 0.09) / 2)); liner.quaternion.setFromUnitVectors(Y, dAx); group.add(liner);
    const c = { x, i, pin: rod(crankMat, 0.5 * bR), webs: [rod(crankMat, 0.65 * bR), rod(crankMat, 0.65 * bR)], conrod: rod(rodMat, 0.011),
      piston: new THREE.Mesh(new THREE.CylinderGeometry(bR - 0.001, bR - 0.001, 1.1 * bR, 28), pistonMat),
      chamber: new THREE.Mesh(new THREE.CylinderGeometry(bR - 0.002, bR - 0.002, 1, 28), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false })) };
    c.piston.quaternion.setFromUnitVectors(Y, dAx); c.chamber.quaternion.setFromUnitVectors(Y, dAx);
    group.add(c.pin, ...c.webs, c.conrod, c.piston, c.chamber);
    // Valves: intake (blue) on +n side, exhaust (red) on −n side; the atmospheric intake sits on top, on the axis.
    c.valves = p.valvetrain === "none" ? [] : [["intake", intakeMat, p.valvetrain === "atmospheric" ? 0 : -0.45], ["exhaust", exhaustMat, 0.45]].map(([kind, m, side]) => {
      const v = { kind, side: side * bR, stem: rod(m, 0.006) }; group.add(v.stem);
      if (camSides.length || ohv) { v.lobe = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.036, 0.02), crankMat); group.add(v.lobe); }
      if (ohv) { v.push = rod(rodMat, 0.005); v.rocker = rod(crankMat, 0.006); group.add(v.push, v.rocker); }
      return v;
    });
    if (p.valvetrain === "atmospheric") {   // exhaust pushrod from the crankcase cam groove
      c.pushrod = rod(rodMat, 0.005); group.add(c.pushrod);
    }
    if (p.ignition === "hot-tube") {
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      c.tube = place(rod(tubeMat, 0.007), at(x, deck + 0.02, -0.9 * bR), at(x, deck + 0.02, -0.9 * bR - 0.09)); group.add(c.tube);
      c.flame = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.05, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }));
      c.flame.position.copy(at(x, deck - 0.03, -0.9 * bR - 0.07)); c.flame.quaternion.copy(axisQ); group.add(c.flame);
      stage.onTheme(() => { tubeMat.color.copy(stage.color("--l1")); c.flame.material.color.copy(stage.color("--l2")); });
    }
    if (p.fuel === "prechamber") {
      // Diesel prechamber in the head between the valves: fuel is injected into it, burning starts there and jets out.
      c.pre = ball(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 }), 0.24 * bR, at(x, deck + 0.42 * bR));
      c.injector = place(rod(dark, 0.006), at(x, deck + 0.66 * bR), at(x, deck + 1.5 * bR));
      c.spray = new THREE.Mesh(new THREE.ConeGeometry(0.16 * bR, 0.36 * bR, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, depthWrite: false, side: THREE.DoubleSide }));
      c.spray.position.copy(at(x, deck + 0.46 * bR)); c.spray.quaternion.copy(axisQ); group.add(c.pre, c.injector, c.spray);
      stage.onTheme(() => c.spray.material.color.copy(stage.color("--l3")));
    }
    if (p.fuel === "direct") {
      c.spray = new THREE.Mesh(new THREE.ConeGeometry(0.4 * bR, 0.8 * bR, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75, depthWrite: false, side: THREE.DoubleSide }));
      c.spray.position.copy(at(x, deck - 0.5 * bR, -0.35 * bR)); c.spray.quaternion.setFromUnitVectors(Y, dAx); group.add(c.spray);
      stage.onTheme(() => c.spray.material.color.copy(stage.color("--l3")));
    }
    return c;
  });

  // ---------- pose ----------
  const X = V(1, 0, 0);
  let theta = 0, tPhoto = 0;
  function pose() {
    for (const c of cyl) {
      const alpha = theta + lay.throwA[c.i], ph = phaseOf(theta, lay.offset[c.i]);
      const C = V(c.x, 0, crankZ);
      const pinP = C.clone().addScaledVector(dAx, r * Math.cos(alpha)).addScaledVector(nAx, r * Math.sin(alpha));
      const s = r * Math.cos(alpha) + Math.sqrt(l * l - (r * Math.sin(alpha)) ** 2);
      const gudgeon = C.clone().addScaledVector(dAx, s);
      place(c.pin, pinP.clone().setX(c.x - 0.5 * bR), pinP.clone().setX(c.x + 0.5 * bR));
      c.webs.forEach((w, k) => place(w, C.clone().setX(c.x + (k ? 1 : -1) * 0.67 * bR), pinP.clone().setX(c.x + (k ? 1 : -1) * 0.67 * bR)));
      place(c.conrod, pinP, gudgeon);
      c.piston.position.copy(gudgeon).addScaledVector(dAx, 0.01);
      const top = s + 0.035, hgt = Math.max(deck - top, 0.002);
      c.chamber.position.copy(C).addScaledVector(dAx, top + hgt / 2); c.chamber.scale.set(1, hgt, 1);
      const stroke = strokeOf(ph), flash = flashOf(ph);
      c.chamber.material.color.copy(stage.color(STROKE_TOKEN[stroke]));
      c.chamber.material.opacity = stroke === "Power" ? 0.25 + 0.7 * flash : 0.35;
      const lift = valveLifts(ph, p.valvetrain, liftMax);
      for (const v of c.valves) {
        const lv = lift[v.kind];
        if (v.kind === "exhaust" && c.pushrod) {
          // Daimler exhaust: a pushrod from the cam groove lifts the valve upwards off its seat.
          const top = at(c.x, deck + 0.004 + lv, v.side), foot = at(c.x, deck - 0.06 + lv, v.side);
          place(v.stem, foot, top); place(c.pushrod, at(c.x, r + 0.09 + lv, v.side), foot);
        } else {
          // Poppet valves open into the chamber; the atmospheric intake is pulled open the same way by suction.
          const base = at(c.x, deck + 0.004 - lv, v.side);
          const tip = base.clone().addScaledVector(dAx, 0.1);
          place(v.stem, base, tip);
          if (v.push) {   // pushrod rises, the rocker tips over and presses the valve down
            const P = at(c.x + pushDx(v), deck + 0.1 + lv, -1.9 * bR);
            place(v.push, at(c.x + pushDx(v), r + 0.1 + lv, -1.9 * bR), P); place(v.rocker, P, tip);
          }
        }
        if (v.lobe) {
          const camA = ph / 2 + (v.kind === "intake" ? -2.5 : -0.75) * Math.PI / 2;
          if (ohv) v.lobe.position.copy(camLow(c.x + pushDx(v)));
          else v.lobe.position.copy(camC(camSides.length > 1 ? Math.sign(v.side) : 0)).setX(c.x + (camSides.length > 1 ? 0 : Math.sign(v.side) * 0.024));
          v.lobe.quaternion.setFromAxisAngle(X, camA);
        }
      }
      if (c.tube) { c.tube.material.color.copy(stage.color(flash > 0.2 ? "--l2" : "--l1")); c.flame.scale.set(1, 0.85 + 0.25 * Math.sin(tPhoto * 23 + c.i), 1); }
      if (c.pre) {
        c.spray.visible = injectingDiesel(ph);
        c.pre.material.color.copy(stage.color(flash > 0.15 ? "--l1" : STROKE_TOKEN[stroke]));
      } else if (c.spray) c.spray.visible = injecting(ph);
      ui.cells("cyls").set(c.i, stroke, stroke === "Power");
    }
    for (const fw of flywheels) fw.rotation.x = theta;
  }

  // ---------- panel ----------
  let playing = !ctx.reducedMotion, rpm = p.speed.value;
  const ui = ctx.panel([{ label: p.label, items: [
    { cells: { id: "cyls", labels: xs.map((_, i) => (n === 1 ? "Cylinder" : `Cyl ${i + 1}`)) } },
    { key: [["--l1", "power"], ["--metal", "exhaust"], ["--l4", "intake"], ["--l2", "compression"], ...(p.fuel === "direct" ? [["--l3", "fuel injection"]] : [])] },
    { readouts: [{ id: "crank", label: "Crank angle", unit: "deg" }, { id: "cam", label: "Camshaft", unit: "deg, half speed" }, ...(p.realRpm ? [{ id: "real", label: "Real engine", unit: "rpm", value: String(p.realRpm) }] : [])] },
    { slider: { id: "rpm", label: "Speed (slow motion)", min: p.speed.min, max: p.speed.max, value: rpm, onInput: v => (rpm = v) } },
    { buttons: [{ id: "play", toggle: ["Pause", "Play"], pressed: playing, onClick: v => (playing = v) }] },
  ] }]);
  if (p.compression) {
    // Why a diesel needs no spark: squeezing air heats it. Self-ignition of diesel fuel taken as ≈ 250 °C (illustrative).
    const IGNITE = 250, showCr = cr => {
      const T = compressionTemp(cr);
      ui.set("cr", cr.toFixed(1)); ui.set("hot", T.toFixed(0));
      ui.badge("ignites").set(T > IGNITE + 100 ? "Fuel ignites by itself" : T > IGNITE ? "Only just (needs a hot engine)" : "Too cool: needs a spark", T > IGNITE);
    };
    ctx.panel([{ label: "Why no spark plug", badge: { id: "ignites", text: "" }, items: [
      { slider: { id: "crs", label: "Compression ratio", min: p.compression.min, max: p.compression.max, step: 0.5, value: p.compression.value, onInput: showCr } },
      { readouts: [{ id: "cr", label: "Ratio", unit: ": 1" }, { id: "hot", label: "Air after compression", unit: "°C, from 20 °C" }, { id: "ign", label: "Diesel self-ignites", unit: "°C, approx.", value: String(IGNITE) }] },
      { text: "Petrol engines of the 1930s ran at about 6 : 1 and need a spark. At diesel ratios the air alone gets hot enough; glow plugs in the prechambers help a cold start." },
    ] }]);
    showCr(p.compression.value);
  }
  pose();

  return {
    layout({ active }) { root.visible = active; },
    update(dt) {
      tPhoto += dt;
      if (playing) theta += dt * (rpm / 60) * 2 * Math.PI;
      pose();
      ui.set("crank", ((theta * 180 / Math.PI) % 720).toFixed(0));
      ui.set("cam", ((theta * 90 / Math.PI) % 360).toFixed(0));
    },
  };
}
