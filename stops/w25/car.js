// Mercedes-Benz W 25 Grand Prix car, 1934. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Bore and stroke from the data sheet; engine position, conrod and body outline illustrative.
export default {
  slug: "w25",
  title: "The first Silver Arrow",
  name: "Mercedes-Benz W 25",
  year: 1934,
  summary: "The Grand Prix car built to a 750 kg weight limit, with a supercharged 3.4-litre straight-eight and two camshafts over its valves.",
  eyebrow: "Mercedes-Benz W 25, 1934",
  lede: "The 1934 Grand Prix rules set no limit on the engine, only on the weight: 750 kg without driver, fuel, oil, water and tyres. So the W 25 got a light, fast-revving straight-eight with two overhead camshafts. Watch the cams open the valves as the eight cylinders fire in turn.",
  orbit: { min: 0.5, max: 14 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[450, 250], [500, 700], [-300, 850], [-1400, 950], [-2900, 900], [-3550, 700], [-3550, 300], [-2500, 200], [0, 200]], y: [-420, 420] },   // body
      { torus: { R: 295, r: 95, pos: [0, 680, 390], rot: [90, 0, 0] }, mirror: true },                                                                 // wheels
      { torus: { R: 295, r: 95, pos: [-2720, 680, 390], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Silver 1934 Mercedes-Benz W 25 Grand Prix car in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [3278.9, 2759.6, 1929.7], yaw: -2.5596, pitch: -0.2757, roll: 0.053, f: 1614 }, // tools/photo-fits/w25.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_W25_1934_Nurburgring_LSideFront_MBMuse_9June2013_(14797019297).jpg" },
  },
  components: [
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [1.2, 1.6, 1.3], target: [-0.55, 0, 0.55] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "M 25 supercharged straight-eight, twin overhead camshafts · firing order 1-6-2-5-8-3-7-4",
        order: [1, 6, 2, 5, 8, 3, 7, 4], bore: 78, stroke: 88, rod: 180,                       // rod illustrative
        xs: [-150, -245, -340, -435, -530, -625, -720, -815], crankZ: 380, lean: 0,              // positions illustrative
        valvetrain: "dohc", ignition: "spark", fuel: "carb", crankcase: "open",
        speed: { min: 5, max: 80, value: 25 }, realRpm: 5800,
      },
      talk: [
        "For 1934 the Grand Prix rules capped the car's weight at 750 kg, without driver, fuel, oil, water or tyres, in the hope of keeping speeds down. Mercedes-Benz answered with the W 25: about 350 hp from 3.4 litres.",
        "Eight cylinders, 78 mm across with an 88 mm stroke. Two camshafts in the head, one for the inlet and one for the exhaust valves, open them directly, which lets the engine rev to almost 6,000 rpm.",
        "A Roots supercharger blows air into the carburettors under pressure, so more fuel burns on every stroke.",
        "The story goes that at the Eifel race of 1934 the car weighed a kilogram too much, so the white paint was scraped off overnight, leaving bare aluminium: the first Silver Arrow. Historians still argue about it.",
      ],
    },
  ],
  note: "The W 25 raced from 1934 to 1936; the museum shows it in its unpainted aluminium.",
  unverified: [
    "Engine position in the car and conrod length",
    "Valves drawn two per cylinder",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Legend 7",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz W25", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_W25" },
  ],
};
