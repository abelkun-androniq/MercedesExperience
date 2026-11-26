// Daimler motorised business vehicle, 1899. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Dimensions, radiator size, heat flow and radiator performance are illustrative.
export default {
  slug: "daimler-van",
  title: "Keeping the engine cool",
  name: "Daimler business vehicle",
  year: 1899,
  summary: "The forerunner of today's vans, with Wilhelm Maybach's tubular radiator at the front, below the engine.",
  question: "What flows through the radiator's tubes, water or air?",
  look: "Find the round radiator below the engine: the starting crank passes through its middle. Each small hole in its face is the end of a tube.",
  takeaway: "Look again at the round face: every hole is an air passage through the water, and the thin metal around it carries the heat across.",
  eyebrow: "Daimler motorised business vehicle, 1899",
  lede: "A 5.6 hp delivery van for 500 kg. Below its two-cylinder engine sits Maybach's tubular radiator: air streams through its tubes, the water flows around them. Compare it with a plain water tank, from the same start.",
  frame: { origin: "front", wheelbase: 2100, wheelR: 450 },
  orbit: { min: 0.8, max: 14 },
  sun: [3, -3, 6],
  body: {
    ghost: [
      { pts: [[550, 850], [550, 1550], [-800, 1550], [-800, 850]], y: [-290, 290] },                        // bonnet box
      { pts: [[-1100, 1300], [-1100, 1400], [-1600, 1400], [-1700, 1800], [-1780, 1800], [-1720, 1300]], y: [-500, 500] },   // driver's seat
      { pts: [[-800, 800], [-800, 950], [-3050, 950], [-3050, 800]], y: [-600, 600] },                     // frame and platform
      { torus: { R: 400, r: 30, pos: [0, 620, 400], rot: [90, 0, 0] }, mirror: true },                      // front wheels
      { torus: { R: 500, r: 30, pos: [-2100, 680, 500], rot: [90, 0, 0] }, mirror: true },                  // rear wheels
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Green 1899 Daimler motorised business vehicle on display in the Mercedes-Benz Museum, seen from the front right",
    cam: { c: [4259.6, -2327.5, 1583.5], yaw: 2.681, pitch: -0.1396, roll: -0.0632, f: 1551.4 }, // tools/photo-fits/daimler-van.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Daimler_Motor-Gesch%C3%A4ftswagen_1899_RSideFront_MBMuse_9June2013_(14983294032).jpg" },
  },
  components: [
    {
      id: "cool", label: "Cooling", subsystem: "radiator",
      prompt: "Both start with 90 °C water, at 16 km/h and 60 % load. In which system will the water cool down as you drive? Switch between them and watch the trace.",
      answer: "Only with the tubular radiator. Air streams through its tubes and takes 4.2 kW from the water at first, more than the engine's 3.6 kW, so it settles at 80 °C. Air only passes around the tank's outside walls: 1.5 kW, and its water climbs to boiling.",
      view: { pos: [1.9, -1.6, 1.6], target: [0, 0, 0.8] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "Cooling water, the same start for both",
        heat: 6000,                         // W into the water: about 1.5 × the 4.1 kW output; illustrative
        airT: 20, start: 90, load: 60, speed: { min: 0, max: 20, value: 16 },   // start and load: the comparison's fixed starting point
        types: [
          { id: "tubular", label: "Tubular radiator (1897)", kind: "tubular", ua: 60, still: 0.25, refSpeed: 16, water: 25 },   // illustrative
          { id: "tank", label: "Plain water tank", kind: "tank", ua: 22, still: 0.6, refSpeed: 16, water: 40 },                  // illustrative
        ],
        engine: { x: -150, z: 1150, l: 650, w: 450, h: 380 },
        radiator: { x: 560, z: 800, w: 460, h: 480, d: 110 },   // round core at the front, drawn square; size from the photo
      },
      real: {   // the part in real life (not this car)
        src: "parts/maybach-radiator.jpg", w: 330, h: 518,
        alt: "Wilhelm Maybach's 1897 drawing of the tubular radiator: a water box with many tubes running through it from front to back",
        caption: "Maybach's own drawing, 1897. The tubes run straight through the water box, front to back: air goes through them, the water fills the space around them. The round face on the van is the front of this box.",
        credit: { author: "Wilhelm Maybach (patent drawing, 1897)", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Tubular_car_radiator_copy_of_patent_drawing.png" },
      },
      talk: [
        "Wilhelm Maybach's tubular radiator was registered in December 1897 (utility model No. 104718): a flat water box pierced by many tubes, with air streaming through them and the water all around.",
        "The heat crosses each tube's thin metal wall, from the water to the air. Many small tubes give a large wall, so the passing air can carry a lot of heat away.",
        "On this van it sits at the front, below the engine: the round grille, with the starting crank through its middle.",
        "A plain tank sheds heat only through its outer walls; its water stores the rest and gets hotter. Without a radiator an engine simply loses the water that boils off: raise the load to see how fast it goes.",
        "The van itself: a two-cylinder of 1,527 cm³, 5.6 hp, 500 kg payload, 16 km/h, and roller chains to the rear wheels.",
      ],
    },
  ],
  note: "Daimler built five versions from 500 to 2,000 kg payload, with 3 to 10 hp.",
  unverified: ["Heat into the water (taken as 1.5 × engine output)", "Radiator and tank cooling performance", "The plain-tank comparison", "Radiator and engine sizes and positions (scaled from the photo)", "Ghost-body outline (traced from the photo)"],
  sources: [
    { label: "Mercedes-Benz press text on the 1899 business vehicle (Unimog-Club Gaggenau)", url: "https://unimog-club-gaggenau.de/en/?p=17931" },
    { label: "Motor Equipment News: the honeycomb radiator 120 years ago", url: "https://motorequipmentnews.co.nz/node/1168" },
    { label: "Mercedes-Benz public archive: Daimler Phoenix", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Daimler-Phoenix-car-1897---1902.xhtml?oid=5982" },
  ],
};
