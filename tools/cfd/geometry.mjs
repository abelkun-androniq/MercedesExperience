// The Evo II as solid cells for the 3-D tunnel (tools/cfd/lbm3d.mjs), half car (y ≥ 0; the plane y = 0 is a mirror).
// The game mesh (tools/cfd/mesh.mjs) has no floor and an open interior, so the body is built column by column from above:
// each (x, y) column under the body is solid from the car's lower edge at that x (sills, bumpers, lip) up to its top
// surface. The rear wing is filled separately, so the gap between wing and boot stays open; the wheels are cylinders
// standing one cell clear of the road and not turning (a spinning tyre on these stepped cells pumps air unphysically).
// Cells: x = x0 − (i + ½)h, y = (j + ½)h, z = (k + ½)h (mm); solid codes 0 air, 1 body, 2 front wheel, 3 rear wheel.
// Cases change one part each (illustrative sizes): "flap" raises an upper flap on the wing's trailing edge, "lip" moves the
// front lip forward, "arch" trims the front wheel-arch flare back to a reference contour that still clears the tyre.
export const CASES = {
  base: "Baseline",
  flap: "Upper wing flap raised: 100 mm, 30° up from the wing's trailing edge",
  lip: "Front lip moved 40 mm forward",
  arch: "Front arches without the flare: body trimmed to 15 mm outside the tyre",
};
export const WHEEL = { r: 333, halfWidth: 135, y: 675, x: [0, -2678] };   // from the mesh's wheels (mm)
const LOW = 250;   // below this height the front of the body is the lip (mm)

export function voxelize({ parts }, { h, x0, nx, ny, nz }, mode = "base") {
  const N = nx * ny * nz, solid = new Uint8Array(N), at = (i, j, k) => (k * ny + j) * nx + i;
  const top = new Float32Array(nx * ny).fill(-Infinity), low = new Float32Array(nx * ny).fill(Infinity);
  const wTop = new Float32Array(nx * ny).fill(-Infinity), wLow = new Float32Array(nx * ny).fill(Infinity);
  for (const p of parts) {
    if (/Wheel/.test(p.name)) continue;
    const t = p.tris;
    for (let a = 0; a < t.length; a += 9) {
      const xs = [t[a], t[a + 3], t[a + 6]], ys = [t[a + 1], t[a + 4], t[a + 7]], zs = [t[a + 2], t[a + 5], t[a + 8]];
      const wing = Math.max(...xs) < -3300 && Math.min(...zs) > 1000;
      // Column centres inside the triangle's plan view (a vertical triangle covers none: its edges still count via
      // the per-vertex update below, enough for side walls one cell thick).
      const i0 = Math.max(0, Math.floor((x0 - Math.max(...xs)) / h - 0.5)), i1 = Math.min(nx - 1, Math.ceil((x0 - Math.min(...xs)) / h - 0.5));
      const j0 = Math.max(0, Math.floor(Math.min(...ys) / h - 0.5)), j1 = Math.min(ny - 1, Math.ceil(Math.max(...ys) / h - 0.5));
      const d = (xs[1] - xs[0]) * (ys[2] - ys[0]) - (xs[2] - xs[0]) * (ys[1] - ys[0]);
      const put = (c, z) => { if (wing) { wTop[c] = Math.max(wTop[c], z); wLow[c] = Math.min(wLow[c], z); } else { top[c] = Math.max(top[c], z); low[c] = Math.min(low[c], z); } };
      for (let v = 0; v < 3; v++) {
        const i = Math.round((x0 - xs[v]) / h - 0.5), j = Math.round(ys[v] / h - 0.5);
        if (i >= 0 && i < nx && j >= 0 && j < ny) put(j * nx + i, zs[v]);
      }
      if (Math.abs(d) < 1e-9) continue;
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const x = x0 - (i + 0.5) * h, y = (j + 0.5) * h;
        const b1 = ((x - xs[0]) * (ys[2] - ys[0]) - (xs[2] - xs[0]) * (y - ys[0])) / d, b2 = ((xs[1] - xs[0]) * (y - ys[0]) - (x - xs[0]) * (ys[1] - ys[0])) / d;
        if (b1 < 0 || b2 < 0 || b1 + b2 > 1) continue;
        put(j * nx + i, zs[0] + b1 * (zs[1] - zs[0]) + b2 * (zs[2] - zs[0]));
      }
    }
  }
  // The car's lower edge at each x: the lowest surface in any column there (sills, bumper, lip): a flat floor follows it.
  const edge = new Float32Array(nx).fill(Infinity);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) edge[i] = Math.min(edge[i], low[j * nx + i]);
  const fill = (i, j, z0, z1, code) => {
    for (let k = Math.max(0, Math.floor(z0 / h)); k < nz && k * h < z1; k++) solid[at(i, j, k)] = code;   // cells the span overlaps
  };
  const flare = mode === "arch";
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const c = j * nx + i, x = x0 - (i + 0.5) * h, y = (j + 0.5) * h;
    if (flare && Math.abs(x) < 480 && y > WHEEL.y + WHEEL.halfWidth + 15) continue;
    if (top[c] > -Infinity) fill(i, j, edge[i], top[c], 1);
    if (wTop[c] > -Infinity) fill(i, j, wLow[c], wTop[c], 1);
  }
  if (mode === "lip") {   // the lip's front edge, column by column, carried 40 mm further forward at the lip's own height
    for (let j = 0; j < ny; j++) {
      let i = 0; while (i < nx && !(top[j * nx + i] > -Infinity && low[j * nx + i] < LOW)) i++;
      if (i >= nx) continue;
      const z0 = low[j * nx + i];
      for (let x = x0 - (i + 0.5) * h + h; x <= x0 - (i + 0.5) * h + 40 + 1e-6; x += h) fill(Math.round((x0 - x) / h - 0.5), j, z0, z0 + 25, 1);
    }
  }
  if (mode === "flap") {   // a plate rising from the wing's trailing edge, across the wing's span
    for (let j = 0; j < ny; j++) {
      let i = nx - 1; while (i >= 0 && !(wTop[j * nx + i] > -Infinity)) i--;
      if (i < 0) continue;
      const xe = x0 - (i + 0.5) * h, ze = wTop[j * nx + i], a = 30 * Math.PI / 180;
      for (let s = 0; s <= 100; s += h / 3) fill(Math.round((x0 - (xe - s * Math.cos(a))) / h - 0.5), j, ze + s * Math.sin(a) - 4, ze + s * Math.sin(a) + 4, 1);
    }
  }
  // Wheels: cylinders across y, one cell clear of the road.
  for (let k = 1; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const x = x0 - (i + 0.5) * h, y = (j + 0.5) * h, z = (k + 0.5) * h;
    if (Math.abs(y - WHEEL.y) > WHEEL.halfWidth) continue;
    WHEEL.x.forEach((wx, w) => { if ((x - wx) ** 2 + (z - WHEEL.r) ** 2 < WHEEL.r ** 2) solid[at(i, j, k)] = 2 + w; });
  }
  return { solid, edge };
}
