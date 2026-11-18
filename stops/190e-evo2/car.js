// Mercedes-Benz 190 E 2.5-16 Evolution II, DTM racing car, 1992 (Klaus Ludwig). Frame: mm, x forward, y left, z up;
// origin = front axle centre on the ground. Drag coefficients, power and top speeds are those quoted for the road cars;
// frontal areas, masses, rolling resistance and driveline efficiency illustrative.
export default {
  slug: "190e-evo2",
  title: "A wing that cuts drag",
  name: "Mercedes-Benz 190 E 2.5-16 Evolution II",
  year: 1992,
  summary: "The DTM homologation special whose wings and spoilers, shaped in the wind tunnel, gave it less drag than the plain 2.3-16.",
  eyebrow: "Mercedes-Benz 190 E Evolution II, 1992",
  lede: "Its huge rear wing looks as if it must slow the car down. Wind-tunnel work on the whole body kit did the opposite: less drag than the earlier 2.3-16, and less lift too. Run both flat out and watch where engine power meets drag.",
  orbit: { min: 0.5, max: 16 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[935, 120], [935, 260], [915, 440], [870, 560], [798, 618], [435, 674], [48, 744], [-337, 814], [-3117, 860], [-3407, 844],
        [-3696, 816], [-3760, 700], [-3800, 450], [-3790, 200], [-3700, 120]], y: [-850, 850] },   // body, traced from the photo (see flow)
      { pts: [[-337, 814], [-530, 972], [-817, 1168], [-1102, 1305], [-1575, 1347], [-2049, 1356], [-2429, 1330], [-2671, 1203], [-2918, 1017],
        [-3117, 860]], y: [-720, 720] },   // roof and glass
      { pts: [[-3200, 900], [-3250, 1120], [-3600, 1150], [-3600, 1050]], y: [-750, 750] },                                     // rear wing
      { torus: { R: 255, r: 80, pos: [0, 745, 320], rot: [90, 0, 0] }, mirror: true },                                         // wheels
      { torus: { R: 255, r: 80, pos: [-2665, 735, 320], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Klaus Ludwig's 1992 Mercedes-Benz 190 E 2.5-16 Evolution II DTM car, number 3, in the Mercedes-Benz Museum, seen from the left",
    cam: { c: [-1591.1, 5492.5, 1374.7], yaw: -1.5703, pitch: -0.1317, roll: 0.0189, f: 1150.2 }, // tools/photo-fits/190e-evo2.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_190E_1992_2.5-16_AMG_Evolution_II_DTM_Klaus_Ludwig_LSide_MBMuse_9June2013_(14796951839).jpg" },
  },
  components: [
    {
      id: "aero", label: "Aerodynamics", subsystem: "aero",
      view: { pos: [3.4, -6.2, 2.4], target: [-1.3, 0, 0.5] },
      ghost: { fill: 0.06, edge: 0.5 },
      params: {
        label: "Full power on the autobahn",
        shapes: [
          { id: "evo2", label: "Evolution II body kit", cd: 0.29, area: 2.05, mass: 1420, crr: 0.013, eta: 0.82, ps: 235, quoted: 250 },   // area, mass, crr, eta illustrative
          { id: "base", label: "2.3-16 body", cd: 0.32, area: 1.95, mass: 1380, crr: 0.013, eta: 0.82, ps: 185, quoted: 230 },
        ],
        power: { min: 100, max: 400 }, vmax: 300, nose: [935, 400], wheel: [-2665, 0],
        time: 3,
        // Centre-plane section for the 2-D wind tunnel, traced from the stop photo (a true side view) through its fitted camera
        // (tools/profile-traces/190e-evo2.json); the rear wing is left out and the underside flat. Within about ±10 cm.
        flow: {
          x0: 2300, x1: -8200, top: 3500, cell: 50, show: [-6800, 2600], rake: [100, 2300, 22],
          profile: [[935, 260], [915, 440], [870, 560], [798, 618], [435, 674], [48, 744], [-337, 814], [-530, 972], [-817, 1168], [-1102, 1305],
            [-1575, 1347], [-2049, 1356], [-2429, 1330], [-2671, 1203], [-2918, 1017], [-3117, 877], [-3407, 844], [-3696, 816], [-3760, 700], [-3800, 450],
            [-3790, 200], [-3700, 120], [850, 120], [920, 170]],
        },
      },
      talk: [
        "Touring-car racing rules required a road version of every racing car: 502 Evolution IIs were built in 1990 so that the DTM car could race with its body kit.",
        "The front spoiler, wide wheel arches, sill panels and adjustable rear wing were shaped in the wind tunnel as one system. The result: a drag coefficient of about 0.29 against the 2.3-16's 0.32, and much less lift at speed.",
        "The power needed to push through the air grows with the cube of the speed. With 235 hp the road car reaches about 250 km/h.",
        "This is Klaus Ludwig's DTM car of 1992; the race version had well over 350 hp. Its rear wing adds downforce at the cost of drag.",
        "The wind tunnel shows the slice along the car's centre line. Under Pressure the air presses on the nose and the windscreen and speeds up over the roof; behind the boot it breaks away into a wake that pulls the car back. The rear wing is left out of the slice.",
      ],
    },
  ],
  note: "The aerodynamic figures here are the road cars'; the racing car in the museum was set up for downforce.",
  unverified: [
    "Frontal areas, masses, rolling resistance and driveline efficiency",
    "Race-car power and set-up",
    "Body outline and centre-plane section: traced from the stop photo (a side view) through its fitted camera, about ±10 cm; rear wing left out of the section, underside flat",
    "Wind tunnel: a 2-D slice at a far lower Reynolds number than the real car (about 10⁴ against 10⁷), with the wheels outside it; its drag split is for the slice",
    "Room: Legend 7",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz 190 E 2.5-16 Evolution II", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_190_E_2.5-16_Evolution_II" },
    { label: "D. Schroeder, Lattice-Boltzmann fluid dynamics in the browser", url: "https://physics.weber.edu/schroeder/fluids/" },
  ],
};
