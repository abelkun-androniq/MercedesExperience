// Benz Victoria, 1893. Frame: mm, x forward, y left, z up; origin = rear axle centre on the ground.
// Wheelbase, track, wheel sizes and steering geometry are illustrative (no published figures found).
export default {
  slug: "victoria",
  title: "How the Victoria steers",
  name: "Benz Victoria",
  year: 1893,
  summary: "Carl Benz's double-pivot steering: each front wheel on its own pivot, angled so both follow one turning circle.",
  eyebrow: "Benz Victoria, 1893",
  lede: "The first Benz with double-pivot steering, seen from above. Steer it, then switch to the carriage-style centre-pivot axle it replaced and compare where the wheel axes meet.",
  frame: { origin: "rear", wheelbase: 1650, wheelR: 560 },
  orbit: { min: 1, max: 16 },
  sun: [2, 3, 8],
  body: {
    ghost: [
      { pts: [[-250, 650], [1350, 650], [1400, 900], [1150, 950], [350, 950], [300, 1300], [-150, 1350], [-300, 950]], y: [-560, 560] },   // body and rear seat
      { pts: [[1350, 650], [1560, 1050], [1530, 1080], [1320, 700]], y: [-480, 480] },                                                // splash board
    ],
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
  unverified: ["Wheelbase, track, wheel sizes and steering-arm geometry", "Ghost-body outline", "Room and level"],
  sources: [
    { label: "mbpassion: 1893, Carl Benz und die Achsschenkel-Lenkung", url: "https://mbpassion.de/2018/02/1893-carl-benz-und-die-achsschenkel-lenkung/" },
    { label: "Benz Insider: Carl Benz and his double-pivot steering", url: "https://www.benzinsider.com/?p=1660" },
    { label: "Zwischengas: Fernfahrt Theodor von Liebieg", url: "https://www.zwischengas.com/de/news/Fernfahrt-Theodor-von-Liebieg.html" },
    { label: "Wikipedia: Benz Victoria", url: "https://en.wikipedia.org/wiki/Benz_Victoria" },
  ],
};
