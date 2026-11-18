// Mercedes-Benz 500 SL (R 129), 1991, Princess Diana's car. Frame: mm, x forward, y left, z up; origin = front axle centre
// on the ground. Wheelbase, track and body size from the data sheet; centre of gravity, outline heights and roll-bar
// spring illustrative (the spring is sized to the quoted 0.3 s).
export default {
  slug: "500sl-diana",
  title: "A bar that stands up",
  name: "Mercedes-Benz 500 SL",
  year: 1991,
  summary: "Princess Diana's R 129 roadster, whose roll bar springs up in 0.3 seconds when a sensor senses the car tipping over.",
  eyebrow: "Mercedes-Benz 500 SL, 1991",
  lede: "An open car has no roof to land on. The R 129 hides a roll bar behind its seats: a tilt sensor that feels the car going over releases a spring, and the hoop swings up before the car is on its side. Trip it on a kerb and watch, slowed down.",
  orbit: { min: 0.5, max: 14 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[920, 300], [950, 620], [600, 750], [-500, 850], [-3300, 850], [-3550, 780], [-3550, 300]], y: [-906, 906] },   // body
      { pts: [[-500, 850], [-1000, 1210], [-1100, 1210], [-700, 850]], y: [-680, 680] },                                       // windscreen
      { torus: { R: 255, r: 75, pos: [0, 766, 315], rot: [90, 0, 0] }, mirror: true },                                         // wheels
      { torus: { R: 255, r: 75, pos: [-2515, 762, 315], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Burgundy 1991 Mercedes-Benz 500 SL of Princess Diana in the Mercedes-Benz Museum, seen from the front right",
    cam: { c: [2231.3, -2125.2, 1424.1], yaw: 2.4987, pitch: -0.2646, roll: -0.028, f: 930.1 }, // tools/photo-fits/500sl-diana.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_500SL_1991_Princess_Diana_RSideFront_MBMuse_9June2013_(14960620456).jpg" },
  },
  components: [
    {
      id: "rollbar", label: "Pop-up roll bar", subsystem: "rollover",
      view: { pos: [-8.5, -1.6, 2.2], target: [-1.2, -0.9, 0.5] },
      ghost: { fill: 0.06, edge: 0.5 },
      params: {
        label: "Tripped by a kerb: rolling over sideways",
        device: "bar", car: { halfTrack: 0.765, cgHeight: 0.5, gyration: 0.6 },   // centre of gravity and gyration illustrative
        kick: 1.15, trigger: 22, slow: 3,                                          // sensor threshold illustrative
        section: [[880, 0], [890, 330], [905, 600], [860, 850], [640, 1180], [0, 1210]],   // outline heights illustrative
        heads: [350, 1185],
        bar: { x: -1600, z: 900, y: 520, length: 400, torque: 17, rate: 3, inertia: 0.5, travel: 1.45 },   // spring sized to the quoted time
        quoted: 0.3,
      },
      talk: [
        "A car tips over once its centre of gravity rolls past the outer wheels: here at about 57°. A sensor watches the tilt and how fast it is changing, and fires well before that.",
        "The roll bar lies folded behind the seats. A preloaded spring stands it up in about 0.3 seconds once a solenoid lets it go, long before the car lies on its side. It can also be raised with a switch.",
        "Upside down, the car then rests on the reinforced windscreen frame and the bar, which keep a space above the occupants' heads. Without the bar there is barely any.",
        "The R 129 SL of 1989 was the first car with an automatic roll bar. This one was Princess Diana's: a German car for a member of the royal family was a break with tradition.",
      ],
    },
  ],
  note: "The car is shown as a rigid outline rolling on flat ground after a kerb trip: an illustration of the principle, not a crash test.",
  unverified: [
    "Centre-of-gravity height, radius of gyration and the sensor's firing angle",
    "Outline heights, head height and roll-bar size",
    "Roll-bar spring and inertia (sized to the quoted 0.3 s)",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Collection 4 (the R 129 is also listed in Legend 6)",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz SL-Class (R129)", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_SL-Class_(R129)" },
  ],
};
