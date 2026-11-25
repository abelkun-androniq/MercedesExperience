// The Evo II mesh for the offline wind tunnel: reads a binary glTF (Node built-ins only) and returns its triangles in the
// stop's vehicle frame: mm, x forward, y left, z up, origin = front axle centre on the ground (stops/190e-evo2/car.js).
// Source: "Mercedes-Benz Evolution II (190E)" by marksform, Sketchfab, CC BY-NC 4.0 (tools/cfd/evo2.glb, not published).
import { readFileSync } from "node:fs";

const mul = (a, b) => {   // column-major 4×4
  const o = new Array(16).fill(0);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  return o;
};
const trs = n => {
  if (n.matrix) return n.matrix;
  const [x, y, z, w] = n.rotation ?? [0, 0, 0, 1], [sx, sy, sz] = n.scale ?? [1, 1, 1], [tx, ty, tz] = n.translation ?? [0, 0, 0];
  return [(1 - 2 * (y * y + z * z)) * sx, 2 * (x * y + z * w) * sx, 2 * (x * z - y * w) * sx, 0,
    2 * (x * y - z * w) * sy, (1 - 2 * (x * x + z * z)) * sy, 2 * (y * z + x * w) * sy, 0,
    2 * (x * z + y * w) * sz, 2 * (y * z - x * w) * sz, (1 - 2 * (x * x + y * y)) * sz, 0, tx, ty, tz, 1];
};

// Triangles as [{ name, tris: Float64Array(9 per triangle) }] in glTF world space (metres, y up).
export function readGlb(path) {
  const b = readFileSync(path), jl = b.readUInt32LE(12), j = JSON.parse(b.subarray(20, 20 + jl).toString());
  const bin = b.subarray(20 + jl + 8);
  const acc = i => {
    const a = j.accessors[i], v = j.bufferViews[a.bufferView], n = { SCALAR: 1, VEC3: 3 }[a.type], off = (v.byteOffset ?? 0) + (a.byteOffset ?? 0);
    const T = { 5126: Float32Array, 5125: Uint32Array, 5123: Uint16Array }[a.componentType];
    const stride = v.byteStride ? v.byteStride / T.BYTES_PER_ELEMENT : n, src = new T(bin.buffer, bin.byteOffset + off, (a.count - 1) * stride + n);
    const out = new Float64Array(a.count * n);
    for (let k = 0; k < a.count; k++) for (let c = 0; c < n; c++) out[k * n + c] = src[k * stride + c];
    return out;
  };
  const parts = [];
  const walk = (ni, M, name) => {
    const n = j.nodes[ni], W = mul(M, trs(n)), nm = /Wheel|Plate|Body/.test(n.name ?? "") ? n.name : name;
    if (n.mesh != null) for (const p of j.meshes[n.mesh].primitives) {
      const P = acc(p.attributes.POSITION), I = p.indices != null ? acc(p.indices) : P.map((_, k) => k).filter(k => k < P.length / 3);
      const tris = new Float64Array(I.length * 3);
      I.forEach((v, k) => {
        const x = P[3 * v], y = P[3 * v + 1], z = P[3 * v + 2];
        for (let c = 0; c < 3; c++) tris[3 * k + c] = W[c] * x + W[4 + c] * y + W[8 + c] * z + W[12 + c];
      });
      parts.push({ name: nm, tris });
    }
    for (const c of n.children ?? []) walk(c, W, nm);
  };
  for (const r of j.scenes[j.scene ?? 0].nodes) walk(r, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], "");
  return parts;
}

// glTF world (x right, y up, z forward, m) → vehicle frame (mm). The front axle and the ground come from the wheels.
export function loadEvo2(path = new URL("./evo2.glb", import.meta.url)) {
  const parts = readGlb(path).map(p => {
    const t = new Float64Array(p.tris.length);
    for (let k = 0; k < t.length; k += 3) { t[k] = p.tris[k + 2] * 1000; t[k + 1] = -p.tris[k] * 1000; t[k + 2] = p.tris[k + 1] * 1000; }
    return { name: p.name, tris: t };
  });
  const box = name => {
    const t = parts.filter(p => p.name === name).flatMap(p => [...p.tris]), b = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
    for (let k = 0; k < t.length; k++) { b[k % 3] = Math.min(b[k % 3], t[k]); b[3 + k % 3] = Math.max(b[3 + k % 3], t[k]); }
    return b;
  };
  const fl = box("FrontLeftWheel_1"), x0 = (fl[0] + fl[3]) / 2, z0 = fl[2];
  for (const p of parts) for (let k = 0; k < p.tris.length; k += 3) { p.tris[k] -= x0; p.tris[k + 2] -= z0; }
  return { parts, box };
}
