// Deck hoist of a car transporter: a hydraulic cylinder with a pulley block. Pure: no DOM, no three.js. SI units.
// The cable is reeved `falls` times between a block on the cylinder's base and a block on its rod, then runs over a
// pulley at the top of the post down to the deck. Each metre the rod extends takes `falls` metres of cable into the
// block, so the deck rises `falls` times as far as the piston moves, and the piston needs `falls` times the cable's pull.
// h = { falls, bore (m), sheaveEta (efficiency of each sheave the cable passes), sheaves, stroke (m), flow (l/min) }.
const G = 9.81;

export const deckRise = (h, stroke) => h.falls * stroke;
export const strokeFor = (h, rise) => rise / h.falls;
export const pistonArea = h => (Math.PI * h.bore ** 2) / 4;

// Piston force (N) to raise a cable pull of `pull` N at steady speed, friction at every sheave included.
export const cylinderForce = (h, pull) => (h.falls * pull) / h.sheaveEta ** h.sheaves;
export const pressureBar = (h, pull) => cylinderForce(h, pull) / pistonArea(h) / 1e5;

// Deck speed (m/s) for the pump's flow into one cylinder.
export const deckSpeed = h => (h.falls * (h.flow / 60000)) / pistonArea(h);

// A deck hung from cables at its two ends (x positions a = rear, b = front), carrying masses [{ x, mass }]: the pull at
// each end (N), from the balance of moments. With vertical cables a tilted deck shares its load in the same proportions.
export function endPulls(a, b, masses) {
  const total = masses.reduce((s, q) => s + q.mass * G, 0);
  const front = masses.reduce((s, q) => s + (q.mass * G * (q.x - a)) / (b - a), 0);
  return { rear: total - front, front };
}
