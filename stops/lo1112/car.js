// Mercedes-Benz LO 1112 bus, 1969, a Buenos Aires “colectivo”. Frame: mm, x forward, y left, z up; origin = front axle
// centre on the ground. Bore, stroke and firing order of the OM 352 from its data; engine position, conrod, compression
// ratio and body outline illustrative.
export default {
  slug: "lo1112",
  title: "Diesel straight into the cylinder",
  name: "Mercedes-Benz LO 1112",
  year: 1969,
  summary: "A brightly painted Buenos Aires colectivo on a short-bonnet lorry chassis, with a direct-injection six-cylinder diesel.",
  eyebrow: "Mercedes-Benz LO 1112, 1969",
  lede: "Under the short bonnet of this Argentine bus runs the OM 352, one of Mercedes-Benz's first direct-injection diesels: the fuel is sprayed straight into a bowl in the piston, with no prechamber. Watch the injection come just before the top of each compression stroke.",
  orbit: { min: 0.5, max: 22 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[1500, 500], [1550, 1400], [600, 1550], [400, 2850], [-6000, 2850], [-6400, 2600], [-6400, 500]], y: [-1230, 1230] },   // body
      { torus: { R: 400, r: 110, pos: [0, 960, 480], rot: [90, 0, 0] }, mirror: true },                                                 // wheels
      { torus: { R: 400, r: 110, pos: [-4800, 900, 480], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Red and cream 1969 Mercedes-Benz LO 1112 bus from Buenos Aires, with painted decoration, in the Mercedes-Benz Museum, seen from the front right",
    cam: { c: [3075.7, -3189.6, 1936.6], yaw: 2.4531, pitch: -0.1488, roll: -0.0444, f: 910.1 }, // tools/photo-fits/lo1112.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_LO_1112_1969_Omnibus_Buenos_Aires_RSideFront_MBMuse_9June2013_(14797045357).jpg" },
  },
  components: [
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [1.8, 2.2, 2.2], target: [0.3, 0, 1] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "OM 352 six-cylinder diesel, direct injection · firing order 1-5-3-6-2-4",
        order: [1, 5, 3, 6, 2, 4], bore: 97, stroke: 128, rod: 230,                          // rod illustrative
        xs: [930, 805, 680, 555, 430, 305], crankZ: 800, lean: 0,                             // positions illustrative
        valvetrain: "ohv", ignition: "compression", fuel: "direct", crankcase: "open",
        compression: { value: 17, min: 6, max: 24 },                                         // illustrative
        speed: { min: 5, max: 60, value: 18 }, realRpm: 2800,
      },
      talk: [
        "The LO 1112 is a lorry chassis with a short bonnet, bodied as a bus: in Argentina such buses, the colectivos, were built and painted by local coachbuilders and carried much of Buenos Aires' traffic.",
        "Its engine, the OM 352, has six cylinders of 97 mm bore and 128 mm stroke: 5.7 litres. It was among the first Mercedes-Benz diesels to inject directly into the cylinder.",
        "In a prechamber diesel such as the 260 D's, the fuel burns first in a small chamber in the head. Direct injection sprays it straight into a bowl in the piston crown: less heat is lost to the walls, so it uses less fuel and starts more easily.",
        "Compressing the air alone heats it enough to light the fuel. There is no spark plug at all.",
      ],
    },
  ],
  note: "Mercedes-Benz built buses and lorries in Argentina from the early 1950s; many colectivos ran on its chassis.",
  unverified: [
    "Engine position, conrod length and compression ratio",
    "Power figure (about 120 hp, from the model name)",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Collection 1",
  ],
  sources: [
    { label: "Wikipedia: Colectivo", url: "https://en.wikipedia.org/wiki/Colectivo" },
  ],
};
