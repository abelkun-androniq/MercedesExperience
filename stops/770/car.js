// Mercedes-Benz 770 “Grosser Mercedes” (W 07), 1930–1938, Cabriolet F of Kaiser Wilhelm II. Frame: mm, x forward, y left,
// z up; origin = front axle centre on the ground. Bore and stroke from the data sheet; engine position, conrod, body
// outline and the supercharger's gearing illustrative.
export default {
  slug: "770",
  title: "Two sparks per cylinder",
  name: "Mercedes-Benz 770 “Grosser Mercedes”",
  year: 1932,
  summary: "The 7.7-litre straight-eight of the largest Mercedes-Benz of its time: two spark plugs in every cylinder, and a supercharger on full throttle.",
  eyebrow: "Mercedes-Benz 770, 1932",
  lede: "Built for heads of state, the 770 had to run, whatever happened. Each of its eight cylinders has two spark plugs, fed by two separate ignition systems. Watch both spark as each cylinder fires; then floor the throttle to bring in the supercharger.",
  orbit: { min: 0.5, max: 18 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[750, 450], [800, 1100], [-700, 1150], [-2300, 1100], [-4600, 1050], [-5300, 850], [-5300, 450]], y: [-920, 920] },   // body and bonnet
      { pts: [[-1600, 1150], [-1900, 1700], [-2050, 1700], [-1800, 1150]], y: [-760, 760] },                                         // windscreen
      { torus: { R: 330, r: 100, pos: [0, 780, 440], rot: [90, 0, 0] }, mirror: true },                                             // wheels
      { torus: { R: 330, r: 100, pos: [-3750, 790, 440], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Grey 1932 Mercedes-Benz 770 “Grosser Mercedes” Cabriolet F of Kaiser Wilhelm II in the Mercedes-Benz Museum, seen from the front",
    cam: { c: [3795.9, 928, 946.5], yaw: 3.3599, pitch: -0.0009, roll: 0.0678, f: 1325.3 }, // tools/photo-fits/770.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_770_1932_Gro%C3%9Fer_Mercedes_Cabriolet_F_Kaiser_Wilhelm_II_LSideFront_MBMuse_9June2013_(14960618556).jpg" },
  },
  components: [
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [1.3, 1.9, 1.7], target: [-0.3, 0, 0.75] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "7.7-litre straight-eight · two plugs per cylinder · firing order 1-6-2-5-8-3-7-4",
        order: [1, 6, 2, 5, 8, 3, 7, 4], bore: 95, stroke: 135, rod: 280,               // rod illustrative
        xs: [250, 135, 20, -95, -210, -325, -440, -555], crankZ: 480, lean: 0,          // positions illustrative
        valvetrain: "ohv", ignition: "spark", plugs: 2, fuel: "carb", crankcase: "open",
        speed: { min: 5, max: 60, value: 18 }, realRpm: 2800,
      },
      talk: [
        "The 770 was the largest Mercedes-Benz of its day, built in small numbers for heads of state, royalty and the very wealthy. This Cabriolet F was made for the former Kaiser Wilhelm II, then living in exile in the Netherlands.",
        "Eight cylinders in a row, 95 mm across and 135 mm stroke: 7.7 litres. In a straight-eight, one cylinder fires every quarter turn, so the drive is smooth and even.",
        "Each cylinder has two spark plugs. One set is fired by a magneto, the other by a battery and coil. Lit at two points, the mixture burns through in about half the time, and if either system fails, the engine keeps running on the other.",
      ],
    },
    {
      id: "blower", label: "Supercharger", subsystem: "roots-blower",
      view: { pos: [1.4, 0.9, 1.5], target: [-0.35, 0.02, 0.7] },
      ghost: { fill: 0, edge: 0 },
      params: {
        blower: { ratio: 2.6, engageAt: 0.98, tauUp: 0.25, tauDown: 0.7, boostMax: 0.4, psAtmo: 150, psBoost: 200 },   // ratio, timing and boost illustrative
        order: [1, 6, 2, 5, 8, 3, 7, 4], engineLabel: "7.7-litre straight-eight", offset: [0, 0, 0.42],
      },
      talk: [
        "Like the SSK's, the 770's Roots supercharger runs only when it is needed. Push the accelerator to the floor and a clutch couples it to the crankshaft; it then blows air into the carburettor under pressure.",
        "More air per stroke means more fuel can burn: 150 hp without the blower, 200 hp with it. Ease off and the clutch lets it go again, saving the engine and the fuel.",
      ],
    },
  ],
  note: "Several 770s survive; the museum's is the Cabriolet F that belonged to Wilhelm II.",
  unverified: [
    "Engine position in the car and conrod length",
    "Valve gear drawn as overhead valves with pushrods",
    "Supercharger gearing, engagement and boost (the 150 and 200 hp are quoted)",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Legend 3",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz 770", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_770" },
  ],
};
