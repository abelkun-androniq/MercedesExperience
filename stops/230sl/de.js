// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Ein sicherer Sportwagen",
  name: "Mercedes-Benz 230 SL",
  summary: "Der erste Sportwagen mit steifer Fahrgastzelle und Knautschzonen vorn und hinten, unter dem eingezogenen „Pagoden“-Hardtop.",
  eyebrow: "Mercedes-Benz 230 SL, 1963",
  lede: "Unter seinen eleganten Linien trägt der 230 SL die Sicherheitskarosserie der Limousinen: eine steife Zelle für die beiden Insassen und einen Vorderwagen, der sich falten soll. Fahren Sie ihn gegen eine Wand und sehen Sie zu, wie der Vorderwagen die Energie aufnimmt, während die Zelle ganz bleibt.",
  photo: {
    alt: "Champagnerfarbener Mercedes-Benz 230 SL von 1964 mit Pagoden-Hardtop im Mercedes-Benz Museum, von vorn links gesehen",
  },
  components: [
    {
      label: "Sicherheitskarosserie",
      params: {
        label: "Frontalaufprall gegen eine starre Wand",
        cases: [{ label: "Sicherheitskarosserie: Knautschzone" }, { label: "Steifer Vorderwagen" }],
      },
      talk: [
        "Béla Barényis Sicherheitskarosserie, Anfang der 1950er-Jahre patentiert und zuerst in die „Heckflossen“-Limousinen von 1959 eingebaut, teilt ein Auto in eine steife Fahrgastzelle und verformbare Zonen vorn und hinten. Der 230 SL von 1963 war der erste so gebaute Sportwagen.",
        "Bei einem Frontalaufprall faltet sich der Vorderwagen von der Stoßstange nach hinten. Er nimmt die Energie über einen langen Weg bei fast konstanter Kraft auf, also werden die Zelle und die Menschen darin weniger heftig abgebremst.",
        "Vergleichen Sie einen steifen Vorderwagen: Das Auto hält auf kürzerem Weg an, also ist die Spitzenverzögerung weit höher, und ist der kurze Vorderwagen aufgebraucht, wird die Zelle selbst eingedrückt.",
        "Das abnehmbare Hardtop ist in der Mitte eingezogen, die „Pagoden“-Form, die dem Wagen seinen Spitznamen gab: Die hochgezogenen Ränder schufen Platz für hohe Seitenfenster und versteifen das Dach.",
      ],
    },
  ],
  note: "Der Aufprall ist eine einzige Masse gegen zwei Kraftgesetze: Er zeigt die Idee der Knautschzone, nicht die Testergebnisse des 230 SL.",
  unverified: [
    "Aufprallkräfte, Länge der Knautschzone und Steifigkeit der Zelle",
    "Lage von Stoßstange, Stirnwand und Zelle im Crashmodell",
    "Umriss der Karosserie (aus den Maßen des Datenblatts und dem Foto abgezeichnet)",
    "Raum: Mythos 5",
  ],
};
