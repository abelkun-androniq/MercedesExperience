// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "21,5 liter a levegő ellen",
  name: "Blitzen-Benz",
  summary: "Négy, egyenként 5,4 literes henger és hegyes karosszéria: 228,1 km/h Daytonában, 1911-ben.",
  eyebrow: "Benz 200 PS „Blitzen-Benz”, 1909",
  lede: "Forgassa át az óriási négyhengerest, aztán induljon rekordkísérletre. A légellenállás legyőzéséhez szükséges teljesítmény a sebesség köbével nő, így sokkal több teljesítmény csak kicsivel nagyobb sebességet ad.",
  photo: { alt: "Fehér, 1909-es Blitzen-Benz rekordautó a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      label: "Motor",
      params: { label: "Négy henger, 21,5 liter · gyújtási sorrend 1-3-4-2" },
      talk: [
        "Négy 185 × 200 mm-es henger 21 504 cm³-t ad, hengerenként kb. 5,4 litert, 200 LE-vel 1600/min fordulaton.",
        "A Benz ezt a motort először 15,1 literrel építette az 1908-as versenyautóhoz. A furat 185 mm-re bővítésével lett belőle 21,5 liter.",
        "A szelepek a hengerfejben ülnek; a blokkban alul fekvő vezérműtengely szelepemelő rudakon és himbákon át működteti őket.",
        "Mindössze 1600/min fordulaton is a hosszú löket miatt a dugattyúk átlagsebessége kb. 10,7 m/s, annyi, mint egy 100 mm-es löketé 3200/min-nél.",
      ],
    },
    {
      label: "Rekordkísérlet",
      params: { label: "Rekordkísérlet teljes teljesítménnyel", shapes: [{ label: "Blitzen-Benz" }] },
      talk: [
        "Bob Burman Daytona Beachen, 1911. április 23-án: 228,1 km/h repülőrajtos mérföldön, gyorsabban, mint a kor bármelyik repülőgépe vagy vonata. A rekord 1919-ig állt.",
        "Barney Oldfield már 1910-ben 211,97 km/h-t ért el vele ugyanott.",
        "A légellenállás a sebesség négyzetével nő, a legyőzéséhez szükséges teljesítmény pedig a köbével. Húzza a teljesítmény csúszkát: a duplázás csak kb. negyedével növeli a sebességet.",
        "A szélcsatorna megmutatja, honnan jön ez az ellenállás. A Nyomás nézetben a levegő pirosan torlódik a hűtő előtt; a vezető feje és a rövid far mögött leválik, és kavargó örvénysávot hagy, amelynek alacsony nyomása hátrafelé húzza az autót.",
        "A légellenállásba menő minden kilowatt ezt az örvénysávot kavarja, az örvények végül felmelegítik a levegőt. Figyelje a kijelzőket: ebben a metszetben az ellenállás szinte teljes egészében az autó mögötti szívásból adódik. A hűtőre ható nyomást nagyrészt kiegyenlíti a szívás ott, ahol a levegő felgyorsul a széleinél, a súrlódás pedig csak néhány százalék.",
        "Ezért hegyes a hűtő és kúpos a far: minél kevesebb levegőt kell félretolni, és minél szelídebben zárul mögötte, annál kisebb az örvénysáv.",
      ],
    },
  ],
  note: "A múzeumi autó a hat megépült Blitzen-Benz egyike; a légellenállási értékeket úgy választottuk, hogy az egyszerű modell elérje a rekordsebességet. A szélcsatorna a középsík élő, kétdimenziós rácsos Boltzmann-szimulációja: az áramlás képét mutatja, nem mért értékeket.",
  unverified: [
    "0,55-ös légellenállási tényező, 1,1 m² homlokfelület, 1450 kg tömeg, gördülési ellenállás és a hajtáslánc hatásfoka",
    "A szelepvezérlés szelepemelő rudas, felülszelepelt kivitelben rajzolva",
    "Hajtórúdhossz, a hengerek helyzete, tengelytáv",
    "Hogy hat darab épült",
    "A karosszéria körvonala és középsíkmetszete: oldalfotóról, illesztett kamerán át rajzolva, kb. ±5 cm; a lekerekített hűtőburkolat, a vezető, a forgattyúház és a sík alj feltételezett",
    "Szélcsatorna: kétdimenziós metszet a valódinál jóval kisebb Reynolds-számmal (kb. 10⁴ a 10⁷ helyett), a kerekek kívül esnek rajta; az ellenállás megoszlása a metszetre vonatkozik",
  ],
};
