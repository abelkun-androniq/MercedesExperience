// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Keret, amely felpattan",
  name: "Mercedes-Benz 500 SL",
  summary: "Diana hercegné R 129-es roadstere, amelynek bukókerete 0,3 másodperc alatt felpattan, ha egy érzékelő borulást észlel.",
  eyebrow: "Mercedes-Benz 500 SL, 1991",
  lede: "Egy nyitott autónak nincs teteje, amelyre ráeshetne. Az R 129 az ülések mögé rejtett bukókeretet. A borulást érzékelő szenzor kiold egy rugót, és a keret felcsapódik, mielőtt az autó az oldalára fordulna. Botoljon meg egy padkán, és nézze meg lassítva.",
  photo: { alt: "Diana hercegné bordó, 1991-es Mercedes-Benz 500 SL-je a Mercedes-Benz Múzeumban, jobbról elölről nézve" },
  components: [
    {
      label: "Felpattanó bukókeret",
      params: { label: "Padkán megbotolva: oldalra borulás" },
      talk: [
        "Az autó akkor borul fel, ha súlypontja túlfordul a külső kerekeken: itt kb. 57°-nál. Egy érzékelő figyeli a dőlést és annak sebességét, és jóval előtte old.",
        "A bukókeret összehajtva fekszik az ülések mögött. Egy előfeszített rugó kb. 0,3 másodperc alatt felállítja, amint egy elektromágnes elengedi, jóval azelőtt, hogy az autó az oldalán feküdne. Kapcsolóval is felemelhető.",
        "Fejjel lefelé az autó a megerősített szélvédőkereten és a bukókereten nyugszik, amelyek helyet hagynak az utasok feje felett. Keret nélkül alig marad hely.",
        "Az 1989-es R 129 SL volt az első automatikus bukókeretes autó. Ez Diana hercegnéé volt: német autó a királyi család egyik tagjának, ami szakítás volt a hagyományokkal.",
      ],
    },
  ],
  note: "Az autó merev körvonalként gördül sík talajon, padkán megbotolva: az elv szemléltetése, nem töréspróba.",
  unverified: [
    "A súlypont magassága, a tehetetlenségi sugár és az érzékelő oldási szöge",
    "A körvonal magasságai, a fejmagasság és a bukókeret mérete",
    "A bukókeret rugója és tehetetlensége (a közölt 0,3 s-hoz méretezve)",
    "A jármű körvonala (az adatlap méreteiből vázolva, még nem a fotóról átrajzolva)",
    "Terem: Gyűjtemény 4 (az R 129 a Legenda 6-ban is szerepel)",
  ],
};
