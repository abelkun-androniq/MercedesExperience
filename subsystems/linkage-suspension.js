// Independent suspension from five fixed-length links (multi-link or double wishbone), driven over the road loop by the
// quarter-car model. One side is built and mirrored. Params (mm unless noted) — see stops/190e/car.js, stops/540k/car.js:
//   axle "front"|"rear", label, readouts [travel|load|camber|toe|track], W0, links [{ name, tok, b, c }], legendTitle, legend?,
//   frame [[a, b, r]], bracket { y, z?, r? }, carrier { style: "hub", disc } | { style: "knuckle", kingpin: [i, j], arm: k, drum },
//   wheel { type: "tyre"|"wire", R, r, spokeR?, y }, spring { link, at, from?, top? | topOffset?, turns, r, pad? },
//   drive? { diff, box, inner, outer }, road { x0, x1, seg } (m), patch [len, width] (m)
import * as THREE from "three";
import { V, mm, Y, mat, rod, place, ball, helix, tyre, wireWheel } from "../lib/scene/helpers.js";
import { createLinkage, rotm } from "../lib/model/linkage.js";
import { createRide } from "../lib/model/quarter-car.js";
import { createRoad } from "../lib/scene/road.js";

const SLOWMO = 0.2;   // 25 km/h shown 5× slower

export function create(ctx, p) {
  const { stage, carRoot, frame, t } = ctx;
  const READOUTS = {
    travel: [t("Wheel travel"), t("mm, + = bump")], load: [t("Tyre load"), t("% of static")], camber: [t("Camber"), t("deg")],
    toe: [t("Toe"), t("deg, + = in")], track: [t("Track change"), t("mm at the tyre")],
  };
  const lk = createLinkage({ W0: p.W0, links: p.links, wheelR: frame.wheelR });
  const wb = frame.wheelbase / 1000;
  const ride = createRide({ ride: ctx.ride, xFront: frame.origin === "rear" ? wb : 0, xRear: frame.origin === "rear" ? 0 : -wb });

  // ---------- materials ----------
  const metal = stage.tokenMat("--metal"), dark = mat(0x343b42), springMat = stage.tokenMat("--l4");
  const knuckleMat = mat(0x5b6670, { metalness: 0.4 });
  const linkMats = p.links.map(l => stage.tokenMat(l.tok));
  const tyreMat = mat(0x22272b, { transparent: true, opacity: 0.5, depthWrite: false, roughness: 0.9 });
  const otherTyreMat = tyreMat.clone();
  const spokeMat = new THREE.LineBasicMaterial({ color: 0xc0c6cc, transparent: true, opacity: 0.8 });
  spokeMat.userData.solid = mat(0xc0c6cc, { metalness: 0.6 });
  const W = p.wheel, wheelOf = (m, spokes) => (W.type === "wire" ? wireWheel(m, spokes ? spokeMat : null, W.R / 1000, W.r / 1000, W.spokeR / 1000) : tyre(m, W.R / 1000, W.r / 1000));

  const road = createRoad(stage, frame, { road: p.road, patch: p.patch, shownAxle: p.axle, otherWheel: () => wheelOf(otherTyreMat, false) });
  stage.scene.add(road.world);

  // ---------- geometry ----------
  const group = new THREE.Group(); carRoot.add(group);
  const S = p.spring, seatLink = lk.links[S.link];
  const seatFrom = mm(S.from ?? p.links[S.link].b);
  const seatAt = cWorld => seatFrom.clone().lerp(cWorld, S.at);
  const springTop = S.top ? mm(S.top) : seatAt(mm(p.links[S.link].c)).add(mm(S.topOffset));
  if (p.drive) { const d = new THREE.Mesh(new THREE.BoxGeometry(...p.drive.box.map(v => v / 1000)), dark); d.position.copy(mm(p.drive.diff)); group.add(d); }

  function buildSide(mirror) {
    const g = new THREE.Group(); if (mirror) g.scale.y = -1; group.add(g);
    for (const [a, b, r] of p.frame) g.add(place(rod(metal, r / 1000), mm(a), mm(b)));
    for (const L of p.links) {
      const b = mm(L.b), to = V(b.x, p.bracket.y / 1000, p.bracket.z != null ? p.bracket.z / 1000 : b.z);
      g.add(place(rod(metal, (p.bracket.r ?? 9) / 1000), b, to), ball(dark, 0.016, b));
    }
    if (S.pad) g.add(ball(dark, 0.03, springTop));
    const carrier = new THREE.Group(); g.add(carrier);
    const C = p.carrier, cl = i => mm(lk.links[i].cl);
    if (C.style === "knuckle") {
      const lbj = cl(C.kingpin[0]), ubj = cl(C.kingpin[1]);
      carrier.add(place(rod(knuckleMat, 0.02), lbj, ubj), place(rod(knuckleMat, 0.025), V(0, lbj.y + 0.01, 0), V(0, 0.04, 0)),
        place(rod(knuckleMat, 0.012), V(0, lbj.y, -0.05), cl(C.arm)));
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(C.drum.r / 1000, C.drum.r / 1000, C.drum.w / 1000, 40), dark); drum.position.y = C.drum.y / 1000; carrier.add(drum);
    } else {
      carrier.add(place(rod(metal, 0.045), V(0, -0.05, 0), V(0, 0.03, 0)));
      lk.links.forEach((_, i) => carrier.add(place(rod(metal, 0.014), V(0, -0.02, 0), cl(i))));
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(C.disc.r / 1000, C.disc.r / 1000, C.disc.w / 1000, 40), dark); disc.position.y = C.disc.y / 1000; carrier.add(disc);
    }
    const wheel = wheelOf(tyreMat, true); wheel.position.y = W.y / 1000; carrier.add(wheel);
    const links = p.links.map((_, i) => { const o = { rod: rod(linkMats[i], 0.012), jb: ball(linkMats[i], 0.019), jc: ball(linkMats[i], 0.021) }; g.add(o.rod, o.jb, o.jc); return o; });
    const spring = new THREE.Mesh(new THREE.BufferGeometry(), springMat); g.add(spring);
    const pad = S.pad ? new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.012, 24), dark) : null; if (pad) g.add(pad);
    const shaft = p.drive ? { rod: rod(metal, 0.016), a: ball(dark, 0.035), b: ball(dark, 0.035) } : null;
    if (shaft) g.add(shaft.rod, shaft.a, shaft.b);
    return { carrier, links, spring, pad, shaft };
  }
  const sides = [buildSide(false), buildSide(true)];

  const R4 = new THREE.Matrix4();
  let q = [0, 0, 0, 0, 0, 0];
  function pose(travelMm) {
    q = lk.solve(q, travelMm);
    const R = rotm(q.slice(3));
    R4.set(R[0], R[1], R[2], 0, R[3], R[4], R[5], 0, R[6], R[7], R[8], 0, 0, 0, 0, 1);
    const wc = mm([p.W0[0] + q[0], p.W0[1] + q[1], p.W0[2] + q[2]]);
    const seat = seatAt(mm(lk.carrierPoint(q, seatLink.cl, R)));
    const springGeo = helix(seat, springTop, S.turns, S.r / 1000);
    sides[0].spring.geometry.dispose();
    for (const s of sides) {
      s.carrier.quaternion.setFromRotationMatrix(R4); s.carrier.position.copy(wc);
      lk.links.forEach((L, i) => {
        const b = mm(L.b), c = mm(lk.carrierPoint(q, L.cl, R));
        place(s.links[i].rod, b, c); s.links[i].jb.position.copy(b); s.links[i].jc.position.copy(c);
      });
      s.spring.geometry = springGeo;
      if (s.pad) { s.pad.position.copy(seat); s.pad.quaternion.setFromUnitVectors(Y, new THREE.Vector3().subVectors(springTop, seat).normalize()); }
      if (s.shaft) {
        const inner = mm(p.drive.inner), outer = wc.clone().add(V(0, p.drive.outer / 1000, 0).applyQuaternion(s.carrier.quaternion));
        place(s.shaft.rod, inner, outer); s.shaft.a.position.copy(inner); s.shaft.b.position.copy(outer);
      }
    }
    return lk.angles(q);
  }

  // ---------- panel ----------
  let playing = !ctx.reducedMotion, photoT = 0, frameN = 0;
  const ui = ctx.panel([
    { label: p.label, items: [
      { readouts: p.readouts.map(id => ({ id, label: READOUTS[id][0], unit: READOUTS[id][1] })) },
      { trace: { id: "trace", series: [{ token: "--accent", min: -60, max: 60 }, { token: "--l1", min: 0, max: 200 }], top: t("bump / 200 %"), bottom: t("rebound / 0 %"), aria: t("Wheel travel and tyre load over the last six seconds") }, only: "model" },
      { key: [["--accent", t("travel (±60 mm)")], ["--l1", t("tyre load (0–200 %)")]], only: "model" },
      { buttons: [{ id: "play", toggle: [t("Pause"), t("Play")], pressed: playing, onClick: v => (playing = v) }] },
    ] },
    { label: p.legendTitle ?? t("Parts"), items: [{ legend: p.legend ?? p.links.map(l => [l.tok, l.name]) }] },
  ]);
  const trace = ui.trace("trace");
  const fmt = { travel: v => v.toFixed(0), camber: v => v.toFixed(2), toe: v => v.toFixed(2), track: v => v.toFixed(1) };

  return {
    layout({ active, onPhoto }) {
      group.visible = active; road.world.visible = active && !onPhoto;
      tyreMat.opacity = onPhoto ? 0 : 0.5;
      spokeMat.opacity = onPhoto ? 0 : 0.8; spokeMat.userData.solid.visible = !onPhoto;
    },
    update(dt, { onPhoto }) {
      let travel, load = null;
      if (onPhoto) {
        if (playing) photoT += dt;
        travel = Math.sin(photoT * 1.4) * 60;   // car at rest in the photo: just cycle the wheel
      } else {
        if (playing) ride.step(dt * SLOWMO);
        travel = Math.max(-80, Math.min(80, ride.travelMm(p.axle)));
        load = ride.loadPct(p.axle);
        carRoot.position.set(0, 0, ride.bodyZ()); carRoot.rotation.set(0, ride.pitch(), 0);
        road.update(ride);
        if (playing) { trace.push(ride.t, [travel, load]); if (++frameN % 2 === 0) trace.draw(ride.t); }
      }
      const a = pose(travel), vals = { ...a, travel };
      for (const id of p.readouts) ui.set(id, id === "load" ? (load == null ? "–" : load.toFixed(0)) : fmt[id](vals[id]));
    },
  };
}
