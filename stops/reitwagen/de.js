// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Ein Riemen, zwei Scheiben und ein Zahnkranz",
  name: "Daimler Reitwagen",
  summary: "Das erste Fahrzeug mit Benzinmotor: ein halbes PS, ein Lederriemen und zwei Gänge, im Stand von Hand gewechselt.",
  eyebrow: "Daimler Reitwagen, 1885",
  lede: "Daimler und Maybach setzten ihren neuen schnelllaufenden Motor in einen Holzrahmen, um zu zeigen, dass er ein Fahrzeug bewegen kann. Wählen Sie einen Gang und eine Steigung: Ein halbes PS kommt in der Ebene weit, bergauf nicht.",
  photo: {
    alt: "Hölzerner Daimler Reitwagen von 1885 mit Ledersattel im Mercedes-Benz Museum, von rechts gesehen",
  },
  components: [
    {
      label: "Riemenantrieb",
      params: {
        label: "Zweigang-Riemen, Ritzel und Zahnkranz",
        drive: {
          gears: [{ name: "Langsam" }, { name: "Schnell" }],
        },
      },
      talk: [
        "Ein flacher Lederriemen läuft von einer Scheibe am Motor zu einer Vorgelegewelle hinten. Ein kleines Ritzel auf dieser Welle treibt einen innenverzahnten Zahnkranz am Hinterrad.",
        "Die Scheiben sind gestuft. Liegt der Riemen auf der kleinen Motorscheibe und der großen Vorgelegescheibe, dreht das Rad langsam, schiebt aber kräftig: Das ist der langsame Gang. Eine Kupplung gibt es nicht: Der Riemen wird im Stand von Hand umgelegt.",
        "Der Motor ist auf etwa 600 U/min geregelt, also hat jeder Gang nur eine Geschwindigkeit: im schnellen Gang etwa 12 km/h. Ein halbes PS bewegt den Fahrer in der Ebene, doch eine Steigung von wenigen Prozent bringt ihn im schnellen Gang zum Stehen. Probieren Sie es mit dem Steigungsregler.",
        "Die Stufenscheiben sind so bemessen, dass derselbe Riemen auf beide Stufen passt: Was eine Stufe am Motor an Durchmesser verliert, gewinnt die andere an der Vorgelegewelle.",
      ],
    },
    {
      label: "Motor",
      params: {
        label: "Einzylinder unter dem Sattel",
      },
      talk: [
        "Der Motor ist eine kleinere Schwester der Standuhr: ein aufrechter Zylinder mit 264 cm³ (58 × 100 mm), 0,5 PS bei 600 U/min, die Schwungräder in einem runden Kurbelgehäuse eingeschlossen.",
        "Gezündet wird mit einem Glührohr, das ein Brenner glühend hält, direkt unter dem Fahrer. Bei den ersten Fahrten soll der Sattel Feuer gefangen haben.",
        "Das Einlassventil öffnet der Unterdruck im Zylinder, wenn sich der Kolben nach unten bewegt; nur das Auslassventil wird betätigt, von einer Nut im Schwungrad.",
        "Der Kraftstoff kam aus einem Oberflächenvergaser hinter dem Sattel: Luft perlte durch Benzin und trat als Gemisch aus. Einen eigentlichen Tank gab es nicht.",
      ],
    },
  ],
  note: "Daimler und Maybach ließen den Reitwagen am 29. August 1885 patentieren (DRP 36423); die erste Fahrt, von Cannstatt nach Untertürkheim, folgte im November 1885. Das Original verbrannte 1903 beim Brand der Cannstatter Fabrik: Das Museum zeigt einen Nachbau. Wer zuerst fuhr, Paul oder Adolf Daimler, ist in den Quellen umstritten.",
  unverified: [
    "Scheibendurchmesser, Größen von Ritzel und Zahnkranz und die Geschwindigkeit im langsamen Gang (etwa 6 km/h)",
    "Gesamtmasse (mit 75 kg Fahrer), Rollwiderstand und Wirkungsgrad des Antriebs",
    "Lage des Motors, Pleuel und Größe des Kurbelgehäuses",
    "Umriss der Karosserie (vom Foto abgezeichnet)",
    "Raum: Mythos 1 (ein Nachbau des Museums wurde auch an die KTM Motohall verliehen)",
  ],
};
