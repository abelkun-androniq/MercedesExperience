// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Az Uhlenhaut Coupé belsejében",
  name: "Mercedes-Benz 300 SLR Uhlenhaut Coupé",
  summary: "Grand Prix-ből származó soros nyolchengeres közvetlen benzinbefecskendezéssel, és szelepek, amelyeket rugók helyett bütykök zárnak.",
  eyebrow: "Mercedes-Benz 300 SLR Uhlenhaut Coupé (W 196 S), 1955",
  question: "Hogyan zárható egy szelep rugó nélkül?",
  lede: "A versenysportautó, amellyel Rudolf Uhlenhaut közúton járt. Két szerkezet: a soros nyolchengeres, amelynek üzemanyagát közvetlenül a hengerekbe fecskendezik, és a deszmodromikus szelepvezérlés, amellyel ott is pöröghetett, ahol a rugók már feladják.",
  photo: { alt: "Ezüst, 1955-ös Mercedes-Benz 300 SLR Uhlenhaut Coupé a Mercedes-Benz Múzeumban, jobbról elölről nézve" },
  components: [
    {
      label: "Soros nyolchengeres",
      params: { label: "Négyütemű körfolyamat · nyolc henger, közvetlen befecskendezés" },
      talk: [
        "Ez a W 196 Grand Prix-autó soros nyolchengerese, a sportautó-versenyekhez megnövelve: 78 mm furat és löket, 2982 cm³ és kb. 310 LE.",
        "Egy Bosch szivattyú a szívóütem alatt közvetlenül minden hengerbe üzemanyagot fecskendez; figyelje a porlasztott sugarat. A Daimler-Benz a közvetlen befecskendezést repülőgépmotorjaiból ismerte.",
        "A motor az egyik oldalra dől, hogy a motorháztető alacsonyan ülhessen. Uhlenhaut, a kísérleti osztály vezetője, ezt a kupét használta céges autóként; kb. 290 km/h-ra volt képes.",
        "Csak két kupé épült. 2022-ben a Mercedes-Benz 135 millió euróért eladta a másikat: ez a valaha autóért fizetett legmagasabb ár.",
      ],
    },
    {
      label: "Deszmodromikus szelepek",
      prompt: "Növelje a fordulatszámot. Hol válik el a rugóval záró szelep a bütyöktől?",
      answer: "Ebben a modellben kb. 7000/min fölött, az emelés csúcsán: ott a szelepnek gyorsabban kellene lelassulnia és visszafordulnia, mint ahogy a rugója tudja, ezért továbbrepül, elválik a bütyöktől. A deszmodromikus szelepet egy második bütyök húzza be, így az ábrázolt fordulatszám-tartományban végig követi a bütyköt.",
      params: { label: "Deszmodromikus szelep és rugóval záró szelep" },
      real: {
        alt: "Közeli kép egy Ducati motorkerékpár-motor szemlélőnyílásán át: felső himba a szelepszár végén, alatta villás himba a szelepszárra erősített gyűrűnél",
        caption: "Ennél a Ducati-motornál a villás himba a szelepszárra erősített gyűrűnél fogva húzza vissza a szelepet; a felső himba nyitja. A gyűrű a villát jelöli; a modellben ugyanilyen gyűrű jelöli a Mercedes záró himbájának villáját. A himbák elrendezése más, a gondolat, a kényszerzárás, ugyanaz.",
      },
      talk: [
        "Nagy fordulaton a szeleprugó már nem tudja elég gyorsan visszahúzni a szelepet: a szelep elemelkedik a bütyökről, és nekiütközhet a dugattyúnak. Növelje a fordulatot, és figyelje, ahogy a rugós szelep vonala elválik a szaggatott bütyökvonaltól.",
        "A Mercedes deszmodromikus vezérlésében nincs záró rugó. Egy második bütyök és egy himba húzza be a szelepet, így ebben a modellben a szelep az ábrázolt fordulatszám-tartományban végig pontosan követi a bütyköt.",
        "A nyitó és záró bütykök össze vannak hangolva: sugaraik összege mindig ugyanannyi, így sosem dolgoznak egymás ellen. Az ötletet később a Ducati tette híressé a motorkerékpárokon.",
      ],
    },
  ],
  note: "A geometria szemléltető: a furaton és a löketen kívül a motor méretei, a gyújtási sorrend, a dőlésszög és a szelepvezérlés számai valószerű értékek, nem gyári adatok.",
  unverified: [
    "Gyújtási sorrend (általános soros nyolchengeres)",
    "33°-os motordőlés",
    "Hajtórúdhossz, vezérlési idők és a rugós szelep elemelkedési fordulatszáma",
    "A jármű körvonala",
    "Terem és szint",
  ],
};
