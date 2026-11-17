// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Az első autó motorja és differenciálműve",
  name: "Benz Patent-Motorwagen",
  summary: "Karl Benz háromkerekűje: egy fekvő henger, vízszintes lendkerék és differenciálmű, hogy a hátsó kerekek eltérő sebességgel foroghassanak.",
  eyebrow: "Benz Patent-Motorwagen, 1886",
  lede: "Az autó, amelyet Karl Benz 1886 januárjában szabadalmaztatott. Figyelje a hátul fekvő egyetlen hengert, aztán a közlőtengelyen ülő differenciálművet, amely kanyarban gyorsabban engedi forogni a külső hátsó kereket.",
  photo: { alt: "A zöld kerekű 1886-os Benz Patent-Motorwagen a Mercedes-Benz Múzeumban, hátulról balról nézve" },
  components: [
    {
      label: "Motor",
      params: { label: "Egyhengeres, fekvő" },
      talk: [
        "A 954 cm³-es (90 × 150 mm) egyetlen henger hátul fekszik, és kb. 400/min fordulaton 0,75 LE-t ad.",
        "A nagy lendkerék is vízszintesen fekszik. Benz azért tette így, hogy pörgettyűhatása ne dolgozzon a kormányzás ellen a szűk kanyarokban.",
        "Benz Daimler izzócsöve helyett elektromos gyújtást használt, gyújtótekerccsel és gyújtógyertyával.",
        "A teljes erőátvitel egy szíj a közlőtengelyre: egy fokozat, hátramenet nélkül. A tengelykapcsoló annyi, hogy a szíjat a hajtótárcsa melletti, szabadon futó tárcsára tolják.",
      ],
    },
    {
      label: "Differenciálmű",
      params: { label: "Differenciálmű a közlőtengelyen" },
      talk: [
        "Kanyarban a külső hátsó keréknek hosszabb utat kell megtennie, mint a belsőnek. Egyetlen merev tengelyen az egyiknek csúsznia kellene.",
        "Benz differenciálművet épített a közlőtengelybe. A szíj a házát forgatja, a benne lévő kis kúpkerekek pedig engedik, hogy a két kimenő tengely eltérő sebességgel forogjon.",
        "A közlőtengely mindkét végéről lánc fut egy-egy hátsó kerékhez, mint a kerékpáron.",
        "Mozgassa a kormány csúszkát. Egyenesben a kis kiegyenlítő kerekek a házzal együtt körbefutnak, de nem forognak; kanyarban pörögni kezdenek.",
      ],
    },
  ],
  note: "Az 1886. január 29-i, DRP 37435 számú szabadalmat gyakran az autó születési anyakönyvi kivonatának nevezik. Egyes források 91,4 × 150 mm-t (984 cm³) adnak meg a motorra.",
  unverified: [
    "Kerékméretek, nyomtáv és tengelytáv",
    "Hajtórúdhossz, lendkerékméret, a motor és a közlőtengely helyzete",
    "A lánckerekek mérete és a 12 km/h-s kanyarsebesség",
    "A jármű körvonala (a fotóról átrajzolva)",
  ],
};
