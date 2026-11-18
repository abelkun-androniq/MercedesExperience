// Portal axle (Unimog) against a conventional beam axle. Pure: no DOM, no three.js. Units: m, N·m.
// On a portal axle the half-shafts run above the wheel centres and drive each hub through a pair of spur gears (the
// portal), so the axle tube and differential sit higher by the gears' drop. The gears also reduce: the shafts turn
// `ratio` times faster than the wheels and carry 1/ratio of the wheel torque.
// a = { wheelR, tubeR (radius of the axle tube), diffR (lowest point of the differential housing below the axle centre),
//   drop (m: hub centre to half-shaft centre, 0 = conventional), ratio (hub reduction, 1 = none) }.
export const axleHeight = a => a.wheelR + a.drop;
export const clearance = a => axleHeight(a) - a.diffR;                // under the differential, the lowest point
export const clearsRock = (a, h) => clearance(a) > h;
export const shaftTorque = (a, wheelTorque) => wheelTorque / a.ratio;
export const shaftSpeed = (a, wheelSpeed) => wheelSpeed * a.ratio;
