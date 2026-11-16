// Clutch-engaged Roots supercharger (docs/TOUR-POC.md §6.4). Pure: no DOM, no three.js.
// Pedal 0..1; the clutch closes only in the last few % of pedal travel. Boost and power are illustrative.

export const BLOWER_DEFAULTS = { ratio: 2.6, engageAt: 0.98, tauUp: 0.25, tauDown: 0.7, boostMax: 0.5, psAtmo: 115, psBoost: 180 };

export function createBlower(params = {}) {
  const p = { ...BLOWER_DEFAULTS, ...params };
  const b = { p, engaged: false, spin: 0, boost: 0, power: p.psAtmo };
  b.step = (pedal, dt) => {
    b.engaged = pedal >= p.engageAt;
    const target = b.engaged ? 1 : 0, tau = b.engaged ? p.tauUp : p.tauDown;
    b.spin += (target - b.spin) * (1 - Math.exp(-dt / tau));
    b.boost = p.boostMax * b.spin * b.spin;
    b.power = p.psAtmo + (p.psBoost - p.psAtmo) * b.spin * b.spin;
  };
  return b;
}

// Auto demo, 10 s cycle: cruise, part throttle, floor it (blower in) from 3.8 to 7.5 s, lift off.
export function autoPedal(t) {
  t %= 10;
  if (t < 2) return 0.25 + 0.5 * t / 2;
  if (t < 3.5) return 0.75;
  if (t < 3.8) return 0.75 + 0.25 * (t - 3.5) / 0.3;
  if (t < 7.5) return 1;
  if (t < 8) return 1 - 0.75 * (t - 7.5) / 0.5;
  return 0.25;
}

// Two-lobe rotor end profile: r(φ) = c + e·sign(cos 2φ)·|cos 2φ|^0.55. The term is odd in cos 2φ,
// so two rotors phased −A and π/2 + A stay in contact on the line of centres.
export const rotorRadius = (phi, c, e = 0.024) => { const u = Math.cos(2 * phi); return c + e * Math.sign(u) * Math.pow(Math.abs(u), 0.55); };
