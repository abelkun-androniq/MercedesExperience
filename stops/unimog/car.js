// Mercedes-Benz Unimog U 500, 2004, winter-service vehicle. Frame: mm, x forward, y left, z up; origin = front axle centre
// on the ground. Tyre size approximate; axle tube, housing, portal drop and hub-gear ratio illustrative; loads, grip and
// the limited-slip differential's bias ratio (a comparison: the Unimog locks instead) illustrative.
export default {
  slug: "unimog",
  title: "Axles above the wheels",
  name: "Mercedes-Benz Unimog U 500",
  year: 2004,
  summary: "The universal implement carrier, whose portal axles lift the differentials high above the ground.",
  eyebrow: "Mercedes-Benz Unimog U 500, 2004",
  lede: "A Unimog's axle does not run through the middle of its wheels but above them: each hub has a pair of gears that drops the drive down to the wheel. That lifts the axle tube and differential out of the way. Drive over a rock and switch to a conventional axle to compare.",
  orbit: { min: 0.5, max: 18 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[1500, 900], [1550, 1600], [700, 1700], [500, 2900], [-1300, 2900], [-1400, 1300], [-4500, 1300], [-4500, 900]], y: [-1200, 1200] },   // cab and body
      { torus: { R: 400, r: 150, pos: [0, 930, 550], rot: [90, 0, 0] }, mirror: true },                                                            // wheels
      { torus: { R: 400, r: 150, pos: [-3080, 930, 550], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Dark blue 2004 Mercedes-Benz Unimog U 500 with a snow blower and tyre chains in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [6116.3, 3743.1, 2178.4], yaw: -2.4974, pitch: -0.1055, roll: 0.0026, f: 1031 }, // tools/photo-fits/unimog.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_Unimog_U500_2004_Winterdienstfahrzeug_LSideFront_MBMuse_9June2013_(14983580785).jpg" },
  },
  components: [
    {
      id: "portal", label: "Portal axle", subsystem: "portal-axle",
      view: { pos: [4.2, -0.6, 1.3], target: [0, 0, 0.55] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Front axle, seen from the front",
        x: 0, halfTrack: 930, tyreWidth: 365,
        axle: { wheelR: 0.55, tubeR: 0.08, diffR: 0.24, drop: 0.12, ratio: 1.85 },   // illustrative
        rock: { min: 100, max: 600, value: 350 }, wheelTorque: 6000, quoted: 430,     // illustrative
      },
      real: {   // the part in real life (not this car)
        src: "parts/portal-hub.jpg", w: 600, h: 800,
        alt: "A green military axle with its wheel-hub housing cut open, showing a small gear above a larger one",
        caption: "A portal hub cut open (on a BTR-70 military vehicle). The axle shaft comes in high up, and a pair of gears carries the drive down to the wheel centre: that step is the extra ground clearance.",
        credit: { author: "HobbyAstronaut", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Portalachse_eines_BTR-70_im_Schnitt.jpg" },
      },
      talk: [
        "Unimog stands for Universal-Motor-Gerät, a universal motorised implement: designed after the war as a small tractor that could also drive fast on the road, and built by Daimler-Benz since 1951.",
        "Its axles are portal axles. The half-shafts run above the wheel centres and drive each wheel through a pair of spur gears in the hub, so the axle tube and the differential sit higher by the gears' drop, leaving more room underneath.",
        "The hub gears also reduce: the shafts turn faster than the wheels and carry less torque, so the shafts and the differential can be lighter.",
        "Coil springs and a ladder frame that is allowed to twist let each wheel follow the ground. This U 500 is fitted out for winter service.",
      ],
    },
    {
      id: "locks", label: "Differential locks", subsystem: "differential",
      prompt: "Mud under the left rear wheel, a steep field ahead. With the open differential the left wheel spins and the Unimog stays put. Which helps enough: plates that limit the slip, or a lock?",
      answer: "Only the lock, here. The plates pass the wheel on firm ground a few times the slipping wheel's torque, still not enough for this slope. The lock's dog collar joins the half-shaft to the carrier, the axle turns as one, and each wheel pushes as hard as its own grip allows.",
      view: { pos: [-4.0, 1.3, 1.2], target: [-3.08, 0.08, 0.67] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Rear axle, one wheel in mud", mode: "grip",
        halfTrack: 930, wheelR: 550, axleX: -3080, wheel: "tyre", tyreW: 150, ringR: 150, drive: "crown", drop: 120,   // illustrative
        grip: { torque: 12000, normal: 25000, muLow: 0.15, muHigh: 0.6, resist: 15000, surface: "mud", locks: true, bias: 2.5 },   // illustrative
      },
      talk: [
        "An open differential gives both wheels of an axle the same torque. In mud the slipping wheel can take only a little, so the wheel on firm ground gets just as little.",
        "The Unimog was built for fields and mud. Its driver can lock the differentials of both axles: a dog collar on one half-shaft slides onto dogs on the carrier, so the side gears can no longer turn against each other.",
        "Many road and racing cars use a limited-slip differential instead. Friction plates inside it pass extra torque to the wheel with grip by themselves, but only a few times the slipping wheel's share; here that is not enough for the slope.",
        "A locked axle cannot let its wheels turn at different speeds, so the tyres fight each other in a bend on firm ground. Locks are for slow going in difficult terrain; on the road they stay open.",
      ],
    },
  ],
  note: "Axle and housing sizes are round figures chosen to show the principle. The limited-slip differential is shown for comparison: the Unimog uses locks.",
  unverified: [
    "Axle tube and housing sizes, portal drop, hub-gear ratio and the resulting ground clearance",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Axle loads, grip in mud, the slope's pull and the limited-slip differential's bias ratio",
    "Room: Collection 3",
  ],
  sources: [
    { label: "Wikipedia: Unimog", url: "https://en.wikipedia.org/wiki/Unimog" },
    { label: "Wikipedia: Portal axle", url: "https://en.wikipedia.org/wiki/Portal_axle" },
  ],
};
