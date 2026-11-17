// Mercedes-Benz 190 SL (W 121 B II), 1955–1963. Frame: mm, x forward, y left, z up; origin = front axle centre on the
// ground. Wheelbase, tracks, tyres and body size from the archive data sheet; engine position and conrod illustrative.
export default {
  slug: "190sl",
  title: "The other SL",
  name: "Mercedes-Benz 190 SL",
  year: 1959,
  summary: "The 300 SL's affordable sister: the same look, a saloon floorpan and a new 1.9-litre overhead-camshaft four.",
  eyebrow: "Mercedes-Benz 190 SL, 1959",
  lede: "It looks like a 300 SL, but underneath it is far simpler. Its engine is a four-cylinder with the 300 SL's bore and a camshaft in the head, turned by a chain. Watch the cam open each valve directly as the four cylinders fire in turn.",
  orbit: { min: 0.5, max: 14 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[600, 230], [600, 740], [-600, 830], [-2950, 820], [-3330, 620], [-3300, 230]], y: [-860, 860] },             // body
      { pts: [[600, 230], [930, 260], [960, 560], [600, 740]], y: [-600, 600] },                                              // nose
      { pts: [[-420, 830], [-700, 1300], [-760, 1300], [-480, 830]], y: [-640, 640] },                                      // windscreen
      { torus: { R: 255, r: 65, pos: [0, 715, 315], rot: [90, 0, 0] }, mirror: true },                                      // wheels
      { torus: { R: 255, r: 65, pos: [-2400, 737, 315], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Grey 1958 Mercedes-Benz 190 SL roadster with red seats and the top down, in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [2618.5, 1444.9, 1387.9], yaw: -2.7015, pitch: -0.2894, roll: 0.0853, f: 1023.1 }, // tools/photo-fits/190sl.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_190SL_1958_Convertible_Grace_Kelly_LSideFront_MBMuse_9June2013_(14797055069).jpg" },
  },
  components: [
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [1.5, 1.5, 1.3], target: [0.18, 0, 0.45] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "M 121 four, overhead camshaft · firing order 1-3-4-2",
        order: [1, 3, 4, 2], bore: 85, stroke: 83.6, rod: 145,           // rod illustrative
        xs: [360, 260, 160, 60], crankZ: 330, lean: 0,                    // positions illustrative
        valvetrain: "ohc", ignition: "spark", fuel: "carb", crankcase: "open",
        speed: { min: 5, max: 60, value: 20 }, realRpm: 5700,
      },
      talk: [
        "The 190 SL shares the 300 SL's styling and its suspension layout, wishbones at the front and a swing axle at the rear. But instead of a tubular space frame it sits on a shortened floorpan from the saloons, which made it far cheaper to build.",
        "Its engine, the M 121, was new: four cylinders with the 300 SL's 85 mm bore and an 83.6 mm stroke, 1.9 litres in all, giving 105 hp at 5,700 rpm through two twin-choke Solex carburettors.",
        "One camshaft in the head, driven by a double roller chain, opens all eight valves. With no pushrods in between, the valve gear stays light and can follow the cam at high revs.",
        "Firing order 1-3-4-2: one power stroke every half turn. Pistons 1 and 4 rise and fall together, 2 and 3 opposite them. Detuned, the same engine later powered the 180 and 190 saloons.",
      ],
    },
  ],
  note: "Since 2017 the museum's 190 SL has been an unrestored 1959 roadster that belonged to astronaut David Scott, the seventh man on the Moon, who bought it new and kept it until 2004. The photo, from 2013, shows the car displayed before it.",
  unverified: [
    "Engine position in the car and conrod length",
    "Lamp and star positions used for the photo fit",
    "Ghost-body outline (traced from the data-sheet sizes and the photo)",
    "Room: Collection 4 (the research notes put it in Legend 4)",
  ],
  sources: [
    { label: "Mercedes-Benz Classic archive: 190 SL Roadster (W 121 B II), data sheet", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/190-SL-Roadster.xhtml?oid=4657" },
    { label: "Wikipedia: Mercedes-Benz 190 SL", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_190_SL" },
    { label: "mbpassion: vehicle swap in the Gallery of Names (2017, German)", url: "https://mbpassion.de/2017/04/fahrzeugtausch-in-der-galerie-der-namen-im-mercedes-benz-museum/" },
  ],
};
