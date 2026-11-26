// Mercedes-AMG F1 W12 E Performance, 2021. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Wheelbase (3,700), tracks and tyre size assumed from the 2021 rules; phase times of the stop are typical of a two-second
// stop, not this car's; the jack lift and the speed used for the track lost are illustrative.
export default {
  slug: "w12",
  title: "Two seconds in the pits",
  name: "Mercedes-AMG F1 W12 E Performance",
  year: 2021,
  summary: "The 2021 Formula 1 car that hangs on the wall above the museum's pit-stop rig: one wheel change, taken apart step by step.",
  question: "How do you change four wheels in two seconds?",
  eyebrow: "Mercedes-AMG F1 W12 E Performance, 2021",
  lede: "The W12 hangs on the wall behind the museum's pit-stop rig, where visitors can try a wheel change themselves. Here is one corner of a stop, slowed down: jacks, the wheel gun, the centre nut, the hub and two wheels. Step through it, then see what happens when the gun meets the nut at an angle.",
  look: "Find the car hanging upright on the wall, and the single big nut at the centre of each wheel. Then try the rig in front of it.",
  takeaway: "A two-second stop is twenty people each doing one small job at once, and every one of them can lose the race.",
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
    src: "photo.jpg", w: 1200, h: 675,
    caption: "Photographed racing at the 2021 Austrian Grand Prix; in the museum the car hangs on the wall behind the pit-stop rig",
    alt: "Black Mercedes-AMG F1 W12 with the number 44 and Petronas lettering, at speed on the Red Bull Ring, seen from its left side",
    cam: { c: [610.8, 14941.7, 4672.4], yaw: -1.7171, pitch: -0.2521, roll: 0.0478, f: 3000.1 }, // tools/photo-fits/w12.json
    credit: { author: "Lukas Raich", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2021_Nr._44_Hamilton_(side).jpg" },
  },
  components: [
    {
      id: "pit", label: "Wheel change", subsystem: "pit-stop",
      prompt: "Step through the stop. What holds the wheel on, and what turns it?",
      answer: "The centre nut only holds the wheel on: pegs on the hub carry the drive and the braking. That is why one nut is enough, and why the gun can spin it off in about a quarter of a second. The nut stays in the wheel, so the old one leaves with its nut and the new one arrives with its own.",
      view: { pos: [1.7, 2.6, 1.1], target: [0, 0.75, 0.3] },
      ghost: { fill: 0.02, edge: 0.3 },
      params: {
        label: "The left front corner of a stop, slowed down",
        wheel: { x: 0, y: 848, R: 335, w: 305 },
        lift: 80, roll: 1500, speed: 200,   // illustrative
      },
      talk: [
        "Each corner has a crew of three: one on the gun, one taking the old wheel off, one putting the new wheel on. Jacks at the nose and tail lift the car; more crew steady it and watch the traffic in the pit lane.",
        "A Formula 1 wheel is held by a single centre nut, and the nut is held in the wheel. One pull of the trigger undoes it, the gun reverses by itself, and the next pull tightens the new one.",
        "While the car stands still for two seconds, cars on the track cover more than 100 metres. A tenth of a second lost in the pits can be a place lost on the road.",
        "At Monaco in 2021 the gun met the nut on Valtteri Bottas's W12 at an angle and machined away the lugs it grips. The nut could not be turned; the wheel came off only at the factory, about 43 hours later. Turn on “Gun at an angle” to see it.",
        "In 2021 Mercedes won its eighth constructors' title in a row with the W12.",
      ],
    },
  ],
  note: "Phase times are typical of a two-second stop. The jack lift and the speed used for the track lost while standing are round numbers.",
  unverified: [
    "Phase times of the stop (typical, not this car's)",
    "Wheelbase, tracks and tyre size (from the 2021 rules) and the outline (sketched)",
    "Speed used for the track lost while standing (200 km/h)",
  ],
  sources: [
    { label: "Mercedes-Benz Museum: the pit-stop exhibit", url: "https://www.mercedes-benz.com/en/art-and-culture/museum/exhibition/formula-one-pit-stop/" },
    { label: "Mercedes-Benz Museum: the pit stop and the W12 on the wall (December 2024)", url: "https://sverige.mercedes-benz-clubs.com/wp-content/uploads/sites/89/2024/12/2024-12-02-PI-Boxenstopp-ENG.pdf" },
    { label: "Formula 1: anatomy of a pit stop", url: "https://www.formula1.com/en/latest/article/anatomy-of-a-pit-stop-how-do-teams-service-their-cars-in-less-than-two.5p9LNdd8XJdvP4mRsXoGsB" },
    { label: "Motorsport.com: how Bottas's pit stop lasted 43 hours", url: "https://www.motorsport.com/f1/news/how-bottas-pitstop-ended-up-being-43-hours-long/6516768/" },
  ],
};
