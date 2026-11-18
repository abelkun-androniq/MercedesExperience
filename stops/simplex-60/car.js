// Mercedes-Simplex 60 PS touring limousine, 1904. Frame: mm, x forward, y left, z up; origin = front axle centre on the
// ground. Bore and stroke from the data sheet; engine position, conrod, cylinder spacing and body outline illustrative.
export default {
  slug: "simplex-60",
  title: "Nine litres, four cylinders",
  name: "Mercedes-Simplex 60 PS",
  year: 1904,
  summary: "The 9.2-litre, 60 hp Simplex: overhead inlet valves opened by the camshaft, and well over 100 km/h.",
  eyebrow: "Mercedes-Simplex 60 PS, 1904",
  lede: "Each of its four cylinders is 140 mm across: together over nine litres. The 60 PS opens its inlet valves from the camshaft, through pushrods, instead of letting the suction pull them open. Watch the four cylinders fire in turn, slowed right down.",
  orbit: { min: 0.5, max: 16 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[700, 500], [700, 1100], [-900, 1150], [-1100, 1450], [-3700, 1450], [-3900, 600], [-3400, 500]], y: [-800, 800] },   // bonnet and body
      { pts: [[-1100, 1450], [-1300, 2350], [-3700, 2350], [-3700, 1450]], y: [-760, 760] },                                         // limousine top
      { torus: { R: 400, r: 70, pos: [0, 700, 470], rot: [90, 0, 0] }, mirror: true },                                               // wheels
      { torus: { R: 400, r: 70, pos: [-2850, 700, 470], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Red 1904 Mercedes-Simplex 60 PS touring limousine in the Mercedes-Benz Museum, seen from the right rear",
    cam: { c: [-4096, -4787.5, 1934.4], yaw: 1.1654, pitch: -0.1971, roll: -0.0322, f: 924.6 }, // tools/photo-fits/simplex-60.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes_60_PS_1904_Simplex_Reiselimousine_RSideRear_MBMuse_9June2013_(14796966880).jpg" },
  },
  components: [
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [1.6, 2, 1.8], target: [-0.1, 0, 0.8] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "9.2-litre four · overhead inlet valves · firing order 1-3-4-2",
        order: [1, 3, 4, 2], bore: 140, stroke: 150, rod: 320,                    // rod illustrative
        xs: [330, 150, -30, -210], crankZ: 600, lean: 0,                            // positions illustrative
        valvetrain: "ohv", ignition: "spark", fuel: "carb", crankcase: "open",
        speed: { min: 5, max: 40, value: 15 },
      },
      talk: [
        "Four cylinders of 140 mm bore and 150 mm stroke: 9.2 litres, giving 60 hp at little more than 1,000 rpm. With its light body the racing version reached over 100 km/h.",
        "Earlier engines let the inlet valve open by suction, held shut only by a weak spring. The 60 PS opens it from the camshaft, through a pushrod and rocker, so the cylinder fills properly at speed.",
        "It kept the layout of the first Mercedes of 1900: engine at the front under a low bonnet, honeycomb radiator, pressed-steel frame and a gate gearbox, a pattern cars kept for decades.",
        "This one carries a tall touring-limousine body: room to stand up inside, for travelling in comfort.",
      ],
    },
  ],
  note: "The Simplex name stood for simple driving: the 1902 range was meant to be easy to handle compared with its predecessors.",
  unverified: [
    "Engine position in the car, cylinder spacing and conrod length",
    "Valve gear drawn as overhead valves for both (the 60 PS had overhead inlet and side exhaust valves)",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Legend 2",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Simplex", url: "https://en.wikipedia.org/wiki/Mercedes-Simplex" },
  ],
};
