// Road strip that follows roadProfile under the car, contact patches that scale with tyre load,
// and the wheels of the axle that is not being shown. Lives in world space (does not pitch with the body).
import * as THREE from "three";
import { roadProfile } from "../model/quarter-car.js";

// frame: car.frame (mm). opts: { x0, x1, seg } road extent (m); patch: [length per load ratio, width] (m);
// otherWheel(): builds one wheel of the other axle; shownAxle: "front" | "rear".
export function createRoad(stage, frame, { road, patch = [0.07, 0.065], shownAxle, otherWheel }) {
  const world = new THREE.Group();
  const ground = -frame.wheelR / 1000, wb = frame.wheelbase / 1000;
  const xFront = frame.origin === "rear" ? wb : 0, xRear = xFront - wb;
  const { x0, x1, seg } = road;

  const geo = new THREE.PlaneGeometry(x1 - x0, 3.4, seg, 1); geo.translate((x0 + x1) / 2, 0, 0);
  const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 128;
  const tex = new THREE.CanvasTexture(canvas); tex.wrapS = THREE.RepeatWrapping; tex.repeat.set((x1 - x0) / 4, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  stage.onTheme(({ dark }) => {
    const g = canvas.getContext("2d");
    g.fillStyle = dark ? "#2a3138" : "#b9c0c6"; g.fillRect(0, 0, 512, 128);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${dark ? "255,255,255" : "0,0,0"},${Math.random() * 0.07})`; g.fillRect(Math.random() * 512, Math.random() * 128, 2, 2); }
    g.fillStyle = dark ? "#d8dde2" : "#ffffff"; g.fillRect(0, 6, 512, 5); g.fillRect(0, 117, 512, 5); g.fillRect(40, 61, 200, 6);
    tex.needsUpdate = true;
  });
  world.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 })));
  const pos = geo.attributes.position;

  // Patches: [shown axle left, right, other axle left, right].
  const shownX = shownAxle === "front" ? xFront : xRear, otherX = shownAxle === "front" ? xRear : xFront;
  const shownY = (shownAxle === "front" ? frame.halfTrackFront : frame.halfTrackRear) / 1000;
  const otherY = (shownAxle === "front" ? frame.halfTrackRear : frame.halfTrackFront) / 1000;
  const patchGeo = new THREE.CircleGeometry(1, 28);
  const patches = [[shownX, shownY], [shownX, -shownY], [otherX, otherY], [otherX, -otherY]].map(([x, y]) => {
    const m = new THREE.Mesh(patchGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, depthTest: false }));
    m.position.set(x, y, 0); m.renderOrder = 5; world.add(m); return m;
  });
  const others = [otherY, -otherY].map(y => { const w = otherWheel(); w.position.set(otherX, y, 0); world.add(w); return w; });

  // ride: createRide() instance.
  function update(ride) {
    for (let i = 0; i < pos.count; i++) pos.setZ(i, ground + roadProfile(pos.getX(i) + ride.dist));
    pos.needsUpdate = true; geo.computeVertexNormals();
    tex.offset.x = (ride.dist / 4) % 1;
    const shown = ride.corner(shownAxle), other = ride.corner(shownAxle === "front" ? "rear" : "front");
    others.forEach(w => (w.position.z = other.zu));
    [shown, shown, other, other].forEach((c, i) => {
      const p = patches[i], ratio = Math.max(0, c.load / c.fStatic);
      p.position.z = ground + c.zr + 0.002;
      p.scale.set(0.02 + patch[0] * ratio, patch[1], 1);
      p.material.color.copy(stage.color(ratio < 0.35 ? "--warn" : "--l1"));
      p.material.opacity = ratio < 0.02 ? 0.25 : 0.9;
    });
  }
  return { world, update, xFront, xRear };
}
