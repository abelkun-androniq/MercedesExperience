// Mercedes-Benz 220 S (W 111), 1959. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Mass, crush forces and stiffnesses, body dimensions are illustrative. The ghost body is drawn only over the photo:
// in the 3D view the crash body moves.
export default {
  slug: "220s",
  title: "Crumple zones and a rigid cell",
  name: "Mercedes-Benz 220 S",
  year: 1959,
  summary: "The 'Fintail' saloon: the first car built to Béla Barényi's safety body, with a rigid passenger cell between crumple zones.",
  eyebrow: "Mercedes-Benz 220 S (W 111), 1959",
  lede: "Drive the car into a wall in slow motion. The front folds up and takes the energy over half a metre while the cell stays whole. Then try a stiff front: it stops sooner, which is worse for the people inside.",
  frame: { origin: "front", wheelbase: 2750, wheelR: 340 },
  orbit: { min: 0.8, max: 16 },
  sun: [3, -4, 6],
  body: {
    ghost: [                                                                    // outline for the photo view; illustrative
      { pts: [[950, 300], [960, 760], [650, 830], [-650, 900], [-3200, 960], [-3925, 1010], [-3925, 330], [-3200, 300],
        { arc: [-2750, 340, 400, 192, -12] }, [-400, 300], { arc: [0, 340, 400, 192, -12] }], y: [-890, 890] },
      { pts: [[-650, 900], [-1150, 1470], [-2350, 1480], [-3050, 960]], y: [-700, 700] },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Cream 1964 Mercedes-Benz 220 S (W 111) on display in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [5378.5, 1864.4, 1708.1], yaw: -2.8155, pitch: -0.1618, roll: 0.005, f: 1624.7 }, // tools/photo-fits/220s.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_220S_1964_LSideFront_MBMuse_9June2013_(14960636166).jpg" },
  },
  components: [
    {
      id: "crash", label: "Crash test", subsystem: "crumple-zone",
      view: { pos: [2.4, -4.6, 2.2], target: [-0.9, 0, 0.6] },
      ghost: { fill: 0, edge: 0 },
      params: {
        label: "Frontal crash into a rigid wall",
        mass: 1350,                                             // kg with occupants; illustrative
        speed: { min: 20, max: 65, value: 50 }, slow: 40,
        cases: [
          { id: "safe", label: "Safety body: crumple zone", zone: { type: "crumple", force: 280e3, length: 0.6, ramp: 0.06 }, cellK: 8e6 },   // illustrative
          { id: "rigid", label: "Stiff front", zone: { type: "stiff", k: 2.6e6, length: 0.3 }, cellK: 2.5e6 },                                // illustrative
        ],
        folds: 6,
        body: { bumper: 950, firewall: -250, cellRear: -2350, tail: -3950, w: 880, sill: 250, belt: 900, roof: 1450 },
        wheels: { front: 0, rear: -2750, R: 340 },
      },
      talk: [
        "Béla Barényi patented the idea in 1951 (DBP 854 157): a rigid passenger cell, with front and rear sections built to fold up in a controlled way.",
        "The W 111 saloon of 1959 was the first car built that way. On 10 September 1959 Mercedes ran its first crash test at Sindelfingen, driving a W 111 into a solid barrier.",
        "Stopping from 50 km/h always means getting rid of the same energy. A long, soft crush does it with a lower force, so the people inside feel less deceleration. Compare the peak g of both fronts.",
        "The stiff front stops in a shorter distance at a far higher force, and pushes into the cell itself.",
      ],
    },
  ],
  note: "Real crush behaviour is far more ragged than this model's nearly constant force. The fins at the back gave the car its nickname 'Heckflosse'.",
  unverified: ["Mass, crush forces, crush lengths and stiffnesses (chosen to give plausible g values)", "Body dimensions and ghost-body outline", "Which W 111 variant is on display (the photo shows a 1964 220 S)"],
  sources: [
    { label: "Mercedes-Benz press text: the passenger safety cell is patented (German Car Forum)", url: "https://www.germancarforum.com/threads/mercedes-benz-23-january-1951-the-passenger-safety-cell-is-patented.36023" },
    { label: "Motorway America: Mercedes-Benz marks 50 years of crash testing", url: "https://www.motorwayamerica.com/content/mercedes-benz-marks-50-years-crash-testing-first-car" },
    { label: "Tecosim: history of crash tests", url: "https://tecosim.com/history-of-crash-tests/" },
    { label: "Wikipedia: Mercedes-Benz W111", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_W111" },
  ],
};
