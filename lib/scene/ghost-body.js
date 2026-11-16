// Translucent "ghost" body built from data in car.body.ghost (mm, vehicle frame). Parts:
//   { pts: [[x, z] | { arc: [cx, cz, r, a0°, a1°, n] }, …], y: [y0, y1], mirror? }   side profile extruded across y
//   { torus: { R, r, pos: [x, y, z], rot: [rx°, ry°, rz°] } }                        e.g. a spare wheel
//   { cyl: { r: [rTop, rBottom], h, axis: "x" | "y" | "z", pos: [x, y, z] }, mirror? } e.g. a headlamp
// mirror: also build the part reflected to −y. A later GLB body can replace this module behind the same return shape.
import * as THREE from "three";
import { profileExtrude, edgesOf } from "./helpers.js";

const D = Math.PI / 180;

export function buildGhost(parts = []) {
  const group = new THREE.Group();
  const fill = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06, depthWrite: false, side: THREE.DoubleSide });
  const edge = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
  for (const part of parts) {
    for (const s of part.mirror ? [1, -1] : [1]) {
      let geo;
      if (part.pts) {
        const [y0, y1] = part.y;
        geo = s > 0 ? profileExtrude(part.pts, y0, y1) : profileExtrude(part.pts, -y1, -y0);
      } else if (part.torus) {
        const t = part.torus;
        geo = new THREE.TorusGeometry(t.R / 1000, t.r / 1000, 8, 32);
        const e = new THREE.Euler(...(t.rot ?? [0, 0, 0]).map(a => a * D));
        geo.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(e)).translate(t.pos[0] / 1000, s * t.pos[1] / 1000, t.pos[2] / 1000);
      } else if (part.cyl) {
        const c = part.cyl;
        geo = new THREE.CylinderGeometry(c.r[0] / 1000, c.r[1] / 1000, c.h / 1000, 20);
        if (c.axis === "x") geo.rotateZ(Math.PI / 2); else if (c.axis === "z") geo.rotateX(Math.PI / 2);
        geo.translate(c.pos[0] / 1000, s * c.pos[1] / 1000, c.pos[2] / 1000);
      }
      if (geo) edgesOf(geo, group, fill, edge, 25);
    }
  }
  return { group, fill, edge };
}
