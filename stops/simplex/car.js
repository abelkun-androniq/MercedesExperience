// Mercedes-Simplex 40 PS, 1902. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Gear teeth, final drive, engine speeds, gate layout, radiator performance and positions are illustrative.
export default {
  slug: "simplex",
  title: "Gears without synchromesh, and the honeycomb radiator",
  name: "Mercedes-Simplex 40 PS",
  year: 1902,
  summary: "The 'simple' Mercedes: a four-speed sliding-gear box with chain drive, and Maybach's honeycomb radiator.",
  eyebrow: "Mercedes-Simplex 40 PS, 1902",
  lede: "The successor of the first Mercedes. Shift its sliding-gear box yourself: without synchromesh a gear only goes in when the speeds match. Then compare the honeycomb radiator with the older tubular kind.",
  frame: { origin: "front", wheelbase: 2450, wheelR: 450 },
  orbit: { min: 0.6, max: 14 },
  sun: [3, -3, 6],
  body: {
    ghost: [
      { pts: [[150, 550], [150, 1150], [80, 1180], [-1100, 1080], [-1100, 600]], y: [-400, 400] },                                     // radiator and bonnet
      { pts: [[-1100, 550], [-1100, 1050], [-1500, 1100], [-1600, 1400], [-1900, 1400], [-2000, 1100], [-3200, 1100], [-3300, 650], [-2900, 550]], y: [-620, 620] },   // body
      { torus: { R: 420, r: 45, pos: [0, 700, 450], rot: [90, 0, 0] }, mirror: true },
      { torus: { R: 430, r: 45, pos: [-2450, 700, 460], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Blue 1902 Mercedes Simplex 40 PS on display in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [4278.9, 5687.9, 1723.4], yaw: -2.3421, pitch: -0.1236, roll: -0.0029, f: 1500.3 }, // tools/photo-fits/simplex.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes_40_PS_1902_Simplex_LSideFront_MBMuse_9June2013_(14797093187).jpg" },
  },
  components: [
    {
      id: "gears", label: "Gearbox", subsystem: "gearbox",
      view: { pos: [-0.75, -1.25, 1.0], target: [-1.57, 0, 0.5] },
      ghost: { fill: 0.02, edge: 0.25 },
      params: {
        label: "Four-speed sliding-gear box",
        box: {
          gears: [                                           // teeth illustrative; every pair adds up to 60
            { name: "R", drive: 15, driven: 45, idler: true },
            { name: "1", drive: 15, driven: 45 }, { name: "2", drive: 19, driven: 41 },
            { name: "3", drive: 24, driven: 36 }, { name: "4", drive: 30, driven: 30 },
          ],
          final: 2.07, wheelR: 0.45,                          // countershaft and chains; illustrative
        },
        module: 4, pos: [-1350, 430], pitch: 110, width: 28,
        rpm: { idle: 300, max: 1200 },                        // illustrative
        gate: [["R", 0, -1], ["1", 0, 1], ["2", 1, -1], ["3", 1, 1], ["4", 2, -1]],   // illustrative
        drive: { accel: 6, roll: 0.25, drag: 0.00018 },
      },
      talk: [
        "No synchromesh: the lever slides a pair of gears into mesh, and they only slide in when their teeth are already moving at about the same speed.",
        "To shift up, drivers pressed the clutch and waited for the gearbox to slow down. To shift down they double-declutched: neutral, clutch up, a blip of throttle, clutch down, then into gear.",
        "The lever moves in a gate beside the driver. Behind the box a countershaft with the differential drives two chains to the rear wheels.",
        "The demo shifts up through all four gears. Then try it yourself: grinding means the speeds are still too far apart.",
      ],
    },
    {
      id: "radiator", label: "Radiator", subsystem: "radiator",
      view: { pos: [1.5, -1.5, 1.6], target: [-0.25, 0, 0.8] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "Cooling water at full load",
        heat: 44000,                        // W into the water: about 1.5 × the 29 kW output; illustrative
        airT: 20, speed: { min: 0, max: 90, value: 60 },
        types: [
          { id: "honey", label: "Honeycomb (1900)", kind: "honeycomb", ua: 500, still: 0.3, refSpeed: 60, water: 22, fan: true },   // illustrative
          { id: "tube", label: "Tubular, same size (1897)", kind: "tubular", ua: 160, still: 0.15, refSpeed: 60, water: 22 },       // illustrative
        ],
        engine: { x: -550, z: 800, l: 750, w: 420, h: 420 },
        radiator: { x: 90, z: 850, w: 680, h: 560, d: 110 },
      },
      talk: [
        "Maybach's honeycomb radiator, patented as DRP 122766 (applied for in September 1900), is made of 8,070 square tubes, each 6 × 6 mm.",
        "Square tubes pack closer than round ones, so there is more cooling surface in the same space. A small fan behind the radiator helps at low speed.",
        "From the 1898 Phoenix to the first Mercedes in 1900, water use halved from 18 to 9 litres per 100 km, while power rose from 8 to 35 hp.",
        "The honeycomb front became the face of every Mercedes after it.",
      ],
    },
  ],
  note: "6,785 cm³ four-cylinder, about 943 kg, wheelbase 2,450 mm: the oldest surviving Mercedes is a Simplex of this type.",
  unverified: ["Gear teeth, final drive and gate layout (one source lists three speeds)", "Engine speed range and the demo's acceleration", "Heat into the water and both radiators' performance", "Gearbox, engine and radiator positions", "Ghost-body outline"],
  sources: [
    { label: "Wikipedia: Mercedes Simplex", url: "https://en.wikipedia.org/wiki/Mercedes_Simplex" },
    { label: "Mercedes-Benz public archive: Simplex 40 hp, 1902", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Mercedes-Simplex-40-hp-racing-car-1902.xhtml?oid=6734" },
    { label: "Stern-Freunde: Mercedes-Simplex 40 PS", url: "https://stern-freunde.de/article/729-supersportwagen-vor-120-jahren-mercedes-simplex-40-ps" },
    { label: "Motor Equipment News: the honeycomb radiator 120 years ago", url: "https://motorequipmentnews.co.nz/node/1168" },
    { label: "Wikipedia: Mercedes 35 hp", url: "https://en.wikipedia.org/wiki/Mercedes_35_hp" },
  ],
};
