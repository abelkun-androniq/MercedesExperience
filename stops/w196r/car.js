// Mercedes-Benz W 196 R streamlined racing car, 1955. Frame: mm, x forward, y left, z up; origin = front axle centre on
// the ground. Wheelbase from the archive; tracks, wheel radius and the body outline are assumed (approximate photo fit).
// The front-wheel airflow is computed offline (tools/cfd/part.mjs w196-wheel; corner shapes in tools/cfd/corner.mjs).
export default {
  slug: "w196r",
  title: "Wheels in, or wheels out",
  name: "Mercedes-Benz W 196 R streamliner",
  year: 1955,
  summary: "The Formula 1 car built with two bodies: enclosed wheels for fast circuits, open wheels for twisty ones.",
  eyebrow: "Mercedes-Benz W 196 R streamlined racing car, 1955",
  lede: "Mercedes planned two bodies for its 1954 Grand Prix car. Covering the wheels cuts drag on long straights; leaving them open saves weight and lets the driver place the car in corners. Switch bodies and watch the air behind the front wheel.",
  orbit: { min: 0.6, max: 15 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[600, 150], [600, 730], [-300, 760], [-2350, 780], [-3150, 620], [-3300, 260], [-3000, 150]], y: [-800, 800] },  // body
      { pts: [[600, 150], [1350, 180], [1380, 420], [900, 700], [600, 730]], y: [-520, 520] },                              // nose
      { pts: [[-700, 760], [-850, 1000], [-1300, 1050], [-1900, 790]], y: [-260, 260] },                                                   // screen and headrest
      { torus: { R: 270, r: 70, pos: [0, 665, 340], rot: [90, 0, 0] }, mirror: true },                                                     // wheels
      { torus: { R: 270, r: 70, pos: [-2350, 679, 340], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Silver 1955 Mercedes-Benz W 196 R streamlined racing car with enclosed wheels and start number 18, in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [1171.5, 2444.8, 1799.2], yaw: -2.1817, pitch: -0.3358, roll: 0.0789, f: 649.8 }, // tools/photo-fits/w196r.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_W196R_1955_Streamlined_Juan_Miguel_Fangio_LSideFront_MBMuse_9June2013_(14960748346).jpg" },
  },
  components: [
    {
      id: "wheel", label: "Front wheel", subsystem: "race-aero",
      prompt: "Seen from above at hub height: the front tyre, the body beside it and a dashed line across the air behind the wheel. Switch bodies: what happens to the air just behind the wheel?",
      answer: "Behind the bare tyre, the air in a patch the width of the wheel loses about half its speed: a trail of slow, churned air. With the wheel enclosed, that patch lies inside the body: the tyre's churned air stays in its wheelhouse, and outside the air runs along the smooth skin. The streamliner is wider, yet shows the air no bare wheel: its advantage on the fast straights of Reims and Monza. In corners its drivers paid for it, unable to see the front wheels to place them.",
      more: "Wind tunnel details",
      view: { pos: [0.1, 1.3, 4.1], target: [0.1, 0.75, 0.344] },
      ghost: { fill: 0, edge: 0 },
      params: {
        label: "Front corner · seen from above at hub height",
        data: "stops/w196r/cfd/wheel/", start: "enclosed",
        // Local 3-D runs of the front corner (tools/cfd/part.mjs w196-wheel, tools/cfd/corner.mjs); body sizes assumed.
        cases: [
          { id: "enclosed", label: "Enclosed", say: "Enclosed: the tyre turns in its own wheelhouse, and the air flows along the smooth body. The patch behind the wheel is inside the body." },
          { id: "exposed", label: "Exposed", say: "Exposed: the air meets the bare tyre and leaves a band of slow air behind it, a little wider than the tyre itself." },
        ],
      },
      talk: [
        "For the new 2.5-litre Formula 1 of 1954, Mercedes planned two bodies from the start: this streamlined one for very fast circuits, and a classic one with open wheels.",
        "It won first time out, at Reims on 4 July 1954: Fangio ahead of Kling. Two weeks later, on the tight Silverstone circuit, the drivers could not place the enclosed front wheels precisely in the corners and finished only 4th and 7th.",
        "In 1955 the streamliner raced only once, at Monza with its new steep banking, where Fangio won. The M 196 engine, a straight eight with direct injection and desmodromic valves, now gave 290 hp at 8,500 rpm.",
        "The picture is a level slice at hub height through a 3-D wind tunnel of the front corner, computed ahead of time. Colour is the air's speed against the road speed; grey is solid, body and tyre cut through. With the wheel exposed, the orange mark shows where, on the dashed line 36 cm behind the tyre, the air moves slower than 80 % of the road speed.",
        "Both bodies were computed with the same tyre, road, speed and starting points for the paths, on grids of 24 and 16 mm cells. On both grids the air in the patch behind the bare tyre loses about half its speed (61 % and 44 %, each steady to within a few points over five flow-throughs), and a larger tunnel changes it by 4 points. Whether the air beside the car runs faster or slower with the enclosed body did not settle: it changes with the grid and the tunnel size, so it is not claimed. The tyre stands still over a moving road (a spinning tyre needs a finer model), the suspension arms are left out and the Reynolds number is about a thousandth of the real car's: read the difference between the bodies, not the values.",
        "A separate straight-line estimate, with assumed drag coefficients (0.5 enclosed, 0.7 open), frontal areas and masses, puts the streamliner about 20 km/h faster at the same 290 hp. No top speed is quoted for either body, so this is an illustration, not a figure.",
      ],
    },
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      prompt: "Why did Mercedes take the drive from the middle of the crankshaft? Sweep the engine speed and compare the twist with a drive from the end.",
      answer: "From the middle, each group of four cylinders twists only half the crank against the output gear. In this model the end drive meets a twisting resonance inside the rev range and the middle drive does not. Mercedes-Benz names vibration as the reason for the choice.",
      more: "Engine timing",
      view: { pos: [0.3, 1.35, 0.75], target: [-0.56, 0, 0.3] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "M 196 straight-eight, 2.5 litres · drive from the middle of the crank",
        order: [1, 6, 2, 5, 8, 3, 7, 4], bore: 76, stroke: 68.8, rod: 125,                // firing order and rod illustrative
        xs: [-250, -335, -420, -505, -625, -710, -795, -880], crankZ: 300, lean: 53,     // positions illustrative; gear between 4 and 5
        valvetrain: "dohc", ignition: "spark", fuel: "direct", crankcase: "open",
        speed: { min: 5, max: 60, value: 12 }, realRpm: 8500,
        torsion: { rpm: { min: 2000, max: 9000, value: 6800 }, damping: { min: 1, max: 20, value: 3 } },
      },
      talk: [
        "The M 196: eight cylinders of 76 mm bore and 68.8 mm stroke, 2.5 litres, laid far over on its side, with direct injection and desmodromic valves.",
        "Its crankshaft is two groups of four. The drive leaves through a gear in the middle, between cylinders 4 and 5, and runs back through the propeller shaft to the gearbox at the rear axle.",
        "A long crank is a torsion spring carrying heavy throws. Every power stroke twists it a little; at one engine speed the pulses arrive in step with its own swing, and the twist grows: a resonance. Damping keeps the peak down.",
        "Balanced and steady are two different things: the eight's shaking forces cancel, yet its crank still twists. The stiffness, inertias, damping and firing ripple here are illustrative, not the M 196's.",
      ],
    },
  ],
  note: "The streamliner ran with the regular 2,350 mm wheelbase; a 2,210 mm version was tried at Monza in 1955 but not raced. Fangio became world champion in both seasons.",
  unverified: [
    "Drag coefficients, frontal areas, masses and driveline efficiency of the separate straight-line estimate in the technical facts (no top speed is quoted, so none is compared)",
    "Tracks, wheel radius and nose position used for the photo fit (approximate: the wheels give a nearly straight line of points)",
    "Ghost-body outline (traced from the photo)",
    "Front-wheel close-up: a local 3-D tunnel of the front corner (half car mirrored, moving road, tyre of 340 mm radius and 150 mm width held still 48 mm above the road, body shapes simplified from the outline and photos, suspension left out), Reynolds number 10⁴ on the tyre diameter against about 10⁷",
    "Engine: firing order, conrod length, position and the 53° tilt; crank twist model (stiffness, inertias, damping, firing ripple) illustrative; no M 196 critical speeds are attributed",
    "Room: Legend 7",
  ],
  sources: [
    { label: "Mercedes-Benz Classic archive: W 196 R streamlined racing car, 1955", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Mercedes-Benz-W-196-R-streamlined-racing-car-1955.xhtml?oid=6877" },
    { label: "Mercedes-Benz Classic archive: W 196 R streamlined racing car, 1954", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Mercedes-Benz-W-196-R-streamlined-racing-car-1954.xhtml?oid=6873" },
    { label: "Mercedes-Benz Classic archive: W 196 R, 1955", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Mercedes-Benz-W-196-R-1955.xhtml?oid=6876" },
    { label: "D. Schroeder, Lattice-Boltzmann fluid dynamics in the browser", url: "https://physics.weber.edu/schroeder/fluids/" },
  ],
};
