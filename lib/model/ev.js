// A four-motor electric car (SLS AMG Electric Drive): torque vectoring in a steady bend, and the energy path between
// battery and wheels. Pure: no DOM, no three.js. SI units.
//
// Bend: linear single-track ("bicycle") model at constant speed v round radius R. Axle cornering stiffnesses cf, cr (N/rad),
// centre of gravity a behind the front axle and b ahead of the rear (L = a + b). With side forces Fyf + Fyr = m·ay and
// moments a·Fyf − b·Fyr + Mz = 0, a yaw moment Mz from the motors takes load off the front tyres:
//   Fyf = (m·ay·b − Mz) / L,  Fyr = (m·ay·a + Mz) / L,  δ = L/R + Fyf/cf − Fyr/cr.
// Mz from shift (N): each outer wheel drives with that much more force, each inner wheel with that much less (the total
// drive force is unchanged), on both axles: Mz = 2 · shift · track.
export function bend({ m, a, b, cf, cr, track }, R, v, shift = 0) {
  const L = a + b, ay = v * v / R, Mz = 2 * shift * track;
  const fyf = (m * ay * b - Mz) / L, fyr = (m * ay * a + Mz) / L;
  return { ay, Mz, fyf, fyr, steer: L / R + fyf / cf - fyr / cr, ackermann: L / R };
}

// Energy at speed v (m/s) with acceleration acc (m/s², negative = braking). car: { m, cda (m²), crr, drive (battery →
// wheel efficiency), regen (wheel → battery efficiency), regenMax (W at the battery) }. Returns watts: wheel (+ driving,
// − braking), battery (+ out of it, − into it) and friction (the brakes' share of a stop that regeneration cannot take).
export function energy(car, v, acc) {
  const resist = 0.5 * 1.2 * car.cda * v * v + car.crr * car.m * 9.81;
  const wheel = (car.m * acc + resist) * v;
  if (wheel >= 0) return { wheel, battery: wheel / car.drive, friction: 0 };
  const back = Math.min(-wheel * car.regen, car.regenMax);
  return { wheel, battery: -back, friction: -wheel - back / car.regen };
}
