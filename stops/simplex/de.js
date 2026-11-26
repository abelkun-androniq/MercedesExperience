// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Gänge ohne Synchronisierung und der Bienenwabenkühler",
  name: "Mercedes-Simplex 40 PS",
  summary: "Der „einfache“ Mercedes: ein Vierganggetriebe mit Schieberädern, Kettenantrieb und Maybachs Bienenwabenkühler.",
  eyebrow: "Mercedes-Simplex 40 PS, 1902",
  lede: "Der Nachfolger des ersten Mercedes. Schalten Sie sein Schieberädergetriebe selbst: Ohne Synchronisierung geht ein Gang nur hinein, wenn die Drehzahlen passen. Vergleichen Sie dann den Bienenwabenkühler mit dem älteren Röhrchenkühler.",
  photo: {
    alt: "Blauer Mercedes Simplex 40 PS von 1902 im Mercedes-Benz Museum, von vorn links gesehen",
  },
  components: [
    {
      label: "Getriebe",
      params: {
        label: "Vierganggetriebe mit Schieberädern",
      },
      talk: [
        "Keine Synchronisierung: Der Hebel schiebt ein Zahnradpaar in Eingriff, und es gleitet nur hinein, wenn sich die Zähne schon etwa gleich schnell bewegen.",
        "Zum Hochschalten trat man die Kupplung und wartete, bis das Getriebe langsamer wurde. Zum Herunterschalten kuppelte man doppelt: Leerlauf, Kupplung kommen lassen, kurz Gas, Kupplung treten, dann den Gang einlegen.",
        "Der Hebel läuft in einer Kulisse neben dem Fahrer. Hinter dem Getriebe treibt eine Vorgelegewelle mit dem Differenzial zwei Ketten zu den Hinterrädern.",
        "Die Demo schaltet durch alle vier Gänge hoch. Probieren Sie es dann selbst: Kratzen heißt, die Drehzahlen liegen noch zu weit auseinander.",
      ],
    },
    {
      label: "Kühler",
      params: {
        label: "Kühlwasser bei Volllast",
        types: [{ label: "Bienenwabe (1900)" }, { label: "Röhrchen, gleich groß (1897)" }],
      },
      talk: [
        "Maybachs Bienenwabenkühler, patentiert als DRP 122766 (angemeldet im September 1900), besteht aus 8070 quadratischen Röhrchen von je 6 × 6 mm.",
        "Quadratische Röhrchen liegen dichter als runde, so passt mehr Kühlfläche in denselben Raum. Ein kleiner Lüfter hinter dem Kühler hilft bei niedriger Geschwindigkeit.",
        "Vom Phoenix von 1898 bis zum ersten Mercedes 1900 halbierte sich der Wasserverbrauch von 18 auf 9 Liter auf 100 km, während die Leistung von 8 auf 35 PS stieg.",
        "Die Wabenfront wurde danach das Gesicht jedes Mercedes.",
      ],
    },
  ],
  note: "Vierzylinder mit 6785 cm³, etwa 943 kg, Radstand 2450 mm: Der älteste erhaltene Mercedes ist ein Simplex dieses Typs.",
  unverified: [
    "Zähnezahlen, Achsübersetzung und Anordnung der Kulisse (eine Quelle nennt drei Gänge)",
    "Drehzahlbereich des Motors und die Beschleunigung der Demo",
    "Wärme ins Wasser und Leistung beider Kühler",
    "Lage von Getriebe, Motor und Kühler",
    "Umriss der Karosserie",
  ],
};
