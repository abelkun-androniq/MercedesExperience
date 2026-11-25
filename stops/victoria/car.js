// Benz Victoria, 1893. Frame: mm, x forward, y left, z up; origin = rear axle centre on the ground.
// Wheelbase, track, wheel sizes and steering geometry are illustrative (no published figures found).
export default {
  slug: "victoria",
  title: "How the Victoria steers",
  name: "Benz Victoria",
  year: 1893,
  summary: "Carl Benz's double-pivot steering: each front wheel turns on its own pivot, the inner one more sharply, so both roll round the same turning centre.",
  question: "Why does the inner front wheel turn more sharply?",
  eyebrow: "Benz Victoria, 1893",
  lede: "The first Benz with double-pivot steering, seen from above. Steer it, then switch to the carriage-style centre-pivot axle it replaced and compare where the wheel axes meet.",
  frame: { origin: "rear", wheelbase: 1650, wheelR: 560 },
  orbit: { min: 1, max: 16 },
  sun: [2, 3, 8],
  body: {
    ghost: [
      { pts: [[-420, 880], [1950, 880], [2130, 1190], [-420, 1190]], y: [-560, 560] },                                    // body, traced from the photo
      { pts: [[0, 1190], [40, 2040], [300, 2110], [700, 2080], [800, 1800], [700, 1450], [500, 1190]], y: [-560, 560] },             // hood over the rear seat
      { pts: [[1550, 1190], [1550, 1450], [1980, 1450], [2050, 1700], [2120, 1700], [2100, 1190]], y: [-500, 500] },    // facing front seat
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "1893 Benz Vis-à-Vis, a Victoria with a facing front seat, on display in the Mercedes-Benz Museum, seen from the front right",
    cam: { c: [4278.7, -4540.6, 1498.2], yaw: 2.1978, pitch: -0.101, roll: -0.0394, f: 1377 }, // tools/photo-fits/victoria.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Benz_Vis-%C3%A0-Vis_1893_RSideFront_MBMuse_9June2013_(14960657626).jpg" },
  },
  components: [
    {
      id: "steer", label: "Steering", subsystem: "steering",
      view: { pos: [-3.6, -0.2, 7.6], target: [0.8, 0, 0] },
      ghost: { fill: 0.04, edge: 0.35 },
      params: {
        label: "Front steering, seen from above",
        kingpinHalf: 600, arm: 160, wheelbase: 1650, stub: 60,
        frontR: 380, rearR: 560, halfTrackRear: 640,
        maxSteer: 30,
      },
      talk: [
        "Horse carriages steered with a centre-pivot axle: the whole front axle swings on a turntable. Try it: at full lock the inner wheel swings back towards the body and the car stands on a narrower base.",
        "Benz's answer, patented in 1893 (DRP 73515) and first fitted to the Victoria: the axle stays put and each front wheel turns on its own pivot at the end of the axle.",
        "The steering arms point in towards the rear axle, so the inner wheel turns further than the outer one. Their axes then almost meet in one point on the rear-axle line, and the wheels roll round the corner instead of scrubbing. Watch the two coloured lines.",
        "Carriage builders Lankensperger and Ackermann had described the idea around 1817; Benz made it work on a motor car. In 1894 Theodor von Liebieg drove his Victoria about 939 km from Reichenberg in Bohemia to Reims.",
      ],
    },
  ],
  note: "Geometry is illustrative: wheelbase, track, wheel sizes and steering-arm geometry are plausible values, not measurements of the car.",
  unverified: ["Wheelbase, track, wheel sizes and steering-arm geometry", "Ghost-body outline (traced from the photo)", "Which car is shown: the photo is the museum's 1893 Vis-à-Vis, the Victoria with a facing front seat", "Room and level"],
  sources: [
    { label: "mbpassion: 1893, Carl Benz und die Achsschenkel-Lenkung", url: "https://mbpassion.de/2018/02/1893-carl-benz-und-die-achsschenkel-lenkung/" },
    { label: "Benz Insider: Carl Benz and his double-pivot steering", url: "https://www.benzinsider.com/?p=1660" },
    { label: "Zwischengas: Fernfahrt Theodor von Liebieg", url: "https://www.zwischengas.com/de/news/Fernfahrt-Theodor-von-Liebieg.html" },
    { label: "Wikipedia: Benz Victoria", url: "https://en.wikipedia.org/wiki/Benz_Victoria" },
  ],
};
