// Mercedes-Benz 260 D (W 138), 1936. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Compression ratio, valve gear drawing, conrod, positions and dimensions are illustrative.
export default {
  slug: "260d",
  title: "The first diesel car",
  name: "Mercedes-Benz 260 D",
  year: 1936,
  summary: "The first series-production diesel passenger car: a 2.6-litre four with prechambers and Bosch injection, 45 PS.",
  eyebrow: "Mercedes-Benz 260 D (W 138), 1936",
  lede: "A diesel engine has no spark plug: squeezing the air makes it hot enough to light the fuel. Watch fuel spray into each prechamber just before the piston reaches the top, then slide the compression ratio.",
  frame: { origin: "front", wheelbase: 3050, wheelR: 360 },
  orbit: { min: 0.6, max: 14 },
  sun: [3, -3, 6],
  body: {
    ghost: [
      // Traced from the photo (tools/profile-traces/260d.json): bonnet and grille on the centre line, the rear on the right side.
      { pts: [[330, 300], [300, 950], [230, 1150], [-1480, 1150], [-3000, 1100], [-3300, 850], [-3570, 450], [-3520, 300]], y: [-800, 800] },   // body
      { pts: [[-1480, 1150], [-1470, 1550], [-1640, 1690], [-2700, 1690], [-2970, 1640], [-3190, 1100]], y: [-700, 700] },                      // cabin
      { torus: { R: 290, r: 70, pos: [0, 700, 360], rot: [90, 0, 0] }, mirror: true },   // 360 mm to the tread, as the axle height
      { torus: { R: 290, r: 70, pos: [-3050, 700, 360], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Black 1938 Mercedes-Benz 260 D Pullman saloon on display in the Mercedes-Benz Museum, seen from the front right",
    cam: { c: [3261.6, -2273, 1851], yaw: 2.6811, pitch: -0.2404, roll: -0.0249, f: 1202.6 }, // tools/photo-fits/260d.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_260D_1938_Pullman_Limousine_RSideFront_MBMuse_9June2013_(14796948249).jpg" },
  },
  components: [
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [0.55, -0.95, 1.15], target: [-0.37, 0, 0.62] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Diesel four · firing order 1-3-4-2",
        order: [1, 3, 4, 2], bore: 90, stroke: 100, rod: 180,          // rod illustrative
        xs: [-200, -310, -420, -530], crankZ: 380, lean: 0,
        valvetrain: "ohv", ignition: "compression", fuel: "prechamber", crankcase: "open",
        compression: { value: 20.5, min: 6, max: 24 },                   // 20.5 : 1 illustrative (not confirmed)
        speed: { min: 5, max: 60, value: 20 }, realRpm: 3000,
      },
      real: {   // the part in real life (not this car)
        src: "parts/prechamber-ganz.jpg", w: 800, h: 837,
        alt: "Sectioned cylinder head of a 1934 Ganz–Jendrassik diesel engine, painted red at the cuts, with the small combustion chamber beside the cylinder",
        caption: "A 1934 Ganz–Jendrassik diesel head, cut open: the Hungarian engine also has a small chamber beside the cylinder, joined to it by a narrow outlet. Where does the fuel first burn in the OM 138? The shapes differ between engines.",
        credit: { author: "Gwafton", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Ganz-Jendrassik_combustion_chamber.JPG" },
      },
      talk: [
        "Shown at the Berlin motor show in February 1936: the first diesel car built in series, often used as a taxi.",
        "The OM 138 engine: four cylinders, 90 × 100 mm, 2,545 cm³, 45 PS at 3,000 rpm. Few petrol cars went further on a tank.",
        "Fuel is not injected into the cylinder itself but into a small prechamber in the head. It starts burning there and shoots into the cylinder, which made the diesel smooth and quiet enough for a car.",
        "Bosch supplied the injection pump. Slide the compression ratio down to petrol values and the air no longer gets hot enough to light the fuel.",
      ],
    },
  ],
  note: "Legend 3 is the room of diesel and supercharger: the 260 D and the SSK and 540 K blowers are two answers to the same question of more power and range.",
  unverified: ["Compression ratio 20.5 : 1", "Valve gear drawn as pushrod overhead valves", "Conrod length, cylinder spacing, engine position", "Wheelbase and ghost-body outline", "Photo camera fitted from both right road wheels, the lamps, the grille and an estimated roof height (about 20 px off), so the overlay is approximate", "One source gives 3,200 rpm for the rated speed"],
  sources: [
    { label: "Wikipedia: Mercedes-Benz OM 138", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_OM_138" },
    { label: "Wikipedia: Mercedes-Benz 260 D", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_260_D" },
    { label: "ingenieur.de: Mercedes 260 D, the first diesel in a series car", url: "https://www.ingenieur.de/technik/fachbereiche/verkehr/mercedes-260-d-der-erste-dieselmotor-in-einem-serien-pkw/" },
  ],
};
