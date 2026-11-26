// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Unter dem Blech des 540 K",
  name: "Mercedes-Benz 540 K (W 29)",
  summary: "Einzelradaufhängung vorn mit Querlenkern, das Roots-Gebläse, das sich erst bei voll durchgetretenem Pedal zuschaltet, und die Stromlinienkarosserie.",
  eyebrow: "Mercedes-Benz 540 K (W 29), 1936–1940",
  question: "Wofür steht das K? Wann schaltet sich der Kompressor zu?",
  look: "Sehen Sie sich das linke Vorderrad an: Es hängt an seinem eigenen Paar Lenker. Die drei Schritte unten begleiten dieses Fahrzeug auf einer Fahrt.",
  takeaway: "Sehen Sie sich die aufrechte Windschutzscheibe und das gefaltete Verdeck an: Diesen Luftwiderstand sparte sich die Stromlinien-Limousine von 1938.",
  lede: "Drei Dinge am Kompressorwagen 540 K, jedes in Aktion: die Einzelradaufhängung vorn über einer Bodenwelle und einem Schlagloch, das Roots-Gebläse, das sich erst zuschaltet, wenn der Fahrer das Pedal durchtritt, und was eine Stromlinienkarosserie für die Höchstgeschwindigkeit tut. Scrollen Sie weiter: Das Museumsfoto zeigt dann die Aufhängung an ihrem Platz am echten Fahrzeug.",
  photo: {
    alt: "Schwarz-weißes Mercedes-Benz 540 K Cabriolet B von 1937 im Mercedes-Benz Museum, von vorn links gesehen",
  },
  components: [
    {
      label: "Über eine Bodenwelle",
      prompt: "Sehen Sie zu, wie das linke Vorderrad über die Bodenwelle steigt und sich die orangefarbene Radlastkurve ändert.",
      answer: "Jedes Vorderrad bewegt sich für sich, also kippt eine Bodenwelle unter dem einen nicht mehr das andere.",
      more: "Geometrie der Vorderachse",
      params: {
        label: "Linkes Vorderrad · 25 km/h, 5× langsamer gezeigt",
        links: [{ name: "Unterer Querlenker, vorderer Arm" }, { name: "Unterer Querlenker, hinterer Arm" }, { name: "Oberer Querlenker, vorderer Arm" }, { name: "Oberer Querlenker, hinterer Arm" }, { name: "Spurstange" }],
        legendTitle: "Bauteile",
        legend: [
          [
            null,
            "Unterer Querlenker (zwei Arme)",
          ],
          [
            null,
            "Oberer Querlenker (zwei Arme)",
          ],
          [
            null,
            "Spurstange",
          ],
          [
            null,
            "Schraubenfeder",
          ],
          [
            null,
            "Rahmen und Achsschenkel",
          ],
        ],
      },
      talk: [
        "Die meisten Autos der 1930er-Jahre hatten vorn noch eine starre Achse an Blattfedern. Mercedes gab dem 380 von 1933 parallele Querlenker und Schraubenfedern, und 500 K und 540 K behielten sie.",
        "Jedes Vorderrad bewegt sich jetzt für sich: Eine Bodenwelle unter einem Rad kippt das andere nicht mehr. Sehen Sie, wie die orangefarbene Kurve über der Bodenwelle ausschlägt und im Schlagloch abfällt.",
        "Mit fast parallelen Lenkern bleibt das Rad nahezu aufrecht, doch der Reifen rutscht beim Einfedern ein paar Millimeter seitwärts. Siehe die Anzeige der Spurweitenänderung.",
      ],
    },
    {
      label: "Auf der Geraden",
      prompt: "Drücken Sie „Vollgas“ und beobachten Sie die Kupplung: Wann schaltet sich das Gebläse zu?",
      answer: "Nur bei voll durchgetretenem Pedal: Die Kupplung schaltet das Gebläse zu, und die Leistung steigt von 115 auf 180 PS, für kurze Spurts. K steht für Kompressor.",
      more: "Im Inneren des Gebläses",
      params: {
        engineLabel: "Reihenachtzylinder mit 5,4 Litern",
      },
      real: {
        alt: "Zeichnung von 1928 eines zerlegten Mercedes-Kompressors: links das Gehäuse, rechts die beiden aufrechten Rotoren mit der Kupplung darunter",
        caption: "Ein zerlegter Mercedes-Kompressor, gezeichnet für ein Handbuch von 1928. Das Gehäuse (links) passt über die beiden aufrechten Rotoren (rechts); darunter sitzt die Kupplung, die das Gebläse bei Vollgas zuschaltet.",
      },
      talk: [
        "K steht für Kompressor. Der Reihenachtzylinder mit 5,4 Litern leistet ohne Gebläse 115 PS und mit arbeitendem Gebläse 180 PS.",
        "Das Gebläse läuft nicht ständig. Treten Sie das Pedal bis zum Boden durch, kuppelt eine Lamellenkupplung vorn an der Kurbelwelle es zu; im selben Moment schließt der normale Lufteinlass des Motors. Es war für kurze Spurts gedacht.",
        "Mercedes blies die Luft durch den Vergaser, statt Gemisch durch das Gebläse zu saugen. Ein Roots-Gebläse verdichtet die Luft nicht in seinem Innern: Die Flügel tragen Lufttaschen außen am Gehäuse entlang und drücken sie in den Auslass.",
      ],
    },
    {
      label: "Bei Tempo",
      prompt: "Das Museumsfoto zeigt das Cabriolet B. Wechseln Sie mit denselben 180 PS zwischen ihm und der Stromlinien-Limousine von 1938.",
      answer: "Derselbe Motor macht die Stromlinien-Limousine etwa 15 km/h schneller: Bei Autobahntempo zählt die Form der Karosserie so viel wie das Gebläse.",
      more: "Woher der Luftwiderstand kommt",
      params: {
        label: "Volle Leistung auf der Autobahn",
        shapes: [{ label: "Stromlinie (1938)" }, { label: "Karosserie Cabriolet B" }],
      },
      talk: [
        "1938 baute Mercedes einen 540 K mit geschlossener Stromlinienkarosserie, damit Dunlop auf den neuen Autobahnen Reifen bei Dauerhöchstgeschwindigkeit testen konnte.",
        "Mercedes-Benz Classic vermaß den restaurierten Wagen im Mai 2014 im Windkanal: ein Luftwiderstandsbeiwert von 0,36, bemerkenswert für seine Zeit.",
        "Mit denselben 180 PS erreicht er etwa 185 km/h, ein offenes Cabriolet etwa 170 km/h. Der Luftwiderstand wächst mit dem Quadrat der Geschwindigkeit, also kosten diese 15 km/h viel Leistung: Schieben Sie den Regler und sehen Sie selbst.",
        "Vergleichen Sie im Windkanal die beiden Karosserien. Hinter der aufrechten Windschutzscheibe und dem Verdeck des Cabriolets reißt die Luft früh ab und bildet einen breiten Nachlauf; am langen, abfallenden Heck der Stromlinie bleibt sie länger anliegen und hinterlässt einen kleineren Nachlauf.",
      ],
    },
  ],
  note: "Die Geometrie ist veranschaulichend: Anlenkpunkte der Aufhängung, Gebläseanordnung, Übersetzung, Ladedruck und Federraten sind plausible Werte, keine Werksangaben.",
  unverified: [
    "Anlenkpunkte und Raten der Aufhängung",
    "Gebläseanordnung, Übersetzung 2,6, Ladedruck 0,5 bar, Lage des Vergasers",
    "Umriss der Karosserie",
    "Mittelschnitte: das Cabriolet B aus dem Umriss und dem Foto; die Stromlinie nach Fotos des restaurierten Wagens skizziert",
    "Windkanal: ein 2-D-Schnitt bei viel kleinerer Reynolds-Zahl als am echten Fahrzeug (etwa 10⁴ gegen 10⁷), die Räder außerhalb; seine Widerstandsaufteilung gilt für den Schnitt",
    "Ob das Cabriolet B oder die Stromlinien-Limousine von 1938 ausgestellt ist",
    "Luftwiderstandsbeiwert des Cabriolet B 0,48; Stirnfläche, Masse, Rollwiderstand und Wirkungsgrad des Antriebs beider Karosserien",
  ],
};
