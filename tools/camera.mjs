// Pinhole camera maths shared by the photo tools. cam = { c: [x, y, z] (mm), yaw, pitch, roll (rad), f (px) } as in
// car.js photo.cam; image = { width, height }; principal point = image centre; vehicle frame x forward, y left, z up.
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// Forward, right and up unit vectors of a camera.
export function basis(yaw, pitch, roll) {
  const f = [Math.cos(pitch) * Math.cos(yaw), Math.cos(pitch) * Math.sin(yaw), Math.sin(pitch)];
  let r = [f[1], -f[0], 0]; const n = Math.hypot(...r); r = r.map(v => v / n);   // r = f × z
  const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  const c = Math.cos(roll), s = Math.sin(roll);
  return { f, r: r.map((v, i) => c * v + s * u[i]), u: u.map((v, i) => c * v - s * r[i]) };
}

export function camera(cam, image) {
  const { f, r, u } = basis(cam.yaw, cam.pitch, cam.roll), CX = image.width / 2, CY = image.height / 2;
  return {
    // Vehicle point (mm) → pixel.
    project(X) { const d = X.map((v, i) => v - cam.c[i]), z = dot(d, f); return [CX + cam.f * dot(d, r) / z, CY - cam.f * dot(d, u) / z]; },
    // Pixel → the point (mm) where its ray meets the vertical plane y = y0: a traced outline point lies on a known plane.
    onPlaneY([px, py], y0) {
      const a = (px - CX) / cam.f, b = -(py - CY) / cam.f, d = f.map((v, i) => v + a * r[i] + b * u[i]), t = (y0 - cam.c[1]) / d[1];
      return [cam.c[0] + t * d[0], y0, cam.c[2] + t * d[2]];
    },
  };
}
