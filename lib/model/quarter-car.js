// Quarter-car ride model and road profile (docs/TOUR-POC.md §6.2). Pure: no DOM, no three.js.
// SI units; displacements from static equilibrium. One corner per axle.

export const ROAD_PERIOD = 24; // m

// Road height (m) at road coordinate s (m): a 40 mm cosine bump at 4–4.5 m, a 30 mm cosine pothole at 14–14.7 m.
export function roadProfile(s) {
  s = ((s % ROAD_PERIOD) + ROAD_PERIOD) % ROAD_PERIOD;
  if (s > 4 && s < 4.5) return 0.02 * (1 - Math.cos(2 * Math.PI * (s - 4) / 0.5));
  if (s > 14 && s < 14.7) return -0.015 * (1 - Math.cos(2 * Math.PI * (s - 14) / 0.7));
  return 0;
}

// p = { ms, mu, ks, cs, kt } (kg, N/m, N·s/m). The tyre can push but never pull, so it can leave the road.
export function createCorner(p) {
  const fStatic = (p.ms + p.mu) * 9.81;
  const c = { zs: 0, vs: 0, zu: 0, vu: 0, zr: 0, load: fStatic, fStatic };
  c.step = (zr, dt) => {   // semi-implicit Euler
    const fs = p.ks * (c.zs - c.zu) + p.cs * (c.vs - c.vu);
    const ft = Math.max(p.kt * (zr - c.zu), -fStatic);
    c.vs += (-fs / p.ms) * dt;
    c.vu += ((fs + ft) / p.mu) * dt;
    c.zs += c.vs * dt; c.zu += c.vu * dt;
    c.zr = zr; c.load = fStatic + ft;
  };
  return c;
}

// Whole car driving the road loop. xFront/xRear: axle positions (m) in the car's frame; each axle sees roadProfile(x + dist).
export function createRide({ ride, xFront, xRear, speed = 25 / 3.6, dt = 0.0005 }) {
  const front = createCorner(ride), rear = createCorner(ride);
  const wb = xFront - xRear;
  const sim = {
    front, rear, dist: 0, t: 0,
    // Advance by h seconds of simulated time in fixed steps.
    step(h) {
      while (h > 1e-9) {
        const d = Math.min(dt, h); h -= d; sim.t += d; sim.dist += speed * d;
        front.step(roadProfile(xFront + sim.dist), d);
        rear.step(roadProfile(xRear + sim.dist), d);
      }
    },
    corner: axle => (axle === "front" ? front : rear),
    travelMm: axle => { const c = sim.corner(axle); return (c.zu - c.zs) * 1000; },  // + = bump
    loadPct: axle => { const c = sim.corner(axle); return c.load / c.fStatic * 100; },
    bodyZ: () => rear.zs + (front.zs - rear.zs) * (0 - xRear) / wb,                   // body heave at the frame origin (m)
    pitch: () => -Math.asin((front.zs - rear.zs) / wb),                              // rotation about y (rad), nose up < 0
  };
  return sim;
}
