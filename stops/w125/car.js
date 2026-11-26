// Mercedes-Benz W 125 twelve-cylinder record car, 1938. Frame: mm, x forward, y left, z up; origin = front axle centre on
// the ground. Wheelbase assumed (2,800); outline sketched from the side photo. Heat into the cooling water, ice and water
// masses illustrative.
export default {
  slug: "w125",
  title: "Cooled by ice",
  name: "Mercedes-Benz W 125 record car",
  year: 1938,
  summary: "The streamliner that reached 432.7 km/h on a public road, its engine cooled by a tank of ice so the nose could stay closed.",
  question: "Why would a record car carry ice?",
  eyebrow: "Mercedes-Benz W 125 twelve-cylinder record car, 1938",
  lede: "A radiator needs air streaming through it, and that air costs drag. For a run of a few kilometres, the W 125 record car did without: its cooling water ran through a tank of ice, and the nose stayed almost closed. Choose the length of the run and watch the ice melt, then the water warm.",
  look: "Look at the nose: two small openings where a racing car would have a large radiator grille, and the wheels hidden under smooth fairings.",
  takeaway: "Melting ice soaks up heat without getting warmer, enough for a short record run, and a closed nose meant much less drag.",
  orbit: { min: 0.5, max: 16 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[1030, 450], [900, 700], [300, 880], [-1500, 950], [-2100, 1050], [-2800, 1000], [-4750, 560], [-4500, 300], [-3000, 150], [0, 150], [800, 250]], y: [-850, 850] },   // body (sketched)
      { torus: { R: 300, r: 80, pos: [0, 720, 380], rot: [90, 0, 0] }, mirror: true },                       // wheels, inside their fairings
      { torus: { R: 300, r: 80, pos: [-2800, 720, 380], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Silver streamlined Mercedes-Benz W 125 record car with enclosed wheels and a small cockpit bubble, seen from above on the museum's banked curve",
    cam: { c: [-2318.9, 7741.7, 2354.9], yaw: -1.5161, pitch: -0.2153, roll: -0.0142, f: 1173.6 }, // tools/photo-fits/w125.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_W125_1938_Zw%C3%B6lfzylinder-Rekordwagen_Rudolf_Caracciola_LSide_MBMuse_9June2013_(14980483871).jpg" },
  },
  components: [
    {
      id: "ice", label: "Ice cooling", subsystem: "ice-cooling",
      prompt: "Make the run longer than a record needs. When does the ice run out, and what happens after?",
      answer: "At about 4 km at this speed, in this model. Then the water warms with nothing to cool it and boils after about 12 km. A record attempt needed a few kilometres to reach speed, the measured kilometre and the braking: the ice was enough, and the closed nose saved the drag of air through a radiator.",
      view: { pos: [1.2, 2.9, 1.9], target: [-0.5, 0, 0.5] },
      ghost: { fill: 0.03, edge: 0.35 },
      params: {
        label: "Full power at 432 km/h, cooled by ice",
        heat: 300e3, kmh: 432, ice: 30, water: 20, time: 4,   // heat, ice and water illustrative
        run: { min: 2, max: 20, value: 6 },
        engine: { x: -1300, z: 500, l: 1000, w: 600, h: 450 }, tank: { x: 450, z: 450, l: 500, w: 500, h: 380 },   // positions illustrative
      },
      talk: [
        "On 28 January 1938 Rudolf Caracciola drove this car over a flying kilometre on the autobahn between Frankfurt and Darmstadt, in both directions, at an average of 432.7 km/h. No faster time was set on a public road until 2017.",
        "Its supercharged V12 gave over 700 PS. Most of the heat it could not turn into work went into the cooling water, hundreds of kilowatts at full power.",
        "Instead of a radiator, the water passed through a tank of ice. Ice stays at 0 °C while it melts, and every kilogram that melts takes up a lot of heat. The idea came from the aviation research institute DVL in Berlin-Adlershof.",
        "With no air needed for a radiator, the nose could stay almost closed: much less drag, at the cost of a range of only a few kilometres before the ice was gone.",
      ],
    },
  ],
  note: "The record, its date and place are documented. How much heat went into the water, and how much ice and water the tank held, are round numbers chosen to show the principle.",
  unverified: [
    "Heat into the cooling water at full power (300 kW)",
    "Ice and water in the tank (30 kg and 20 kg)",
    "Positions of engine and tank, wheelbase and the outline (sketched from the photo)",
    "Camera fit: the wheels are hidden in fairings (hubs taken at the fairing centres)",
  ],
  sources: [
    { label: "Mercedes-Benz: the W 125 record car and the T 80", url: "https://media.mercedes-benz.com/en/article/f9a48175-8964-490e-9909-9f35cbea8a6f" },
    { label: "Mercedes-Benz Italia: the W 125 in Legend 7 (2018)", url: "https://media.mercedes-benz.it/mercedes-benz-w-125-inesauribile-fonte-dispirazione/" },
    { label: "mbpassion: 432.7 km/h on a public road (ice cooling, DVL)", url: "https://mbpassion.de/2018/01/caracciolas-4327-km-h-auf-oeffentlicher-strasse-ein-mercedes-benz-rekord-fast-fuer-die-ewigkeit/" },
    { label: "Wikipedia: Mercedes-Benz W125 Rekordwagen", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_W125_Rekordwagen" },
  ],
};
