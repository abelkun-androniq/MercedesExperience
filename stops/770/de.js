// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Zwei Funken je Zylinder",
  name: "Mercedes-Benz 770 „Großer Mercedes“",
  summary: "Der Reihenachtzylinder mit 7,7 Litern des größten Mercedes-Benz seiner Zeit: zwei Zündkerzen in jedem Zylinder und ein Kompressor bei Vollgas.",
  eyebrow: "Mercedes-Benz 770, 1932",
  lede: "Gebaut für Staatsoberhäupter, musste der 770 laufen, was auch geschah. Jeder seiner acht Zylinder hat zwei Zündkerzen, gespeist von zwei getrennten Zündanlagen. Sehen Sie zu, wie beide funken, wenn ein Zylinder zündet; treten Sie dann voll aufs Gas, um den Kompressor zuzuschalten.",
  photo: {
    alt: "Grauer Mercedes-Benz 770 „Großer Mercedes“ Cabriolet F von Kaiser Wilhelm II. im Mercedes-Benz Museum, von vorn gesehen",
  },
  components: [
    {
      label: "Motor",
      prompt: "Lassen sich an der Kurbelwelle noch die einzelnen Arbeitstakte erkennen? Beobachten Sie die Drehmomentkurve, während jeder Zylinder aufleuchtet.",
      answer: "Gerade noch: Vier Arbeitstakte je Umdrehung überlappen sich, so fällt der Schub an der Kurbelwelle nie weit ab. Ein gleichmäßig zündender Sechszylinder mit drei je Umdrehung schwankt bei gleichem mittlerem Drehmoment viel stärker.",
      more: "Motortakte",
      params: {
        label: "Reihenachtzylinder mit 7,7 Litern · zwei Kerzen je Zylinder · Zündfolge 1-6-2-5-8-3-7-4",
      },
      talk: [
        "Der 770 war der größte Mercedes-Benz seiner Zeit, in kleiner Stückzahl gebaut für Staatsoberhäupter, Königshäuser und sehr Wohlhabende. Dieses Cabriolet F entstand für den ehemaligen Kaiser Wilhelm II., der damals im Exil in den Niederlanden lebte.",
        "Acht Zylinder in Reihe, 95 mm Bohrung und 135 mm Hub: 7,7 Liter. Beim Reihenachtzylinder zündet jede Vierteldrehung ein Zylinder, so ist der Antrieb ruhig und gleichmäßig.",
        "Bei 3000 U/min gibt ein gleichmäßig zündender Sechszylinder 150 Arbeitstakte pro Sekunde, ein Achtzylinder 200. Die Kurve zeigt das Drehmoment, das der Gasdruck auf die Kurbelwelle bringt, bei gleichem mittlerem Drehmoment für beide.",
        "Jeder Zylinder hat zwei Zündkerzen. Die eine Zündkerze erhält ihren Zündstrom vom Magnetzünder, die andere von einer batteriebetriebenen Zündspule. So entzündet sich das Gemisch an zwei Stellen und brennt in etwa der halben Zeit durch. Fällt eine Zündanlage aus, läuft der Motor mit der anderen weiter.",
      ],
    },
    {
      label: "Kompressor",
      params: {
        engineLabel: "Reihenachtzylinder mit 7,7 Litern",
      },
      real: {
        alt: "Zeichnung von 1928 eines zerlegten Mercedes-Kompressors: links das Gehäuse, rechts die beiden aufrechten Rotoren mit der Kupplung darunter",
        caption: "Ein zerlegter Mercedes-Kompressor, gezeichnet für ein Handbuch von 1928. Das Gehäuse (links) passt über die beiden aufrechten Rotoren (rechts); darunter sitzt die Kupplung, die das Gebläse bei Vollgas zuschaltet.",
      },
      talk: [
        "Wie beim SSK läuft der Roots-Kompressor des 770 nur, wenn er gebraucht wird. Tritt man das Gaspedal bis zum Boden, kuppelt eine Kupplung ihn an die Kurbelwelle; dann bläst er Luft unter Druck in den Vergaser.",
        "Mehr Luft je Takt heißt, mehr Kraftstoff kann verbrennen: 150 PS ohne Gebläse, 200 PS mit. Geht man vom Gas, löst die Kupplung wieder und schont Motor und Kraftstoff.",
      ],
    },
  ],
  note: "Mehrere 770 sind erhalten; der des Museums ist das Cabriolet F, das Wilhelm II. gehörte.",
  unverified: [
    "Lage des Motors im Fahrzeug und Pleuellänge",
    "Ventiltrieb als hängende Ventile mit Stoßstangen gezeichnet",
    "Drehmomentkurve: ein veranschaulichender Gasdruckverlauf, für jeden Zylinder gleich",
    "Übersetzung, Zuschaltung und Ladedruck des Kompressors (die 150 und 200 PS sind Angaben)",
    "Umriss der Karosserie (aus den Maßen des Datenblatts skizziert, noch nicht vom Foto abgezeichnet)",
    "Raum: Mythos 3",
  ],
};
