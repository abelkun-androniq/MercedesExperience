// Sliding-gear gearbox without synchromesh (Daimler/Panhard type). Pure: no DOM, no three.js.
// Two parallel shafts: the primary shaft (from the clutch) carries gears that slide along it, the secondary shaft fixed
// partners; the lever slides one pair into mesh. The secondary shaft drives the countershaft (bevel gear, differential)
// and from there the chains to the rear wheels. Reverse puts an idler between a pair, which turns the output backwards.
// box = { gears: [{ name, drive, driven, idler? }], final (secondary shaft turns per wheel turn), wheelR (m) }.
// g: index into box.gears, or null for neutral.

export function ratio(box, g) {
  const s = box.gears[g];
  return s ? (s.idler ? -1 : 1) * s.driven / s.drive : Infinity;
}

// Road speed (km/h, − = reversing) at primary-shaft speed rpm, and the primary speed a gear needs at a road speed.
export const roadSpeed = (box, g, rpm) => (Number.isFinite(ratio(box, g)) ? rpm / ratio(box, g) / box.final * 2 * Math.PI * box.wheelR * 0.06 : 0);
export const primaryRpmFor = (box, g, kmh) => kmh / 0.06 / (2 * Math.PI * box.wheelR) * box.final * ratio(box, g);

// Without synchromesh a pair slides into mesh cleanly only when both wheels' teeth already move at about the same speed.
// Mismatch of the pair's pitch-line speeds as a share of the faster one (0 = perfectly matched).
export function mismatch(box, g, primaryRpm, kmh) {
  const a = primaryRpm, b = primaryRpmFor(box, g, kmh), top = Math.max(Math.abs(a), Math.abs(b));
  return top < 15 ? 0 : Math.abs(a - b) / top;
}
