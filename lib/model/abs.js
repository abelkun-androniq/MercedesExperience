// Braking one wheel, with and without an anti-lock system (ABS). Pure: no DOM, no three.js. SI units.
// Tyre grip follows the slip between tyre and road (Burckhardt's curve): it peaks at 10–20 % slip and falls off towards a
// locked, sliding wheel, which also has no grip left for steering. ABS watches the slip and lets the brake off before the
// wheel locks, then on again, several times a second, keeping the tyre near its peak.
const G = 9.81;

// Burckhardt slip curves: μ(s) = c1·(1 − e^(−c2·s)) − c3·s.
export const SURFACES = { dry: [1.28, 23.99, 0.52], wet: [0.857, 33.82, 0.347], snow: [0.1946, 94.13, 0.0646] };
export const mu = (surface, s) => { const [c1, c2, c3] = SURFACES[surface]; return Math.max(0, c1 * (1 - Math.exp(-c2 * s)) - c3 * s); };
export const peak = surface => { let best = 0; for (let s = 0; s <= 1; s += 0.001) best = Math.max(best, mu(surface, s)); return best; };

// One corner: p = { mass (kg on this wheel), inertia (kg·m² of wheel and brake), wheelR (m), torque (N·m, full brake),
//   rise (share of full pressure per s), abs: { on, release (slip), apply (slip) } }. v0 in m/s.
// step(dt) advances the stop; the state carries speeds, slip, brake pressure (0…1), distance and whether it is done.
export function createStop(p, surface, v0) {
  const R = p.wheelR, N = p.mass * G;
  const s = { v: v0, w: v0 / R, slip: 0, pressure: 0, dist: 0, t: 0, done: false, holding: false };
  s.step = dt => {
    if (s.done) return s;
    const absOn = p.abs?.on;
    // The controller: on ABS, hold the pressure off once slip passes `release`, build it again below `apply`.
    if (absOn && s.slip > p.abs.release) s.holding = true;
    else if (absOn && s.slip < p.abs.apply) s.holding = false;
    s.pressure = Math.max(0, Math.min(1, s.pressure + (s.holding ? -2 * p.rise : p.rise) * dt));
    s.slip = s.v > 0.1 ? Math.max(0, Math.min(1, (s.v - s.w * R) / s.v)) : 0;
    const Fx = mu(surface, s.slip) * N;
    const Tb = p.torque * s.pressure;
    s.v = Math.max(0, s.v - (Fx / p.mass) * dt);
    // The brake can hold a wheel still but never turn it backwards.
    const dw = (Fx * R - Tb) / p.inertia * dt;
    s.w = Math.max(0, s.w + dw);
    s.dist += s.v * dt; s.t += dt;
    if (s.v < 0.3) { s.done = true; s.v = 0; s.w = 0; s.slip = 0; }
    return s;
  };
  // A rolling tyre can still take side force, so the car steers; a sliding one goes where it is already going.
  s.steers = () => s.slip < 0.3;
  return s;
}

// Whole stop at a fine step: distance (m), time (s), and how long the wheel was locked (s).
export function simulateStop(p, surface, v0, dt = 1e-4) {
  const s = createStop(p, surface, v0);
  let locked = 0;
  while (!s.done && s.t < 30) { s.step(dt); if (s.slip > 0.95) locked += dt; }
  return { dist: s.dist, time: s.t, locked };
}
