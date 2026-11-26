// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Légellenállás a tapadásért",
  name: "Mercedes-Benz 190 E 2.5-16 Evolution II",
  summary: "A DTM homologizációs különkiadás, amelynek szélcsatornában formált szárnyai és spoilerei kisebb légellenállást adtak, mint a sima 2.3-16-é.",
  question: "Miért éri meg a versenyzőnek a nagyobb légellenállás?",
  eyebrow: "Mercedes-Benz 190 E Evolution II, 1992",
  lede: "Klaus Ludwig DTM-autóján a hátsó szárnynak állítható felső lapja van, az első légterelő lemez előretolható, a kerékívek pedig ki vannak szélesítve. Előre kiszámított szélcsatornák három közelképe mutatja meg, mit tesz az egyes alkatrészek körül a levegővel.",
  photo: { alt: "Klaus Ludwig 3-as rajtszámú, 1992-es Mercedes-Benz 190 E 2.5-16 Evolution II DTM-autója a Mercedes-Benz Múzeumban, balról nézve" },
  components: [
    {
      label: "Hátsó szárny",
      prompt: "Figyelje a narancssárga nyilat a szárny kilépőéle fölötti szaggatott keretben. Állítsa fel a lapot: merre fordul a szárnyat elhagyó levegő?",
      answer: "Felfelé. Felállított lappal a keretben az átlagos áramlási irány kb. 13°-kal feljebb billen (egy durvább rácson kb. 8°-kal). A levegő felfelé terelése erőt kíván, és a szárny ennek ellenerejét lefelé kapja. Az egész autó modelljének mindkét rácsán a felállított lap növelte a hátsó tengely terhelését és a légellenállást. Hogy mennyivel, az a rácstól függ: 200 km/h-nál kb. 25–43 kg-mal több jut a hátsó tengelyre, 4–14 kW-tal több, légellenállásra fordított motorteljesítmény árán.",
      more: "A szélcsatorna részletei",
      params: {
        label: "Szárnylap · metszet az egész autó szélcsatornájából",
        cases: [
          { label: "Alapállapot", say: "Lent a lap: figyelje a narancssárga nyilat, a kilépőélt a szaggatott keretben elhagyó levegő átlagos irányát." },
          { label: "Szárnylap fent", say: "Fent a lap: ugyanabban a keretben a levegő felfelé billen, kb. 13°-kal jobban, mint leengedett lappal, és a szárny mögötti útvonalak is vele hajlanak felfelé." },
        ],
      },
      talk: [
        "A versenyautó hátsó szárnyán felső lap ül, amelyet a csapatok gyors kanyarokkal teli pályákon felállíthattak. A Mercedes-Benz a homologizációs autónál behúzható felső szárnylapot és kétállású első spoilert említ; az itteni lap mérete és szöge szemléltető, nem az 1992-es beállítás.",
        "A kép az autó középvonalától 238 mm-re vett metszet, az egész autó háromdimenziós szélcsatornájából kivágva. A szín azt mutatja, milyen gyorsan mozog a levegő felfelé (piros) vagy lefelé (kék), a menetsebesség arányában; a szürke tömör: a csomagtartófedél, a szárny és felállítva a lap.",
        "A narancssárga nyíl a szaggatott keretben lévő levegő átlagos iránya, a modell 48 darab 28 mm-es cellája fölött. A lap felállítása kb. 13°-kal billenti felfelé; egy durvább, 40 mm-es rácson, ahol a keretbe 12 cella jut, kb. 8°-kal. Mindkét rács szerint felfelé billen. Az előtte és utána mért szög attól függ, hol van a keret, ezért csak a változást adjuk meg.",
        "Az egész autó modelljében a felállított lap 200 km/h-nál kb. 34 kg-mal növeli a hátsó tengely terhelését (a két rácson 25–43 kg), a légellenállás teljesítményigénye pedig kb. 9 kW-tal nő (4–14 kW); az első tengely terhelése alig változik. A nagyobb hátsó terhelés tapadás és stabilitás a gyors kanyarokban, a légellenállás sebességvesztés az egyeneseken.",
        "A modell az Evo II egy játékhoz készült hálója, 28 mm-es kockákkal kitöltve: az autó fele, a középvonalon tükörrel, mozgó úttal, álló kerekekkel és a valódi autóénál kb. 300-szor kisebb Reynolds-számmal. A két beállítás közötti változást olvassa, ne az értékeket.",
      ],
    },
    {
      label: "Első légterelő",
      prompt: "A lökhárító alatti lemez előretolható. Kövesse a két útvonalat: az egyik felmegy az orr fölé, a másik az autó alá fut. Tolja előre a lemezt: mi van most fölötte, és mi alatta?",
      answer: "Fölötte a lökhárítónak torlódó lassú levegő (kék), alatta a már gyorsan az autó alá áramló levegő (sárga). Előretolva a lemez benyúlik a lassú levegő alá, és előbb osztja ketté az áramlást. A lassú levegő nagyobb nyomással nyom, mint a gyors: így terheli meg a légterelő lemez az orrot; ez a modell a levegő mintázatát mutatja, nem ennek az erőnek a nagyságát.",
      more: "A szélcsatorna részletei",
      params: {
        label: "Első légterelő lemez · metszet az orron át",
        cases: [
          { label: "Lemez behúzva", say: "Behúzva: az elülső éle egy síkban van a lökhárítóval (narancssárga jel). A levegő lassan torlódik a lökhárító homlokfelületén (kék); a lemez alatt felgyorsul, és az úttal együtt az autó alá fut." },
          { label: "Lemez előretolva", say: "Előretolva: a lemez 4 cm-rel túlnyúlik a jelen, a lökhárítónak torlódó lassú levegő alá, miközben alatta a levegő már gyors." },
        ],
      },
      talk: [
        "A Mercedes-Benz kétállású első spoilert említ az Evolution II-nél. A lemez 4 cm-es útja és 25 mm-es vastagsága itt szemléltető.",
        "A kép metszet az orron át az autó középvonalában, előre kiszámítva két dimenzióban, mintha az orr végtelenül széles volna. A szín a levegő sebessége a menetsebességhez képest; a szürke a karosszéria és a lemez. Az út a kocsi sebességével mozog, és magával viszi az autó alatti levegőt.",
        "Terhelést nem adunk meg. A modell nyomásmérő pontjai behúzott lemeznél a lemez előtt vannak, így nem hasonlíthatják össze a két beállításban rá ható erőt, és ebben a rövid, kétdimenziós szélcsatornában a nyomásszint vándorol. A méréséhez az autó hosszabb metszete és más szélcsatorna-peremfeltételek kellenének.",
        "A kétdimenziós metszetben a levegő nem kerülheti meg oldalt a lökhárítót, és a Reynolds-szám a valódi autóénak kb. ezredrésze.",
      ],
    },
    {
      label: "Első kerékív",
      prompt: "Felülről, kerékagy-magasságban: a lökhárító sarka, az első gumi a kiszélesített kerékívben, mögötte az ajtó. Koppintson a Kövesse a levegőt gombra: a kék vonal az átlagos áramlás útvonala, a levegő átlagos útja az autó elől.",
      answer: "Az autó középvonalától 78 cm-re indul, a gumival egy vonalban, és az autó eleje a sarkánál kifelé fordítja. Vissza már nem tér: a tengely mögött 60 cm-re húzott szaggatott vonalnál kb. 37 cm-rel kijjebb halad, jócskán az ajtó mellett. A kerékív mögött az oldalfal mentén a levegő lassabban mozog (zöld és kék), mint kint a gyors áramlásban (piros).",
      more: "A szélcsatorna részletei",
      params: {
        label: "Az első sarok · felülről, kerékagy-magasságban",
        cases: [{ label: "Kiszélesített kerékív", say: "Az átlagos áramlásnak ez az útvonala a gumival egy vonalban indul, közvetlenül a lökhárító sarka előtt. Az autó eleje a sarkánál kb. 37 cm-rel kifelé fordítja, és ezt a vonalat az ajtó mellett is megtartja." }],
      },
      talk: [
        "Az Evolution II kerékíveit azért szélesítették ki, hogy szélesebb kerekek és gumik férjenek a karosszéria alá, és a karosszériacsomag többi részével együtt formálták őket a szélcsatornában.",
        "A kép vízszintes metszet kerékagy-magasságban az első sarok előre kiszámított, háromdimenziós szélcsatornájából, ugyanabból a játékhálóból, mint a hátsó szárnyé. A szín a levegő sebessége a menetsebességhez képest; a szürke tömör, a karosszéria és a gumi metszete. A kék vonal az időátlagolt áramlást követi ebben a vízszintes metszetben; egy-egy levegőcsomag a turbulenciával ide-oda kanyarog körülötte.",
        "A gumi áll a kimetszett kerékjáratában, 48 mm-rel a mozgó út fölött; a karosszéria 1 m magasan egyenesre van vágva, és az autó fele a középvonalon tükrözve. Egyetlen, 24 mm-es cellájú rácson számoltuk: öt átáramlási idő alatt a kifelé tolódás 36,7 és 37,7 cm között marad. Finomabb rácson nem futott, ezért a szám kerekített.",
        "Itt nincs második kerékív az összehasonlításhoz. A háló szélesítése már egy centiméteren belül van a gumi külső oldalához, így keskenyebb ív nem takarná a gumit: a tanulság az, merre megy a levegő. Itt semmi sem választja szét a szélesítés hatását a lökhárító sarkáétól és a gumiétól.",
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
  note: "Az utcai Evolution II karosszériacsomagját – első spoilert, széles kerékíveket, küszöbborításokat és állítható hátsó szárnyat – a szélcsatornában egyetlen rendszerként formálták: légellenállási tényezője kb. 0,29 lett a 2.3-16 0,32-jével szemben, nagy sebességnél jóval kisebb felhajtóerővel, és 235 LE-vel kb. 250 km/h-t ért el. A múzeum versenyautóját leszorítóerőre állították be.",
  unverified: [
    "A versenyautó teljesítménye és beállítása",
    "A jármű körvonala és a légterelő-metszet orra: a megállóhely fotójáról (oldalnézet) átrajzolva az illesztett kamerán át, kb. ±10 cm",
    "A hátsó szárny közelképe: metszet az egész autó háromdimenziós szélcsatornájából (28 mm-es kockákkal kitöltött játékháló, az autó fele tükrözve, sík padló, álló kerekek, Reynolds-szám kb. 3 × 10⁴ a 10⁷ helyett); a lap mérete és szöge szemléltető, nem az 1992-es beállítás; a változás iránya a 40 mm-es rácson is megismétlődik, a nagysága nem",
    "Az első légterelő közelképe: kétdimenziós metszet az orron át (rácsos Boltzmann-módszer, Reynolds-szám 10⁴ 1 m-re vonatkoztatva az autó kb. 10⁷-ével szemben), mozgó úttal; a lemez 40 mm-es útja és 25 mm-es vastagsága szemléltető; csak az áramlás mintázatát mutatja, a lemezre ható terhelést nem",
    "Az első kerékív közelképe: az első sarok helyi háromdimenziós szélcsatornája a játékhálóból (a karosszéria 1 m-en egyenesre vágva, a kerékjárat kimetszve a gumi körül, a gumi állva, 48 mm-rel a mozgó út fölött, az autó fele tükrözve), Reynolds-szám 10⁴ a gumi átmérőjére",
    "Versenymotor: hajtórúdhossz, hengertávolság, a blokk dőlése és helyzete az autóban; karburátoros szívóoldallal ábrázolva",
    "Terem: Legenda 7",
  ],
};
