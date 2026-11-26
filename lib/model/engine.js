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

// Direction of cylinder i's crankpin at crank angle 0 (rad, in the crank plane, from +z towards −y), for a cylinder
// leaning `lean` rad to the right. In a V engine two cylinders whose pins point the same way share one crankpin.
export const pinAngle = (lay, i, lean = 0) => mod(lean + lay.offset[i], TAU);

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

// Shaking forces (docs/bilingual-copy-and-ux-proposals.md, straight-six balance). Each piston's inertia pushes on the block
// along its cylinder (+ = away from the crank), in units of m·r·ω²: first order cos α, once per turn; second order
// λ·cos 2α with λ = r/l, twice per turn, from the conrod's changing angle. Summed over an inline engine at crank angle θ,
// with the rocking moment about the middle of the block (xs in any length unit; moment in that unit × m·r·ω²).
export const inertiaForce = (alpha, lambda, order) => (order === 1 ? Math.cos(alpha) : lambda * Math.cos(2 * alpha));
export function shaking(lay, theta, xs, lambda, order) {
  const xc = (Math.min(...xs) + Math.max(...xs)) / 2, f = xs.map((_, i) => inertiaForce(theta + lay.throwA[i], lambda, order));
  return { f, sum: f.reduce((a, v) => a + v, 0), moment: f.reduce((a, v, i) => a + v * (xs[i] - xc), 0) };
}

// Crank torque from gas pressure, illustrative: over its 720° cycle each cylinder pushes during the power stroke (strong
// just after firing, fading as the gas expands) and drags a little while it compresses. crankTorque sums the cylinders at
// crank angle θ and scales so its mean is 1: engines compare at equal mean torque, which keeps pulse spacing apart from power.
const gasPulse = ph => (ph < Math.PI ? Math.sin(ph) * (1 - ph / Math.PI) ** 1.5 : ph > 3 * Math.PI ? -0.25 * Math.sin(ph - 3 * Math.PI) * (ph - 3 * Math.PI) / Math.PI : 0);
const PULSE_MEAN = (() => { let s = 0; const N = 7200; for (let k = 0; k < N; k++) s += gasPulse((k + 0.5) / N * CYCLE); return s / N; })();
export const crankTorque = (lay, theta) => lay.offset.reduce((a, o) => a + gasPulse(phaseOf(theta, o)), 0) / (lay.n * PULSE_MEAN);
// Power strokes per crank revolution and per second for an evenly firing four-stroke.
export const pulsesPerTurn = n => n / 2;
export const pulsesPerSecond = (n, rpm) => n / 2 * rpm / 60;
