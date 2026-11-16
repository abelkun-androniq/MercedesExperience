// Frontal impact into a rigid wall, one mass. Pure: no DOM, no three.js. SI units.
// The front crushes with force F(x) until the car stops; past zone.length the passenger cell itself deforms (intrusion).
// zone = { type: "crumple", force (N), length (m), ramp (m) }: folds at a nearly constant force, the safety-body idea;
//        { type: "stiff", k (N/m), length (m) }: force rises steeply with every millimetre, as in a rigid older body.
const G = 9.81;

export function crushForce(zone, cellK, x) {
  if (x <= zone.length) return zone.type === "stiff" ? zone.k * x : zone.force * Math.min(1, x / zone.ramp);
  const atEnd = zone.type === "stiff" ? zone.k * zone.length : zone.force;
  return atEnd + cellK * (x - zone.length);
}

// Returns time traces (every ms), peak and mean deceleration in g, crush, intrusion into the cell (m) and duration (s).
export function simulateCrash({ mass, v0, zone, cellK }, dt = 2e-5) {
  let x = 0, v = v0, t = 0, peak = 0, next = 0;
  const out = { t: [], x: [], a: [] };
  while (v > 0 && t < 0.5) {
    const a = crushForce(zone, cellK, x) / mass;
    peak = Math.max(peak, a);
    if (t >= next) { out.t.push(t); out.x.push(x); out.a.push(a / G); next += 1e-3; }
    v -= a * dt; x += Math.max(v, 0) * dt; t += dt;
  }
  out.t.push(t); out.x.push(x); out.a.push(0);
  return { ...out, peakG: peak / G, meanG: v0 / t / G, crush: x, intrusion: Math.max(0, x - zone.length), duration: t };
}
