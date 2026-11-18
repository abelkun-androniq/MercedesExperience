// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Fék a zárak helyett",
  name: "Mercedes-Benz ML 320 „Jurassic Park”",
  summary: "Az első M-osztály, amely egy dinoszauruszos filmben debütált: állandó összkerékhajtás, amelynek fékjei megakadályozzák a kerék kipörgését.",
  eyebrow: "Mercedes-Benz ML 320, 1997",
  lede: "Az M-osztálynak három nyitott differenciálműve van, zár nélkül. Ha egy kerék kipörögni kezd, a fékje megfogja, és a differenciálmű átadja a nyomatékot a még tapadó keréknek. Tegyen kerekeket jégre, és kapcsolja be a rendszert.",
  photo: { alt: "„Az elveszett világ: Jurassic Park” című film terepszínű Mercedes-Benz ML 320-asa, balról hátulról nézve" },
  components: [
    {
      label: "4ETS kipörgésgátló",
      params: {
        label: "Kapaszkodás emelkedőn, felülről",
        surfaces: [{ label: "Száraz út" }, { label: "Egy hátsó kerék jégen" }, { label: "Két átlós kerék jégen" }, { label: "Három kerék jégen" }],
        cases: [{ label: "Nyitott differenciálművek" }, { label: "4ETS: fékezi a kipörgő kereket" }],
      },
      talk: [
        "Állandó összkerékhajtás három nyitott differenciálművön át: elöl, középen és hátul. Jó talajon minden kerék a saját sebességével foroghat, így az autó feszülés nélkül kanyarodik.",
        "A nyitott differenciálmű azonban mindig egyenlően osztja meg a nyomatékot, így egyetlen jégen álló kerék korlátozza mindazt, ami hozzá kapcsolódik, és az autó megáll, miközben az a kerék kipörög.",
        "A 4ETS, az elektronikus kipörgésgátló figyeli a kerekek fordulatát. Ha egy kerék kipörög, lefékezi: a fék most visszatartja azt, amit a jég nem tud, így a differenciálmű ugyanannyi nyomatékot küldhet a szemközti, tapadó keréknek.",
        "Az ABS-érzékelőkkel és a fékekkel azt teszi, amit a differenciálzárak mechanikusan, a fékek által visszatartott hajtóerő árán. Ez az autó egyike azoknak, amelyek az 1997-es „Az elveszett világ: Jurassic Park” című filmhez készültek.",
      ],
    },
  ],
  note: "A fékerő, a tapadás és az emelkedő kerek számok: azt mutatják, mely kerekek hajtanak, nem az M-osztály valódi kapaszkodóképességét.",
  unverified: [
    "A kerékterhelések, a hajtóerő, a fékerő, az emelkedő ellenállása és a tapadási értékek",
    "A jármű körvonala (az adatlap méreteiből vázolva, még nem a fotóról átrajzolva)",
    "Terem: Gyűjtemény 4",
  ],
};
