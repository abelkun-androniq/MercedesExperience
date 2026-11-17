// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "A 190-es karosszériája alatt",
  name: "Mercedes-Benz 190 E (W201)",
  summary: "Az ötlengőkaros hátsó tengely egy bukkanón és egy kátyún, és a forgó M102 négyhengeres.",
  eyebrow: "Mercedes-Benz 190 E (W201), 1984",
  lede: "Ugyanannak az autónak két szerkezete, mindkettő működés közben: az ötlengőkaros hátsó tengely egy bukkanón és egy kátyún, és a forgó M102 négyhengeres. Váltson a múzeumi fotóra, és a valódi autón, a helyükön is láthatja őket.",
  photo: { alt: "Fehér, 1984-es Mercedes-Benz 190 E a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      label: "Ötlengőkaros hátsó tengely",
      params: {
        label: "Bal hátsó kerék · 25 km/h, 5× lassítva",
        links: [{ name: "Kerékdőlés-rúd" }, { name: "Húzórúd" }, { name: "Tolórúd" }, { name: "Rugótartó lengőkar" }, { name: "Nyomtávrúd" }],
        legendTitle: "Az öt lengőkar",
      },
      talk: [
        "Öt rúd, mindegyik főként a saját tengelye mentén terhelve, vezeti a kerékhordozót. A 190-es volt az első sorozatautó ezzel a tengellyel, 1982-ben.",
        "Figyelje a narancssárga görbét. A bukkanón az abroncsterhelés kiugrik, a kátyúban nulla felé esik. A tapadás ebből a terhelésből származik, ezért a cél a lapos vonal.",
        "A karosszéria alig mozdul, miközben a kerék dolgozik. Ez a rugózott és a rugózatlan tömeg szétválasztása.",
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
    "Az M102 hajtórúdhossza és a blokk 15°-os dőlése",
    "A jármű körvonala",
  ],
};
