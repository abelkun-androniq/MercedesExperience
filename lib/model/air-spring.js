// Self-levelling air suspension vs a steel spring, one corner. Pure: no DOM, no three.js. SI units.
// Air spring: gauge pressure on an effective area carries the load; stiffness k = n·p_abs·A²/V rises with the load,
// so the ride frequency stays nearly constant. A steel spring keeps k and sags instead.
const PATM = 101325, G = 9.81;
const hz = (k, m) => Math.sqrt(k / m) / (2 * Math.PI);

// Static values at ride height. a = { area (m²), volume (m³), n (polytropic exponent) }.
export function airStatic(a, mass) {
  const pg = mass * G / a.area, k = (a.n ?? 1.3) * (pg + PATM) * a.area ** 2 / a.volume;
  return { pg, k, f: hz(k, mass) };
}
export const steelStatic = (k, mass, emptyMass) => ({ sag: (mass - emptyMass) * G / k, f: hz(k, mass) });

// Dynamic corner. kind "air": air spring with a levelling valve that adds or vents air while the body is off ride height.
// kind "steel": spring of rate k, preloaded to carry emptyMass at ride height. z = sag below ride height (m), + = lower.
// The valve is proportional: it moves air at up to valveRate (share of the air per second) once the body is `full` metres
// off ride height, and does nothing inside ±tol.
export function createCorner({ kind, air, k, emptyMass, damping, valveRate = 0.15, tol = 0.002, full = 0.02 }) {
  const n = air?.n ?? 1.3;
  const s = { z: 0, v: 0, C: 0, valve: "level" };
  if (kind === "air") s.C = (airStatic(air, emptyMass).pg + PATM) * air.volume ** n;   // p·Vⁿ of the air in the spring
  s.step = (mass, dt) => {
    let F;
    if (kind === "air") F = (s.C / (air.volume - air.area * s.z) ** n - PATM) * air.area;
    else F = emptyMass * G + k * s.z;
    s.v += (mass * G - F - damping * s.v) / mass * dt;
    s.z += s.v * dt;
    if (kind === "air") {
      s.valve = s.z > tol ? "filling" : s.z < -tol ? "venting" : "level";
      if (s.valve !== "level") s.C *= 1 + valveRate * Math.max(-1, Math.min(1, s.z / full)) * dt;
    }
    return s;
  };
  s.pressure = () => (kind === "air" ? s.C / (air.volume - air.area * s.z) ** n - PATM : NaN);   // gauge, Pa
  return s;
}
