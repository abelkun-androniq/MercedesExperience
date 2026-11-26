// Front steering geometry, top view. Pure: no DOM, no three.js.
// Frame in mm: x forward, y left; front axle at x = 0, rear axle at x = −wheelbase. Steer angle δ in rad, + = turning left.
const hyp = Math.hypot;
const rot = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

// Double-pivot (stub-axle) steering with a trapezoid linkage: kingpins at (0, ±k), steering arms of length a pointing
// rearwards and inwards by β, joined by one tie rod. β = atan(k / wheelbase) aims both arms at the rear-axle centre,
// the classic condition for the wheel axes to meet near one point (Ackermann).
export function createDoublePivot({ kingpinHalf: k, arm: a, wheelbase: wb, armAngle }) {
  const beta = armAngle ?? Math.atan(k / wb);
  const KL = [0, k], KR = [0, -k];
  const armVec = (side, d) => rot([-a * Math.cos(beta), -side * a * Math.sin(beta)], d);
  const end = (K, side, d) => { const v = armVec(side, d); return [K[0] + v[0], K[1] + v[1]]; };
  const tie = hyp(...[0, 1].map(i => end(KL, 1, 0)[i] - end(KR, -1, 0)[i]));

  // Given the left wheel's angle (driven by the steering column), close the tie rod for the right wheel.
  function solve(dL) {
    const PL = end(KL, 1, dL);
    const dx = PL[0] - KR[0], dy = PL[1] - KR[1], d = hyp(dx, dy);
    const along = (a * a - tie * tie + d * d) / (2 * d), h = Math.sqrt(Math.max(0, a * a - along * along));
    const mx = KR[0] + along * dx / d, my = KR[1] + along * dy / d;
    const cands = [[mx + h * dy / d, my - h * dx / d], [mx - h * dy / d, my + h * dx / d]];
    const guess = end(KR, -1, dL);
    const PR = cands.reduce((best, c) => (hyp(c[0] - guess[0], c[1] - guess[1]) < hyp(best[0] - guess[0], best[1] - guess[1]) ? c : best));
    const v0 = armVec(-1, 0), v = [PR[0] - KR[0], PR[1] - KR[1]];
    const raw = Math.atan2(v[1], v[0]) - Math.atan2(v0[1], v0[0]);
    const dR = Math.atan2(Math.sin(raw), Math.cos(raw));   // wrap to (−π, π]
    return { dL, dR, PL, PR, KL, KR, ...turning(dL, dR) };
  }

  // Each front wheel's axis meets the rear-axle line at y = ±k + wb / tan δ. Equal y's = no tyre scrub.
  function turning(dL, dR) {
    if (Math.abs(dL) < 1e-6 || Math.abs(dR) < 1e-6) return { icrL: Infinity, icrR: Infinity, radius: Infinity, idealOuter: 0 };
    const icrL = k + wb / Math.tan(dL), icrR = -k + wb / Math.tan(dR);
    const inner = Math.max(Math.abs(dL), Math.abs(dR));
    const idealOuter = Math.sign(dL) * Math.atan(1 / (1 / Math.tan(inner) + 2 * k / wb));
    const icrY = (icrL + icrR) / 2, outerK = dL > 0 ? KR : KL;
    return { icrL, icrR, idealOuter, radius: hyp(-wb - outerK[0], icrY - outerK[1]) };
  }

  return { k, a, wb, beta, tie, solve, armVec };
}

// The older centre-pivot (turntable) axle: the whole beam swings about its middle. The wheel axes always meet,
// but the front support narrows (k·cos δ) and the inner wheel swings back by k·sin δ, toward the body.
export function centrePivot({ kingpinHalf: k, wheelbase: wb }, d) {
  const L = rot([0, k], d), R = rot([0, -k], d);
  const straight = Math.abs(d) < 1e-6;
  const icrY = straight ? Infinity : wb / Math.tan(d), outer = d > 0 ? R : L;
  return { L, R, halfTrack: k * Math.cos(d), swingBack: k * Math.abs(Math.sin(d)), icrY, radius: straight ? Infinity : hyp(outer[0] + wb, outer[1] - icrY) };
}

// Two steered front axles (twin-steer lorries): axle 1 `wheelbase` ahead of the rear axle, axle 2 `second` ahead of it.
// For every wheel axis to meet at one turning centre on the rear-axle line, the second axle must steer less: for the same
// centre tan δ₂ = tan δ₁ · second / wheelbase, which a drag link between the two axles' steering arms provides. Each axle
// is its own double-pivot trapezoid aimed at the rear axle. steered = false: the second axle runs straight (its tyres are
// dragged sideways through every turn, at the slip angle they would need to point at the centre).
export function createTwinSteer({ kingpinHalf, arm, wheelbase, second }) {
  const a1 = createDoublePivot({ kingpinHalf, arm, wheelbase }), a2 = createDoublePivot({ kingpinHalf, arm, wheelbase: second });
  const link = d => Math.atan(Math.tan(d) * second / wheelbase);
  return {
    a1, a2, link,
    solve(dL, steered = true) {
      const s1 = a1.solve(dL), s2 = steered ? a2.solve(link(dL)) : a2.solve(0);
      const centre = (s1.icrL + s1.icrR) / 2;   // y of the turning centre on the rear-axle line (Infinity straight ahead)
      const scrub = Number.isFinite(centre) ? Math.atan(second / Math.abs(centre)) : 0;   // slip angle forced on a straight axle 2
      return { s1, s2, centre, miss: steered && Number.isFinite(s2.icrL) ? Math.abs((s2.icrL + s2.icrR) / 2 - centre) : null, scrub: steered ? 0 : scrub };
    },
  };
}

// Dual-axis steering (Mercedes W11, 2020), seen from above. Turning the wheel moves the rack sideways and steers both front
// wheels together; pushing or pulling the wheel along its column moves both track-rod inner ends in or out together, which
// changes the toe of both wheels by the same amount, without steering. pull (mm) along the column → inner ends move by
// gain · pull; each wheel turns by asin(shift / arm) (arm: steering-arm length, mm). Toe + = toe-in (leading edges closer).
// Returns each wheel's angle (rad, + = left): left = steer − toe, right = steer + toe.
export function dualAxis({ arm, gain, toe0 }, steer, pull) {
  const toe = toe0 + Math.asin(Math.max(-1, Math.min(1, gain * pull / arm)));
  return { toe, left: steer - toe, right: steer + toe };
}
// A wheel rolling at toe angle α is pushed sideways by its tyre with c·α (c: cornering stiffness, N/rad); the share of
// that force along the car's path, c·α·sin α, is drag. For both front wheels at speed v (m/s): side force per tyre (N),
// drag (N) and the power it costs (W).
export function toeDrag(c, toe, v) {
  const side = c * Math.abs(toe), drag = 2 * side * Math.sin(Math.abs(toe));
  return { side, drag, power: drag * v };
}
