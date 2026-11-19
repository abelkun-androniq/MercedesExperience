// Mercedes-Benz ESF 22 experimental safety vehicle, 1973. Frame: mm, x forward, y left, z up; origin = front axle centre
// on the ground. Body size approximate (S-Class-sized saloon); the braking model's wheel, brake and controller illustrative.
export default {
  slug: "esf22",
  title: "Brakes that let go",
  name: "Mercedes-Benz ESF 22",
  year: 1973,
  summary: "An experimental safety car carrying airbags, belt tensioners and anti-lock brakes years before they reached production.",
  eyebrow: "Mercedes-Benz ESF 22, 1973",
  lede: "Brake hard enough and a wheel stops turning: the tyre slides, grips less, and no longer steers. The anti-lock system on this test car lets the brake off just before that happens, then on again, many times a second. Brake from 100 km/h and compare the two stops.",
  orbit: { min: 0.5, max: 14 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[1050, 280], [1100, 680], [700, 820], [-700, 900], [-3500, 900], [-3950, 840], [-4000, 600], [-3950, 280]], y: [-900, 900] },   // body
      { pts: [[-700, 900], [-1250, 1420], [-2900, 1420], [-3450, 900]], y: [-760, 760] },                                                       // roof and glass
      { torus: { R: 250, r: 75, pos: [0, 760, 325], rot: [90, 0, 0] }, mirror: true },                                                         // wheels
      { torus: { R: 250, r: 75, pos: [-2900, 760, 325], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "White 1973 Mercedes-Benz ESF 22 experimental safety vehicle in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [1847.1, 2304, 1251.1], yaw: -2.3638, pitch: -0.2473, roll: 0.0009, f: 804 }, // tools/photo-fits/esf22.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_ESF-22_1973_Experimentier-Sicherheits-Fahrzeug_LSideFront_MBMuse_9June2013_(14980470361).jpg" },
  },
  components: [
    {
      id: "abs", label: "Anti-lock brakes", subsystem: "abs",
      view: { pos: [2.2, -2.6, 1.3], target: [-0.3, 0.6, 0.35] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Emergency stop, front left wheel",
        wheel: { mass: 450, inertia: 1.2, wheelR: 0.32, torque: 2800, rise: 6 },   // corner mass, wheel inertia, brake torque, pressure rise: illustrative
        abs: { release: 0.2, apply: 0.08 },                                         // controller slip thresholds: illustrative
        speed: 100, slow: 6, at: [0, 760],
        surfaces: [{ id: "dry", label: "Dry road" }, { id: "wet", label: "Wet road" }],
      },
      real: {   // the part in real life (not this car)
        src: "parts/abs-sensor.jpg", w: 800, h: 598,
        alt: "A cylindrical sensor with a cable, mounted next to a toothed ring behind a brake disc",
        caption: "An ABS wheel-speed sensor (here on a motorcycle) beside the toothed ring that turns with the wheel. Each passing tooth gives a pulse, so the controller knows how fast every wheel turns.",
        credit: { author: "NSX-Racer", license: "CC BY-SA 2.5", url: "https://commons.wikimedia.org/wiki/File:ABS-Sensor.jpg" },
      },
      talk: [
        "A tyre grips best when it turns a little slower than the road passes under it: about 10 to 20 % slip. A locked wheel slides at 100 % slip, with less grip, and it can no longer take the side force that steers the car.",
        "The anti-lock system watches each wheel's speed. When one slows too quickly, it is about to lock: a valve holds back the brake pressure until the wheel speeds up again, then lets it build once more.",
        "The cycle repeats several times a second, keeping the tyre near its best grip. The stop is shorter on dry and wet roads, and the driver can still steer round an obstacle.",
        "Mercedes-Benz and Bosch worked on anti-lock brakes through the 1970s. Test cars like this ESF 22 carried them years before the system went on sale in the S-Class in 1978.",
      ],
    },
  ],
  note: "ESF stands for Experimental-Sicherheits-Fahrzeug, experimental safety vehicle: Mercedes-Benz built a series of them in the early 1970s for an international safety programme.",
  unverified: [
    "Wheel load, wheel inertia, brake torque and the controller's slip thresholds",
    "Tyre curves (textbook Burckhardt fits for dry and wet roads)",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Legend 5",
  ],
  sources: [
    { label: "Wikipedia: Anti-lock braking system", url: "https://en.wikipedia.org/wiki/Anti-lock_braking_system" },
    { label: "Wikipedia: Experimental Safety Vehicle", url: "https://en.wikipedia.org/wiki/Experimental_Safety_Vehicle" },
  ],
};
