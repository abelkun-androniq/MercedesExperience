// Valve train: cam lift, a spring-closed valve that can float, and a desmodromic (cam-closed) valve.
// Pure: no DOM, no three.js. Cam angle φ in rad (half crank speed); lift in m; all values illustrative.
const TAU = 2 * Math.PI;

// p = { lift (m), open (cam rad where the event starts), duration (cam rad) }. Cosine bump: smooth velocity, finite acceleration.
export function camLift(phi, p) {
  const u = (((phi - p.open) % TAU) + TAU) % TAU / p.duration;
  if (u <= 0 || u >= 1) return { L: 0, dL: 0, ddL: 0 };
  const w = TAU * u, k = Math.PI / p.duration;
  return { L: p.lift * (1 - Math.cos(w)) / 2, dL: p.lift * k * Math.sin(w), ddL: p.lift * 2 * k * k * Math.cos(w) };
}

// Spring rate that just keeps the valve on the cam nose at floatRpm (crank rpm). Max closing deceleration is at the nose,
// where the spring force k·(lift + preload) must match m·|L''|·ω².
export function springRateFor(p) {
  const w = p.floatRpm / 2 * TAU / 60, k = Math.PI / p.duration;
  return p.mass * p.lift * 2 * k * k * w * w / (p.lift + p.preload);
}

// Simulate a spring-closed valve on a pushing-only cam at crank speed rpm, in cam-angle steps (true physics at any
// display speed). Returns two-revolution-settled samples over one cam revolution: cam lift, valve lift, separation.
export function simulateSpringValve(p, rpm, samples = 360) {
  const k = p.k ?? springRateFor(p), w = rpm / 2 * TAU / 60, dphi = 0.002, dt = dphi / w;
  let x = 0, v = 0, maxSep = 0;
  const out = { phi: [], cam: [], valve: [], maxSep: 0 };
  const total = 2 * TAU, every = TAU / samples;
  let next = TAU;
  for (let phi = 0; phi < total; phi += dphi) {
    const c = camLift(phi, p);
    v += (-k * (x + p.preload) / p.mass) * dt;   // spring pushes the valve shut
    x += v * dt;
    if (x <= c.L) { x = c.L; v = Math.max(v, c.dL * w); }   // cam can push, never pull
    if (phi >= TAU) {
      maxSep = Math.max(maxSep, x - c.L);
      if (phi >= next) { out.phi.push(phi - TAU); out.cam.push(c.L); out.valve.push(x); next += every; }
    }
  }
  out.maxSep = maxSep;
  return out;
}

// Desmodromic: the opening cam pushes the valve open through one rocker, a conjugate closing cam pulls it shut through
// another. Conjugate means open radius + close radius = constant, so the valve position is exactly L(φ) at any speed.
export function desmoCams(phi, p) {
  const { L } = camLift(phi, p);
  return { open: p.base + L, close: p.base + p.lift - L, valve: L };
}
