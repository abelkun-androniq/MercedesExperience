// Mercedes-Benz 190 E 2.5-16 Evolution II, DTM racing car, 1992 (Klaus Ludwig). Frame: mm, x forward, y left, z up;
// origin = front axle centre on the ground. The road cars' drag coefficients and top speed (note) are those quoted; the
// airflow close-ups are computed offline by tools/cfd/part.mjs (run records in tools/cfd/results/).
export default {
  slug: "190e-evo2",
  title: "Paying drag for grip",
  name: "Mercedes-Benz 190 E 2.5-16 Evolution II",
  year: 1992,
  summary: "The DTM homologation special whose wings and spoilers, shaped in the wind tunnel, gave it less drag than the plain 2.3-16.",
  question: "Why would a racing driver accept more drag?",
  eyebrow: "Mercedes-Benz 190 E Evolution II, 1992",
  lede: "Klaus Ludwig's DTM car carries a rear wing with an adjustable upper flap, a front lip that slides forward and flared wheel arches. Three close-ups of wind tunnels computed ahead of time show what each part does to the air around it.",
  orbit: { min: 0.5, max: 16 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[935, 120], [935, 260], [915, 440], [870, 560], [798, 618], [435, 674], [48, 744], [-337, 814], [-3117, 860], [-3407, 844],
        [-3696, 816], [-3760, 700], [-3800, 450], [-3790, 200], [-3700, 120]], y: [-850, 850] },   // body, traced from the photo (tools/profile-traces/190e-evo2.json)
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
      id: "wing", label: "Rear wing", subsystem: "race-aero",
      prompt: "Watch the orange arrow in the dashed box above the wing's trailing edge. Raise the flap: which way does the air leaving the wing turn?",
      answer: "Upward. With the flap raised, the mean direction of the air in the box tips about 13° further up (about 8° on a coarser grid). Turning the air upward takes a push, and the wing feels the push back, downward. In the whole-car model that is about 34 kg more on the rear axle at 200 km/h, for about 9 kW more of the engine's power spent on drag.",
      more: "Wind tunnel details",
      view: { pos: [-3.73, 1.88, 1.12], target: [-3.73, 0.238, 1.12] },
      ghost: { fill: 0, edge: 0 },
      params: {
        label: "Wing flap · a slice of the whole-car tunnel",
        data: "stops/190e-evo2/cfd/wing/", start: "base",
        // Crop of the whole-car runs (tools/cfd/part.mjs wing; results in tools/cfd/results/wing.json); flap size illustrative.
        cases: [
          { id: "base", label: "Baseline", say: "Flap down: note the orange arrow, the mean direction of the air leaving the trailing edge in the dashed box." },
          { id: "flap", label: "Flap raised", say: "Flap raised: in the same box the air tips upward, about 13° more than with the flap down, and the paths behind the wing bend up with it." },
        ],
      },
      talk: [
        "The racing car's rear wing carries an upper flap that teams could raise for circuits with fast bends. Mercedes-Benz names a retractable upper flap and a two-position front spoiler for the homologation car; the flap here is an illustrative size and angle, not the 1992 setting.",
        "The picture is a slice 238 mm from the car's centre line, cut out of a 3-D wind tunnel of the whole car. Colour shows how fast the air moves up (red) or down (blue), as a share of the road speed; grey is solid: the boot lid, the wing and, when raised, the flap.",
        "The orange arrow is the mean direction of the air in the dashed box, over 48 of the model's 28 mm cells. Raising the flap tips it up by about 13°; on a coarser 40 mm grid, with 12 cells in the box, by about 8°. Both grids agree that it tips upward. The angles before and after depend on where the box sits, so only the change is given.",
        "In the whole-car model, raising the flap adds about 34 kg of load on the rear axle at 200 km/h (25 to 43 kg on its two grids) and about 9 kW of drag power (4 to 14 kW); the front axle hardly changes. More rear load is grip and stability in fast bends; the drag is speed lost on the straights.",
        "The model is a game mesh of the Evo II filled with 28 mm blocks: half the car with a mirror on the centre line, a moving road, wheels held still, and a Reynolds number about 300 times smaller than the real car's. Read the change between the two settings, not the values.",
      ],
    },
    {
      id: "splitter", label: "Front splitter", subsystem: "race-aero",
      prompt: "The lip under the bumper slides forward. Follow the two air paths: one rides up over the nose, one runs under the car. Move the lip forward: what is above it now, and what is below?",
      answer: "Above it, the slow air piled up against the bumper (blue); below it, air already running fast under the car (yellow). Pushed forward, the lip reaches under that slow pocket and divides the air further ahead. Slow air presses harder than fast air, which is how a splitter loads the nose; this model shows the pattern of the air, not the size of that force.",
      more: "Wind tunnel details",
      view: { pos: [0.84, 1.15, 0.2], target: [0.84, 0, 0.2] },
      ghost: { fill: 0, edge: 0 },
      params: {
        label: "Front lip · a section through the nose",
        data: "stops/190e-evo2/cfd/splitter/", start: "in",
        // 2-D section from the traced centre-plane profile (tools/cfd/part.mjs splitter); lip travel and thickness illustrative.
        // Colour is speed: the 2-D tunnel's pressure level floats (see part.mjs). Display only: no lip load is claimed.
        cases: [
          { id: "in", label: "Lip in", say: "Lip in: its front edge is flush with the bumper (orange tick). The air piles up, slow, against the bumper face (blue); below the lip it speeds up and runs under the car with the road." },
          { id: "forward", label: "Lip forward", say: "Lip forward: the lip reaches 4 cm past the tick, under the slow air piled up against the bumper, while the air below it is already fast." },
        ],
      },
      talk: [
        "Mercedes-Benz describes a front spoiler with two positions for the Evolution II. The lip's 4 cm of travel and 25 mm thickness here are illustrative.",
        "The picture is a slice through the nose at the car's centre line, computed ahead of time in two dimensions, as if the nose were endlessly wide. Colour is the air's speed against the road speed; grey is the body and the lip. The road moves at the car's speed and carries the air under the car with it.",
        "No load is given. The model's pressure samples sit ahead of the lip when it is pulled in, so they cannot compare the force on it in the two settings, and the pressure level in this short 2-D tunnel drifts. Measuring it would need a longer section of the car and different tunnel boundaries.",
        "A 2-D section has no air escaping round the sides of the bumper, and its Reynolds number is about a thousandth of the real car's.",
      ],
    },
    {
      id: "wheel-arch", label: "Front wheel arch", subsystem: "race-aero",
      prompt: "Seen from above at hub height: the bumper corner, the front tyre in its flared arch, the door behind. Tap Follow the air: the blue line is a path of the mean flow, the average route of the air, from in front of the car.",
      answer: "It starts 78 cm from the car's centre line, in line with the tyre, and the car's front corner turns it outward. It never comes back in: by the dashed line, 60 cm behind the axle, it runs about 37 cm further out, well clear of the door. Along the flank behind the arch the air moves slower (green and blue) than in the fast stream outside (red).",
      more: "Wind tunnel details",
      view: { pos: [0, 1.3, 3.8], target: [0, 0.75, 0.344] },
      ghost: { fill: 0, edge: 0 },
      params: {
        label: "Front corner · seen from above at hub height",
        data: "stops/190e-evo2/cfd/wheel-arch/", start: "fitted", follow: true,
        // Local 3-D run of the front corner (tools/cfd/part.mjs evo-arch, tools/cfd/corner.mjs).
        cases: [{ id: "fitted", label: "Flared arch", say: "This path of the mean flow starts in line with the tyre, just in front of the bumper corner. The car's front corner turns it about 37 cm outward, and it keeps that line past the door." }],
      },
      talk: [
        "The Evolution II's arches were widened so that wider wheels and tyres would fit under the body, and shaped with the rest of the body kit in the wind tunnel.",
        "The picture is a level slice at hub height through a 3-D wind tunnel of the front corner, computed ahead of time from the same game mesh as the rear wing. Colour is the air's speed against the road speed; grey is solid, body and tyre cut through. The blue line follows the time-averaged flow in this level slice; a single puff of air wanders around it with the turbulence.",
        "The tyre stands still in its carved-out wheelhouse, 48 mm above a moving road; the body is cut flat 1 m up and the half car is mirrored at the centre line. It was computed on one grid of 24 mm cells: over five flow-throughs the outward shift stays between 36.7 and 37.7 cm. A finer grid was not run, so the figure is rounded.",
        "There is no second arch here to compare with. The mesh's flare already sits within a centimetre of the tyre's outer face, so a narrower arch could not cover the tyre: the lesson is where the air goes. Nothing here separates what the flare does from what the bumper corner and the tyre do.",
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
  note: "The road Evolution II's body kit (front spoiler, wide wheel arches, sill panels and adjustable rear wing) was shaped in the wind tunnel as one system: a drag coefficient of about 0.29 against the 2.3-16's 0.32, much less lift at speed, and about 250 km/h with 235 hp. The racing car in the museum was set up for downforce.",
  unverified: [
    "Race-car power and set-up",
    "Body outline and the nose of the splitter section: traced from the stop photo (a side view) through its fitted camera, about ±10 cm",
    "Rear wing close-up: a slice of a 3-D wind tunnel of the whole car (game mesh filled in as 28 mm blocks, half car mirrored, flat floor, wheels held still, Reynolds number about 3 × 10⁴ against 10⁷); flap size and angle illustrative, not the 1992 setting; the direction of the change repeats on a 40 mm grid, its size does not",
    "Front splitter close-up: a 2-D section through the nose (lattice Boltzmann, Reynolds number 10⁴ on 1 m against about 10⁷ for the car), moving road; lip travel (40 mm) and thickness (25 mm) illustrative; shows the airflow pattern only, no lip load",
    "Front wheel arch close-up: a local 3-D tunnel of the front corner from the game mesh (body clipped flat at 1 m, wheelhouse carved round the tyre, tyre held still 48 mm above the moving road, half car mirrored), Reynolds number 10⁴ on the tyre diameter",
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
