// Mercedes-Benz 190 E (W201), 1984. Frame: mm, x forward, y left, z up; origin = rear axle centre at wheel-centre height.
// Hardpoints, rates and engine dimensions are illustrative (tuned for the right sign and size of the effect).
export default {
  slug: "190e",
  title: "Under the skin of the 190",
  name: "Mercedes-Benz 190 E (W201)",
  year: 1984,
  summary: "Five-link rear axle meeting a bump and a pothole, and the M102 four-cylinder turning over.",
  eyebrow: "Mercedes-Benz 190 E (W201), 1984",
  lede: "Two mechanisms of the same car, each shown working: the five-link rear axle meeting a bump and a pothole, and the M102 four-cylinder turning over. Scroll on: the museum photo then shows the axle in place on the real car.",
  frame: { origin: "rear", wheelbase: 2665, wheelR: 292, halfTrackFront: 714, halfTrackRear: 708 },
  ride: { ms: 300, mu: 40, ks: 24000, cs: 1700, kt: 190000 },
  orbit: { min: 1.2, max: 14 },
  sun: [-3, 4, 6],
  // Side profile 4420 long, 1678 wide, 1390 high.
  body: {
    ghost: [
      { pts: [[-990, -130], [-360, -130], [-360, 0], { arc: [0, 0, 360, 180, 0, 18] }, [360, -130], [2305, -130], [2305, 0],
        { arc: [2665, 0, 360, 180, 0, 18] }, [3025, -130], [3400, -130], [3435, 210], [3390, 470], [1980, 565], [-560, 615],
        [-985, 600], [-1015, 360], [-990, -130]], y: [-839, 839] },
      { pts: [[1980, 565], [1320, 1098], [140, 1098], [-560, 615], [1980, 565]], y: [-690, 690] },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "White 1984 Mercedes-Benz 190 E on display in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [6299.26, 4508.62, 1303.36], yaw: -2.4321, pitch: -0.1489, roll: 0.0486, f: 1656.0 }, // tools/photo-fits/190e.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_190E_1984_LSideFront_MBMuse_9June2013_(14797028608).jpg" },
  },
  components: [
    {
      id: "axle", label: "Five-link rear axle", subsystem: "linkage-suspension",
      view: { pos: [-3.6, 4.6, 1.5], target: [0.9, 0.0, -0.05] },
      ghost: { fill: 0.07, edge: 0.55 },
      params: {
        axle: "rear",
        label: "Left rear wheel · 25 km/h, shown 5× slower",
        readouts: ["travel", "load", "camber", "toe"],
        W0: [0, 720, 0],
        links: [
          { name: "Camber strut", tok: "--l1", b: [-80, 330, 150], c: [-50, 640, 150] },
          { name: "Pull strut", tok: "--l2", b: [230, 380, 170], c: [50, 640, 140] },
          { name: "Push strut", tok: "--l3", b: [280, 350, -60], c: [70, 655, -95] },
          { name: "Spring link", tok: "--l4", b: [-30, 300, -90], c: [-20, 665, -115] },
          { name: "Track rod", tok: "--l5", b: [-280, 240, -25], c: [-160, 650, -35] },
        ],
        legendTitle: "The five links",
        frame: [[[300, 300, 40], [-300, 300, 40], 18]],
        bracket: { y: 300, z: 40 },
        carrier: { style: "hub", disc: { r: 130, w: 12, y: 35 } },
        wheel: { type: "tyre", R: 235, r: 57, y: 50 },
        spring: { link: 3, at: 0.62, topOffset: [0, -20, 290], turns: 6.5, r: 50 },
        drive: { diff: [0, 0, 20], box: [220, 200, 180], inner: [0, 130, 20], outer: -60 },
        road: { x0: -5, x1: 8, seg: 520 },
        patch: [0.07, 0.065],
      },
      talk: [
        "Five rods, each loaded mostly along its own axis, locate the wheel carrier. The 190 was the first series car with this axle, in 1982.",
        "Watch the orange trace. Over the bump tyre load spikes; in the pothole it drops toward zero. Grip comes from that load, so a flat line is the goal.",
        "The body barely moves while the wheel does the work. That is the sprung versus unsprung mass split.",
      ],
    },
    {
      id: "engine", label: "M102 engine", subsystem: "inline-engine",
      view: { pos: [3.75, 1.25, 0.7], target: [2.7, 0.0, 0.12] },
      ghost: { fill: 0.05, edge: 0.55 },
      params: {
        label: "Four-stroke cycle · firing order 1-3-4-2",
        order: [1, 3, 4, 2],
        bore: 89, stroke: 80.25, rod: 136,         // rod length plausible, not factory data
        xs: [2851, 2754, 2657, 2560],               // cylinder 1 at the front
        crankZ: -30, lean: 15,                      // block leans 15° to the right: unverified
        valvetrain: "ohc", ignition: "spark", fuel: "carb",
        speed: { min: 5, max: 60, value: 20 },
      },
      talk: [
        "The 190 E's 2.0-litre M102: four cylinders in line, one overhead camshaft, cylinder 1 at the front.",
        "Firing order 1-3-4-2 gives one power stroke every 180° of crank, which keeps the crank torque even. Watch the orange flashes walk along the block.",
        "The block leans to the right so it fits under the 190's low bonnet line.",
      ],
    },
  ],
  note: "Geometry is illustrative: link hardpoints, engine dimensions and suspension rates are plausible values, not factory data.",
  unverified: ["All suspension hardpoints and spring, damper and tyre rates", "M102 conrod length and 15° block lean", "Ghost-body outline"],
  sources: [],
};
