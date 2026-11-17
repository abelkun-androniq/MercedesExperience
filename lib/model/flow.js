// 2-D wind tunnel on the car's centre plane: lattice Boltzmann (D2Q9, BGK collision with a Smagorinsky eddy viscosity, so
// the wake can turn turbulent without the solver blowing up). Pure: no DOM, no three.js.
// Lattice units: one cell, one step. Air enters at column i = 0 with speed U and leaves at i = nx − 1. Row j = 0 sits on the
// road, which moves with the air (car frame: the road streams past at the car's speed, so it grows no boundary layer). The
// top is a free-slip wall; the body (solid cells) is a no-slip wall (half-way bounce-back).
const CX = [0, 1, 0, -1, 0, 1, -1, -1, 1], CZ = [0, 0, 1, 0, -1, 1, 1, -1, -1];
const W = [4 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 36, 1 / 36, 1 / 36, 1 / 36];
const OPP = [0, 3, 4, 1, 2, 7, 8, 5, 6], MIRROR_Z = [0, 1, 4, 3, 2, 8, 7, 6, 5];

// Side profile (closed polygon of [x, z] in mm, x forward) → solid cells. Cell (i, j) has its centre at
// x = x0 − (i + ½)·cell, z = ground + (j + ½)·cell: the tunnel runs from the front edge x0 back to x1, up to top.
export function rasterize(profile, { x0, x1, top, cell, ground = 0 }) {
  const nx = Math.round((x0 - x1) / cell), nz = Math.round(top / cell), solid = new Uint8Array(nx * nz);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const x = x0 - (i + 0.5) * cell, z = ground + (j + 0.5) * cell;
    let inside = false;
    for (let a = 0, b = profile.length - 1; a < profile.length; b = a++) {
      const [xa, za] = profile[a], [xb, zb] = profile[b];
      if ((za > z) !== (zb > z) && x < xa + (z - za) / (zb - za) * (xb - xa)) inside = !inside;
    }
    solid[j * nx + i] = inside ? 1 : 0;
  }
  return { nx, nz, solid };
}

export function createTunnel({ nx, nz, solid, U = 0.1, nu = 0.0015, smag = 0.16 }) {
  const N = nx * nz, tau0 = 3 * nu + 0.5, C = 18 * Math.SQRT2 * smag * smag, uu = 1.5 * U * U;
  let f = new Float32Array(9 * N), g = new Float32Array(9 * N);
  const ux = new Float32Array(N).fill(U), uz = new Float32Array(N), rho = new Float32Array(N).fill(1);
  const inflow = W.map((w, k) => w * (1 + 3 * CX[k] * U + 4.5 * (CX[k] * U) ** 2 - uu));
  for (let c = 0; c < N; c++) { f.set(inflow, 9 * c); if (solid[c]) ux[c] = 0; }
  const fe = new Float64Array(9), fo = new Float64Array(9);
  // Drag on the body this step (lattice force units, + = downstream): total by momentum exchange at the walls; the pressure
  // part split into push on upstream-facing faces and suction on downstream-facing ones; friction is the rest.
  const drag = { total: 0, push: 0, suction: 0, friction: 0 };

  function step() {
    let fx = 0, rf = 0, nf = 0, rr = 0, nr = 0;
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const c = j * nx + i; if (solid[c]) continue;
      const o = 9 * c;
      let r = 0, mx = 0, mz = 0;
      for (let k = 0; k < 9; k++) { const v = f[o + k]; r += v; mx += CX[k] * v; mz += CZ[k] * v; }
      const u = mx / r, w = mz / r, q = 1.5 * (u * u + w * w);
      rho[c] = r; ux[c] = u; uz[c] = w;
      let pxx = 0, pzz = 0, pxz = 0;
      for (let k = 0; k < 9; k++) {
        const cu = 3 * (CX[k] * u + CZ[k] * w), e = W[k] * r * (1 + cu + 0.5 * cu * cu - q), d = f[o + k] - e;
        fe[k] = e; fo[k] = d; pxx += CX[k] * CX[k] * d; pzz += CZ[k] * CZ[k] * d; pxz += CX[k] * CZ[k] * d;
      }
      // Smagorinsky: the local strain (from the non-equilibrium stress) raises the relaxation time where the flow shears.
      const tau = 0.5 * (tau0 + Math.sqrt(tau0 * tau0 + C * Math.sqrt(pxx * pxx + pzz * pzz + 2 * pxz * pxz) / r)), om = 1 / tau;
      for (let k = 0; k < 9; k++) {
        const v = fe[k] + (1 - om) * fo[k], ti = i + CX[k], tj = j + CZ[k];
        if (tj < 0) g[o + OPP[k]] = v - 6 * W[k] * r * CX[k] * U;                       // road moving at U
        else if (tj >= nz) { if (ti >= 0 && ti < nx) g[9 * (j * nx + ti) + MIRROR_Z[k]] = v; }   // free-slip top
        else if (ti < 0 || ti >= nx) continue;                                           // inlet / outlet, set below
        else if (solid[tj * nx + ti]) {                                                  // bounce back off the body
          g[o + OPP[k]] = v; fx += 2 * v * CX[k];
          if (k === 1) { rf += r; nf++; } else if (k === 3) { rr += r; nr++; }
        }
        else g[9 * (tj * nx + ti) + k] = v;
      }
    }
    for (let j = 0; j < nz; j++) {
      g.set(inflow, 9 * j * nx);
      g.copyWithin(9 * (j * nx + nx - 1), 9 * (j * nx + nx - 2), 9 * (j * nx + nx - 1));  // zero-gradient outlet
    }
    [f, g] = [g, f];
    // Reference pressure p∞: the oncoming air a few cells behind the inlet (drag builds a pressure drop along the tunnel, so
    // the inlet's own density is not the free stream's).
    let s = 0, n = 0; for (let j = 0; j < nz; j++) if (!solid[j * nx + 3]) { s += rho[j * nx + 3]; n++; }
    ref = s / n;
    drag.total = fx; drag.push = (rf - nf * ref) / 3; drag.suction = -(rr - nr * ref) / 3; drag.friction = fx - drag.push - drag.suction;
  }

  // Pressure coefficient (p − p∞) / ½ρU² at cell c: lattice pressure is ρ/3.
  let ref = 1;
  const cp = c => (rho[c] - ref) / 3 / (0.5 * U * U);
  // Bilinear velocity at fractional cell coordinates (cell centres at integers), for tracer particles. Solid cells read 0.
  function sample(x, z, out) {
    const i = Math.max(0, Math.min(nx - 1.001, x)), j = Math.max(0, Math.min(nz - 1.001, z)), i0 = i | 0, j0 = j | 0, a = i - i0, b = j - j0;
    const c = j0 * nx + i0, w00 = (1 - a) * (1 - b), w10 = a * (1 - b), w01 = (1 - a) * b, w11 = a * b;
    out[0] = w00 * ux[c] + w10 * ux[c + 1] + w01 * ux[c + nx] + w11 * ux[c + nx + 1];
    out[1] = w00 * uz[c] + w10 * uz[c + 1] + w01 * uz[c + nx] + w11 * uz[c + nx + 1];
    return out;
  }
  return { nx, nz, U, solid, ux, uz, rho, drag, step, cp, sample };
}
