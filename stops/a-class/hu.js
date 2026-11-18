// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "A motor alácsúszik",
  name: "Mercedes-Benz A-osztály",
  summary: "Rövid autó hosszú gyűrődési úttal: szendvicspadlója frontális ütközéskor az utasok alá engedi csúszni a motort.",
  eyebrow: "Mercedes-Benz A 160, 1997",
  lede: "Az A-osztály alig 3,6 méter hosszú, kevés hely marad gyűrődő zónának. Ezért padlója kettős, a motor és a váltó részben alatta, megdöntve ül. Ütköztesse, és figyelje, ahogy a motor lecsúszik a cella alá ahelyett, hogy belenyomódna.",
  photo: { alt: "Ezüst, 1998-as Mercedes-Benz A 160 a Mercedes-Benz Múzeumban, jobbról elölről, felülről nézve" },
  components: [
    {
      label: "Szendvicspadló",
      params: { label: "Frontális ütközés merev falnak", cases: [{ label: "A motor a padló alá csúszik" }, { label: "A motor a cellába nyomódik" }] },
      talk: [
        "Egy rövid autó eleje is rövid, és a rövid gyűrődő zóna hirtelen állítja meg az autót. Az A-osztály válasza a kétrétegű padló: az utasok magasan, a tetején ülnek, a motor és a váltó pedig mélyen, előre dőlve, előttük és részben alattuk.",
        "Erős frontális ütközéskor a motorblokk nem nyomható össze. Hagyományos elrendezésnél egyenesen hátratolódik a tűzfalnak és a lábtérbe.",
        "Itt egy ferde vezetőfelületnek ütközik, lecsúszik és a padló alá kerül, így az eleje teljes hosszában tovább gyűrődhet, a cella pedig ép marad.",
        "A magas ülés az utasokat egy oldalról nekik ütköző autó vonala fölé is emeli.",
      ],
    },
  ],
  note: "Egyetlen tömeg gyűrődő elejével: a motor útját az elv kedvéért rajzoltuk, nem a Mercedes-Benz töréstesztjeiből vettük.",
  unverified: [
    "A motorblokk mérete, helyzete és a lejtő, amelyen lecsúszik",
    "Az ütközési erők, a gyűrődési hosszak és a cella merevsége",
    "A jármű körvonala (az adatlap méreteiből vázolva, még nem a fotóról átrajzolva)",
    "Terem: Legenda 6",
  ],
};
