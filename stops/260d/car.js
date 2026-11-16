// Mercedes-Benz 260 D (W 138), 1936. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Compression ratio, valve gear drawing, conrod, positions and dimensions are illustrative.
export default {
  slug: "260d",
  title: "The first diesel car",
  name: "Mercedes-Benz 260 D",
  year: 1936,
  summary: "The first series-production diesel passenger car: a 2.6-litre four with prechambers and Bosch injection, 45 PS.",
  eyebrow: "Mercedes-Benz 260 D (W 138), 1936",
  lede: "A diesel engine has no spark plug: squeezing the air makes it hot enough to light the fuel. Watch fuel spray into each prechamber just before the piston reaches the top, then slide the compression ratio.",
  frame: { origin: "front", wheelbase: 3050, wheelR: 360 },
  orbit: { min: 0.6, max: 14 },
  sun: [3, -3, 6],
  body: {
    ghost: [
      { pts: [[700, 400], [700, 950], [-300, 1050], [-1300, 1080], [-1500, 1600], [-2900, 1620], [-3600, 1300], [-4000, 600], [-4000, 400]], y: [-830, 830] },
      { torus: { R: 330, r: 70, pos: [0, 730, 360], rot: [90, 0, 0] }, mirror: true },
      { torus: { R: 330, r: 70, pos: [-3050, 730, 360], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  components: [
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [0.55, -0.95, 1.15], target: [-0.37, 0, 0.62] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Diesel four · firing order 1-3-4-2",
        order: [1, 3, 4, 2], bore: 90, stroke: 100, rod: 180,          // rod illustrative
        xs: [-200, -310, -420, -530], crankZ: 380, lean: 0,
        valvetrain: "ohv", ignition: "compression", fuel: "prechamber", crankcase: "open",
        compression: { value: 20.5, min: 6, max: 24 },                   // 20.5 : 1 illustrative (not confirmed)
        speed: { min: 5, max: 60, value: 20 }, realRpm: 3000,
      },
      talk: [
        "Shown at the Berlin motor show in February 1936: the first diesel car built in series, often used as a taxi.",
        "The OM 138 engine: four cylinders, 90 × 100 mm, 2,545 cm³, 45 PS at 3,000 rpm. Few petrol cars went further on a tank.",
        "Fuel is not injected into the cylinder itself but into a small prechamber in the head. It starts burning there and shoots into the cylinder, which made the diesel smooth and quiet enough for a car.",
        "Bosch supplied the injection pump. Slide the compression ratio down to petrol values and the air no longer gets hot enough to light the fuel.",
      ],
    },
  ],
  note: "Legend 3 is the room of diesel and supercharger: the 260 D and the SSK and 540 K blowers are two answers to the same question of more power and range.",
  unverified: ["Compression ratio 20.5 : 1", "Valve gear drawn as pushrod overhead valves", "Conrod length, cylinder spacing, engine position", "Wheelbase and ghost-body outline", "One source gives 3,200 rpm for the rated speed"],
  sources: [
    { label: "Wikipedia: Mercedes-Benz OM 138", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_OM_138" },
    { label: "Wikipedia: Mercedes-Benz 260 D", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_260_D" },
    { label: "ingenieur.de: Mercedes 260 D, the first diesel in a series car", url: "https://www.ingenieur.de/technik/fachbereiche/verkehr/mercedes-260-d-der-erste-dieselmotor-in-einem-serien-pkw/" },
  ],
};
