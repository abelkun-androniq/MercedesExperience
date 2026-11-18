// Mercedes-Benz SLS AMG (C 197), 2010. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Wheelbase, track and body size from the data sheet; centre of gravity, outline, door hinge geometry and the sensor's
// firing angle illustrative.
export default {
  slug: "sls",
  title: "Doors that can come off",
  name: "Mercedes-Benz SLS AMG",
  year: 2010,
  summary: "The gullwing revived, with a charge in each door hinge so the occupants can still get out of a car on its roof.",
  eyebrow: "Mercedes-Benz SLS AMG, 2010",
  lede: "Gullwing doors open upwards, and that is a problem once the car lies on its roof: they open towards the road. So the SLS fires a small charge in each hinge when its sensors detect a rollover, and the doors can be pushed out. Trip it on a kerb and watch, slowed down.",
  orbit: { min: 0.5, max: 14 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[1100, 280], [1130, 600], [650, 780], [-700, 930], [-3300, 930], [-3550, 850], [-3540, 300]], y: [-970, 970] },   // body
      { pts: [[-700, 930], [-1400, 1262], [-2300, 1262], [-3200, 930]], y: [-720, 720] },                                       // roof and glass
      { torus: { R: 260, r: 85, pos: [0, 841, 345], rot: [90, 0, 0] }, mirror: true },                                         // wheels
      { torus: { R: 260, r: 95, pos: [-2680, 826, 345], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 675,
    caption: "Photographed outside the museum",
    alt: "Silver Mercedes-Benz SLS AMG outside the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [2338.9, 5014.2, -45.6], yaw: -2.1139, pitch: 0.1989, roll: -0.0457, f: 1205.3 }, // tools/photo-fits/sls.json
    credit: { author: "Julian Herzog", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_C197_SLS_AMG_Mercedes-Benz_Museum_2012.jpg" },
  },
  components: [
    {
      id: "rollover", label: "Hinge bolts", subsystem: "rollover",
      view: { pos: [-8.6, -1.6, 2.2], target: [-1.3, -0.9, 0.5] },
      ghost: { fill: 0.06, edge: 0.5 },
      params: {
        label: "Tripped by a kerb: rolling over sideways",
        device: "bolts", car: { halfTrack: 0.83, cgHeight: 0.46, gyration: 0.62 },   // centre of gravity and gyration illustrative
        kick: 1.15, trigger: 22, slow: 3,                                             // sensor threshold illustrative
        section: [[960, 0], [965, 330], [970, 620], [900, 930], [700, 1180], [250, 1262]],   // outline illustrative
        heads: [360, 1150],
        doors: { x0: -2050, x1: -900, hinge: [150, 1255], sill: [960, 420] },             // illustrative
      },
      talk: [
        "The SLS took up the 300 SL's gullwing doors, hinged at the middle of the roof. They swing up and out, which needs room above the car.",
        "If the car ends up on its roof, that room is the road: the doors cannot open. Sensors that detect the rollover fire a small pyrotechnic charge in each hinge, which frees the doors so the occupants can push them out.",
        "The car tips over once its centre of gravity rolls past the outer wheels: low and wide as it is, here at about 61°.",
        "The SLS was the first car developed entirely by AMG, Mercedes-Benz's performance division.",
      ],
    },
  ],
  note: "The car is shown as a rigid outline rolling on flat ground after a kerb trip: an illustration of the principle, not a crash test. The photo was taken outside the museum in 2012.",
  unverified: [
    "Centre-of-gravity height, radius of gyration and the sensor's firing angle",
    "Outline heights, head height and door hinge geometry",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Legend 6",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz SLS AMG", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_SLS_AMG" },
  ],
};
