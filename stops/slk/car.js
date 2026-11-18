// Mercedes-Benz SLK (R 170), 1996–2004. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Wheelbase and body size from the data sheet; roof panel points, pivot positions and the order of the movements
// illustrative (side view, sized to the body).
// No photo yet: the Commons file first chosen (52573339856) shows an SLK rebuilt with a 300 SL-style body. Candidate:
// https://commons.wikimedia.org/wiki/File:1997_Mercedes-Benz_R170_SLK_230_Kompressor,_front_right,_07-28-2024.jpg (CC BY-SA 4.0)
export default {
  slug: "slk",
  title: "A roof in the boot",
  name: "Mercedes-Benz SLK",
  year: 1996,
  summary: "A coupé and a roadster in one: the steel “Vario-roof” folds itself into the boot in about 25 seconds.",
  eyebrow: "Mercedes-Benz SLK, 1996",
  lede: "Press a button and the steel roof unlatches, the boot lid swings up, and roof and rear window fold back into the boot as one pack before the lid closes over them. Watch the sequence from the side.",
  orbit: { min: 0.5, max: 14 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[800, 280], [820, 600], [450, 720], [-700, 870], [-3000, 900], [-3195, 820], [-3180, 300]], y: [-857, 857] },   // body
      { pts: [[-700, 870], [-1050, 1240], [-1150, 1240], [-850, 870]], y: [-660, 660] },                                       // windscreen
      { torus: { R: 245, r: 70, pos: [0, 745, 310], rot: [90, 0, 0] }, mirror: true },                                         // wheels
      { torus: { R: 245, r: 75, pos: [-2400, 735, 310], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  components: [
    {
      id: "roof", label: "Vario-roof", subsystem: "vario-roof",
      view: { pos: [-1.6, -5.4, 1.6], target: [-2, 0, 0.9] },
      ghost: { fill: 0.06, edge: 0.5 },
      params: {
        label: "Folding the steel roof",
        roof: {
          A: [-1050, 1240], J: [-1700, 1270], D: [-2280, 940], P: [-2150, 700],      // illustrative
          phi: 2.094, psi: -2.025,                                                    // 120° and −116°
          lid: { hinge: [-3150, 900], front: [-2250, 930], open: 1.309 },            // 75°
          phases: [["latch", 3], ["lid-open", 5], ["fold", 12], ["lid-close", 5]],    // seconds, illustrative split of the quoted time
        },
        boot: { x0: -3150, x1: -2150, z0: 350, z1: 950 }, width: 1300, quoted: 25,
      },
      talk: [
        "Folding steel hardtops had been tried before, but the SLK of 1996 brought one to a series-production car: closed, it is a coupé with a fixed roof's quiet and security; open, a roadster.",
        "The roof is two pieces: the panel over the seats and the rear-window section. Opening, hydraulic cylinders swing the boot lid up about its rear hinge, then turn the rear section backwards and down, carrying the roof, which folds onto it.",
        "The pack ends up stacked in the boot, and the lid closes over it. With the roof down, less luggage space is left.",
        "The whole sequence takes about 25 seconds, driven by a hydraulic pump and switched step by step by sensors at each position.",
      ],
    },
  ],
  note: "No museum photo of the SLK was available under a free licence; this photo shows an SLK 230 Kompressor photographed elsewhere.",
  unverified: [
    "Roof panel points, pivot positions and the order and timing of the movements",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Photo not taken in the museum",
    "Room: Legend 6",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz SLK-Class (R170)", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_SLK-Class_(R170)" },
  ],
};
