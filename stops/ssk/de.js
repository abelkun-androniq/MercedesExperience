// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Der zuschaltbare Kompressor des SSK",
  name: "Mercedes-Benz SSK",
  summary: "Ein Reihensechszylinder mit 7,1 Litern und einem Roots-Gebläse, das sich erst zuschaltet, wenn der Fahrer das Pedal ganz durchtritt.",
  eyebrow: "Mercedes-Benz 27/170/225 PS Typ SSK, 1928",
  lede: "Der Super Sport mit kurzem Fahrgestell, in Aktion: das Gebläse, das sich erst bei voll durchgetretenem Pedal zuschaltet, und der große Sechszylinder, den es versorgt.",
  photo: {
    alt: "Weißer Mercedes-Benz SSK von 1928 im Mercedes-Benz Museum, von vorn links gesehen",
  },
  components: [
    {
      label: "Kompressor",
      params: {
        engineLabel: "Reihensechszylinder mit 7,1 Litern",
      },
      real: {
        alt: "Zeichnung von 1928 eines zerlegten Mercedes-Kompressors: links das Gehäuse, rechts die beiden aufrechten Rotoren mit der Kupplung darunter",
        caption: "Ein zerlegter Mercedes-Kompressor, gezeichnet für ein Handbuch von 1928. Das Gehäuse (links) passt über die beiden aufrechten Rotoren (rechts); darunter sitzt die Kupplung, die das Gebläse bei Vollgas zuschaltet.",
      },
      talk: [
        "SSK heißt Super Sport Kurz, der Super Sport mit kurzem Fahrgestell. Sein voller Name nennt die Leistung: 27 Steuer-PS, 170 PS ohne und 225 PS mit arbeitendem Gebläse.",
        "Das Gebläse läuft nicht ständig. Der Fahrer tritt das Pedal bis zum Boden und dann noch ein Stück weiter; eine Kupplung vorn an der Kurbelwelle schaltet das Gebläse zu. Geht er vom Gas, löst sie wieder. Es war für kurze Spurts gedacht.",
        "Das Gebläse drückt Luft durch den Vergaser, statt Gemisch durch sich selbst zu saugen, dieselbe Anordnung, die einige Jahre später der 540 K hatte. Achten Sie darauf, wie die Luft die Farbe wechselt, wenn die Kupplung greift.",
      ],
    },
    {
      label: "Sechszylindermotor",
      params: {
        label: "Viertakt · Zündfolge 1-5-3-6-2-4",
      },
      talk: [
        "Sechs Zylinder in Reihe, je 100 mm Bohrung und 150 mm Hub: 7,1 Liter, mit einer obenliegenden Nockenwelle.",
        "Die Zündfolge 1-5-3-6-2-4 ergibt alle 120° Kurbelwinkel einen Arbeitstakt, abwechselnd in der vorderen und hinteren Motorhälfte. Achten Sie auf die orangefarbenen Blitze.",
        "Er war der letzte Mercedes, der unter Ferdinand Porsche entstand, bevor dieser das Unternehmen verließ, und Rudolf Caracciola fuhr damit Rennen.",
      ],
    },
  ],
  note: "Die Geometrie ist veranschaulichend: Gebläseanordnung, Übersetzung, Ladedruck, Pleuellänge und Zylinderabstand sind plausible Werte, keine Werksangaben.",
  unverified: [
    "Gebläseanordnung, Übersetzung 2,6 und Ladedruck 0,45 bar",
    "Pleuellänge und Zylinderabstand",
    "Umriss der Karosserie (vom Foto abgezeichnet)",
    "Raum und Ebene",
  ],
};
