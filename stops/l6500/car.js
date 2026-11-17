// Mercedes-Benz L 6500, 1938 revision. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Wheelbase, track, engine position, cylinder spacing and conrod are illustrative; the photo fit assumes them.
export default {
  slug: "l6500",
  title: "Twelve and a half litres of diesel",
  name: "Mercedes-Benz L 6500",
  year: 1938,
  summary: "A heavy truck for 6.5 tonnes with a 12.5-litre six-cylinder prechamber diesel of 150 hp.",
  eyebrow: "Mercedes-Benz L 6500, 1938",
  lede: "By the late 1930s heavy trucks ran on diesel. Watch the OM 57's six cylinders fire with no spark plugs: fuel is sprayed into a small prechamber, and the heat of compression lights it.",
  frame: { origin: "front", wheelbase: 4600, wheelR: 565 },
  orbit: { min: 0.8, max: 22 },
  sun: [3, 3, 7],
  body: {
    ghost: [
      { pts: [[150, 900], [1590, 800], [1600, 1480], [1540, 1620], [150, 1680]], y: [-600, 600] },          // bonnet
      { pts: [[1530, 780], [1650, 780], [1650, 1500], [1530, 1500]], y: [-420, 420] },                       // radiator
      { pts: [[-800, 1080], [150, 1080], [150, 1700], [0, 2240], [-800, 2240]], y: [-1000, 1000] },        // cab
      { pts: [[-6300, 1300], [-800, 1300], [-800, 1860], [-6300, 1860]], y: [-1150, 1150] },                // platform
      { torus: { R: 480, r: 85, pos: [0, 960, 565], rot: [90, 0, 0] }, mirror: true },                       // front wheels
      { torus: { R: 480, r: 85, pos: [-4600, 1000, 565], rot: [90, 0, 0] }, mirror: true },                  // rear twin wheels
      { torus: { R: 480, r: 85, pos: [-4600, 720, 565], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "White 1938 Mercedes-Benz L 6500 flatbed truck with a long bonnet in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [2554.4, 2857.8, 1675], yaw: -2.3959, pitch: -0.1293, roll: 0.0547, f: 836.1 }, // tools/photo-fits/l6500.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_L_6500_1938_Pritschenwagen_LSideFront_MBMuse_9June2013_(14983590355).jpg" },
  },
  components: [
    {
      id: "engine", label: "Diesel engine", subsystem: "inline-engine",
      view: { pos: [3.0, 2.6, 2.1], target: [0.85, 0, 1.15] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "OM 57 diesel six · firing order 1-5-3-6-2-4",
        order: [1, 5, 3, 6, 2, 4], bore: 125, stroke: 170, rod: 330,       // rod illustrative
        xs: [1250, 1090, 930, 770, 610, 450], crankZ: 900, lean: 0,        // positions illustrative
        valvetrain: "ohv", ignition: "compression", fuel: "prechamber", crankcase: "open",
        compression: { value: 18, min: 6, max: 24 },                       // 18 : 1 illustrative (not confirmed)
        speed: { min: 5, max: 60, value: 15 }, realRpm: 1700,
      },
      talk: [
        "The OM 57 has six cylinders of 125 × 170 mm, 12.5 litres in all, and gives 150 hp at only 1,700 rpm. Its crankshaft runs in seven main bearings, one between every pair of cylinders.",
        "There are no spark plugs. Squeezing the air heats it far beyond the point where diesel fuel lights; try the compression slider to see why a petrol engine's ratio would not be enough.",
        "A Bosch pump sprays the fuel into a small prechamber in the head. Burning starts there and shoots into the cylinder, which made these early diesels smoother and less fussy about fuel.",
        "The camshaft sits low in the block and works the valves through pushrods. A four-speed gearbox with an overdrive and a 6.5-tonne payload: top speed was about 57 km/h.",
      ],
    },
  ],
  note: "Daimler-Benz built the L 6500 (L 54 series) at Gaggenau from 1935 to 1940. The 1938 revision brought the OM 57 engine and an all-steel cab; earlier trucks had the 120 hp OM 79 or the 150 hp OM 54. Sources disagree on the OM 57's displacement (some give 11.2 litres).",
  unverified: [
    "Wheelbase (4,600 mm), track and headlamp positions used for the photo fit",
    "Engine position, cylinder spacing and conrod length",
    "Compression ratio (18 : 1)",
    "Ghost-body outline (traced from the photo)",
    "Room: Collection 2 (the research notes put it in Legend 3)",
  ],
  sources: [
    { label: "Mercedes-Benz Classic archive: L 6500 (L 54 series) trucks, 1935–1940", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Series-L-6500-L-54-series-trucks-1935---1940.xhtml?oid=16438744" },
    { label: "Wikipedia (German): Mercedes-Benz L 6500", url: "https://de.wikipedia.org/wiki/Mercedes-Benz_L_6500" },
    { label: "kfz-tech: Mercedes L 6500", url: "https://kfz-tech.de/Engl/Hersteller/Mercedes/MercedesL6500.htm" },
  ],
};
