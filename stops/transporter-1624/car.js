// Mercedes-Benz 1624 car transporter, about 1980. Frame: mm, x forward, y left, z up; origin = front axle centre on the
// ground. Wheelbase, track and lamp positions are assumed for the photo fit. The museum names the hoist's principle
// (central hydraulics, cables, guide pulleys, pulley blocks) but not its layout or sizes: those are illustrative here.
export default {
  slug: "transporter-1624",
  title: "Lifting a deck full of cars",
  name: "Mercedes-Benz 1624 car transporter",
  year: 1980,
  summary: "A car transporter whose decks are raised and tilted by one hydraulic pump through cables and pulley blocks.",
  eyebrow: "Mercedes-Benz 1624 car transporter, 1980",
  lede: "Four new cars, six tonnes, stacked on two levels. The decks can be raised, lowered and tilted: one central pump makes the power, and steel cables carry it over pulleys to each end of a deck. Try the positions below.",
  orbit: { min: 1, max: 24 },
  sun: [3, 4, 8],
  body: {
    ghost: [
      { pts: [[-700, 1000], [1450, 1000], [1450, 2480], [-700, 2480]], y: [-1150, 1150] },                   // cab
      { pts: [[-6000, 800], [-700, 800], [-700, 1050], [-6000, 1050]], y: [-1250, 1250] },                   // lower deck
      { pts: [[-1000, 2520], [1900, 2620], [1900, 2740], [-1000, 2640]], y: [-1150, 1150] },                 // deck over the cab
      { torus: { R: 410, r: 110, pos: [0, 1000, 520], rot: [90, 0, 0] }, mirror: true },                     // front wheels
      { torus: { R: 410, r: 110, pos: [-5100, 1000, 520], rot: [90, 0, 0] }, mirror: true },                 // rear twin wheels
      { torus: { R: 410, r: 110, pos: [-5100, 700, 520], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Blue 1980 Mercedes-Benz 1624 car transporter loaded with four Mercedes cars on two decks, in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [4330.1, 3657.7, 1826.1], yaw: -2.4789, pitch: 0.0917, roll: 0.0164, f: 900.8 }, // tools/photo-fits/transporter-1624.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_1624_1980_Autotransporter_LSideFront_MBMuse_9June2013_(14797007518).jpg" },
  },
  components: [
    {
      id: "hoist", label: "Deck hoist", subsystem: "hoist",
      view: { pos: [1.6, 7.4, 4.4], target: [-3.1, 0, 2.0] },
      ghost: { fill: 0.04, edge: 0.4 },
      params: {
        label: "Upper rear deck · cables and pulley blocks",
        hoist: { falls: 4, bore: 0.05, sheaveEta: 0.96, sheaves: 6, stroke: 0.3, flow: 16 },   // all illustrative
        deck: { rear: [-4900, 1700], front: [-1300, 1700], y: 1150, mass: 500 },                // illustrative
        car: { mass: 1440, x: -3100, size: [4640, 1790, 1400] },                                 // a 280 CE (123 series)
        posts: { base: 1000, top: 3150 },
        presets: [
          { id: "travel", label: "Travel height", front: 1100, rear: 1100 },
          { id: "ramp", label: "Rear end down: a ramp", front: 1100, rear: 0 },
          { id: "nest", label: "Front end down: nest the cars", front: 500, rear: 1100 },
          { id: "low", label: "Both ends down", front: 0, rear: 0 },
        ],
      },
      talk: [
        "The museum's load: a 230 E and a 280 CE of the 123 series, a 380 SEL and a 500 SEC of the 126 series, about six tonnes of cars. With a trailer, a rig like this carried up to ten.",
        "The decks have what the museum calls a hybrid drive. One central hydraulic system makes the power, and steel cables carry it to each corner over guide pulleys and pulley blocks.",
        "Why a pulley block? A short cylinder fits beside the post. Reeve the cable four times between its two blocks, and 30 cm of piston travel becomes 1.2 m of deck travel, for four times the force on the piston.",
        "Raise both ends to lift the deck, or one end to tilt it: a tilted deck makes a ramp to drive up, or lets one car's bonnet tuck under the next. One pump feeds every cylinder, so moving both ends at once halves the speed.",
        "The truck itself: a 1624, for 16 tonnes, with a 12.8-litre diesel of 240 hp (177 kW).",
      ],
    },
  ],
  note: "Empty, the transporter weighs about 7 tonnes. The museum lifted it into place, five floors above street level, in a 20-tonne crane basket.",
  unverified: [
    "Hoist layout and sizes: number of falls, cylinder bore and stroke, pump flow, sheave efficiency, deck heights and travel",
    "Which deck is shown, its mass and the car's position on it",
    "Wheelbase (5,100 mm), track and lamp positions used for the photo fit",
    "Ghost-body outline (traced from the photo)",
    "Year (1980, from the photo caption)",
    "Room: Collection 2",
  ],
  sources: [
    { label: "Daimler Truck: A giant aloft, the car transporter at the Mercedes-Benz Museum", url: "https://daimlertruck.com/en/newsroom/pressrelease/a-giant-aloft-the-car-transporter-at-the-mercedes-benz-museum-52709588" },
  ],
};
