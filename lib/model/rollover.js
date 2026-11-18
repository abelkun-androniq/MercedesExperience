// A car tipping over sideways, and the safety device a sensor fires on the way. Pure: no DOM, no three.js. SI units.
// The car pivots about the contact line of its outer wheels. Its centre of gravity, halfTrack out and cgHeight up, is over
// the pivot at the tip angle atan(halfTrack / cgHeight): roll it further and gravity takes it over. Kerb-tripped, it starts
// with a roll rate; roll angle θ in rad, + = rolling over.
const G = 9.81;

export const tipAngle = ({ halfTrack, cgHeight }) => Math.atan(halfTrack / cgHeight);

// p = { halfTrack, cgHeight, gyration (m, radius of gyration about the centre of gravity) }. Pendulum about the pivot.
export function createRoll(p, rate0) {
  const r = Math.hypot(p.halfTrack, p.cgHeight), a0 = tipAngle(p), I = r * r + p.gyration ** 2;   // per kg
  const s = { theta: 0, rate: rate0, t: 0 };
  s.step = dt => {
    // Up to 90° the car is on its wheels' edge; past it, the roof takes over as the pivot: simplified as a fall to 180°.
    const acc = s.theta < Math.PI / 2 ? G * r * Math.sin(s.theta - a0) / I : G * r / I;
    s.rate += acc * dt; s.theta = Math.min(Math.PI, s.theta + s.rate * dt); s.t += dt;
    if (s.theta <= 0 && s.rate < 0) { s.theta = 0; s.rate = 0; }   // fell back onto its wheels
    return s;
  };
  return s;
}

// The rate a kerb has to give to take the car over: the energy to lift the centre of gravity over the pivot.
export function tipRate(p) {
  const r = Math.hypot(p.halfTrack, p.cgHeight), I = r * r + p.gyration ** 2;
  return Math.sqrt(2 * G * (r - p.cgHeight) / I);
}

// Spring-raised roll bar: a preloaded spring turns the bar up through `travel` (rad) once a solenoid lets it go.
// b = { torque (N·m at the start), rate (N·m per rad the spring loses), inertia (kg·m²), travel (rad) }. Time to full, s.
export function barTime(b, dt = 1e-5) {
  let a = 0, w = 0, t = 0;
  while (a < b.travel && t < 5) { w += (b.torque - b.rate * a) / b.inertia * dt; a += w * dt; t += dt; }
  return t;
}
export function barAngle(b, t, dt = 1e-4) {
  let a = 0, w = 0;
  for (let s = 0; s < t && a < b.travel; s += dt) { w += (b.torque - b.rate * a) / b.inertia * dt; a += w * dt; }
  return Math.min(a, b.travel);
}
