// Benz 200 PS "Blitzen-Benz", 1909. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Dimensions, conrod, valve gear drawing and the drag figures (chosen to give the record speed) are illustrative.
export default {
  slug: "blitzen-benz",
  title: "21.5 litres against the air",
  name: "Blitzen-Benz",
  year: 1909,
  summary: "Four cylinders of 5.4 litres each and a pointed body: 228.1 km/h at Daytona in 1911.",
  eyebrow: "Benz 200 PS 'Blitzen-Benz', 1909",
  question: "If you double the power, do you double the speed?",
  lede: "Turn over the giant four-cylinder, then make a record run. The power to push through the air grows with the cube of speed, so a lot more power buys only a little more speed.",
  frame: { origin: "front", wheelbase: 2800, wheelR: 450 },
  orbit: { min: 0.8, max: 16 },
  sun: [3, -4, 6],
  body: {
    ghost: [
      { pts: [[105, 1120], [102, 1165], [75, 1200], [25, 1228], [-50, 1243], [-140, 1250], [-270, 1250], [-800, 1236], [-1600, 1250], [-2950, 1256], [-3300, 1285],
        [-3550, 1250], [-3800, 1185], [-3930, 1130], [-4060, 1050], [-4184, 966], [-3900, 870], [-3500, 750], [-3290, 620], [-3150, 560],
        [-150, 540], [-100, 620], [-70, 820], [-55, 930], [18, 997], [71, 1068]], y: [-380, 380] },   // body, traced from a side view (see flow)
      { torus: { R: 410, r: 45, pos: [0, 650, 450], rot: [90, 0, 0] }, mirror: true },
      { torus: { R: 410, r: 45, pos: [-2800, 650, 450], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "White 1909 Blitzen-Benz record car on display in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [3731.2, 2398.2, 1711.9], yaw: -2.7001, pitch: -0.1962, roll: 0.0719, f: 1566.4 }, // tools/photo-fits/blitzen-benz.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Benz_200PS_1909_Blitzen-Benz_Bob_Burman_LSideFront_MBMuse_9June2013_(14983653675).jpg" },
  },
  components: [
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [0.7, -1.9, 1.7], target: [-0.62, 0, 0.85] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Four cylinders, 21.5 litres · firing order 1-3-4-2",
        order: [1, 3, 4, 2], bore: 185, stroke: 200, rod: 380,          // rod illustrative
        xs: [-250, -480, -770, -1000], crankZ: 380, lean: 0,              // cast in pairs; positions illustrative
        valvetrain: "ohv", ignition: "spark", fuel: "carb", crankcase: "open",
        flywheelR: 250, speed: { min: 5, max: 60, value: 20 }, realRpm: 1600,
      },
      talk: [
        "Four cylinders of 185 × 200 mm make 21,504 cm³, about 5.4 litres each, for 200 PS at 1,600 rpm.",
        "Benz first built this engine with 15.1 litres for the 1908 racing car. Widening the bore to 185 mm gave 21.5 litres.",
        "Valves in the head, worked by pushrods and rockers from a camshaft low in the block.",
        "At only 1,600 rpm the long stroke still moves each piston at about 10.7 m/s on average, as fast as a 100 mm stroke at 3,200 rpm.",
      ],
    },
    {
      id: "record", label: "Record run", subsystem: "aero",
      prompt: "Read the model's top speed, then slide the engine power from 200 to 400 PS and read it again. Has it doubled?",
      answer: "No: twice the power gives about 294 km/h in this model, not 456. The power to push through the air grows with the cube of speed, so doubling it adds less than a third more speed.",
      view: { pos: [-1.2, -10.5, 2.6], target: [-2.6, 0, 1.0] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "Record run at full power",
        shapes: [{ id: "blitzen", label: "Blitzen-Benz", cd: 0.55, area: 1.1, mass: 1450, crr: 0.02, eta: 0.75, ps: 200, quoted: 228 }],   // cd, area, crr, eta illustrative
        power: { min: 50, max: 400 }, vmax: 300,
        nose: [105, 1140], wheel: [-2800, 0], time: 3,
        // Centre-plane section for the 2-D wind tunnel: the body traced from a museum side photo (Commons, Valder137, CC BY 2.0)
        // through a fitted camera, plus a seated driver; underside and crankcase simplified. Heights within about ±50 mm.
        flow: {
          x0: 1500, x1: -8500, top: 4000, cell: 50, show: [-7000, 2600], rake: [150, 2500, 22],
          profile: [[105, 1120], [102, 1165], [75, 1200], [25, 1228], [-50, 1243], [-140, 1250], [-270, 1250], [-800, 1236], [-1600, 1250], [-2200, 1256],
            [-2380, 1262], [-2470, 1330], [-2540, 1400], [-2548, 1470], [-2532, 1545], [-2560, 1610], [-2630, 1650], [-2700, 1630],
            [-2745, 1575], [-2745, 1505], [-2725, 1450], [-2790, 1400], [-2860, 1330], [-2950, 1290], [-3150, 1280], [-3300, 1285],
            [-3550, 1250], [-3800, 1185], [-3930, 1130], [-4060, 1050], [-4184, 966], [-3900, 870], [-3500, 750], [-3290, 620],
            [-3150, 560], [-1100, 540], [-1050, 300], [-250, 300], [-200, 540], [-150, 540], [-100, 620], [-70, 820], [-55, 930],
            [18, 997], [71, 1068]],
        },
      },
      talk: [
        "Bob Burman at Daytona Beach on 23 April 1911: 228.1 km/h over the flying mile, faster than any aeroplane or train of the time. The record stood until 1919.",
        "Barney Oldfield had already reached 211.97 km/h with it there in 1910.",
        "Air drag grows with the square of speed, and the power to overcome it with the cube. Doubling the power adds less than a third more speed.",
        "The wind tunnel shows where that drag comes from. Under Pressure the air piles up red against the radiator; behind the driver's head and the short tail it breaks away into a churning wake, whose low pressure pulls the car back.",
        "Every kilowatt that goes into drag ends up stirring that wake, and the swirls finally warm the air. Watch the readouts: in this slice nearly all the drag is suction behind the car. The push on the radiator is largely cancelled where the air speeds up round its edges, and friction is only a few per cent.",
        "Hence the pointed radiator and the tail cone: the less air the car has to shove aside and the more gently it lets it close up behind, the smaller the wake.",
      ],
    },
  ],
  note: "The car in the museum is one of six Blitzen-Benz built; the drag values here are chosen so the simple model reaches the record speed. The wind tunnel is a live 2-D lattice-Boltzmann simulation of the centre plane: it shows the pattern of the flow, not measured values.",
  unverified: ["Drag coefficient 0.55, frontal area 1.1 m², mass 1,450 kg, rolling resistance and driveline efficiency", "Valve gear drawn as pushrod overhead valves", "Conrod length, cylinder positions, wheelbase", "That six were built",
    "Body outline and centre-plane section: traced from a side photo through a fitted camera, about ±5 cm; cowl rounded, driver, crankcase and flat underside assumed",
    "Wind tunnel: a 2-D slice at a far lower Reynolds number than the real car (about 10⁴ against 10⁷), with the wheels outside it; its drag split is for the slice"],
  sources: [
    { label: "Wikipedia: Blitzen Benz", url: "https://en.wikipedia.org/wiki/Blitzen_Benz" },
    { label: "Technik Museum: Blitzen Benz, fast as lightning", url: "https://stories.technik-museum.de/en/blitzen-benz" },
    { label: "Side photo used for the body profile (Valder137, CC BY 2.0)", url: "https://commons.wikimedia.org/wiki/File:Benz_200PS_1909_Blitzen-Benz_Bob_Burman_LSide_MBMuse_9June2013_(14797108977).jpg" },
    { label: "D. Schroeder, Lattice-Boltzmann fluid dynamics in the browser", url: "https://physics.weber.edu/schroeder/fluids/" },
  ],
};
