// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Szárny, amely csökkenti a légellenállást",
  name: "Mercedes-Benz 190 E 2.5-16 Evolution II",
  summary: "A DTM homologizációs különkiadás, amelynek szélcsatornában formált szárnyai és spoilerei kisebb légellenállást adtak, mint a sima 2.3-16-é.",
  eyebrow: "Mercedes-Benz 190 E Evolution II, 1992",
  lede: "Hatalmas hátsó szárnya olyan, mintha fékezné az autót. A teljes karosszériacsomag szélcsatornás fejlesztése az ellenkezőjét érte el: kisebb légellenállást, mint a korábbi 2.3-16-é, és kisebb felhajtóerőt is. Hajtsa mindkettőt padlógázzal, és nézze meg, hol találkozik a motor teljesítménye a légellenállással.",
  photo: { alt: "Klaus Ludwig 3-as rajtszámú, 1992-es Mercedes-Benz 190 E 2.5-16 Evolution II DTM-autója a Mercedes-Benz Múzeumban, balról nézve" },
  components: [
    {
      label: "Aerodinamika",
      params: {
        label: "Teljes gázzal az autópályán",
        shapes: [{ label: "Evolution II karosszériacsomag" }, { label: "2.3-16 karosszéria" }],
      },
      talk: [
        "A túraautó-versenyek szabályai minden versenyautóhoz utcai változatot követeltek: 1990-ben 502 Evolution II készült, hogy a DTM-autó a karosszériacsomaggal versenyezhessen.",
        "Az első spoilert, a széles kerékíveket, a küszöbborításokat és az állítható hátsó szárnyat a szélcsatornában egyetlen rendszerként formálták. Az eredmény: kb. 0,29-es légellenállási tényező a 2.3-16 0,32-jével szemben, és nagy sebességnél jóval kisebb felhajtóerő.",
        "A levegő legyőzéséhez szükséges teljesítmény a sebesség köbével nő. 235 LE-vel az utcai autó kb. 250 km/h-t ér el.",
        "Ez Klaus Ludwig 1992-es DTM-autója; a versenyváltozatnak jóval több mint 350 LE-je volt. Hátsó szárnya a légellenállás árán leszorítóerőt ad.",
        "A szélcsatorna az autó középvonalán vett metszetet mutatja. Nyomás nézetben a levegő az orrnak és a szélvédőnek feszül, a tető fölött felgyorsul, a csomagtartó mögött pedig leválik, és örvénylő nyomvizet hagy, amely visszahúzza az autót. A hátsó szárny kimaradt a metszetből.",
      ],
    },
  ],
  note: "Az aerodinamikai értékek itt az utcai autókéi; a múzeum versenyautóját leszorítóerőre állították be.",
  unverified: [
    "Homlokfelületek, tömegek, gördülési ellenállás és a hajtáslánc hatásfoka",
    "A versenyautó teljesítménye és beállítása",
    "A jármű körvonala és középsíkú metszete: a megállóhely fotójáról (oldalnézet) átrajzolva az illesztett kamerán át, kb. ±10 cm; a metszetből a hátsó szárny kimaradt, az alja sík",
    "Szélcsatorna: kétdimenziós metszet a valódinál jóval kisebb Reynolds-számmal (kb. 10⁴ a 10⁷ helyett), a kerekek kívül esnek rajta; az ellenállás megoszlása a metszetre vonatkozik",
    "Terem: Legenda 7",
  ],
};
