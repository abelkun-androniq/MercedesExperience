// Pin-jointed space truss, linear elastic. Pure: no DOM, no three.js. Units: mm, N.
import { gauss } from "./linkage.js";

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// t = { nodes: [[x, y, z]], members: [{ ends: [i, j], EA }], fixed: [{ node, dof: "xyz" }], loads: [{ node, f: [fx, fy, fz] }] }.
// Returns node displacements u (mm) and member forces (N, + = tension). Supports must remove every rigid-body motion.
export function solveTruss({ nodes, members, fixed, loads }) {
  const N = 3 * nodes.length, K = Array.from({ length: N }, () => new Float64Array(N)), F = new Float64Array(N);
  const geo = members.map(m => {
    const d = sub(nodes[m.ends[1]], nodes[m.ends[0]]), L = Math.hypot(...d);
    return { e: d.map(c => c / L), k: m.EA / L };
  });
  members.forEach((m, n) => {
    const [i, j] = m.ends, { e, k } = geo[n];
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) {
      const kab = k * e[a] * e[b];
      K[3 * i + a][3 * i + b] += kab; K[3 * j + a][3 * j + b] += kab;
      K[3 * i + a][3 * j + b] -= kab; K[3 * j + a][3 * i + b] -= kab;
    }
  });
  for (const l of loads) for (let a = 0; a < 3; a++) F[3 * l.node + a] += l.f[a];
  // Nodes no member touches carry nothing: hold them so the system stays solvable.
  const used = new Set(members.flatMap(m => m.ends));
  const held = [...fixed, ...nodes.flatMap((_, i) => (used.has(i) ? [] : [{ node: i, dof: "xyz" }]))];
  for (const s of held) for (const c of s.dof) {
    const r = 3 * s.node + "xyz".indexOf(c);
    K[r].fill(0); for (const row of K) row[r] = 0; K[r][r] = 1; F[r] = 0;
  }
  const x = gauss(K.map(row => Array.from(row)), Array.from(F));
  const u = nodes.map((_, i) => [x[3 * i], x[3 * i + 1], x[3 * i + 2]]);
  const forces = members.map((m, n) => geo[n].k * dot(geo[n].e, sub(u[m.ends[1]], u[m.ends[0]])));
  return { u, forces };
}

// Tubular frame from cross-sections. Each station { x, w (half width), z: [floor, sill, top] } has six nodes (left/right ×
// three levels), braced into a rigid ring. Each bay between stations: longitudinals, a diagonal in every side panel and in
// the floor, and optionally in the top. door: "high" keeps the full-height side truss (300 SL); "low" cuts it down to the
// sill, as a conventional door opening would (no top rail, no upper side diagonal); a station between two such bays
// then has no top ring either. node(s, side, level): side 0 = left (+y), 1 = right (−y); level 0 floor, 1 sill, 2 top.
export function tubeFrame(stations, bays, EA) {
  const node = (s, side, level) => s * 6 + side * 3 + level;
  const nodes = stations.flatMap(st => [1, -1].flatMap(sy => st.z.map(z => [st.x, sy * st.w, z])));
  const members = [], add = (i, j, tag) => members.push({ ends: [i, j], EA, tag });
  stations.forEach((_, s) => {
    const top = [bays[s - 1], bays[s]].some(b => b && b.door !== "low");
    for (let lv = 0; lv < (top ? 3 : 2); lv++) add(node(s, 0, lv), node(s, 1, lv), "ring");
    for (const side of [0, 1]) { add(node(s, side, 0), node(s, side, 1), "ring"); if (top) add(node(s, side, 1), node(s, side, 2), "ring"); }
    add(node(s, 0, 0), node(s, 1, 1), "ring"); if (top) add(node(s, 0, 1), node(s, 1, 2), "ring");
  });
  bays.forEach((b, s) => {
    const low = b.door === "low", tag = b.door ? "door" : "bay";
    for (const side of [0, 1]) {
      for (let lv = 0; lv < 3; lv++) if (!(low && lv === 2)) add(node(s, side, lv), node(s + 1, side, lv), lv === 2 ? `${tag}-top` : tag);
      add(node(s, side, 0), node(s + 1, side, 1), tag);
      if (!low) add(node(s, side, 1), node(s + 1, side, 2), `${tag}-top`);
    }
    add(node(s, 0, 0), node(s + 1, 1, 0), tag);
    if (b.top && !low) add(node(s, 0, 2), node(s + 1, 1, 2), tag);
  });
  return { nodes, members, node };
}

// Torsion test: rear station held, one front corner lifted by F (N); the other front corner rests on a support.
// Returns stiffness (N·m per degree of twist) and the solution for drawing.
export function twistTest(frame, front, rear, F) {
  const { node } = frame;
  const sol = solveTruss({
    ...frame,
    fixed: [{ node: node(rear, 0, 0), dof: "xyz" }, { node: node(rear, 1, 0), dof: "xz" }, { node: node(front, 1, 0), dof: "z" }],
    loads: [{ node: node(front, 0, 0), f: [0, 0, F] }],
  });
  const track = 2 * frame.nodes[node(front, 0, 0)][1];
  const twist = Math.atan2(sol.u[node(front, 0, 0)][2], track) * 180 / Math.PI;
  return { ...sol, twist, stiffness: F * track / 1000 / twist };
}
