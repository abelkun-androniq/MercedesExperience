// Open and locked differentials. Pure: no DOM, no three.js. Units: m, s, N, rad/s.

// Cornering: each driven wheel follows its own circle about the turn centre, so the outer wheel turns faster.
// radius = turn radius at the axle centre (m, + = turning left, Infinity = straight), v = axle-centre speed (m/s).
// diff = half the speed difference: the side gears' speed relative to the carrier, which the spider gears take up.
export function cornerSpeeds({ halfTrack, wheelR }, radius, v) {
  const k = Number.isFinite(radius) ? halfTrack / radius : 0;
  const left = v * (1 - k) / wheelR, right = v * (1 + k) / wheelR;
  return { left, right, carrier: (left + right) / 2, diff: (right - left) / 2 };
}

// Drive force on an axle. Open: both sides always get the same torque, so the wheel with less grip limits both.
// Locked: the axle turns as one shaft and each wheel can push up to its own grip.
// p = { torque (N·m at the axle), wheelR, normal (N per wheel), muL, muR, locked, resist (N needed to move the car) }.
export function traction({ torque, wheelR, normal, muL, muR, locked, resist = 0 }) {
  const gripL = muL * normal, gripR = muR * normal, want = torque / wheelR;
  let fL, fR, spinL, spinR;
  if (locked) {
    const grip = gripL + gripR, f = Math.min(want, grip);
    fL = grip ? f * gripL / grip : 0; fR = f - fL;
    spinL = spinR = want > grip;
  } else {
    // The wheel with less grip spins first; that caps the torque on both sides, so the other wheel never spins.
    const each = Math.min(want / 2, gripL, gripR);
    fL = fR = each;
    spinL = want / 2 > gripL && gripL <= gripR; spinR = want / 2 > gripR && gripR <= gripL;
  }
  const total = fL + fR;
  return { fL, fR, total, spinL, spinR, moves: total > resist };
}
