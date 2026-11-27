// Mercedes-Benz 230 G "Papamobil", 1980. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Wheelbase, axle torque, wheel loads, friction values and dimensions are illustrative.
export default {
  slug: "papamobil",
  title: "Why one wheel spins",
  name: "Mercedes-Benz 230 G Popemobile",
  year: 1980,
  summary: "The G-Class built for Pope John Paul II's visit to Germany, and the differential lock that gets a G out of a slippery spot.",
  eyebrow: "Mercedes-Benz 230 G 'Papamobil', 1980",
  lede: "Put one rear wheel on ice. With an open differential that wheel spins and the car does not move. Lock the differential and the wheel on dry ground pulls the car away.",
  frame: { origin: "front", wheelbase: 2850, wheelR: 360 },
  orbit: { min: 0.8, max: 16 },
  sun: [3, -4, 6],
  body: {
    ghost: [
      { pts: [[850, 400], [850, 1150], [-1100, 1200], [-1300, 1900], [-1700, 1950], [-1700, 1200], [-3800, 1200], [-3800, 400]], y: [-880, 880] },   // body and cab
      { pts: [[-1700, 1200], [-1750, 2350], [-3650, 2350], [-3750, 1200]], y: [-800, 800] },                                                     // glass superstructure
      { torus: { R: 260, r: 100, pos: [0, 712, 360], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "White 1980 Mercedes-Benz 230 G Popemobile with its glass cabin, in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [2128, 1391.8, 1209.5], yaw: -2.5841, pitch: 0.0035, roll: 0.0298, f: 716 }, // tools/photo-fits/papamobil.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_230G_1980_Popemobile_LSideFront_MBMuse_9June2013_(14983627965).jpg" },
  },
  components: [
    {
      id: "diff", label: "Differential lock", subsystem: "differential",
      view: { pos: [-4.6, 1.4, 1.2], target: [-2.85, 0, 0.3] },
      ghost: { fill: 0.05, edge: 0.4 },
      params: {
        label: "Rear axle, one wheel on ice", mode: "grip",
        halfTrack: 712, wheelR: 360, axleX: -2850, wheel: "tyre", tyreW: 105, ringR: 120, drive: "crown",
        grip: { torque: 1500, normal: 5400, muLow: 0.1, muHigh: 0.8, resist: 2500, surface: "ice", locks: true },   // illustrative
      },
      real: {   // the part in real life (not this car)
        src: "parts/differential.jpg", w: 800, h: 600,
        alt: "A car's rear differential with part of its casing cut away, showing the crown wheel and the small bevel gears inside it",
        caption: "A rear differential cut open. Inside the big crown wheel, small bevel gears let the two half-shafts turn at different speeds; a differential lock stops them doing that.",
        credit: { author: "DrJunge", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Differentialgetriebe2.jpg" },
      },
      talk: [
        "Pearl white with gold trim and a transparent rear superstructure, this 230 G was lent to the Vatican for Pope John Paul II's visit to Germany in 1980. From 1981 it had bullet-proof glass.",
        "Underneath it is a G-Class, the off-road vehicle built with Steyr-Daimler-Puch from 1979, with four-wheel drive engaged by the driver.",
        "An open differential always splits the drive equally between its two wheels. If one wheel is on ice it can only take a little, so the other gets just as little, and the car stays where it is while the ice wheel spins.",
        "A differential lock joins both half-shafts solid. Now the wheel with grip can take most of the drive. The G could have locks on both axles, standard from 1985.",
      ],
    },
  ],
  note: "Whether this car has differential locks is not known: they were optional on the early G. The Popemobile is shown in the Gallery of Celebrities (Collection 4).",
  unverified: ["Wheelbase (long or short G)", "Axle torque, wheel loads, friction values and the force needed to move off", "Whether this car has differential locks", "Ghost-body outline"],
  sources: [
    { label: "Mercedes-Benz press text: Popemobile premiere 40 years ago (German Car Forum)", url: "https://www.germancarforum.com/threads/premiere-40-years-ago-popemobile-based-on-the-mercedes-benz-g-class.60714/latest" },
    { label: "Motor1: 40 Jahre Mercedes G Papamobil", url: "https://de.motor1.com/news/434099/40-jahre-mercedes-g-papamobil/" },
    { label: "Wikipedia: Mercedes-Benz G-Class", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_G-Class" },
    { label: "Mercedes-Benz Museum media information", url: "https://www.mercedes-benz.com/content/dam/brandhub/assets/art-and-culture/mercedes-benz-museum/museum/Media-Information-Mercedes-Benz-Museum-EN.pdf" },
  ],
};
