// Mercedes-Benz NECAR 1, 1994 (an MB 100 van). Frame: mm, x forward, y left, z up; origin = front axle centre on the
// ground. Wheelbase, track, wheel size and body outline of the MB 100 assumed; stack count and power, motor power from
// Daimler; cell count, cell area, voltage curve, the compressor's share and the layout of tank, stacks and motor illustrative.
export default {
  slug: "necar",
  title: "Electricity from hydrogen",
  name: "Mercedes-Benz NECAR 1",
  year: 1994,
  summary: "Daimler-Benz's first fuel-cell vehicle: a van whose whole cargo space held the stacks that turned hydrogen and air into electricity and water.",
  question: "How does a car make its own electricity from hydrogen?",
  eyebrow: "Mercedes-Benz NECAR 1, 1994",
  lede: "NECAR stands for New Electric Car. In 1994 Daimler-Benz filled the load space of an MB 100 van with twelve fuel-cell stacks, a hydrogen tank and the pumps and compressor to run them. Fade the body, ask the motor for more power, and follow hydrogen and air into the stacks, current to the motor and water out underneath.",
  look: "Look for the lettering “Brennstoffzellen Elektrofahrzeug” (fuel-cell electric vehicle) on the side, and the coloured block of cells painted behind the door.",
  takeaway: "A fuel cell burns nothing: hydrogen and oxygen combine quietly in it, and what comes out is electricity, warmth and water.",
  orbit: { min: 0.5, max: 16 },
  sun: [2, 3, 6],
  body: {
    ghost: [
      { pts: [[1150, 350], [1180, 800], [1000, 1050], [650, 1800], [450, 1950], [-3515, 1950], [-3515, 350]], y: [-900, 900] },   // van body (sketched on the photo)
      { torus: { R: 240, r: 75, pos: [0, 780, 315], rot: [90, 0, 0] }, mirror: true },                       // wheels
      { torus: { R: 240, r: 75, pos: [-2925, 780, 315], rot: [90, 0, 0] }, mirror: true },
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 799,
    alt: "White Mercedes-Benz MB 100 van with the lettering “Brennstoffzellen Elektrofahrzeug” and a painted block of cells, on a lit plinth in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [2326.1, 4755.4, 1787.8], yaw: 4.0985, pitch: -0.1374, roll: 0.0793, f: 1177.1 }, // tools/photo-fits/necar.json
    credit: { author: "Alexander Migl", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_Necar_1_IMG_0891.jpg" },
  },
  components: [
    {
      id: "cells", label: "Fuel cells", subsystem: "fuel-cell",
      prompt: "Raise the motor's demand from a little to the most it can have. What happens to the voltage of each cell, and to the hydrogen used?",
      answer: "The cells' voltage sags, from nearly 1 volt with no load to about half that at full power, while hydrogen use grows with the current. So the last kilowatts cost the most hydrogen, and the compressor's share grows too: of about 50 kW from the stacks, only about 30 kW reaches the motor.",
      view: { pos: [1.4, 4.6, 3.4], target: [-1.7, 0, 0.9] },
      ghost: { fill: 0.02, edge: 0.3 },
      params: {
        label: "Hydrogen and air in; electricity and water out",
        stacks: { x0: -3300, x1: -1300, y: 650, z0: 600, z1: 1750, n: [3, 4] },   // twelve stacks; layout illustrative
        tank: { x: -3600, z: 1200, r: 200, l: 1300 }, motor: [-150, 450], intake: [-1200, -900, 1500],   // illustrative
        cell: { cells: 480, area: 230, e0: 1.03, tafel: 0.05, j0: 0.005, r: 0.25, mt: 3e-5, n: 8, motor: 0.9, auxBase: 1500, auxShare: 0.3 },   // illustrative
        demand: { max: 30, value: 15 },
      },
      talk: [
        "Each cell is a thin sandwich: hydrogen on one side of a plastic membrane, air on the other. A catalyst splits the hydrogen; its protons pass through the membrane, its electrons cannot, and must go round through the motor. On the far side they meet oxygen from the air and make water.",
        "One cell gives about one volt with no load, less as it works harder. Hundreds of cells in series, grouped in twelve stacks, gave NECAR 1 about 50 kW.",
        "Much of that went to running the system itself, above all the compressor that blows air through the stacks: the van's electric motor had 30 kW.",
        "The equipment filled the load space, leaving two seats. Within two years NECAR 2 carried six people in a V-Class; today's fuel-cell vehicles fit everything under the floor.",
      ],
    },
  ],
  note: "Twelve stacks of about 50 kW and the 30 kW motor are Daimler's figures. The cells' number, size and voltage curve, the compressor's share and the layout inside the van are illustrative.",
  unverified: [
    "Number of cells, cell area and the voltage curve",
    "Share of the stacks' power taken by the compressor and pumps",
    "Layout of tank, stacks and motor in the van",
    "MB 100 wheelbase, track, wheel size and body outline (sketched)",
    "Room: photographed in the museum (Mercedes archive, 2025 visit); the room is not named",
  ],
  sources: [
    { label: "Mercedes-Benz Polska: 30 years of fuel-cell research (with a museum photo of NECAR 1)", url: "https://media.mercedes-benz.pl/30-lat-temu-mercedes-benz-rozpocza-badania-nad-zastosowaniem-ogniw-paliwowych-w-motoryzacji/" },
    { label: "Daimler: 25 years of NECAR 1", url: "https://www.marketscreener.com/DAIMLER-AG-436541/news/25-Years-of-NECAR-1-The-fuel-cell-electric-drive-celebrates-its-birthday-28439056/" },
    { label: "Motor Illustrated: four electrified models in the museum (2025)", url: "https://motorillustrated.com/mercedes-benz-museum-in-germany-4-electrified-models-not-to-be-missed/148994/" },
    { label: "Wikipedia: Proton-exchange membrane fuel cell", url: "https://en.wikipedia.org/wiki/Proton-exchange_membrane_fuel_cell" },
  ],
};
