// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Bremsen statt Sperren",
  name: "Mercedes-Benz ML 320 „Jurassic Park“",
  summary: "Die erste M-Klasse, die ihren ersten Auftritt in einem Dinosaurierfilm hatte: permanenter Allradantrieb, dessen Bremsen ein Rad am Durchdrehen hindern.",
  eyebrow: "Mercedes-Benz ML 320, 1997",
  lede: "Die M-Klasse hat drei offene Differenziale und keine Sperren. Beginnt ein Rad durchzudrehen, packt es seine Bremse, und das Differenzial gibt das Drehmoment an das Rad weiter, das noch Haftung hat. Stellen Sie Räder auf Eis und schalten Sie das System ein.",
  photo: {
    alt: "Mercedes-Benz ML 320 in Tarnlackierung aus dem Film „Vergessene Welt: Jurassic Park“, von hinten links gesehen",
  },
  components: [
    {
      label: "4ETS-Traktion",
      params: {
        label: "Am Hang, von oben gesehen",
        surfaces: [{ label: "Trockene Piste" }, { label: "Ein Hinterrad auf Eis" }, { label: "Eis unter zwei diagonalen Rädern" }, { label: "Drei Räder auf Eis" }],
        cases: [{ label: "Offene Differenziale" }, { label: "4ETS: bremst das durchdrehende Rad" }],
      },
      talk: [
        "Permanenter Allradantrieb über drei offene Differenziale: vorn, Mitte und hinten. Auf gutem Grund lassen sie jedes Rad mit eigener Drehzahl laufen, so fährt das Fahrzeug verspannungsfrei um Kurven.",
        "Doch ein offenes Differenzial teilt das Drehmoment immer gleich auf, also begrenzt ein einziges Rad auf Eis den Antrieb von allem, was damit verbunden ist, und das Fahrzeug bleibt mit durchdrehendem Rad stehen.",
        "4ETS, das elektronische Traktionssystem, überwacht die Raddrehzahlen. Dreht ein Rad durch, bremst es dieses Rad: Die Bremse hält nun zurück, was das Eis nicht kann, also kann das Differenzial dasselbe Drehmoment an das gegenüberliegende Rad schicken, das greift.",
        "Es leistet mit den ABS-Sensoren und den Bremsen, was Differenzialsperren mechanisch tun, auf Kosten des Antriebs, den die Bremsen zurückhalten. Dieses Fahrzeug ist eines von denen, die für den Film „Vergessene Welt: Jurassic Park“ von 1997 entstanden.",
      ],
    },
  ],
  note: "Bremskraft, Haftung und Steigung sind runde Werte: Sie zeigen, welche Räder antreiben, nicht die echte Steigfähigkeit der M-Klasse.",
  unverified: [
    "Radlasten, Antriebskraft, Bremskraft, Steigungswiderstand und Haftwerte",
    "Umriss der Karosserie (aus den Maßen des Datenblatts skizziert, noch nicht vom Foto abgezeichnet)",
    "Raum: Collection 4",
  ],
};
