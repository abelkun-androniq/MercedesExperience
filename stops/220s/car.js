// Mercedes-Benz 220 S (W 111), 1959. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Mass, crush forces and stiffnesses, body dimensions are illustrative. The ghost body is drawn only over the photo:
// in the 3D view the crash body moves.
export default {
  slug: "220s",
  title: "Crumple zones and a rigid cell",
  name: "Mercedes-Benz 220 S",
  year: 1959,
  summary: "The 'Fintail' saloon: the first car built to Béla Barényi's safety body, with a rigid passenger cell between crumple zones.",
  eyebrow: "Mercedes-Benz 220 S (W 111), 1959",
  lede: "Drive the car into a wall in slow motion. The front folds up and takes the energy over half a metre while the cell stays whole. Then try a stiff front: it stops sooner, which is worse for the people inside.",
  frame: { origin: "front", wheelbase: 2750, wheelR: 340 },
  orbit: { min: 0.8, max: 16 },
  sun: [3, -4, 6],
  body: {
    ghost: [                                                                    // outline for the photo view; illustrative
      { pts: [[950, 300], [960, 760], [650, 830], [-650, 900], [-3200, 960], [-3925, 1010], [-3925, 330], [-3200, 300],
        { arc: [-2750, 340, 400, 192, -12] }, [-400, 300], { arc: [0, 340, 400, 192, -12] }], y: [-890, 890] },
      { pts: [[-650, 900], [-1150, 1470], [-2350, 1480], [-3050, 960]], y: [-700, 700] },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Cream 1964 Mercedes-Benz 220 S (W 111) on display in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [5378.5, 1864.4, 1708.1], yaw: -2.8155, pitch: -0.1618, roll: 0.005, f: 1624.7 }, // tools/photo-fits/220s.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_220S_1964_LSideFront_MBMuse_9June2013_(14960636166).jpg" },
  },
  components: [
    {
      id: "crash", label: "Crash test", subsystem: "crumple-zone",
      view: { pos: [2.4, -4.6, 2.2], target: [-0.9, 0, 0.6] },
      ghost: { fill: 0, edge: 0 },
      params: {
        label: "Frontal crash into a rigid wall",
        mass: 1350,                                             // kg with occupants; illustrative
        speed: { min: 20, max: 65, value: 50 }, slow: 40,
        cases: [
          { id: "safe", label: "Safety body: crumple zone", zone: { type: "crumple", force: 280e3, length: 0.6, ramp: 0.06 }, cellK: 8e6 },   // illustrative
          { id: "rigid", label: "Stiff front", zone: { type: "stiff", k: 2.6e6, length: 0.3 }, cellK: 2.5e6 },                                // illustrative
        ],
        folds: 6,
        body: { bumper: 950, firewall: -250, cellRear: -2350, tail: -3950, w: 880, sill: 250, belt: 900, roof: 1450 },
        wheels: { front: 0, rear: -2750, R: 340 },
      },
      real: {   // the part in real life (not this car)
        src: "parts/crash-test.jpg", w: 800, h: 559,
        alt: "An orange crash-test Mercedes C-Class with its front crushed and its cabin intact",
        caption: "A Mercedes C-Class after a crash test, decades later: the front has folded up and taken the blow, while the passenger cell and its doors kept their shape. The same idea as in the 220 S.",
        credit: { author: "Kalispera Dell", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:Crash_test_car_from_the_West_Germany_USA_zone_before_120278145_(cropped).jpg" },
      },
      talk: [
        "Béla Barényi patented the idea in 1951 (DBP 854 157): a rigid passenger cell, with front and rear sections built to fold up in a controlled way.",
        "The W 111 saloon of 1959 was the first car built that way. On 10 September 1959 Mercedes ran its first crash test at Sindelfingen, driving a W 111 into a solid barrier.",
        "Stopping from 50 km/h always means getting rid of the same energy. A long, soft crush does it with a lower force, so the people inside feel less deceleration. Compare the peak g of both fronts.",
        "The stiff front stops in a shorter distance at a far higher force, and pushes into the cell itself.",
      ],
    },
    {
      id: "measure", label: "The measuring car", subsystem: "measuring-car",
      prompt: "Drive over the bump with good dampers, then with worn ones. What does the recorder in the car behind show?",
      answer: "With good dampers the trace swings once or twice and settles. With worn ones the wheel and body go on bouncing for several swings after each bump: exactly what the engineers in the measuring car could see on paper while the test was still running.",
      view: { pos: [-0.8, 7.6, 2.1], target: [-2.9, 0.3, 0.5] },
      ghost: { fill: 0.03, edge: 0.3 },
      params: {
        label: "Front left wheel, signal back to the recorder",
        wheel: { x: 0, y: 740, R: 340 }, tail: -3900,
        follower: { x0: -10500, x1: -5900, w: 1800, h: 1450 }, recorder: [-6500, 300, 1150],   // gap and recorder position illustrative
        ride: { ms: 350, mu: 45, ks: 22000, kt: 180000, cs: 1800, csWorn: 350 },             // illustrative
        speed: { min: 20, max: 80, value: 50 },
      },
      talk: [
        "Behind this car in the gallery stands a one-off: a 1960 Mercedes-Benz 300 estate converted into a measuring car. In road tests a cable linked it to the car being tested, ahead of it.",
        "Sensors on the test car measured what engineers wanted to know, such as how far the suspension moved. The signals ran back along the cable to recording instruments in the measuring car, where engineers watched them as the test went on.",
        "Over a bump the spring compresses and the wheel rises; the damper decides how quickly the bouncing dies away. Worn dampers show up at once in the trace.",
        "Before such instruments, test drivers could only report how a car felt. Measurements on the road let engineers compare one design with another in numbers.",
      ],
    },
  ],
  note: "Real crush behaviour is far more ragged than this model's nearly constant force. The fins at the back gave the car its nickname 'Heckflosse'.",
  unverified: ["Mass, crush forces, crush lengths and stiffnesses (chosen to give plausible g values)", "Body dimensions and ghost-body outline", "Which W 111 variant is on display (the photo shows a 1964 220 S)", "Measuring car: the sensor, the recorder and the suspension figures are illustrative; the museum names the cable link, not the instruments"],
  sources: [
    { label: "Mercedes-Benz Museum: the 300 measuring car and the 220 S in Legend 5 (2022)", url: "https://mb-france.mercedes-benz-clubs.com/wp-content/uploads/sites/21/2022/02/2022Messwagentxt.pdf" },
    { label: "Mercedes-Benz press text: the passenger safety cell is patented (German Car Forum)", url: "https://www.germancarforum.com/threads/mercedes-benz-23-january-1951-the-passenger-safety-cell-is-patented.36023" },
    { label: "Motorway America: Mercedes-Benz marks 50 years of crash testing", url: "https://www.motorwayamerica.com/content/mercedes-benz-marks-50-years-crash-testing-first-car" },
    { label: "Tecosim: history of crash tests", url: "https://tecosim.com/history-of-crash-tests/" },
    { label: "Wikipedia: Mercedes-Benz W111", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_W111" },
  ],
};
