// Offline 3-D wind tunnel for one stop (Node, worker threads over shared memory): lattice Boltzmann D3Q19, BGK collision
// with a Smagorinsky eddy viscosity (as lib/model/flow.js in 2-D), half car with a mirror plane at j = 0.
// Lattice: i runs rearward with the air (inlet at i = 0, zero-gradient outlet), j sideways (mirror at j = 0, free-slip
// side), k up (road at k = −½ moving with the air, free-slip top). Solid codes from tools/cfd/geometry.mjs: 1 body,
// 2/3 front/rear wheel, which spin so their contact patch moves with the road (moving-wall bounce-back).
// Forces on the half car by momentum exchange, summed per step: F (lattice i, j, k) and the moments Σ i·Fk and Σ k·Fi
// about the lattice origin, from which the caller takes drag, lift and the load on each axle.
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";

const C = [[0, 0, 0], [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1], [1, 1, 0], [-1, -1, 0], [1, -1, 0], [-1, 1, 0],
  [1, 0, 1], [-1, 0, -1], [1, 0, -1], [-1, 0, 1], [0, 1, 1], [0, -1, -1], [0, 1, -1], [0, -1, 1]];
const Q = 19, W = C.map((c, q) => (q === 0 ? 1 / 3 : c[0] ** 2 + c[1] ** 2 + c[2] ** 2 === 1 ? 1 / 18 : 1 / 36));
const find = (x, y, z) => C.findIndex(c => c[0] === x && c[1] === y && c[2] === z);
const OPP = C.map(c => find(-c[0], -c[1], -c[2])), MY = C.map(c => find(c[0], -c[1], c[2])), MZ = C.map(c => find(c[0], c[1], -c[2]));
const NF = 5;   // force slots per thread: Fi, Fj, Fk, Σ i·Fk, Σ k·Fi

// The tunnel. g: { nx, ny, nz, solid }, U (lattice speed), nu (lattice viscosity), wheels [{ i, k, R }] (lattice units, codes
// 2, 3), threads. Returns { run(steps, average) → mean forces over those steps, fields() → mean ρ, u over averaged steps }.
export function createTunnel3d({ nx, ny, nz, solid }, { U = 0.06, nu = 0.0004, smag = 0.16, wheels = [], threads = 10 } = {}) {
  const N = nx * ny * nz;
  const sh = n => new SharedArrayBuffer(n);
  const buf = { f: sh(4 * Q * N), g: sh(4 * Q * N), solid: sh(N), mean: sh(4 * 4 * N), force: sh(8 * NF * threads), bar: sh(8) };
  new Uint8Array(buf.solid).set(solid);
  const workers = Array.from({ length: threads }, (_, t) => new Worker(new URL(import.meta.url), {
    workerData: { buf, nx, ny, nz, U, nu, smag, wheels, t, threads, k0: Math.floor(t * nz / threads), k1: Math.floor((t + 1) * nz / threads) },
  }));
  let averaged = 0, fail = null;
  for (const w of workers) w.on("error", e => { fail = e; });
  const call = async msg => { await Promise.all(workers.map(w => new Promise(res => { w.once("message", res); w.postMessage(msg); }))); if (fail) throw fail; };
  return {
    async run(steps, average = false) {
      new Float64Array(buf.force).fill(0);
      await call({ steps, average });
      if (average) averaged += steps;
      const F = new Float64Array(buf.force), s = new Array(NF).fill(0);
      for (let t = 0; t < threads; t++) for (let n = 0; n < NF; n++) s[n] += F[t * NF + n] / steps;
      return { Fi: s[0], Fj: s[1], Fk: s[2], iFk: s[3], kFi: s[4] };
    },
    fields() {   // mean ρ, ui, uj, uk per cell (Float32Array views of 4N)
      const m = new Float32Array(buf.mean), n = Math.max(averaged, 1);
      return { rho: m.subarray(0, N).map(v => v / n), ui: m.subarray(N, 2 * N).map(v => v / n), uj: m.subarray(2 * N, 3 * N).map(v => v / n), uk: m.subarray(3 * N).map(v => v / n) };
    },
    close: () => Promise.all(workers.map(w => w.terminate())),
  };
}

if (!isMainThread) {
  const { buf, nx, ny, nz, U, nu, smag, wheels, t, threads, k0, k1 } = workerData;
  let f = new Float32Array(buf.f), g = new Float32Array(buf.g);
  const solid = new Uint8Array(buf.solid), mean = new Float32Array(buf.mean), force = new Float64Array(buf.force), bar = new Int32Array(buf.bar);
  const N = nx * ny * nz, plane = nx * ny, tau0 = 3 * nu + 0.5, CS = 18 * Math.SQRT2 * smag * smag, uu = 1.5 * U * U;
  const CI = C.map(c => c[0]), CJ = C.map(c => c[1]), CK = C.map(c => c[2]);
  const inflow = W.map((w, q) => w * (1 + 3 * CI[q] * U + 4.5 * (CI[q] * U) ** 2 - uu));
  for (let c = k0 * plane; c < k1 * plane; c++) for (let q = 0; q < Q; q++) f[q * N + c] = inflow[q];
  const barrier = () => {
    const gen = Atomics.load(bar, 1);
    if (Atomics.add(bar, 0, 1) === threads - 1) { Atomics.store(bar, 0, 0); Atomics.add(bar, 1, 1); Atomics.notify(bar, 1); }
    else while (Atomics.load(bar, 1) === gen) Atomics.wait(bar, 1, gen);
  };
  barrier();
  const fv = new Float64Array(Q), fe = new Float64Array(Q);
  // Velocity of a solid cell's surface: the road-going spin of a wheel (lattice i rearward, k up), 0 for the body.
  const wall = (s, i, k, out) => {
    const w = wheels[s - 2];
    if (!w) { out[0] = 0; out[1] = 0; return; }
    const om = -U / w.R;
    out[0] = om * (k - w.k); out[1] = -om * (i - w.i);
  };
  const uw = [0, 0], QN = C.map((_, q) => q * N), OFF = C.map(c => c[0] + c[1] * nx + c[2] * plane);
  // A link that meets a solid: bounce back (moving-wall correction on a wheel) and record the momentum it hands over,
  // less the share of the free-stream pressure (ρ = 1), which cancels on a closed surface but not where a tyre meets the
  // road. A link through the mirror plane stands for its twin from the unsimulated half onto this half's surface.
  let Fi = 0, Fj = 0, Fk = 0, iFk = 0, kFi = 0;
  const hit = (c, i, k, q, v, r, s, ti, tk) => {
    wall(s, ti, tk, uw);
    const back = v - 6 * W[q] * r * (CI[q] * uw[0] + CK[q] * uw[1]);
    g[QN[OPP[q]] + c] = back;
    const p = v + back - 2 * W[q], fi = CI[q] * p, fk = CK[q] * p;
    Fi += fi; Fj += CJ[q] * p; Fk += fk; iFk += (i + 0.5 * CI[q]) * fk; kFi += (k + 0.5 * CK[q]) * fi;
  };
  function step(average) {
    Fi = 0; Fj = 0; Fk = 0; iFk = 0; kFi = 0;
    for (let k = k0; k < k1; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const c = (k * ny + j) * nx + i; if (solid[c]) continue;
      let r = 0, mi = 0, mj = 0, mk = 0;
      for (let q = 0; q < Q; q++) { const v = f[q * N + c]; fv[q] = v; r += v; mi += CI[q] * v; mj += CJ[q] * v; mk += CK[q] * v; }
      const a = mi / r, b = mj / r, d = mk / r, sq = 1.5 * (a * a + b * b + d * d);
      if (average) { mean[c] += r; mean[N + c] += a; mean[2 * N + c] += b; mean[3 * N + c] += d; }
      let pii = 0, pjj = 0, pkk = 0, pij = 0, pik = 0, pjk = 0;
      for (let q = 0; q < Q; q++) {
        const cu = 3 * (CI[q] * a + CJ[q] * b + CK[q] * d), e = W[q] * r * (1 + cu + 0.5 * cu * cu - sq), n = fv[q] - e;
        fe[q] = e; fv[q] = n;
        pii += CI[q] * CI[q] * n; pjj += CJ[q] * CJ[q] * n; pkk += CK[q] * CK[q] * n; pij += CI[q] * CJ[q] * n; pik += CI[q] * CK[q] * n; pjk += CJ[q] * CK[q] * n;
      }
      const Pn = Math.sqrt(pii * pii + pjj * pjj + pkk * pkk + 2 * (pij * pij + pik * pik + pjk * pjk));
      const om = 1 / (0.5 * (tau0 + Math.sqrt(tau0 * tau0 + CS * Pn / r)));
      const inner = i > 0 && i < nx - 1 && j > 0 && j < ny - 1 && k > 0 && k < nz - 1;
      for (let q = 0; q < Q; q++) {
        const v = fe[q] + (1 - om) * fv[q];
        if (inner) {   // fast path: no tunnel walls within reach
          const tc = c + OFF[q], s = solid[tc];
          if (s) hit(c, i, k, q, v, r, s, i + CI[q], k + CK[q]); else g[QN[q] + tc] = v;
          continue;
        }
        let ti = i + CI[q], tj = j + CJ[q], tk = k + CK[q], qq = q;
        if (tk < 0) { g[OPP[q] * N + c] = v - 6 * W[q] * r * CI[q] * U; continue; }   // road moving at U
        if (tk >= nz) { tk = k; qq = MZ[qq]; }                                           // free-slip top
        if (tj < 0 || tj >= ny) { tj = j; qq = MY[qq]; }                                 // mirror plane / free-slip side
        if (ti < 0 || ti >= nx) continue;                                                // inlet, outlet: set below
        const tc = (tk * ny + tj) * nx + ti, s = solid[tc];
        if (s) hit(c, i, k, q, v, r, s, ti, tk);
        else g[QN[qq] + tc] = v;
      }
    }
    const o = t * NF; force[o] += Fi; force[o + 1] += Fj; force[o + 2] += Fk; force[o + 3] += iFk; force[o + 4] += kFi;
    barrier();
    for (let k = k0; k < k1; k++) for (let j = 0; j < ny; j++) {
      const c0 = (k * ny + j) * nx, c1 = c0 + nx - 1;
      for (let q = 0; q < Q; q++) { g[q * N + c0] = inflow[q]; g[q * N + c1] = g[q * N + c1 - 1]; }
    }
    barrier();
    [f, g] = [g, f];
  }
  parentPort.on("message", ({ steps, average }) => { for (let s = 0; s < steps; s++) step(average); parentPort.postMessage(0); });
}
