// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Zárról zárra",
  name: "Mercedes-Benz 300 GD „Otto”",
  summary: "A G-osztály, amellyel Gunther Holtorf 26 évig járta a világot: kézzel kapcsolható összkerékhajtás, elöl és hátul differenciálzár.",
  eyebrow: "Mercedes-Benz 300 GD, 1988",
  lede: "A nyitott differenciálmű mindig egyforma nyomatékot küld mindkét oldalra, így a jégen álló kerék a párját is korlátozza. A G-osztály összekapcsolhatja tengelyeit, majd mindkét differenciálművet zárhatja. Tegyen két kereket jégre, és kapcsoljon be egyenként egy-egy zárat, amíg az autó fel nem kapaszkodik.",
  photo: { caption: "A múzeum 2019–20-as G-osztály kiállításán fotózva", alt: "Gunther Holtorf kék, világkörüli Mercedes-Benz 300 GD-je, „Otto”, tetőcsomagtartóval és ládákkal, jobbról elölről nézve" },
  components: [
    {
      label: "Összkerékhajtás és zárak",
      params: {
        label: "Kapaszkodás emelkedőn, felülről",
        surfaces: [{ label: "Száraz út" }, { label: "Egy hátsó kerék jégen" }, { label: "Két átlós kerék jégen" }, { label: "Három kerék jégen" }],
        cases: [{ label: "Hátsókerék-hajtás" }, { label: "Összkerékhajtás bekapcsolva" }, { label: "+ hátsó zár" }, { label: "+ első zár" }],
      },
      real: {
        alt: "Felvágott ZF Multitrac tengelyhajtómű egy szakkiállításon: kúpkerekek a tányérkerékben, mellettük lamellacsomag",
        caption: "Felvágott tengelyhajtómű (ZF Multitrac, Bauma szakkiállítás, 2004). A differenciálmű kúpkerekei a tányérkerékben ülnek; a mellettük lévő lamellacsomag össze tudja zárni a két oldalt.",
      },
      talk: [
        "A nyitott differenciálmű kanyarban különböző sebességgel engedi forogni egy tengely kerekeit, de a nyomatékot mindig egyenlően osztja meg. A legkevésbé tapadó kerék szabja meg a határt mindkettőnek.",
        "Ezen a W 460-ason a vezető kézzel kapcsolja be az első tengelyt. Ez mereven összeköti az első és a hátsó kardántengelyt, mint egy zárt középső differenciálmű: a jégen álló kerekű tengely többé nem fosztja meg a másikat.",
        "Ezután mindkét tengely differenciálműve zárható, előbb a hátsó, aztán az első: a zárt tengely egyetlen tengelyként forog, és minden kerék annyira tol, amennyire saját tapadása engedi. Minden zárral egyetlen száraz talajon álló kerék is mozgatja az autót.",
        "Gunther Holtorf 1989 és 2014 között Afrikán, Ázsián és Amerikán át vezette ezt a 300 GD-t, „Ottót”, csaknem 900 000 km-en. A későbbi G-osztály (W 463, 1990-től) állandó összkerékhajtású, három zárható differenciálművel.",
      ],
    },
  ],
  note: "A zárt tengelyek nehezen kormányozhatók, és szilárd talajon koptatják a gumikat: a zárak csak laza vagy csúszós talajra valók.",
  unverified: [
    "A kerékterhelések, a hajtóerő, az emelkedő ellenállása és a tapadási értékek",
    "A differenciálzárak ezen az autón",
    "Hogy Otto ki van-e állítva (a fotó a 2019–20-as „40 éves a G-osztály” kiállításon készült)",
    "A jármű körvonala (az adatlap méreteiből vázolva, még nem a fotóról átrajzolva)",
    "Terem: Gyűjtemény 3",
  ],
};
