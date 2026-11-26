// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Lautlose Hydraulik",
  name: "Mercedes-Benz 600 Pullman",
  summary: "Die Staatslimousine, deren Fenster, Sitze, Schiebedach, Kofferraumdeckel und Türschließer alle an einer zentralen Hydraulik hingen.",
  eyebrow: "Mercedes-Benz 600 Pullman, 1965",
  lede: "Im 600 gibt es keine elektrischen Fensterheber. Eine Pumpe am Motor hält Öl unter hohem Druck in einem Speicher, und jeder Schalter öffnet einfach ein Ventil. Drücken Sie einen und sehen Sie zu, wie das Öl einen Kolben schiebt und die Pumpe den Druck danach wieder auffüllt.",
  photo: {
    alt: "Schwarze gepanzerte Staatslimousine Mercedes-Benz 600 Pullman von 1965 im Mercedes-Benz Museum, von vorn rechts gesehen",
  },
  components: [
    {
      label: "Komforthydraulik",
      params: {
        label: "Eine Pumpe, ein Speicher, viele Zylinder",
        consumers: [{ label: "Seitenfenster hinten" }, { label: "Vordersitz" }, { label: "Schiebedach" }, { label: "Kofferraumdeckel" }, { label: "Türschließer" }],
      },
      real: {
        alt: "Eine halbierte Citroën-Federkugel neben einem Zollstock: eine dicke Gummimembran trennt den Gasraum oben vom Ölraum unten",
        caption: "Eine aufgeschnittene Citroën-Federkugel. Die Gummimembran trennt das Gas (oben) vom Öl (unten): Das zusammengedrückte Gas schiebt das Öl hinaus, während die Pumpe ruht. Citroën nutzt das Gaspolster als Feder; der 600 nutzt den gespeicherten Druck, um Fenster und Sitze zu bewegen.",
      },
      talk: [
        "Eine motorgetriebene Pumpe lädt einen gasgefüllten Speicher auf etwa 150 bar. Von dort laufen Leitungen zu kleinen Hydraulikzylindern an Fenstern, Sitzen, Schiebedach und Kofferraumdeckel und zu den Schließern, die die Türen zuziehen.",
        "Jeder Schalter öffnet ein Ventil: Öl aus dem Speicher schiebt den Kolben, und das Fenster fährt hoch, lautlos, ohne Elektromotor in der Tür. Dank des Gaspolsters muss die Pumpe nicht laufen, während Sie drücken.",
        "Fließt Öl ab, dehnt sich das Gas aus, und der Druck sinkt. Unter einem eingestellten Wert schaltet sich die Pumpe wieder zu und füllt den Speicher auf.",
        "Bei 150 bar drückt ein Kolben von zwei Zentimetern Durchmesser mit mehreren Kilonewton: weit mehr, als ein Fenster braucht, also bewegt es sich gleichmäßig mit einer Geschwindigkeit, die das Ventil vorgibt.",
      ],
    },
  ],
  note: "Das Fahrzeug im Museum ist eine gepanzerte Pullman-Staatslimousine. Zylindergrößen und Leitungsführung hier skizzieren das Prinzip, nicht die Zeichnungen des 600.",
  unverified: [
    "Speichergröße und Vorfülldruck, Pumpenförderung, Ventildurchfluss und Zuschaltdruck",
    "Zylindergrößen, Hübe und Lage im Fahrzeug",
    "Hydraulische Türschließer (in den Recherche-Notizen genannt)",
    "Umriss der Karosserie (aus den Maßen des Datenblatts skizziert, noch nicht vom Foto abgezeichnet)",
    "Raum: Mythos 5",
  ],
};
