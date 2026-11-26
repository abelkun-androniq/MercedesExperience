// Exhaust-gas turbocharger on a four-stroke engine. Pure: no DOM, no three.js. SI units.
// The turbine in the exhaust and the compressor in the intake share one shaft, so in steady running the turbine gives
// exactly the power the compressor takes (bearing losses aside). The compressor squeezes the air to the pressure ratio
// pr = (ambient + boost) / ambient and warms it: T2 = T1 · (1 + (pr^0.2857 − 1) / ηc). The intercooler takes back a share
// of that warming; the engine then breathes air of density p / (R·T), and its power grows with the air it takes in.
// p = { disp (m³), rpm, ve (volumetric efficiency), eta (brake efficiency), afr (air : fuel), lhv (J/kg), etaC,
// cooler (intercooler effectiveness 0..1), t1 (K), p1 (Pa), wheel (compressor tip diameter, m), psi (work coefficient) }.
const R = 287, CP = 1005, K = 0.2857;

export function boosted(p, boost) {
  const pr = (p.p1 + boost) / p.p1;
  const t2 = p.t1 * (1 + (pr ** K - 1) / p.etaC), tc = t2 - p.cooler * (t2 - p.t1);
  const air = p.ve * (p.p1 * pr / (R * tc)) * p.disp * p.rpm / 120;          // kg/s
  const power = air / p.afr * p.lhv * p.eta;                                    // W at the crankshaft
  const work = CP * (t2 - p.t1);                                                // J per kg of air through the compressor
  const shaft = air * work;                                                     // W: compressor in = turbine out
  const shaftRpm = Math.sqrt(work / p.psi) / (Math.PI * p.wheel) * 60;          // tip speed² · ψ = work
  return { pr, t2, tc, air, power, shaft, shaftRpm };
}

// The boost (Pa) that gives power P (W), by bisection.
export function boostFor(p, P) {
  let lo = 0, hi = 5e5;
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (boosted(p, mid).power < P) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
