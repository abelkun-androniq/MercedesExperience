// Mercedes-Benz ML 320 (W 163), 1997, the “Jurassic Park” car. Frame: mm, x forward, y left, z up; origin = front axle
// centre on the ground. Wheelbase and track from the data sheet; wheel loads, drive force, brake force, slope resistance
// and grip figures illustrative.
export default {
  slug: "ml320",
  title: "Brakes instead of locks",
  name: "Mercedes-Benz ML 320 “Jurassic Park”",
  year: 1997,
  summary: "The first M-Class, which made its debut in a dinosaur film: permanent four-wheel drive whose brakes stop a wheel from spinning.",
  eyebrow: "Mercedes-Benz ML 320, 1997",
  lede: "The M-Class has three open differentials and no locks. When a wheel starts to spin, its brake grips it, and the differential passes the torque across to the wheel that still has grip. Put wheels on ice and switch the system on.",
  orbit: { min: 0.5, max: 16 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[850, 400], [900, 900], [300, 1100], [-800, 1150], [-3700, 1150], [-3790, 450]], y: [-916, 916] },   // body
      { pts: [[-800, 1150], [-1350, 1780], [-3600, 1780], [-3720, 1150]], y: [-800, 800] },                         // roof and glass
      { torus: { R: 280, r: 95, pos: [0, 782, 370], rot: [90, 0, 0] }, mirror: true },                             // wheels
      { torus: { R: 280, r: 95, pos: [-2820, 782, 370], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 799,
    alt: "Camouflage-painted Mercedes-Benz ML 320 from the film “The Lost World: Jurassic Park”, seen from the left rear",
    cam: { c: [-5571.8, 2822.1, 1272.5], yaw: -0.7218, pitch: -0.0784, roll: -0.0266, f: 1283.1 }, // tools/photo-fits/ml320.json
    credit: { author: "Alexander Migl", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_ML_320_Jurassic_Park_IMG_0887.jpg" },
  },
  components: [
    {
      id: "drive", label: "4ETS traction", subsystem: "four-wheel-drive",
      view: { pos: [-1.4, -3.6, 7.2], target: [-1.4, 0, 0] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "Climbing a slope, seen from above",
        front: 0, rear: -2820, halfTrack: 782, wheelR: 370,
        force: 12000, normal: 5000, resist: 3000,                                            // illustrative
        surfaces: [
          { id: "dry", label: "Dry track", mu: [0.8, 0.8, 0.8, 0.8] },
          { id: "one", label: "One rear wheel on ice", mu: [0.8, 0.8, 0.1, 0.8] },
          { id: "diagonal", label: "Ice under two diagonal wheels", mu: [0.1, 0.8, 0.8, 0.1] },
          { id: "three", label: "Three wheels on ice", mu: [0.1, 0.8, 0.1, 0.1] },
        ],
        cases: [
          { id: "open", label: "Open differentials" },
          { id: "ets", label: "4ETS: brakes the spinning wheel", brake: 2500 },               // brake force illustrative
        ],
      },
      talk: [
        "Permanent four-wheel drive through three open differentials: front, centre and rear. On good ground they let every wheel turn at its own speed, so the car corners without strain.",
        "But an open differential always splits the torque equally, so a single wheel on ice caps the drive of everything connected to it, and the car stops with that wheel spinning.",
        "4ETS, the electronic traction system, watches the wheel speeds. When one wheel spins, it brakes that wheel: the brake now holds back what the ice cannot, so the differential can send the same torque to the wheel opposite, which grips.",
        "It does with the ABS sensors and the brakes what locking differentials do mechanically, at the cost of the drive the brakes hold back. This car is one of those made for the film “The Lost World: Jurassic Park” of 1997.",
      ],
    },
  ],
  note: "The brake force, grip and slope are round figures: they show which wheels drive, not the M-Class's real climbing ability.",
  unverified: [
    "Wheel loads, drive force, brake force, slope resistance and grip figures",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Collection 4",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz M-Class (W163)", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_M-Class_(W163)" },
  ],
};
