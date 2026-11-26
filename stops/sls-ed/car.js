// Mercedes-Benz SLS AMG Coupé Electric Drive, 2013. Frame: mm, x forward, y left, z up; origin = front axle centre on the
// ground. Body and wheel sizes as the SLS stop (same body); power, torque, battery from Mercedes's launch figures. Weight
// distribution, tyre cornering stiffnesses, drag area, efficiencies, regeneration limit and the bend are illustrative.
export default {
  slug: "sls-ed",
  title: "Steering with the motors",
  name: "Mercedes-Benz SLS AMG Coupé Electric Drive",
  year: 2013,
  summary: "Four electric motors, one at each wheel: they can push the outer wheels harder than the inner ones and help turn the car.",
  question: "Can a car steer with its motors?",
  eyebrow: "Mercedes-Benz SLS AMG Coupé Electric Drive, 2013",
  lede: "The gullwing SLS with its V8 replaced by four electric motors, one per wheel, and a battery in the centre tunnel. With a motor at every wheel, the car can drive its outer wheels harder than the inner ones in a bend. Hold a bend and move the drive outwards, then follow the energy from the battery to the wheels and back again under braking.",
  look: "Find the blue “Electric Drive” lettering on the door, and the blue-tinted grille: the only outside signs that there is no petrol engine under the long bonnet.",
  takeaway: "One motor per wheel lets software do what a differential cannot: give each wheel its own push, and take energy back when braking.",
  orbit: { min: 0.5, max: 14 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[1100, 280], [1130, 600], [650, 780], [-700, 930], [-3300, 930], [-3550, 850], [-3540, 300]], y: [-970, 970] },   // body (as the SLS stop)
      { pts: [[-700, 930], [-1400, 1262], [-2300, 1262], [-3200, 930]], y: [-720, 720] },                                       // roof and glass
      { torus: { R: 260, r: 85, pos: [0, 841, 345], rot: [90, 0, 0] }, mirror: true },                                         // wheels
      { torus: { R: 260, r: 95, pos: [-2680, 826, 345], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 799,
    alt: "White Mercedes-Benz SLS AMG Coupé Electric Drive with blue lettering on its door, in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [1778.5, 3499.7, 1295.6], yaw: 4.1023, pitch: -0.1491, roll: -0.013, f: 1129.5 }, // tools/photo-fits/sls-ed.json
    credit: { author: "Alexander Migl", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-AMG_SLS_Electric_Drive_IMG_0888.jpg" },
  },
  components: [
    {
      id: "vectoring", label: "Torque vectoring", subsystem: "electric-drive",
      prompt: "The car holds a 50 m bend at 50 km/h. Move drive from the inner wheels to the outer ones. What happens to the steering the front wheels need?",
      answer: "It falls: from about 3.5° to under 2° in this model. The outer wheels' extra push turns the car into the bend, so the front tyres have less turning to do. Move drive the other way and the car needs more steering than before.",
      view: { pos: [-1.3, 0.2, 9.5], target: [-1.3, 0.5, 0] },
      ghost: { fill: 0.03, edge: 0.35 },
      params: {
        label: "A steady left bend, seen from above", mode: "bend",
        wheelbase: 2680, halfTrack: 835, wheelR: 345,
        battery: { x0: -2300, x1: -300, w: 320, h: 320, z: 450 },
        car: { m: 2110, a: 1.447, b: 1.233, cf: 100e3, cr: 150e3, track: 1.67, cda: 0.75, crr: 0.012, drive: 0.85, regen: 0.8, regenMax: 150e3 },   // illustrative but mass
        radius: 50, speed: { min: 30, max: 70, value: 50 }, shiftMax: 1500,
      },
      talk: [
        "Each wheel has its own motor: four synchronous motors, together 552 kW and 1,000 N·m, two driving each axle through its own gearbox. There is no differential between the wheels.",
        "In a bend the car's control unit can let the outer wheels push harder and the inner wheels less, even brake them. The difference in forward force twists the car into the bend, like paddling harder on one side of a canoe.",
        "Mercedes called this AMG Torque Dynamics. The front tyres need less steering and less side grip, so more is left for the bend itself.",
        "The difference has to stay within what each tyre can grip: push a wheel too hard and it spins. The model here keeps the tyres in their gentle, linear range.",
      ],
    },
    {
      id: "energy", label: "Battery to wheels, and back", subsystem: "electric-drive",
      prompt: "Brake gently, then brake hard. Where does the car's motion go each time?",
      answer: "Braking gently, all of it goes back into the battery: the motors work as generators and the friction brakes stay cold. Braking hard, the battery cannot take energy that fast; the motors give it as much as it accepts, and the brake discs turn the rest into heat.",
      view: { pos: [1.6, 3.4, 3.2], target: [-1.3, 0, 0.4] },
      ghost: { fill: 0.03, edge: 0.35 },
      params: {
        label: "Power between the battery and the wheels", mode: "energy",
        wheelbase: 2680, halfTrack: 835, wheelR: 345,
        battery: { x0: -2300, x1: -300, w: 320, h: 320, z: 450 },
        car: { m: 2110, a: 1.447, b: 1.233, cf: 100e3, cr: 150e3, track: 1.67, cda: 0.75, crr: 0.012, drive: 0.85, regen: 0.8, regenMax: 150e3 },   // illustrative but mass
        radius: 50, speed: { min: 20, max: 200, value: 100 }, shiftMax: 1500,
      },
      talk: [
        "The battery holds 60 kWh at 400 volts: 12 modules of 72 lithium-ion cells, 548 kg in all, in the tunnel that would carry the propeller shaft, and behind the seats.",
        "Driving, current flows from the battery to the four motors; a part of the energy is lost as heat on the way.",
        "Braking, the motors become generators: the wheels drive them, and the current flows back into the battery. That energy would otherwise heat the brake discs.",
        "The battery and the motors can only take so much power at once. In a hard stop the friction brakes still do much of the work.",
      ],
    },
  ],
  note: "Power, torque and battery figures are Mercedes's. The bend, the car's balance, tyre stiffnesses, losses and the regeneration limit are round numbers chosen to show the principle.",
  unverified: [
    "Weight distribution, tyre cornering stiffnesses and the drag area",
    "Drive and regeneration efficiencies and the regeneration limit (150 kW at the battery)",
    "Battery and motor positions (sketched)",
    "Ghost-body outline (as the SLS stop's, sketched)",
  ],
  sources: [
    { label: "Mercedes-Benz press release (reprinted): SLS AMG Coupé Electric Drive", url: "https://www.automotiveworld.com/news-releases/mercedes-benz-sls-amg-coupe-electric-drive-electrifying-the-worlds-most-powerful-electric-super-sports-car/" },
    { label: "Mercedes-Benz Nederland: SLS AMG Coupé Electric Drive", url: "https://media.mercedes-benz.nl/meest-exclusieve-en-dynamische-elektrische-sportwagen-ooit-mercedes-benz-sls-amg-coupe-electric-drive-de-krachtigste-supersportwagen-ter-wereld/" },
    { label: "Mercedes-Benz Belgium: a guide in the electric SLS in Legend 6 (2020)", url: "https://media.mercedes-benz.be/exclusive-insights-droomautos-uit-het-mercedes-benz-museum-op-instagram-tv/" },
    { label: "Wikipedia: Mercedes-Benz SLS AMG", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_SLS_AMG" },
  ],
};
