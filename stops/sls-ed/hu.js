// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Kormányzás a motorokkal",
  name: "Mercedes-Benz SLS AMG Coupé Electric Drive",
  summary: "Négy villanymotor, kerekenként egy: a külső kerekeket erősebben hajthatják, mint a belsőket, és így segítenek befordítani az autót.",
  question: "Kormányozhat-e egy autó a motorjaival?",
  eyebrow: "Mercedes-Benz SLS AMG Coupé Electric Drive, 2013",
  lede: "A sirályszárnyas SLS, V8-as motor helyett négy villanymotorral, kerekenként eggyel, és akkumulátorral a középalagútban. Mivel minden keréknek saját motorja van, kanyarban a külső kerekeket erősebben hajthatja, mint a belsőket. Tartsa az ívet, és tolja kifelé a hajtást, aztán kövesse az energiát az akkumulátortól a kerekekig, fékezéskor pedig vissza.",
  look: "Keresse a kék „Electric Drive” feliratot az ajtón és a kékes hűtőrácsot: kívülről csak ezek árulják el, hogy a hosszú motorháztető alatt nincs benzinmotor.",
  takeaway: "Kerekenkénti motorral a szoftver olyat tud, amit egy differenciálmű nem: minden keréknek saját tolóerőt ad, és fékezéskor visszanyeri az energiát.",
  photo: { alt: "Fehér Mercedes-Benz SLS AMG Coupé Electric Drive kék felirattal az ajtaján a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      label: "Nyomatékvektorálás",
      prompt: "Az autó 50 km/h-val halad egy 50 m-es íven. Vigye át a hajtást a belső kerekekről a külsőkre. Mi történik az első kerekek szükséges kormányszögével?",
      answer: "Csökken: ebben a modellben kb. 3,5°-ról 2° alá. A külső kerekek többlet-tolóereje befordítja az autót a kanyarba, így az első gumiknak kevesebbet kell fordítaniuk. Vigye a hajtást a másik irányba, és az autónak több kormányzás kell, mint korábban.",
      params: { label: "Állandó balkanyar felülről" },
      talk: [
        "Minden keréknek saját motorja van: négy szinkronmotor, együtt 552 kW és 1000 N·m, tengelyenként kettő, saját sebességváltón át. A kerekek között nincs differenciálmű.",
        "Kanyarban a vezérlés hagyhatja, hogy a külső kerekek erősebben, a belsők gyengébben toljanak, akár fékezzenek is. A tolóerők különbsége befordítja az autót, mint amikor a kenu egyik oldalán erősebben evezünk.",
        "A Mercedes ezt AMG Torque Dynamicsnak nevezte. Az első gumiknak kevesebb kormányzás és kevesebb oldaltapadás kell, így több marad magára a kanyarra.",
        "A különbségnek a gumik tapadásán belül kell maradnia: ha egy kerék túl erősen tol, kipörög. Ez a modell a gumikat szelíd, lineáris tartományukban tartja.",
      ],
    },
    {
      label: "Az akkumulátortól a kerekekig és vissza",
      prompt: "Fékezzen enyhén, aztán erősen. Hová lesz az autó mozgási energiája egyik, illetve másik esetben?",
      answer: "Enyhe fékezéskor mind visszakerül az akkumulátorba: a motorok generátorként dolgoznak, a súrlódó fékek hidegek maradnak. Erős fékezéskor az akkumulátor nem tud ilyen gyorsan energiát felvenni; a motorok annyit adnak neki, amennyit elfogad, a többit a féktárcsák alakítják hővé.",
      params: { label: "Teljesítmény az akkumulátor és a kerekek között" },
      talk: [
        "Az akkumulátor 60 kWh-t tárol 400 volton: 12 modul, egyenként 72 lítiumion-cellával, összesen 548 kg, abban az alagútban, amelyben a kardántengely futna, és az ülések mögött.",
        "Menet közben az áram az akkumulátorból a négy motorhoz folyik; az energia egy része útközben hővé válik.",
        "Fékezéskor a motorok generátorrá válnak: a kerekek hajtják őket, és az áram visszafolyik az akkumulátorba. Ez az energia különben a féktárcsákat melegítené.",
        "Az akkumulátor és a motorok egyszerre csak korlátozott teljesítményt tudnak felvenni. Erős fékezésnél a munka nagy részét továbbra is a súrlódó fékek végzik.",
      ],
    },
  ],
  note: "A teljesítmény-, nyomaték- és akkumulátoradatok a Mercedestől származnak. A kanyar, az autó súlyeloszlása, a gumik merevsége, a veszteségek és a visszatáplálás határa kerek számok, az elv bemutatására választva.",
  unverified: [
    "A súlyeloszlás, a gumik oldalmerevsége és a légellenállási felület",
    "A hajtás és a visszatáplálás hatásfoka, a visszatáplálás határa (150 kW az akkumulátornál)",
    "Az akkumulátor és a motorok helye (vázlatos)",
    "A jármű körvonala (az SLS megállóéval azonos, vázolt)",
  ],
};
