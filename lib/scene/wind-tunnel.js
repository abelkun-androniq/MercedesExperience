// CFD-style view of a 2-D wind tunnel (lib/model/flow.js) on the car's centre plane (y = 0): a colour field (speed,
// pressure or swirl), the body section, and smoke filaments released from a rake ahead of the car (streaklines: they
// follow the streamlines where the flow is steady and roll up into eddies in the wake).
// F (mm): { x0, x1, top, cell, show: [x rear, z top] (part drawn), rake: [z0, z1, n], profile: [[x, z], …] }; ground: road z (mm).
// update(dt, k) runs the tunnel at k = car speed / reference speed: the pattern is the same at every road speed, time runs
// k times faster, speeds scale with k and pressures with k², so the colours show drag growing with the square of speed.
// share() gives the slice's drag split (push on the front, suction at the back, friction), averaged over the last seconds.
import * as THREE from "three";
import { rasterize, createTunnel } from "../model/flow.js";

const SEQ = ["--cfd-1", "--cfd-2", "--cfd-3", "--cfd-4", "--cfd-5"], NEG = "--cfd-2", POS = "--cfd-5";
const MAX_STEPS = 5, BUDGET_MS = 6, GAP = 15, WIDTH = 0.022;

export function createWindTunnel(stage, group, F, ground = 0) {
  const m = v => v / 1000, grid = rasterize(F.profile, { ...F, ground }), tun = createTunnel(grid), { nx, nz, U } = tun;
  const cell = m(F.cell), X = i => m(F.x0) - (i + 0.5) * cell, Z = j => m(ground) + (j + 0.5) * cell;

  // ---------- colour field ----------
  const data = new Uint8Array(nx * nz * 4), tex = new THREE.DataTexture(data, nx, nz);
  tex.magFilter = tex.minFilter = THREE.LinearFilter; tex.colorSpace = THREE.SRGBColorSpace;
  const [xr, zt] = F.show, span = F.x0 - F.x1;
  tex.offset.set((xr - F.x1) / span, 0); tex.repeat.set((F.x0 - xr) / span, zt / F.top);
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(m(F.x0 - xr), m(zt)).rotateX(Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
  plane.position.set(m(F.x0 + xr) / 2, 0, m(ground + zt / 2)); plane.renderOrder = 4;
  const shape = new THREE.Shape(F.profile.map(([x, z]) => new THREE.Vector2(m(x), m(z))));
  const bodyMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide });
  stage.bind(bodyMat.color, "--edge");
  const body = new THREE.Mesh(new THREE.ShapeGeometry(shape).rotateX(Math.PI / 2), bodyMat); body.renderOrder = 5;
  group.add(plane, body);

  let lut = {};
  const rgb = token => { const h = stage.color(token).getHex(); return [h >> 16, (h >> 8) & 255, h & 255]; };
  function buildLut() {
    const seq = SEQ.map(rgb), n = seq.length - 1;
    lut = { seq: Array.from({ length: 64 }, (_, q) => { const s = q / 63 * n, a = Math.min(n - 1, s | 0), f = s - a; return seq[a].map((v, c) => v + (seq[a + 1][c] - v) * f); }),
      neg: rgb(NEG), pos: rgb(POS) };
  }
  buildLut(); stage.onTheme(buildLut);

  let mode = "speed";
  function paint(k) {
    const { ux, uz, solid } = tun;
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const c = j * nx + i, o = 4 * (j * nx + nx - 1 - i);   // texture columns run rear → front
      if (solid[c]) { data[o + 3] = 0; continue; }
      let col, a;
      if (mode === "speed") {
        const t = Math.min(1, Math.hypot(ux[c], uz[c]) / U * k / 1.4); col = lut.seq[(t * 63) | 0]; a = 215;
      } else {
        let t;
        if (mode === "pressure") t = tun.cp(c) * k * k;
        else {   // swirl: vorticity, read across neighbouring cells (i runs downstream, so x = −i)
          const il = Math.max(i - 1, 0), ir = Math.min(i + 1, nx - 1), jd = Math.max(j - 1, 0), ju = Math.min(j + 1, nz - 1);
          t = ((ux[ju * nx + i] - ux[jd * nx + i]) / (ju - jd) - (uz[j * nx + ir] - uz[j * nx + il]) / (ir - il)) / U * 2.5 * k;
        }
        t = Math.max(-1, Math.min(1, t)); col = t > 0 ? lut.pos : lut.neg; a = 235 * Math.min(1, 1.3 * Math.abs(t));
      }
      data[o] = col[0]; data[o + 1] = col[1]; data[o + 2] = col[2]; data[o + 3] = a;
    }
    tex.needsUpdate = true;
  }

  // ---------- smoke: filaments of particles in lattice coordinates, newest at `head` ----------
  const [r0, r1, nf] = F.rake, M = Math.ceil(nx / (U * GAP)) + 2;
  const seedJ = Array.from({ length: nf }, (_, f) => (r0 + (r1 - r0) * f / (nf - 1)) / F.cell - 0.5);
  const pi = new Float32Array(nf * M), pj = new Float32Array(nf * M), born = new Int32Array(M);
  let head = 0, emitted = 0, since = 0;
  for (let s = 0; s < M; s++) {                    // start as a uniform stream: straight filaments, oldest furthest back
    const age = (head - s + M) % M; born[s] = -age;
    for (let f = 0; f < nf; f++) { pi[f * M + s] = 1.5 + age * U * GAP; pj[f * M + s] = seedJ[f]; }
  }
  const pos = new Float32Array(nf * M * 6), colr = new Float32Array(nf * M * 8), idx = [];
  for (let f = 0; f < nf; f++) for (let a = 0; a < M - 1; a++) { const v = 2 * (f * M + a); idx.push(v, v + 1, v + 2, v + 1, v + 3, v + 2); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(colr, 4)); geo.setIndex(idx);
  const smoke = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide }));
  smoke.renderOrder = 6; smoke.frustumCulled = false; group.add(smoke);
  const ink = new THREE.Color(); let onPhoto = false;
  const setInk = () => ink.copy(onPhoto ? new THREE.Color(0xffffff) : stage.color("--fg"));
  setInk(); stage.onTheme(setInk);

  const v1 = [0, 0], v2 = [0, 0];
  function advect(dt) {
    for (let q = 0; q < nf * M; q++) {
      const x = pi[q], z = pj[q]; if (x > nx - 1.5) continue;
      tun.sample(x, z, v1); tun.sample(x + v1[0] * dt / 2, z + v1[1] * dt / 2, v2);
      pi[q] = x + v2[0] * dt; pj[q] = z + v2[1] * dt;
    }
  }
  function drawSmoke() {
    for (let f = 0; f < nf; f++) for (let a = 0; a < M; a++) {
      const s = (head - a + M) % M, q = f * M + s, v = f * M + a;
      const sp = (head - Math.max(a - 1, 0) + M) % M, sn = (head - Math.min(a + 1, M - 1) + M) % M;
      let tx = pi[f * M + sp] - pi[f * M + sn], tz = pj[f * M + sp] - pj[f * M + sn];
      const len = Math.hypot(tx, tz) || 1; tx /= len; tz /= len;
      const x = X(pi[q]), z = Z(pj[q]), nxm = tz * WIDTH / 2, nzm = tx * WIDTH / 2;   // in-plane normal of (−tx, tz), as x = −i
      pos.set([x - nxm, 0, z - nzm, x + nxm, 0, z + nzm], 6 * v);
      const gap = a > 0 ? Math.hypot(pi[q] - pi[f * M + sp], pj[q] - pj[f * M + sp]) : 0;
      const live = pi[q] < nx - 1.5 && gap < 6 && X(pi[q]) > m(xr);
      const band = ((born[s] >> 2) & 1) ? 1 : 0.5, fade = Math.min(1, (M - a) / (0.3 * M));
      const al = live ? 0.85 * band * fade : 0;
      colr.set([ink.r, ink.g, ink.b, al, ink.r, ink.g, ink.b, al], 8 * v);
    }
    geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
  }

  // ---------- frame ----------
  let owed = 0, cap = MAX_STEPS, slow = 0;
  const avg = { push: 0, suction: 0, friction: 0 };
  return {
    setMode(x) { mode = x; },
    share() { const s = avg.push + avg.suction + avg.friction; return s > 0 ? { push: avg.push / s, suction: avg.suction / s, friction: avg.friction / s } : null; },
    layout(photo) { onPhoto = photo; setInk(); plane.visible = body.visible = !photo; },
    // Returns the distance (m) the air moved past the car this frame, for the road markings.
    update(k) {
      owed = Math.min(owed + cap * k, cap);
      const t0 = performance.now(); let n = 0;
      while (owed >= 1 && performance.now() - t0 < BUDGET_MS) { tun.step(); owed--; n++; }
      if (owed >= 1) { owed = 0; if (++slow > 20) { slow = 0; cap = Math.max(2, cap - 1); } }   // device too slow: slower motion
      for (since += n; since >= GAP; since -= GAP) {
        head = (head + 1) % M; born[head] = ++emitted;
        for (let f = 0; f < nf; f++) { pi[f * M + head] = 1.5; pj[f * M + head] = seedJ[f]; }
      }
      if (n) { advect(n); for (const key in avg) avg[key] += (tun.drag[key] - avg[key]) * Math.min(1, n / 1500); }
      drawSmoke(); if (!onPhoto) paint(k);
      return n * U * cell;
    },
  };
}
