// Mercedes-Benz C 111-II, 1970. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Flank sagitta, rotor phasing, engine position and dimensions are illustrative.
export default {
  slug: "c111",
  title: "Four rotors, no pistons",
  name: "Mercedes-Benz C 111-II",
  year: 1970,
  summary: "An orange mid-engined test car with a four-rotor Wankel engine: 350 PS and 300 km/h.",
  eyebrow: "Mercedes-Benz C 111-II, 1970",
  lede: "No pistons, no valves: four triangular rotors turn inside oval housings. Watch one rotor's three chambers go through intake, compression, power and exhaust, all at once and a third of a turn apart.",
  frame: { origin: "front", wheelbase: 2620, wheelR: 320 },
  orbit: { min: 0.5, max: 14 },
  sun: [3, -3, 6],
  body: {
    ghost: [
      { pts: [[980, 250], [980, 450], [400, 690], [-450, 780], [-3450, 860], [-3450, 300]], y: [-900, 900] },   // body
      { pts: [[-450, 780], [-1050, 1120], [-1900, 1100], [-3450, 860]], y: [-600, 600] },                       // cabin and engine cover
      { torus: { R: 250, r: 70, pos: [0, 760, 320], rot: [90, 0, 0] }, mirror: true },
      { torus: { R: 250, r: 70, pos: [-2620, 760, 320], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Orange 1970 Mercedes-Benz C 111 on a raised display in the Mercedes-Benz Museum, seen from the rear left",
    cam: { c: [-5358.6, 5216.1, 2139.2], yaw: -0.9242, pitch: -0.2533, roll: -0.1044, f: 1762 }, // tools/photo-fits/c111.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_C111_1970_Wenkel_Concept_LSideRear_MBMuse_9June2013_(14983249132).jpg" },
  },
  components: [
    {
      id: "wankel", label: "Rotary engine", subsystem: "wankel",
      view: { pos: [-1.0, -0.85, 0.8], target: [-1.88, 0, 0.42] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Four-rotor Wankel engine",
        geometry: { e: 15, R: 99, b: 75, flank: 16.9 },          // e, R, b of the M 950 F; flank sagitta illustrative
        compression: 9.3,
        rotors: 4, spacing: 125, phases: [0, 180, 90, 270],        // spacing and phasing illustrative
        origin: [-1700, 0, 420],
        speed: { min: 5, max: 60, value: 15 }, realRpm: 7000,
      },
      talk: [
        "Felix Wankel's engine has one moving part per chamber group: a curved triangle turning on an eccentric. Its tips seal against a housing shaped like a fat figure eight.",
        "The rotor turns once for every three turns of the shaft. Each of its three faces makes a power stroke once per rotor turn, so each rotor fires once per shaft turn.",
        "The C 111-II's M 950 F has four rotors of 600 cm³ per chamber, with a compression ratio of 9.3 : 1 and about 350 PS. Shown at Geneva in March 1970, the car reached 300 km/h.",
        "Mercedes never built it in series: the Wankel used a lot of fuel, and its apex seals wore. From late 1970 the C 111 ran with diesel and V8 engines instead.",
      ],
    },
  ],
  note: "Sources disagree on whether to rate the engine as 2.4 or 4.8 litres, and some give 350 PS at 7,000 rpm. The model's compression ratio comes from the rotor shape drawn here.",
  unverified: ["Flank shape (chosen to give 9.3 : 1)", "Rotor phasing and spacing", "Engine position and ghost-body outline", "Rated speed of 7,000 rpm"],
  sources: [
    { label: "Wikipedia: Mercedes-Benz C111", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_C111" },
    { label: "Wikipedia: Mercedes-Benz M950F", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_M950F" },
    { label: "auto motor und sport: Mercedes C 111-II Wankel (1970)", url: "https://www.auto-motor-und-sport.de/oldtimer/mercedes-c111-ii-wankel-1970/" },
  ],
};
