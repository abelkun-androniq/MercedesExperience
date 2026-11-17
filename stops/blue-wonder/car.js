// Mercedes-Benz racing-car transporter "Blue Wonder", 1955. Frame: mm, x forward, y left, z up; origin = front axle centre
// on the ground. Wheelbase, track and lamp positions are assumed for the photo fit; drag figures are illustrative.
export default {
  slug: "blue-wonder",
  title: "The fastest truck of its day",
  name: "Mercedes-Benz racing car transporter",
  year: 1955,
  summary: "A one-off transporter with a 300 SL engine that could carry a racing car at 160 km/h.",
  eyebrow: "Racing car transporter \"Blue Wonder\", 1955",
  lede: "The racing department wanted its cars at the track, or back at the factory, overnight. So it built a truck with a sports-car engine and a low, rounded nose. Compare it with a boxy truck: at these speeds nearly all the power goes into pushing air aside.",
  orbit: { min: 0.8, max: 20 },
  sun: [3, 3, 7],
  body: {
    ghost: [
      { pts: [[650, 330], [1800, 330], [1850, 650], [1650, 1000], [650, 1000]], y: [-880, 880] },             // nose and front wings
      { pts: [[-800, 400], [650, 400], [650, 1000], [720, 1440], [-800, 1440]], y: [-850, 850] },             // cab
      { pts: [[-5000, 700], [-800, 700], [-800, 850], [-5000, 850]], y: [-900, 900] },                        // loading deck
      { torus: { R: 300, r: 80, pos: [0, 800, 360], rot: [90, 0, 0] }, mirror: true },                       // wheels
      { torus: { R: 300, r: 80, pos: [-2900, 800, 360], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Blue 1955 Mercedes-Benz racing car transporter carrying a silver 300 SLR on its deck, in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [2757.8, 2029.4, 1396], yaw: -2.5835, pitch: -0.1865, roll: 0.0615, f: 810.6 }, // tools/photo-fits/blue-wonder.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_300SLR_1955_Rennsportwagen_with_Rennwagen_Schnelltransprter_1955_Blue_Wonder_LSideFront_MBMuse_9June2013_(14797015948).jpg" },
  },
  components: [
    {
      id: "aero", label: "Air drag", subsystem: "aero",
      view: { pos: [5.2, -6.4, 2.6], target: [-1.6, 0, 0.7] },
      ghost: { fill: 0.06, edge: 0.5 },
      params: {
        label: "Full power on the autobahn",
        shapes: [                                              // cd, area, mass, rolling resistance and efficiency illustrative
          { id: "empty", label: "Transporter, empty", cd: 0.6, area: 2.6, mass: 2400, crr: 0.015, eta: 0.85, ps: 192, quoted: 170 },
          { id: "loaded", label: "With a racing car", cd: 0.66, area: 2.8, mass: 3150, crr: 0.015, eta: 0.85, ps: 192, quoted: 160 },
          { id: "box", label: "Boxy truck, same engine", cd: 0.8, area: 4.8, mass: 3150, crr: 0.015, eta: 0.85, ps: 192 },
        ],
        power: { min: 60, max: 300 }, vmax: 220,
        nose: [1850, 600], wheel: [-2900, 0], wind: { x0: 3000, x1: -6500, y: 1100, z0: 100, z1: 1800 }, time: 3,
      },
      talk: [
        "Racing manager Alfred Neubauer asked for it and chief engineer Rudolf Uhlenhaut designed it, on a lengthened 300 S frame. The engine is the 300 SL's three-litre six with petrol injection, here giving 192 hp.",
        "Air drag grows with the square of speed, and the power to overcome it with the cube. Doubling speed takes about eight times the power, so the last few km/h are the most expensive.",
        "The low, rounded nose and small frontal area are what make it fast. Switch to the boxy truck: same engine and weight, but a flat face twice the size, and the top speed falls by about 40 km/h.",
        "A racing car on the open deck adds weight and drag. Even loaded, the transporter was said to reach about 160 km/h.",
      ],
    },
  ],
  note: "The original was scrapped in 1967; the truck in the museum is a replica rebuilt from photographs and drawings. In the photo it carries a 300 SLR racing sports car. Sources disagree on the engine (some say a 240 hp 300 SL unit).",
  unverified: [
    "Drag coefficients, frontal areas, masses and driveline efficiency",
    "The boxy truck is a made-up comparison, not a real vehicle",
    "Wheelbase (2,900 mm), track and lamp positions used for the photo fit",
    "Ghost-body outline (traced from the photo)",
    "Room: Collection 2",
  ],
  sources: [
    { label: "Mercedes-AMG F1: The history of the iconic Blue Wonder", url: "https://www.mercedesamgf1.com/news/the-history-of-the-iconic-blue-wonder" },
    { label: "Goodwood: Doug Nye on the Blue Wonder", url: "https://www.goodwood.com/grr/columnists/doug-nye/2018/1/doug-nye-the-blue-wonder-is-a-landmark-piece-of-mercedes-f1-history/" },
    { label: "Mercedes-Benz Classic archive: racing car transporter, 1955", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Mercedes-Benz-racing-car-transporter-1955.xhtml?oid=6893" },
  ],
};
