// Daimler motor carriage, 1886. Frame: mm, x forward, y left, z up; origin = REAR axle centre on the ground (the steering
// subsystem's frame). Bore and stroke from the museum's figures, wheelbase (1,300) from Wikipedia; tracks, wheel sizes,
// engine position and conrod illustrative.
export default {
  slug: "daimler-carriage",
  title: "A carriage without a horse",
  name: "Daimler motor carriage",
  year: 1886,
  summary: "The first four-wheeled motor car: a horse carriage that Gottlieb Daimler bought and fitted with his 1.1 hp engine.",
  eyebrow: "Daimler motor carriage, 1886",
  lede: "Gottlieb Daimler ordered an ordinary horse-drawn carriage and put his fast-running single-cylinder engine in it. The carriage kept its turntable front axle, which swings as a whole to steer. Watch the engine run, then the front axle turn.",
  orbit: { min: 0.5, max: 14 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[1400, 700], [1600, 1000], [400, 1050], [-500, 1100], [-600, 1500], [-400, 1500], [-350, 1100]], y: [-600, 600] },   // body and seats
      { torus: { R: 400, r: 30, pos: [1300, 560, 430], rot: [90, 0, 0] }, mirror: true },                                          // wheels
      { torus: { R: 530, r: 30, pos: [0, 640, 560], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Daimler motor carriage of 1886 in the Mercedes-Benz Museum, seen from the right",
    cam: { c: [-1400.4, -4603.7, 2721.7], yaw: 1.0942, pitch: -0.3346, roll: -0.0388, f: 1560.5 }, // tools/photo-fits/daimler-carriage.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Daimler_Motorkutsche_1886_RSideFront_MBMuse_9June2013_(14980552081).jpg" },
  },
  components: [
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [1.2, 1.2, 1.3], target: [0.35, 0, 0.6] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "Four-stroke cycle · one cylinder, hot-tube ignition",
        order: [1], bore: 70, stroke: 120, rod: 300,                                // rod illustrative
        xs: [350], crankZ: 420, lean: 0,                                              // position illustrative
        valvetrain: "atmospheric", ignition: "hot-tube", fuel: "carb", crankcase: "flywheels", flywheelR: 170,
        speed: { min: 5, max: 60, value: 20 }, realRpm: 650,
      },
      talk: [
        "The engine is a development of Daimler and Maybach's “grandfather clock”: one upright cylinder of 462 cc, giving 1.1 hp at 650 rpm. It stands in the floor between the seats and drives the rear wheels through belts and gears.",
        "There is no spark: a platinum tube, kept glowing by a burner, reaches into the cylinder. Compression pushes the mixture into the hot tube and it ignites.",
        "The inlet valve is pulled open by the suction of the descending piston; a cam opens the exhaust valve.",
      ],
    },
    {
      id: "steering", label: "Turntable steering", subsystem: "steering",
      view: { pos: [-2.4, -0.2, 5.2], target: [0.9, 0, 0] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "Front steering, seen from above", start: "cp",
        kingpinHalf: 560, arm: 150, wheelbase: 1300, stub: 60, frontR: 430, rearR: 560, halfTrackRear: 640, maxSteer: 30,   // wheelbase from Wikipedia; the rest illustrative
      },
      talk: [
        "Like any horse carriage, it steers with a turntable: the whole front axle swings about a pin at its middle, here turned by the driver instead of by the shafts of a horse.",
        "It works, but the axle has to swing out of the way of the body, the car gets narrower on lock, and a bump on one wheel kicks the whole axle.",
        "Compare the double pivot Karl Benz patented for his Victoria in 1893: each wheel turns on its own kingpin and the axle stays put.",
      ],
    },
  ],
  note: "Daimler's car and Benz's Patent-Motorwagen were built in the same year, about a hundred kilometres apart, by two inventors working independently.",
  unverified: [
    "Tracks and wheel sizes",
    "Engine position in the carriage and conrod length",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Legend 1",
  ],
  sources: [
    { label: "Wikipedia: Daimler Motorized Carriage", url: "https://en.wikipedia.org/wiki/Daimler_Motorized_Carriage" },
    { label: "Wikipedia: Grandfather Clock (engine)", url: "https://en.wikipedia.org/wiki/Grandfather_Clock_(engine)" },
  ],
};
