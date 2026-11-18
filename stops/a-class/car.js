// Mercedes-Benz A-Class (W 168), 1997–2004. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Wheelbase and body size from the data sheet; engine block size and position, ramp angle and crash forces illustrative.
export default {
  slug: "a-class",
  title: "The engine goes under",
  name: "Mercedes-Benz A-Class",
  year: 1997,
  summary: "A short car with a long crumple path: its sandwich floor lets the engine slide underneath the passengers in a frontal crash.",
  eyebrow: "Mercedes-Benz A 160, 1997",
  lede: "The A-Class is barely 3.6 metres long, leaving little room for a crumple zone. So its floor is a double layer with the engine and gearbox partly below it, tilted. Crash it and watch the engine slide down and under the cell instead of into it.",
  orbit: { min: 0.5, max: 14 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[780, 300], [800, 700], [450, 900], [-300, 1050], [-2700, 1050], [-2800, 800], [-2780, 300]], y: [-860, 860] },   // body
      { pts: [[-300, 1050], [-850, 1560], [-2400, 1560], [-2750, 1050]], y: [-760, 760] },                                         // roof and glass
      { torus: { R: 240, r: 65, pos: [0, 740, 300], rot: [90, 0, 0] }, mirror: true },                                           // wheels
      { torus: { R: 240, r: 65, pos: [-2423, 740, 300], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 2133,
    alt: "Silver 1998 Mercedes-Benz A 160 in the Mercedes-Benz Museum, seen from above at the front right",
    cam: { c: [2221.4, -1494.1, 2179.5], yaw: 2.6093, pitch: -0.5993, roll: 0.2785, f: 1731.9 }, // tools/photo-fits/a-class.json
    credit: { author: "Nathanael Burton", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes_Benz_A_160,_Mercedes_Benz_Museum.jpg" },
  },
  components: [
    {
      id: "crash", label: "Sandwich floor", subsystem: "crumple-zone",
      view: { pos: [2.2, -4.2, 2], target: [-0.7, 0, 0.6] },
      ghost: { fill: 0, edge: 0 },
      params: {
        label: "Frontal crash into a rigid wall",
        mass: 1150, speed: { min: 20, max: 65, value: 50 }, slow: 40,                                            // mass ≈ kerb weight + driver
        cases: [
          { id: "sandwich", label: "Engine slides under the floor", slide: true, zone: { type: "crumple", force: 240000, length: 0.55, ramp: 0.06 }, cellK: 8000000 },   // illustrative
          { id: "blocked", label: "Engine pushed into the cell", zone: { type: "crumple", force: 260000, length: 0.3, ramp: 0.06 }, cellK: 3000000 },                  // illustrative
        ],
        folds: 5,
        body: { bumper: 780, firewall: -350, cellRear: -2500, tail: -2780, w: 860, sill: 420, belt: 1050, roof: 1560 },   // section positions illustrative
        wheels: { front: 0, rear: -2423, R: 300 },
        engine: { front: 600, back: -150, z0: 230, z1: 640, w: 320, ramp: 28 },                                         // illustrative
      },
      talk: [
        "A short car has a short front, and a short crumple zone stops the car abruptly. The A-Class answers with a floor of two layers: the passengers sit high, on top of it, with the engine and gearbox mounted low and leaning forward in front of and partly beneath it.",
        "In a hard frontal crash the engine block cannot be squeezed. On a conventional layout it is pushed straight back against the bulkhead and into the footwell.",
        "Here it meets a sloping guide and slides down and under the floor, so the front keeps folding over its full length and the cell stays whole.",
        "The high seating also puts the occupants above the line of a car hitting the side.",
      ],
    },
  ],
  note: "Shown as one mass with a folding front: the engine's path is drawn to show the principle, not taken from Mercedes-Benz crash tests.",
  unverified: [
    "Engine block size, position and the slope it slides down",
    "Crash forces, crumple lengths and cell stiffness",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Legend 6",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz A-Class (W168)", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_A-Class_(W168)" },
  ],
};
