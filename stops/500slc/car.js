// Mercedes-Benz 500 SLC rally car (C 107), 1980. Frame: mm, x forward, y left, z up; origin = front axle centre on the
// ground. Wheelbase and tracks from the production car; wheel radius, lamp positions, engine position, cylinder spacing,
// bank offset and conrod are illustrative.
export default {
  slug: "500slc",
  title: "A V8 on the rally stages",
  name: "Mercedes-Benz 500 SLC rally car",
  year: 1980,
  summary: "A big luxury coupé turned rally winner, with a five-litre aluminium V8.",
  eyebrow: "Mercedes-Benz 500 SLC rally car, 1980",
  lede: "Eight cylinders in two banks of four, set at 90°. Watch how each pair of opposite cylinders shares one crankpin, and how the firing jumps from bank to bank, not always in turn.",
  orbit: { min: 0.5, max: 15 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[650, 230], [650, 760], [-3650, 810], [-3780, 720], [-3760, 260]], y: [-890, 890] },              // body
      { pts: [[650, 230], [940, 260], [970, 640], [650, 760]], y: [-720, 720] },                                // nose
      { pts: [[-380, 790], [-1050, 1300], [-2500, 1310], [-3250, 830]], y: [-700, 700] },                      // cabin
      { torus: { R: 235, r: 65, pos: [0, 726, 300], rot: [90, 0, 0] }, mirror: true },                          // wheels
      { torus: { R: 235, r: 65, pos: [-2820, 720, 300], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Silver and black 1980 Mercedes-Benz 500 SLC rally car with four auxiliary lamps and start number 8, in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [3305.4, 2617.7, 1725.8], yaw: -2.5219, pitch: -0.2296, roll: 0.0473, f: 1142.9 }, // tools/photo-fits/500slc.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_C107_1980_500SLC_WRC_Bj%C3%B6rn_Waldeg%C3%A5rd_LSideFront_MBMuse_9June2013_(14983567805).jpg" },
  },
  components: [
    {
      id: "engine", label: "V8 engine", subsystem: "inline-engine",
      view: { pos: [1.7, 1.5, 1.45], target: [0.2, 0, 0.5] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "M 117 V8, 90° · firing order 1-5-4-8-6-3-7-2",
        order: [1, 5, 4, 8, 6, 3, 7, 2], bore: 96.5, stroke: 85, rod: 150,   // rod illustrative
        xs: [400, 294, 188, 82, 378, 272, 166, 60], crankZ: 330,              // right bank 1-4, left bank 5-8; illustrative
        leans: [45, 45, 45, 45, -45, -45, -45, -45],
        valvetrain: "ohc", ignition: "spark", fuel: "carb", crankcase: "open", // port injection: drawn like a carburettor
        speed: { min: 5, max: 60, value: 15 }, realRpm: 4750,
      },
      talk: [
        "Mercedes went rallying with its big SLC coupés at the end of the 1970s: the 30,000 km Vuelta a la América del Sud, the Safari Rally and the Bandama Rally in Ivory Coast. Björn Waldegård and Hans Thorszelius, whose names this car carries, won the Bandama in 1980.",
        "The M 117 has two banks of four cylinders at 90°: cylinders 1 to 4 on the right, 5 to 8 on the left. Opposite cylinders share a crankpin, their conrods side by side, so eight cylinders need only four pins and five main bearings.",
        "The four pins stand 90° apart, a cross-plane crank, so a cylinder fires every 90° of crank. Follow the order 1-5-4-8-6-3-7-2: right, left, right, left, then left twice and right twice. Each bank fires unevenly, which gives the V8 its burble.",
        "The five-litre version, 96.5 × 85 mm, has an aluminium block with no cylinder liners: the bores are etched so that hard silicon crystals carry the iron-coated pistons. One overhead camshaft per bank works the valves through finger followers. In the road car it gave 240 hp at 4,750 rpm.",
      ],
    },
  ],
  note: "The 450 SLC 5.0 of 1978, renamed 500 SLC in 1980, had an aluminium bonnet and boot lid to save weight, partly with rallying in mind. The rally engines were tuned beyond the road car's output.",
  unverified: [
    "Engine position, cylinder spacing, bank offset and conrod length",
    "Wheel radius (300 mm) and lamp positions used for the photo fit",
    "Ghost-body outline (traced from the photo and the production car's size)",
    "Whether this car is the 1980 Bandama winner or a sister car",
    "Room: Legend 7",
  ],
  sources: [
    { label: "Wikipedia (German): Mercedes-Benz M 117", url: "https://de.wikipedia.org/wiki/Mercedes-Benz_M_117" },
    { label: "Wikipedia (German): Mercedes-Benz R 107 and C 107", url: "https://de.wikipedia.org/wiki/Mercedes-Benz_R_107_und_C_107" },
    { label: "Wikipedia: Mercedes-Benz M117 engine", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_M117_engine" },
  ],
};
