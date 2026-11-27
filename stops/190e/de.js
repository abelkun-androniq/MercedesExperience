// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Unter dem Blech des 190",
  name: "Mercedes-Benz 190 E (W201) „Baby-Benz“",
  summary: "Wie reagiert die Raumlenker-Hinterachse auf eine Bodenwelle und ein Schlagloch, und was machen eine Starr- und eine Pendelachse daraus? Am Vierzylinder M102 sehen Sie anschließend, in welcher Reihenfolge die Zylinder zünden.",
  eyebrow: "Mercedes-Benz 190 E (W201), 1984",
  lede: "Zwei Mechanismen desselben Autos, jeder in Aktion: die Raumlenker-Hinterachse über einer Bodenwelle und einem Schlagloch, dann neben den einfacheren Achsen, die sie ablöste, und der Vierzylinder M102 im Viertakt. Scrollen Sie weiter: Das Museumsfoto zeigt dann die Achse an ihrem Platz am echten Fahrzeug.",
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
      label: "Warum die Achse zählt",
      prompt: "Achten Sie auf die blauen Linien, die Ebene jedes Rads, gegenüber den grauen Senkrechten. Welche Achse hält ihre Reifen aufrecht und in ihrer Spur, über einer Bodenwelle und in einer Kurve?",
      answer: "Keine einfache Achse schafft beides. Die Starrachse bleibt in der Kurve aufrecht, kippt aber beide Räder, wenn eines über eine Bodenwelle fährt; die Pendelachse nimmt eine Bodenwelle mit einem Rad allein, kippt es dabei aber und zieht seinen Reifen seitlich, und in einer scharfen Kurve hebt sie die Karosserie an und lässt die Räder einknicken. Die Raumlenkerachse hält jedes Rad nahezu aufrecht und in seiner Spur und dreht das äußere Rad leicht nach innen: der Grund, warum der 190 eine bekam.",
      params: { label: "Die Hinterachse von hinten · 30 km/h auf der holprigen Straße, 4× langsamer gezeigt" },
      talk: [
        "Eine Radaufhängung hat zwei Aufgaben, die gegeneinander ziehen: die Karosserie ruhig halten und jeden Reifen flach auf die Straße drücken, möglichst wenig geneigt und in seiner Spur. Die Haftung kommt aus dieser Aufstandsfläche.",
        "Einfache Achsen scheitern an einer davon. Eine Starrachse verbindet die beiden Räder; eine Pendelachse, die Hinterachse von Mercedes von 1931 bis in die 1960er-Jahre, kippt jedes Rad mit seiner Halbwelle und zieht den Reifen seitlich, und in einer scharfen Kurve können die Räder einknicken.",
        "Die Raumlenkerachse gibt jedem Rad seine eigene, sorgfältig gewählte Bahn: fünf Stäbe, jeder dort angesetzt, wo die Ingenieure das Rad führen wollten. Der 190 von 1982 war das erste Serienauto damit.",
        "Den Rest bestimmen Federn und Dämpfer: weiche Federn für den Komfort, harte gegen die Seitenneigung; Dämpfer gerade stark genug, um das Nachschwingen zu stoppen.",
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
    "Achsvergleich: Aufbau der Pendel- und der Starrachse, ungefederte Massen, Schwerpunkt, Stabilisator, Vorspur unter Seitenkraft und die schmaler werdende Aufstandsfläche des geneigten Rads",
    "Pleuellänge des M102 und 15° Blockneigung",
    "Umriss der Karosserie",
  ],
};
