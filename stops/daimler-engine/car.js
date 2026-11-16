// Daimler/Maybach single-cylinder "Grandfather Clock" engine, 1884–1885. A bare engine exhibit, so no car body.
// Frame: m from the crank centre, x forward, z up. Bore × stroke per period data sheets (sources disagree); rest illustrative.
export default {
  slug: "daimler-engine",
  title: "The Grandfather Clock engine",
  name: "Daimler “Grandfather Clock” engine",
  year: 1885,
  summary: "The fast-running single cylinder that made a motor vehicle possible: hot-tube ignition and flywheels sealed in the crankcase.",
  eyebrow: "Daimler and Maybach single-cylinder engine, 1884–1885",
  lede: "Gottlieb Daimler and Wilhelm Maybach's small, fast-running engine, shown turning over in slow motion: the falling piston sucks the intake valve open, a groove in the flywheel pushes the exhaust valve, and a glowing tube lights the mixture near the top of the compression stroke.",
  orbit: { min: 0.3, max: 4 },
  components: [
    {
      id: "engine", label: "Engine", subsystem: "inline-engine",
      view: { pos: [0.95, 0.75, 0.45], target: [0, 0, 0.16] },
      ghost: { fill: 0, edge: 0 },
      params: {
        label: "Four-stroke cycle · one cylinder",
        order: [1],
        bore: 58, stroke: 100, rod: 200,            // rod length illustrative
        xs: [0], crankZ: 0, lean: 0,
        valvetrain: "atmospheric", ignition: "hot-tube", fuel: "carb", crankcase: "flywheels",
        speed: { min: 5, max: 60, value: 20 },
        realRpm: 600,
      },
      talk: [
        "Daimler and Maybach built this engine in Cannstatt in 1884–85. Its upright cylinder on a round crankcase earned it the nickname Standuhr, the Grandfather Clock.",
        "It ran at about 600 rpm, when most gas engines of the day managed 120 to 180. More revs from the same size means more power for the weight: light enough to put in a vehicle. A version of it drove the 1885 Riding Car.",
        "There is no spark plug. A tube outside the cylinder is kept glowing by a burner; the compression stroke pushes mixture into it and it lights itself. Watch the glow on the left of the head.",
        "Only the exhaust valve is driven, by a rod from a curved groove in the flywheel. The intake valve has no cam at all: the falling piston sucks it open.",
      ],
    },
  ],
  note: "Geometry is illustrative: only the bore and stroke come from period data, and valve and hot-tube positions are simplified.",
  unverified: [
    "Bore 58 mm × stroke 100 mm (264 cc) and 0.5–1 hp at about 600 rpm: sources disagree, and some figures may describe the Riding Car's version",
    "Conrod length, valve sizes and timing",
    "Room and level",
  ],
  sources: [
    { label: "Mercedes-Benz public archive: Daimler Riding Car, 1885", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Daimler-riding-car-1885.xhtml?oid=5971" },
    { label: "mbpassion: Daimlers „Standuhr“", url: "https://mbpassion.de/2021/10/daimlers-standuhr-war-in-den-1880er-jahren-taktgeber-einer-zeitenwende/" },
    { label: "Motorrad & Reisen: Daimler Reitwagen data sheet", url: "https://www.motorradundreisen.de/motorraddatenbank/daimler/reitwagen-29463.html" },
    { label: "Jalopnik: Daimler granted the Grandfather Clock patent", url: "https://jalopnik.com/this-day-in-history-gottlieb-daimler-granted-patent-fo-1846611800" },
  ],
};
