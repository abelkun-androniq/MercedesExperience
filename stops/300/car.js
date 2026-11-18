// Mercedes-Benz 300 (W 186) “Adenauer”, 1951–1957. Frame: mm, x forward, y left, z up; origin = front axle centre on the
// ground. Wheelbase, tracks and tyre size from the data sheet; corner masses, spring rates and the levelling motor's rate
// illustrative.
export default {
  slug: "300",
  title: "Level at the touch of a switch",
  name: "Mercedes-Benz 300",
  year: 1952,
  summary: "Germany's post-war flagship, the “Adenauer”, whose rear suspension could be stiffened up for a full load by an electric motor.",
  eyebrow: "Mercedes-Benz 300, 1952",
  lede: "Load a car with passengers and luggage and its rear sinks. The 300 has an extra torsion bar across its rear axle, and an electric motor can wind it up until the car sits level again. Load it and watch the rear come back up.",
  orbit: { min: 0.5, max: 16 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[950, 330], [980, 800], [650, 950], [-700, 1000], [-3650, 980], [-4100, 850], [-4150, 330]], y: [-920, 920] },   // body
      { pts: [[-700, 1000], [-1150, 1600], [-3000, 1600], [-3500, 1000]], y: [-800, 800] },                                     // roof and glass
      { torus: { R: 275, r: 85, pos: [0, 740, 360], rot: [90, 0, 0] }, mirror: true },                                         // wheels
      { torus: { R: 275, r: 85, pos: [-3050, 762, 360], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Red 1952 Mercedes-Benz 300 “Adenauer” in the Mercedes-Benz Museum, seen from the front right",
    cam: { c: [3364.2, -2563.3, 1657.6], yaw: 2.5809, pitch: -0.1969, roll: -0.0778, f: 1289.9 }, // tools/photo-fits/300.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_300_1952_RSideFront_MBMuse_9June2013_(14983272212).jpg" },
  },
  components: [
    {
      id: "levelling", label: "Rear levelling", subsystem: "air-suspension",
      view: { pos: [2, -5.6, 2], target: [-1.5, 0, 0.5] },
      ghost: { fill: 0.06, edge: 0.5 },
      params: {
        label: "Loading the car", level: "torsion", motorRate: 300,                          // motor rate illustrative
        front: 0, wheelbase: 3050, halfTrack: 750, wheelR: 360,
        corners: { front: { mass: 460, extra: 40 }, rear: { mass: 410, extra: 140 } },         // illustrative
        air: { area: 0.012, volume: 0.003, n: 1.3 },                                            // unused here (no bellows)
        steel: { front: 30000, rear: 24000 }, damping: 2500,                                   // illustrative
        bellows: { r: 90, h: 220, z0: 260 },
        load: { heads: [[-1300, -400, 1150], [-2350, 400, 1120], [-2350, -400, 1120]], boot: [-3800, 700] },
      },
      talk: [
        "Konrad Adenauer, West Germany's first chancellor, was driven in a series of these 300s, which gave the car its nickname. It was the largest and fastest German production car of its day.",
        "At the rear sits a swing axle on coil springs. With a full load the rear sinks, the headlamps point up, and the rear wheels lean in.",
        "An extra torsion bar runs across the rear axle. At the touch of a switch on the dashboard, an electric motor twists it further, and the added preload lifts the rear back to its normal height. Here it is shown acting on its own until the car is level.",
        "The bar carries the extra load but adds no stiffness, so the ride frequency still drops as the load grows. Air springs avoid that: pumped up for the load they also get stiffer (see the 300 SEL 6.3).",
      ],
    },
  ],
  note: "The levelling here is proportional and automatic; on the car the driver switched the motor on. Masses and spring rates are round figures.",
  unverified: [
    "Corner masses, spring rates and the motor's preload rate",
    "Operation: a dashboard switch (shown as automatic)",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Legend 4",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz W186", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_W186" },
  ],
};
