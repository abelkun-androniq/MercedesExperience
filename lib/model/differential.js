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

// Four-wheel drive through three differentials: front, centre and rear, each open or locked. With traction control by the
// brakes (4ETS, brake > 0) a wheel that would spin on an open differential is braked instead, so its side of the
// differential can pass on up to `brake` more. Forces at the tyres in N, wheels ordered fl, fr, rl, rr.
// p = { force (N: the engine's drive at the wheels, all four together), normal (N per wheel), mu: [4], front, centre,
//   rear (true = locked), brake (N a wheel brake can hold back, 0 = none), resist (N needed to move the car),
//   rearOnly (front axle disengaged: part-time four-wheel drive in two-wheel mode) }.
export function traction4({ force, normal, mu, front, centre, rear, brake = 0, resist = 0, rearOnly = false }) {
  const grip = mu.map(m => m * normal);
  // One axle: input = the force put into its differential; drive = what its tyres push. Open, each side takes input/2,
  // which may be up to its grip plus what its brake can hold; locked, the sides share it in proportion to grip.
  const axle = (gL, gR, locked) => ({
    max: locked ? gL + gR : 2 * Math.min(gL, gR) + 2 * brake,
    drive: input => (locked ? Math.min(input, gL + gR) : Math.min(input / 2, gL) + Math.min(input / 2, gR)),
    locked, g: [gL, gR],
  });
  const axles = [axle(grip[0], grip[1], front), axle(grip[2], grip[3], rear)];
  let inputs;
  if (rearOnly) inputs = [0, Math.min(force, axles[1].max)];
  else if (!centre) { const i = Math.min(force / 2, axles[0].max, axles[1].max); inputs = [i, i]; }
  else {
    // Locked centre: split the input where it drives most (brakes waste whatever they hold back).
    let best = -1;
    for (let k = 0; k <= 200; k++) {
      const f = Math.min(force, axles[0].max) * k / 200, r = Math.min(force - f, axles[1].max);
      const d = axles[0].drive(f) + axles[1].drive(r);
      if (d > best + 1e-9) { best = d; inputs = [f, r]; }
    }
  }
  const drive = axles[0].drive(inputs[0]) + axles[1].drive(inputs[1]);
  const excess = force > inputs[0] + inputs[1] + 1e-6;
  // Which wheels spin: with drive left over, those of an axle that takes all it can and whose own grip (plus brake) is
  // used up. Which are braked: on an open axle, those given more than their grip.
  const spin = [], braked = [];
  axles.forEach((a, k) => a.g.forEach(g => {
    const full = inputs[k] >= a.max - 1e-6 && !(rearOnly && k === 0), side = inputs[k] / 2;
    spin.push(excess && full && (a.locked || side >= g + brake - 1e-6));
    braked.push(!a.locked && brake > 0 && side > g + 1e-6 ? Math.min(brake, side - g) : 0);
  }));
  return { drive, moves: drive > resist, spin, braked, inputs };
}
