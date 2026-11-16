// Wankel rotary engine geometry. Pure: no DOM, no three.js. Units: m, rad.
// g = { e (eccentricity), R (generating radius), b (rotor width), flank (sagitta of each rotor flank, m) }.
// The housing is the two-lobe epitrochoid; the rotor centre orbits the shaft at radius e while the rotor turns at a third
// of shaft speed, which keeps all three apexes on the housing. Chamber k lies between apex k and apex k + 1.
const TAU = 2 * Math.PI;

export const housing = (alpha, { e, R }) => [e * Math.cos(3 * alpha) + R * Math.cos(alpha), e * Math.sin(3 * alpha) + R * Math.sin(alpha)];
export const rotorCentre = (theta, { e }) => [e * Math.cos(theta), e * Math.sin(theta)];
export const apexAngle = (theta, k) => theta / 3 + k * TAU / 3;   // the housing parameter where apex k sits
export const apexes = (theta, g) => [0, 1, 2].map(k => housing(apexAngle(theta, k), g));
export const displacement = ({ e, R, b }) => 3 * Math.sqrt(3) * e * R * b;   // per chamber: V_max − V_min

// Rotor flank from apex k + 1 back to apex k: a circular arc bulging out towards the housing by g.flank.
export function flank(theta, k, g, n = 16) {
  const [p0, p1] = [apexes(theta, g)[k], apexes(theta, g)[(k + 1) % 3]], c = rotorCentre(theta, g);
  const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2, half = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 2;
  let nx = mx - c[0], ny = my - c[1]; const nl = Math.hypot(nx, ny); nx /= nl; ny /= nl;
  const s = g.flank, rho = (half * half + s * s) / (2 * s), ox = mx - nx * (rho - s), oy = my - ny * (rho - s);
  const a1 = Math.atan2(p1[1] - oy, p1[0] - ox), a0 = Math.atan2(p0[1] - oy, p0[0] - ox);
  let span = a0 - a1; span = Math.atan2(Math.sin(span), Math.cos(span));
  return Array.from({ length: n + 1 }, (_, i) => { const a = a1 + span * i / n; return [ox + rho * Math.cos(a), oy + rho * Math.sin(a)]; });
}

// Chamber k outline: housing from apex k to apex k + 1, then the flank back. n housing samples.
export function chamberOutline(theta, k, g, n = 40) {
  const a0 = apexAngle(theta, k), pts = Array.from({ length: n + 1 }, (_, i) => housing(a0 + TAU / 3 * i / n, g));
  return pts.concat(flank(theta, k, g).slice(1, -1));
}

const area = pts => Math.abs(pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
export const chamberVolume = (theta, k, g) => area(chamberOutline(theta, k, g)) * g.b;

// Stroke of chamber k from where its middle sits on the housing (housing parameter φ, + = direction of rotation).
// Ports on the +y side, spark plugs at the −y waist: from the +y waist (overlap TDC) to the −x lobe = intake, then
// compression up to the −y waist (firing TDC), power to the +x lobe, exhaust back to the +y waist. Each takes 270° of
// shaft rotation. Returns { stroke, f } with f = 0..1 progress through that stroke.
export const STROKES = ["Intake", "Compression", "Power", "Exhaust"];
export function strokeOf(theta, k) {
  const q = (((apexAngle(theta, k) + Math.PI / 3 - Math.PI / 2) / (Math.PI / 2)) % 4 + 4) % 4;
  return { stroke: STROKES[Math.floor(q)], f: q % 1 };
}

export function compressionRatio(g, samples = 720) {
  let lo = Infinity, hi = 0;
  for (let i = 0; i < samples; i++) { const v = chamberVolume(i / samples * 3 * TAU, 0, g); lo = Math.min(lo, v); hi = Math.max(hi, v); }
  return { ratio: hi / lo, vmin: lo, vmax: hi };
}
