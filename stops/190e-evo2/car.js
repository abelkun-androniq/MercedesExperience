// Mercedes-Benz 190 E 2.5-16 Evolution II, DTM racing car, 1992 (Klaus Ludwig). Frame: mm, x forward, y left, z up;
// origin = front axle centre on the ground. Drag coefficients, power and top speeds are those quoted for the road cars;
// frontal areas, masses, rolling resistance and driveline efficiency illustrative.
export default {
  slug: "190e-evo2",
  title: "Paying drag for grip",
  name: "Mercedes-Benz 190 E 2.5-16 Evolution II",
  year: 1992,
  summary: "The DTM homologation special whose wings and spoilers, shaped in the wind tunnel, gave it less drag than the plain 2.3-16.",
  question: "Why would a racing driver accept more drag?",
  eyebrow: "Mercedes-Benz 190 E Evolution II, 1992",
  lede: "Klaus Ludwig's DTM car carries a rear wing with an adjustable upper flap, a front lip that slides forward and flared wheel arches. A 3-D wind tunnel, computed ahead of time for a simplified model of this car, shows what the wing flap and the front lip do to the air and to the load on each axle.",
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
      id: "race-aero", label: "Racing aerodynamics", subsystem: "race-aero",
      prompt: "Why would a racing driver accept more drag? Raise the wing flap and compare the arrows with the baseline.",
      answer: "In this model, raising the flap presses the rear axle down by about 34 kg more at 200 km/h (25 to 43 kg on its two grids) and costs about 9 kW more of the engine's power in drag (4 to 14 kW); the front axle hardly changes. The extra rear load is grip and stability in fast bends, the drag is speed lost on the straights: the circuit decides which matters more. These are the simplified model's figures, not the real car's.",
      view: { pos: [3.2, 4.6, 2.7], target: [-1.5, 0, 0.55] },
      ghost: { fill: 0.05, edge: 0.45 },
      params: {
        label: "Wind tunnel at 200 km/h",
        data: "stops/190e-evo2/cfd/", speed: 200, start: "flap",
        // Cases computed by tools/cfd (geometry.mjs CASES); flap and lip sizes illustrative.
        cases: [
          { id: "base", label: "Baseline", say: "The car as modelled: the reference for the other two." },
          { id: "flap", label: "Wing flap up", part: [-3620, 450, 1170], say: "The raised flap throws the air behind the car further upward: the streamlines over the boot rise and the suction around the wing deepens. The rear axle is pressed down harder, and drag grows." },
          { id: "lip", label: "Lip forward", part: [960, 450, 150], say: "The lip reaches further into the high-pressure air in front of the nose. Its effect stays within the tunnel's noise, so the readouts show –: both grids hint at slightly less downforce overall (about 16 kg) and no clear gain at the front. A lip a few centimetres deep is only one or two of the model's 28 mm blocks." },
        ],
      },
      talk: [
        "The racing car's rear wing has an upper flap that can be raised, and its front lip has two positions. Teams set them for each circuit: more downforce for fast bends, less drag for long straights.",
        "Downforce presses the tyres onto the road. More load gives more grip in a bend, so the car can corner faster; the price is drag, which costs speed on the straight that follows.",
        "Where the load lands matters as much as how much there is. Load at the rear keeps the back of the car stable; load at the front helps the car turn in. The arrows show the change at each axle, worked out from the whole car's lift and pitching moment.",
        "The flared arches make room for wide tyres. Trimming them back to 15 mm outside the tyre was also tried, but that is finer than the model's 28 mm blocks: the blocky car came out unchanged, so it has no button here.",
        "The model is a game mesh of the Evo II filled in as solid blocks of 28 mm, half the car with a mirror on the centre line, a moving road and still wheels, at a much lower Reynolds number than the real car. Its forces are far from the real car's: read the changes between cases, not the totals.",
      ],
    },
    {
      id: "aero", label: "Road car on the autobahn", subsystem: "aero",
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
    {
      id: "engine", label: "Racing engine", subsystem: "inline-engine",
      prompt: "At 9,000 rpm, how long does one cylinder have for its intake stroke? Switch between the two speeds and watch the two blue inlet valves.",
      answer: "3.3 milliseconds: half a crank turn. At 4,500 rpm it has 6.7 ms. Twice the speed halves the time to fill, which is why each cylinder breathes through two inlet valves.",
      view: { pos: [-0.2, -0.95, 1.45], target: [0, 0, 0.6] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "2.5-litre four, 16 valves · firing order 1-3-4-2",
        order: [1, 3, 4, 2],
        bore: 97.8, stroke: 82.8, rod: 145,         // rod length illustrative
        xs: [170, 64, -42, -148],                   // cylinder 1 at the front; spacing and position illustrative
        crankZ: 330, lean: 15,                      // block leans 15° to the right, as in the road 190 E: unverified for the race car
        valvetrain: "dohc", valves: 4, ignition: "spark", fuel: "carb", crankcase: "open",
        speed: { min: 5, max: 60, value: 15 },
        breathe: { rpm: [4500, 9000], slow: 1 / 300 },   // shown at 15 and 30 rpm
      },
      talk: [
        "The race engine: four cylinders of 97.8 mm bore and 82.8 mm stroke, 2.5 litres, with two overhead camshafts and four valves per cylinder.",
        "The early DTM version gave 245 kW at 8,500 rpm and could rev to 9,500 rpm. For the 1992 championship car Mercedes-Benz quotes up to 274 kW (373 PS).",
        "The road Evolution II had a 97.3 mm bore and 173 kW (235 PS).",
        "The short stroke keeps the pistons' speed in check: at 9,000 rpm each still averages about 25 m/s up and down the bore.",
        "The times shown are for 180° of crank, one intake stroke. The inlet valves open a little before it and close a little after, as the cam timing sets.",
      ],
    },
  ],
  note: "The aerodynamic figures here are the road cars'; the racing car in the museum was set up for downforce.",
  unverified: [
    "Frontal areas, masses, rolling resistance and driveline efficiency",
    "Race-car power and set-up",
    "Body outline and centre-plane section: traced from the stop photo (a side view) through its fitted camera, about ±10 cm; rear wing left out of the section, underside flat",
    "3-D wind tunnel: a simplified model (game mesh filled in as 28 mm blocks, flat floor, wheels held still, Reynolds number about 3 × 10⁴ against 10⁷); flap and lip changes illustrative, not the 1992 settings; a change is shown only where it keeps its sign on a coarser 40 mm grid and the mean of the two grids stands clear of the runs' own scatter (the arch trim, finer than one block, changed nothing and is left out)",
    "Road-car wind tunnel: a 2-D slice at a far lower Reynolds number than the real car (about 10⁴ against 10⁷), with the wheels outside it; its drag split is for the slice",
    "Racing engine: conrod length, cylinder spacing, block lean and position in the car; drawn with carburettor-style intake",
    "Room: Legend 7",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz 190 E 2.5-16 Evolution II", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_190_E_2.5-16_Evolution_II" },
    { label: "Mercedes-Benz: the road and racing engines of the 190 E 2.5-16 Evolution II", url: "https://media.mercedes-benz.com/en/article/25dd00e4-5ef9-4c2f-b12c-55169f795d4d" },
    { label: "3-D model used for the wind tunnel: “Mercedes-Benz Evolution II (190E)” by marksform, Sketchfab, CC BY-NC 4.0", url: "https://sketchfab.com/3d-models/mercedes-benz-evolution-ii-190e-983f5e165dee4e7c801a49c33f8e76f1" },
    { label: "Mercedes-Benz: the adjustable aerodynamics of the Evolution II", url: "https://media.mercedes-benz.com/en/article/4e61dcd8-fd75-47ca-830c-056734a165c2" },
    { label: "FIA Group A homologation form 5269 (190 E 2.5-16 Evolution II)", url: "https://historicdb.fia.com/sites/default/files/car_attachment/1601062201/homologation_form_number_5269_group_a.pdf" },
    { label: "D. Schroeder, Lattice-Boltzmann fluid dynamics in the browser", url: "https://physics.weber.edu/schroeder/fluids/" },
  ],
};
