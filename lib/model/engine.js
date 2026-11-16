// Four-stroke piston-engine kinematics (docs/TOUR-POC.md §6.3), generalised to N evenly firing cylinders.
// Pure: no DOM, no three.js. Angles in rad, crank angle θ. Phase 0 = firing TDC of that cylinder.

export const STROKES = ["Power", "Exhaust", "Intake", "Compression"];
const TAU = 2 * Math.PI, CYCLE = 4 * Math.PI;
const mod = (a, m) => ((a % m) + m) % m;

// Distance from crank centre to gudgeon pin for crank angle α (0 = TDC), throw r, conrod l.
export const pistonPos = (alpha, r, l) => r * Math.cos(alpha) + Math.sqrt(l * l - (r * Math.sin(alpha)) ** 2);

// order: firing order as cylinder numbers, e.g. [1, 3, 4, 2]. Returns per-cylinder (index = cylinder − 1)
// phase offset and crank-throw angle, so that each cylinder is at TDC exactly at its own firing.
export function layout(order) {
  const n = order.length, interval = CYCLE / n;
  const offset = new Array(n), throwA = new Array(n);
  order.forEach((cyl, k) => { offset[cyl - 1] = k * interval; throwA[cyl - 1] = mod(-k * interval, TAU); });
  return { n, interval, offset, throwA };
}

export const phaseOf = (theta, offset) => mod(theta - offset, CYCLE);
export const strokeOf = ph => STROKES[Math.floor(mod(ph, CYCLE) / Math.PI)];

// Firing order recovered from a layout (used by tests): cylinders sorted by phase offset.
export const firingOrder = lay => lay.offset.map((o, i) => [o, i + 1]).sort((a, b) => a[0] - b[0]).map(p => p[1]);

// Sine bump between open and close phase (rad), peak = max. Zero outside the window.
export const bumpLift = (ph, open, close, max) => (ph > open && ph < close) ? Math.sin(Math.PI * (ph - open) / (close - open)) * max : 0;

// Valve timing relative to firing TDC (rad); illustrative but typical: exhaust opens before BDC, intake closes after BDC.
export const TIMING = {
  exhaust: [Math.PI - 0.4, 2 * Math.PI + 0.2],
  intake: [2 * Math.PI - 0.2, 3 * Math.PI + 0.4],
  // Daimler 1884: the intake valve is "atmospheric": suction opens it during the intake stroke only (no overlap).
  intakeAtmospheric: [2 * Math.PI + 0.15, 3 * Math.PI - 0.1],
  // Direct injection into the cylinder during the intake stroke (300 SLR / M 196).
  injection: [2 * Math.PI + 0.5, 2 * Math.PI + 1.6],
  // Diesel (260 D): fuel goes into the prechamber just before firing TDC, into air already hot from compression.
  // Phase wraps at 4π, so the window is [4π − 0.35, 4π) ∪ [0, 0.1).
  diesel: [4 * Math.PI - 0.35, 0.1],
};

export function valveLifts(ph, kind, max) {
  const intake = kind === "atmospheric" ? TIMING.intakeAtmospheric : TIMING.intake;
  return { intake: bumpLift(ph, intake[0], intake[1], max), exhaust: bumpLift(ph, TIMING.exhaust[0], TIMING.exhaust[1], max) };
}

// 0..1 brightness of the combustion flash just after firing TDC.
export const flashOf = ph => (ph < Math.PI ? Math.max(0, 1 - (ph / Math.PI) * 2.2) : 0);
export const injecting = ph => ph > TIMING.injection[0] && ph < TIMING.injection[1];
export const injectingDiesel = ph => ph > TIMING.diesel[0] || ph < TIMING.diesel[1];

// Air temperature at the end of compression (°C), polytropic: T₂ = T₁ · ε^(n − 1). Real engines lose heat to the walls,
// so n ≈ 1.3 rather than the adiabatic 1.4.
export const compressionTemp = (ratio, t1 = 20, n = 1.3) => (t1 + 273.15) * ratio ** (n - 1) - 273.15;
