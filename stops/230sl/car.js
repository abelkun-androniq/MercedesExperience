// Mercedes-Benz 230 SL (W 113), 1963–1967. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Wheelbase, tracks and body size from the data sheet; crash-model forces, lengths and section positions illustrative.
export default {
  slug: "230sl",
  title: "A safe sports car",
  name: "Mercedes-Benz 230 SL",
  year: 1963,
  summary: "The first sports car with a rigid passenger cell and crumple zones front and rear, under the dished “pagoda” hardtop.",
  eyebrow: "Mercedes-Benz 230 SL, 1963",
  lede: "Under its elegant lines the 230 SL carries the safety body of the saloons: a stiff cell for the two occupants and a front that is meant to fold. Run it into a wall and watch the front take the energy while the cell stays whole.",
  orbit: { min: 0.5, max: 14 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[850, 420], [880, 600], [650, 760], [450, 780], [450, 330]], y: [-700, 700] },                                                  // nose (rounded corners)
      { pts: [[450, 330], [450, 780], [-600, 840], [-1700, 840], [-3350, 790], [-3430, 580], [-3380, 330]], y: [-860, 860] },               // body
      { pts: [[-600, 840], [-1000, 1290], [-1850, 1290], [-2150, 840]], y: [-700, 700] },                                                       // hardtop and glass
      { torus: { R: 255, r: 70, pos: [0, 742, 325], rot: [90, 0, 0] }, mirror: true },                                                         // wheels
      { torus: { R: 255, r: 70, pos: [-2400, 742, 325], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Champagne-coloured 1964 Mercedes-Benz 230 SL with its pagoda hardtop, in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [2707.8, 2052.7, 861.7], yaw: -2.5444, pitch: -0.0682, roll: 0.0277, f: 1170.6 }, // tools/photo-fits/230sl.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_230SL_1964_LFront_MBMuse_9June2013_(14797025828).jpg" },
  },
  components: [
    {
      id: "crash", label: "Safety body", subsystem: "crumple-zone",
      view: { pos: [2.4, -4.6, 2.2], target: [-0.9, 0, 0.6] },
      ghost: { fill: 0, edge: 0 },
      params: {
        label: "Frontal crash into a rigid wall",
        mass: 1300, speed: { min: 20, max: 65, value: 50 }, slow: 40,                                           // mass ≈ kerb weight + driver
        cases: [
          { id: "safe", label: "Safety body: crumple zone", zone: { type: "crumple", force: 260000, length: 0.55, ramp: 0.06 }, cellK: 8000000 },   // illustrative
          { id: "rigid", label: "Stiff front", zone: { type: "stiff", k: 2600000, length: 0.3 }, cellK: 2500000 },                                   // illustrative
        ],
        folds: 6,
        body: { bumper: 850, firewall: -350, cellRear: -1750, tail: -3430, w: 860, sill: 330, belt: 840, roof: 1290 },   // section positions illustrative
        wheels: { front: 0, rear: -2400, R: 325 },
      },
      talk: [
        "Béla Barényi's safety body, patented in the early 1950s and first built into the 1959 “Fintail” saloons, splits a car into a rigid passenger cell and deformable zones at the front and rear. The 230 SL of 1963 was the first sports car built that way.",
        "In a frontal crash the front folds up from the bumper backwards. It soaks up the energy over a long distance at a nearly constant force, so the cell, and the people in it, are slowed down less violently.",
        "Compare a stiff front: the car stops in a shorter distance, so the peak deceleration is far higher, and once the short front is used up the cell itself is pushed in.",
        "The removable hardtop dips in the middle, the “pagoda” shape that gave the car its nickname: the raised edges made room for tall side windows and stiffen the roof.",
      ],
    },
  ],
  note: "The crash is a single mass against two force laws: it shows the idea of the crumple zone, not the 230 SL's test results.",
  unverified: [
    "Crash forces, crumple length and cell stiffness",
    "Positions of the bumper, firewall and cell used by the crash model",
    "Ghost-body outline (traced from the data-sheet sizes and the photo)",
    "Room: Legend 5",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz W113", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_W113" },
    { label: "Wikipedia: Béla Barényi", url: "https://en.wikipedia.org/wiki/B%C3%A9la_Bar%C3%A9nyi" },
  ],
};
