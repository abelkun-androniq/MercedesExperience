// Flat-belt drive with two speeds, as on the first Daimler and Benz vehicles. Pure: no DOM, no three.js.
// A belt runs from a pulley on the engine to a pulley on a countershaft; a smaller engine pulley against a larger
// countershaft pulley gives the low gear. The countershaft drives the wheel through a final drive: a pinion inside a ring
// gear (Daimler 1885) or chain sprockets (Benz 1894).
// drive = { gears: [{ name, drive, driven }] (pulley diameters, mm), pinion, ring (final-drive diameters, mm), wheelR (m) }.
// vehicle = { mass (kg, laden), crr (rolling resistance), eta (driveline efficiency), ps, rpm (governed engine speed) }.
const G = 9.81, PS = 735.5;
const BRAKE = 0.25;   // a block brake on the tyres: share of the weight it can hold back (illustrative)

// Engine turns per wheel turn in gear g.
export const ratio = (d, g) => (d.gears[g].driven / d.gears[g].drive) * (d.ring / d.pinion);

// Road speed (km/h) at engine speed rpm.
export const roadSpeed = (d, g, rpm) => (rpm / ratio(d, g)) * 2 * Math.PI * d.wheelR * 0.06;

// Engine torque (N·m) at its rated output.
export const torque = v => (v.ps * PS) / ((v.rpm * 2 * Math.PI) / 60);

// Push at the driven wheel (N): engine torque through the pulleys and the final drive.
export const wheelForce = (d, g, v) => (torque(v) * ratio(d, g) * v.eta) / d.wheelR;

// Force (N) to hold a steady speed up a grade (rise per run, 0.1 = 10 %): climbing plus rolling resistance.
export function resistance(v, grade) {
  const a = Math.atan(grade);
  return v.mass * G * (Math.sin(a) + v.crr * Math.cos(a));
}

// Steepest grade (rise per run) that a push of `force` N can hold; negative when it cannot even roll on the level.
export function maxGrade(v, force) {
  const k = force / (v.mass * G), h = Math.hypot(1, v.crr);
  return k >= h ? Infinity : Math.tan(Math.asin(k / h) - Math.atan(v.crr));
}

// One time step (s) of a run in gear g: full engine torque until the governor holds the engine at its rated speed.
// When the push cannot match the resistance the vehicle slows and stops (it is held, not rolled back). Faster than the
// gear allows (just shifted down), the slipping belt drags it back to the gear's speed. Returns km/h.
export function step(d, g, v, kmh, { grade = 0, engaged = true, brake = false }, dt) {
  const cur = kmh / 3.6, top = engaged ? roadSpeed(d, g, v.rpm) / 3.6 : Infinity, over = cur > top;
  const push = engaged ? (over ? -1 : 1) * wheelForce(d, g, v) : 0, hold = brake ? BRAKE * v.mass * G : 0;
  const next = cur + ((push - resistance(v, grade) - hold) / v.mass) * dt;
  return Math.max(0, over ? Math.max(next, top) : Math.min(next, top)) * 3.6;
}

// Open (uncrossed) belt around two pulleys of radius r1 and r2 whose centres are c apart: length.
export function beltLength(c, r1, r2) {
  const b = Math.asin((r2 - r1) / c);
  return 2 * c * Math.cos(b) + Math.PI * (r1 + r2) + 2 * b * (r2 - r1);
}

// The same belt as a closed path of [x, z] points: top run, round pulley 2, bottom run, round pulley 1. Walking along it
// is the way the belt moves when both pulleys turn clockwise (angle atan2(z, x) decreasing).
export function beltLoop([x1, z1], r1, [x2, z2], r2, n = 48) {
  const c = Math.hypot(x2 - x1, z2 - z1), au = Math.atan2(z2 - z1, x2 - x1), w = Math.acos((r1 - r2) / c);
  const arc = (cx, cz, r, a0, a1, k) => Array.from({ length: k + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / k; return [cx + r * Math.cos(a), cz + r * Math.sin(a)]; });
  const k2 = Math.max(4, Math.round((n * w) / Math.PI)), k1 = Math.max(4, n - k2);
  return [...arc(x2, z2, r2, au + w, au - w, k2), ...arc(x1, z1, r1, au - w, au + w - 2 * Math.PI, k1)];
}
