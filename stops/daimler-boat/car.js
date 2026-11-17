// Daimler motorboat "Marie", 1888. Frame: mm, x forward, y left, z up; origin = top of the stern on the centreline.
// Hull heights, casing and engine positions are taken from the photo with an approximate camera fit; conrod and
// flywheel size are illustrative, and the bore and stroke are assumed (see unverified).
export default {
  slug: "daimler-boat",
  title: "The engine in the cupboard",
  name: "Daimler motorboat Marie",
  year: 1888,
  summary: "A launch with a petrol engine hidden in a white cabinet, so that passengers would not worry about an explosion.",
  eyebrow: "Daimler motorboat Marie, 1888",
  lede: "Daimler sold the fast-running engine to boat owners before car buyers. Here it sits out of sight behind white doors at the stern, turning a shaft to the propeller. Watch the single cylinder inside the cabinet.",
  orbit: { min: 0.6, max: 16 },
  sun: [2, -3, 6],
  body: {
    ghost: [
      { pts: [[0, 0], [5500, 200], [5420, -600], [4800, -760], [700, -780], [250, -650], [0, -250]], y: [-200, 200] },   // hull, keel
      { pts: [[1000, -90], [4900, 120], [4700, -560], [1300, -640]], y: [-520, 520] },                                     // hull
      { pts: [[1700, -150], [4200, 30], [4000, -480], [1900, -540]], y: [-700, 700] },                                     // hull, full beam
      { pts: [[1760, -150], [2340, -150], [2340, 290], [1760, 290]], y: [-250, 250] },                                    // engine cabinet
      { cyl: { r: [120, 260], h: 230, axis: "z", pos: [2050, 0, 405] } },                                                  // its dome
      { cyl: { r: [70, 70], h: 40, axis: "x", pos: [450, 0, -650] } },                                                     // propeller
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "White, blue and red 1888 Daimler launch Marie with a canopy and a white engine cabinet, in the Mercedes-Benz Museum, seen from the stern",
    cam: { c: [-1935.2, -3995.8, -183.6], yaw: 0.7008, pitch: 0.0501, roll: -0.0496, f: 1234.7 }, // tools/photo-fits/daimler-boat.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Daimler_Motorboot_1888_Marie_RSideRear_MBMuse_9June2013_(14960656126).jpg" },
  },
  components: [
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [3.3, -2.0, 0.6], target: [2.05, 0, -0.15] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "Single cylinder inside the cabinet",
        order: [1], bore: 70, stroke: 120, rod: 240,        // bore and stroke assumed, rod illustrative
        xs: [2050], crankZ: -450, lean: 0,                  // crank fore and aft, driving the propeller shaft
        valvetrain: "atmospheric", ignition: "hot-tube", fuel: "carb", crankcase: "flywheels",
        flywheelR: 150,                                    // illustrative
        speed: { min: 5, max: 60, value: 20 }, realRpm: 650,
      },
      talk: [
        "People feared that petrol on board would explode. So the engine hides in a tall white cabinet behind two doors; only the throttle handle and the starting crank stick out. Daimler's first test boat of 1886 even carried insulators and wires so that it looked electric.",
        "The engine is Daimler's single cylinder with hot-tube ignition: 1.1 hp at 650 rpm, cooled by water from the lake.",
        "Its crankshaft drives a shaft straight back to a fixed propeller under the stern; the boat is steered with a rudder and tiller. The catalogue describes going astern with a friction cone and a hand lever.",
        "The 5.5-metre launch made about 5.5 knots, some 10 km/h. Daimler bought the hulls from boatyards and began building motorboats in series in 1888, before cars.",
      ],
    },
  ],
  note: "Marie is 5.50 m long and 1.45 m wide and weighs 905 kg empty. It belonged to Otto von Bismarck's family and was named after Bismarck's daughter Marie. Its engine is assumed here to be the 462 cm³ (70 × 120 mm) single cylinder of Daimler's 1886 motor carriage, which also gave 1.1 hp at 650 rpm.",
  unverified: [
    "Bore and stroke (assumed: the 1886 motor-carriage engine), conrod and flywheel size",
    "Engine position in the hull, cabinet size and hull heights (approximate photo fit)",
    "Ghost-body outline (traced from the photo)",
    "Room: Legend 1",
  ],
  sources: [
    { label: "Mercedes-Benz France: Close-up 7, motorboat Marie (PDF, French)", url: "https://media.mercedes-benz.fr/download/5b36a894-cd74-489f-8381-d2a96788c41a/cp-close-up-07-motorboot-marie-fr.pdf" },
    { label: "boote: Pioneer motorboat Marie", url: "https://www.boote-magazin.de/en/boats/classics/the-special-boat-pioneer-motorboat-marie-was-to-popularise-the-daimler-engine/" },
  ],
};
