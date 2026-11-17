// Mercedes-Benz 300 SLR Uhlenhaut Coupé (W 196 S), 1955. Frame: mm, x forward, y left, z up; origin = front axle centre at
// wheel-centre height. Bore, stroke, displacement and wheelbase from the sources; firing order, lean, rods and valve-train
// numbers are illustrative.
export default {
  slug: "300slr",
  title: "Inside the Uhlenhaut Coupé",
  name: "Mercedes-Benz 300 SLR Uhlenhaut Coupé",
  year: 1955,
  summary: "A Grand Prix-derived straight-eight with direct petrol injection, and valves closed by cams instead of springs.",
  eyebrow: "Mercedes-Benz 300 SLR Uhlenhaut Coupé (W 196 S), 1955",
  lede: "The racing sports car that Rudolf Uhlenhaut drove on the road. Two mechanisms: the straight-eight with fuel sprayed straight into the cylinders, and the desmodromic valve gear that let it rev where springs give up.",
  frame: { origin: "front", wheelbase: 2370, wheelR: 330 },
  orbit: { min: 0.3, max: 12 },
  sun: [3, 4, 6],
  body: {
    ghost: [
      { pts: [[400, -120], [400, 430], [-1000, 520], [-3200, 540], [-3500, 380], [-3520, -120]], y: [-850, 850] },   // body, traced from the photo
      { pts: [[900, -120], [900, 150], [700, 330], [400, 430], [400, -120]], y: [-560, 560] },                       // nose
      { pts: [[-1000, 520], [-1300, 790], [-1800, 820], [-2500, 760], [-3200, 540]], y: [-560, 560] },               // cabin
      { torus: { R: 290, r: 40, pos: [0, 665, 0], rot: [90, 0, 0] }, mirror: true },
      { torus: { R: 290, r: 40, pos: [-2370, 690, 0], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Silver 1955 Mercedes-Benz 300 SLR Uhlenhaut Coupé on display in the Mercedes-Benz Museum, seen from the front right",
    cam: { c: [2793.9, -2105.5, 1189.9], yaw: 2.5851, pitch: -0.2559, roll: -0.0614, f: 1291 }, // tools/photo-fits/300slr.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_300SLR_1955_Uhlenhaut_Coup%C3%A8_RSideFront_MBMuse_9June2013_(14960622596).jpg" },
  },
  components: [
    {
      id: "engine", label: "Straight-eight", subsystem: "inline-engine",
      view: { pos: [1.0, 1.35, 0.85], target: [-0.55, 0, 0.15] },
      ghost: { fill: 0.03, edge: 0.45 },
      params: {
        label: "Four-stroke cycle · eight cylinders, direct injection",
        order: [1, 6, 2, 5, 8, 3, 7, 4],            // generic straight-eight order: the M196's own is not confirmed
        bore: 78, stroke: 78, rod: 140,             // rod length illustrative
        xs: [-250, -340, -430, -520, -610, -700, -790, -880],
        crankZ: 0, lean: 33,                        // engine laid over to one side; angle per CMC, unverified
        valvetrain: "dohc", ignition: "spark", fuel: "direct",
        speed: { min: 5, max: 60, value: 20 },
      },
      talk: [
        "This is the straight-eight of the W 196 Grand Prix car, enlarged for sports-car racing: 78 mm bore and stroke, 2,982 cc and about 310 PS.",
        "A Bosch pump sprays fuel straight into each cylinder during the intake stroke, watch for the spray. Daimler-Benz knew direct injection from its aero engines.",
        "The engine is laid over to one side so the bonnet can sit low. Uhlenhaut, head of the test department, used this coupé as his company car; it could reach about 290 km/h.",
        "Only two coupés were built. In 2022 Mercedes-Benz sold the other one for 135 million euros, the highest price ever paid for a car.",
      ],
    },
    {
      id: "desmo", label: "Desmodromic valves", subsystem: "desmo-valvetrain",
      view: { pos: [0.02, -0.4, 0.52], target: [-0.4, 0.02, 0.37] },
      ghost: { fill: 0, edge: 0 },
      params: {
        label: "Desmodromic valve vs a spring-closed valve",
        cam: { lift: 0.01, open: 0.6, duration: 2.27, mass: 0.1, preload: 0.008, floatRpm: 7000, base: 0.018 },
        rpm: { min: 2000, max: 9500, value: 5000 },
        origin: [-0.4, 0, 0.35],
      },
      talk: [
        "At high revs a valve spring can no longer pull the valve back fast enough: the valve floats off the cam and can hit the piston. Raise the speed and watch the spring valve's line leave the dashed cam line.",
        "Mercedes's desmodromic gear has no closing spring. A second cam and a rocker pull the valve shut, so the valve follows the cam exactly at any speed.",
        "The opening and closing cams are matched: their radii always add up to the same value, so the two never fight. Ducati later made the idea famous on motorcycles.",
      ],
    },
  ],
  note: "Geometry is illustrative: apart from bore and stroke, engine dimensions, firing order, lean angle and valve-train numbers are plausible values, not factory data.",
  unverified: ["Firing order (generic straight-eight)", "33° engine lean", "Conrod length, cam timing and the spring valve's float speed", "Ghost-body outline", "Room and level"],
  sources: [
    { label: "Wikipedia: Mercedes-Benz 300 SLR", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_300_SLR" },
    { label: "Wikipedia: Mercedes-Benz M196 engine", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_M196_engine" },
    { label: "CMC: 300 SLR Coupé technical data", url: "https://cmc-modelcars.de/en/produkt/cmc-mercedes-benz-300-slr-coupe-1955-blaues-interieur" },
    { label: "Silodrome: 300 SLR Uhlenhaut Coupé", url: "https://silodrome.com/mercedes-benz-300-slr-uhlenhaut-coupe-w196/" },
  ],
};
