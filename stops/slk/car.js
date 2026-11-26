// Mercedes-Benz SLK (R 170), 1996–2004. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Wheelbase and body size from the data sheet; roof panel points, pivot positions and the order of the movements
// illustrative (side view, sized to the body).
// Photo: no freely licensed photo of an SLK in the museum was found (Commons, Flickr CC; the yellow SLK 230 of the
// 2025 Youngtimer exhibition is only on all-rights-reserved photos), so a public-domain street photo of a 1997–2000 car
// stands in. Ghost outline traced from it (tools/profile-traces/slk.json); the tail is out of frame, so the rear end
// comes from the data-sheet length (3995 mm).
export default {
  slug: "slk",
  title: "A roof in the boot",
  name: "Mercedes-Benz SLK",
  year: 1996,
  summary: "A coupé and a roadster in one: the steel “Vario-roof” folds itself into the boot in about 25 seconds.",
  eyebrow: "Mercedes-Benz SLK, 1996",
  question: "Where does a steel roof go when you open it?",
  look: "Find the join between the roof and the rear window: that is where the roof folds.",
  takeaway: "Look at the boot lid: the whole steel roof fits under it, and the owner gives up that much luggage space with the roof down.",
  lede: "Press a button and the steel roof unlatches, the boot lid swings up, and roof and rear window fold back into the boot as one pack before the lid closes over them. Watch the sequence from the side.",
  orbit: { min: 0.5, max: 14 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[865, 250], [860, 390], [840, 480], [770, 680], [150, 820], [-760, 920], [-2050, 975], [-2490, 958],
        [-3000, 920], [-3150, 840], [-3150, 320], [-1780, 320], [-450, 305], [520, 265]], y: [-857, 857] },                   // body (rear from the length)
      { pts: [[-760, 920], [-1005, 1240], [-1100, 1245], [-860, 920]], y: [-660, 660] },                                       // windscreen
      { torus: { R: 245, r: 70, pos: [0, 745, 310], rot: [90, 0, 0] }, mirror: true },                                         // wheels
      { torus: { R: 245, r: 75, pos: [-2400, 735, 310], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 662,
    caption: "Reference photo of the same generation, not the museum's car",
    alt: "Silver first-generation Mercedes-Benz SLK with its steel roof closed, parked in a street, seen from the front left",
    cam: { c: [9821.6, 6160.6, 1071.1], yaw: 3.6683, pitch: -0.0335, roll: 0.0204, f: 4854.1 }, // tools/photo-fits/slk.json
    credit: { author: "IFCAR", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:1st_Mercedes-Benz_SLK.jpg" },
  },
  components: [
    {
      id: "roof", label: "Vario-roof", subsystem: "vario-roof",
      prompt: "Tap “Open the roof”. Which moves first, the boot lid or the roof?",
      answer: "The lid goes up first; then the rear window turns back, the roof folds onto it, and the pack drops into the boot before the lid closes. The price: with the roof down, much of the boot is taken.",
      more: "How the roof folds",
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
      real: {   // the part in real life (not this car)
        src: "parts/slk-roof-fold.jpg", w: 560, h: 360,
        alt: "Side view of a black Mercedes-Benz SLK 230 with its folding hardtop halfway into the raised boot lid",
        caption: "An SLK 230 of the same R 170 series, caught mid-fold: the boot lid stands open at the back, the roof panel and rear window are swinging into the gap. Why does the boot lid open first?",
        credit: { author: "Cerafino", license: "CC BY-SA 2.5", url: "https://commons.wikimedia.org/wiki/File:Slk_mb170_offen.jpg" },
      },
      talk: [
        "Folding steel hardtops had been tried before, but the SLK of 1996 brought one to a series-production car: closed, it is a coupé with a fixed roof's quiet and security; open, a roadster.",
        "The roof is two pieces: the panel over the seats and the rear-window section. Opening, hydraulic cylinders swing the boot lid up about its rear hinge, then turn the rear section backwards and down, carrying the roof, which folds onto it.",
        "The pack ends up stacked in the boot, and the lid closes over it. With the roof down, less luggage space is left.",
        "The whole sequence takes about 25 seconds, driven by a hydraulic pump and switched step by step by sensors at each position.",
      ],
    },
  ],
  note: "No freely licensed photo of the SLK in the museum was available; this photo shows a 1997–2000 SLK photographed in a street in Washington, D.C.",
  unverified: [
    "Roof panel points, pivot positions and the order and timing of the movements",
    "Ghost-body outline (traced from the photo; the tail, out of frame, from the data-sheet length)",
    "Photo not taken in the museum",
    "Room: Legend 6",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz SLK-Class (R170)", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_SLK-Class_(R170)" },
  ],
};
