// Multi-link wheel-carrier closure (docs/TOUR-POC.md §6.1). Pure: no DOM, no three.js.
// Vehicle frame in mm: x forward, y left (outboard for a left wheel), z up.
// Carrier pose q = [tx, ty, tz (mm, wheel-centre displacement), rx, ry, rz (rotation vector, rad)].
// Five fixed-length links + prescribed wheel-centre z close the 6 DOF. A double wishbone is the same
// problem: each wishbone is two legs sharing a ball joint, plus the track rod.

export function rotm(v) {
  const th = Math.hypot(v[0], v[1], v[2]);
  if (th < 1e-12) return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const x = v[0] / th, y = v[1] / th, z = v[2] / th, c = Math.cos(th), s = Math.sin(th), C = 1 - c;
  return [c + x * x * C, x * y * C - z * s, x * z * C + y * s,
          y * x * C + z * s, c + y * y * C, y * z * C - x * s,
          z * x * C - y * s, z * y * C + x * s, c + z * z * C];
}

export const mul = (R, v) => [R[0] * v[0] + R[1] * v[1] + R[2] * v[2], R[3] * v[0] + R[4] * v[1] + R[5] * v[2], R[6] * v[0] + R[7] * v[1] + R[8] * v[2]];

// Gaussian elimination with partial pivoting.
export function gauss(A, b) {
  const n = b.length, M = A.map((row, i) => [...row, b[i]]);
  for (let k = 0; k < n; k++) {
    let p = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
    [M[k], M[p]] = [M[p], M[k]];
    for (let i = k + 1; i < n; i++) {
      const f = M[i][k] / M[k][k];
      for (let j = k; j <= n; j++) M[i][j] -= f * M[k][j];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = M[i][n];
    for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / M[i][i];
  }
  return x;
}

// links: [{ b: body point, c: carrier point }] in mm, at design position. W0: wheel centre. wheelR: tyre radius (mm).
export function createLinkage({ W0, links, wheelR = 0 }) {
  const L = links.map(l => {
    const cl = [l.c[0] - W0[0], l.c[1] - W0[1], l.c[2] - W0[2]];
    const d = [l.c[0] - l.b[0], l.c[1] - l.b[1], l.c[2] - l.b[2]];
    return { b: l.b, cl, len2: d[0] * d[0] + d[1] * d[1] + d[2] * d[2] };
  });

  function carrierPoint(q, local, R = rotm(q.slice(3))) {
    const p = mul(R, local);
    return [p[0] + q[0] + W0[0], p[1] + q[1] + W0[1], p[2] + q[2] + W0[2]];
  }

  function residual(q, s) {
    const R = rotm(q.slice(3));
    const r = L.map(l => {
      const p = carrierPoint(q, l.cl, R);
      const d = [p[0] - l.b[0], p[1] - l.b[1], p[2] - l.b[2]];
      return (d[0] * d[0] + d[1] * d[1] + d[2] * d[2] - l.len2) / 1000;
    });
    r.push(q[2] - s);
    return r;
  }

  // Newton–Raphson with a finite-difference Jacobian, warm-started from q0. s = wheel travel (mm, + = bump).
  function solve(q0, s) {
    const q = q0.slice();
    for (let it = 0; it < 30; it++) {
      const r = residual(q, s);
      if (Math.max(...r.map(Math.abs)) < 1e-10) break;
      const J = r.map(() => new Array(6));
      for (let j = 0; j < 6; j++) {
        const h = j < 3 ? 1e-4 : 1e-7, qh = q.slice();
        qh[j] += h;
        const rh = residual(qh, s);
        for (let i = 0; i < 6; i++) J[i][j] = (rh[i] - r[i]) / h;
      }
      const dq = gauss(J, r.map(v => -v));
      for (let j = 0; j < 6; j++) q[j] += dq[j];
    }
    return q;
  }

  // Camber: negative = top of wheel inboard. Toe: positive = toe-in. Track: sideways shift of the contact point, + = outward.
  function angles(q) {
    const R = rotm(q.slice(3)), a = mul(R, [0, 1, 0]);
    return {
      camber: -Math.atan2(a[2], a[1]) * 180 / Math.PI,
      toe: Math.atan2(a[0], a[1]) * 180 / Math.PI,
      track: carrierPoint(q, [0, 0, -wheelR], R)[1] - W0[1],
    };
  }

  return { W0, links: L, carrierPoint, residual, solve, angles };
}
