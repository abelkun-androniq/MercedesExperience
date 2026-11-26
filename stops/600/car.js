// Mercedes-Benz 600 Pullman (W 100), 1963–1981. Frame: mm, x forward, y left, z up; origin = front axle centre on the
// ground. Wheelbase and body size from the data sheet; the hydraulic layout, cylinder sizes and accumulator illustrative.
export default {
  slug: "600",
  title: "Silent hydraulics",
  name: "Mercedes-Benz 600 Pullman",
  year: 1965,
  summary: "The state limousine whose windows, seats, sliding roof, boot lid and door closers all ran on one central hydraulic system.",
  eyebrow: "Mercedes-Benz 600 Pullman, 1965",
  lede: "In the 600 there are no electric window motors. A pump on the engine keeps oil at high pressure in an accumulator, and every switch simply opens a valve. Press one and watch the oil push a piston, then the pump top the pressure back up.",
  orbit: { min: 0.5, max: 18 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[1150, 300], [1200, 700], [700, 860], [-650, 920], [-4300, 920], [-5050, 860], [-5100, 600], [-5050, 300]], y: [-975, 975] },   // body
      { pts: [[-650, 920], [-1150, 1480], [-4000, 1480], [-4350, 920]], y: [-830, 830] },                                                       // roof and glass
      { torus: { R: 285, r: 85, pos: [0, 790, 370], rot: [90, 0, 0] }, mirror: true },                                                         // wheels
      { torus: { R: 285, r: 85, pos: [-3900, 790, 370], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Black 1965 Mercedes-Benz 600 Pullman armoured state limousine in the Mercedes-Benz Museum, seen from the front right",
    cam: { c: [3453.3, -2143.6, 1925], yaw: 2.6969, pitch: -0.2863, roll: -0.0712, f: 1461.9 }, // tools/photo-fits/600.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_600_1965_Pullman_Armored_Staatslimousine_RSideFront_MBMuse_9June2013_(14980515881).jpg" },
  },
  components: [
    {
      id: "hydraulics", label: "Comfort hydraulics", subsystem: "comfort-hydraulics",
      view: { pos: [2.6, -6.4, 3.4], target: [-2, 0, 0.7] },
      ghost: { fill: 0.04, edge: 0.4 },
      params: {
        label: "One pump, one accumulator, many cylinders",
        quotedBar: 150,
        system: {
          acc: { gas: 0.0015, precharge: 7000000 },                         // 1.5 l gas, 70 bar precharge: illustrative
          pump: { flow: 0.000033, pMax: 15000000, pMin: 12000000 },         // 2 l/min; cuts in at 120 bar: illustrative
          valve: 0.00005,                                                    // 3 l/min through an open valve: illustrative
        },
        pump: [350, 250, 600], acc: [-300, -450, 420],
        consumers: [
          { id: "window", label: "Rear window", at: [-2900, 780, 520], dir: [0, 0, 1], bore: 0.022, stroke: 0.4, load: 400, part: [700, 10, 380] },
          { id: "seat", label: "Front seat", at: [-1700, 420, 330], dir: [1, 0, 0], bore: 0.025, stroke: 0.15, load: 900, part: [500, 500, 120] },
          { id: "roof", label: "Sliding roof", at: [-2600, 0, 1440], dir: [-1, 0, 0], bore: 0.02, stroke: 0.5, load: 300, part: [600, 700, 10] },
          { id: "boot", label: "Boot lid", at: [-4700, 0, 650], dir: [0, 0, 1], bore: 0.025, stroke: 0.2, load: 1000, part: [700, 900, 10] },
          { id: "door", label: "Door closer", at: [-2500, -700, 500], dir: [0, -1, 0], bore: 0.025, stroke: 0.08, load: 500, part: [400, 10, 300] },
        ],
      },
      real: {   // the part in real life (not this car)
        src: "parts/citroen-accumulator.jpg", w: 800, h: 755,
        alt: "A Citroën suspension sphere cut in half beside a folding rule: a thick rubber diaphragm divides the gas space above from the oil space below",
        caption: "A Citroën suspension sphere, cut open. The rubber diaphragm separates the gas (above) from the oil (below): squeezed gas is what pushes the oil out while the pump is idle. Citroën uses the gas cushion as a spring; the 600 uses the stored pressure to move its windows and seats.",
        credit: { author: "Nutzdatenbegleiter", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Cit-hydraulic-accumulator.jpg" },
      },
      talk: [
        "An engine-driven pump charges a gas-filled accumulator to about 150 bar. From there, pipes run to small hydraulic cylinders at the windows, the seats, the sliding roof and the boot lid, and to the closers that pull the doors shut.",
        "Each switch opens a valve: oil from the accumulator pushes the piston and the window rises, silently, with no electric motor in the door. The gas cushion means the pump does not have to run while you press.",
        "As oil leaves, the gas expands and the pressure drops. Below a set level the pump cuts in again and refills the accumulator.",
        "At 150 bar, a piston two centimetres across pushes with several kilonewtons: far more than a window needs, so it moves smoothly at a speed set by the valve.",
      ],
    },
  ],
  note: "The museum's car is an armoured Pullman state limousine. The cylinder sizes and pipe layout here are a sketch of the principle, not the 600's drawings.",
  unverified: [
    "Accumulator size and precharge, pump flow, valve flow and cut-in pressure",
    "Cylinder sizes, strokes and positions in the car",
    "Hydraulic door closers (named in the research notes)",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Legend 5",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz 600", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_600" },
  ],
};
