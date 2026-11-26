// Mercedes-AMG F1 W11 EQ Performance, 2020. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Wheelbase (3,700), tracks and tyre size assumed from the 2020 rules; the dual-axis steering's linkage, toe angles and the
// tyre's cornering stiffness are illustrative: the team never published them.
export default {
  slug: "w11",
  title: "Steering in two directions",
  name: "Mercedes-AMG F1 W11 EQ Performance",
  year: 2020,
  summary: "Lewis Hamilton's 2020 title car, whose steering wheel also moved in and out to change the angle of the front wheels.",
  question: "Why pull a steering wheel towards you?",
  eyebrow: "Mercedes-AMG F1 W11 EQ Performance, 2020",
  lede: "The W11's drivers could do two things with the steering wheel: turn it, which steers the front wheels together, and pull it towards them or push it away, which changes the toe, the angle between the two front wheels seen from above. Mercedes called it DAS, dual-axis steering. Try both controls from above.",
  look: "The car's front wheels are almost upright and straight: their toe is a fraction of a degree, invisible from the gallery. What DAS changed is that small.",
  takeaway: "Toe-out helps a car turn in and warms its tyres, but on a straight it scrubs them and costs speed. DAS let the driver choose, corner by corner.",
  orbit: { min: 0.5, max: 16 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[1000, 100], [1000, 300], [500, 450], [-1000, 650], [-1700, 950], [-2300, 1000], [-3500, 800], [-4400, 1000], [-4600, 950], [-4500, 150], [-1000, 100]], y: [-420, 420] },   // body (sketched)
      { pts: [[-1200, 100], [-1300, 600], [-3300, 600], [-3500, 100]], y: [-700, 700] },                                                                                                 // sidepods
      { torus: { R: 250, r: 85, pos: [0, 848, 335], rot: [90, 0, 0] }, mirror: true },                                                                                                  // wheels
      { torus: { R: 250, r: 100, pos: [-3700, 800, 335], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 608,
    caption: "Photographed in testing at Barcelona in February 2020, the week DAS was first seen",
    alt: "Silver and black Mercedes-AMG F1 W11 with the number 44 in the pit lane at Barcelona, seen from above on its right side",
    cam: { c: [99.7, -10797.5, 4685.6], yaw: 1.7211, pitch: -0.3617, roll: -0.0419, f: 2003.2 }, // tools/photo-fits/w11.json
    credit: { author: "Artes Max", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:2020_Formula_One_tests_Barcelona,_Mercedes-AMG_F1_W11_EQ_Performance,_Hamilton.jpg" },
  },
  components: [
    {
      id: "das", label: "Dual-axis steering", subsystem: "dual-axis-steering",
      prompt: "Leave the steering straight and pull the wheel towards the driver. Do the front wheels steer the car? What does change?",
      answer: "The car does not steer: both wheels turn by the same amount in opposite directions. Their toe changes, from a little toe-out to straight ahead, so on a straight neither tyre is dragged sideways any more: less drag and less heat in the tyres. Push the wheel back before the corner for the toe-out that helps the car turn in.",
      view: { pos: [-0.4, 0.01, 4.2], target: [-0.15, 0, 0.3] },
      ghost: { fill: 0.02, edge: 0.3 },
      params: {
        label: "The front axle from above",
        halfTrack: 848, kingpinHalf: 690, wheelR: 335, tyreW: 305,
        arm: 110, gain: 0.048, toe0: -0.5, pullMax: 20, steerMax: 15,   // illustrative
        cornering: 90e3, kmh: 300, exaggerate: 8,                       // illustrative
      },
      talk: [
        "Every car has some toe, set in the workshop: the front wheels point very slightly inwards or outwards. On a Formula 1 car a little toe-out makes the car keener to turn in, and keeps the front tyres working and warm.",
        "On a straight, that same toe drags both front tyres a little sideways all the time: it costs some drag and heats the tyres. DAS let the driver pull the steering wheel on the straights to set the toe straight, and push it back before braking for a corner.",
        "Rivals saw drivers pulling the wheel back and forth during testing at Barcelona in February 2020. Red Bull protested at the Austrian Grand Prix; the stewards found it legal. A rule change banned it from 2021.",
        "Lewis Hamilton won his seventh world title in a W11 in 2020. In December 2024 the museum placed his car in Legend 7.",
      ],
    },
  ],
  note: "How DAS works is from the stewards' decision of 2020; its linkage, the size of the toe change and the tyre figures are illustrative, and the toe is drawn larger than it is.",
  unverified: [
    "Toe angles (0.5° toe-out, set straight by a 20 mm pull), linkage and the tyre's cornering stiffness",
    "Wheelbase, tracks and tyre size (from the 2020 rules) and the outline (sketched)",
    "Room: the museum placed the car in Legend 7 in December 2024",
  ],
  sources: [
    { label: "FIA: stewards' decision on the protest against car 44, Austrian Grand Prix 2020", url: "https://www.fia.com/sites/default/files/decision-document/2020%20Austrian%20Grand%20Prix%20-%20Decision%20-%20Protest%20-%20Car%2044.pdf" },
    { label: "Mercedes-Benz Museum: the F1 special presentation and Hamilton's W11 in Legend 7 (December 2024)", url: "https://sverige.mercedes-benz-clubs.com/wp-content/uploads/sites/89/2024/12/2024-12-16-F1-Sonderpraesentation-ENG.pdf" },
    { label: "Wikipedia: Mercedes-AMG F1 W11 EQ Performance", url: "https://en.wikipedia.org/wiki/Mercedes-AMG_F1_W11_EQ_Performance" },
  ],
};
