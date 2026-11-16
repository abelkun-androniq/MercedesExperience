// Geometry helpers shared by all subsystems. Scene units are metres; hardpoints are mm in the vehicle frame (x fwd, y left, z up).
import * as THREE from "three";

export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export const mm = v => V(v[0] / 1000, v[1] / 1000, v[2] / 1000);
export const Y = V(0, 1, 0);
const cylGeo = new THREE.CylinderGeometry(1, 1, 1, 16), sphGeo = new THREE.SphereGeometry(1, 16, 12);

export const mat = (c = 0xffffff, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.15, ...o });
export const glass = (c = 0x8fa3b3, opacity = 0.12) => new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide });
export const line = (c = 0x8fa3b3, opacity = 0.6) => new THREE.LineBasicMaterial({ color: c, transparent: true, opacity });

// Unit cylinder stretched between two points by place(); r = radius (m).
export function rod(m, r) { const o = new THREE.Mesh(cylGeo, m); o.userData.r = r; return o; }
export function place(o, a, b) {
  const d = new THREE.Vector3().subVectors(b, a), len = d.length();
  o.position.copy(a).addScaledVector(d, 0.5);
  if (len > 1e-9) o.quaternion.setFromUnitVectors(Y, d.multiplyScalar(1 / len));
  o.scale.set(o.userData.r, Math.max(len, 1e-6), o.userData.r);
  return o;
}
export function ball(m, r, p) { const o = new THREE.Mesh(sphGeo, m); o.scale.setScalar(r); if (p) o.position.copy(p); return o; }

// Coil spring between a and b.
export function helix(a, b, turns = 7, r = 0.046, wire = 0.007) {
  const d = new THREE.Vector3().subVectors(b, a), len = d.length(), n = d.clone().normalize();
  const t1 = V(1, 0, 0).cross(n).normalize(), t2 = n.clone().cross(t1), pts = [];
  for (let i = 0; i <= 200; i++) {
    const u = i / 200, th = u * Math.PI * 2 * turns;
    pts.push(a.clone().addScaledVector(n, u * len).addScaledVector(t1, Math.cos(th) * r).addScaledVector(t2, Math.sin(th) * r));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 200, wire, 6, false);
}

// Tyre (torus) with its axis along y. R = ring radius, r = section radius (m).
export function tyre(m, R = 0.235, r = 0.057) {
  const g = new THREE.Group();
  const t = new THREE.Mesh(new THREE.TorusGeometry(R, r, 14, 56), m); t.rotation.x = Math.PI / 2; g.add(t);
  return g;
}

// Tyre on a wire wheel, axis along y. spokeMat is a LineBasicMaterial; spokeMat.userData.solid is the rim material.
export function wireWheel(tyreMat, spokeMat, R = 0.295, r = 0.085, spokeR = 0.215, spokes = 32) {
  const g = tyre(tyreMat, R, r);
  if (spokeMat) {
    const pts = [];
    for (let i = 0; i < spokes; i++) {
      const a = i / spokes * Math.PI * 2, side = i % 2 ? 0.035 : -0.035;
      pts.push(0, side, 0, spokeR * Math.cos(a), 0, spokeR * Math.sin(a));
    }
    const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    g.add(new THREE.LineSegments(sg, spokeMat));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(spokeR, 0.008, 6, 48), spokeMat.userData.solid); rim.rotation.x = Math.PI / 2; g.add(rim);
  }
  return g;
}

// Wooden artillery-style wheel (spokes as rods), axis along y.
export function spokedWheel(tyreMat, spokeMat, R = 0.42, spokes = 12) {
  const g = tyre(tyreMat, R, 0.022);
  for (let i = 0; i < spokes; i++) { const a = i / spokes * Math.PI * 2; g.add(place(rod(spokeMat, 0.012), V(0, 0, 0), V(R * Math.cos(a), 0, R * Math.sin(a)))); }
  g.add(place(rod(spokeMat, 0.05), V(0, -0.06, 0), V(0, 0.06, 0)));
  return g;
}

export function edgesOf(geo, group, fillMat, lineMat, thresh = 22) {
  group.add(new THREE.Mesh(geo, fillMat), new THREE.LineSegments(new THREE.EdgesGeometry(geo, thresh), lineMat));
}

// Points along an arc in a 2-D profile (mm, degrees).
export const arc = (cx, cz, r, a0, a1, n = 14) => Array.from({ length: n + 1 }, (_, i) => {
  const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cz + r * Math.sin(a)];
});

// Side-profile polygon (x, z in mm) extruded across y from y0 to y1 (mm). Entries may be { arc: [cx, cz, r, a0, a1, n] }.
export function profileExtrude(pts, y0, y1) {
  const flat = pts.flatMap(p => (p.arc ? arc(...p.arc) : [p]));
  const s = new THREE.Shape(); s.moveTo(flat[0][0], flat[0][1]); for (const p of flat.slice(1)) s.lineTo(p[0], p[1]);
  const g = new THREE.ExtrudeGeometry(s, { depth: y1 - y0, bevelEnabled: false });
  g.rotateX(Math.PI / 2); g.translate(0, y1, 0); g.scale(0.001, 0.001, 0.001);
  return g;
}

export function pipe(points, r, m) {
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.1), 48, r, 10, false), m);
}

// Spur gear, axis along x.
export function gear(R, teeth, w, m) {
  const g = new THREE.Group(), body = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.006, R - 0.006, w, 48), m); body.rotation.z = Math.PI / 2; g.add(body);
  for (let i = 0; i < teeth; i++) {
    const a = i / teeth * Math.PI * 2, t = new THREE.Mesh(new THREE.BoxGeometry(w, 0.012, 0.008), m);
    t.position.set(0, R * Math.cos(a), R * Math.sin(a)); t.rotation.x = a; g.add(t);
  }
  return g;
}

// Polyline parametrised by arc length, for particles: at(pl, s ∈ [0,1], out).
export function polyline(points) {
  const segs = []; let tot = 0;
  for (let i = 1; i < points.length; i++) { const l = points[i].distanceTo(points[i - 1]); segs.push(l); tot += l; }
  return { points, segs, tot };
}
export function at(pl, s, out) {
  let d = s * pl.tot;
  for (let i = 0; i < pl.segs.length; i++) {
    if (d <= pl.segs[i] || i === pl.segs.length - 1) return out.copy(pl.points[i]).lerp(pl.points[i + 1], Math.min(1, d / pl.segs[i]));
    d -= pl.segs[i];
  }
  return out.copy(pl.points[pl.points.length - 1]);
}

// Point cloud whose positions/colours are rewritten each frame.
export function particles(n, size = 0.026) {
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, opacity: 0.95, depthTest: false }));
  pts.renderOrder = 6;
  return { pts, pos, col, set(i, p, c) { pos.set([p.x, p.y, p.z], i * 3); col.set([c.r, c.g, c.b], i * 3); },
    flush() { geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true; } };
}
