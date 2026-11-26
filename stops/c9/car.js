// Sauber-Mercedes C 9, 1989, No. 63 (Le Mans winner). Frame: mm, x forward, y left, z up; origin = front axle centre on the
// ground. Wheelbase 2,700 from the data sheet; tracks, wheel sizes, outline, engine and turbo positions illustrative.
// Race boost and power published; the qualifying boost and the engine's efficiencies are illustrative.
export default {
  slug: "c9",
  title: "Exhaust that pumps air",
  name: "Sauber-Mercedes C 9",
  year: 1989,
  summary: "The Group C car that won Le Mans in 1989: a five-litre V8 with two exhaust-driven turbochargers.",
  question: "How can exhaust gas make an engine stronger?",
  eyebrow: "Sauber-Mercedes C 9, 1989",
  lede: "A turbocharger is two fans on one shaft. The exhaust gas spins one of them, the turbine; the other, the compressor, packs fresh air into the engine. The C 9's V8 has one on each bank. Follow the exhaust into a turbine, watch the compressor on the same shaft, and turn the boost up from race to qualifying.",
  look: "Find the number 63 on the flank and the gills behind the doors: the two turbochargers sit behind the engine, under the rear bodywork.",
  takeaway: "A Roots blower on an older car takes its power from the crankshaft; a turbocharger takes it from exhaust gas the engine would otherwise throw away.",
  orbit: { min: 0.5, max: 14 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[1150, 150], [1150, 450], [700, 650], [-300, 800], [-800, 1070], [-1700, 1070], [-2600, 900], [-3650, 950], [-3700, 300], [-3500, 150]], y: [-980, 980] },   // body (sketched)
      { torus: { R: 245, r: 80, pos: [0, 820, 325], rot: [90, 0, 0] }, mirror: true },                       // wheels
      { torus: { R: 255, r: 90, pos: [-2700, 800, 345], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Silver Sauber-Mercedes C 9 with the number 63 and AEG lettering on its nose, in the Mercedes-Benz Museum, seen from the front right; a red racing lorry stands behind it",
    cam: { c: [3223.2, -2591, 797.2], yaw: 2.4903, pitch: -0.0889, roll: 0.0132, f: 1098 }, // tools/photo-fits/c9.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Sauber-Mercedes_C9_1989_LeMans_Jochen_Mass_RFront_MBMuse_9June2013_(14796972678).jpg" },
  },
  components: [
    {
      id: "turbo", label: "Twin turbochargers", subsystem: "turbo",
      prompt: "Switch from the race setting to qualifying. What has to happen at the turbos for the engine to make about 150 kW more?",
      answer: "The boost rises from 1.6 to about 2.5 bar, so each cylinder takes in nearly a third more air. To pack it in, each compressor needs nearly twice the power, which its turbine takes from the exhaust: the shaft spins faster and the air leaves the compressor hotter, so the intercooler matters more.",
      view: { pos: [-0.6, -2.6, 2.0], target: [-2.1, 0, 0.5] },
      ghost: { fill: 0.03, edge: 0.35 },
      params: {
        label: "One turbocharger per bank of the V8",
        engine: { x: -1850, z: 450, l: 800, w: 650, h: 520 }, turbo: { x: -2550, y: 350, z: 450 }, cooler: { x: -1500, y: 720, z: 520 },   // positions illustrative
        tail: [-3700, 450], intake: [-1250, 900, 700],
        model: { disp: 4.973e-3, rpm: 6500, ve: 0.8, eta: 0.26, afr: 12.5, lhv: 43e6, etaC: 0.72, cooler: 0.7, t1: 293, p1: 1.013e5, wheel: 0.065, psi: 0.65 },   // tuned to 530 kW at 1.6 bar
        presets: [{ id: "race", label: "Race: 1.6 bar", boost: 1.6 }, { id: "qual", label: "Qualifying: 2.5 bar", boost: 2.5 }],
        boostMax: 2.6,
      },
      talk: [
        "The engine is the M 119, Mercedes's five-litre V8 from the road cars, with four valves per cylinder from 1989. Each bank of cylinders blows its exhaust into its own turbocharger.",
        "The exhaust leaves the cylinders hot and under pressure. Expanding through the turbine, it gives up some of that energy to spin the shaft, well over a hundred thousand times a minute.",
        "On the other end of the shaft the compressor squeezes the intake air. Squeezed air gets hot, so an intercooler cools it before it enters the engine: cooler air is denser, and more of it fits in each cylinder.",
        "Group C limited how much fuel a car could use in a race, so in the race the boost stayed down, for about 530 kW. In qualifying, with only a few laps to run, the turbos could blow harder for up to about 680 kW.",
        "This car, No. 63, won the 1989 Le Mans 24 Hours with Jochen Mass, Manuel Reuter and Stanley Dickens.",
      ],
    },
  ],
  note: "Race boost (1.6 bar) and the race and qualifying powers are published figures. The qualifying boost here is what this model needs for 680 kW; the engine's efficiencies, the turbos' size and the intercooler are illustrative.",
  unverified: [
    "Qualifying boost (about 2.5 bar in this model)",
    "Volumetric and brake efficiency, compressor efficiency, intercooler effectiveness and turbo wheel size",
    "Positions of engine, turbos and intercoolers; tracks, wheel sizes and the outline (sketched)",
    "Lamp and star positions behind the camera fit",
  ],
  sources: [
    { label: "Mercedes-Benz: the C 9 No. 63 in the museum and its Le Mans record", url: "https://media.mercedes-benz.com/en/article/7c42293b-3c71-428d-af25-b562111e9844" },
    { label: "Wikipedia: Sauber C9", url: "https://en.wikipedia.org/wiki/Sauber_C9" },
    { label: "Wikipedia: Mercedes-Benz M119 engine", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_M119_engine" },
    { label: "SAE 920674: the Mercedes-Benz Group C engines for 1989 and 1990", url: "https://saemobilus.sae.org/papers/mercedes-benz-group-c-engines-world-sports-prototype-racing-championships-1989-1990-920674" },
  ],
};
