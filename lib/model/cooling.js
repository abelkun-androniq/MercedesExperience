// Engine cooling water as one lump: heat from the engine against heat the radiator passes to the air. Pure: no DOM,
// no three.js. p = { water (kg), ua (W/K at refSpeed), refSpeed (m/s), still (share of ua with no airflow), airT (°C) }.
// Above 100 °C the surplus heat boils water away instead of raising the temperature.
const CP = 4186, LATENT = 2.26e6;

export const uaAt = (p, v) => p.ua * (p.still + (1 - p.still) * Math.sqrt(Math.min(Math.max(v, 0) / p.refSpeed, 2)));
export const steadyTemp = (p, heat, v) => p.airT + heat / uaAt(p, v);
// Water boiled away at full load and steady speed (kg/s), and the same as litres per 100 km at kmh.
export const boilRate = (p, heat, v) => Math.max(0, heat - uaAt(p, v) * (100 - p.airT)) / LATENT;
export const perHundredKm = (rate, kmh) => (kmh > 0.5 ? rate * 3600 / kmh * 100 : Infinity);

export function createCooling(p) {
  const s = { T: p.airT, boiled: 0, q: 0, boiling: false };
  s.step = (heat, v, dt) => {
    s.q = uaAt(p, v) * (s.T - p.airT);
    const net = heat - s.q;
    s.boiling = s.T >= 100 && net > 0;
    if (s.boiling) s.boiled += net / LATENT * dt; else s.T = Math.min(100, s.T + net / (p.water * CP) * dt);
    return s;
  };
  s.reset = () => { s.T = p.airT; s.boiled = 0; s.q = 0; s.boiling = false; };
  return s;
}
