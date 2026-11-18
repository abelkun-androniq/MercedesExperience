// Mercedes-Benz O 302 coach, 1974, the West German team bus of the 1974 World Cup. Frame: mm, x forward, y left, z up;
// origin = front axle centre on the ground. Body size approximate; the heat-balance figures (thermal capacity, heat loss,
// sun, cooling capacity) illustrative.
export default {
  slug: "o302",
  title: "Cool air for the team",
  name: "Mercedes-Benz O 302",
  year: 1974,
  summary: "The coach that carried West Germany's footballers at the 1974 World Cup, with air conditioning on its roof.",
  eyebrow: "Mercedes-Benz O 302, 1974",
  lede: "A coach in summer is a glasshouse full of people: each passenger gives off about as much heat as a light bulb, and the sun pours in through the windows. The unit on the roof takes that heat out. Fill the coach, switch the unit off and watch the temperature climb.",
  orbit: { min: 0.5, max: 26 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[2400, 450], [2450, 3050], [-8300, 3050], [-8400, 450]], y: [-1250, 1250] },   // body
      { torus: { R: 400, r: 120, pos: [0, 1000, 500], rot: [90, 0, 0] }, mirror: true },     // wheels
      { torus: { R: 400, r: 120, pos: [-5600, 930, 500], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Yellow 1974 Mercedes-Benz O 302 coach of the West German World Cup team in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [4564.2, 2560.9, 1594.2], yaw: -2.5799, pitch: -0.0585, roll: -0.0019, f: 945.7 }, // tools/photo-fits/o302.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_O302_1974_Mannschafts-Reisebus_West_Germany_WorldCup_LSideFront_MBMuse_9June2013_(14797020757).jpg" },
  },
  components: [
    {
      id: "climate", label: "Air conditioning", subsystem: "cabin-climate",
      view: { pos: [4.5, -11, 7], target: [-2.8, 0, 1.6] },
      ghost: { fill: 0.04, edge: 0.4 },
      params: {
        label: "A full coach on a summer day",
        cabin: { capacity: 400000, ua: 600, sun: 6000, person: 100, cooling: 20000, set: 24 },   // illustrative
        saloon: { x0: -8100, x1: 1800, y: 1150, z0: 1150, z1: 2950 },
        unit: [-4500, -1500], seats: 11,
        passengers: { min: 0, max: 44, value: 30 }, outside: { min: 15, max: 35, value: 28 },
        lapse: 120,
      },
      talk: [
        "Each passenger gives off about 100 watts of heat; forty of them add four kilowatts. Through the large windows the sun can add as much again, and on a warm day the outside air brings in more.",
        "With no way to get rid of it, the saloon settles far above the outside temperature. Air conditioning removes the heat: refrigerant evaporating in the roof unit cools the air that fans blow down the length of the coach.",
        "A thermostat holds the setting. Fill the coach on a hot day and the unit may reach its limit; the temperature then rises until the heat flowing out through the body balances the rest.",
        "The O 302 was built from 1965 to the mid-1970s. This one took the West German team, the later world champions, to their matches in 1974.",
      ],
    },
  ],
  note: "One lump of air and interior with a single heat-loss figure: a heat balance to show the idea, not measurements of this coach.",
  unverified: [
    "Thermal capacity, heat loss, solar gain and cooling capacity",
    "Whether this coach's unit is original equipment",
    "Ghost-body outline (sketched from the data-sheet sizes, not yet traced from the photo)",
    "Room: Collection 1",
  ],
  sources: [
    { label: "Wikipedia: Mercedes-Benz O 302", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_O_302" },
  ],
};
