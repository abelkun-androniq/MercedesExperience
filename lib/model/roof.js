// Retractable steel hardtop (Mercedes-Benz SLK, R 170 "Vario-roof"), side view. Pure: no DOM, no three.js. Units: mm, rad,
// s. The roof is two panels: the roof itself (front, A → J) and the rear-window section (J → D). Opening, the boot lid
// swings up about its rear hinge, the rear section turns rearwards about a pivot P behind the seats, carrying the roof,
// which folds down onto it about the joint J, and the pack drops into the boot; the lid closes over it.
// r = { A, J, D, P ([x, z] with the roof up), phi (rear section's final turn, + = top rearwards), psi (the roof's fold
// relative to it), lid { hinge [x, z], front [x, z] (its front edge, closed), open (rad) },
// phases [[id, seconds]] in opening order: "latch", "lid-open", "fold", "lid-close" }.
const rot = ([x, z], [cx, cz], a) => [cx + (x - cx) * Math.cos(a) - (z - cz) * Math.sin(a), cz + (x - cx) * Math.sin(a) + (z - cz) * Math.cos(a)];
const ease = u => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));

export const duration = r => r.phases.reduce((a, [, s]) => a + s, 0);

// The roof at time t of opening (0 = up and latched, duration = stowed); closing runs the same timeline backwards.
export function roofAt(r, t) {
  let t0 = 0, phase = r.phases.at(-1)[0];
  const u = {};
  for (const [id, s] of r.phases) { u[id] = ease((t - t0) / s); if (t >= t0 && t < t0 + s) phase = id; t0 += s; }
  const lid = r.lid.open * (u["lid-open"] - u["lid-close"]);
  const phi = r.phi * u.fold, psi = r.psi * ease(u.fold * 1.25 - 0.1);   // the roof starts folding just after the swing
  const J = rot(r.J, r.P, phi), D = rot(r.D, r.P, phi), A = rot(rot(r.A, r.J, psi), r.P, phi);
  return { phase: t <= 0 ? "up" : t >= duration(r) ? "down" : phase, lid, phi, psi, A, J, D, lidFront: rot(r.lid.front, r.lid.hinge, lid) };
}
