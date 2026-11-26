// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Ein Dach im Kofferraum",
  name: "Mercedes-Benz SLK",
  summary: "Coupé und Roadster in einem: Das stählerne „Vario-Dach“ faltet sich in etwa 25 Sekunden selbst in den Kofferraum.",
  eyebrow: "Mercedes-Benz SLK, 1996",
  question: "Wohin kommt ein Stahldach, wenn man es öffnet?",
  look: "Suchen Sie die Fuge zwischen Dach und Heckscheibe: Dort faltet sich das Dach.",
  takeaway: "Schauen Sie noch einmal auf den Kofferraumdeckel. Darunter liegt bei offenem Dach das ganze Stahldach. Wie viel Platz bleibt dann für Gepäck?",
  lede: "Ein Knopfdruck, und das Stahldach entriegelt, der Kofferraumdeckel schwenkt hoch, und Dach und Heckscheibe klappen als ein Paket in den Kofferraum, bevor sich der Deckel darüber schließt. Verfolgen Sie den Ablauf von der Seite.",
  photo: {
    caption: "Referenzfoto derselben Generation, nicht das Fahrzeug des Museums",
    alt: "Silberner Mercedes-Benz SLK der ersten Generation mit geschlossenem Stahldach, in einer Straße geparkt, von vorn links gesehen",
  },
  components: [
    {
      label: "Vario-Dach",
      prompt: "Tippen Sie auf „Dach öffnen“. Was bewegt sich zuerst, der Kofferraumdeckel oder das Dach?",
      answer: "Zuerst geht der Deckel hoch; dann dreht sich die Heckscheibe nach hinten, das Dach klappt darauf, und das Paket senkt sich in den Kofferraum, bevor der Deckel schließt. Der Preis: Bei offenem Dach ist ein Großteil des Kofferraums belegt.",
      more: "Wie sich das Dach faltet",
      params: {
        label: "Das Stahldach falten",
      },
      real: {
        alt: "Seitenansicht eines schwarzen Mercedes-Benz SLK 230, das Klappdach halb unter dem angehobenen Kofferraumdeckel",
        caption: "Ein SLK 230 derselben Baureihe R 170, mitten im Falten erwischt: Der Kofferraumdeckel steht hinten offen, Dachteil und Heckscheibe schwenken in die Lücke. Warum öffnet der Kofferraumdeckel zuerst?",
      },
      talk: [
        "Klappbare Stahl-Hardtops hatte man schon früher versucht, doch der SLK von 1996 brachte eines in ein Serienauto: geschlossen ein Coupé mit der Ruhe und Sicherheit eines festen Dachs, offen ein Roadster.",
        "Das Dach besteht aus zwei Teilen: dem Dachteil über den Sitzen und dem Heckscheibenteil. Beim Öffnen schwenken Hydraulikzylinder den Kofferraumdeckel um sein hinteres Scharnier hoch und drehen dann das Heckteil nach hinten und unten, mit dem Dach, das sich darauf faltet.",
        "Das Paket liegt am Ende gestapelt im Kofferraum, und der Deckel schließt sich darüber. Bei offenem Dach bleibt weniger Gepäckraum.",
        "Der ganze Ablauf dauert etwa 25 Sekunden, angetrieben von einer Hydraulikpumpe und Schritt für Schritt von Sensoren an jeder Position geschaltet.",
      ],
    },
  ],
  note: "Ein frei lizenziertes Foto des SLK im Museum war nicht verfügbar; dieses Foto zeigt einen SLK von 1997–2000, fotografiert in einer Straße in Washington, D.C.",
  unverified: [
    "Punkte des Dachteils, Lage der Drehpunkte sowie Reihenfolge und Zeitablauf der Bewegungen",
    "Umriss der Karosserie (vom Foto abgezeichnet; das Heck, außerhalb des Bildes, nach der Länge laut Datenblatt)",
    "Foto nicht im Museum aufgenommen",
    "Raum: Mythos 6",
  ],
};
