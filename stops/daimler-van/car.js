// Daimler motorised business vehicle, 1899. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Dimensions, radiator size, heat flow and radiator performance are illustrative.
export default {
  slug: "daimler-van",
  title: "Keeping the engine cool",
  name: "Daimler business vehicle",
  year: 1899,
  summary: "The forerunner of today's vans, with Wilhelm Maybach's tubular radiator right below the engine.",
  eyebrow: "Daimler motorised business vehicle, 1899",
  lede: "A 5.6 hp delivery van for 500 kg. Below its two-cylinder engine sits Maybach's tubular radiator. Switch between it and a plain water tank, change the speed, and watch the water temperature.",
  frame: { origin: "front", wheelbase: 2100, wheelR: 450 },
  orbit: { min: 0.8, max: 14 },
  sun: [3, -3, 6],
  body: {
    ghost: [
      { pts: [[-2650, 750], [-600, 750], [-600, 2050], [-2650, 2050]], y: [-800, 800] },                   // box body
      { pts: [[-600, 750], [350, 750], [350, 1250], [-600, 1400]], y: [-420, 420] },                        // bonnet
      { torus: { R: 400, r: 30, pos: [0, 620, 400], rot: [90, 0, 0] }, mirror: true },                      // front wheels
      { torus: { R: 500, r: 30, pos: [-2100, 680, 500], rot: [90, 0, 0] }, mirror: true },                  // rear wheels
    ],
  },
  components: [
    {
      id: "cool", label: "Cooling", subsystem: "radiator",
      view: { pos: [1.9, -1.6, 1.6], target: [0, 0, 0.8] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "Cooling water at full load",
        heat: 6000,                         // W into the water: about 1.5 × the 4.1 kW output; illustrative
        airT: 20, speed: { min: 0, max: 20, value: 16 },
        types: [
          { id: "tubular", label: "Tubular radiator (1897)", kind: "tubular", ua: 60, still: 0.25, refSpeed: 16, water: 25 },   // illustrative
          { id: "tank", label: "Plain water tank", kind: "tank", ua: 22, still: 0.6, refSpeed: 16, water: 40 },                  // illustrative
        ],
        engine: { x: -200, z: 1050, l: 650, w: 450, h: 380 },
        radiator: { x: 200, z: 620, w: 650, h: 300, d: 110 },
      },
      talk: [
        "Wilhelm Maybach's tubular radiator was registered in December 1897 (utility model No. 104718): a flat water box pierced by many tubes, with air streaming through them.",
        "On this van it sits right below the engine, with the starting crank through its middle.",
        "Without a radiator an engine simply loses the water that boils off. Switch to the plain tank at full load and see how fast it goes.",
        "The van itself: a two-cylinder of 1,527 cm³, 5.6 hp, 500 kg payload, 16 km/h, and roller chains to the rear wheels.",
      ],
    },
  ],
  note: "Daimler built five versions from 500 to 2,000 kg payload, with 3 to 10 hp.",
  unverified: ["Heat into the water (taken as 1.5 × engine output)", "Radiator and tank cooling performance", "The plain-tank comparison", "Radiator and engine sizes and positions", "Ghost-body outline"],
  sources: [
    { label: "Mercedes-Benz press text on the 1899 business vehicle (Unimog-Club Gaggenau)", url: "https://unimog-club-gaggenau.de/en/?p=17931" },
    { label: "Motor Equipment News: the honeycomb radiator 120 years ago", url: "https://motorequipmentnews.co.nz/node/1168" },
    { label: "Mercedes-Benz public archive: Daimler Phoenix", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Daimler-Phoenix-car-1897---1902.xhtml?oid=5982" },
  ],
};
