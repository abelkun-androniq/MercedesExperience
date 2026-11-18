// Cabin temperature of a coach in the sun, with and without air conditioning. Pure: no DOM, no three.js. SI units, °C.
// One lump of air and interior: heat comes in from the passengers, the sun through the glass and the outside air through
// the body; the air-conditioning unit takes out up to its cooling capacity, governed to a set temperature.
// c = { capacity (J/K of air and interior), ua (W/K through the body), sun (W through the glass), person (W each),
//   cooling (W, the unit's capacity), set (°C the unit aims at) }.
export const heatIn = (c, n, outside, T) => n * c.person + c.sun + c.ua * (outside - T);
export const steadyTemp = (c, n, outside) => outside + (n * c.person + c.sun) / c.ua;   // no air conditioning

export function createCabin(c, T0) {
  const s = { T: T0, cooling: 0 };
  s.step = (dt, { n, outside, ac }) => {
    const q = heatIn(c, n, outside, s.T);
    // Governed: the unit takes out what is needed to hold the set temperature, up to its capacity.
    s.cooling = ac ? Math.max(0, Math.min(c.cooling, q + (s.T - c.set) * c.capacity / 120)) : 0;
    s.T += (q - s.cooling) / c.capacity * dt;
    return s;
  };
  return s;
}
