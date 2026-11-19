// Mercedes-Benz SSK (W 06), 1928. Frame: mm, x forward, y left, z up; origin = front axle centre at wheel-centre height.
// Engine bore/stroke and power figures from the sources; blower layout, ratio, boost and conrod length are illustrative.
export default {
  slug: "ssk",
  title: "The SSK's switchable supercharger",
  name: "Mercedes-Benz SSK",
  year: 1928,
  summary: "A 7.1-litre straight-six with a Roots blower that only cuts in when the driver stamps the pedal through to the floor.",
  eyebrow: "Mercedes-Benz 27/170/225 PS Typ SSK, 1928",
  lede: "The short-chassis Super Sport, shown working: the blower that joins in only at full pedal, and the big six-cylinder engine it feeds.",
  frame: { origin: "front", wheelbase: 2950, wheelR: 400 },
  orbit: { min: 0.6, max: 12 },
  sun: [3, 4, 6],
  body: {
    ghost: [
      { pts: [[-150, -60], [-140, 740], [-1950, 720], [-1950, -60]], y: [-380, 380] },                                              // radiator and bonnet
      { pts: [[-1950, -160], [-1950, 700], [-2300, 760], [-3030, 480], [-3840, 240], [-3900, 0], [-3700, -160]], y: [-560, 560] },   // cockpit and tail
      { torus: { R: 375, r: 45, pos: [0, 712, 0], rot: [90, 0, 0] }, mirror: true },
      { torus: { R: 375, r: 45, pos: [-2950, 712, 0], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "White 1928 Mercedes-Benz SSK on display in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [1821.7, 2536, 1112.4], yaw: -2.4297, pitch: -0.248, roll: 0.0773, f: 1157.5 }, // tools/photo-fits/ssk.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_27-170-225_PS_TypSSK_1928_Sport-Zweisitzer_LSideFront_MBMuse_9June2013_(14796953659).jpg" },
  },
  components: [
    {
      id: "blower", label: "Supercharger", subsystem: "roots-blower",
      view: { pos: [1.3, 0.75, 1.0], target: [-0.35, 0.02, 0.28] },
      ghost: { fill: 0, edge: 0 },
      params: {
        blower: { ratio: 2.6, engageAt: 0.98, tauUp: 0.25, tauDown: 0.7, boostMax: 0.45, psAtmo: 170, psBoost: 225 },
        order: [1, 5, 3, 6, 2, 4],
        engineLabel: "7.1-litre straight-six",
      },
      real: {   // the part in real life (not this car)
        src: "parts/roots-blower.jpg", w: 644, h: 493,
        alt: "1928 drawing of a dismantled Mercedes supercharger: the casing on the left, the two upright rotors with the clutch beneath them on the right",
        caption: "A Mercedes supercharger taken apart, drawn for a 1928 handbook. The casing (left) fits over the two upright rotors (right); beneath them is the clutch that brings the blower in at full throttle.",
        credit: { author: "Montagu, Cars and Motor-Cycles (1928)", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Mercedes_type_vertical_Roots_blower,_dismantled_(Montagu,_Cars_and_Motor-Cycles,_1928).jpg" },
      },
      talk: [
        "SSK means Super Sport Kurz, the short-chassis Super Sport. Its full name gives the power: 27 tax horsepower, 170 PS on its own and 225 PS with the blower working.",
        "The blower is not always on. The driver pushes the pedal to the floor and then a little further; a clutch on the nose of the crankshaft couples the blower in. Lift off and it lets go again. It was meant for short bursts.",
        "The blower pushes air through the carburettor rather than sucking mixture through itself, the same arrangement the 540 K used a few years later. Watch the air change colour when the clutch bites.",
      ],
    },
    {
      id: "engine", label: "Six-cylinder engine", subsystem: "inline-engine",
      view: { pos: [1.0, 1.6, 0.95], target: [-0.7, 0, 0.25] },
      ghost: { fill: 0.05, edge: 0.5 },
      params: {
        label: "Four-stroke cycle · firing order 1-5-3-6-2-4",
        order: [1, 5, 3, 6, 2, 4],
        bore: 100, stroke: 150, rod: 290,           // rod length illustrative
        xs: [-400, -525, -650, -775, -900, -1025],  // cylinder 1 at the front; spacing illustrative
        crankZ: 0, lean: 0,
        valvetrain: "ohc", ignition: "spark", fuel: "carb",
        speed: { min: 5, max: 60, value: 20 },
      },
      talk: [
        "Six cylinders in line, each 100 mm across and with a 150 mm stroke: 7.1 litres, with one overhead camshaft.",
        "Firing order 1-5-3-6-2-4 gives a power stroke every 120° of crank, alternating between the front and rear halves of the engine. Watch the orange flashes.",
        "It was the last Mercedes designed under Ferdinand Porsche before he left the company, and Rudolf Caracciola raced it.",
      ],
    },
  ],
  note: "Geometry is illustrative: blower layout, drive ratio, boost, conrod length and cylinder spacing are plausible values, not factory data.",
  unverified: ["Blower layout, 2.6 drive ratio and 0.45 bar boost", "Conrod length and cylinder spacing", "Ghost-body outline (traced from the photo)", "Room and level"],
  sources: [
    { label: "Wikipedia: Mercedes-Benz SSK", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_SSK" },
    { label: "Mercedes-Benz public archive: SSK 27/180/250 hp (wheelbase, track)", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/SSK-27180250-hp--WS-06-1929---1930.xhtml?oid=4181" },
    { label: "eMercedesBenz: the Super Sport Short", url: "https://emercedesbenz.com/autos/mercedes-benz/motorsports/mercedes-benz-history-the-super-sport-short" },
    { label: "Autozine: Mercedes SSK", url: "https://w.autozine.org/Archive/Mercedes/classic/SSK.html" },
  ],
};
