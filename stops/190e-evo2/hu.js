// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Légellenállás a tapadásért",
  name: "Mercedes-Benz 190 E 2.5-16 Evolution II",
  summary: "A DTM homologizációs különkiadás, amelynek szélcsatornában formált szárnyai és spoilerei kisebb légellenállást adtak, mint a sima 2.3-16-é.",
  question: "Miért éri meg a versenyzőnek a nagyobb légellenállás?",
  eyebrow: "Mercedes-Benz 190 E Evolution II, 1992",
  lede: "Klaus Ludwig DTM-autóján a hátsó szárnynak állítható felső lapja van, az első légterelő lemez előretolható, a kerékívek pedig ki vannak szélesítve. Ennek az autónak egy egyszerűsített modelljére előre kiszámított háromdimenziós szélcsatorna mutatja meg, mit tesz a szárnylap és az első légterelő a levegővel és az egyes tengelyek terhelésével.",
  photo: { alt: "Klaus Ludwig 3-as rajtszámú, 1992-es Mercedes-Benz 190 E 2.5-16 Evolution II DTM-autója a Mercedes-Benz Múzeumban, balról nézve" },
  components: [
    {
      label: "Versenyaerodinamika",
      prompt: "Miért éri meg a versenyzőnek a nagyobb légellenállás? Állítsa fel a szárnylapot, és vesse össze a nyilakat az alapállapottal.",
      answer: "Ebben a modellben a felállított szárnylap 200 km/h-nál kb. 34 kg-mal jobban leszorítja a hátsó tengelyt (a két rácson 25–43 kg), a légellenállás pedig kb. 9 kW-tal több motorteljesítményt emészt fel (4–14 kW); az első tengely terhelése alig változik. A többletterhelés hátul tapadást és stabilitást ad a gyors kanyarokban, a légellenállás sebességet visz el az egyeneseken: hogy melyik fontosabb, azt a pálya dönti el. Ezek az egyszerűsített modell számai, nem a valódi autóéi.",
      params: {
        label: "Szélcsatorna 200 km/h-nál",
        cases: [
          { label: "Alapállapot", say: "Az autó a modellben: ehhez mérjük a másik kettőt." },
          { label: "Szárnylap fent", say: "A felállított lap az autó mögött jobban felfelé tereli a levegőt: a csomagtartó fölötti áramvonalak megemelkednek, a szárny körüli szívás erősödik. A hátsó tengelyt nagyobb erő nyomja le, és nő a légellenállás." },
          { label: "Légterelő elöl", say: "A légterelő mélyebbre nyúlik az orr előtti, nagy nyomású levegőbe. Hatása a szélcsatorna saját szórásán belül marad, ezért a kijelzőkön „–” áll: mindkét rács valamivel kisebb teljes leszorítóerőre utal (kb. 16 kg), és elöl sem látszik egyértelmű növekedés. A néhány centis lemez a modellben csak egy-két 28 mm-es kocka." },
        ],
      },
      talk: [
        "A versenyautó hátsó szárnyának felső lapja felállítható, az első légterelő lemeznek pedig két állása van. A csapatok pályánként állítják be őket: gyors kanyarokhoz több leszorítóerőt, hosszú egyenesekhez kevesebb légellenállást.",
        "A leszorítóerő az úthoz nyomja a gumikat. Nagyobb terhelésnél nagyobb a tapadás a kanyarban, így az autó gyorsabban veheti be; az ára a légellenállás, amely a következő egyenesen sebességbe kerül.",
        "Az is számít, hová esik a terhelés, nem csak az, hogy mennyi. A hátul jelentkező terhelés stabilan tartja az autó farát; az elöl jelentkező segít befordulni. A nyilak az egyes tengelyeken mutatják a változást, az egész autó felhajtóerejéből és bólintónyomatékából számítva.",
        "A kiszélesített kerékívek a széles gumiknak adnak helyet. A gumitól 15 mm-re futó körvonalig visszavágott kerékív is szerepelt a kísérletben, ám ez a változás finomabb a modell 28 mm-es kockáinál: a kockás autó ugyanolyan maradt, ezért ehhez nincs gomb.",
        "A modell az Evo II egy játékhoz készült hálója, 28 mm-es tömör kockákkal kitöltve: az autó fele, a középvonalon tükörrel, mozgó úttal és álló kerekekkel, a valódinál jóval kisebb Reynolds-számmal. Erői messze vannak a valódi autóétól: az esetek közötti változást olvassa, ne az összegeket.",
      ],
    },
    {
      label: "Utcai autó az autópályán",
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
    {
      label: "Versenymotor",
      prompt: "Percenként 9000-es fordulatszámnál hány ezredmásodpercig tart a szívóütem? Váltson a két fordulatszám között, és figyelje a két kék szívószelepet.",
      answer: "3,3 ezredmásodpercig: fél főtengely-fordulatig. 4500/min-nél 6,7 ms jut rá. Kétszeres fordulaton feleannyi idő marad a töltésre, ezért lélegzik minden henger két szívószelepen át.",
      params: { label: "2,5 literes négyhengeres, 16 szelep · gyújtási sorrend 1-3-4-2" },
      talk: [
        "A versenymotor: négy henger 97,8 mm-es furattal és 82,8 mm-es lökettel, 2,5 liter, két felül fekvő vezérműtengellyel és hengerenként négy szeleppel.",
        "A korai DTM-változat 8500/min-nél 245 kW-ot adott, és 9500/min-ig foroghatott. Az 1992-es bajnoki autóra a Mercedes-Benz legfeljebb 274 kW-ot (373 LE) ad meg.",
        "Az utcai Evolution II furata 97,3 mm, teljesítménye 173 kW (235 LE) volt.",
        "A rövid löket kordában tartja a dugattyúk sebességét: 9000/min-nél is átlagosan kb. 25 m/s-mal járnak fel-le a hengerben.",
        "A kijelzett idők 180°-os főtengely-elfordulásra, egy szívóütemre vonatkoznak. A szívószelepek valamivel előtte nyílnak és utána zárnak, ahogy a vezérlés beállítja.",
      ],
    },
  ],
  note: "Az aerodinamikai értékek itt az utcai autókéi; a múzeum versenyautóját leszorítóerőre állították be.",
  unverified: [
    "Homlokfelületek, tömegek, gördülési ellenállás és a hajtáslánc hatásfoka",
    "A versenyautó teljesítménye és beállítása",
    "A jármű körvonala és középsíkú metszete: a megállóhely fotójáról (oldalnézet) átrajzolva az illesztett kamerán át, kb. ±10 cm; a metszetből a hátsó szárny kimaradt, az alja sík",
    "Háromdimenziós szélcsatorna: egyszerűsített modell (28 mm-es kockákkal kitöltött játékháló, sík padló, álló kerekek, Reynolds-szám kb. 3 × 10⁴ a 10⁷ helyett); a szárnylap és a légterelő változtatása szemléltető, nem az 1992-es beállítás; egy változás csak akkor jelenik meg, ha a durvább, 40 mm-es rácson is megtartja előjelét, és a két rács átlaga kiemelkedik a futások saját szórásából (a kerékív egy kockánál finomabb visszavágása semmit sem változtatott, ezért kimaradt)",
    "Az utcai autó szélcsatornája: kétdimenziós metszet a valódinál jóval kisebb Reynolds-számmal (kb. 10⁴ a 10⁷ helyett), a kerekek kívül esnek rajta; az ellenállás megoszlása a metszetre vonatkozik",
    "Versenymotor: hajtórúdhossz, hengertávolság, a blokk dőlése és helyzete az autóban; karburátoros szívóoldallal ábrázolva",
    "Terem: Legenda 7",
  ],
};
