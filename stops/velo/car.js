// Benz Velo (Velociped), 1894. Frame: mm, x forward, y left, z up; origin = rear axle centre on the ground.
// Pulley and sprocket sizes, the low-gear speed, engine, flywheel and countershaft positions and the laden mass are
// illustrative.
export default {
  slug: "velo",
  title: "Two belts and a loose pulley",
  name: "Benz Velo",
  year: 1894,
  summary: "The first car built in series: 1.5 hp, two flat belts for two gears, and a loose pulley as the clutch.",
  eyebrow: "Benz Velo, 1894",
  lede: "Karl Benz's small, affordable car sold about 1,200 by 1902. Change gear by moving a belt from its loose pulley to its fixed one, then find out how steep a hill 1.5 hp can take with two people aboard.",
  frame: { origin: "rear", wheelbase: 1340, wheelR: 425 },
  orbit: { min: 0.5, max: 10 },
  sun: [2, -3, 6],
  body: {
    ghost: [
      { pts: [[-540, 590], [600, 600], [600, 990], [-400, 980]], y: [-480, 480] },                                   // rear body over the engine
      { pts: [[880, 560], [1330, 560], [1330, 890], [1250, 890], [1210, 620], [880, 620]], y: [-320, 320] },        // front seat
      { torus: { R: 410, r: 15, pos: [0, 520, 425], rot: [90, 0, 0] }, mirror: true },                                  // rear wheels
      { torus: { R: 262, r: 12, pos: [1340, 500, 275], rot: [90, 0, 0] }, mirror: true },                               // front wheels
      { cyl: { r: [12, 12], h: 620, axis: "z", pos: [740, 0, 900] } },                                                  // steering column
      { pts: [[960, 150], [1515, 730], [1490, 760], [935, 185]], y: [-560, -530], mirror: true },                     // front mudguards
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Black 1894 Benz Velo with large wire rear wheels and a copper-panelled body in the Mercedes-Benz Museum, seen from the rear right",
    cam: { c: [-747.8, -3672.1, 1191.8], yaw: 1.2583, pitch: -0.1596, roll: 0.0216, f: 1455.5 }, // tools/photo-fits/velo.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Benz_Motor-Velociped_1894_RSideRear_MBMuse_9June2013_(14960659436).jpg" },
  },
  components: [
    {
      id: "drive", label: "Belts and chains", subsystem: "belt-drive",
      view: { pos: [1.0, -3.0, 1.4], target: [0.15, 0, 0.45] },
      ghost: { fill: 0.04, edge: 0.4 },
      params: {
        label: "Two belts, loose pulleys, chains",
        drive: {
          gears: [{ name: "Low", drive: 160, driven: 345 }, { name: "High", drive: 220, driven: 280 }],   // illustrative
          pinion: 100, ring: 280, wheelR: 0.425,                                                         // sprockets illustrative
        },
        vehicle: { mass: 430, crr: 0.025, eta: 0.8, ps: 1.5, rpm: 450, quoted: 20 },   // mass with two aboard; crr, eta illustrative
        shift: "loose", final: "chain", wheel: "wire",
        at: { engine: [-300, 520], counter: [480, 440], wheel: [0, 425], belt: -330, pitch: -80, finals: [-470, 470], wheels: [-520, 520] },
        grade: { max: 8, value: 0 },
      },
      real: {   // the part in real life (not this car)
        src: "parts/velo-controls.jpg", w: 800, h: 894,
        alt: "The bench seat and driver's controls of an 1894 Benz Velo, with the belt-shifting handles standing up beside the seat",
        caption: "Another 1894 Velo, at the London to Brighton run: the upright handles beside the seat shift the belts. What moves under the seat when the driver moves a lever? In the model, the belt slides sideways from the free pulley onto the fixed one.",
        credit: { author: "Nick.Pr", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Bench_seat_and_controls_of_Benz_Velo_of_1894.jpg" },
      },
      talk: [
        "Two flat belts run from the engine to a countershaft under the seat, one for each gear. Beside each fixed pulley on the countershaft turns a loose one; a belt on its loose pulley drives nothing. Sliding a belt across is both the gear change and the clutch.",
        "The countershaft holds the differential. From each end a chain runs back to a sprocket on a rear wheel.",
        "1.5 hp at 450 rpm gives about 20 km/h in high gear on the level. With two people aboard a slope of a few per cent stops it in high; low gear manages about 4 %. On steeper hills the passengers got out and pushed.",
        "So that a car stopped on a hill would not roll back, the Velo had a hill holder, a prop dropped onto the road, beside its wooden brake blocks on the solid rubber tyres.",
      ],
    },
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [0.7, -2.0, 1.3], target: [-0.15, 0, 0.5] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Single cylinder, lying flat at the back",
        order: [1], bore: 110, stroke: 110, rod: 300,          // rod illustrative
        xs: [-300], crankZ: 520, lean: 0,
        rot: [0, 90, 90],                                      // cylinder pointing forward, crank across the car
        flywheelR: 180,                                        // illustrative
        valvetrain: "atmospheric", ignition: "spark", fuel: "carb", crankcase: "open",
        speed: { min: 5, max: 60, value: 20 }, realRpm: 450,
      },
      talk: [
        "One horizontal cylinder of 1,045 cm³ (110 × 110 mm) gives 1.5 hp at 450 rpm.",
        "Unlike the Patent-Motorwagen's, the flywheel stands upright, turning across the car.",
        "Benz kept electric ignition, with a coil and a spark plug; the intake valve is sucked open by the piston and only the exhaust valve is driven.",
        "The engine sits at the back under the rear seat; fuel came first from a surface carburettor, later from a float carburettor.",
      ],
    },
  ],
  note: "Benz built 67 Velos in 1894 and 134 in 1895, and about 1,200 Velo and Comfortable cars by 1902, at 2,000 marks. A Velo took part in the Paris–Rouen run of 1894. A third gear and reverse were optional from 1896 and standard from 1900.",
  unverified: [
    "Pulley and sprocket sizes, and the low-gear speed (about 12 km/h)",
    "Laden mass (two people aboard), rolling resistance and driveline efficiency",
    "Engine, flywheel and countershaft positions, conrod length",
    "Ghost-body outline (traced from the photo)",
    "Room: Legend 1",
  ],
  sources: [
    { label: "Mercedes-Benz Classic archive: Benz Velo 1.5 hp (data sheet)", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Benz-Velo-Velociped-15-hp.xhtml?oid=4367" },
    { label: "Mercedes-Benz Classic archive: Benz Velo and Comfortable, 1894–1902", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Benz-Velo-and-Comfortable-1894---1902.xhtml?oid=4355" },
    { label: "Wikipedia: Benz Velo", url: "https://en.wikipedia.org/wiki/Benz_Velo" },
  ],
};
