// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Unter dem Blech des 190",
  name: "Mercedes-Benz 190 E (W201) „Baby-Benz“",
  summary: "Wie reagiert die Raumlenker-Hinterachse auf eine Bodenwelle und ein Schlagloch? Am Vierzylinder M102 sehen Sie anschließend, in welcher Reihenfolge die Zylinder zünden.",
  eyebrow: "Mercedes-Benz 190 E (W201), 1984",
  lede: "Zwei Mechanismen desselben Autos, jeder in Aktion: die Raumlenker-Hinterachse über einer Bodenwelle und einem Schlagloch, und der Vierzylinder M102 im Viertakt. Scrollen Sie weiter: Das Museumsfoto zeigt dann die Achse an ihrem Platz am echten Fahrzeug.",
  photo: {
    alt: "Weißer Mercedes-Benz 190 E von 1984 im Mercedes-Benz Museum, von vorn links gesehen",
  },
  components: [
    {
      label: "Raumlenker-Hinterachse",
      params: {
        label: "Linkes Hinterrad · 25 km/h, 5× langsamer gezeigt",
        links: [{ name: "Sturzstrebe" }, { name: "Zugstrebe" }, { name: "Schubstrebe" }, { name: "Federlenker" }, { name: "Spurstange" }],
        legendTitle: "Die fünf Lenker",
      },
      real: {
        alt: "Eine komplette Mehrlenker-Hinterachse mit Bremsen auf einem Ausstellungsständer: dünne schwarze Lenker reichen vom Hilfsrahmen zu jedem Radträger",
        caption: "Eine moderne Fünflenker-Hinterachse außerhalb ihres Fahrzeugs (Toyota Supra, 2019): Einzelne dünne Lenker halten jeden Radträger. Der 190 von 1982 war das erste Serienauto mit einer solchen Achse.",
      },
      talk: [
        "Fünf Stäbe, jeder vor allem längs seiner eigenen Achse belastet, führen den Radträger. Der 190 war 1982 das erste Serienauto mit dieser Achse.",
        "Achten Sie auf die orangefarbene Kurve. Über der Bodenwelle schnellt die Radlast hoch; im Schlagloch fällt sie gegen null. Die Haftung kommt aus dieser Last, also ist eine flache Linie das Ziel.",
        "Die Karosserie bewegt sich kaum, während das Rad die Arbeit tut. Das ist die Aufteilung in gefederte und ungefederte Masse.",
      ],
    },
    {
      label: "Motor M102",
      params: {
        label: "Viertakt · Zündfolge 1-3-4-2",
      },
      talk: [
        "Der 2,0-Liter-M102 des 190 E: vier Zylinder in Reihe, eine obenliegende Nockenwelle, Zylinder 1 vorn.",
        "Die Zündfolge 1-3-4-2 ergibt alle 180° Kurbelwinkel einen Arbeitstakt, was das Drehmoment an der Kurbelwelle gleichmäßig hält. Achten Sie darauf, wie die orangefarbenen Blitze am Block entlangwandern.",
        "Der Block ist nach rechts geneigt, damit er unter die niedrige Haubenlinie des 190 passt.",
      ],
    },
  ],
  note: "Die Geometrie ist veranschaulichend: Anlenkpunkte der Lenker, Motormaße und Fahrwerksraten sind plausible Werte, keine Werksangaben.",
  unverified: [
    "Alle Anlenkpunkte der Aufhängung sowie Feder-, Dämpfer- und Reifenraten",
    "Pleuellänge des M102 und 15° Blockneigung",
    "Umriss der Karosserie",
  ],
};
