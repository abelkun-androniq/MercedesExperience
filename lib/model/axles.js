// Rear axles compared, seen from behind: rigid (one beam through both wheels), swing (each half-shaft hinged near the
// middle, the wheel square to it) and multi-link (lib/model/linkage.js). Pure: no DOM, no three.js.
// mm and deg. For one wheel: y outward from the car's centre, z up from the wheel centre's static height; travel s + = bump
// (the wheel up relative to the body). Camber − = top inboard, toe + = toe-in, track + = contact point moved outward.

const DEG = 180 / Math.PI;

// Swing axle: the half-shaft swings about a hinge `pivot` mm from the centre, at wheel-centre height.
export function swing({ halfTrack, wheelR, pivot }, s) {
  const arm = halfTrack - pivot, th = Math.asin(Math.max(-1, Math.min(1, s / arm)));
  return { camber: -th * DEG, toe: 0, track: arm * (Math.cos(th) - 1) + wheelR * Math.sin(th) };
}

// Rigid axle: the beam joins both wheel centres and is held sideways at its middle. s = this wheel's travel, other = the
// other wheel's: their difference tilts the beam and so both wheels.
export function rigid({ halfTrack, wheelR }, s, other) {
  const th = Math.atan2(s - other, 2 * halfTrack);
  return { camber: -th * DEG, toe: 0, track: halfTrack * (Math.cos(th) - 1) + wheelR * Math.sin(th) };
}

// Roll centre height above the ground (mm) of an independent axle, from its track change: the contact point moves sideways
// as if the wheel swung about a point on the line through the roll centre.
export function rollCentre(track, halfTrack, h = 1) {
  return halfTrack * (track(h) - track(-h)) / (2 * h);
}

// A steady bend (quasi-static). The side force m·ay acts at the centre of gravity; the body rolls about the roll centre
// against the springs (k at springHalf from the middle, N/mm) and an anti-roll bar (bar, N·mm/rad). On an independent axle
// the side force also pushes the body up through the links (jacking): lift = m·ay·hrc / halfTrack, taken by both springs.
// m (kg on this axle), ay (m/s²), hcg and hrc (mm above the ground), halfTrack, springHalf (default halfTrack), independent.
// Returns roll (rad, towards the outer wheel), lift (mm) and the travel of the outer and inner wheels (mm).
export function bend({ m, ay, hcg, hrc, k, bar = 0, halfTrack, springHalf = halfTrack, independent }) {
  const side = m * ay;
  const roll = side * (hcg - hrc) / (2 * k * springHalf ** 2 + bar);
  const lift = independent ? side * hrc / halfTrack / (2 * k) : 0;
  return { side, roll, lift, outer: halfTrack * roll - lift, inner: -halfTrack * roll - lift };
}

// A rough road for the comparison (m in, m out): six cosine bumps and dips, 15–35 mm, on an 18 m loop. Each wheel drives
// its own stretch of it (the right one some metres behind), so the two sides meet different bumps.
export const ROUGH_PERIOD = 18;
const ROUGH = [[1.5, 0.4, 25], [4, 0.5, -20], [6.5, 0.3, 15], [9, 0.6, 35], [12, 0.4, -25], [15, 0.3, 20]];   // start (m), length (m), height (mm)
export function roughRoad(s) {
  s = ((s % ROUGH_PERIOD) + ROUGH_PERIOD) % ROUGH_PERIOD;
  for (const [a, len, hgt] of ROUGH) if (s > a && s < a + len) return hgt / 2000 * (1 - Math.cos(2 * Math.PI * (s - a) / len));
  return 0;
}
