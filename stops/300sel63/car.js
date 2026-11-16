// Mercedes-Benz 300 SEL 6.3 (W 109), 1968. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Corner masses, spring and bellows values, steel-spring rates and dimensions are illustrative.
export default {
  slug: "300sel63",
  title: "A saloon that keeps its height",
  name: "Mercedes-Benz 300 SEL 6.3",
  year: 1968,
  summary: "The 6.3-litre V8 of the 600 in the long saloon, riding on self-levelling air suspension.",
  eyebrow: "Mercedes-Benz 300 SEL 6.3 (W 109), 1968–1972",
  lede: "Load the car with passengers and luggage. On steel springs the tail sinks and stays down; on air springs valves pump the bellows back up to ride height, and the ride stays as soft as before.",
  frame: { origin: "front", wheelbase: 2850, wheelR: 340 },
  orbit: { min: 0.8, max: 16 },
  sun: [3, -4, 6],
  body: {
    ghost: [
      { pts: [[900, 260], [900, 700], [300, 800], [-1050, 850], [-1500, 1400], [-3200, 1420], [-3700, 950], [-4100, 900], [-4100, 300], [-3300, 260],
        { arc: [-2850, 340, 400, 192, -12] }, [-400, 260], { arc: [0, 340, 400, 192, -12] }], y: [-900, 900] },
    ],
  },
  components: [
    {
      id: "air", label: "Air suspension", subsystem: "air-suspension",
      view: { pos: [2.0, -5.2, 1.9], target: [-1.4, 0, 0.5] },
      ghost: { fill: 0.06, edge: 0.5 },
      params: {
        label: "Loading the car",
        front: 0, wheelbase: 2850, halfTrack: 740, wheelR: 340,
        corners: { front: { mass: 470, extra: 35 }, rear: { mass: 400, extra: 110 } },   // kg; illustrative
        air: { area: 0.012, volume: 0.003, n: 1.3 },                                    // illustrative
        steel: { front: 32000, rear: 26000 },                                           // N/m; illustrative
        damping: 2500,
        bellows: { r: 90, h: 220, z0: 230 },
        load: { heads: [[-1650, -380, 1150], [-2550, 380, 1100], [-2550, -380, 1100]], boot: [-3650, 700] },
      },
      talk: [
        "Erich Waxenberger, a Mercedes engineer, fitted the 6.3-litre V8 of the 600 limousine into the long W 109 saloon in his own time. It went into production in 1968: 250 PS, 0 to 100 km/h in 6.5 seconds, 220 km/h. 6,526 were built until 1972.",
        "Instead of steel springs, each wheel carries an air spring: a rubber bellows full of compressed air. Valves on the axles let in more air when the car sinks under load and let it out when the car rises.",
        "More air in the same bellows also makes it stiffer, in step with the extra weight. So a loaded car rides almost as softly as an empty one, at the same height. Watch the ride frequency.",
        "A steel spring of fixed stiffness can only sink further. Switch over and load the car.",
      ],
    },
  ],
  note: "The air suspension came from the 300 SE and 300 SEL of the early 1960s and was standard on every W 109.",
  unverified: ["Corner masses and the load added", "Bellows area and volume, steel-spring rates, damping, levelling speed", "Ghost-body outline"],
  sources: [
    { label: "Wikipedia: Mercedes-Benz 300SEL 6.3", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_300SEL_6.3" },
    { label: "Wikipedia: Mercedes-Benz W109", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_W109" },
    { label: "Classic Trader: Mercedes-Benz 300 SEL 6.3 profile", url: "https://www.classic-trader.com/en/magazine/mercedes-benz-300-sel-6-3-profile" },
  ],
};
