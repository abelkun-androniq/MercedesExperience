// Road load and top speed. Pure: no DOM, no three.js. SI units: m, s, kg, N, W.
// car = { cd, area (m²), mass (kg), crr (rolling resistance coefficient), eta (driveline efficiency), grip? (max drive force, N) }.
const RHO = 1.2, G = 9.81;

export const drag = (c, v) => 0.5 * RHO * c.cd * c.area * v * v;
export const rolling = c => c.crr * c.mass * G;

// Engine power needed to hold speed v: aerodynamic drag grows with v³, rolling resistance only with v.
export const powerNeeded = (c, v) => (drag(c, v) + rolling(c)) * v / (c.eta ?? 0.88);

// Top speed with engine power P (W): where power needed meets power available. Bisection; powerNeeded is increasing.
export function topSpeed(c, P) {
  let lo = 0, hi = 200;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (powerNeeded(c, m) < P) lo = m; else hi = m; }
  return lo;
}

// One time step of a full-power run: drive force P·η / v, capped by tyre grip at low speed.
export function accelerate(c, P, v, dt) {
  const grip = c.grip ?? 0.5 * c.mass * G;
  const drive = Math.min(grip, P * (c.eta ?? 0.88) / Math.max(v, 0.5));
  return Math.max(0, v + (drive - drag(c, v) - rolling(c)) / c.mass * dt);
}
