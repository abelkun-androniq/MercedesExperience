// A hydrogen fuel-cell stack driving an electric motor (NECAR 1). Pure: no DOM, no three.js. SI units except current
// density (A/cm²), as fuel-cell curves are given.
// Each cell joins hydrogen and oxygen into water and drives a current: per ampere, H₂ is used at I / (2F) mol/s and the
// same number of moles of water leave; O₂ at I / (4F). Cell voltage falls with current density j (polarization curve):
//   V = e0 − tafel · ln(1 + j / j0) − r · j − mt · exp(n · j)
// (activation, resistance, and the steep drop where the gases cannot reach the catalyst fast enough).
// p = { cells, area (cm²), e0, tafel, j0, r, mt, n, motor (efficiency), auxBase (W), auxShare (share of stack power the air
// compressor and pumps take) }.
export const F = 96485;
const H2 = 2.016e-3, H2O = 18.015e-3, LHV = 120e6;   // kg/mol, kg/mol, J/kg

export const cellVolts = (p, j) => Math.max(0, p.e0 - p.tafel * Math.log(1 + j / p.j0) - p.r * j - p.mt * Math.exp(p.n * j));

export function atCurrent(p, j) {
  const I = j * p.area, V = cellVolts(p, j) * p.cells, stack = I * V, mol = I * p.cells / (2 * F);
  const aux = p.auxBase + p.auxShare * stack, motor = Math.max(0, stack - aux) * p.motor;
  return { j, I, V, stack, aux, motor, h2: mol * H2, water: mol * H2O, air: mol / 2 / 0.21 * 28.96e-3 * 2,   // air at twice the oxygen used
    efficiency: mol > 0 ? motor / (mol * H2 * LHV) : 0 };
}

// The stack's peak: the current density with the most power, by a fine search.
export function peak(p) {
  let best = atCurrent(p, 0);
  for (let j = 0.005; j < 3; j += 0.005) { const s = atCurrent(p, j); if (s.stack > best.stack) best = s; else if (s.stack < best.stack * 0.5) break; }
  return best;
}

// The working point that gives the motor power P (W) at the lowest current, or null if the stack cannot.
export function forMotor(p, P) {
  const top = peak(p); if (top.motor < P) return null;
  let lo = 0, hi = top.j;
  for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (atCurrent(p, mid).motor < P) lo = mid; else hi = mid; }
  return atCurrent(p, hi);
}
