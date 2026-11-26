// Crankshaft twist (torsional vibration), illustrative: the crank of a straight-eight as two lumped halves (cylinders 1–4
// and 5–8), elastic between them, with the output gear either in the middle (the M 196's centre take-off) or behind the
// last cylinder (an end take-off for comparison). The gear drives a heavy driveline through a soft propeller shaft.
// Each half receives the same torque ripple (ripple × mean torque, Nm, shared between the halves) at the firing frequency (four pulses per crank turn); damping is structural
// (stiffness k(1 + 2iζ)), so a resonance peak scales as 1 / 2ζ. Steady-state response by a complex linear solve. Pure.
// Positions along the crank as a share of its length: halves at ¼ and ¾, the gear at ½ or 1.
export const TORSION = { J: 0.02, Jgear: 0.01, Jload: 0.3, K: 5.3e4, kProp: 3000, mean: 240, ripple: 0.6, order: 4 };   // all illustrative

export function torsionResponse(layout, rpm, zeta, p = TORSION) {
  const gearAt = layout === "centre" ? 0.5 : 1, T = p.ripple * p.mean / 2, nodes = [{ x: 0.25, J: p.J, T }, { x: 0.75, J: p.J, T }, { x: gearAt, J: p.Jgear, T: 0, gear: true }].sort((a, b) => a.x - b.x);
  nodes.push({ J: p.Jload, T: 0, load: true });
  const n = nodes.length, w = p.order * rpm / 60 * 2 * Math.PI, g = nodes.findIndex(q => q.gear);
  // Springs: neighbours along the crank (stiffness ∝ 1 / length), and the gear to the load.
  const springs = [];
  for (let i = 0; i < n - 2; i++) springs.push([i, i + 1, p.K / (nodes[i + 1].x - nodes[i].x)]);
  springs.push([g, n - 1, p.kProp]);
  // (K* − ω² J) θ = T, complex as [re, im] pairs.
  const A = Array.from({ length: n }, () => Array.from({ length: n }, () => [0, 0])), b = nodes.map(q => [q.T, 0]);
  for (const [i, j, k] of springs) for (const [a, c, s] of [[i, i, 1], [j, j, 1], [i, j, -1], [j, i, -1]]) { A[a][c][0] += s * k; A[a][c][1] += s * k * 2 * zeta; }
  nodes.forEach((q, i) => (A[i][i][0] -= w * w * q.J));
  const th = solve(A, b), amp = ([re, im]) => Math.hypot(re, im), sub = (u, v) => [u[0] - v[0], u[1] - v[1]];
  // Twist (rad): the larger swing of either crank half against the gear; prop: the propeller-shaft torque swing (Nm).
  const halves = nodes.map((q, i) => i).filter(i => i !== g && !nodes[i].load);
  return { twist: Math.max(...halves.map(i => amp(sub(th[i], th[g])))), prop: amp(sub(th[g], th[n - 1])) * p.kProp,
    nodes: nodes.map((q, i) => ({ x: q.x, gear: !!q.gear, load: !!q.load, rel: sub(th[i], th[g]) })) };
}

// Engine speed (rpm) where the twist peaks, searched over [lo, hi].
export function resonanceRpm(layout, zeta, lo = 1000, hi = 12000, p = TORSION) {
  let best = lo, max = -1;
  for (let r = lo; r <= hi; r += 25) { const v = torsionResponse(layout, r, zeta, p).twist; if (v > max) { max = v; best = r; } }
  return max > 1.5 * torsionResponse(layout, hi, zeta, p).twist && best < hi ? best : null;   // null: no peak inside the range
}

function solve(A, b) {   // Gaussian elimination with partial pivoting, complex entries [re, im]
  const n = b.length, M = A.map((row, i) => [...row.map(c => [...c]), [...b[i]]]);
  const mul = (u, v) => [u[0] * v[0] - u[1] * v[1], u[0] * v[1] + u[1] * v[0]], div = (u, v) => { const d = v[0] ** 2 + v[1] ** 2; return [(u[0] * v[0] + u[1] * v[1]) / d, (u[1] * v[0] - u[0] * v[1]) / d]; };
  for (let c = 0; c < n; c++) {
    let pr = c; for (let r = c + 1; r < n; r++) if (Math.hypot(...M[r][c]) > Math.hypot(...M[pr][c])) pr = r;
    [M[c], M[pr]] = [M[pr], M[c]];
    for (let r = c + 1; r < n; r++) { const f = div(M[r][c], M[c][c]); for (let k = c; k <= n; k++) { const m = mul(f, M[c][k]); M[r][k] = [M[r][k][0] - m[0], M[r][k][1] - m[1]]; } }
  }
  const x = Array(n);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) { const m = mul(M[r][k], x[k]); s = [s[0] - m[0], s[1] - m[1]]; } x[r] = div(s, M[r][r]); }
  return x;
}
