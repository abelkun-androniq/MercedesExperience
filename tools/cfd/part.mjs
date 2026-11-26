// Component airflow for the Evo II and W 196 R stops: node tools/cfd/part.mjs <part> <command> [case] [cell mm]
//   wing reference   the whole-car runs (tools/cfd/out/{base,flap}-{28,40}): probe above the wing's trailing edge on both
//                    grids, and the 28 mm side crop, into out/wing/ (needs run.mjs's raw volumes)
//   splitter solve   2-D section of the nose (lib/model/flow.js) with the lip in or forward, 5 and 2.5 mm, + a 5 mm run in
//                    a larger tunnel; one case and grid with [case] [cell mm] (case "in-big" for the larger tunnel)
//   w196-wheel solve 3-D front corner (tools/cfd/corner.mjs), enclosed and exposed, 24 and 16 mm
//   evo-arch solve   3-D front corner of the Evo with its flared arch, 24 and 16 mm
//   <part> export    checks the complete set of runs, then writes stops/<slug>/cfd/<part>/ (field.json, <case>.bin:
//                    lib/model/part-field.js) and the run record tools/cfd/results/<part>.json (checked in)
// Raw outputs stay in tools/cfd/out/<part>/ (git-ignored). Each solve settles for a few flow-throughs, then averages three
// successive windows; a result is published where its sign repeats on both grids and its size clears the windows' scatter.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { cpus } from "node:os";
import { load, volume, probe, trace, OUT } from "./volume.mjs";
import { encode, centre, problems } from "../../lib/model/part-field.js";
import { rasterize, createTunnel } from "../../lib/model/flow.js";

const [part, cmd, only, onlyH] = process.argv.slice(2);
const STOPS = new URL("../../stops/", import.meta.url), RESULTS = new URL("./results/", import.meta.url);
const dirOf = p => new URL(`./${p}${process.env.TAG ?? ""}/`, OUT);   // TAG keeps trial runs apart
const write = (url, data) => { mkdirSync(new URL("./", url), { recursive: true }); writeFileSync(url, data); };
const save = (p, name, meta, arrays, solid) => {
  write(new URL(`${name}.json`, dirOf(p)), JSON.stringify(meta, null, 1));
  write(new URL(`${name}.bin`, dirOf(p)), Buffer.concat(arrays.map(a => Buffer.from(a.buffer, a.byteOffset, a.byteLength))));
  write(new URL(`${name}.solid`, dirOf(p)), solid);
};
const SCALE = +(process.env.STEPS_SCALE ?? 1);   // < 1 only to try the pipeline quickly
const mean = a => a.reduce((s, v) => s + v, 0) / a.length, sd = a => Math.sqrt(mean(a.map(v => (v - mean(a)) ** 2)));
const r1 = v => Math.round(v * 10) / 10, r3 = v => Math.round(v * 1000) / 1000;
// Release gate (research_notes/Museum airflow claim review/statistics.md): each averaging window (one flow-through) is a
// batch; per grid the 95 % interval of the quantity (one case) or of the contrast between cases (Welch) must lie on one
// side of zero, the same side on every grid, and the shift on a larger tunnel must be smaller than the credible effect
// (the interval end nearest zero). Anything else is "unresolved".
const T975 = [NaN, 12.71, 4.30, 3.18, 2.78, 2.57, 2.45, 2.36, 2.31, 2.26, 2.23];
const t975 = df => (df >= 30 ? 1.96 : T975[Math.max(1, Math.floor(df))] ?? 2.1);
const svar = a => a.reduce((s, v) => s + (v - mean(a)) ** 2, 0) / (a.length - 1);
const span = (d, se, df) => ({ d: r3(d), lo: r3(d - (se ? t975(df) * se : 0)), hi: r3(d + (se ? t975(df) * se : 0)) });
const interval = a => span(mean(a), Math.sqrt(svar(a) / a.length), a.length - 1);
const contrast = (a, b) => {   // b − a
  const va = svar(a) / a.length, vb = svar(b) / b.length, df = (va + vb) ** 2 / (va ** 2 / (a.length - 1) + vb ** 2 / (b.length - 1));
  return span(mean(b) - mean(a), Math.sqrt(va + vb), df);
};
function gate(byGrid, domainShift) {
  const sides = Object.values(byGrid).map(g => (g.lo > 0 ? 1 : g.hi < 0 ? -1 : 0));
  const sign = sides.every(v => v === sides[0]) ? sides[0] : 0;
  const credible = sign ? Math.min(...Object.values(byGrid).map(g => (sign > 0 ? g.lo : -g.hi))) : 0;
  const domain = domainShift == null ? null : r3(Math.abs(domainShift));
  return { sign, credible: r3(credible), domain, released: sign !== 0 && domain != null && domain < credible };
}

// ---------------------------------------------------------------- wing (whole-car crop)
const WING = {
  box: { x: [-3920, -3750], y: [200, 300], z: [1230, 1290] },
  crop: { x: [-4300, -3150], z: [810, 1420], y: 238 },
  seeds: [1000, 1080, 1170, 1210, 1250, 1300, 1350, 1400],   // z (mm) at x = −3180, just inside the crop, on its plane
};
function wingReference() {
  const res = {};
  for (const h of [28, 40]) for (const c of ["base", "flap"]) {
    const r = load(`${c}-${h}`), p = probe(r, WING.box);
    res[`${c}-${h}`] = { cells: p.n, angle: r1(p.angle), rearward: r3(p.rearward), up: r3(p.up) };
  }
  const diff = h => { const a = load(`base-${h}`).solid, b = load(`flap-${h}`).solid; let n = 0; for (let c = 0; c < a.length; c++) if (a[c] !== b[c]) n++; return n; };
  const rec = { source: "whole-car runs tools/cfd/run.mjs base|flap 28|40 9000 (uniform inflow, half car, still wheels)", box: WING.box, probe: res, changedCells: { 28: diff(28), 40: diff(40) } };
  write(new URL("reference.json", dirOf("wing")), JSON.stringify(rec, null, 1));
  console.log(JSON.stringify(rec, null, 1));
}
function wingExport() {
  const ref = JSON.parse(readFileSync(new URL("reference.json", dirOf("wing")))), h = 28;
  const runs = { base: load(`base-${h}`), flap: load(`flap-${h}`) };
  // Cells whose centres lie in the crop: x0 − (i + ½)h within crop.x, (k + ½)h within crop.z.
  const r = runs.base, j = r.cell(0, WING.crop.y, 0)[1];
  const i0 = Math.ceil((r.x0 - WING.crop.x[1]) / h - 0.5), i1 = Math.floor((r.x0 - WING.crop.x[0]) / h - 0.5);
  const k0 = Math.ceil(WING.crop.z[0] / h - 0.5), k1 = Math.floor(WING.crop.z[1] / h - 0.5);
  const origin = r.centre(i0, j, k0);
  const f = { plane: "xz", originMm: origin, cellMm: h, width: i1 - i0 + 1, height: k1 - k0 + 1, quantity: "vertical-speed-over-inlet", range: [-0.25, 0.25], cases: {} };
  const bins = {};
  // Where the raised flap stands, from the flap run's own extra cells on this plane: the line through them.
  const extra = []; for (let k = k0; k <= k1; k++) for (let i = i0; i <= i1; i++) { const c = r.at(i, j, k); if (runs.flap.solid[c] && !runs.base.solid[c]) extra.push(r.centre(i, j, k)); }
  extra.sort((a, b) => b[0] - a[0]);
  const flapLine = [extra[0], extra.at(-1)].map(p => p.map(Math.round));
  const bx = mean(WING.box.x), bz = mean(WING.box.z);
  for (const [id, run] of Object.entries(runs)) {
    bins[id] = encode(f, (x, y, z) => { const c = run.at(...run.cell(x, y, z)); return run.solid[c] ? null : run.uk[c] / run.U; });
    const p = ref.probe[`${id}-${h}`], n = Math.hypot(p.rearward, p.up), L = 160;
    const box = [[WING.box.x[1], WING.crop.y, WING.box.z[0]], [WING.box.x[0], WING.crop.y, WING.box.z[0]], [WING.box.x[0], WING.crop.y, WING.box.z[1]], [WING.box.x[1], WING.crop.y, WING.box.z[1]], [WING.box.x[1], WING.crop.y, WING.box.z[0]]];
    f.cases[id] = {
      // Only paths that cross most of the crop: those circling in the separated flow over the boot read as noise at this size.
      lines: WING.seeds.map(z => trace(run, [-3180, WING.crop.y, z], { dt: 6, every: 5, plane: "y", stop: { x: [WING.crop.x[0], -3170], z: WING.crop.z } }))
        .filter(l => l.at(-1)[0] < -3180 - 0.6 * (WING.crop.x[1] - WING.crop.x[0]) && l.every((q, n) => n === 0 || q[0] <= l[n - 1][0] + 5)),
      guides: [
        // The mean direction in the box, centred on it: x runs forward, so air leaving rearward points to −x.
        { kind: "arrow", points: [[bx + L / 2 * p.rearward / n, WING.crop.y, bz - L / 2 * p.up / n], [bx - L / 2 * p.rearward / n, WING.crop.y, bz + L / 2 * p.up / n]].map(q => q.map(Math.round)) },
        { kind: "line", points: box, faint: true },
        ...(id === "base" ? [{ kind: "line", points: flapLine, faint: true }] : []),
      ],
    };
  }
  publish("wing", "190e-evo2", f, bins, { ...ref, display: `crop of the 28 mm whole-car run at y = ${WING.crop.y} mm`, field: "mean vertical velocity / inlet speed" });
}

// ---------------------------------------------------------------- splitter (2-D section)
// The nose from the stop's traced centre-plane section (stops/190e-evo2/car.js), bonnet carried flat to the outlet, and a
// lip 25 mm thick along the underside: its front edge flush with the bumper face (in) or 40 mm ahead of it (forward). The flat
// underside runs out through the outlet: the channel under it develops slowly, so the run settles for three flow-throughs
// and a change counts only if it beats each case's drift between its first and last window.
const NOSE = [[935, 260], [915, 440], [870, 560], [798, 618], [435, 674], [48, 744]];
const SPLIT = {
  cases: ["in", "forward"], grids: [5],   // display only: a second grid would not give the lip load either U: 0.1, Re: 1e4, L: 1000,
  domain: { x0: 1935, x1: -665, top: 2500 }, big: { x0: 2935, x1: -1465, top: 3500 },
  edge: { in: 935, forward: 975 }, lip: [120, 145],
  // Fixed sample points just ahead of the bumper face. With the lip in (front edge at 935) both lie in open air, so their
  // difference is not a lip load: kept as a record of the runs only; no claim rests on it (no load sign is shown).
  upper: { x: [940, 970], z: [146, 162] }, lower: { x: [940, 970], z: [100, 118] },
  crop: { x: [1335, 535], z: [0, 400] }, seeds: [[1835, 230], [1835, 70]],
};
const section = (c, x1) => [[SPLIT.edge[c], SPLIT.lip[0]], [SPLIT.edge[c], SPLIT.lip[1]], [935, SPLIT.lip[1]], ...NOSE, [x1 - 600, 744], [x1 - 600, SPLIT.lip[0]]];
function splitterSolve(c, h) {
  const big = c.endsWith("-big"), cs = big ? c.slice(0, -4) : c, D = big ? SPLIT.big : SPLIT.domain;
  const { nx, nz, solid } = rasterize(section(cs, D.x1), { ...D, cell: h }), U = SPLIT.U, nu = U * (SPLIT.L / h) / SPLIT.Re;
  const t = createTunnel({ nx, nz, solid, U, nu }), FT = Math.max(10, Math.round(nx / U * SCALE)), N = nx * nz;
  const idx = box => { const out = []; for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const x = D.x0 - (i + 0.5) * h, z = (j + 0.5) * h; if (x >= box.x[0] && x <= box.x[1] && z >= box.z[0] && z <= box.z[1] && !solid[j * nx + i]) out.push(j * nx + i); } return out; };
  const up = idx(SPLIT.upper), lo = idx(SPLIT.lower);
  console.log(`splitter ${c} h=${h}: ${nx}×${nz}, nu=${nu.toFixed(5)}, flow-through ${FT} steps, faces ${up.length}/${lo.length} cells`);
  const t0 = Date.now();
  for (let s = 0; s < 3 * FT; s++) { t.step(); if (s % 5000 === 0) console.log(c, h, "settle", s, `${((Date.now() - t0) / 1000).toFixed(0)} s`); }
  const sum = { rho: new Float64Array(N), ux: new Float64Array(N), uz: new Float64Array(N) }, windows = [];
  let n = 0;
  for (let w = 0; w < 3; w++) {
    let cu = 0, cl = 0;
    for (let s = 0; s < FT; s++) {
      t.step(); n++;
      for (let k = 0; k < N; k++) { sum.rho[k] += t.rho[k]; sum.ux[k] += t.ux[k]; sum.uz[k] += t.uz[k]; }
      cu += mean(up.map(t.cp)); cl += mean(lo.map(t.cp));
    }
    windows.push({ upper: r3(cu / FT), lower: r3(cl / FT), across: r3((cu - cl) / FT) });
    console.log(c, h, "window", w, JSON.stringify(windows.at(-1)), `${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  const f = k => Float32Array.from(sum[k], v => v / n);
  // Saved as a one-cell-wide 3-D run (y = −h/2 … h/2) so volume.mjs reads it: lattice i rearward, k up.
  save("splitter", `${c}-${h}`, { case: c, h, x0: D.x0, y0: -h / 2, nx, ny: 1, nz, U, nu, Re: SPLIT.Re, steps: n + 3 * FT, settle: 3 * FT, window: FT, windows, domain: D }, [f("rho"), f("ux"), new Float32Array(N), f("uz")], solid);
}
function splitterExport() {
  const runs = {}, rec = { model: "2-D lattice Boltzmann (lib/model/flow.js): D2Q9, Smagorinsky 0.16, moving road, free-slip top, zero-gradient outlet", U: SPLIT.U, Re: `${SPLIT.Re} on ${SPLIT.L} mm`, faces: { upper: SPLIT.upper, lower: SPLIT.lower }, runs: {} };
  const grids = process.env.GRIDS?.split(",").map(Number) ?? SPLIT.grids;   // GRIDS=5: preview before the fine runs exist
  for (const h of grids) for (const c of SPLIT.cases) runs[`${c}-${h}`] = load(`${c}-${h}`, dirOf("splitter"));
  const big = existsSync(new URL("in-big-5.json", dirOf("splitter"))) ? load("in-big-5", dirOf("splitter")) : null;
  for (const [k, r] of Object.entries(runs)) rec.runs[k] = { nx: r.nx, nz: r.nz, nu: r.nu, steps: r.steps, windows: r.windows };
  if (big) rec.runs["in-big-5"] = { nx: big.nx, nz: big.nz, domain: big.domain, windows: big.windows };
  rec.claim = "none: the picture shows how the lip divides the air; the face samples lie ahead of the retracted lip, so no lip load sign is made";
  const h = 5, f = { plane: "xz", originMm: [SPLIT.crop.x[0] - h / 2, 0, SPLIT.crop.z[0] + h / 2], cellMm: h,
    width: Math.round((SPLIT.crop.x[0] - SPLIT.crop.x[1]) / h), height: Math.round((SPLIT.crop.z[1] - SPLIT.crop.z[0]) / h), quantity: "speed-over-inlet", range: [0, 1.4], cases: {} };
  // Speed, not pressure: in this 2-D section the body runs out through the outlet and blocks a quarter of the tunnel, so the
  // whole domain's pressure level floats (the inlet itself carries a gradient of about one dynamic pressure) and absolute cp
  // would mislead. The face comparison above uses the pressure difference across the lip, which needs no reference.
  const inCrop = l => l.filter(q => q[0] <= SPLIT.crop.x[0]);
  const bins = {};
  for (const c of SPLIT.cases) {
    const run = runs[`${c}-${h}`];
    bins[c] = encode(f, (x, y, z) => { const q = run.at(...run.cell(x, 0, z)); return run.solid[q] ? null : Math.hypot(run.ui[q], run.uk[q]) / run.U; });
    f.cases[c] = {
      lines: SPLIT.seeds.map(([x, z]) => inCrop(trace(run, [x, 0, z], { dt: 4, every: 6, plane: "y", stop: { x: [SPLIT.crop.x[1], 1e9], z: [0, SPLIT.crop.z[1]] } }))),
      guides: [{ kind: "line", points: [[935, 0, 30], [935, 0, 108]] }],   // the tick under the original front edge
    };
  }
  publish("splitter", "190e-evo2", f, bins, rec);
}

// ---------------------------------------------------------------- front corners (3-D)
const CORNER = {
  "w196-wheel": { slug: "w196r", folder: "wheel", cases: ["enclosed", "exposed"], plane: 344, station: -700, shoulder: 740, below: 0.8,
    seeds: [500, 600, 700, 800, 900, 1000, 1100, 1250].map(y => [2200, y, 344]), crop: { x: [1700, -1500], y: [0, 1500] },
    // Fixed patches of the station plane (mm). wake: straight behind the tyre (590–740), fluid only with the wheel exposed:
    // the streamliner's body (820 mm half-width) fills it. beside: outside both bodies, common to both cases.
    wake: { y: [560, 820], z: [100, 700] }, beside: { y: [880, 1400], z: [100, 700] } },
  "evo-arch": { slug: "190e-evo2", folder: "wheel-arch", cases: ["fitted"], plane: 344, station: -600, seeds: [700, 740, 780, 820, 860, 920, 1000, 1100].map(y => [1500, y, 344]),
    crop: { x: [1300, -1300], y: [0, 1400] }, follow: 780 },
  grids: [24, 16], U: 0.08, Re: 1e4, D: 680, windows: 5,
};
const BIG = { "w196-wheel": { x0: 3000, x1: -2600, Y: 2600, Z: 2000 }, "evo-arch": { x0: 2367, x1: -2600, Y: 2600, Z: 2200 } };
async function cornerSolve(p, c, h) {
  const { w196, evo } = await import("./corner.mjs");
  const big = c.endsWith("-big"), cs = big ? c.slice(0, -4) : c, D = big ? BIG[p] : undefined;   // a larger tunnel, once
  const L = p === "w196-wheel" ? w196(cs, h, D) : evo((await import("./mesh.mjs")).loadEvo2(), h, D);
  const { createTunnel3d } = await import("./lbm3d.mjs");
  const U = CORNER.U, nu = U * (CORNER.D / h) / CORNER.Re, N = L.nx * L.ny * L.nz, FT = Math.max(500, Math.round(L.nx / U * SCALE / 500) * 500);
  const threads = Math.max(2, Math.min(10, +(process.env.THREADS ?? cpus().length)));
  const tunnel = createTunnel3d(L, { U, nu, threads }), t0 = Date.now(), chunk = 500;
  console.log(`${p} ${c} h=${h}: ${L.nx}×${L.ny}×${L.nz} = ${(N / 1e6).toFixed(2)}M cells, nu=${nu.toFixed(5)}, flow-through ${FT} steps, ${threads} threads`);
  const settle = 2 * FT, win = FT;
  for (let s = 0; s < settle; s += chunk) { await tunnel.run(chunk, false); console.log(p, c, h, "settle", s + chunk, `${((Date.now() - t0) / 1000).toFixed(0)} s`); }
  const windows = [], snap = () => { const f = tunnel.fields(); return [f.rho, f.ui, f.uj, f.uk]; };
  let prev = null;
  for (let w = 0; w < CORNER.windows; w++) {
    for (let s = 0; s < win; s += chunk) await tunnel.run(chunk, true);
    const cum = snap(), wm = cum.map((a, q) => (prev ? a.map((v, k) => v * (w + 1) - prev[q][k] * w) : a));
    windows.push(observe(p, volume({ ...L, U, rho: wm[0], ui: wm[1], uj: wm[2], uk: wm[3], solid: L.solid })));
    prev = cum;
    console.log(p, c, h, "window", w, JSON.stringify(windows.at(-1)), `${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  save(p, `${c}-${h}`, { case: c, h, x0: L.x0, nx: L.nx, ny: L.ny, nz: L.nz, U, nu, Re: CORNER.Re, steps: settle + CORNER.windows * win, settle, window: win, windows }, prev, L.solid);
  await tunnel.close();
}
// The observable each corner lesson rests on, from one mean field.
function observe(p, r) {
  const P = CORNER[p];
  if (p === "w196-wheel") {
    // Mean axial deficit 1 − (rearward speed)/U over each fixed patch, sampled every 10 mm; null unless all of it is air.
    const deficit = box => { let s = 0, n = 0, all = 0; for (let y = box.y[0]; y <= box.y[1]; y += 10) for (let z = box.z[0]; z <= box.z[1]; z += 10) { all++; const v = r.vel(P.station, y, z); if (v) { s += 1 + v[0]; n++; } } return n === all ? r3(s / n) : null; };
    // For the picture only: the slow band on the station line nearest the tyre's outer shoulder.
    const ys = [], sp = [];
    for (let y = 2; y < 1700; y += 4) { const v = r.vel(P.station, y, P.plane); if (v) { ys.push(y); sp.push(Math.hypot(...v)); } }
    const bands = []; let start = null, last = null;
    ys.forEach((y, n) => {
      if (sp[n] >= P.below) return;
      if (start == null || y !== last + 4) { if (start != null) bands.push([start, last]); start = y; }
      last = y;
    });
    if (start != null) bands.push([start, last]);
    const dist = b => (P.shoulder < b[0] ? b[0] - P.shoulder : P.shoulder > b[1] ? P.shoulder - b[1] : 0);
    const b = bands.sort((u, v) => dist(u) - dist(v))[0] ?? [NaN, NaN];
    return { wake: deficit(P.wake), beside: deficit(P.beside), inner: b[0], outer: b[1], width: b[1] - b[0] };
  }
  const l = trace(r, [1500, P.follow, P.plane], { dt: 8, every: 1, plane: "z", stop: { x: [P.station, 1e9] } }), end = l.at(-1);
  return { y: end[0] <= P.station + 20 ? end[1] : NaN, shift: end[0] <= P.station + 20 ? end[1] - P.follow : NaN };
}
function cornerExport(p) {
  // GRIDS=24 previews the coarse grid alone, before the fine runs exist (no two-grid check then).
  const P = CORNER[p], runs = {}, grids = process.env.GRIDS?.split(",").map(Number) ?? CORNER.grids;
  for (const h of grids) for (const c of P.cases) runs[`${c}-${h}`] = load(`${c}-${h}`, dirOf(p));
  const rec = { model: "3-D lattice Boltzmann (tools/cfd/lbm3d.mjs): D3Q19, Smagorinsky 0.16, half car mirrored at y = 0, moving road, still tyres cut 48 mm above it, free-slip top and side, uniform inflow, zero-gradient outlet", geometry: "tools/cfd/corner.mjs", U: CORNER.U, Re: `${CORNER.Re} on the ${CORNER.D} mm tyre diameter`, plane: P.plane, station: P.station, runs: {} };
  for (const [k, r] of Object.entries(runs)) rec.runs[k] = { nx: r.nx, ny: r.ny, nz: r.nz, nu: r.nu, steps: r.steps, settle: r.settle, window: r.window, windows: r.windows };
  for (const c of P.cases) if (existsSync(new URL(`${c}-big-24.json`, dirOf(p)))) runs[`${c}-big-24`] = load(`${c}-big-24`, dirOf(p));
  for (const [k, r] of Object.entries(runs)) if (k.includes("big")) rec.runs[k] = { nx: r.nx, ny: r.ny, nz: r.nz, domain: "larger tunnel (BIG)", windows: r.windows };
  const ws = (k, m) => runs[k]?.windows.map(w => w[m]);
  if (grids.length < 2) rec.preview = `one grid only (${grids})`;
  if (p === "w196-wheel") {
    // wake: the exposed tyre's own wake (one case); beside: exposed − enclosed in the air outside both bodies.
    const wake = h => interval(ws(`exposed-${h}`, "wake")), beside = h => contrast(ws(`enclosed-${h}`, "beside"), ws(`exposed-${h}`, "beside"));
    const has = k => !!runs[k], bigWake = has("exposed-big-24") ? mean(ws("exposed-big-24", "wake")) - mean(ws("exposed-24", "wake")) : null;
    const bigBeside = has("exposed-big-24") && has("enclosed-big-24") ? contrast(ws("enclosed-big-24", "beside"), ws("exposed-big-24", "beside")).d - beside(24).d : null;
    rec.wake = { quantity: "mean axial deficit behind the exposed tyre", patch: P.wake, byGrid: Object.fromEntries(grids.map(h => [h, wake(h)])) };
    rec.wake.gate = gate(rec.wake.byGrid, bigWake);
    rec.beside = { quantity: "axial deficit outside both bodies, exposed − enclosed", patch: P.beside, byGrid: Object.fromEntries(grids.map(h => [h, beside(h)])) };
    rec.beside.gate = gate(rec.beside.byGrid, bigBeside);
    rec.settled = { wake: rec.wake.gate.released, beside: rec.beside.gate.released };
  } else rec.repeat = Object.fromEntries(grids.map(h => [h, interval(ws(`${P.cases[0]}-${h}`, "shift"))]));
  const h = grids.at(-1);
  const f = { plane: "xy", originMm: [P.crop.x[0] - h / 2, P.crop.y[0] + h / 2, P.plane], cellMm: h, width: Math.round((P.crop.x[0] - P.crop.x[1]) / h),
    height: Math.round((P.crop.y[1] - P.crop.y[0]) / h), quantity: "speed-over-inlet", range: [0, 1.4], cases: {} };
  const bins = {};
  for (const c of P.cases) {
    const run = runs[`${c}-${h}`], o = observe(p, run);
    bins[c] = encode(f, (x, y, z) => { const v = run.vel(x, y, z); if (v) return Math.hypot(...v); const q = run.at(...run.cell(x, y, z)); return run.solid[q] ? null : Math.hypot(run.ui[q], run.uj[q], run.uk[q]) / run.U; });
    // Seeded upstream of the crop so the paths arrive already bent by the nose; drawn from where they enter the field.
    const inCrop = l => l.filter(q => q[0] <= P.crop.x[0]);
    const lines = P.seeds.map(s => inCrop(trace(run, s, { dt: 8, every: 6, plane: "z", stop: { x: [P.crop.x[1], 1e9] } }))).filter(l => l.length > 4);
    const guides = [];
    if (p === "w196-wheel") {
      guides.push({ kind: "line", points: [[P.station, 0, P.plane], [P.station, 1450, P.plane]], faint: true });   // the station: the same in every case
      // The slow band behind the bare tyre; with the wheel enclosed the band is only the cells next to the skin, so not marked.
      if (c === "exposed") guides.push({ kind: "line", points: [[P.station, Math.round(o.inner), P.plane], [P.station, Math.round(o.outer), P.plane]], below: P.below });
      rec[`display-${c}`] = o;
    } else {
      const follow = inCrop(trace(run, [1500, P.follow, P.plane], { dt: 8, every: 6, plane: "z", stop: { x: [P.crop.x[1], 1e9] } }));
      lines.unshift(follow);
      guides.push({ kind: "line", points: [[P.station, 820, P.plane], [P.station, 1300, P.plane]], faint: true });
      rec.display = o;
    }
    f.cases[c] = { lines, guides, ...(p === "evo-arch" ? { follow: [0] } : {}) };
  }
  publish(p, P.slug, f, bins, rec, P.folder);
}

// ---------------------------------------------------------------- publishing
function publish(p, slug, f, bins, rec, folder = p) {
  const ids = Object.keys(f.cases), bad = problems(f, ids);
  for (const id of ids) if (bins[id].length !== f.width * f.height) bad.push(`${id}.bin size`);
  if (bad.length) throw new Error(`${p}: ${bad.join("; ")}`);
  const dir = new URL(`${slug}/cfd/${folder}/`, STOPS);
  write(new URL("field.json", dir), JSON.stringify(f));
  for (const id of ids) write(new URL(`${id}.bin`, dir), bins[id]);
  write(new URL(`${p}.json`, RESULTS), JSON.stringify({ part: p, generated: `node tools/cfd/part.mjs ${p} export`, ...rec }, null, 1) + "\n");
  console.log(p, "→", dir.pathname, ids.map(id => `${id}.bin ${bins[id].length} B`).join(", "), JSON.stringify(rec.settled ?? rec.repeat ?? ""));
}

const run = async () => {
  if (part === "wing" && cmd === "reference") return wingReference();
  if (part === "wing" && cmd === "export") return wingExport();
  if (part === "splitter" && cmd === "solve") {
    const jobs = only ? [[only, +onlyH]] : SPLIT.grids.flatMap(h => SPLIT.cases.map(c => [c, h]));
    for (const [c, h] of jobs) splitterSolve(c, h);
    return;
  }
  if (part === "splitter" && cmd === "export") return splitterExport();
  if (CORNER[part] && cmd === "solve") {
    const jobs = only ? [[only, +onlyH]] : CORNER.grids.flatMap(h => CORNER[part].cases.map(c => [c, h]));
    for (const [c, h] of jobs) await cornerSolve(part, c, h);
    return;
  }
  if (CORNER[part] && cmd === "export") return cornerExport(part);
  console.error("usage: node tools/cfd/part.mjs <wing reference|export | splitter|w196-wheel|evo-arch solve|export> [case] [cell mm]"); process.exit(1);
};
await run();
