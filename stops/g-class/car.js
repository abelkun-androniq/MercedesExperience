// Mercedes-Benz 300 GD (W 460) “Otto”, Gunther Holtorf's round-the-world G-Class. Frame: mm, x forward, y left, z up;
// origin = front axle centre on the ground. Wheelbase and track from the data sheet; wheel loads, drive force, the slope's
// resistance and the grip figures illustrative.
export default {
  slug: "g-class",
  title: "Lock by lock",
  name: "Mercedes-Benz 300 GD “Otto”",
  year: 1988,
  summary: "The G-Class that Gunther Holtorf drove for 26 years around the world: four-wheel drive engaged by hand, and differential locks front and rear.",
  eyebrow: "Mercedes-Benz 300 GD, 1988",
  lede: "An open differential always sends the same torque to both sides, so one wheel on ice limits its partner. The G-Class can lock its axles together and then lock each differential. Put two wheels on ice and add one lock at a time until the car climbs.",
  orbit: { min: 0.5, max: 16 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[800, 400], [820, 1050], [-400, 1100], [-650, 1950], [-3650, 1950], [-3700, 400]], y: [-850, 850] },   // body
      { torus: { R: 285, r: 95, pos: [0, 715, 380], rot: [90, 0, 0] }, mirror: true },                              // wheels
      { torus: { R: 285, r: 95, pos: [-2850, 715, 380], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 799,
    alt: "Blue Mercedes-Benz 300 GD “Otto”, Gunther Holtorf's round-the-world car, with its roof rack and boxes, seen from the front right",
    cam: { c: [2109.2, -3637.6, 1745.4], yaw: 2.2485, pitch: -0.1627, roll: -0.0265, f: 1259 }, // tools/photo-fits/g-class.json
    credit: { author: "Thilo Parg", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_300_GD_Otto_1.jpg" },
  },
  components: [
    {
      id: "drive", label: "Four-wheel drive and locks", subsystem: "four-wheel-drive",
      view: { pos: [-1.4, -3.6, 7.2], target: [-1.4, 0, 0] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "Climbing a slope, seen from above",
        front: 0, rear: -2850, halfTrack: 715, wheelR: 380,
        force: 15000, normal: 5000, resist: 3000,                                              // illustrative
        surfaces: [
          { id: "dry", label: "Dry track", mu: [0.8, 0.8, 0.8, 0.8] },
          { id: "one", label: "One rear wheel on ice", mu: [0.8, 0.8, 0.1, 0.8] },
          { id: "diagonal", label: "Ice under two diagonal wheels", mu: [0.1, 0.8, 0.8, 0.1] },
          { id: "three", label: "Three wheels on ice", mu: [0.1, 0.8, 0.1, 0.1] },
        ],
        cases: [
          { id: "rwd", label: "Rear-wheel drive", rearOnly: true },
          { id: "awd", label: "Four-wheel drive engaged", centre: true },
          { id: "rear", label: "+ rear lock", centre: true, rear: true },
          { id: "all", label: "+ front lock", centre: true, rear: true, front: true },
        ],
      },
      talk: [
        "An open differential lets the wheels on an axle turn at different speeds in a corner, but it always splits the torque equally. The wheel with the least grip sets the limit for both.",
        "On this W 460 the driver engages the front axle by hand. That joins the front and rear propeller shafts rigidly, like a locked centre differential: an axle with a wheel on ice can no longer rob the other.",
        "Then each axle's differential can be locked, rear first, then front: a locked axle turns as one shaft, and each wheel pushes as hard as its own grip allows. With all locks in, one wheel on dry ground can still move the car.",
        "Gunther Holtorf drove this 300 GD, “Otto”, through Africa, Asia and the Americas from 1989 to 2014, nearly 900,000 km. Later G-Classes (W 463, from 1990) have permanent four-wheel drive with three locking differentials.",
      ],
    },
  ],
  note: "Locked axles are hard to steer and wear their tyres on firm ground: the locks are for loose or slippery ground only.",
  unverified: [
    "Wheel loads, drive force, slope resistance and grip figures",
    "Differential locks fitted to this car",
    "Whether Otto is on display (the photo is from the 2019–20 exhibition “40 years of the G-Class”)",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Collection 3",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz G-Class", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_G-Class" },
    { label: "Wikipedia: Gunther Holtorf", url: "https://en.wikipedia.org/wiki/Gunther_Holtorf" },
  ],
};
