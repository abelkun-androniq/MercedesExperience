// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Az SSK bekapcsolható kompresszora",
  name: "Mercedes-Benz SSK",
  summary: "7,1 literes soros hathengeres Roots-kompresszorral, amely csak akkor kapcsol be, ha a vezető padlóig nyomja a pedált.",
  eyebrow: "Mercedes-Benz 27/170/225 PS Typ SSK, 1928",
  lede: "A rövid alvázas Super Sport működés közben: a kompresszor, amely csak padlógáznál kapcsolódik be, és a nagy hathengeres motor, amelyet táplál.",
  photo: { alt: "Fehér, 1928-as Mercedes-Benz SSK a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      label: "Kompresszor",
      params: { engineLabel: "7,1 literes soros hathengeres" },
      talk: [
        "Az SSK jelentése Super Sport Kurz, vagyis rövid alvázas Super Sport. Teljes neve a teljesítményt adja meg: 27 adó-lóerő, 170 LE magában és 225 LE működő kompresszorral.",
        "A kompresszor nem mindig jár. A vezető padlóig nyomja a pedált, aztán még egy kicsit tovább; ekkor a főtengely orrán ülő tengelykapcsoló bekapcsolja a kompresszort. Ha felengedi, újra kiold. Rövid nekiiramodásokra szánták.",
        "A kompresszor levegőt nyom át a porlasztón, nem keveréket szív át magán; ugyanez az elrendezés jelent meg néhány évvel később az 540 K-ban. Figyelje, ahogy a levegő színe megváltozik, amikor a tengelykapcsoló zár.",
      ],
    },
    {
      label: "Hathengeres motor",
      params: { label: "Négyütemű körfolyamat · gyújtási sorrend 1-5-3-6-2-4" },
      talk: [
        "Hat henger sorban, mindegyik 100 mm furattal és 150 mm lökettel: 7,1 liter, egy felül fekvő vezérműtengellyel.",
        "Az 1-5-3-6-2-4 gyújtási sorrend 120 fokonként ad munkaütemet, felváltva a motor első és hátsó felében. Figyelje a narancssárga villanásokat.",
        "Ez volt az utolsó Mercedes, amelyet Ferdinand Porsche irányításával terveztek, mielőtt elhagyta a céget, és Rudolf Caracciola versenyzett vele.",
      ],
    },
  ],
  note: "A geometria szemléltető: a kompresszor elrendezése, áttétele, a töltőnyomás, a hajtórúdhossz és a hengertávolság valószerű értékek, nem gyári adatok.",
  unverified: [
    "A kompresszor elrendezése, 2,6-es áttétele és 0,45 bar töltőnyomása",
    "Hajtórúdhossz és hengertávolság",
    "A jármű körvonala (a fotóról átrajzolva)",
    "Terem és szint",
  ],
};
