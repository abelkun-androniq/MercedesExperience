// Inline piston engine turning over: crank, conrods, pistons, valves lifting in time, chambers coloured by stroke.
// Params (mm, deg): label, order (firing order), bore, stroke, rod, xs (cylinder x positions, cyl 1 first), crankZ, lean
// (+ = leans right), valvetrain "ohc" | "dohc" | "ohv" (pushrods) | "atmospheric", ignition "spark" | "hot-tube" |
// "compression" (diesel), fuel "carb" | "direct" | "prechamber" (diesel), compression? { value, min, max } (adds the
// compression-heat card),
// crankcase "open" | "flywheels", speed { min, max, value } (shown rpm, slow motion), realRpm? (readout note),
// valvetrain "none" (valve gear not drawn), flywheelR? (mm; with "flywheels" it also sizes the round case), rot? [x, y, z] (deg, turns the whole engine about the crank
// centre: [0, 90, 0] lays it flat with the cylinder pointing forward and the crank vertical), leans? [deg per cylinder]
// (V engines: each bank leans its own way; cylinders whose crankpins coincide share one, rods side by side), plugs? (spark
// plugs per cylinder, drawn and lit at firing; 2 adds the dual-ignition card), valves? (4: two inlet and two exhaust valves
// per cylinder), rockers? (with "ohc": a rocker arm between each cam and its valve), sideExhaust? (with "ohv": the exhaust
// valve sits beside the cylinder and a tappet from the low camshaft lifts it), breathe? { rpm: [real rpm…], slow } (adds the
// card comparing the time for one intake stroke; the animation runs at real rpm × slow).
// The camshaft readout appears only where a camshaft is drawn ("ohc", "dohc", "ohv"); "none" and "atmospheric" have none
// (the Daimler exhaust rod, driven from a groove in the flywheel, lights up as it lifts its valve).
import * as THREE from "three";
import { V, Y, mat, rod, place, ball, glass, line } from "../lib/scene/helpers.js";
import { layout, pinAngle, phaseOf, strokeOf, valveLifts, flashOf, injecting, injectingDiesel, compressionTemp } from "../lib/model/engine.js";

const STROKE_TOKEN = { Power: "--l1", Exhaust: "--metal", Intake: "--l4", Compression: "--l2" };

export function create(ctx, p) {
  const { stage, carRoot, t } = ctx;
  const STROKE_NAME = { Power: t("Power"), Exhaust: t("Exhaust"), Intake: t("Intake"), Compression: t("Compression") };
  const lay = layout(p.order), n = lay.n;
  const r = p.stroke / 2000, l = p.rod / 1000, bR = p.bore / 2000;
  const crankZ = (p.crankZ ?? 0) / 1000, xs = p.xs.map(x => x / 1000);
  const xMin = Math.min(...xs), xMax = Math.max(...xs), xc = (xMin + xMax) / 2;
  const deck = r + l + 0.4 * bR + 0.016, liftMax = 0.2 * bR, blockH = deck + 3.8 * bR;
  // One frame per bank: cylinder axis d, crank-plane normal n, `at` places a point along d and sideways along n.
  const banks = new Map(), leanOf = i => ((p.leans?.[i] ?? p.lean ?? 0) * Math.PI) / 180;
  const bankOf = i => {
    const a = leanOf(i);
    if (!banks.has(a)) {
      const d = V(0, -Math.sin(a), Math.cos(a)), n = V(0, Math.cos(a), Math.sin(a));
      const at = (x, along, side = 0) => V(x, 0, crankZ).addScaledVector(d, along).addScaledVector(n, side);
      banks.set(a, { d, n, at, q: new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), d), xs: [],
        camC: side => at(0, deck + 2.92 * bR, side * 0.45 * bR), camLow: x => at(x, r + 0.09, -1.9 * bR) });
    }
    return banks.get(a);
  };
  xs.forEach((x, i) => bankOf(i).xs.push(x));
  // Shared crankpins (V engines): host[i] is the earlier cylinder whose pin cylinder i shares, or −1.
  const pinOf = i => pinAngle(lay, i, leanOf(i));
  const host = xs.map((x, i) => xs.findIndex((x2, j) => j < i && Math.abs(x2 - x) < 2 * bR && Math.abs(Math.cos(pinOf(i) - pinOf(j)) - 1) < 1e-9));

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
  const fwR = p.flywheelR ? p.flywheelR / 1000 : r + 0.06;                          // enclosed flywheels (Daimler 1884)
  const b0 = p.crankcase === "flywheels" ? fwR : -0.05, b1 = blockH - 0.05;   // block span along the cylinder axis
  for (const b of banks.values()) {
    const x0 = Math.min(...b.xs), x1 = Math.max(...b.xs), len = x1 - x0 + 3.8 * bR, xm = (x0 + x1) / 2;
    box(len, 4.5 * bR, b1 - b0, b.at(xm, (b0 + b1) / 2), b.q);
    box(len, 3.8 * bR, 2.5 * bR, b.at(xm, deck + 3.8 * bR), b.q);
  }
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
  // Pushrod engine: one camshaft low in the block; each valve has a pushrod up to a rocker on the head.
  const ohv = p.valvetrain === "ohv", shaft = camSides.length > 0 || ohv, pushDx = v => Math.sign(v.side || 1) * 0.3 * bR;
  for (const b of banks.values()) {
    const x0 = Math.min(...b.xs), x1 = Math.max(...b.xs);
    if (ohv) group.add(place(rod(crankMat, 0.014), b.camLow(x0 - 0.06), b.camLow(x1 + 0.06)), place(rod(dark, 0.006), V(xMax + 0.09, 0, crankZ), b.camLow(xMax + 0.09)));
    for (const s of camSides) {
      group.add(place(rod(crankMat, 0.014), b.camC(s).setX(x0 - 0.06), b.camC(s).setX(x1 + 0.06)));
      group.add(place(rod(dark, 0.006), V(xMax + 0.09, 0, crankZ), b.camC(s).setX(xMax + 0.09)));   // timing drive
    }
  }

  // ---------- per cylinder ----------
  const cyl = xs.map((x, i) => {
    const bank = bankOf(i), { at, d: dAx, q: axisQ } = bank;
    const liner = new THREE.Mesh(new THREE.CylinderGeometry(bR, bR, deck - 0.09, 28, 1, true), linerMat);
    liner.position.copy(at(x, 0.09 + (deck - 0.09) / 2)); liner.quaternion.setFromUnitVectors(Y, dAx); group.add(liner);
    // The pin spans every rod on it; webs sit outside the outermost rods.
    const onPin = xs.filter((_, k) => k === i || host[k] === i), span = [Math.min(...onPin) - 0.5 * bR, Math.max(...onPin) + 0.5 * bR];
    const c = { x, i, bank, span, pin: host[i] < 0 ? rod(crankMat, 0.5 * bR) : null, webs: host[i] < 0 ? [rod(crankMat, 0.65 * bR), rod(crankMat, 0.65 * bR)] : [], conrod: rod(rodMat, 0.011),
      piston: new THREE.Mesh(new THREE.CylinderGeometry(bR - 0.001, bR - 0.001, 1.1 * bR, 28), pistonMat),
      chamber: new THREE.Mesh(new THREE.CylinderGeometry(bR - 0.002, bR - 0.002, 1, 28), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false })) };
    c.piston.quaternion.setFromUnitVectors(Y, dAx); c.chamber.quaternion.setFromUnitVectors(Y, dAx);
    group.add(...(c.pin ? [c.pin] : []), ...c.webs, c.conrod, c.piston, c.chamber);
    // Valves: intake (blue) on the −n side, exhaust (red) on the +n side, side by side along x when there are four; the
    // atmospheric intake sits on top, on the axis; a side exhaust sits beside the bore on the camshaft's side.
    const atm = p.valvetrain === "atmospheric", pair = p.valves === 4 ? [-0.28 * bR, 0.28 * bR] : [0];
    const kinds = [["intake", intakeMat, atm ? 0 : -0.45, 0], ["exhaust", exhaustMat, p.sideExhaust ? -1.45 : 0.45, p.sideExhaust ? 0.5 * bR : 0]];
    c.valves = p.valvetrain === "none" ? [] : kinds.flatMap(([kind, m, side, dx0]) => pair.map(dx => {
      const v = { kind, side: side * bR, dx: dx0 + dx, stem: rod(m, 0.006) }; group.add(v.stem);
      // Opened upwards by a rod from below: the Daimler exhaust (flywheel groove) and a side valve (tappet on the low cam).
      v.below = kind === "exhaust" && (atm || !!p.sideExhaust);
      if (v.below) { v.tappet = rod(rodMat, 0.005); group.add(v.tappet); }
      if (shaft) { v.lobe = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.036, 0.02), crankMat); group.add(v.lobe); }
      if (ohv && !v.below) { v.push = rod(rodMat, 0.005); v.rocker = rod(crankMat, 0.006); group.add(v.push, v.rocker); }
      if (p.rockers && camSides.length === 1) { v.rocker = rod(crankMat, 0.006); group.add(v.rocker); }
      return v;
    }));
    if (p.ignition === "hot-tube") {
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      c.tube = place(rod(tubeMat, 0.007), at(x, deck + 0.02, -0.9 * bR), at(x, deck + 0.02, -0.9 * bR - 0.09)); group.add(c.tube);
      c.flame = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.05, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }));
      c.flame.position.copy(at(x, deck - 0.03, -0.9 * bR - 0.07)); c.flame.quaternion.copy(axisQ); group.add(c.flame);
      stage.onTheme(() => { tubeMat.color.copy(stage.color("--l1")); c.flame.material.color.copy(stage.color("--l2")); });
    }
    if (p.plugs) {
      // Spark plugs through the head, fore and aft of the valves when there are two (dual ignition).
      const plugMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      c.plugs = Array.from({ length: p.plugs }, (_, j) => {
        const dx = p.plugs === 1 ? 0 : (j ? 0.62 : -0.62) * bR, o = place(rod(plugMat, 0.0045), at(x + dx, deck + 0.05), at(x + dx, deck - 0.004));
        group.add(o); return o;
      });
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
      const { at, d: dAx, n: nAx, camC, camLow } = c.bank;
      const alpha = theta + lay.throwA[c.i], ph = phaseOf(theta, lay.offset[c.i]);
      const C = V(c.x, 0, crankZ);
      const pinP = C.clone().addScaledVector(dAx, r * Math.cos(alpha)).addScaledVector(nAx, r * Math.sin(alpha));
      const s = r * Math.cos(alpha) + Math.sqrt(l * l - (r * Math.sin(alpha)) ** 2);
      const gudgeon = C.clone().addScaledVector(dAx, s);
      if (c.pin) place(c.pin, pinP.clone().setX(c.span[0]), pinP.clone().setX(c.span[1]));
      c.webs.forEach((w, k) => { const wx = k ? c.span[1] + 0.17 * bR : c.span[0] - 0.17 * bR; place(w, C.clone().setX(wx), pinP.clone().setX(wx)); });
      place(c.conrod, pinP, gudgeon);
      c.piston.position.copy(gudgeon).addScaledVector(dAx, 0.01);
      const top = s + 0.035, hgt = Math.max(deck - top, 0.002);
      c.chamber.position.copy(C).addScaledVector(dAx, top + hgt / 2); c.chamber.scale.set(1, hgt, 1);
      const stroke = strokeOf(ph), flash = flashOf(ph);
      c.chamber.material.color.copy(stage.color(STROKE_TOKEN[stroke]));
      c.chamber.material.opacity = stroke === "Power" ? 0.25 + 0.7 * flash : 0.35;
      const lift = valveLifts(ph, p.valvetrain, liftMax);
      for (const v of c.valves) {
        const lv = lift[v.kind], vx = c.x + v.dx, s1 = Math.sign(v.side) || 1;
        const lobeX = ohv ? vx + (v.below ? 0 : pushDx(v)) : camSides.length > 1 ? vx : c.x + s1 * 0.024;
        if (v.below) {
          // A rod from below (groove follower or tappet) lifts the valve upwards off its seat; it lights up while it does.
          const top = at(vx, deck + 0.004 + lv, v.side), foot = at(vx, deck - 0.06 + lv, v.side);
          place(v.stem, foot, top); place(v.tappet, ohv ? camLow(vx).addScaledVector(dAx, lv) : at(vx, r + 0.09 + lv, v.side), foot);
          v.tappet.material = lv > 5e-4 ? exhaustMat : rodMat;
        } else {
          // Poppet valves open into the chamber; the atmospheric intake is pulled open the same way by suction.
          const base = at(vx, deck + 0.004 - lv, v.side);
          const tip = base.clone().addScaledVector(dAx, 0.1);
          place(v.stem, base, tip);
          if (v.push) {   // pushrod rises, the rocker tips over and presses the valve down
            const P = at(vx + pushDx(v), deck + 0.1 + lv, -1.9 * bR);
            place(v.push, at(vx + pushDx(v), r + 0.1 + lv, -1.9 * bR), P); place(v.rocker, P, tip);
          } else if (v.rocker) {
            // Overhead cam pressing a rocker: pivot outboard of the valve, cam over the middle of the head; the lever
            // passes over the valve tip, so the cam end moves 1.6 / 1.15 times the valve lift.
            const k = 1.6 / 1.15;
            place(v.rocker, at(vx, deck + 0.104, s1 * 1.6 * bR), at(lobeX, deck + 0.104 - k * lv, 0));
          }
        }
        if (v.lobe) {
          const camA = ph / 2 + (v.kind === "intake" ? -2.5 : -0.75) * Math.PI / 2;
          v.lobe.position.copy(ohv ? camLow(lobeX) : camC(camSides.length > 1 ? s1 : 0).setX(lobeX));
          v.lobe.quaternion.setFromAxisAngle(X, camA);
        }
      }
      if (c.plugs) c.plugs[0].material.color.copy(stage.color(flash > 0.2 ? "--accent" : "--metal"));
      if (c.tube) { c.tube.material.color.copy(stage.color(flash > 0.2 ? "--l2" : "--l1")); c.flame.scale.set(1, 0.85 + 0.25 * Math.sin(tPhoto * 23 + c.i), 1); }
      if (c.pre) {
        c.spray.visible = injectingDiesel(ph);
        c.pre.material.color.copy(stage.color(flash > 0.15 ? "--l1" : STROKE_TOKEN[stroke]));
      } else if (c.spray) c.spray.visible = injecting(ph);
      ui.cells("cyls").set(c.i, STROKE_NAME[stroke], stroke === "Power");
    }
    for (const fw of flywheels) fw.rotation.x = theta;
  }

  // ---------- panel ----------
  let playing = !ctx.reducedMotion, rpm = p.speed.value;
  const ui = ctx.panel([{ label: p.label, items: [
    { cells: { id: "cyls", labels: xs.map((_, i) => (n === 1 ? t("Cylinder") : t("Cyl {0}", i + 1))) }, detail: true },
    { key: [["--l1", t("power")], ["--metal", t("exhaust")], ["--l4", t("intake")], ["--l2", t("compression")], ...(p.fuel === "direct" ? [["--l3", t("fuel injection")]] : [])], detail: true },
    { readouts: [{ id: "crank", label: t("Crank angle"), unit: t("deg") }, ...(shaft ? [{ id: "cam", label: t("Camshaft"), unit: t("deg, half speed") }] : []), ...(p.realRpm ? [{ id: "real", label: t("Real engine"), unit: t("rpm"), value: String(p.realRpm) }] : [])], detail: true },
    { slider: { id: "rpm", label: t("Speed (slow motion)"), min: p.speed.min, max: p.speed.max, value: rpm, onInput: v => (rpm = v) }, detail: true },
    { buttons: [{ id: "play", toggle: [t("Pause"), t("Play")], pressed: playing, onClick: v => (playing = v) }] },
  ] }]);
  if (p.compression) {
    // Why a diesel needs no spark: squeezing air heats it. Self-ignition of diesel fuel taken as ≈ 250 °C (illustrative).
    const IGNITE = 250, showCr = cr => {
      const T = compressionTemp(cr);
      ui.set("cr", cr.toFixed(1)); ui.set("hot", T.toFixed(0));
      ui.badge("ignites").set(T > IGNITE + 100 ? t("Fuel ignites by itself") : T > IGNITE ? t("Only just (needs a hot engine)") : t("Too cool: needs a spark"), T > IGNITE);
    };
    ctx.panel([{ label: t("Why no spark plug"), badge: { id: "ignites", text: "" }, items: [
      { slider: { id: "crs", label: t("Compression ratio"), min: p.compression.min, max: p.compression.max, step: 0.5, value: p.compression.value, onInput: showCr } },
      { readouts: [{ id: "cr", label: t("Ratio"), unit: ": 1" }, { id: "hot", label: t("Air after compression"), unit: t("°C, from 20 °C") }, { id: "ign", label: t("Diesel self-ignites"), unit: t("°C, approx."), value: String(IGNITE) }] },
      { text: p.fuel === "direct" ? t("A petrol engine of the time ran at about 8 : 1 and needs a spark. At diesel ratios the air alone gets hot enough to light the fuel sprayed straight into the cylinder.")
        : t("Petrol engines of the 1930s ran at about 6 : 1 and need a spark. At diesel ratios the air alone gets hot enough; glow plugs in the prechambers help a cold start.") },
    ] }]);
    showCr(p.compression.value);
  }
  if (p.plugs === 2) {
    // Two sparks at opposite sides of the chamber: each flame front only has to cross half the bore. Flame speed illustrative.
    const FLAME = 15, path = [p.bore, p.bore / 2];
    ctx.panel([{ label: t("Two spark plugs per cylinder"), items: [
      { readouts: [{ id: "one", label: t("Flame path, one plug"), unit: t("mm"), value: path[0].toFixed(0) }, { id: "two", label: t("Flame path, two plugs"), unit: t("mm"), value: path[1].toFixed(1) },
        { id: "t1", label: t("Burn time, one plug"), unit: t("ms at {0} m/s", FLAME), value: (path[0] / FLAME).toFixed(1) }, { id: "t2", label: t("Burn time, two plugs"), unit: t("ms"), value: (path[1] / FLAME).toFixed(1) }] },
      { text: t("One plug is fired by a magneto, the other by a battery coil: the mixture burns through faster, and the engine keeps running if either system fails.") },
    ] }]);
  }
  if (p.breathe) {
    // How long one cylinder has to fill: an intake stroke is half a crank turn (180°), so at n rpm it lasts 30 000 / n ms.
    // The inlet valves open over a longer, cam-timed interval; the stroke is the clean comparison between speeds.
    const fmt = v => new Intl.NumberFormat(document.documentElement.lang).format(v);
    const choose = real => {
      rpm = real * p.breathe.slow; ui.slider("rpm").set(rpm);
      ui.set("stroke", (30000 / real).toFixed(1)); p.breathe.rpm.forEach(v => ui.toggle(`r${v}`).set(v === real));
    };
    ctx.panel([{ label: t("Time to fill a cylinder"), items: [
      { buttons: p.breathe.rpm.map(v => ({ id: `r${v}`, label: t("{0} rpm", fmt(v)), pressed: false, onClick: () => choose(v) })) },
      { readouts: [{ id: "stroke", label: t("One intake stroke"), unit: t("ms, half a crank turn") }] },
      { text: t("Shown in slow motion. The real time is in the readout; the inlet valves stay open a little longer than the stroke, as the cam timing sets.") },
    ] }]);
    choose(p.breathe.rpm[0]);
  }
  pose();

  return {
    layout({ active }) { root.visible = active; },
    update(dt) {
      tPhoto += dt;
      if (playing) theta += dt * (rpm / 60) * 2 * Math.PI;
      pose();
      ui.set("crank", ((theta * 180 / Math.PI) % 720).toFixed(0));
      if (shaft) ui.set("cam", ((theta * 90 / Math.PI) % 360).toFixed(0));
    },
  };
}
