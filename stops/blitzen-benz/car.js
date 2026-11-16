// Benz 200 PS "Blitzen-Benz", 1909. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Dimensions, conrod, valve gear drawing and the drag figures (chosen to give the record speed) are illustrative.
export default {
  slug: "blitzen-benz",
  title: "21.5 litres against the air",
  name: "Blitzen-Benz",
  year: 1909,
  summary: "Four cylinders of 5.4 litres each and a pointed body: 228.1 km/h at Daytona in 1911.",
  eyebrow: "Benz 200 PS 'Blitzen-Benz', 1909",
  lede: "Turn over the giant four-cylinder, then make a record run. The power to push through the air grows with the cube of speed, so a lot more power buys only a little more speed.",
  frame: { origin: "front", wheelbase: 2800, wheelR: 450 },
  orbit: { min: 0.8, max: 16 },
  sun: [3, -4, 6],
  body: {
    ghost: [
      { pts: [[420, 620], [-300, 1150], [-1700, 1200], [-2050, 1400], [-2450, 1400], [-2600, 1150], [-3900, 850], [-3950, 650], [-200, 420]], y: [-380, 380] },   // body
      { torus: { R: 410, r: 45, pos: [0, 650, 450], rot: [90, 0, 0] }, mirror: true },
      { torus: { R: 410, r: 45, pos: [-2800, 650, 450], rot: [90, 0, 0] }, mirror: true },
    ],
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
      view: { pos: [3.6, -5.6, 2.6], target: [-1.6, 0, 0.6] },
      ghost: { fill: 0.06, edge: 0.5 },
      params: {
        label: "Record run at full power",
        shapes: [{ id: "blitzen", label: "Blitzen-Benz", cd: 0.55, area: 1.1, mass: 1450, crr: 0.02, eta: 0.75, ps: 200, quoted: 228 }],   // cd, area, crr, eta illustrative
        power: { min: 50, max: 400 }, vmax: 300,
        nose: [420, 620], wheel: [-2800, 0], wind: { x0: 2500, x1: -5500, y: 900, z0: 100, z1: 1700 }, time: 3,
      },
      talk: [
        "Bob Burman at Daytona Beach on 23 April 1911: 228.1 km/h over the flying mile, faster than any aeroplane or train of the time. The record stood until 1919.",
        "Barney Oldfield had already reached 211.97 km/h with it there in 1910.",
        "Air drag grows with the square of speed, and the power to overcome it with the cube. Slide the power: doubling it adds only about a quarter more speed.",
        "That is why the body has a pointed nose and a long tail.",
      ],
    },
  ],
  note: "The car in the museum is one of six Blitzen-Benz built; the drag values here are chosen so the simple model reaches the record speed.",
  unverified: ["Drag coefficient 0.55, frontal area 1.1 m², mass 1,450 kg, rolling resistance and driveline efficiency", "Valve gear drawn as pushrod overhead valves", "Conrod length, cylinder positions, wheelbase", "That six were built", "Ghost-body outline"],
  sources: [
    { label: "Wikipedia: Blitzen Benz", url: "https://en.wikipedia.org/wiki/Blitzen_Benz" },
    { label: "Technik Museum: Blitzen Benz, fast as lightning", url: "https://stories.technik-museum.de/en/blitzen-benz" },
  ],
};
