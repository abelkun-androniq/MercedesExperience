// Daimler riding car (Reitwagen), 1885. Frame: mm, x forward, y left, z up; origin = rear wheel centre on the ground.
// Pulley, pinion and ring-gear sizes, the low-gear speed, engine position, conrod and the laden mass are illustrative.
export default {
  slug: "reitwagen",
  title: "A belt, two pulleys and a ring gear",
  name: "Daimler riding car",
  year: 1885,
  summary: "The first vehicle with a petrol engine: half a horsepower, a leather belt, and two gears changed by hand at a standstill.",
  eyebrow: "Daimler Reitwagen, 1885",
  lede: "Daimler and Maybach put their new fast-running engine into a wooden frame to prove it could move a vehicle. Pick a gear and a hill: half a horsepower goes a long way on the level, and not far uphill.",
  frame: { origin: "rear", wheelbase: 1030, wheelR: 300 },
  orbit: { min: 0.4, max: 8 },
  sun: [2, -3, 5],
  body: {
    ghost: [
      { torus: { R: 285, r: 15, pos: [0, 0, 300], rot: [90, 0, 0] } },                                  // rear wheel
      { torus: { R: 285, r: 15, pos: [1030, 0, 300], rot: [90, 0, 0] } },                               // front wheel
      { torus: { R: 95, r: 12, pos: [165, 275, 105], rot: [90, 0, 0] }, mirror: true },                 // stabilising wheels
      { pts: [[0, 260], [400, 360], [700, 460], [1010, 700], [1050, 770], [640, 690], [380, 430], [0, 330]], y: [35, 65], mirror: true },   // frame
      { pts: [[225, 540], [660, 540], [650, 830], [235, 830]], y: [-150, 150] },                     // seat
      { pts: [[410, 40], [580, 40], [580, 520], [410, 520]], y: [-80, 80] },                         // engine
      { pts: [[1000, 700], [1030, 710], [1010, 960], [760, 1075], [745, 1050], [985, 935]], y: [-12, 12] },   // steering head and handlebar
      { cyl: { r: [45, 45], h: 90, axis: "z", pos: [70, 0, 820] } },                                  // surface carburettor
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Wooden 1885 Daimler riding car with a leather seat on display in the Mercedes-Benz Museum, seen from the right",
    cam: { c: [-480.3, -2232.2, 1290.1], yaw: 1.1713, pitch: -0.306, roll: 0.0887, f: 1276.7 }, // tools/photo-fits/reitwagen.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Daimler_Reitwagen_1885_RSide_MBMuse_9June2013_(14980549721).jpg" },
  },
  components: [
    {
      id: "drive", label: "Belt drive", subsystem: "belt-drive",
      view: { pos: [0.95, -2.4, 1.2], target: [0.3, 0, 0.32] },
      ghost: { fill: 0.04, edge: 0.4 },
      params: {
        label: "Two-speed belt, pinion and ring gear",
        drive: {
          gears: [{ name: "Low", drive: 95, driven: 205 }, { name: "High", drive: 145, driven: 155 }],   // illustrative
          pinion: 76, ring: 400, wheelR: 0.3,                                                           // ring sized from the photo
        },
        vehicle: { mass: 165, crr: 0.03, eta: 0.8, ps: 0.5, rpm: 600, quoted: 12 },   // mass with rider, crr, eta illustrative
        shift: "stopped", final: "ring", wheel: "wood",
        at: { engine: [490, 140], counter: [135, 390], wheel: [0, 300], belt: -120, pitch: -30, finals: [-60], wheels: [0] },
        grade: { max: 12, value: 0 },
      },
      talk: [
        "A flat leather belt runs from a pulley on the engine to a countershaft at the back. A small pinion on that shaft turns a ring gear with its teeth on the inside, fixed to the rear wheel.",
        "The pulleys are stepped. With the belt on the small engine pulley and the big countershaft pulley the wheel turns slowly but pushes hard; that is low gear. There is no clutch: the belt is moved across by hand, standing still.",
        "The engine is governed to about 600 rpm, so each gear has one speed: about 12 km/h in high. Half a horsepower moves the rider on the level, but a hill of a few per cent stops it in high gear. Try it with the Hill slider.",
        "The stepped pulleys are sized so that the same belt fits both steps: what one step loses in diameter on the engine, the other gains on the countershaft.",
      ],
    },
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [1.4, -1.6, 0.95], target: [0.45, 0, 0.35] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Single cylinder under the seat",
        order: [1], bore: 58, stroke: 100, rod: 200,          // rod illustrative
        xs: [490], crankZ: 140, lean: 0, rot: [0, 0, 90],     // upright, crank across the frame; placed from the photo
        valvetrain: "atmospheric", ignition: "hot-tube", fuel: "carb", crankcase: "flywheels",
        flywheelR: 100,                                      // illustrative, scaled from the photo
        speed: { min: 5, max: 60, value: 20 }, realRpm: 600,
      },
      talk: [
        "The engine is a smaller sister of the Grandfather Clock: one upright cylinder of 264 cm³ (58 × 100 mm), 0.5 hp at 600 rpm, its flywheels closed inside a round crankcase.",
        "Ignition is by a hot tube kept glowing by a burner, right under the rider. On the first rides the seat is said to have caught fire.",
        "The intake valve is sucked open by the piston; only the exhaust valve is driven, by a groove cut into the flywheel.",
        "Fuel came from a surface carburettor behind the seat: air bubbled through petrol and came out as mixture. There was no fuel tank as such.",
      ],
    },
  ],
  note: "Daimler and Maybach patented the riding car on 29 August 1885 (DRP 36423); the first ride, from Cannstatt to Untertürkheim, followed in November 1885. The original burned in the 1903 Cannstatt factory fire: the museum shows a replica. Sources disagree on who rode first, Paul or Adolf Daimler.",
  unverified: [
    "Pulley diameters, pinion and ring-gear sizes, and the low-gear speed (about 6 km/h)",
    "Laden mass (with a 75 kg rider), rolling resistance and driveline efficiency",
    "Engine position, conrod and crankcase size",
    "Ghost-body outline (traced from the photo)",
    "Room: Legend 1 (a museum replica has also been lent to the KTM Motohall)",
  ],
  sources: [
    { label: "Mercedes-Benz Classic archive: Daimler riding car (data sheet)", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Daimler-riding-car.xhtml?oid=5972" },
    { label: "Wikipedia: Daimler Reitwagen", url: "https://en.wikipedia.org/wiki/Daimler_Reitwagen" },
  ],
};
