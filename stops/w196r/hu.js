// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Burkolt vagy szabad kerekek",
  name: "Mercedes-Benz W 196 R áramvonalas",
  summary: "A Forma–1-es autó, amely két karosszériával készült: burkolt kerekekkel a gyors pályákra, szabad kerekekkel a kanyargósakra.",
  eyebrow: "Mercedes-Benz W 196 R áramvonalas versenyautó, 1955",
  lede: "A Mercedes két karosszériát tervezett 1954-es Grand Prix-autójához. A kerekek burkolata a hosszú egyeneseken csökkenti a légellenállást; a szabad kerék könnyebb, és a kanyarokban a versenyző pontosabban helyezheti az autót. Váltson a karosszériák között, és figyelje a levegőt az első kerék mögött.",
  photo: { alt: "Ezüst, burkolt kerekű, 18-as rajtszámú, 1955-ös Mercedes-Benz W 196 R áramvonalas versenyautó a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      label: "Első kerék",
      prompt: "Felülről, kerékagy-magasságban: az első gumi, mellette a karosszéria, és egy szaggatott vonal a kerék mögötti levegőn át. Váltson a karosszériák között: mi történik a levegővel közvetlenül a kerék mögött?",
      answer: "A szabad gumi mögött egy keréknyi széles foltban a levegő sebességének mintegy felét elveszíti: lassú, felkavart levegő húzódik utána. Burkolt kerékkel ez a folt a karosszérián belülre esik: a gumi felkavart levegője a kerékjáratban marad, kívül pedig a levegő a sima bőr mentén áramlik. Az áramvonalas szélesebb, mégsem mutat csupasz kereket a levegőnek: ez volt az előnye Reims és Monza gyors egyenesein. A kanyarokban a versenyzői megfizették az árát, mert nem látták az első kerekeket, hogy pontosan helyezzék őket.",
      more: "A szélcsatorna részletei",
      params: {
        label: "Az első sarok · felülről, kerékagy-magasságban",
        cases: [
          { label: "Burkolt", say: "Burkolt: a gumi a saját kerékjáratában forog, a levegő a sima karosszéria mentén áramlik. A kerék mögötti folt a karosszérián belül van." },
          { label: "Szabad", say: "Szabad: a levegő a csupasz gumiba ütközik, és mögötte lassú levegőből álló sávot hagy, kicsit szélesebbet magánál a guminál." },
        ],
      },
      talk: [
        "Az 1954-es új, 2,5 literes Forma–1-re a Mercedes kezdettől két karosszériát tervezett: ezt az áramvonalasat a nagyon gyors pályákra, és egy klasszikust szabad kerekekkel.",
        "Első versenyén győzött, Reimsben, 1954. július 4-én: Fangio Kling előtt. Két héttel később a szűk silverstone-i pályán a versenyzők nem tudták pontosan helyezni a burkolt első kerekeket a kanyarokban, és csak 4. és 7. lettek.",
        "1955-ben az áramvonalas csak egyszer versenyzett, Monzában, az új, meredek döntött kanyarokkal, ahol Fangio nyert. Az M 196 motor, közvetlen befecskendezéses, deszmodromikus szelepvezérlésű soros nyolchengeres, ekkor már 290 LE-t adott 8500/perc fordulaton.",
        "A kép vízszintes metszet kerékagy-magasságban az első sarok előre kiszámított, háromdimenziós szélcsatornájából. A szín a levegő sebessége a menetsebességhez képest; a szürke tömör, a karosszéria és a gumi metszete. Szabad kerékkel a narancssárga jel azt mutatja, hol mozog a levegő a gumi mögött 36 cm-re húzott szaggatott vonalon a menetsebesség 80%-ánál lassabban.",
        "Mindkét karosszériát ugyanazzal a gumival, úttal, sebességgel és útvonal-kezdőpontokkal számoltuk, 24 és 16 mm-es cellájú rácson. Mindkét rácson a szabad gumi mögötti foltban a levegő sebességének mintegy felét elveszíti (61 és 44%, öt átáramlási idő alatt egyenként néhány százalékponton belül állandó), és egy nagyobb szélcsatorna 4 százalékponttal változtat rajta. Hogy a burkolt karosszéria mellett gyorsabb vagy lassabb-e a levegő, nem állapodott meg: a ráccsal és a szélcsatorna méretével változik, ezért nem állítjuk. A gumi áll a mozgó út fölött (a forgó gumihoz finomabb modell kellene), a futómű lengőkarjai hiányoznak, a Reynolds-szám pedig a valódi autóénak kb. ezredrésze: a két karosszéria közötti különbséget olvassa, ne az értékeket.",
        "Egy különálló, egyenes pályás becslés feltételezett légellenállási tényezőkkel (burkolva 0,5, szabadon 0,7), homlokfelületekkel és tömegekkel ugyanazon 290 LE mellett kb. 20 km/h-val gyorsabbnak adja az áramvonalast. Egyik karosszériához sincs közölt végsebesség, így ez szemléltetés, nem adat.",
      ],
    },
    {
      label: "Motor",
      prompt: "Miért a főtengely közepéről hajtották meg a hátsó kerekeket? Változtassa a fordulatszámot, és vesse össze az elcsavarodást a végéről hajtott változattal.",
      answer: "Középről hajtva mindkét négyhengeres csoport csak a főtengely felét csavarja a kihajtó fogaskerékhez képest. Ebben a modellben a végéről hajtott tengely a fordulatszám-tartományon belül csavarási rezonanciába kerül, a középről hajtott nem. A Mercedes-Benz a rezgéseket nevezi meg e megoldás okaként.",
      more: "Motorvezérlés",
      params: { label: "M 196 soros nyolchengeres, 2,5 liter · hajtás a főtengely közepéről" },
      talk: [
        "Az M 196: nyolc henger 76 mm furattal és 68,8 mm lökettel, 2,5 liter, erősen oldalra fektetve, közvetlen befecskendezéssel és deszmodromikus szelepvezérléssel.",
        "Főtengelye két négyhengeres csoportból áll. A hajtás középen, a 4. és az 5. henger között egy fogaskeréken lép ki, majd a kardántengelyen át hátrafelé fut a hátsó tengelynél lévő sebességváltóhoz.",
        "A hosszú főtengely nehéz forgattyúkat hordozó torziós rugó. Minden munkaütem kissé elcsavarja; egy bizonyos fordulatszámon a lökések éppen a tengely saját lengésének ütemében érkeznek, és az elcsavarodás megnő: ez a rezonancia. A csillapítás alacsonyan tartja a csúcsot.",
        "A kiegyensúlyozott és az egyenletes két külön dolog: a nyolchengeres rázóerői kioltják egymást, a főtengelye mégis elcsavarodik. A merevség, a tehetetlenségi nyomatékok, a csillapítás és a gyújtási lüktetés itt szemléltető értékek, nem az M 196 adatai.",
      ],
    },
  ],
  note: "Az áramvonalas a szokásos 2350 mm-es tengelytávval futott; egy 2210 mm-es változatot 1955-ben Monzában kipróbáltak, de nem versenyeztették. Fangio mindkét idényben világbajnok lett.",
  unverified: [
    "A műszaki adatok között szereplő különálló, egyenes pályás becslés légellenállási tényezői, homlokfelületei, tömegei és hajtáslánc-hatásfoka (végsebesség-adat nincs, így nem is hasonlítunk össze ilyet)",
    "A fotóillesztéshez használt nyomtávok, kerékméret és az orr helyzete (közelítő: a kerekek pontjai majdnem egy egyenesbe esnek)",
    "A jármű körvonala (a fotóról átrajzolva)",
    "Az első kerék közelképe: az első sarok helyi háromdimenziós szélcsatornája (az autó fele tükrözve, mozgó út, 340 mm sugarú, 150 mm széles gumi állva, 48 mm-rel az út fölött, a karosszéria formái a körvonalból és fotókból egyszerűsítve, a futómű elhagyva), Reynolds-szám 10⁴ a gumi átmérőjére a kb. 10⁷ helyett",
    "Motor: gyújtási sorrend, hajtórúdhossz, helyzet és az 53°-os dőlés; a főtengely-csavarási modell (merevség, tehetetlenségi nyomatékok, csillapítás, gyújtási lüktetés) szemléltető; az M 196-nak kritikus fordulatszámot nem tulajdonítunk",
    "Terem: Legenda 7",
  ],
};
