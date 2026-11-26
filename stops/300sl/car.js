// Mercedes-Benz 300 SL "Gullwing" (W 198), 1954. Frame: mm, x forward, y left, z up; origin = front axle centre on the
// ground. Frame nodes, tube section, conrod and engine position are illustrative.
export default {
  slug: "300sl",
  title: "Why the doors open upwards",
  name: "Mercedes-Benz 300 SL Gullwing",
  year: 1954,
  summary: "A frame of thin welded tubes that runs high through the door area, so the doors had to hinge from the roof; and the first four-stroke petrol engine with direct injection in a production car.",
  eyebrow: "Mercedes-Benz 300 SL Coupé (W 198), 1954–1957",
  question: "Why do its doors open upwards?",
  look: "Look at the high sill beneath the open door. Imagine climbing over it.",
  takeaway: "Look again at the metal you would have to step over: that sill is the frame doing its job.",
  lede: "Twist the 300 SL's tube frame as if one front wheel rode up a kerb, then cut its sides down for ordinary doors and twist it again. Then turn over its straight-six, laid over on its side, with fuel sprayed straight into the cylinders.",
  frame: { origin: "front", wheelbase: 2400, wheelR: 330 },
  orbit: { min: 0.6, max: 14 },
  sun: [3, -3, 6],
  body: {
    ghost: [
      { pts: [[950, 300], [930, 600], [500, 760], [-900, 830], [-3150, 860], [-3570, 680], [-3570, 300]], y: [-880, 880] },   // body
      { pts: [[-900, 830], [-1250, 900], [-1650, 1300], [-2450, 1300], [-3150, 860]], y: [-620, 620] },                       // cabin
      { torus: { R: 260, r: 70, pos: [0, 720, 330], rot: [90, 0, 0] }, mirror: true },
      { torus: { R: 260, r: 70, pos: [-2400, 730, 330], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Silver 1955 Mercedes-Benz 300 SL Gullwing with its doors open in the Mercedes-Benz Museum, seen from the front right",
    cam: { c: [2660.9, -3343.7, 2178], yaw: 2.3898, pitch: -0.3126, roll: -0.0502, f: 1327.5 }, // tools/photo-fits/300sl.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_300SL_1955_Fl%C3%BCgelt%C3%BCren_Gullwing_Coup%C3%A8_RSideFront_MBMuse_9June2013_(14797075767).jpg" },
  },
  components: [
    {
      id: "frame", label: "Space frame", subsystem: "space-frame",
      prompt: "What would happen if those tubes were low enough for an ordinary door? Switch the frame and compare.",
      answer: "With the sides cut down, this model keeps only about a third of its stiffness. The tall tubes give the real car its high sill, so the doors hinge from the roof.",
      more: "Frame loads and stiffness",
      view: { pos: [1.4, -3.3, 2.5], target: [-1.15, 0, 0.35] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Twisting the frame",
        stations: [                                             // x, half width, z of floor / sill / top tubes; illustrative
          { x: 300, w: 380, z: [200, 260, 560] }, { x: -350, w: 560, z: [180, 260, 600] }, { x: -900, w: 600, z: [180, 260, 600] },
          { x: -1450, w: 600, z: [180, 260, 600] }, { x: -1950, w: 560, z: [200, 260, 560] }, { x: -2600, w: 520, z: [220, 260, 520] },
        ],
        bays: [{ top: true }, { door: "high" }, { door: "high" }, { top: true }, { top: true }],
        EA: 210000 * 75,                                       // steel tube of about 75 mm² section (N); illustrative
        load: 3000, exaggerate: 8,
        modes: { high: "Original high sill", low: "Lower sill for conventional doors" },
      },
      real: {   // the part in real life (not this car)
        src: "parts/300sl-frame.jpg", w: 800, h: 533,
        alt: "The bare black tube frame of a 300 SL on display in the Mercedes-Benz Museum",
        caption: "The bare frame of a 300 SL, photographed in this museum in 2013. See how high the side tubes run where a door would be.",
        credit: { author: "Morio", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_W198_space_frame_chassis_front-left_2013_Mercedes-Benz_Museum.jpg" },
      },
      talk: [
        "Rudolf Uhlenhaut's engineers built the 1952 racing 300 SL around a frame of thin welded steel tubes, arranged in triangles so that each tube is only pulled or pushed, never bent. The road car of 1954 kept it.",
        "Red tubes are in tension, blue in compression. The sides stay stiff only because their triangles run deep, right up through where a door would be.",
        "So the doors are hinged in the roof and open upwards: the Gullwing. Getting in still means climbing over a high, wide sill.",
        "Cut the sides down to a low sill and the same frame twists about three times as much under the same load (in this simple model).",
      ],
    },
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      prompt: "Now follow the bonnet towards the nose. How did a tall six-cylinder engine fit under that low line?",
      answer: "It lies 45° over to the left, so the bonnet could sit low. Fuel is sprayed straight into each cylinder: watch for the spray.",
      more: "Fuel injection and engine timing",
      view: { pos: [0.55, -0.95, 1.25], target: [-0.35, 0.1, 0.45] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Straight-six, direct injection · firing order 1-5-3-6-2-4",
        order: [1, 5, 3, 6, 2, 4], bore: 85, stroke: 88, rod: 145,      // rod illustrative
        xs: [-100, -200, -300, -400, -500, -600], crankZ: 330,           // positions illustrative
        lean: -45,                                                      // laid over to the left
        valvetrain: "ohc", ignition: "spark", fuel: "direct", crankcase: "open",
        speed: { min: 5, max: 60, value: 20 }, realRpm: 5800,
      },
      talk: [
        "The M 198 is the 3-litre six of the 300 saloon, reworked: 2,996 cm³, 215 PS (DIN) at 5,800 rpm, 240 hp by the American SAE rating.",
        "A Bosch pump sprays petrol straight into each cylinder during the intake stroke: the first four-stroke production car with petrol direct injection. Watch for the spray.",
        "The engine leans 45° to the left so that the bonnet could sit low. A dry sump, with the oil in a separate tank, keeps the crankcase shallow.",
      ],
    },
    {
      id: "balance", label: "Engine balance", subsystem: "inline-engine",
      prompt: "How can six moving pistons leave the engine balanced? Press “Step 30°” and follow the arrows: pistons 1 and 6 move together.",
      answer: "The cylinders work in mirror pairs, 1 and 6, 2 and 5, 3 and 4, a third of a turn apart: their pushes cancel, once per turn and twice per turn, and so does the rocking about the middle. An inline four's twice-per-turn pushes add up instead.",
      more: "Engine timing",
      view: { pos: [0.75, -1.25, 1.35], target: [-0.35, 0.1, 0.5] },
      ghost: { fill: 0.02, edge: 0.2 },
      params: {
        label: "Straight-six · shaking forces",
        order: [1, 5, 3, 6, 2, 4], bore: 85, stroke: 88, rod: 145,      // rod illustrative
        xs: [-100, -200, -300, -400, -500, -600], crankZ: 330,           // positions illustrative
        lean: -45, valvetrain: "ohc", ignition: "spark", fuel: "direct", crankcase: "open",
        speed: { min: 5, max: 60, value: 10 }, realRpm: 5800, balance: true,
      },
      real: {   // the part in real life (not this car)
        src: "parts/i6-crankshaft.jpg", w: 760, h: 470,
        alt: "A bare six-cylinder engine block on a pallet, with its crankshaft laid out in front of it",
        caption: "A six-cylinder block and its crankshaft, from an unnamed engine. Trace the first and last crank throws: they point the same way, so pistons 1 and 6 rise together.",
        credit: { author: "Dana60Cummins", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:I6_Block_and_crankshaft.jpg" },
      },
      talk: [
        "The pistons speed up and slow down twice every turn, and push and pull on the block as they do: once per turn from their own up-and-down, twice per turn from the conrod's swing, which makes a piston move faster near the top than near the bottom.",
        "In the straight-six the forces and the rocking about the middle of the block cancel. The 190 E's four cancels the once-per-turn pushes, but its twice-per-turn ones all point the same way: a four buzzes at high revs, a six runs smooth.",
        "Balanced is not the same as steady: the crank still gets a power stroke every third of a turn, at different places along its length, and the driveline carries those torque pulses.",
      ],
    },
  ],
  note: "1,400 coupés were built from 1954 to 1957. The idea for a road version came from the American importer Max Hoffman.",
  unverified: ["Frame node positions and tube section; the threefold stiffness loss is this model's result, not a measurement", "Conrod length and engine position", "Shaking forces: equal piston masses and an evenly spaced, symmetric crank", "Ghost-body outline"],
  sources: [
    { label: "Mercedes-Benz public archive: 300 SL (W 198 I)", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/300-SL--W-198-I-1954---1957.xhtml?oid=4699" },
    { label: "Wikipedia: Mercedes-Benz 300 SL", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_300_SL" },
    { label: "Autocade: Mercedes-Benz 300 SL (W198)", url: "https://autocade.net/index.php/Mercedes-Benz_300SL_(W198)" },
  ],
};
