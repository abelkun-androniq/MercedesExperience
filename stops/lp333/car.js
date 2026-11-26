// Mercedes-Benz LP 333, 1958–1961, the “millipede”. Frame: mm, x forward, y left, z up; origin = FIRST front axle centre
// on the ground. Axle spacings, tracks, wheel size and steering arm geometry illustrative.
export default {
  slug: "lp333",
  title: "Two axles to steer",
  name: "Mercedes-Benz LP 333",
  year: 1959,
  summary: "A cab-over lorry with two steered front axles, built to spread its load under new German axle-load limits.",
  eyebrow: "Mercedes-Benz LP 333, 1959",
  lede: "New rules in 1958 limited how much each axle of a lorry could carry. Mercedes-Benz's answer: a second steered axle at the front. For the tyres not to scrub, the second axle must steer less than the first. Turn the wheel and watch every wheel's axis meet at one point.",
  orbit: { min: 0.5, max: 26 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[1300, 900], [1350, 2700], [-400, 2750], [-500, 1400], [-6900, 1400], [-6900, 900]], y: [-1250, 1250] },   // cab and platform
      { torus: { R: 400, r: 120, pos: [0, 1000, 520], rot: [90, 0, 0] }, mirror: true },                                 // wheels
      { torus: { R: 400, r: 120, pos: [-1400, 1000, 520], rot: [90, 0, 0] }, mirror: true },
      { torus: { R: 400, r: 120, pos: [-5200, 900, 520], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Green 1959 Mercedes-Benz LP 333 flatbed lorry with two front axles in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [3937.1, 4665.2, 1663.9], yaw: -2.4211, pitch: -0.0186, roll: -0.0407, f: 1149.1 }, // tools/photo-fits/lp333.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_LP_333_1959_Pritschenwagen_LSideFront_MBMuse_9June2013_(14983587385).jpg" },
  },
  components: [
    {
      id: "steer", label: "Twin front axles", subsystem: "twin-steer",
      prompt: "Set the steering slider to 20° and hold it there. Then press “Second axle fixed”. Before you look: which tyres will be scrubbed sideways?",
      answer: "The second axle's pair, picked out in colour. Fixed straight, they point away from their circles round the turning centre, so the lorry drags them sideways, here at about 14° of slip. Steered by the drag link, they point along their circles and roll.",
      view: { pos: [-2.8, -4.5, 10.5], target: [-2.8, 0, 0] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "Steering, seen from above",
        rear: -5200, wheelbase: 5200, second: 3800,                                 // illustrative
        kingpinHalf: 900, arm: 250, halfTrack: 1000, wheelR: 520, rearHalfTrack: 900, maxSteer: 35,   // illustrative
      },
      talk: [
        "German rules of the late 1950s cut the load each axle of a lorry could carry. To keep the payload, the LP 333 put two steered axles under its cab: three axles in all, which earned it the nickname “Tausendfüßler”, millipede.",
        "For the tyres to roll without scrubbing, every wheel's axis must point to the same turning centre on the line of the rear axle. The second axle is closer to that line, so its wheels must turn less.",
        "A drag link between the two axles' steering arms is proportioned to turn the second axle by just the right lesser angle. Each axle is also a double-pivot trapezoid, so its inner wheel turns more than its outer one.",
        "Fix the second axle straight and its tyres are dragged sideways through every turn, wearing them and fighting the steering.",
      ],
    },
  ],
  note: "Shown from above with idealised trapezoids; the drag link is drawn between the left steering arms.",
  unverified: [
    "Axle spacings, tracks, wheel size and steering arm geometry",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Collection 2",
  ],
  sources: [
    { label: "Wikipedia (German): Mercedes-Benz LP 333", url: "https://de.wikipedia.org/wiki/Mercedes-Benz_LP_333" },
  ],
};
