// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Eine Ladebühne voller Autos heben",
  name: "Mercedes-Benz 1624 Autotransporter",
  summary: "Ein Autotransporter, dessen Ladebühnen eine einzige Hydraulikpumpe über Seile und Flaschenzüge hebt und neigt.",
  eyebrow: "Mercedes-Benz 1624 Autotransporter, 1980",
  lede: "Vier Neuwagen, sechs Tonnen, auf zwei Etagen gestapelt. Die Ladebühnen lassen sich heben, senken und neigen: Eine zentrale Pumpe erzeugt die Kraft, und Stahlseile tragen sie über Rollen zu jedem Ende einer Bühne. Probieren Sie die Stellungen unten aus.",
  photo: {
    alt: "Blauer Mercedes-Benz 1624 Autotransporter von 1980, beladen mit vier Mercedes-Fahrzeugen auf zwei Etagen, im Mercedes-Benz Museum, von vorn links gesehen",
  },
  components: [
    {
      label: "Bühnenhub",
      params: {
        label: "Obere hintere Ladebühne · Seile und Flaschenzüge",
        presets: [{ label: "Fahrhöhe" }, { label: "Hinterende unten: eine Rampe" }, { label: "Vorderende unten: Autos verschachteln" }, { label: "Beide Enden unten" }],
      },
      talk: [
        "Die Ladung im Museum: ein 230 E und ein 280 CE der Baureihe 123, ein 380 SEL und ein 500 SEC der Baureihe 126, etwa sechs Tonnen Autos. Mit Anhänger trug ein solcher Zug bis zu zehn.",
        "Die Ladebühnen haben, wie das Museum es nennt, einen Hybridantrieb. Eine zentrale Hydraulik erzeugt die Kraft, und Stahlseile tragen sie über Umlenkrollen und Flaschenzüge zu jeder Ecke.",
        "Warum ein Flaschenzug? Ein kurzer Zylinder passt neben den Pfosten. Schert man das Seil viermal zwischen seinen beiden Blöcken ein, werden aus 30 cm Kolbenhub 1,2 m Bühnenweg, bei vierfacher Kraft am Kolben.",
        "Heben Sie beide Enden, um die Bühne anzuheben, oder ein Ende, um sie zu neigen: Eine geneigte Bühne wird zur Auffahrrampe oder lässt die Motorhaube eines Autos unter das nächste rutschen. Eine Pumpe speist alle Zylinder, also halbiert sich die Geschwindigkeit, wenn sich beide Enden zugleich bewegen.",
        "Der Lkw selbst: ein 1624, für 16 Tonnen, mit einem Diesel von 12,8 Litern und 240 PS (177 kW).",
      ],
    },
  ],
  note: "Leer wiegt der Transporter etwa 7 Tonnen. Das Museum hob ihn in einem 20-Tonnen-Kranbehälter an seinen Platz, fünf Stockwerke über Straßenniveau.",
  unverified: [
    "Anordnung und Maße des Hubwerks: Zahl der Seilstränge, Bohrung und Hub der Zylinder, Pumpenförderung, Wirkungsgrad der Rollen, Bühnenhöhen und Hubwege",
    "Welche Ladebühne gezeigt wird, ihre Masse und die Lage des Autos darauf",
    "Radstand (5100 mm), Spurweite und Lampenpositionen für die Fotoanpassung",
    "Umriss der Karosserie (vom Foto abgezeichnet)",
    "Baujahr (1980, aus der Bildunterschrift)",
    "Raum: Collection 2",
  ],
};
