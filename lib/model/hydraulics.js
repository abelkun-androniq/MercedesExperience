// Central hydraulics of the Mercedes-Benz 600: one pump, a gas-charged accumulator and a cylinder at each consumer.
// Pure: no DOM, no three.js. SI units, pressures in Pa. The accumulator's gas is squeezed as oil is pumped in, so its
// pressure rises with the oil stored (Boyle: p·V constant, isothermal). The pump runs until the pressure reaches pMax and
// starts again below pMin. A cylinder pushes with p·A and takes A·stroke of oil from the accumulator.
// sys = { acc: { gas (m³ of gas space when empty), precharge (Pa) }, pump: { flow (m³/s), pMax, pMin }, valve (m³/s, the
//   flow a consumer's valve lets through) }. A consumer: { bore (m), stroke (m), load (N against it) }.
export const oilAt = (acc, p) => (p <= acc.precharge ? 0 : acc.gas * (1 - acc.precharge / p));   // oil stored at pressure p
export const pressureAt = (acc, oil) => acc.precharge * acc.gas / (acc.gas - Math.min(oil, acc.gas * 0.95));
export const area = c => (Math.PI * c.bore ** 2) / 4;
export const force = (c, p) => p * area(c);

export function createSystem(sys) {
  const s = { oil: oilAt(sys.acc, sys.pump.pMax), pumping: false, moving: null, pos: new Map(), dir: new Map() };
  s.pressure = () => pressureAt(sys.acc, s.oil);
  // Start a consumer towards one end: dir +1 extends the cylinder, −1 lets it back.
  s.use = (id, c, dir) => { s.moving = { id, c }; s.dir.set(id, dir); if (!s.pos.has(id)) s.pos.set(id, dir > 0 ? 0 : 1); };
  s.step = dt => {
    const p = s.pressure();
    if (p < sys.pump.pMin) s.pumping = true;
    if (p >= sys.pump.pMax) s.pumping = false;
    if (s.pumping) s.oil += sys.pump.flow * dt;
    const m = s.moving;
    if (m) {
      const dir = s.dir.get(m.id), x = s.pos.get(m.id);
      // Extending against the load needs the pressure to beat it; letting back runs the oil to the tank instead.
      const can = dir < 0 || force(m.c, p) > m.c.load;
      if (can) {
        const dx = Math.min(sys.valve / area(m.c) * dt / m.c.stroke, dir > 0 ? 1 - x : x);
        s.pos.set(m.id, x + dir * dx);
        if (dir > 0) s.oil = Math.max(0, s.oil - area(m.c) * m.c.stroke * dx);
        if (dx <= 1e-9) s.moving = null;
      } else s.moving = null;
    }
    return s;
  };
  return s;
}
