// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Hengerenként két szikra",
  name: "Mercedes-Benz 770 „Grosser Mercedes”",
  summary: "Korának legnagyobb Mercedes-Benzének 7,7 literes, soros nyolchengeres motorja: minden hengerben két gyújtógyertya, padlógáznál kompresszor.",
  eyebrow: "Mercedes-Benz 770, 1932",
  lede: "Államfőknek épült, ezért bármi történik, járnia kellett. Nyolc hengerének mindegyikében két gyújtógyertya van, két külön gyújtórendszerről táplálva. Figyelje, ahogy mindkettő szikrázik, amikor a henger gyújt; aztán adjon padlógázt, hogy belépjen a kompresszor.",
  photo: { alt: "II. Vilmos császár szürke, 1932-es Mercedes-Benz 770 „Grosser Mercedes” F kabriója a Mercedes-Benz Múzeumban, elölről nézve" },
  components: [
    {
      label: "Motor",
      params: { label: "7,7 literes soros nyolchengeres · hengerenként két gyertya · gyújtási sorrend 1-6-2-5-8-3-7-4" },
      talk: [
        "A 770 korának legnagyobb Mercedes-Benze volt, kis számban épült államfőknek, uralkodóknak és nagyon gazdagoknak. Ez a Cabriolet F a volt II. Vilmos császárnak készült, aki akkor Hollandiában élt száműzetésben.",
        "Nyolc henger egy sorban, 95 mm furattal és 135 mm lökettel: 7,7 liter. Soros nyolchengeresben negyed fordulatonként gyújt egy henger, ezért a hajtás sima és egyenletes.",
        "Minden hengerben két gyújtógyertya van. Az egyik sort mágnesgyújtó, a másikat akkumulátor és gyújtótekercs táplálja. Két ponton meggyújtva a keverék körülbelül fele idő alatt ég el, és ha az egyik rendszer kiesik, a motor a másikkal tovább jár.",
      ],
    },
    {
      label: "Kompresszor",
      params: { engineLabel: "7,7 literes soros nyolchengeres" },
      real: {
        alt: "1928-as rajz egy szétszedett Mercedes-kompresszorról: balra a ház, jobbra a két álló forgórész, alattuk a tengelykapcsoló",
        caption: "Szétszedett Mercedes-kompresszor egy 1928-as kézikönyv rajzán. A ház (balra) a két álló forgórészre (jobbra) illeszkedik; alattuk a tengelykapcsoló, amely teljes gáznál bekapcsolja a kompresszort.",
      },
      talk: [
        "Az SSK-éhoz hasonlóan a 770 Roots-kompresszora is csak akkor működik, ha szükség van rá. Ha a gázpedált tövig nyomják, egy tengelykapcsoló a főtengelyhez kapcsolja, és nyomás alatt fújja a levegőt a porlasztóba.",
        "Ütemenként több levegő több tüzelőanyag elégetését teszi lehetővé: kompresszor nélkül 150 LE, vele 200 LE. Ha a vezető visszavesz, a tengelykapcsoló újra leválasztja, kímélve a motort és a tüzelőanyagot.",
      ],
    },
  ],
  note: "Több 770 is fennmaradt; a múzeumé az a Cabriolet F, amely II. Vilmosé volt.",
  unverified: [
    "A motor helyzete az autóban és a hajtórúdhossz",
    "A szelepvezérlés szelepemelő rudas, felül szelepelt motorként ábrázolva",
    "A kompresszor áttétele, kapcsolása és töltőnyomása (a 150 és 200 LE közölt érték)",
    "A jármű körvonala (az adatlap méreteiből vázolva, még nem a fotóról átrajzolva)",
    "Terem: Legenda 3",
  ],
};
