// Mercedes-Benz 540 K (W 29), 1936–1940. Frame: mm, x forward, y left, z up; origin = front axle centre at wheel-centre height.
// Hardpoints, blower layout, drive ratio, boost and rates are illustrative.
export default {
  slug: "540k",
  title: "Under the skin of the 540 K",
  name: "Mercedes-Benz 540 K (W 29)",
  year: 1937,
  summary: "Independent wishbone front suspension, the Roots blower that only joins in at full pedal, and the streamlined body.",
  eyebrow: "Mercedes-Benz 540 K (W 29), 1936–1940",
  lede: "Three things about the supercharged 540 K, each shown working: the independent front suspension meeting a bump and a pothole, the Roots blower that only joins in when the driver floors the pedal, and what a streamlined body does for top speed. Scroll on: the museum photo then shows the suspension in place on the real car.",
  frame: { origin: "front", wheelbase: 3290, wheelR: 380, halfTrackFront: 757, halfTrackRear: 751 },
  ride: { ms: 450, mu: 65, ks: 30000, cs: 2000, kt: 200000 },
  orbit: { min: 0.8, max: 16 },
  sun: [3, 4, 6],
  // Cabriolet B: 3290 wheelbase, about 5.25 m long, 1.88 m wide; separate wings and running boards.
  body: {
    ghost: [
      { pts: [[230, -40], [250, 760], [170, 830], [-1720, 850], [-1720, -40]], y: [-440, 440] },                          // radiator shell and bonnet
      { pts: [[-1720, -160], [-1720, 730], [-3950, 740], [-4420, 470], [-4480, 60], [-4300, -160]], y: [-870, 870] },     // tub with boot
      { pts: [[-1760, 730], [-1900, 1200], [-3250, 1215], [-3850, 760]], y: [-730, 730] },                                // soft top and windscreen
      { pts: [[600, -230], [430, 250], [180, 490], [-200, 500], [-620, 290], [-1250, -60], [-1500, -140], [-2830, -140],   // wings + running board
        [-2980, 170], [-3290, 510], [-3700, 390], [-4080, 30], [-4200, -170], { arc: [-3290, 0, 420, 200, -20] },
        [-2900, -190], [-1450, -190], [-700, -40], { arc: [0, 0, 415, 195, -20] }, [560, -270]], y: [640, 920], mirror: true },
      { torus: { R: 290, r: 80, pos: [-1270, 860, 120], rot: [90, 14.3, 0] } },                                          // spare wheel
      { cyl: { r: [120, 100], h: 160, axis: "x", pos: [420, 420, 430] }, mirror: true },                                  // headlamps
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Black and white 1937 Mercedes-Benz 540 K Cabriolet B on display in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [3037.2, 3487.3, 1696.0], yaw: -2.4279, pitch: -0.2495, roll: -0.0171, f: 1320.9 }, // tools/photo-fits/540k.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_540K_1937_Cabriolet_B_LSideFront_MBMuse_9June2013_(14796944000).jpg" },
  },
  components: [
    {
      id: "susp", label: "Front suspension", subsystem: "linkage-suspension",
      view: { pos: [2.0, 2.5, 0.75], target: [-0.3, 0.25, -0.12] },
      ghost: { fill: 0.06, edge: 0.5 },
      params: {
        axle: "front",
        label: "Left front wheel · 25 km/h, shown 5× slower",
        readouts: ["travel", "load", "camber", "track"],
        W0: [0, 757, 0],
        links: [
          { name: "Lower wishbone, front leg", tok: "--l1", b: [170, 330, -140], c: [0, 640, -150] },
          { name: "Lower wishbone, rear leg", tok: "--l1", b: [-170, 330, -140], c: [0, 640, -150] },
          { name: "Upper wishbone, front leg", tok: "--l2", b: [150, 345, 160], c: [0, 630, 165] },
          { name: "Upper wishbone, rear leg", tok: "--l2", b: [-150, 345, 160], c: [0, 630, 165] },
          { name: "Track rod", tok: "--l5", b: [-160, 335, -30], c: [-150, 640, -35] },
        ],
        legendTitle: "Parts",
        legend: [["--l1", "Lower wishbone (two legs)"], ["--l2", "Upper wishbone (two legs)"], ["--l5", "Track rod"], ["--l4", "Coil spring"], ["--metal", "Frame and knuckle"]],
        frame: [[[380, 300, 20], [-750, 300, 20], 30], [[0, 0, -140], [0, 300, -140], 25], [[0, 495, 330], [0, 300, 330], 12]],
        bracket: { y: 290 },
        carrier: { style: "knuckle", kingpin: [0, 2], arm: 4, drum: { r: 170, w: 70, y: -30 } },
        wheel: { type: "wire", R: 295, r: 85, spokeR: 215, y: 20 },
        spring: { from: [0, 330, -140], link: 0, at: 0.52, top: [0, 495, 330], turns: 7, r: 46, pad: true },
        road: { x0: -6.2, x1: 5, seg: 480 },
        patch: [0.075, 0.07],
      },
      talk: [
        "Most cars of the 1930s still had a rigid beam axle on leaf springs at the front. Mercedes gave the 380 of 1933 parallel wishbones and coil springs, and the 500 K and 540 K kept them.",
        "Each front wheel now moves on its own: a bump under one wheel no longer tilts the other. Watch the orange trace spike over the bump and fall away in the pothole.",
        "With near-parallel arms the wheel stays almost upright, but the tyre slides sideways a few millimetres as it rises. See the track change readout.",
      ],
    },
    {
      id: "blower", label: "Supercharger", subsystem: "roots-blower",
      view: { pos: [1.35, 0.75, 1.05], target: [-0.38, 0.02, 0.28] },
      ghost: { fill: 0, edge: 0 },
      params: {
        blower: { ratio: 2.6, engageAt: 0.98, tauUp: 0.25, tauDown: 0.7, boostMax: 0.5, psAtmo: 115, psBoost: 180 },
        order: [1, 6, 2, 5, 8, 3, 7, 4],             // straight-eight crank for the drawing; illustrative
        engineLabel: "5.4-litre straight-eight",
      },
      talk: [
        "K stands for Kompressor. The 5.4-litre straight-eight makes 115 PS on its own and 180 PS with the blower working.",
        "The blower is not always on. Push the pedal through to the floor and a multi-plate clutch on the nose of the crankshaft couples it in; the engine's normal air inlet closes at the same moment. It was meant for short bursts.",
        "Mercedes blew the air through the carburettor instead of sucking mixture through the blower. A Roots blower does not squeeze air inside itself: the lobes carry pockets of air round the outside of the casing and push them into the outlet.",
      ],
    },
    {
      id: "aero", label: "Air drag", subsystem: "aero",
      view: { pos: [3.4, -6.2, 2.4], target: [-1.9, 0, 0.1] },
      ghost: { fill: 0.06, edge: 0.5 },
      params: {
        label: "Full power on the autobahn",
        shapes: [                                              // area, mass, rolling resistance and efficiency illustrative
          { id: "stream", label: "Streamliner (1938)", cd: 0.36, area: 2.3, mass: 2500, crr: 0.02, eta: 0.7, ps: 180, quoted: 185,
            profile: [[560, -150], [580, 100], [520, 350], [400, 560], [200, 700], [-1600, 880], [-1850, 940], [-2150, 1180], [-2500, 1250], [-2900, 1240],
              [-3400, 1080], [-4000, 800], [-4600, 450], [-5000, 100], [-5050, -100], [-4900, -200], [400, -200]] },   // sketched
          { id: "cabrio", label: "Cabriolet B body", cd: 0.48, area: 2.3, mass: 2500, crr: 0.02, eta: 0.7, ps: 180, quoted: 170 },   // cd illustrative
        ],
        power: { min: 60, max: 360 }, vmax: 240,
        nose: [250, 350], wheel: [-3290, -380], ground: -380, time: 3,
        // Centre-plane sections for the 2-D wind tunnel (z from the axle; the road at -380): the Cabriolet B from the ghost outline
        // and the photo, the Streamliner (its own profile) sketched from photos of the restored car. Underside flat.
        flow: {
          x0: 2000, x1: -9300, top: 3500, cell: 50, show: [-7800, 2700], rake: [150, 2500, 22],
          profile: [[150, -200], [230, -40], [250, 300], [250, 700], [215, 800], [120, 840], [-1720, 860], [-1800, 900], [-1950, 1240], [-2100, 1270],
            [-3250, 1260], [-3550, 1080], [-3850, 760], [-3950, 740], [-4250, 600], [-4420, 470], [-4480, 60], [-4300, -160], [-4200, -200]],
        },
      },
      talk: [
        "In 1938 Mercedes built one 540 K with a closed, streamlined body so that Dunlop could test tyres at sustained high speed on the new autobahns.",
        "Mercedes-Benz Classic measured the restored car in the wind tunnel in May 2014: a drag coefficient of 0.36, remarkable for its time.",
        "With the same 180 PS it reaches about 185 km/h, against about 170 km/h for an open Cabriolet. Drag rises with the square of speed, so those 15 km/h take a lot of power: slide it and see.",
        "In the wind tunnel, compare the two bodies. Behind the Cabriolet's upright windscreen and roof the air breaks away early into a wide wake; along the Streamliner's long, sloping tail it stays on the body for longer and leaves a smaller wake.",
      ],
    },
  ],
  note: "Geometry is illustrative: suspension hardpoints, blower layout, drive ratio, boost and spring rates are plausible values, not factory data.",
  unverified: ["Suspension hardpoints and rates", "Blower layout, 2.6 drive ratio, 0.5 bar boost, carburettor position", "Ghost-body outline", "Centre-plane sections: the Cabriolet B from the ghost outline and the photo; the Streamliner sketched from photos of the restored car", "Wind tunnel: a 2-D slice at a far lower Reynolds number than the real car (about 10⁴ against 10⁷), with the wheels outside it; its drag split is for the slice", "Whether the Cabriolet B or the 1938 Streamliner is on display", "Cabriolet B drag coefficient 0.48; frontal area, mass, rolling resistance and driveline efficiency of both bodies"],
  sources: [
    { label: "Motor Sport, April 1937", url: "https://www.motorsportmagazine.com/archive/article/april-1937/5/the-worlds-fastest-touring-car-2/" },
    { label: "Classic & Sports Car", url: "https://classicandsportscar.com/node/94450" },
    { label: "Haynes Museum workshop news", url: "https://www.haynesmuseum.org/news/workshop-news" },
    { label: "Wikipedia: Mercedes-Benz 380 (1933)", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_380_(1933)" },
    { label: "Petersen Automotive Museum: 1938 Mercedes-Benz 540 K Stromlinienwagen", url: "https://petersen.org/pages/petersen-vehicle/1938-mercedes-benz-540-k-stromlinienwagen" },
    { label: "kfz-tech.de: Mercedes Stromlinienwagen 1938", url: "https://kfz-tech.de/Engl/Hersteller/Mercedes/MercedesStromlinienwagen1938.htm" },
    { label: "Mercedes-Benz public archive: 380 (W 22)", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/380-W-22-1933---1934.xhtml?oid=4148" },
    { label: "D. Schroeder, Lattice-Boltzmann fluid dynamics in the browser", url: "https://physics.weber.edu/schroeder/fluids/" },
  ],
};
