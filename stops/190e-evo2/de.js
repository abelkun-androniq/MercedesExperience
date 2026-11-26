// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Warum mehr Haftung auf der Geraden Tempo kostet",
  name: "Mercedes-Benz 190 E 2.5-16 Evolution II",
  summary: "Das DTM-Homologationsmodell, dessen im Windkanal geformte Flügel und Spoiler ihm weniger Luftwiderstand gaben als dem schlichten 2.3-16.",
  question: "Warum sollte ein Rennfahrer mehr Luftwiderstand in Kauf nehmen?",
  eyebrow: "Mercedes-Benz 190 E Evolution II, 1992",
  lede: "Klaus Ludwigs DTM-Wagen trägt einen Heckflügel mit verstellbarer oberer Klappe, eine vorschiebbare Frontlippe und ausgestellte Radläufe. Drei Nahaufnahmen aus vorab berechneten Windkanälen zeigen, was jedes Teil mit der Luft um sich herum macht.",
  photo: {
    alt: "Klaus Ludwigs Mercedes-Benz 190 E 2.5-16 Evolution II DTM-Wagen von 1992, Nummer 3, im Mercedes-Benz Museum, von links gesehen",
  },
  components: [
    {
      label: "Heckflügel",
      prompt: "Beobachten Sie den orangefarbenen Pfeil im gestrichelten Kasten über der Hinterkante des Flügels. Stellen Sie die Klappe auf: In welche Richtung dreht die Luft, die den Flügel verlässt?",
      answer: "Nach oben. Mit aufgestellter Klappe kippt die mittlere Richtung der Luft im Kasten um etwa 13° weiter nach oben (auf einem gröberen Gitter um etwa 8°). Die Luft nach oben zu lenken braucht einen Schub, und der Flügel spürt den Gegenschub, nach unten. Auf beiden Gittern des Gesamtfahrzeugmodells brachte die aufgestellte Klappe mehr Last auf die Hinterachse und mehr Luftwiderstand. Wie viel, hängt vom Gitter ab: bei 200 km/h etwa 25 bis 43 kg mehr auf der Hinterachse, für 4 bis 14 kW mehr Motorleistung, die in den Luftwiderstand geht.",
      more: "Details zum Windkanal",
      params: {
        label: "Flügelklappe · ein Schnitt aus dem Gesamtfahrzeug-Kanal",
        cases: [
          {
            label: "Grundstellung",
            say: "Klappe unten: Merken Sie sich den orangefarbenen Pfeil, die mittlere Richtung der Luft, die die Hinterkante im gestrichelten Kasten verlässt.",
          },
          {
            label: "Klappe aufgestellt",
            say: "Klappe aufgestellt: Im selben Kasten kippt die Luft nach oben, etwa 13° mehr als mit unterer Klappe, und die Bahnen hinter dem Flügel biegen mit nach oben.",
          },
        ],
      },
      talk: [
        "Der Heckflügel des Rennwagens trägt eine obere Klappe, die die Teams für Strecken mit schnellen Kurven aufstellen konnten. Mercedes-Benz nennt für das Homologationsfahrzeug eine einfahrbare obere Klappe und einen Frontspoiler mit zwei Stellungen; die Klappe hier hat eine veranschaulichende Größe und einen veranschaulichenden Winkel, nicht die Einstellung von 1992.",
        "Das Bild ist ein Schnitt 238 mm neben der Mittellinie des Fahrzeugs, aus einem 3-D-Windkanal des ganzen Autos herausgeschnitten. Die Farbe zeigt, wie schnell die Luft nach oben (rot) oder unten (blau) strömt, als Anteil der Fahrgeschwindigkeit; grau ist fest: der Kofferraumdeckel, der Flügel und, wenn aufgestellt, die Klappe.",
        "Der orangefarbene Pfeil ist die mittlere Richtung der Luft im gestrichelten Kasten, über 48 der 28-mm-Zellen des Modells. Das Aufstellen der Klappe kippt sie um etwa 13° nach oben; auf einem gröberen 40-mm-Gitter, mit 12 Zellen im Kasten, um etwa 8°. Beide Gitter stimmen darin überein, dass sie nach oben kippt. Die Winkel davor und danach hängen davon ab, wo der Kasten sitzt, also wird nur die Änderung angegeben.",
        "Im Gesamtfahrzeugmodell bringt die aufgestellte Klappe bei 200 km/h etwa 34 kg mehr Last auf die Hinterachse (25 bis 43 kg auf seinen beiden Gittern) und etwa 9 kW Widerstandsleistung (4 bis 14 kW); die Vorderachse ändert sich kaum. Mehr Last hinten heißt Haftung und Stabilität in schnellen Kurven; der Widerstand ist Tempo, das auf den Geraden verloren geht.",
        "Das Modell ist ein Spiele-Mesh des Evo II, gefüllt mit 28-mm-Blöcken: das halbe Auto mit einem Spiegel an der Mittellinie, eine bewegte Straße, stillstehende Räder und eine Reynolds-Zahl etwa 300-mal kleiner als die des echten Wagens. Lesen Sie die Änderung zwischen den beiden Einstellungen, nicht die Werte.",
      ],
    },
    {
      label: "Frontsplitter",
      prompt: "Die Lippe unter der Stoßstange schiebt sich nach vorn. Folgen Sie den beiden Luftbahnen: Eine steigt über die Nase, eine läuft unter dem Auto durch. Schieben Sie die Lippe vor: Was liegt jetzt über ihr, und was darunter?",
      answer: "Über ihr die langsame Luft, die sich vor der Stoßstange staut (blau); darunter Luft, die schon schnell unter dem Auto läuft (gelb). Vorgeschoben greift die Lippe unter dieses langsame Polster und teilt die Luft weiter vorn. Langsame Luft drückt stärker als schnelle, so belastet ein Splitter die Nase; dieses Modell zeigt das Muster der Luft, nicht die Größe dieser Kraft.",
      more: "Details zum Windkanal",
      params: {
        label: "Frontlippe · ein Schnitt durch die Nase",
        cases: [
          {
            label: "Lippe eingefahren",
            say: "Lippe eingefahren: Ihre Vorderkante schließt bündig mit der Stoßstange ab (orangefarbene Marke). Die Luft staut sich langsam vor der Stoßstange (blau); unter der Lippe beschleunigt sie und läuft mit der Straße unter dem Auto durch.",
          },
          {
            label: "Lippe vorgeschoben",
            say: "Lippe vorgeschoben: Die Lippe reicht 4 cm über die Marke hinaus, unter die vor der Stoßstange gestaute langsame Luft, während die Luft darunter schon schnell ist.",
          },
        ],
      },
      talk: [
        "Mercedes-Benz beschreibt für den Evolution II einen Frontspoiler mit zwei Stellungen. Die 4 cm Weg und 25 mm Dicke der Lippe hier sind veranschaulichend.",
        "Das Bild ist ein Schnitt durch die Nase in der Mittellinie des Fahrzeugs, vorab in zwei Dimensionen berechnet, als wäre die Nase unendlich breit. Die Farbe ist die Geschwindigkeit der Luft im Verhältnis zur Fahrgeschwindigkeit; grau sind Karosserie und Lippe. Die Straße bewegt sich mit der Geschwindigkeit des Autos und nimmt die Luft unter dem Auto mit.",
        "Eine Last wird nicht angegeben. Die Druckmesspunkte des Modells liegen vor der eingefahrenen Lippe, können die Kraft auf sie in den beiden Stellungen also nicht vergleichen, und das Druckniveau in diesem kurzen 2-D-Kanal driftet. Sie zu messen bräuchte einen längeren Abschnitt des Autos und andere Kanalränder.",
        "Ein 2-D-Schnitt hat keine Luft, die seitlich um die Stoßstange entweicht, und seine Reynolds-Zahl ist etwa ein Tausendstel der des echten Wagens.",
      ],
    },
    {
      label: "Vorderer Radlauf",
      prompt: "Von oben gesehen, in Nabenhöhe: die Ecke der Stoßstange, der Vorderreifen in seinem ausgestellten Radlauf, die Tür dahinter. Tippen Sie auf „Der Luft folgen“: Die blaue Linie ist eine Bahn der mittleren Strömung, der durchschnittliche Weg der Luft, von vor dem Auto.",
      answer: "Sie beginnt 78 cm neben der Mittellinie des Autos, in Linie mit dem Reifen, und die vordere Ecke des Autos lenkt sie nach außen. Sie kehrt nie zurück: An der gestrichelten Linie, 60 cm hinter der Achse, verläuft die Bahn etwa 37 cm weiter außen als am Anfang. Sie führt seitlich an der Tür vorbei. Entlang der Flanke hinter dem Radlauf strömt die Luft langsamer (grün und blau) als im schnellen Strom draußen (rot).",
      more: "Details zum Windkanal",
      params: {
        label: "Vordere Ecke · von oben in Nabenhöhe gesehen",
        cases: [
          {
            label: "Ausgestellter Radlauf",
            say: "Diese Bahn der mittleren Strömung beginnt in Linie mit dem Reifen, kurz vor der Ecke der Stoßstange. Die vordere Ecke des Autos lenkt sie etwa 37 cm nach außen, und sie hält diese Linie an der Tür vorbei.",
          },
        ],
      },
      talk: [
        "Die Radläufe des Evolution II wurden verbreitert, damit breitere Räder und Reifen unter die Karosserie passten, und mit dem übrigen Karosseriekit im Windkanal geformt.",
        "Das Bild ist ein waagrechter Schnitt in Nabenhöhe durch einen 3-D-Windkanal der vorderen Ecke, vorab aus demselben Spiele-Mesh berechnet wie der Heckflügel. Die Farbe ist die Geschwindigkeit der Luft im Verhältnis zur Fahrgeschwindigkeit; grau ist fest, Karosserie und Reifen im Schnitt. Die blaue Linie folgt der zeitlich gemittelten Strömung in diesem waagrechten Schnitt; ein einzelner Luftstoß wandert mit der Turbulenz um sie herum.",
        "Der Reifen steht still in seinem ausgeschnittenen Radhaus, 48 mm über einer bewegten Straße; die Karosserie ist in 1 m Höhe flach abgeschnitten, und das halbe Auto ist an der Mittellinie gespiegelt. Berechnet wurde auf einem Gitter mit 24-mm-Zellen: Über fünf Durchströmungen bleibt die Verschiebung nach außen zwischen 36,7 und 37,7 cm. Ein feineres Gitter wurde nicht gerechnet, also ist der Wert gerundet.",
        "Einen zweiten Radlauf zum Vergleich gibt es hier nicht. Im Modell liegt der verbreiterte Radlauf weniger als einen Zentimeter von der Außenflanke des Reifens entfernt. Ein schmalerer Radlauf würde den Reifen nicht mehr abdecken, die Lektion ist also, wohin die Luft geht. Wie viel der Radlauf allein zur Ablenkung der Luft beiträgt, getrennt von Stoßstangenecke und Reifen, bleibt offen.",
      ],
    },
    {
      label: "Rennmotor",
      prompt: "Wie lange hat ein Zylinder bei 9000 U/min für seinen Ansaugtakt? Wechseln Sie zwischen den beiden Drehzahlen und beobachten Sie die beiden blauen Einlassventile.",
      answer: "3,3 Millisekunden: eine halbe Kurbelumdrehung. Bei 4500 U/min hat er 6,7 ms. Doppelte Drehzahl halbiert die Zeit zum Füllen, deshalb atmet jeder Zylinder durch zwei Einlassventile.",
      params: {
        label: "2,5-Liter-Vierzylinder, 16 Ventile · Zündfolge 1-3-4-2",
      },
      talk: [
        "Der Rennmotor: vier Zylinder mit 97,8 mm Bohrung und 82,8 mm Hub, 2,5 Liter, mit zwei obenliegenden Nockenwellen und vier Ventilen je Zylinder.",
        "Die frühe DTM-Version leistete 245 kW bei 8500 U/min und drehte bis 9500 U/min. Für den Meisterschaftswagen von 1992 nennt Mercedes-Benz bis zu 274 kW (373 PS).",
        "Der Straßen-Evolution II hatte 97,3 mm Bohrung und 173 kW (235 PS).",
        "Der kurze Hub hält die Kolbengeschwindigkeit im Zaum: Bei 9000 U/min bewegt sich jeder Kolben im Mittel immer noch mit etwa 25 m/s in der Bohrung auf und ab.",
        "Die gezeigten Zeiten gelten für 180° Kurbelwinkel, einen Ansaugtakt. Die Einlassventile öffnen etwas davor und schließen etwas danach, wie die Steuerzeiten es vorgeben.",
      ],
    },
  ],
  note: "Das Karosseriekit des Straßen-Evolution II (Frontspoiler, breite Radläufe, Schwellerverkleidungen und verstellbarer Heckflügel) wurde im Windkanal als ein System geformt: ein Luftwiderstandsbeiwert von etwa 0,29 gegen 0,32 beim 2.3-16, viel weniger Auftrieb bei Tempo und etwa 250 km/h mit 235 PS. Der Rennwagen im Museum war auf Abtrieb abgestimmt.",
  unverified: [
    "Leistung und Abstimmung des Rennwagens",
    "Umriss der Karosserie und die Nase des Splitter-Schnitts: vom Foto der Station (eine Seitenansicht) über dessen angepasste Kamera abgezeichnet, etwa ±10 cm",
    "Nahaufnahme Heckflügel: ein Schnitt aus einem 3-D-Windkanal des ganzen Autos (Spiele-Mesh mit 28-mm-Blöcken gefüllt, halbes Auto gespiegelt, flacher Unterboden, stillstehende Räder, Reynolds-Zahl etwa 3 × 10⁴ gegen 10⁷); Klappengröße und -winkel veranschaulichend, nicht die Einstellung von 1992; die Richtung der Änderung wiederholt sich auf einem 40-mm-Gitter, ihre Größe nicht",
    "Nahaufnahme Frontsplitter: ein 2-D-Schnitt durch die Nase (Lattice-Boltzmann, Reynolds-Zahl 10⁴ auf 1 m gegen etwa 10⁷ für das Auto), bewegte Straße; Lippenweg (40 mm) und Dicke (25 mm) veranschaulichend; zeigt nur das Strömungsmuster, keine Last auf der Lippe",
    "Nahaufnahme vorderer Radlauf: ein örtlicher 3-D-Kanal der vorderen Ecke aus dem Spiele-Mesh (Karosserie in 1 m Höhe flach abgeschnitten, Radhaus um den Reifen ausgeschnitten, Reifen still 48 mm über der bewegten Straße, halbes Auto gespiegelt), Reynolds-Zahl 10⁴ auf den Reifendurchmesser",
    "Rennmotor: Pleuellänge, Zylinderabstand, Blockneigung und Lage im Fahrzeug; mit vergaserartigem Ansaugtrakt gezeichnet",
    "Raum: Mythos 7",
  ],
};
