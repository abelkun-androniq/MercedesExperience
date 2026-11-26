// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Áram hidrogénből",
  name: "Mercedes-Benz NECAR 1",
  summary: "A Daimler-Benz első üzemanyagcellás járműve: egy furgon, amelynek teljes rakterét a hidrogénből és levegőből áramot és vizet előállító cellatömbök töltötték ki.",
  question: "Hogyan állít elő egy autó saját áramot hidrogénből?",
  eyebrow: "Mercedes-Benz NECAR 1, 1994",
  lede: "A NECAR a New Electric Car, azaz új villamos autó rövidítése. 1994-ben a Daimler-Benz egy MB 100 furgon rakterét töltötte meg tizenkét üzemanyagcella-tömbbel, egy hidrogéntartállyal, valamint a működtetésükhöz szükséges szivattyúkkal és kompresszorral. Halványítsa el a karosszériát, kérjen több teljesítményt a motortól, és kövesse a hidrogént és a levegőt a cellákba, az áramot a motorhoz, a vizet pedig ki az autó alá.",
  look: "Keresse a „Brennstoffzellen Elektrofahrzeug” (üzemanyagcellás villamos jármű) feliratot az oldalán és az ajtó mögé festett színes cellablokkot.",
  takeaway: "Az üzemanyagcella nem éget el semmit: a hidrogén és az oxigén csendben egyesül benne, és áram, hő meg víz lesz belőlük.",
  photo: { alt: "Fehér Mercedes-Benz MB 100 furgon „Brennstoffzellen Elektrofahrzeug” felirattal és festett cellablokkal, megvilágított talapzaton a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      label: "Üzemanyagcellák",
      prompt: "Növelje a motor igényét kevésről a lehető legtöbbre. Mi történik a cellák feszültségével és a hidrogénfogyasztással?",
      answer: "A cellák feszültsége esik, terhelés nélkül közel 1 voltról teljes teljesítménynél nagyjából a felére, a hidrogénfogyasztás pedig az árammal együtt nő. Így az utolsó kilowattok kerülnek a legtöbb hidrogénbe, és a kompresszor része is nő: a cellatömbök mintegy 50 kW-jából csak kb. 30 kW jut a motorhoz.",
      params: { label: "Be hidrogén és levegő; ki áram és víz" },
      talk: [
        "Minden cella vékony szendvics: egy műanyag membrán egyik oldalán hidrogén, a másikon levegő. Egy katalizátor szétbontja a hidrogént; protonjai átjutnak a membránon, elektronjai nem, ezért a motoron át kell megkerülniük. A túloldalon a levegő oxigénjével találkoznak, és víz lesz belőlük.",
        "Egy cella terhelés nélkül körülbelül egy voltot ad, terhelve kevesebbet. Sok száz sorba kötött cella tizenkét tömbbe rendezve kb. 50 kW-ot adott a NECAR 1-nek.",
        "Ennek nagy része magát a rendszert működtette, főleg a kompresszort, amely levegőt fúj át a cellákon: a furgon villanymotorja 30 kW-os volt.",
        "A berendezés kitöltötte a rakteret, két ülés maradt. Két évvel később a NECAR 2 már hat embert vitt egy V-osztályban; a mai üzemanyagcellás járművekben minden elfér a padló alatt.",
      ],
    },
  ],
  note: "A tizenkét, mintegy 50 kW-os cellatömb és a 30 kW-os motor a Daimler adata. A cellák száma, mérete és feszültséggörbéje, a kompresszor része és a furgonbeli elrendezés szemléltető.",
  unverified: [
    "A cellák száma, felülete és a feszültséggörbe",
    "A cellatömbök teljesítményéből a kompresszorra és szivattyúkra jutó rész",
    "A tartály, a cellatömbök és a motor elrendezése a furgonban",
    "Az MB 100 tengelytávja, nyomtávja, kerékmérete és körvonala (vázolt)",
    "Terem: a múzeumban fényképezték (Mercedes-archívum, 2025-ös látogatás); a termet nem nevezik meg",
  ],
};
