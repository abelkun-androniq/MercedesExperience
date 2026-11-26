// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Strom aus Wasserstoff",
  name: "Mercedes-Benz NECAR 1",
  summary: "Das erste Brennstoffzellenfahrzeug von Daimler-Benz: ein Transporter, dessen ganzer Laderaum die Stacks aufnahm, die aus Wasserstoff und Luft Strom und Wasser machten.",
  question: "Wie macht ein Auto seinen Strom aus Wasserstoff selbst?",
  eyebrow: "Mercedes-Benz NECAR 1, 1994",
  lede: "NECAR steht für New Electric Car. 1994 füllte Daimler-Benz den Laderaum eines MB 100 mit zwölf Brennstoffzellen-Stacks, einem Wasserstofftank sowie den Pumpen und dem Kompressor, die sie betreiben. Blenden Sie die Karosserie aus, verlangen Sie mehr Leistung vom Motor und folgen Sie Wasserstoff und Luft in die Stacks, dem Strom zum Motor und dem Wasser nach unten hinaus.",
  look: "Achten Sie auf den Schriftzug „Brennstoffzellen Elektrofahrzeug“ an der Seite und den bunten Zellenblock, der hinter die Tür gemalt ist.",
  takeaway: "Eine Brennstoffzelle verbrennt nichts: Wasserstoff und Sauerstoff verbinden sich still in ihr, und heraus kommen Strom, Wärme und Wasser.",
  photo: { alt: "Weißer Mercedes-Benz MB 100 Transporter mit dem Schriftzug „Brennstoffzellen Elektrofahrzeug“ und einem gemalten Zellenblock, auf einem beleuchteten Podest im Mercedes-Benz Museum, von vorn links" },
  components: [
    {
      label: "Brennstoffzellen",
      prompt: "Erhöhen Sie den Bedarf des Motors von wenig bis zum Höchstwert. Was geschieht mit der Spannung jeder Zelle und mit dem Wasserstoffverbrauch?",
      answer: "Die Zellspannung sinkt, von fast 1 Volt ohne Last auf etwa die Hälfte bei voller Leistung, während der Wasserstoffverbrauch mit dem Strom wächst. Die letzten Kilowatt kosten also am meisten Wasserstoff, und auch der Anteil des Kompressors wächst: Von etwa 50 kW der Stacks erreichen nur rund 30 kW den Motor.",
      params: { label: "Wasserstoff und Luft hinein; Strom und Wasser heraus" },
      talk: [
        "Jede Zelle ist ein dünnes Sandwich: Wasserstoff auf der einen Seite einer Kunststoffmembran, Luft auf der anderen. Ein Katalysator spaltet den Wasserstoff; seine Protonen wandern durch die Membran, seine Elektronen nicht, sie müssen den Umweg über den Motor nehmen. Auf der anderen Seite treffen sie den Sauerstoff der Luft und bilden Wasser.",
        "Eine Zelle liefert ohne Last etwa ein Volt, unter Last weniger. Hunderte Zellen in Reihe, gruppiert in zwölf Stacks, gaben dem NECAR 1 etwa 50 kW.",
        "Ein großer Teil davon betrieb das System selbst, vor allem den Kompressor, der Luft durch die Stacks bläst: Der Elektromotor des Transporters hatte 30 kW.",
        "Die Technik füllte den Laderaum, es blieben zwei Sitze. Zwei Jahre später fuhr der NECAR 2 sechs Personen in einer V-Klasse; heutige Brennstoffzellenfahrzeuge bringen alles unter dem Boden unter.",
      ],
    },
  ],
  note: "Zwölf Stacks mit zusammen etwa 50 kW und der 30-kW-Motor sind Angaben von Daimler. Zahl, Größe und Spannungskurve der Zellen, der Anteil des Kompressors und die Anordnung im Transporter sind veranschaulichend.",
  unverified: [
    "Zahl der Zellen, Zellfläche und Spannungskurve",
    "Anteil der Stack-Leistung für Kompressor und Pumpen",
    "Anordnung von Tank, Stacks und Motor im Transporter",
    "Radstand, Spurweite, Radgröße und Umriss des MB 100 (skizziert)",
    "Raum: im Museum fotografiert (Mercedes-Archiv, Besuch 2025); der Raum wird nicht genannt",
  ],
};
