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
  frame: { origin: "front", wheelbase: 2400, wheelR: 400 },
  orbit: { min: 0.6, max: 12 },
  sun: [3, 4, 6],
  body: {
    ghost: [
      { pts: [[350, -60], [330, 780], [-1900, 800], [-1900, -60]], y: [-420, 420] },                                                // radiator and bonnet
      { pts: [[-1900, -160], [-1900, 700], [-2300, 760], [-2900, 640], [-3600, 560], [-3700, 100], [-3500, -160]], y: [-720, 720] }, // cockpit and tail
    ],
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
  unverified: ["Blower layout, 2.6 drive ratio and 0.45 bar boost", "Conrod length and cylinder spacing", "Ghost-body outline", "Room and level"],
  sources: [
    { label: "Wikipedia: Mercedes-Benz SSK", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_SSK" },
    { label: "eMercedesBenz: the Super Sport Short", url: "https://emercedesbenz.com/autos/mercedes-benz/motorsports/mercedes-benz-history-the-super-sport-short" },
    { label: "Autozine: Mercedes SSK", url: "https://w.autozine.org/Archive/Mercedes/classic/SSK.html" },
  ],
};
