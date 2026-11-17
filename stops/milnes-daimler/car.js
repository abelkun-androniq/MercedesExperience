// Milnes-Daimler double-decker bus, 1907. Frame: mm, x forward, y left, z up; origin = front axle centre on the ground.
// Wheelbase, tracks and wheel radii are assumed for the photo fit; gearbox teeth, final ratio, engine speeds and the
// gate are illustrative.
export default {
  slug: "milnes-daimler",
  title: "Double-declutching through London",
  name: "Milnes-Daimler double-decker bus",
  year: 1907,
  summary: "A German Daimler chassis with a London double-deck body, from the first years of the motor bus.",
  eyebrow: "Milnes-Daimler double-decker bus, 1907",
  lede: "The chassis came from Daimler in Germany; the body was built in England. Its driver changed gear with no synchromesh, all day in city traffic. Try it: a gear only slides in when both wheels' teeth are already moving at the same speed.",
  orbit: { min: 0.8, max: 22 },
  sun: [3, 3, 8],
  body: {
    ghost: [
      { pts: [[560, 1050], [560, 1600], [-500, 1600], [-500, 1050]], y: [-430, 430] },                       // bonnet
      { pts: [[-1300, 1080], [-1300, 2600], [-4700, 2600], [-4700, 1080]], y: [-1000, 1000] },               // lower saloon
      { pts: [[650, 2600], [650, 3300], [-4700, 3300], [-4700, 2600]], y: [-1050, 1050] },                   // upper deck
      { torus: { R: 400, r: 60, pos: [0, 760, 450], rot: [90, 0, 0] }, mirror: true },                       // front wheels
      { torus: { R: 440, r: 70, pos: [-4000, 800, 500], rot: [90, 0, 0] }, mirror: true },                   // rear wheels
    ],
  },
  photo: {
    src: "photo.jpg", w: 1200, h: 803,
    alt: "Red 1907 Milnes-Daimler double-decker bus of the London Motor Omnibus Company, with open top deck and advertising boards, in the Mercedes-Benz Museum, seen from the front left",
    cam: { c: [3707.3, 3385.3, 2147.5], yaw: -2.6128, pitch: -0.0795, roll: 0.0516, f: 1217.8 }, // tools/photo-fits/milnes-daimler.json
    credit: { author: "Valder137", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Milnes-Daimler_Doppeldeckerbus_1907_LSideFront_MBMuse_9June2013_(14797141199).jpg" },
  },
  components: [
    {
      id: "gears", label: "Gearbox", subsystem: "gearbox",
      view: { pos: [-0.3, -1.5, 1.4], target: [-1.3, 0, 0.75] },
      ghost: { fill: 0.02, edge: 0.25 },
      params: {
        label: "Four-speed sliding-gear box",
        box: {
          gears: [                                           // teeth illustrative; every pair adds up to 60
            { name: "R", drive: 15, driven: 45, idler: true },
            { name: "1", drive: 14, driven: 46 }, { name: "2", drive: 19, driven: 41 },
            { name: "3", drive: 25, driven: 35 }, { name: "4", drive: 30, driven: 30 },
          ],
          final: 8.5, wheelR: 0.5,                            // illustrative: 4th at full speed ≈ 20 km/h
        },
        module: 5, pos: [-1100, 750], pitch: 130, width: 34,
        rpm: { idle: 250, max: 900 },                         // illustrative
        gate: [["R", 0, -1], ["1", 0, 1], ["2", 1, -1], ["3", 1, 1], ["4", 2, -1]],   // illustrative
        drive: { accel: 1.2, roll: 0.15, drag: 0.0022 },
      },
      talk: [
        "Daimler built the chassis in Germany; Milnes-Daimler sold them in Britain, and British coachbuilders added the double-deck body. In the first years of the motor bus, many of London's buses were Milnes-Daimlers like this one of the London Motor Omnibus Company's Vanguard fleet.",
        "Like the cars of its day, it has a four-speed sliding-gear box with no synchromesh, behind a cone clutch. The lever slides a pair of gears into mesh, and they only go in when their teeth are already moving at about the same speed.",
        "To shift up, drivers pressed the clutch and waited for the gearbox to slow. To shift down, they double-declutched: neutral, clutch up, a blip of throttle, clutch down, then into gear. Bus drivers did this all day in traffic.",
        "\"SPEED 12 M.P.H.\" is painted on the side: about 19 km/h, the legal limit in Britain for a vehicle this heavy. The demo shifts up through all four gears; then try it yourself.",
      ],
    },
  ],
  note: "Sources date the museum's bus to 1907; similar Milnes-Daimler buses elsewhere are dated 1904. Daimler's commercial chassis of 1907 all had a cone clutch and a four-speed gearbox.",
  unverified: [
    "Gear teeth, final ratio, engine speeds, gate layout and the drive figures",
    "Wheelbase (4,000 mm), tracks and wheel radii used for the photo fit",
    "Ghost-body outline (traced from the photo)",
    "Year: 1907 (the research notes say 1904)",
    "Room: Collection 1 (the research notes put it in Legend 2)",
  ],
  sources: [
    { label: "Mercedes-Benz Classic archive: Daimler business vehicles, trucks and buses, 1907–1914", url: "https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/Daimler-Marienfelde-business-vehicles-trucks-and-buses-1907--1914.xhtml?oid=193663896" },
    { label: "Grace's Guide: Milnes-Daimler", url: "https://gracesguide.co.uk/Milnes-Daimler" },
    { label: "Louwman Museum: Milnes-Daimler double-decker omnibus", url: "https://www.louwmanmuseum.nl/en/car/milnes-daimler-double-decker-omnibus/" },
  ],
};
