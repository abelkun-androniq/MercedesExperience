// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "A 190-es karosszériája alatt",
  name: "Mercedes-Benz 190 E (W201) „Baby-Benz”",
  summary: "Az ötlengőkaros hátsó tengely egy bukkanón és egy kátyún, összevetve egy merev és egy lengőtengellyel, és a forgó M102 négyhengeres.",
  eyebrow: "Mercedes-Benz 190 E (W201), 1984",
  lede: "Ugyanannak az autónak két szerkezete, mindkettő működés közben: az ötlengőkaros hátsó tengely egy bukkanón és egy kátyún, majd az általa leváltott egyszerűbb tengelyek mellett, és a forgó M102 négyhengeres. Görgessen tovább: a múzeumi fotón a tengelyt a valódi autón, a helyén is láthatja.",
  photo: { alt: "Fehér, 1984-es Mercedes-Benz 190 E a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      label: "Ötlengőkaros hátsó tengely",
      params: {
        label: "Bal hátsó kerék · 25 km/h, 5× lassítva",
        links: [{ name: "Kerékdőlés-rúd" }, { name: "Húzórúd" }, { name: "Tolórúd" }, { name: "Rugótartó lengőkar" }, { name: "Nyomtávrúd" }],
        legendTitle: "Az öt lengőkar",
      },
      real: {
        alt: "Komplett többlengőkaros hátsó futómű fékekkel egy kiállítási állványon: vékony fekete lengőkarok futnak a segédvázból a kerékhordozókhoz",
        caption: "Modern ötlengőkaros hátsó tengely, autó nélkül (Toyota Supra, 2019): külön vékony lengőkarok tartják a kerékhordozókat. Az 1982-es 190 volt az első sorozatautó ilyen tengellyel.",
      },
      talk: [
        "Öt rúd, mindegyik főként a saját tengelye mentén terhelve, vezeti a kerékhordozót. A 190-es volt az első sorozatautó ezzel a tengellyel, 1982-ben.",
        "Figyelje a narancssárga görbét. A bukkanón az abroncsterhelés kiugrik, a kátyúban nulla felé esik. A tapadás ebből a terhelésből származik, ezért a cél a lapos vonal.",
        "A karosszéria alig mozdul, miközben a kerék dolgozik. Ez a rugózott és a rugózatlan tömeg szétválasztása.",
      ],
    },
    {
      label: "Miért számít a tengely?",
      prompt: "Figyelje a kék vonalakat, a kerekek síkját, a szürke függőlegesekhez képest. Melyik tengely tartja egyenesen és a nyomvonalukon a kerekeit egy bukkanón és egy kanyarban?",
      answer: "Egyszerű tengely egyiket sem tudja egyszerre. A merev tengely kanyarban egyenesen tartja a kerekeket, de ha az egyik bukkanóra fut, mindkettőt megdönti; a lengőtengely egyedül viszi át a bukkanón a kereket, de megdönti és oldalra húzza a gumiját, éles kanyarban pedig megemeli a karosszériát és bebillenti a kerekeit. Az ötlengőkaros tengely mindkét kereket közel függőlegesen és a nyomvonalán tartja, a külső kereket pedig kissé befelé fordítja: ezért kapott ilyet a 190-es.",
      params: { label: "A hátsó tengely hátulról · 30 km/h a hepehupás úton, 4× lassítva" },
      talk: [
        "A felfüggesztésnek két, egymásnak feszülő feladata van: nyugodtan tartani a karosszériát, és minden gumit laposan az útra szorítani, minél kevésbé megdőlve és a nyomvonalán maradva. A tapadás ebből a felfekvő felületből származik.",
        "Az egyszerű tengelyek az egyikben elbuknak. A merev tengely összeköti a két kereket; a lengőtengely, a Mercedes hátsó tengelye 1931-től az 1960-as évekig, a féltengelyével együtt dönti a kereket és oldalra húzza a gumit, éles kanyarban pedig be is billentheti a kerekeit.",
        "Az ötlengőkaros tengely minden keréknek saját, gondosan megválasztott pályát ad: öt rúd, mindegyik oda téve, ahová a mérnökök a kereket vezetni akarták. Az 1982-es 190-es volt az első sorozatautó ilyennel.",
        "A többit a rugók és a lengéscsillapítók döntik el: puha rugó a kényelemért, kemény a dőlés ellen; a csillapítás épp annyira erős, hogy megállítsa a pattogást.",
      ],
    },
    {
      label: "M102 motor",
      params: { label: "Négyütemű körfolyamat · gyújtási sorrend 1-3-4-2" },
      talk: [
        "A 190 E 2,0 literes M102-ese: négy henger sorban, egy felül fekvő vezérműtengely, az 1. henger elöl.",
        "Az 1-3-4-2 gyújtási sorrend 180 fokonként ad munkaütemet, ami egyenletesen tartja a főtengely nyomatékát. Figyelje, ahogy a narancssárga villanások végigvándorolnak a blokkon.",
        "A blokk jobbra dől, hogy beférjen a 190-es alacsony motorháztetője alá.",
      ],
    },
  ],
  note: "A geometria szemléltető: a lengőkarok csuklópontjai, a motor méretei és a felfüggesztés merevségei valószerű értékek, nem gyári adatok.",
  unverified: [
    "A felfüggesztés összes csuklópontja, valamint a rugók, a lengéscsillapítók és az abroncsok merevsége",
    "A tengelyek összevetése: a lengő- és a merev tengely elrendezése, a rugózatlan tömegek, a súlypont, a stabilizátor, az oldalerő okozta összetartás és a megdőlő kerék keskenyedő felfekvése",
    "Az M102 hajtórúdhossza és a blokk 15°-os dőlése",
    "A jármű körvonala",
  ],
};
