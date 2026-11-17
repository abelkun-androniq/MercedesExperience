// Benz Patent-Motorwagen, 1886. Frame: mm, x forward, y left, z up; origin = rear axle centre on the ground.
// Wheel sizes, track, engine and countershaft positions, conrod and flywheel size are illustrative.
export default {
  slug: "patent-motorwagen",
  title: "The first car's engine and differential",
  name: "Benz Patent-Motorwagen",
  year: 1886,
  summary: "Karl Benz's three-wheeler: one cylinder lying flat, a horizontal flywheel, and a differential so the rear wheels can turn at different speeds.",
  eyebrow: "Benz Patent-Motorwagen, 1886",
  lede: "The car Karl Benz patented in January 1886. Watch its single cylinder lying flat at the back, then the differential on the countershaft letting the outer rear wheel run faster in a bend.",
  frame: { origin: "rear", wheelbase: 1450, wheelR: 560 },
  orbit: { min: 0.6, max: 12 },
  sun: [2, -3, 6],
  body: {
    ghost: [
      { pts: [[-100, 900], [650, 900], [650, 1130], [30, 1180], [30, 1360], [-60, 1360], [-100, 1130]], y: [-450, 450] },     // seat and box below
      { pts: [[650, 700], [1100, 700], [1100, 760], [650, 760]], y: [-300, 300] },                                           // footboard
      { torus: { R: 545, r: 15, pos: [0, 600, 560], rot: [90, 0, 0] }, mirror: true },                                        // rear wheels
      { pts: [[-600, 640], [1500, 640], [1500, 680], [-600, 680]], y: [470, 510], mirror: true },                                       // frame tubes
      { torus: { R: 360, r: 16, pos: [1450, 0, 375], rot: [90, 0, 0] } },                                                                // front wheel
      { cyl: { r: [14, 14], h: 580, axis: "z", pos: [950, 0, 1000] } },                                                                // steering column
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Green-wheeled 1886 Benz Patent-Motorwagen on display in the Mercedes-Benz Museum, seen from the rear left",
    cam: { c: [-2030.4, 5338.1, 2032.2], yaw: -1.1709, pitch: -0.2016, roll: -0.0083, f: 2078.7 }, // tools/photo-fits/patent-motorwagen.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Benz_Patent-Motorwagen_1886_Dark_Wood_Green_Rims_LSideRear_MBMuse_9June2013_(14797106387).jpg" },
  },
  components: [
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [1.1, -1.5, 1.4], target: [-0.15, 0, 0.55] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Single cylinder, lying flat",
        order: [1], bore: 90, stroke: 150, rod: 300,         // rod illustrative
        xs: [-280], crankZ: 700, lean: 0,                 // placed from the photo
        rot: [180, 90, 0],                                  // cylinder pointing forward, crank vertical, flywheel underneath
        flywheelR: 340,                                     // illustrative, scaled from the photo
        valvetrain: "none", ignition: "spark", fuel: "carb", crankcase: "open",
        speed: { min: 5, max: 60, value: 20 }, realRpm: 400,
      },
      talk: [
        "One cylinder of 954 cm³ (90 × 150 mm) lies flat at the back and gives 0.75 hp at about 400 rpm.",
        "The big flywheel lies flat as well. Benz did that so its gyroscopic effect would not fight the steering in tight bends.",
        "Benz used electric ignition with a coil and a spark plug instead of Daimler's hot tube.",
        "The whole transmission is a belt to a countershaft: one speed and no reverse. Pushing the belt onto a loose pulley next to the drive pulley is the clutch.",
      ],
    },
    {
      id: "diff", label: "Differential", subsystem: "differential",
      view: { pos: [1.9, -2.0, 2.3], target: [0.15, 0, 0.45] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Differential on the countershaft", mode: "corner",
        halfTrack: 600, wheelR: 560, axleX: 0, wheel: "wire",            // illustrative
        ringR: 110, drive: "belt", counter: { x: 450, z: 450, half: 470 }, // illustrative
        corner: { kmh: 12, minRadius: 3 },
      },
      talk: [
        "In a bend the outer rear wheel has further to go than the inner one. On one solid shaft one of them would have to skid.",
        "Benz built a differential into the countershaft. The belt turns its housing, and small bevel gears inside let the two output shafts run at different speeds.",
        "From each end of the countershaft a chain runs to a rear wheel, as on a bicycle.",
        "Move the steering slider. Straight ahead the small spider gears ride round with the housing without turning; in a bend they start to spin.",
      ],
    },
  ],
  note: "Patent DRP 37435 of 29 January 1886 is often called the birth certificate of the car. Some sources give 91.4 × 150 mm (984 cm³) for the engine.",
  unverified: ["Wheel sizes, track and wheelbase", "Conrod length, flywheel size, engine and countershaft positions", "Sprocket sizes and the 12 km/h cornering speed", "Ghost-body outline (traced from the photo)"],
  sources: [
    { label: "Mercedes-Benz: Benz Patent Motor Car", url: "https://mercedes-benz.com/en/innovation/milestones/benz-patent-motor-car" },
    { label: "Wikipedia: Benz Patent-Motorwagen", url: "https://en.wikipedia.org/wiki/Benz_Patent-Motorwagen" },
    { label: "Wheelsjoint: Benz Patent Motor Car number 1", url: "https://www.wheelsjoint.com/benz-patent-motor-car-number-1-worlds-first-automobile-with-a-combustion-engine/" },
  ],
};
