// Mercedes-Benz 180 “Ponton” (W 120), 1953–1962. Frame: mm, x forward, y left, z up; origin = front axle centre on the
// ground. Wheelbase and body size from the data sheet; the shell is drawn as a truss of its main members at illustrative
// positions (stations from the bumper to the tail), with an illustrative member stiffness.
export default {
  slug: "ponton",
  title: "The body carries itself",
  name: "Mercedes-Benz 180 “Ponton”",
  year: 1955,
  summary: "The first Mercedes-Benz saloons with a self-supporting body: floor, pillars and roof welded into one shell that carries the loads.",
  eyebrow: "Mercedes-Benz 180, 1955",
  lede: "Older cars put a body on a separate frame. The Ponton's body is the frame: sills, pillars and roof are welded into one shell. Twist it, as a car does when one wheel rides up a kerb, and compare it with a shallow frame under a body that carries nothing.",
  orbit: { min: 0.5, max: 14 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[800, 300], [820, 720], [500, 860], [-500, 900], [-3500, 900], [-3685, 750], [-3650, 300]], y: [-870, 870] },   // body
      { pts: [[-500, 900], [-950, 1550], [-2600, 1550], [-3100, 900]], y: [-750, 750] },                                       // roof and glass
      { torus: { R: 255, r: 80, pos: [0, 715, 340], rot: [90, 0, 0] }, mirror: true },                                         // wheels
      { torus: { R: 255, r: 80, pos: [-2650, 737, 340], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Black 1955 Mercedes-Benz 180 “Ponton” in the Mercedes-Benz Museum, seen from the front right",
    cam: { c: [2138.9, -1956.4, 1279.3], yaw: 2.4964, pitch: -0.1947, roll: -0.1464, f: 961.4 }, // tools/photo-fits/ponton.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_180_1955_Ponton_RSideFront_MBMuse_9June2013_(14980535181).jpg" },
  },
  components: [
    {
      id: "shell", label: "Unit body", subsystem: "space-frame",
      view: { pos: [1.6, -4, 2.8], target: [-1.4, 0, 0.6] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "Twisting the body",
        stations: [                                                                     // positions illustrative
          { x: 700, w: 560, z: [280, 400, 800] },
          { x: -350, w: 760, z: [250, 380, 1400] },
          { x: -1400, w: 800, z: [250, 380, 1450] },
          { x: -2350, w: 790, z: [250, 380, 1400] },
          { x: -2950, w: 760, z: [280, 400, 900] },
          { x: -3550, w: 650, z: [300, 420, 850] },
        ],
        bays: [{ top: true }, { door: "high", top: true }, { door: "high", top: true }, { door: "high", top: true }, { top: true }],
        EA: 15750000, load: 3000, exaggerate: 8,                                       // member stiffness illustrative
        modes: { high: "Unit body: sides and roof carry the load", low: "Shallow frame: the body carries nothing" },
        compare: "Compared with the unit body",
      },
      talk: [
        "Until the early 1950s a Mercedes-Benz car was a body bolted onto a separate frame. The Ponton saloons of 1953 onwards have a self-supporting body: floor, sills, pillars and roof are welded into one shell that carries the loads itself.",
        "Twist it, as when one front wheel rides over a kerb: in a shell every panel and pillar takes part, so it barely deforms. A shallow frame under a body that carries nothing twists several times as far.",
        "The shell is drawn here as a truss of its main members, coloured by force; the bending is hugely exaggerated.",
        "“Ponton” (pontoon) describes the smooth, slab-sided body that takes in the wings instead of letting them stand out. The unit body also saved weight and made more room inside.",
      ],
    },
  ],
  note: "The research notes name the 220 of 1954; the photo shows a 1955 180, the first Ponton model.",
  unverified: [
    "Truss stations, sizes and member stiffness",
    "Which Ponton is on show (the photo is a 1955 180; the research notes name the 220)",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Legend 4",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz W120", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_W120" },
    { label: "Wikipedia: Mercedes-Benz Ponton", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_Ponton" },
  ],
};
