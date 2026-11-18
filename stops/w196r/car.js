// Mercedes-Benz W 196 R streamlined racing car, 1955. Frame: mm, x forward, y left, z up; origin = front axle centre on
// the ground. Wheelbase from the archive; tracks, wheel radius and the body outline are assumed (approximate photo fit).
// Drag coefficients, frontal areas and masses are illustrative.
export default {
  slug: "w196r",
  title: "Wheels in, or wheels out",
  name: "Mercedes-Benz W 196 R streamliner",
  year: 1955,
  summary: "The Formula 1 car built with two bodies: enclosed wheels for fast circuits, open wheels for twisty ones.",
  eyebrow: "Mercedes-Benz W 196 R streamlined racing car, 1955",
  lede: "Mercedes planned two bodies for its 1954 Grand Prix car. Covering the wheels cuts drag on long straights; leaving them open saves weight and lets the driver place the car in corners. Switch bodies and see what the cover is worth at full power.",
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
      id: "aero", label: "Air drag", subsystem: "aero",
      view: { pos: [3.6, -5.2, 2.2], target: [-1.0, 0, 0.5] },
      ghost: { fill: 0.06, edge: 0.5 },
      params: {
        label: "Full power on the Monza straight",
        shapes: [                                              // cd, area, mass, rolling resistance and efficiency illustrative
          { id: "stream", label: "Streamlined body", cd: 0.5, area: 1.15, mass: 900, crr: 0.015, eta: 0.9, ps: 290 },
          { id: "open", label: "Open wheels", cd: 0.7, area: 1.05, mass: 860, crr: 0.015, eta: 0.9, ps: 290 },
        ],
        power: { min: 100, max: 400 }, vmax: 340,
        nose: [1380, 420], wheel: [-2350, 0], time: 3,
        // Centre-plane section for the 2-D wind tunnel, from the ghost outline: the screen and head fairing on the centre line,
        // the mouth closed, the underside flat. The wheels stand outside the slice, so both bodies share it.
        flow: {
          x0: 2800, x1: -8100, top: 3200, cell: 50, show: [-6600, 2400], rake: [100, 2000, 20],
          profile: [[1380, 260], [1380, 420], [1300, 540], [1100, 640], [900, 700], [600, 740], [-300, 760], [-700, 770], [-850, 1000], [-950, 1040],
            [-1300, 1050], [-1600, 950], [-1900, 790], [-2350, 780], [-2800, 720], [-3150, 620], [-3280, 420], [-3300, 260], [-3150, 150], [1250, 150]],
        },
      },
      talk: [
        "For the new 2.5-litre Formula 1 of 1954, Mercedes planned two bodies from the start: this streamlined one for very fast circuits, and a classic one with open wheels.",
        "A spinning, exposed wheel churns the air and leaves a big wake. Covering the wheels makes the body wider, so it pushes more air aside, yet the total drag still falls. Switch bodies: at the same 290 hp the streamliner is about 20 km/h faster in this model.",
        "It won first time out, at Reims on 4 July 1954: Fangio ahead of Kling. Two weeks later, on the tight Silverstone circuit, the drivers could not place the enclosed front wheels precisely in the corners and finished only 4th and 7th.",
        "In 1955 the streamliner raced only once, at Monza with its new steep banking, where Fangio won. The M 196 engine, a straight eight with direct injection and desmodromic valves, now gave 290 hp at 8,500 rpm.",
        "The wind tunnel shows the slice along the centre line, through the driver's head fairing: the air presses on the low nose, speeds up over the body and leaves a wake behind the short tail. The wheels stand outside the slice, so both bodies show the same section here.",
      ],
    },
  ],
  note: "The streamliner ran with the regular 2,350 mm wheelbase; a 2,210 mm version was tried at Monza in 1955 but not raced. Fangio became world champion in both seasons.",
  unverified: [
    "Drag coefficients, frontal areas, masses and driveline efficiency (no top speed is quoted, so none is compared)",
    "Tracks, wheel radius and nose position used for the photo fit (approximate: the wheels give a nearly straight line of points)",
    "Ghost-body outline (traced from the photo)",
    "Centre-plane section: from the ghost outline, with the screen and head fairing; mouth closed, underside flat",
    "Wind tunnel: a 2-D slice at a far lower Reynolds number than the real car (about 10⁴ against 10⁷), with the wheels outside it; its drag split is for the slice",
    "Room: Legend 7",
  ],
  sources: [
    { label: "Mercedes-Benz Classic archive: W 196 R streamlined racing car, 1955", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Mercedes-Benz-W-196-R-streamlined-racing-car-1955.xhtml?oid=6877" },
    { label: "Mercedes-Benz Classic archive: W 196 R streamlined racing car, 1954", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Mercedes-Benz-W-196-R-streamlined-racing-car-1954.xhtml?oid=6873" },
    { label: "Mercedes-Benz Classic archive: W 196 R, 1955", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Mercedes-Benz-W-196-R-1955.xhtml?oid=6876" },
    { label: "D. Schroeder, Lattice-Boltzmann fluid dynamics in the browser", url: "https://physics.weber.edu/schroeder/fluids/" },
  ],
};
